 /**
   * AI掃除アドバイザー 統合プロキシサーバー
   * CX Mainte © 2025
   */

  const express = require('express');
  const cors = require('cors');
  const crypto = require('crypto');

  const app = express();
  const PORT = process.env.PORT || 3001;

  // CORS設定
  app.use(cors({
      origin: [
          'https://nakadouzonokouji.github.io',
          'http://localhost:3000'
      ],
      methods: ['GET', 'POST']
  }));

  app.use(express.json({ limit: '10mb' }));

  // 環境変数確認
  const API_CONFIG = {
      gemini: { apiKey: process.env.GEMINI_API_KEY },
      amazon: {
          accessKey: process.env.PAAPI_ACCESS_KEY,
          secretKey: process.env.PAAPI_SECRET_KEY,
          associateTag: process.env.PAAPI_ASSOC_TAG
      }
  };

  // 画像解析エンドポイント
  app.post('/api/analyze', async (req, res) => {
      console.log('🚀 画像解析リクエスト受信');

      // デモ用レスポンス
      const result = {
          success: true,
          analysis: {
              dirtType: "油汚れ",
              surface: req.body.location || "キッチン",
              confidence: 85,
              recommendedMethod: "アルカリ性洗剤で清拭してください"
          },
          products: [{
              title: "花王 マジックリン",
              price: "¥398",
              urlWithTag: `https://www.amazon.co.jp/dp/B000TGNG0W?tag=${API_CONFIG.amazon.associateTag}`,
              asin: "B000TGNG0W"
          }]
      };

      res.json(result);
  });

  // ヘルスチェック
  app.get('/api/health', (req, res) => {
      res.json({
          status: 'healthy',
          services: {
              gemini: !!API_CONFIG.gemini.apiKey,
              amazon: !!API_CONFIG.amazon.accessKey
          }
      });
  });

  // サーバー起動
  app.listen(PORT, () => {
      console.log(`🚀 統合サーバー起動: ポート ${PORT}`);
      console.log(`🤖 Gemini: ${API_CONFIG.gemini.apiKey ? '設定済み' : '未設定'}`);
      console.log(`🛒 Amazon: ${API_CONFIG.amazon.accessKey ? '設定済み' : '未設定'}`);
  });