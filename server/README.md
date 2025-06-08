# Amazon PA-API プロキシサーバー

AI掃除アドバイザー用のAmazon Product Advertising API (PA-API) プロキシサーバーです。

## 🚀 機能

- Amazon PA-APIへの安全なプロキシアクセス
- APIキーの隠蔽とセキュリティ保護
- AWS署名V4による認証
- 日本のAmazonマーケットプレイス対応
- エラーハンドリングとフォールバック機能
- CORS対応
- ヘルスチェック機能

## 📋 必要な環境

- Node.js 16.0.0以上
- Amazon アソシエイトアカウント
- Amazon PA-API アクセス権限

## 🔧 セットアップ

### 1. 依存関係のインストール

```bash
cd server
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、適切な値を設定してください：

```bash
cp .env.example .env
```

必要な環境変数：
- `PAAPI_ACCESS_KEY`: PA-APIアクセスキー
- `PAAPI_SECRET_KEY`: PA-APIシークレットキー  
- `PAAPI_ASSOC_TAG`: アソシエイトタグ

### 3. Amazon PA-API アクセス権限の取得

1. [Amazon アソシエイト・プログラム](https://affiliate.amazon.co.jp/)でアカウント作成
2. PA-APIアクセス申請を提出
3. 承認後、IAMユーザーでアクセスキーとシークレットキーを取得

## 🚀 起動方法

### 開発環境
```bash
npm run dev
```

### 本番環境
```bash
npm start
```

サーバーは `http://localhost:3001` で起動します。

## 📡 API エンドポイント

### GET /api/item
Amazon商品情報を取得します。

**パラメータ:**
- `asin` (必須): Amazon商品ID (10文字の英数字)

**例:**
```
GET /api/item?asin=B000TGNG0W
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "title": "商品名",
    "price": "¥398",
    "image": "https://images-amazon.com/...",
    "urlWithTag": "https://amazon.co.jp/dp/...",
    "rating": 4.3,
    "reviews": 1234,
    "availability": "在庫あり",
    "asin": "B000TGNG0W",
    "source": "amazon-paapi",
    "timestamp": "2025-01-05T..."
  },
  "meta": {
    "processingTime": "1250ms",
    "requestId": "uuid-here",
    "apiVersion": "1.0"
  }
}
```

### GET /api/health
サーバーのヘルスチェック

### GET /api/config
設定情報の確認（デバッグ用）

## 🔐 セキュリティ

- 環境変数による機密情報の保護
- CORS設定による安全なアクセス制御
- AWS署名V4による認証
- エラー情報の適切な隠蔽

## 🐛 トラブルシューティング

### よくあるエラー

**1. 環境変数未設定**
```
❌ 必要な環境変数が設定されていません: ['PAAPI_ACCESS_KEY']
```
→ `.env`ファイルを確認してください

**2. PA-API認証エラー**
```
❌ PA-APIエラー (403): Unauthorized
```
→ アクセスキー/シークレットキーを確認してください

**3. ASIN形式エラー**
```
無効なASIN形式
```
→ ASINは10文字の英数字である必要があります

### ログ出力例

```
🚀 Amazon PA-API プロキシサーバー起動完了
📡 ポート: 3001
🌐 マーケットプレイス: www.amazon.co.jp
🔑 アソシエイトタグ: your-tag-20
⚙️  環境: development

🚀 商品情報リクエスト受信: B000TGNG0W
🔍 PA-API商品取得開始: B000TGNG0W
✅ PA-API取得成功: B000TGNG0W
📦 商品データ変換完了: 花王 マジックリン - ¥398
✅ リクエスト完了 (1250ms): B000TGNG0W
```

## 📝 設定オプション

| 環境変数 | 説明 | 必須 | デフォルト |
|---------|------|------|------------|
| `PAAPI_ACCESS_KEY` | PA-APIアクセスキー | ✅ | - |
| `PAAPI_SECRET_KEY` | PA-APIシークレットキー | ✅ | - |
| `PAAPI_ASSOC_TAG` | アソシエイトタグ | ✅ | - |
| `PORT` | サーバーポート | ❌ | 3001 |
| `NODE_ENV` | 実行環境 | ❌ | development |
| `ALLOWED_ORIGINS` | CORS許可オリジン | ❌ | localhost |

## 🔗 関連リンク

- [Amazon PA-API ドキュメント](https://webservices.amazon.com/paapi5/documentation/)
- [Amazon アソシエイト・プログラム](https://affiliate.amazon.co.jp/)
- [AWS署名V4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)

---

© 2025 CX Mainte - AI掃除アドバイザー