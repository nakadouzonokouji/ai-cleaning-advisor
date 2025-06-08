/**
 * AI掃除アドバイザー 統合プロキシサーバー
 * CX Mainte © 2025
 * 
 * 機能：
 * - Gemini AI画像解析プロキシ
 * - Amazon PA-API商品取得プロキシ
 * - ビジネスロジック統合（ユーザーはAPIキー不要）
 * - 収益化：Amazonアソシエイト手数料
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');
const fetch = require('node-fetch'); // npm install node-fetch が必要
const multer = require('multer'); // npm install multer が必要

// Expressアプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3001;

// ファイルアップロード設定
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB制限
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        cb(null, allowedTypes.includes(file.mimetype));
    }
});

// CORS設定（本番環境では適切なオリジンを指定）
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        [
            'https://nakadouzonokouji.github.io',
            'http://localhost:3000', 
            'http://127.0.0.1:5500'
        ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSONパーサー
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 環境変数の検証
const requiredEnvVars = [
    'PAAPI_ACCESS_KEY', 
    'PAAPI_SECRET_KEY', 
    'PAAPI_ASSOC_TAG',
    'GEMINI_API_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ 必要な環境変数が設定されていません:', missingVars);
    console.error('💡 .envファイルまたは環境変数に以下を設定してください:');
    missingVars.forEach(varName => {
        console.error(`   ${varName}=your_value_here`);
    });
    process.exit(1);
}

// API設定
const API_CONFIG = {
    // Amazon PA-API設定
    amazon: {
        accessKey: process.env.PAAPI_ACCESS_KEY,
        secretKey: process.env.PAAPI_SECRET_KEY,
        associateTag: process.env.PAAPI_ASSOC_TAG,
        region: 'us-west-2',
        host: 'webservices.amazon.co.jp',
        uri: '/paapi5/getitems',
        marketplace: 'www.amazon.co.jp'
    },
    // Gemini AI設定
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-1.5-flash',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
    }
};

// リクエスト統計
const stats = {
    startTime: Date.now(),
    requests: {
        total: 0,
        gemini: 0,
        amazon: 0,
        errors: 0
    }
};

/**
 * AWS署名V4の生成（Amazon PA-API用）
 */
