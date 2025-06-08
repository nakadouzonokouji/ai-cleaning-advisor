// 手動テスト用環境変数
// 実際のAPIキーを入力してXサーバーにアップロードしてください
window.ENV = {
  AMAZON_ACCESS_KEY: '', // あなたのAmazon Access Key IDをここに入力
  AMAZON_SECRET_KEY: '', // あなたのAmazon Secret Access Keyをここに入力
  AMAZON_ASSOCIATE_TAG: '', // あなたのアソシエイトタグをここに入力
  GEMINI_API_KEY: '' // あなたのGemini APIキーをここに入力
};

// 使用方法:
// 1. 上記の4つの値に実際のAPIキーを入力
// 2. ファイル名をenv-config.jsに変更
// 3. XサーバーのFTPでアップロード