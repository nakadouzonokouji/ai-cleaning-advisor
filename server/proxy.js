/**
 * Amazon PA-API プロキシサーバー
 * CX Mainte © 2025
 * 
 * 機能：
 * - Amazon PA-APIへの安全なプロキシアクセス
 * - APIキーの隠蔽とセキュリティ
 * - AWS署名V4による認証
 * - 日本のAmazonマーケットプレイス対応
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

// Expressアプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3001;

// CORS設定（本番環境では適切なオリジンを指定）
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://127.0.0.1:5500'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

// JSONパーサー
app.use(express.json());

// 環境変数の検証
const requiredEnvVars = ['PAAPI_ACCESS_KEY', 'PAAPI_SECRET_KEY', 'PAAPI_ASSOC_TAG'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ 必要な環境変数が設定されていません:', missingVars);
    console.error('💡 .envファイルまたは環境変数に以下を設定してください:');
    missingVars.forEach(varName => {
        console.error(`   ${varName}=your_value_here`);
    });
    process.exit(1);
}

// Amazon PA-API設定
const PAAPI_CONFIG = {
    accessKey: process.env.PAAPI_ACCESS_KEY,
    secretKey: process.env.PAAPI_SECRET_KEY,
    associateTag: process.env.PAAPI_ASSOC_TAG,
    region: 'us-west-2', // PA-APIのリージョン（固定）
    host: 'webservices.amazon.co.jp', // 日本のマーケットプレイス
    uri: '/paapi5/getitems',
    marketplace: 'www.amazon.co.jp'
};

/**
 * AWS署名V4の生成
 * @param {Object} request - リクエストオブジェクト
 * @param {string} accessKey - AWSアクセスキー
 * @param {string} secretKey - AWSシークレットキー
 * @returns {Object} 署名済みヘッダー
 */