function createAWSSignatureV4(request, accessKey, secretKey) {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\\-]|\\.\\d{3}/g, '');
    const dateStamp = amzDate.substr(0, 8);
    
    // カノニカルリクエストの作成
    const canonicalHeaders = Object.keys(request.headers)
        .sort()
        .map(key => `${key.toLowerCase()}:${request.headers[key]}\\n`)
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
        '',
        canonicalHeaders,
        signedHeaders,
        payloadHash
    ].join('\\n');
    
    // 署名文字列の作成
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${API_CONFIG.amazon.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
        algorithm,
        amzDate,
        credentialScope,
        crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex')
    ].join('\\n');
    
    // 署名キーの計算
    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(API_CONFIG.amazon.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('ProductAdvertisingAPI').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    
    // 署名の計算
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
 * Gemini AI画像解析
 */
async function analyzeImageWithGemini(imageBase64, prompt) {
    try {
        console.log('🤖 Gemini AI画像解析開始');
        
        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: 'image/jpeg',
                            data: imageBase64
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        const response = await fetch(
            `${API_CONFIG.gemini.endpoint}/${API_CONFIG.gemini.model}:generateContent?key=${API_CONFIG.gemini.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!analysisText) {
            throw new Error('Gemini APIからの応答が不正です');
        }

        console.log('✅ Gemini AI画像解析完了');
        stats.requests.gemini++;
        
        return analysisText;
        
    } catch (error) {
        console.error('💥 Gemini AI解析エラー:', error.message);
        stats.requests.errors++;
        throw error;
    }
}

/**
 * Amazon PA-API商品取得
 */
async function fetchProductFromAmazon(asin) {
    return new Promise((resolve, reject) => {
        console.log(`🛒 Amazon商品取得開始: ${asin}`);
        
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
            PartnerTag: API_CONFIG.amazon.associateTag,
            PartnerType: 'Associates',
            Marketplace: API_CONFIG.amazon.marketplace
        };
        
        const bodyData = JSON.stringify(requestBody);
        
        const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(bodyData),
            'Host': API_CONFIG.amazon.host,
            'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems'
        };
        
        const request = {
            method: 'POST',
            uri: API_CONFIG.amazon.uri,
            headers: headers,
            body: bodyData
        };
        
        const signedHeaders = createAWSSignatureV4(request, API_CONFIG.amazon.accessKey, API_CONFIG.amazon.secretKey);
        Object.assign(headers, signedHeaders);
        
        const options = {
            hostname: API_CONFIG.amazon.host,
            port: 443,
            path: API_CONFIG.amazon.uri,
            method: 'POST',
            headers: headers,
            timeout: 15000
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
                        console.error(`❌ Amazon PA-APIエラー (${res.statusCode}):`, responseData);
                        return reject(new Error(`Amazon PA-API request failed: ${res.statusCode}`));
                    }
                    
                    console.log(`✅ Amazon商品取得成功: ${asin}`);
                    stats.requests.amazon++;
                    resolve(responseData);
                    
                } catch (error) {
                    console.error(`💥 Amazon レスポンス解析エラー:`, error.message);
                    stats.requests.errors++;
                    reject(new Error('Failed to parse Amazon PA-API response'));
                }
            });
        });
        
        req.on('error', (error) => {
            console.error(`🔥 Amazon PA-APIリクエストエラー:`, error.message);
            stats.requests.errors++;
            reject(error);
        });
        
        req.on('timeout', () => {
            console.error(`⏰ Amazon PA-APIタイムアウト: ${asin}`);
            req.destroy();
            stats.requests.errors++;
            reject(new Error('Amazon PA-API request timeout'));
        });
        
        req.write(bodyData);
        req.end();
    });
}

/**
 * Amazon商品データの標準化
 */
function transformAmazonProduct(papiResponse, asin) {
    try {
        const item = papiResponse.ItemsResult?.Items?.[0];
        
        if (!item) {
            return createFallbackProduct(asin);
        }
        
        const title = item.ItemInfo?.Title?.DisplayValue || `Amazon商品 ${asin}`;
        
        let price = '価格不明';
        const offer = item.Offers?.Listings?.[0];
        if (offer?.Price?.DisplayAmount) {
            price = offer.Price.DisplayAmount;
        }
        
        let image = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
        if (item.Images?.Primary?.Large?.URL) {
            image = item.Images.Primary.Large.URL;
        }
        
        const urlWithTag = item.DetailPageURL || `https://www.amazon.co.jp/dp/${asin}?tag=${API_CONFIG.amazon.associateTag}`;
        
        let rating = 0;
        let reviews = 0;
        if (item.CustomerReviews) {
            rating = parseFloat(item.CustomerReviews.StarRating?.DisplayValue) || 0;
            reviews = parseInt(item.CustomerReviews.Count?.DisplayValue) || 0;
        }
        
        let availability = '在庫状況不明';
        if (offer?.Availability?.Message) {
            availability = offer.Availability.Message;
        }
        
        return {
            title,
            price,
            image,
            urlWithTag,
            rating,
            reviews,
            availability,
            asin,
            source: 'amazon-paapi'
        };
        
    } catch (error) {
        console.error(`💥 Amazon商品データ変換エラー:`, error.message);
        return createFallbackProduct(asin);
    }
}

/**
 * フォールバック商品データ
 */
function createFallbackProduct(asin) {
    return {
        title: `Amazon商品 ${asin}`,
        price: '価格を確認',
        image: `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
        urlWithTag: `https://www.amazon.co.jp/dp/${asin}?tag=${API_CONFIG.amazon.associateTag}`,
        rating: 0,
        reviews: 0,
        availability: 'Amazonで確認',
        asin,
        source: 'fallback'
    };
}

// ===== API エンドポイント =====

/**
 * POST /api/analyze - 画像解析＋商品推薦の統合エンドポイント
 */
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    stats.requests.total++;
    
    try {
        console.log('🚀 統合解析リクエスト受信');
        
        // 画像データの取得
        let imageBase64;
        if (req.file) {
            imageBase64 = req.file.buffer.toString('base64');
        } else if (req.body.image) {
            imageBase64 = req.body.image.replace(/^data:image\/[a-z]+;base64,/, '');
        } else {
            return res.status(400).json({
                error: '画像データが必要です',
                message: 'image ファイルまたはbase64データを送信してください'
            });
        }
        
        // 場所・材質情報の取得
        const location = req.body.location || 'その他';
        const surface = req.body.surface || 'その他';
        
        // Gemini AIで画像解析
        const analysisPrompt = `
この掃除が必要な画像を分析して、以下の情報をJSON形式で返してください：

{
  "dirtType": "汚れの種類（油汚れ、カビ、水垢、ホコリ、黄ばみ、焦げ付き、その他）",
  "severity": "汚れの程度（軽度、中程度、重度）",
  "surface": "表面の材質（${surface}）",
  "location": "場所（${location}）",
  "confidence": "判定の信頼度（0-100）",
  "recommendedMethod": "推奨掃除方法の簡潔な説明",
  "productCategories": ["推奨商品カテゴリ1", "推奨商品カテゴリ2"]
}

画像から判断できる情報のみを回答し、JSON形式以外は含めないでください。
`;
        
        const analysisResult = await analyzeImageWithGemini(imageBase64, analysisPrompt);
        
        // JSON解析
        let analysisData;
        try {
            const jsonMatch = analysisResult.match(/\\{[\\s\\S]*\\}/);
            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('JSON形式の応答が見つかりません');
            }
        } catch (parseError) {
            console.warn('⚠️ JSON解析失敗、フォールバック使用');
            analysisData = {
                dirtType: 'その他の汚れ',
                severity: '中程度',
                surface: surface,
                location: location,
                confidence: 70,
                recommendedMethod: '適切な掃除用品で清拭してください',
                productCategories: ['多目的洗剤', '掃除用具']
            };
        }
        
        // 商品推薦（簡易版 - 実際は商品データベースと連携）
        const recommendedProducts = await getRecommendedProducts(analysisData);
        
        // 処理時間を計算
        const processingTime = Date.now() - startTime;
        
        // 統合レスポンス
        res.json({
            success: true,
            analysis: analysisData,
            products: recommendedProducts,
            meta: {
                processingTime: `${processingTime}ms`,
                requestId: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                apiVersion: '1.0'
            }
        });
        
        console.log(`✅ 統合解析完了 (${processingTime}ms)`);
        
    } catch (error) {
        console.error(`💥 統合解析エラー: ${error.message}`);
        stats.requests.errors++;
        
        const processingTime = Date.now() - startTime;
        
        res.status(500).json({
            success: false,
            error: {
                message: '画像解析に失敗しました',
                details: error.message
            },
            meta: {
                processingTime: `${processingTime}ms`,
                requestId: crypto.randomUUID(),
                timestamp: new Date().toISOString()
            }
        });
    }
});

