// Amazon Product Advertising API v5 クライアント

class AmazonProductAPI {
    constructor() {
        this.config = window.AMAZON_CONFIG;
        this.cache = new Map(); // 商品情報キャッシュ
        this.cacheExpiry = 60 * 60 * 1000; // 1時間
    }

    // SHA256 HMAC 署名生成（Web Crypto API使用）
    async createSignature(stringToSign, secretKey) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(stringToSign);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    // ISO 8601 形式の現在時刻
    getTimestamp() {
        return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    }

    // クエリ文字列をソート
    sortQueryString(params) {
        return Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    // AWS署名 v4 の生成
    async generateAWSSignature(method, path, queryString, payload) {
        const timestamp = this.getTimestamp();
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
            await this.sha256Hash(payload)
        ].join('\n');

        // 署名文字列
        const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
        const stringToSign = [
            'AWS4-HMAC-SHA256',
            timestamp,
            scope,
            await this.sha256Hash(canonicalRequest)
        ].join('\n');

        // 署名キー生成
        const kDate = await this.hmac(`AWS4${this.config.secretKey}`, date);
        const kRegion = await this.hmac(kDate, this.config.region);
        const kService = await this.hmac(kRegion, 'ProductAdvertisingAPI');
        const kSigning = await this.hmac(kService, 'aws4_request');

        // 最終署名
        const signature = await this.hmac(kSigning, stringToSign);
        
        return {
            timestamp,
            signature: Array.from(new Uint8Array(signature))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('')
        };
    }

    // SHA256ハッシュ
    async sha256Hash(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // HMAC生成
    async hmac(key, message) {
        const keyData = typeof key === 'string' ? new TextEncoder().encode(key) : key;
        const messageData = new TextEncoder().encode(message);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        return await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    }

    // 複数商品情報取得
    async getItems(asinList) {
        if (!this.config || !window.validateAmazonConfig()) {
            console.error('❌ Amazon API設定が正しくありません');
            return null;
        }

        // キャッシュチェック
        const cachedResults = {};
        const uncachedAsins = [];
        
        for (const asin of asinList) {
            const cached = this.cache.get(asin);
            if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
                cachedResults[asin] = cached.data;
            } else {
                uncachedAsins.push(asin);
            }
        }

        if (uncachedAsins.length === 0) {
            console.log('✅ 全商品キャッシュから取得');
            return cachedResults;
        }

        try {
            console.log(`🛒 Amazon API呼び出し: ${uncachedAsins.length}商品`);
            
            const requestPayload = {
                ItemIds: uncachedAsins,
                Resources: this.config.resources,
                PartnerTag: this.config.associateTag,
                PartnerType: 'Associates',
                Marketplace: this.config.marketplace
            };

            const path = '/paapi5/getitems';
            const payload = JSON.stringify(requestPayload);
            const queryString = '';

            const { timestamp, signature } = await this.generateAWSSignature(
                'POST', path, queryString, payload
            );

            const response = await fetch(`https://${this.config.endpoint}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Host': this.config.endpoint,
                    'X-Amz-Date': timestamp,
                    'Authorization': this.buildAuthorizationHeader(timestamp, signature)
                },
                body: payload
            });

            if (!response.ok) {
                throw new Error(`API呼び出し失敗: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // レスポンス処理とキャッシュ
            const results = { ...cachedResults };
            
            if (data.ItemsResult && data.ItemsResult.Items) {
                for (const item of data.ItemsResult.Items) {
                    const processedItem = this.processItemData(item);
                    results[item.ASIN] = processedItem;
                    
                    // キャッシュに保存
                    this.cache.set(item.ASIN, {
                        data: processedItem,
                        timestamp: Date.now()
                    });
                }
            }

            // エラー情報の処理
            if (data.Errors) {
                console.warn('⚠️ Amazon API エラー:', data.Errors);
            }

            console.log(`✅ Amazon商品情報取得完了: ${Object.keys(results).length}商品`);
            return results;

        } catch (error) {
            console.error('💥 Amazon API呼び出しエラー:', error);
            return cachedResults; // キャッシュがあれば返す
        }
    }

    // 認証ヘッダー構築
    buildAuthorizationHeader(timestamp, signature) {
        const date = timestamp.substr(0, 8);
        const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
        
        return [
            'AWS4-HMAC-SHA256',
            `Credential=${this.config.accessKey}/${scope}`,
            'SignedHeaders=host;x-amz-date',
            `Signature=${signature}`
        ].join(' ');
    }

    // Amazon APIレスポンスを整形
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

    // キャッシュクリア
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Amazon商品キャッシュをクリアしました');
    }
}

// グローバルインスタンス
window.amazonAPI = new AmazonProductAPI();