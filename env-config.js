// 本番環境変数（GitHub Secrets経由で注入される）
window.ENV = {
  AMAZON_ACCESS_KEY: '',
  AMAZON_SECRET_KEY: '', 
  AMAZON_ASSOCIATE_TAG: '',
  GEMINI_API_KEY: ''
};

// 注意: この内容はGitHub Actionsで自動的に実際のAPIキーに置換されます