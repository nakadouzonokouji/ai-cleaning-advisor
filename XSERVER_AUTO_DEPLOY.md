# 🚀 GitHub → エックスサーバー 自動デプロイ設定ガイド

## 📋 概要

GitHubにプッシュしたら、エックスサーバーに自動的にファイルがアップロードされる仕組みを構築します。

## 🎯 利用可能な方法

### 1. GitHub Actions + FTP（推奨）

**メリット:**
- ✅ 完全自動化
- ✅ 無料
- ✅ エラー通知
- ✅ ログ確認可能

**仕組み:**
```
GitHub Push → GitHub Actions → FTP/SFTP → エックスサーバー
```

### 2. Webhook + 自作スクリプト

**メリット:**
- ✅ カスタマイズ可能
- ✅ 高速

**デメリット:**
- ❌ サーバー側にスクリプト必要
- ❌ セットアップ複雑

## 🔧 GitHub Actions設定（推奨方法）

### 1. エックスサーバーFTP情報を準備

**必要な情報:**
- FTPサーバー: `your-domain.xsrv.jp`
- FTPユーザー名: `your-username`
- FTPパスワード: `your-password`
- アップロード先: `/public_html/` または `/public_html/ai-cleaner/`

### 2. GitHubシークレット設定

リポジトリの設定で以下を追加:

```
Settings → Secrets and variables → Actions → New repository secret
```

**追加するシークレット:**
- `FTP_SERVER`: `your-domain.xsrv.jp`
- `FTP_USERNAME`: `your-username`
- `FTP_PASSWORD`: `your-password`

### 3. GitHub Actionsワークフロー作成

`.github/workflows/deploy.yml` を作成:

```yaml
name: Deploy to XSERVER

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Deploy to XSERVER via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: /public_html/ai-cleaner/
        exclude: |
          .git*
          .github*
          node_modules*
          server*
          *.md
          .env*
```

### 4. 部分的デプロイ（フロントエンドのみ）

特定ファイルのみデプロイしたい場合:

```yaml
name: Deploy Frontend to XSERVER

on:
  push:
    branches: [ main ]
    paths:
      - 'index.html'
      - 'app.js'
      - 'config.js'
      - 'styles.css'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Deploy specific files
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: /public_html/ai-cleaner/
        exclude: |
          .git*
          .github*
          node_modules*
          server*
          *.md
          .env*
          debug.js
          admin.html
```

## 🔐 セキュリティ強化版（SFTP使用）

エックスサーバーでSFTPが利用可能な場合:

```yaml
name: Secure Deploy to XSERVER

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Deploy via SFTP
      uses: wlixcc/SFTP-Deploy-Action@v1.2.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local_path: './*'
        remote_path: '/public_html/ai-cleaner'
        sftp_only: true
        delete_remote_files: false
```

## 📁 エックスサーバー側の設定

### 1. ディレクトリ構造

```
/public_html/
├── ai-cleaner/          # メインアプリ
│   ├── index.html
│   ├── app.js
│   ├── config.js
│   └── styles.css
├── server/              # Node.jsサーバー（別途設定）
│   ├── unified-proxy.js
│   └── package.json
└── .htaccess           # 必要に応じて
```

### 2. .htaccess設定（オプション）

```apache
# CORS設定
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>

# HTTPS強制
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# キャッシュ設定
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
</IfModule>
```

## 🎛️ 高度な設定オプション

### 1. 環境別デプロイ

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches: [ main, staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Deploy to Production
      if: github.ref == 'refs/heads/main'
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.PROD_FTP_SERVER }}
        username: ${{ secrets.PROD_FTP_USERNAME }}
        password: ${{ secrets.PROD_FTP_PASSWORD }}
        server-dir: /public_html/ai-cleaner/
        
    - name: Deploy to Staging
      if: github.ref == 'refs/heads/staging'
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.STAGING_FTP_SERVER }}
        username: ${{ secrets.STAGING_FTP_USERNAME }}
        password: ${{ secrets.STAGING_FTP_PASSWORD }}
        server-dir: /public_html/staging/ai-cleaner/
```

### 2. ビルド処理付きデプロイ

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to XSERVER
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/ai-cleaner/
```

## 🔄 実際の運用手順

### 1. 初回設定
```bash
# 1. リポジトリにワークフローファイル追加
mkdir -p .github/workflows
# deploy.yml を作成

# 2. GitHubでシークレット設定
# Settings → Secrets → FTP情報を追加

# 3. プッシュして動作確認
git add .
git commit -m "Add auto deploy workflow"
git push origin main
```

### 2. 日常の運用
```bash
# 通常の開発
git add .
git commit -m "Update cleaning method"
git push origin main

# → 自動的にエックスサーバーにデプロイ
```

## 📊 デプロイ状況の確認

### 1. GitHub Actionsログ
- `Actions` タブでデプロイ状況確認
- エラー時は詳細ログを確認

### 2. 通知設定
```yaml
    - name: Notify on success
      if: success()
      run: echo "Deploy successful!"
      
    - name: Notify on failure
      if: failure()
      run: echo "Deploy failed!"
```

## ⚠️ 注意点

### 1. セキュリティ
- ✅ FTP情報は必ずGitHubシークレットで管理
- ❌ 絶対にコードに直接書かない

### 2. ファイル除外
- `node_modules/` は除外必須
- `.env` ファイルは除外必須
- 開発用ファイルは除外推奨

### 3. エックスサーバー制限
- 同時FTP接続数制限
- ファイルサイズ制限
- 転送速度制限

## 🎉 完成イメージ

**操作:**
```bash
git push origin main
```

**結果:**
1. GitHub Actionsが自動実行
2. エックスサーバーにファイル転送
3. `https://your-domain.com/ai-cleaner/` で即座にアクセス可能

---

**これで開発→本番環境への完全自動化が完成します！**