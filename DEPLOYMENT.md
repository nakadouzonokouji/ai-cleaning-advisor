# 🚀 AI掃除アドバイザー - GitHub Pages デプロイメントガイド

## 📋 前提条件

- GitHubアカウント
- Gemini APIキー（[Google AI Studio](https://aistudio.google.com/)で取得）

## 🎯 デプロイ手順

### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 「New repository」をクリック
3. リポジトリ名: `ai-cleaner`
4. 「Public」を選択
5. 「Create repository」をクリック

### 2. ファイルのアップロード

以下のファイルをGitHubリポジトリにアップロード：

```
📁 ai-cleaner/
├── 📄 index.html          # メインアプリケーション
├── 📄 admin.html          # 管理者ダッシュボード  
├── 📄 app.js             # アプリケーションロジック
├── 📄 config.js          # 設定・商品データ
├── 📄 debug.js           # デバッグ機能
├── 📄 styles.css         # スタイルシート
├── 📄 README.md          # プロジェクト説明
├── 📄 _config.yml        # Jekyll設定
├── 📄 _headers           # セキュリティヘッダー
├── 📄 .gitignore         # Git除外設定
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml # 自動デプロイ設定
└── 📁 server/            # プロキシサーバー（オプション）
    ├── 📄 proxy.js
    ├── 📄 package.json
    └── 📄 README.md
```

#### アップロード方法:
1. GitHubリポジトリページで「uploading an existing file」をクリック
2. ファイルをドラッグ&ドロップ
3. Commit messageに「Initial commit - AI掃除アドバイザー」を入力
4. 「Commit changes」をクリック

### 3. GitHub Pages の有効化

1. リポジトリの「Settings」タブをクリック
2. 左メニューの「Pages」をクリック
3. Source: 「Deploy from a branch」を選択
4. Branch: 「main」を選択
5. Folder: 「/ (root)」を選択
6. 「Save」をクリック

### 4. アクセスURL

デプロイ完了後（通常2-3分）、以下のURLでアクセス可能：

- **メインアプリ**: `https://YOUR_USERNAME.github.io/ai-cleaner/`
- **管理者ダッシュボード**: `https://YOUR_USERNAME.github.io/ai-cleaner/admin.html`
- **開発者モード**: `https://YOUR_USERNAME.github.io/ai-cleaner/admin.html?dev=true`

## ⚙️ API設定

### Gemini AI API設定

1. [Google AI Studio](https://aistudio.google.com/)でAPIキーを取得
2. デプロイしたサイトの管理者ダッシュボードにアクセス
3. パスワード: `admin123`
4. 「開発者モード」タブに切り替え
5. 「API設定管理」セクションでGemini APIキーを入力
6. 「API設定を保存」をクリック
7. 「接続テスト」で動作確認

### Amazon PA-API設定（オプション）

商品推薦機能を使用する場合：

1. [Amazon アソシエイト・プログラム](https://affiliate.amazon.co.jp/)に登録
2. PA-APIアクセス権限を取得
3. 別途プロキシサーバーをデプロイ（HerokuやVercel等）

## 🔧 カスタマイズ

### URLの変更
`_config.yml`のurlフィールドを実際のGitHub PagesのURLに変更：

```yaml
url: "https://YOUR_USERNAME.github.io"
```

### 管理者パスワードの変更
`admin.html`の598行目を編集：

```javascript
this.adminPassword = 'your_new_password'; // デフォルト: admin123
```

## 📊 監視・分析

### アクセス分析
1. 管理者ダッシュボードでユーザーフィードバックを確認
2. 満足度・利用統計をモニタリング
3. エクスポート機能でデータを保存

### エラー監視
1. 開発者モードでシステムログを確認
2. API呼び出し成功率をチェック
3. パフォーマンス統計を定期確認

## 🛠️ トラブルシューティング

### よくある問題

**❌ 404エラー**
- GitHub Pagesの設定を確認
- ファイル名・パスの大文字小文字をチェック

**❌ API接続エラー**
- Gemini APIキーの有効性を確認
- CORS設定をチェック

**❌ 画像解析が動作しない**
- ブラウザの開発者ツールでエラーを確認
- API制限・課金状況をチェック

### サポート

問題が解決しない場合：
1. [GitHub Issues](https://github.com/YOUR_USERNAME/ai-cleaner/issues)で報告
2. 開発者モードのログ情報を添付
3. エラーの詳細とスクリーンショットを提供

## 🚀 デプロイ完了チェックリスト

- [ ] GitHubリポジトリ作成完了
- [ ] 全ファイルアップロード完了
- [ ] GitHub Pages設定完了
- [ ] メインアプリにアクセス可能
- [ ] 管理者ダッシュボードにアクセス可能
- [ ] Gemini APIキー設定完了
- [ ] 画像解析機能テスト完了
- [ ] 商品推薦機能テスト完了（オプション）
- [ ] フィードバック機能テスト完了

---

**🎉 おめでとうございます！**  
AI掃除アドバイザーのデプロイが完了しました。

高精度な画像解析と実用的な掃除アドバイスをお楽しみください！