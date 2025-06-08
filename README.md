# 🧹 AI掃除アドバイザー

画像認識AIを使用した高精度な掃除アドバイス・商品推薦システム

## 🚀 機能概要

- **📸 画像解析**: Gemini AIによる汚れの種類・場所の自動判定
- **🛒 商品推薦**: Amazon PA-API連携による適切な掃除用品の提案
- **🌍 多言語対応**: 日本語メインの直感的なインターフェース
- **📊 管理者ダッシュボード**: フィードバック分析・統計情報の確認
- **🔧 開発者モード**: システム監視・API設定・デバッグ機能

## 🎯 対応汚れタイプ

| 汚れの種類 | 推奨場所 | 対応商品カテゴリ |
|-----------|---------|----------------|
| 油汚れ | キッチン・換気扇 | アルカリ性洗剤・マジックリン |
| カビ汚れ | 浴室・お風呂 | カビキラー・カビハイター |
| 水垢 | 洗面台・シンク | クエン酸・酸性洗剤 |
| ホコリ | 床・家具 | 掃除機・フローリングワイパー |
| 黄ばみ | トイレ・衣類 | 酸素系漂白剤・トイレ用洗剤 |

## 🛠️ 技術スタック

### フロントエンド
- **HTML5/CSS3**: レスポンシブデザイン
- **JavaScript (ES6+)**: モダンなフロントエンド開発
- **Tailwind CSS**: 効率的なスタイリング
- **Chart.js**: データ可視化
- **Lucide Icons**: 美しいアイコンセット

### AI・API統合
- **Google Gemini AI**: 画像解析・自然言語処理
- **Amazon PA-API**: 商品情報取得・アフィリエイト連携
- **Node.js Express**: プロキシサーバー・API管理

### 開発・運用
- **GitHub Pages**: 静的サイトホスティング
- **GitHub Actions**: CI/CD自動化
- **WSL/Linux**: 開発環境

## 📦 プロジェクト構成

```
ai-cleaner/
├── index.html          # メインアプリケーション
├── admin.html          # 管理者ダッシュボード
├── app.js             # メインロジック
├── config.js          # 設定・商品データ
├── debug.js           # デバッグ機能
├── styles.css         # スタイルシート
├── server/            # プロキシサーバー
│   ├── proxy.js       # Amazon PA-API プロキシ
│   ├── package.json   # サーバー依存関係
│   └── README.md      # サーバー説明書
└── README.md          # プロジェクト説明
```

## 🚀 セットアップ・使用方法

### 1. GitHub Pages デプロイ

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/ai-cleaner.git
cd ai-cleaner

# GitHub Pages で自動公開
# Settings > Pages > Source: Deploy from a branch
# Branch: main / (root)
```

### 2. API設定

#### Gemini AI API
1. [Google AI Studio](https://aistudio.google.com/) でAPIキーを取得
2. `admin.html?dev=true` で開発者モードにアクセス
3. APIキーを入力・保存

#### Amazon PA-API（オプション）
1. `server/` ディレクトリでプロキシサーバーをセットアップ
2. 環境変数に Amazon Associate 情報を設定
3. Node.js サーバーを起動

### 3. アクセス方法

- **メインアプリ**: `https://YOUR_USERNAME.github.io/ai-cleaner/`
- **管理者ダッシュボード**: `https://YOUR_USERNAME.github.io/ai-cleaner/admin.html`
- **開発者モード**: `https://YOUR_USERNAME.github.io/ai-cleaner/admin.html?dev=true`

## 📊 管理機能

### 管理者ダッシュボード
- フィードバック統計・分析
- 満足度レポート
- ユーザーコメント管理
- データエクスポート機能

### 開発者モード  
- システム状態監視
- API接続テスト
- リアルタイムログ
- 設定管理・エクスポート

## 🔐 セキュリティ

- APIキーの安全な管理
- CORS設定によるアクセス制御
- 入力値の適切なバリデーション
- 機密情報の隠蔽・暗号化

## 📈 パフォーマンス

- 軽量な静的サイト設計
- CDN経由のライブラリ読み込み
- レスポンシブ対応
- 高速な画像解析

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License - 詳細は `LICENSE` ファイルを参照

## 📞 サポート

- **Issue報告**: [GitHub Issues](https://github.com/YOUR_USERNAME/ai-cleaner/issues)
- **機能要望**: [GitHub Discussions](https://github.com/YOUR_USERNAME/ai-cleaner/discussions)

---

### 🌟 主な特徴

✅ **簡単導入**: GitHub Pages で即座にデプロイ可能  
✅ **高精度AI**: Gemini AIによる精密な画像解析  
✅ **実用性**: 実際の商品推薦・購入リンク提供  
✅ **管理機能**: 包括的な分析・監視ダッシュボード  
✅ **拡張性**: モジュラー設計による機能追加の容易さ  

© 2025 CX Mainte - AI掃除アドバイザー