function createAWSSignatureV4(request, accessKey, secretKey) {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substr(0, 8);
    
    // ステップ1: カノニカルリクエストの作成
    const canonicalHeaders = Object.keys(request.headers)
        .sort()
        .map(key => `${key.toLowerCase()}:${request.headers[key]}\n`)
        .join('');
    
    const signedHeaders = Object.keys(request.headers)
        .sort()
        .map(key => key.toLowerCase())
        .join(';');
    
    const payloadHash = crypto
        .createHash('sha256')
        .update(request.body || '', 'utf8')
        .digest('hex');
    
    const canonicalRequest = [
        request.method,
        request.uri,
        '', // クエリストリング（PA-APIでは使用しない）
        canonicalHeaders,
        signedHeaders,
        payloadHash
    ].join('\n');
    
    // ステップ2: 署名文字列の作成
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${PAAPI_CONFIG.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
        algorithm,
        amzDate,
        credentialScope,
        crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex')
    ].join('\n');
    
    // ステップ3: 署名キーの計算
    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(PAAPI_CONFIG.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('ProductAdvertisingAPI').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    
    // ステップ4: 署名の計算
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
    
    // 認証ヘッダーの組み立て
    const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    return {
        'Authorization': authorizationHeader,
        'X-Amz-Date': amzDate,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems'
    };
}

/**
 * Amazon PA-APIへのリクエスト送信
 * @param {string} asin - Amazon商品ID
 * @returns {Promise<Object>} レスポンスデータ
 */
async function fetchFromPAAPI(asin) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 PA-API商品取得開始: ${asin}`);
        
        // リクエストボディの作成
        const requestBody = {
            ItemIds: [asin],
            Resources: [
                'ItemInfo.Title',
                'Offers.Listings.Price',
                'Images.Primary.Large',
                'CustomerReviews.StarRating',
                'CustomerReviews.Count',
                'Offers.Listings.Availability.Message'
            ],
            PartnerTag: PAAPI_CONFIG.associateTag,
            PartnerType: 'Associates',
            Marketplace: PAAPI_CONFIG.marketplace
        };
        
        const bodyData = JSON.stringify(requestBody);
        
        // リクエストヘッダーの準備
        const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(bodyData),
            'Host': PAAPI_CONFIG.host,
            'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems'
        };
        
        // AWS署名の生成
        const request = {
            method: 'POST',
            uri: PAAPI_CONFIG.uri,
            headers: headers,
            body: bodyData
        };
        
        const signedHeaders = createAWSSignatureV4(request, PAAPI_CONFIG.accessKey, PAAPI_CONFIG.secretKey);
        Object.assign(headers, signedHeaders);
        
        // HTTPSリクエストオプション
        const options = {
            hostname: PAAPI_CONFIG.host,
            port: 443,
            path: PAAPI_CONFIG.uri,
            method: 'POST',
            headers: headers,
            timeout: 10000 // 10秒タイムアウト
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    
                    if (res.statusCode !== 200) {
                        console.error(`❌ PA-APIエラー (${res.statusCode}):`, responseData);
                        return reject(new Error(`PA-API request failed: ${res.statusCode}`));
                    }
                    
                    console.log(`✅ PA-API取得成功: ${asin}`);
                    resolve(responseData);
                } catch (error) {
                    console.error(`💥 レスポンス解析エラー:`, error.message);
                    reject(new Error('Failed to parse PA-API response'));
                }
            });
        });
        
        req.on('error', (error) => {
            console.error(`🔥 PA-APIリクエストエラー:`, error.message);
            reject(error);
        });
        
        req.on('timeout', () => {
            console.error(`⏰ PA-APIタイムアウト: ${asin}`);
            req.destroy();
            reject(new Error('PA-API request timeout'));
        });
        
        // リクエストボディを送信
        req.write(bodyData);
        req.end();
    });
}

/**
 * PA-APIレスポンスを標準形式に変換
 * @param {Object} papiResponse - PA-APIからのレスポンス
 * @param {string} asin - 商品ASIN
 * @returns {Object} 標準化された商品データ
 */
function transformPAAPIResponse(papiResponse, asin) {
    try {
        const item = papiResponse.ItemsResult?.Items?.[0];
        
        if (!item) {
            console.warn(`⚠️ 商品データが見つかりません: ${asin}`);
            return createFallbackResponse(asin);
        }
        
        // 商品タイトル
        const title = item.ItemInfo?.Title?.DisplayValue || `Amazon商品 ${asin}`;
        
        // 価格情報
        let price = '価格不明';
        const offer = item.Offers?.Listings?.[0];
        if (offer?.Price?.DisplayAmount) {
            price = offer.Price.DisplayAmount;
        }
        
        // 商品画像
        let image = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
        if (item.Images?.Primary?.Large?.URL) {
            image = item.Images.Primary.Large.URL;
        }
        
        // アフィリエイトリンク
        const urlWithTag = item.DetailPageURL || `https://www.amazon.co.jp/dp/${asin}?tag=${PAAPI_CONFIG.associateTag}`;
        
        // レビュー情報
        let rating = 0;
        let reviews = 0;
        if (item.CustomerReviews) {
            rating = parseFloat(item.CustomerReviews.StarRating?.DisplayValue) || 0;
            reviews = parseInt(item.CustomerReviews.Count?.DisplayValue) || 0;
        }
        
        // 在庫状況
        let availability = '在庫状況不明';
        if (offer?.Availability?.Message) {
            availability = offer.Availability.Message;
        }
        
        const result = {
            title,
            price,
            image,
            urlWithTag,
            rating,
            reviews,
            availability,
            asin,
            source: 'amazon-paapi',
            timestamp: new Date().toISOString()
        };
        
        console.log(`📦 商品データ変換完了: ${title} - ${price}`);
        return result;
        
    } catch (error) {
        console.error(`💥 データ変換エラー:`, error.message);
        return createFallbackResponse(asin);
    }
}

/**
 * フォールバック商品データの作成
 * @param {string} asin - 商品ASIN
 * @returns {Object} フォールバック商品データ
 */
function createFallbackResponse(asin) {
    console.log(`🔄 フォールバックデータ生成: ${asin}`);
    
    return {
        title: `Amazon商品 ${asin}`,
        price: '価格を確認',
        image: `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
        urlWithTag: `https://www.amazon.co.jp/dp/${asin}?tag=${PAAPI_CONFIG.associateTag}`,
        rating: 0,
        reviews: 0,
        availability: 'Amazonで確認',
        asin,
        source: 'fallback',
        timestamp: new Date().toISOString()
    };
}

/**
 * ASINの妥当性チェック
 * @param {string} asin - チェック対象のASIN
 * @returns {boolean} 妥当性
 */
function validateASIN(asin) {
    if (!asin || typeof asin !== 'string') {
        return false;
    }
    
    // ASINは通常10文字の英数字
    const asinPattern = /^[A-Z0-9]{10}$/;
    return asinPattern.test(asin.toUpperCase());
}

// ===== API エンドポイント =====

/**
 * GET /api/item - Amazon商品情報の取得
 * クエリパラメータ: asin (必須)
 */
