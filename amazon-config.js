// Amazon Product Advertising API 設定
// 本番環境用：セキュアなAPIキー管理

window.AMAZON_CONFIG = {
    // 本番環境：サーバーサイドプロキシ経由でAPIキーを隠蔽
    useServerProxy: true, // 本番環境ではtrue、開発環境ではfalse
    proxyEndpoint: '/api/amazon-proxy', // サーバーサイドプロキシのエンドポイント
    
    // GitHub Secrets経由で設定される環境変数
    // 実際の値はGitHub Actions deployment時に注入される
    accessKey: window.ENV?.AMAZON_ACCESS_KEY || '', 
    secretKey: window.ENV?.AMAZON_SECRET_KEY || '', 
    associateTag: window.ENV?.AMAZON_ASSOCIATE_TAG || '',
    
    // API エンドポイント（日本）
    endpoint: 'webservices.amazon.co.jp',
    region: 'us-west-2', // PA-API v5では us-west-2 を使用
    
    // リクエスト設定
    marketplace: 'www.amazon.co.jp',
    
    // 商品情報取得で使用するリソース
    resources: [
        'Images.Primary.Large',
        'Images.Primary.Medium', 
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.ProductInfo',
        'Offers.Listings.Price',
        'Offers.Listings.DeliveryInfo',
        'CustomerReviews.StarRating',
        'CustomerReviews.Count'
    ]
};

// 設定検証関数
window.validateAmazonConfig = function() {
    const config = window.AMAZON_CONFIG;
    
    if (!config.accessKey || !config.secretKey || !config.associateTag) {
        console.error('❌ Amazon API設定が不完全です');
        return false;
    }
    
    if (config.accessKey.length < 10 || config.secretKey.length < 20) {
        console.error('❌ Amazon APIキーの形式が正しくありません');
        return false;
    }
    
    console.log('✅ Amazon API設定確認完了');
    return true;
};