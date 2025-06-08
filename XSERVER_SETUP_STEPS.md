# 🚀 エックスサーバー自動デプロイ - 設定手順

## 📋 準備するもの

1. **GitHubアカウント** ✅
2. **エックスサーバー契約** 
3. **FTP情報**（エックスサーバーから取得）

## 🔧 Step 1: エックスサーバーのFTP情報を確認

### エックスサーバーパネルで確認
1. エックスサーバーパネルにログイン
2. 「FTPアカウント設定」をクリック
3. 以下の情報をメモ：
   - **FTPサーバー名**: `your-account.xsrv.jp`
   - **ユーザー名**: `your-account`
   - **パスワード**: 設定したパスワード

### ディレクトリ構造
```
/public_html/
├── ai-cleaner/          # ← ここに自動デプロイ
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── ai-cleaner-server/   # ← サーバーファイル（オプション）
    ├── unified-proxy.js
    └── package.json
```

## 🔐 Step 2: GitHubシークレット設定

### 1. GitHubリポジトリの設定画面へ
```
リポジトリページ → Settings → Secrets and variables → Actions
```

### 2. 以下のシークレットを追加
**「New repository secret」をクリックして追加:**

| Name | Value | 説明 |
|------|-------|------|
| `XSERVER_FTP_HOST` | `your-account.xsrv.jp` | FTPサーバー名 |
| `XSERVER_FTP_USER` | `your-account` | FTPユーザー名 |
| `XSERVER_FTP_PASS` | `your-password` | FTPパスワード |

## 📁 Step 3: ワークフローファイル確認

以下のファイルが作成されていることを確認：
- `.github/workflows/deploy-to-xserver.yml` ✅
- `.github/workflows/deploy-server-to-xserver.yml` ✅

## 🚀 Step 4: 初回デプロイ実行

### 1. GitHubにプッシュ
```bash
git add .
git commit -m "Setup auto deploy to XSERVER"
git push origin main
```

### 2. デプロイ状況確認
1. GitHubリポジトリの「Actions」タブをクリック
2. 「Deploy AI Cleaner to XSERVER」ワークフローを確認
3. ✅緑チェックマーク = 成功
4. ❌赤バツマーク = 失敗（ログを確認）

### 3. デプロイ確認
ブラウザで確認：
```
https://your-domain.com/ai-cleaner/
```

## 🔄 Step 5: 日常の運用

### 自動デプロイ対象ファイル
以下のファイルを変更してプッシュすると自動デプロイ：
- `index.html`
- `app.js`
- `config.js`
- `styles.css`
- `admin.html`
- `debug.js`

### 運用フロー
```bash
# 1. ファイル編集
vim app.js

# 2. 変更をコミット
git add app.js
git commit -m "Update cleaning logic"

# 3. GitHubにプッシュ
git push origin main

# 4. 自動的にエックスサーバーにデプロイ 🚀
# → 2-3分後に本番サイトに反映
```

## 🐛 トラブルシューティング

### ❌ デプロイ失敗時の対処

#### 1. FTP接続エラー
```
Error: connect ECONNREFUSED
```
**対処法:**
- FTP情報を再確認
- エックスサーバーのFTP制限を確認
- パスワードが正しいか確認

#### 2. ディレクトリが存在しない
```
Error: 550 Can't change directory
```
**対処法:**
- エックスサーバーで `ai-cleaner` フォルダを手動作成
- パスが正しいか確認（`/public_html/ai-cleaner/`）

#### 3. 権限エラー
```
Error: 550 Permission denied
```
**対処法:**
- ファイル権限を確認（644推奨）
- ディレクトリ権限を確認（755推奨）

### 🔍 ログ確認方法
1. GitHub Actions画面で失敗したワークフローをクリック
2. 「Deploy to XSERVER via FTP」をクリック
3. エラーメッセージを確認

## 🎛️ 高度な設定

### 1. 特定ブランチのみデプロイ
```yaml
on:
  push:
    branches: [ main, production ]  # main と production のみ
```

### 2. 手動デプロイ有効化
```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:  # 手動実行ボタン追加
```

### 3. デプロイ通知追加
Slack通知やメール通知の設定も可能

## 📊 成功の確認方法

### ✅ デプロイ成功時
1. GitHub Actionsで緑のチェックマーク
2. エックスサーバーにファイルが更新されている
3. `https://your-domain.com/ai-cleaner/` でアクセス可能
4. 変更内容が反映されている

### 📈 運用開始後
- プッシュ後2-3分で本番反映
- エラー時はGitHub Actionsで即座に通知
- ロールバックも簡単（前のコミットをプッシュ）

## 🎉 完成！

**これで開発 → 本番環境への完全自動化が完成です！**

**運用フロー:**
```
コード変更 → git push → 自動デプロイ → 本番反映 🚀
```

---

## 📞 サポート

デプロイで問題が発生した場合：
1. GitHub Actionsのログを確認
2. エックスサーバーのFTP設定を確認
3. このドキュメントのトラブルシューティングを確認