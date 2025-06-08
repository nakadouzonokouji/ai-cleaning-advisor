// セキュア設定（APIキーはサーバーサイドのみ）
window.ENV = {
  // セキュリティのため、機密情報はクライアントサイドに保存しません
  API_ENDPOINT: '/tools/ai-cleaner/server/amazon-proxy.php',
  VERSION: '3.0.0',
  AMAZON_ASSOCIATE_TAG: 'yourtagname-22' // アソシエイトタグのみ公開
};

console.log('🔐 セキュア設定読み込み完了');
console.log('💡 商品情報はサーバー経由で安全に取得します');
console.log('🛒 現在は開発モード - デプロイ後にAmazon API有効化');