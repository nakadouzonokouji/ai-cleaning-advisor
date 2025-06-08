// 環境変数設定ファイル
// 本番環境では GitHub Secrets 経由で値を注入

// 環境変数を window.ENV オブジェクトとして公開
window.ENV = {
    // Amazon PA-API 設定
    AMAZON_ACCESS_KEY: '',  // GitHub Secrets から注入
    AMAZON_SECRET_KEY: '',  // GitHub Secrets から注入  
    AMAZON_ASSOCIATE_TAG: '', // GitHub Secrets から注入
    
    // Google Gemini AI API 設定
    GEMINI_API_KEY: '',     // GitHub Secrets から注入
    
    // 開発環境用（実際の値は.envファイルから取得）
    // 本番環境では GitHub Actions で上書きされる
};

// 開発環境での設定読み込み（サーバーサイドで.envから注入される場合）
if (typeof process !== 'undefined' && process.env) {
    window.ENV.AMAZON_ACCESS_KEY = process.env.PAAPI_ACCESS_KEY || process.env.AMAZON_ACCESS_KEY || '';
    window.ENV.AMAZON_SECRET_KEY = process.env.PAAPI_SECRET_KEY || process.env.AMAZON_SECRET_KEY || '';
    window.ENV.AMAZON_ASSOCIATE_TAG = process.env.PAAPI_ASSOC_TAG || process.env.AMAZON_ASSOCIATE_TAG || '';
    window.ENV.GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
}

console.log('🔧 環境変数設定ファイル読み込み完了');
console.log('📊 Amazon API設定状況:', {
    accessKey: window.ENV.AMAZON_ACCESS_KEY ? '設定済み' : '未設定',
    secretKey: window.ENV.AMAZON_SECRET_KEY ? '設定済み' : '未設定',
    associateTag: window.ENV.AMAZON_ASSOCIATE_TAG ? '設定済み' : '未設定'
});