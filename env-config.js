// XServer対応版環境設定
window.ENV = {
  // セキュリティのため、APIキーはクライアントサイドに保存しません
  // Amazon商品情報は静的データで提供します
  AMAZON_ASSOCIATE_TAG: 'yourtagname-22', // アソシエイトタグのみ使用
  GEMINI_API_KEY: '' // 必要に応じて設定
};

// 注意: XServer環境ではサーバーサイドAPIが制限されるため、
// 静的な商品情報を提供し、正確な情報は商品ページで確認していただきます