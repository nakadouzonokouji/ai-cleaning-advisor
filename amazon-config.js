// Amazon PA-API v5 設定（サーバーレス対応）

// Amazon設定の初期化
function initializeAmazonConfig() {
    console.log('🔧 Amazon設定初期化開始');
    
    // 環境変数から設定を取得
    const config = {
        endpoint: 'webservices.amazon.co.jp',
        region: 'us-west-2',
        marketplace: 'www.amazon.co.jp',
        resources: [
            'Images.Primary.Large',
            'Images.Primary.Medium', 
            'ItemInfo.Title',
            'ItemInfo.ByLineInfo',
            'Offers.Listings.Price',
            'CustomerReviews.StarRating',
            'CustomerReviews.Count'
        ]
    };

    // サーバーサイド設定チェック
    if (window.ENV?.API_ENDPOINT) {
        console.log('🔗 サーバーサイドプロキシ使用');
        config.useProxy = true;
        config.proxyEndpoint = window.ENV.API_ENDPOINT;
    } else if (window.ENV?.AMAZON_ACCESS_KEY) {
        // 開発環境用（非推奨）
        console.log('⚠️ クライアントサイド設定（開発のみ）');
        config.accessKey = window.ENV.AMAZON_ACCESS_KEY;
        config.secretKey = window.ENV.AMAZON_SECRET_KEY;
        config.associateTag = window.ENV.AMAZON_ASSOCIATE_TAG;
        config.useProxy = false;
    } else {
        // フォールバック設定
        console.log('💡 フォールバック設定使用');
        config.useProxy = false;
        config.associateTag = 'cxmainte-22'; // 本番用アソシエイトタグ
    }

    window.AMAZON_CONFIG = config;
    console.log('✅ Amazon設定完了:', config);
    return config;
}

// Amazon設定の検証
function validateAmazonConfig() {
    console.log('🔍 Amazon設定検証開始');
    
    const config = window.AMAZON_CONFIG;
    if (!config) {
        console.log('❌ AMAZON_CONFIG未定義');
        return false;
    }

    if (config.useProxy) {
        // プロキシ使用の場合
        if (!config.proxyEndpoint) {
            console.log('❌ プロキシエンドポイント未設定');
            return false;
        }
        console.log('✅ プロキシ設定OK');
        return true;
    } else {
        // 直接API使用の場合
        const required = ['accessKey', 'secretKey', 'associateTag'];
        for (const key of required) {
            if (!config[key]) {
                console.log(`❌ ${key}が未設定`);
                return false;
            }
            if (config[key].includes('YOUR_') || config[key].includes('your')) {
                console.log(`❌ ${key}がサンプル値のまま`);
                return false;
            }
        }
        console.log('✅ 直接API設定OK');
        return true;
    }
}

// Amazon商品情報の取得（統合版）
async function getAmazonProductInfo(asinList) {
    console.log(`🛒 Amazon商品情報取得: ${asinList.length}商品`);
    
    const config = window.AMAZON_CONFIG;
    if (!config || !validateAmazonConfig()) {
        console.log('⚠️ Amazon設定無効 - フォールバック使用');
        return null;
    }

    try {
        if (config.useProxy) {
            // サーバーサイドプロキシ経由
            return await fetchViaProxy(asinList, config);
        } else {
            // 直接API呼び出し（開発用）
            return await window.amazonAPI?.getItems(asinList);
        }
    } catch (error) {
        console.error('💥 Amazon API呼び出しエラー:', error);
        return null;
    }
}

// プロキシ経由での取得
async function fetchViaProxy(asinList, config) {
    const response = await fetch(config.proxyEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asins: asinList })
    });

    if (!response.ok) {
        throw new Error(`プロキシエラー: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
        console.log(`✅ プロキシ経由で${Object.keys(data.products).length}商品取得`);
        return data.products;
    } else {
        throw new Error(data.error || 'プロキシ応答エラー');
    }
}

// デバッグ用：Amazon API テスト
function testAmazonAPI() {
    console.log('🧪 Amazon APIテスト開始');
    
    const testAsins = ['B08X6GQ2H1', 'B09K7XLQF3']; // 正規商品ASIN使用
    
    getAmazonProductInfo(testAsins)
        .then(result => {
            if (result) {
                console.log('✅ Amazon APIテスト成功:', result);
            } else {
                console.log('❌ Amazon APIテスト失敗');
            }
        })
        .catch(error => {
            console.error('💥 Amazon APIテストエラー:', error);
        });
}

// グローバル関数として公開
window.initializeAmazonConfig = initializeAmazonConfig;
window.validateAmazonConfig = validateAmazonConfig;
window.getAmazonProductInfo = getAmazonProductInfo;
window.testAmazonAPI = testAmazonAPI;

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Amazon設定自動初期化');
    initializeAmazonConfig();
});

console.log('📦 Amazon設定モジュール読み込み完了');