app.get('/api/item', async (req, res) => {
    const startTime = Date.now();
    const asin = req.query.asin;
    
    console.log(`🚀 商品情報リクエスト受信: ${asin || '未指定'}`);
    
    // ASINパラメータの検証
    if (!asin) {
        console.warn('⚠️ ASINパラメータが未指定');
        return res.status(400).json({
            error: 'ASINパラメータが必要です',
            message: 'クエリパラメータにasinを指定してください',
            example: '/api/item?asin=B000TGNG0W'
        });
    }
    
    if (!validateASIN(asin)) {
        console.warn(`⚠️ 無効なASIN形式: ${asin}`);
        return res.status(400).json({
            error: '無効なASIN形式',
            message: 'ASINは10文字の英数字である必要があります',
            provided: asin
        });
    }
    
    try {
        // PA-APIから商品データを取得
        const papiResponse = await fetchFromPAAPI(asin);
        
        // レスポンスを標準形式に変換
        const itemData = transformPAAPIResponse(papiResponse, asin);
        
        // 処理時間を計算
        const processingTime = Date.now() - startTime;
        
        // 成功レスポンス
        res.json({
            success: true,
            data: itemData,
            meta: {
                processingTime: `${processingTime}ms`,
                requestId: crypto.randomUUID(),
                apiVersion: '1.0'
            }
        });
        
        console.log(`✅ リクエスト完了 (${processingTime}ms): ${asin}`);
        
    } catch (error) {
        console.error(`💥 商品取得エラー: ${error.message}`);
        
        // エラー時はフォールバックデータを返す
        const fallbackData = createFallbackResponse(asin);
        const processingTime = Date.now() - startTime;
        
        res.status(200).json({
            success: false,
            data: fallbackData,
            error: {
                message: 'PA-APIからの取得に失敗しました',
                details: error.message,
                fallback: true
            },
            meta: {
                processingTime: `${processingTime}ms`,
                requestId: crypto.randomUUID(),
                apiVersion: '1.0'
            }
        });
    }
});

/**
 * GET /api/health - ヘルスチェックエンドポイント
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

/**
 * GET /api/config - 設定情報の取得（デバッグ用）
 */
app.get('/api/config', (req, res) => {
    res.json({
        marketplace: PAAPI_CONFIG.marketplace,
        region: PAAPI_CONFIG.region,
        associateTag: PAAPI_CONFIG.associateTag,
        hasAccessKey: !!process.env.PAAPI_ACCESS_KEY,
        hasSecretKey: !!process.env.PAAPI_SECRET_KEY,
        environment: process.env.NODE_ENV || 'development'
    });
});

// エラーハンドリングミドルウェア
app.use((error, req, res, next) => {
    console.error('💥 予期しないエラー:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: '予期しないエラーが発生しました',
        timestamp: new Date().toISOString()
    });
});

// 404ハンドラー
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'リクエストされたエンドポイントが見つかりません',
        availableEndpoints: [
            'GET /api/item?asin=XXXXXXXXXX',
            'GET /api/health',
            'GET /api/config'
        ]
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log('\n🚀 Amazon PA-API プロキシサーバー起動完了');
    console.log(`📡 ポート: ${PORT}`);
    console.log(`🌐 マーケットプレイス: ${PAAPI_CONFIG.marketplace}`);
    console.log(`🔑 アソシエイトタグ: ${PAAPI_CONFIG.associateTag}`);
    console.log(`⚙️  環境: ${process.env.NODE_ENV || 'development'}`);
    console.log('\n💡 利用可能なエンドポイント:');
    console.log(`   GET http://localhost:${PORT}/api/item?asin=B000TGNG0W`);
    console.log(`   GET http://localhost:${PORT}/api/health`);
    console.log(`   GET http://localhost:${PORT}/api/config`);
    console.log('\n🔐 環境変数確認済み:');
    console.log(`   ✅ PAAPI_ACCESS_KEY: ${process.env.PAAPI_ACCESS_KEY ? '設定済み' : '未設定'}`);
    console.log(`   ✅ PAAPI_SECRET_KEY: ${process.env.PAAPI_SECRET_KEY ? '設定済み' : '未設定'}`);
    console.log(`   ✅ PAAPI_ASSOC_TAG: ${process.env.PAAPI_ASSOC_TAG ? '設定済み' : '未設定'}`);
    console.log('');
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM受信 - サーバーをシャットダウンします');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT受信 - サーバーをシャットダウンします');
    process.exit(0);
});

module.exports = app;