# 🚀 AI掃除アドバイザー統合サーバー セットアップガイド

## 📋 概要

このサーバーは以下の機能を統合します：
- **Gemini AI画像解析**: あなたのAPIキーで画像を分析
- **Amazon PA-API商品取得**: あなたのAPIキーで商品情報を取得
- **ユーザー向けサービス**: APIキー不要でサービス利用
- **収益化**: Amazonアソシエイト手数料があなたの収益

## 🎯 デプロイ方法（3つの選択肢）

### 選択肢1: GitHub Codespaces（推奨・無料）

#### 1. Codespacesの作成
1. GitHubの`ai-cleaner`リポジトリページ
2. **「<> Code」** → **「Codespaces」** → **「Create codespace on main」**

#### 2. サーバーセットアップ
```bash
# 依存関係のインストール
cd server
npm install

# 環境変数の設定
export GEMINI_API_KEY="あなたのGeminiAPIキー"
export PAAPI_ACCESS_KEY="あなたのAmazonアクセスキー"
export PAAPI_SECRET_KEY="あなたのAmazonシークレットキー"
export PAAPI_ASSOC_TAG="あなたのアソシエイトタグ"
export ALLOWED_ORIGINS="https://nakadouzonokouji.github.io"

# サーバー起動
npm start
```

#### 3. URL取得
起動後、Codespacesが提供するURLをコピー（例：`https://curly-parakeet-xxx.app.github.dev`）

### 選択肢2: Heroku

#### 1. Herokuアプリ作成
```bash
# Heroku CLIでアプリ作成
heroku create ai-cleaner-server-your-name

# 環境変数設定
heroku config:set GEMINI_API_KEY="あなたのGeminiAPIキー"
heroku config:set PAAPI_ACCESS_KEY="あなたのAmazonアクセスキー"
heroku config:set PAAPI_SECRET_KEY="あなたのAmazonシークレットキー"
heroku config:set PAAPI_ASSOC_TAG="あなたのアソシエイトタグ"
heroku config:set ALLOWED_ORIGINS="https://nakadouzonokouji.github.io"

# デプロイ
git subtree push --prefix server heroku main
```

### 選択肢3: Vercel

#### 1. Vercelデプロイ
```bash
# Vercel CLIでデプロイ
cd server
npx vercel

# 環境変数設定（Vercelダッシュボードで）
# GEMINI_API_KEY
# PAAPI_ACCESS_KEY
# PAAPI_SECRET_KEY
# PAAPI_ASSOC_TAG
# ALLOWED_ORIGINS
```

## 🔧 フロントエンド設定更新

サーバーデプロイ後、フロントエンドを更新：

### 1. app.jsのサーバーURL更新
```javascript
// app.js 30行目付近
this.serverConfig = {
    baseUrl: 'https://あなたのサーバーURL', // 実際のURLに変更
    endpoints: {
        analyze: '/api/analyze',
        product: '/api/product',
        health: '/api/health'
    }
};
```

### 2. GitHubに更新をプッシュ
1. `app.js`を編集
2. GitHubリポジトリで`app.js`を更新
3. GitHub Pagesが自動更新（2-3分）

## 🧪 動作テスト

### 1. サーバーヘルスチェック
```bash
curl https://あなたのサーバーURL/api/health
```

### 2. 画像解析テスト
```bash
curl -X POST https://あなたのサーバーURL/api/analyze \\
  -F "image=@test-image.jpg" \\
  -F "location=キッチン"
```

### 3. フロントエンド統合テスト
1. `https://nakadouzonokouji.github.io/ai-cleaner/`
2. 画像をアップロード
3. 場所を選択
4. 「AI掃除方法を生成」をクリック
5. 結果が表示されることを確認

## 📊 API エンドポイント

### POST /api/analyze
**機能**: 画像解析＋商品推薦
```javascript
// リクエスト
FormData {
  image: File,
  location: "キッチン",
  surface: "ステンレス"
}

// レスポンス
{
  success: true,
  analysis: {
    dirtType: "油汚れ",
    severity: "中程度",
    surface: "ステンレス",
    confidence: 92,
    recommendedMethod: "アルカリ性洗剤で清拭"
  },
  products: [
    {
      title: "花王 マジックリン",
      price: "¥398",
      image: "https://...",
      urlWithTag: "https://amazon.co.jp/dp/...?tag=your-tag",
      rating: 4.3,
      asin: "B000TGNG0W"
    }
  ]
}
```

### GET /api/product/:asin
**機能**: 個別商品情報取得

### GET /api/health
**機能**: サーバー状態確認

### GET /api/stats
**機能**: 統計情報取得

## 🔐 セキュリティ設定

### 1. CORS設定
```javascript
ALLOWED_ORIGINS=https://nakadouzonokouji.github.io
```

### 2. APIキー保護
- 環境変数での管理
- サーバーサイドのみで使用
- フロントエンドには露出しない

### 3. リクエスト制限
- ファイルサイズ制限: 10MB
- リクエストタイムアウト: 30秒

## 💰 収益化の仕組み

### Amazon アソシエイト収益
1. **商品推薦**: AIが適切な商品を推薦
2. **アフィリエイトリンク**: あなたのアソシエイトタグ付きURL
3. **収益発生**: ユーザーが購入した場合の手数料

### 収益最大化のポイント
- **高精度AI分析**: より適切な商品推薦
- **多様な商品**: 各汚れタイプに最適な商品
- **ユーザー体験**: 使いやすいインターフェース

## 🚨 トラブルシューティング

### よくある問題

**❌ サーバーが起動しない**
- 環境変数の設定を確認
- npm installが完了しているか確認

**❌ 画像解析が失敗する**
- Gemini APIキーの有効性を確認
- API制限・課金状況をチェック

**❌ 商品取得が失敗する**
- Amazon PA-APIキーを確認
- アソシエイトタグの有効性を確認

**❌ CORS エラー**
- ALLOWED_ORIGINSにGitHub PagesのURLが含まれているか確認

### ログ確認方法
```bash
# Codespacesの場合
npm start

# Herokuの場合
heroku logs --tail

# Vercelの場合
vercel logs
```

## 📈 スケーリング

### 成長に応じた改善案
1. **専用サーバー**: AWS/GCPでの本格運用
2. **キャッシュ**: Redis等でレスポンス高速化
3. **CDN**: 画像配信の最適化
4. **分析改善**: より精密なAI分析
5. **商品データベース**: より豊富な商品選択

---

## ✅ セットアップ完了チェックリスト

- [ ] サーバーデプロイ完了
- [ ] 環境変数設定完了
- [ ] ヘルスチェック成功
- [ ] フロントエンドURL更新
- [ ] 画像解析テスト成功
- [ ] 商品推薦テスト成功
- [ ] Amazon収益リンク確認
- [ ] エラーハンドリング確認

**🎉 おめでとうございます！**
AI掃除アドバイザーのビジネス版が完成しました！