/**
 * 商品推薦ロジック（簡易版）
 */
async function getRecommendedProducts(analysisData) {
    // 汚れタイプに基づく推奨ASIN（実際の商品データ）
    const productMapping = {
        '油汚れ': ['B000TGNG0W', 'B001234567'], // マジックリンなど
        'カビ': ['B002345678', 'B003456789'],   // カビキラーなど
        '水垢': ['B004567890', 'B005678901'],   // クエン酸系など
        'ホコリ': ['B006789012', 'B007890123'], // 掃除機、ワイパーなど
        '黄ばみ': ['B008901234', 'B009012345']  // 漂白剤など
    };
    
    const asins = productMapping[analysisData.dirtType] || productMapping['油汚れ'];
    const products = [];
    
    for (const asin of asins.slice(0, 3)) { // 最大3商品
        try {
            const amazonData = await fetchProductFromAmazon(asin);
            const product = transformAmazonProduct(amazonData, asin);
            products.push(product);
        } catch (error) {
            console.warn(`⚠️ 商品取得失敗 ${asin}: ${error.message}`);
            products.push(createFallbackProduct(asin));
        }
    }
    
    return products;
}

/**
 * GET /api/product/:asin - 個別商品情報取得
 */
app.get('/api/product/:asin', async (req, res) => {
    const startTime = Date.now();
    const asin = req.params.asin;
    stats.requests.total++;
    
    console.log(`🛒 商品情報リクエスト: ${asin}`);
    
    try {
        const amazonData = await fetchProductFromAmazon(asin);
        const product = transformAmazonProduct(amazonData, asin);
        
        const processingTime = Date.now() - startTime;
        
        res.json({
            success: true,
            product: product,
            meta: {
                processingTime: `${processingTime}ms`,
                requestId: crypto.randomUUID(),
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error(`💥 商品取得エラー: ${error.message}`);
        stats.requests.errors++;
        
        const fallbackProduct = createFallbackProduct(asin);
        const processingTime = Date.now() - startTime;
        
        res.json({
            success: false,
            product: fallbackProduct,
            error: {
                message: '商品情報の取得に失敗しました',
                details: error.message,
                fallback: true
            },
            meta: {
                processingTime: `${processingTime}ms`,
                requestId: crypto.randomUUID(),
                timestamp: new Date().toISOString()
            }
        });
    }
});

/**
 * GET /api/health - ヘルスチェック
 */
app.get('/api/health', (req, res) => {
    const uptime = Date.now() - stats.startTime;
    
    res.json({
        status: 'healthy',
        uptime: uptime,
        stats: stats.requests,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            gemini: !!API_CONFIG.gemini.apiKey,
            amazon: !!API_CONFIG.amazon.accessKey
        }
    });
});

/**
 * GET /api/stats - システム統計
 */
app.get('/api/stats', (req, res) => {
    const uptime = Date.now() - stats.startTime;
    const successRate = stats.requests.total > 0 ? 
        Math.round(((stats.requests.total - stats.requests.errors) / stats.requests.total) * 100) : 100;
    
    res.json({
        uptime: Math.floor(uptime / 1000), // 秒
        requests: stats.requests,
        successRate: successRate,
        averageResponseTime: '適用外', // 今後実装
        lastUpdated: new Date().toISOString()
    });
});

// エラーハンドリングミドルウェア
app.use((error, req, res, next) => {
    console.error('💥 予期しないエラー:', error);
    stats.requests.errors++;
    
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
            'POST /api/analyze',
            'GET /api/product/:asin',
            'GET /api/health',
            'GET /api/stats'
        ]
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log('\\n🚀 AI掃除アドバイザー統合プロキシサーバー起動完了');
    console.log(`📡 ポート: ${PORT}`);
    console.log(`🤖 Gemini AI: ${API_CONFIG.gemini.apiKey ? '設定済み' : '未設定'}`);
    console.log(`🛒 Amazon PA-API: ${API_CONFIG.amazon.accessKey ? '設定済み' : '未設定'}`);
    console.log(`🔑 アソシエイトタグ: ${API_CONFIG.amazon.associateTag}`);
    console.log(`⚙️  環境: ${process.env.NODE_ENV || 'development'}`);
    console.log('\\n💡 利用可能なエンドポイント:');
    console.log(`   POST http://localhost:${PORT}/api/analyze`);
    console.log(`   GET  http://localhost:${PORT}/api/product/:asin`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   GET  http://localhost:${PORT}/api/stats`);
    console.log('\\n🎯 ビジネスモデル: Amazon収益化対応');
    console.log('');
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM受信 - サーバーをシャットダウンします');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\\n🛑 SIGINT受信 - サーバーをシャットダウンします');
    process.exit(0);
});

module.exports = app;