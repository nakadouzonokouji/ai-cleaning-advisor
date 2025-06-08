// Netlify Functions用 Amazon PA-API プロキシ
const crypto = require('crypto');

exports.handler = async (event, context) => {
    // CORS対応
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // OPTIONSリクエスト（プリフライト）
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { asins, config } = JSON.parse(event.body);
        
        if (!asins || !Array.isArray(asins) || asins.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'ASINs配列が必要です' })
            };
        }

        // 環境変数またはリクエストからAPIキーを取得
        const amazonConfig = {
            accessKey: process.env.AMAZON_ACCESS_KEY || config?.accessKey,
            secretKey: process.env.AMAZON_SECRET_KEY || config?.secretKey,
            associateTag: process.env.AMAZON_ASSOCIATE_TAG || config?.associateTag,
            endpoint: 'webservices.amazon.co.jp',
            region: 'us-west-2'
        };

        if (!amazonConfig.accessKey || !amazonConfig.secretKey || !amazonConfig.associateTag) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Amazon API設定が不完全です' })
            };
        }

        console.log(`Amazon API呼び出し開始: ${asins.length}商品`);

        // Amazon PA-API v5 リクエスト
        const requestPayload = {
            ItemIds: asins,
            Resources: [
                'Images.Primary.Large',
                'Images.Primary.Medium', 
                'ItemInfo.Title',
                'ItemInfo.ByLineInfo',
                'Offers.Listings.Price',
                'CustomerReviews.StarRating',
                'CustomerReviews.Count'
            ],
            PartnerTag: amazonConfig.associateTag,
            PartnerType: 'Associates',
            Marketplace: 'www.amazon.co.jp'
        };

        const path = '/paapi5/getitems';
        const payload = JSON.stringify(requestPayload);
        const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
        
        // AWS署名v4生成
        const signature = generateAWSSignature(
            'POST', path, '', payload, amazonConfig, timestamp
        );

        const response = await fetch(`https://${amazonConfig.endpoint}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Host': amazonConfig.endpoint,
                'X-Amz-Date': timestamp,
                'Authorization': buildAuthorizationHeader(amazonConfig, timestamp, signature)
            },
            body: payload
        });

        if (!response.ok) {
            throw new Error(`Amazon API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const processedProducts = processAmazonResponse(data, amazonConfig.associateTag);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                products: processedProducts,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Amazon Proxy Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

// AWS署名v4生成
function generateAWSSignature(method, path, queryString, payload, config, timestamp) {
    const date = timestamp.substr(0, 8);
    
    const canonicalRequest = [
        method,
        path,
        queryString,
        `host:${config.endpoint}`,
        'x-amz-date:' + timestamp,
        '',
        'host;x-amz-date',
        sha256Hash(payload)
    ].join('\n');

    const scope = `${date}/${config.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
        'AWS4-HMAC-SHA256',
        timestamp,
        scope,
        sha256Hash(canonicalRequest)
    ].join('\n');

    const kDate = hmac(`AWS4${config.secretKey}`, date);
    const kRegion = hmac(kDate, config.region);
    const kService = hmac(kRegion, 'ProductAdvertisingAPI');
    const kSigning = hmac(kService, 'aws4_request');

    return hmac(kSigning, stringToSign).toString('hex');
}

// 認証ヘッダー構築
function buildAuthorizationHeader(config, timestamp, signature) {
    const date = timestamp.substr(0, 8);
    const scope = `${date}/${config.region}/ProductAdvertisingAPI/aws4_request`;
    
    return [
        'AWS4-HMAC-SHA256',
        `Credential=${config.accessKey}/${scope}`,
        'SignedHeaders=host;x-amz-date',
        `Signature=${signature}`
    ].join(' ');
}

// SHA256ハッシュ
function sha256Hash(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

// HMAC生成
function hmac(key, message) {
    return crypto.createHmac('sha256', key).update(message).digest();
}

// Amazon APIレスポンス処理
function processAmazonResponse(data, associateTag) {
    const results = {};
    
    if (data.ItemsResult && data.ItemsResult.Items) {
        for (const item of data.ItemsResult.Items) {
            results[item.ASIN] = {
                asin: item.ASIN,
                title: item.ItemInfo?.Title?.DisplayValue || '商品名取得不可',
                brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || '',
                price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || null,
                rating: item.CustomerReviews?.StarRating?.Value || null,
                reviewCount: item.CustomerReviews?.Count || null,
                images: {
                    large: item.Images?.Primary?.Large?.URL || null,
                    medium: item.Images?.Primary?.Medium?.URL || null
                },
                url: `https://www.amazon.co.jp/dp/${item.ASIN}?tag=${associateTag}`,
                isRealData: true
            };
        }
    }

    return results;
}