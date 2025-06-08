// Amazon PA-API プロキシサーバー（本番環境用）
// APIキーをクライアントに公開せずにAmazon APIを呼び出し

const crypto = require('crypto');

class AmazonProxyServer {
    constructor() {
        // 環境変数からAPIキーを取得（Netlify/Vercel等で設定）
        this.config = {
            accessKey: process.env.AMAZON_ACCESS_KEY,
            secretKey: process.env.AMAZON_SECRET_KEY,
            associateTag: process.env.AMAZON_ASSOCIATE_TAG,
            endpoint: 'webservices.amazon.co.jp',
            region: 'us-west-2',
            marketplace: 'www.amazon.co.jp'
        };
        
        this.validateConfig();
    }

    validateConfig() {
        const required = ['accessKey', 'secretKey', 'associateTag'];
        const missing = required.filter(key => !this.config[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing Amazon API environment variables: ${missing.join(', ')}`);
        }
        
        console.log('✅ Amazon API環境変数確認完了');
    }

    // AWS署名 v4 生成
    async generateAWSSignature(method, path, queryString, payload) {
        const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
        const date = timestamp.substr(0, 8);
        
        // 正規化リクエスト
        const canonicalRequest = [
            method,
            path,
            queryString,
            `host:${this.config.endpoint}`,
            'x-amz-date:' + timestamp,
            '',
            'host;x-amz-date',
            this.sha256Hash(payload)
        ].join('\n');

        // 署名文字列
        const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
        const stringToSign = [
            'AWS4-HMAC-SHA256',
            timestamp,
            scope,
            this.sha256Hash(canonicalRequest)
        ].join('\n');

        // 署名キー生成
        const kDate = this.hmac(`AWS4${this.config.secretKey}`, date);
        const kRegion = this.hmac(kDate, this.config.region);
        const kService = this.hmac(kRegion, 'ProductAdvertisingAPI');
        const kSigning = this.hmac(kService, 'aws4_request');

        // 最終署名
        const signature = this.hmac(kSigning, stringToSign).toString('hex');
        
        return { timestamp, signature };
    }

    sha256Hash(message) {
        return crypto.createHash('sha256').update(message).digest('hex');
    }

    hmac(key, message) {
        return crypto.createHmac('sha256', key).update(message).digest();
    }

    // Amazon PA-API呼び出し
    async getItems(asinList) {
        try {
            console.log(`🛒 Amazon API Proxy呼び出し: ${asinList.length}商品`);
            
            const requestPayload = {
                ItemIds: asinList,
                Resources: [
                    'Images.Primary.Large',
                    'Images.Primary.Medium', 
                    'ItemInfo.Title',
                    'ItemInfo.ByLineInfo',
                    'ItemInfo.ProductInfo',
                    'Offers.Listings.Price',
                    'Offers.Listings.DeliveryInfo',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count'
                ],
                PartnerTag: this.config.associateTag,
                PartnerType: 'Associates',
                Marketplace: this.config.marketplace
            };

            const path = '/paapi5/getitems';
            const payload = JSON.stringify(requestPayload);
            const { timestamp, signature } = await this.generateAWSSignature(
                'POST', path, '', payload
            );

            const date = timestamp.substr(0, 8);
            const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
            
            const authHeader = [
                'AWS4-HMAC-SHA256',
                `Credential=${this.config.accessKey}/${scope}`,
                'SignedHeaders=host;x-amz-date',
                `Signature=${signature}`
            ].join(' ');

            const response = await fetch(`https://${this.config.endpoint}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Host': this.config.endpoint,
                    'X-Amz-Date': timestamp,
                    'Authorization': authHeader
                },
                body: payload
            });

            if (!response.ok) {
                throw new Error(`Amazon API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // クライアント用にデータを整形
            const results = this.processAPIResponse(data);
            
            console.log(`✅ Amazon商品情報取得完了: ${Object.keys(results).length}商品`);
            return results;

        } catch (error) {
            console.error('💥 Amazon API Proxy エラー:', error);
            throw error;
        }
    }

    // APIレスポンス処理
    processAPIResponse(data) {
        const results = {};
        
        if (data.ItemsResult && data.ItemsResult.Items) {
            for (const item of data.ItemsResult.Items) {
                results[item.ASIN] = this.processItemData(item);
            }
        }

        if (data.Errors) {
            console.warn('⚠️ Amazon API エラー:', data.Errors);
        }

        return results;
    }

    // 商品データ整形
    processItemData(item) {
        try {
            const result = {
                asin: item.ASIN,
                title: item.ItemInfo?.Title?.DisplayValue || '商品名取得不可',
                brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || '',
                price: null,
                originalPrice: null,
                currency: 'JPY',
                availability: '在庫確認中',
                rating: null,
                reviewCount: null,
                images: {
                    large: null,
                    medium: null
                },
                url: `https://www.amazon.co.jp/dp/${item.ASIN}?tag=${this.config.associateTag}`
            };

            // 価格情報
            if (item.Offers?.Listings?.[0]?.Price) {
                const price = item.Offers.Listings[0].Price;
                result.price = price.DisplayAmount || price.Amount;
                if (price.Savings) {
                    result.originalPrice = price.Savings.DisplayAmount;
                }
            }

            // 在庫情報
            if (item.Offers?.Listings?.[0]?.Availability) {
                result.availability = item.Offers.Listings[0].Availability.Message || '在庫あり';
            }

            // レビュー情報
            if (item.CustomerReviews) {
                result.rating = item.CustomerReviews.StarRating?.Value || null;
                result.reviewCount = item.CustomerReviews.Count || null;
            }

            // 画像情報
            if (item.Images?.Primary) {
                result.images.large = item.Images.Primary.Large?.URL;
                result.images.medium = item.Images.Primary.Medium?.URL;
            }

            return result;

        } catch (error) {
            console.error('商品データ処理エラー:', error);
            return {
                asin: item.ASIN,
                title: '商品情報エラー',
                error: true
            };
        }
    }
}

// Netlify Functions / Vercel Functions 用エクスポート
module.exports = { AmazonProxyServer };

// Express.js用のルートハンドラー（例）
async function handleAmazonProxy(req, res) {
    try {
        const { asins } = req.body;
        
        if (!asins || !Array.isArray(asins)) {
            return res.status(400).json({ error: 'ASINs配列が必要です' });
        }

        const proxy = new AmazonProxyServer();
        const results = await proxy.getItems(asins);
        
        res.json({ success: true, products: results });
        
    } catch (error) {
        console.error('Amazon Proxy エラー:', error);
        res.status(500).json({ 
            error: 'Amazon API呼び出しに失敗しました',
            message: error.message 
        });
    }
}

module.exports.handler = handleAmazonProxy;