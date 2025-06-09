# Claude Code 継続作業メモ

## 🚨 重要：エックスサーバーデプロイパス

**この設定を絶対に間違えないこと！新しいスレッドでも必ず参照**

### ✅ 正解設定
- **デプロイパス**: `/cxmainte.com/public_html/tools/ai-cleaner/`
- **目的URL**: `https://cxmainte.com/tools/ai-cleaner/`
- **ファイルマネージャー確認先**: `https://webftp-sv6095.xserver.jp/cxmainte.com/public_html/tools/ai-cleaner`

### ❌ よくある間違い
- **間違いパス**: `/public_html/tools/ai-cleaner/`
- **結果**: XServerのサブドメインにデプロイされてしまう
- **この間違いは何度も繰り返されている**

### GitHub Actions設定
```yaml
- name: Deploy via FTP
  uses: SamKirkland/FTP-Deploy-Action@4.3.3
  with:
    server: ${{ secrets.XSERVER_FTP_HOST }}
    username: ${{ secrets.XSERVER_FTP_USER }}
    password: ${{ secrets.XSERVER_FTP_PASS }}
    local-dir: "upload/"
    server-dir: "/cxmainte.com/public_html/tools/ai-cleaner/"  # ← この設定が重要
```

## 作業ルール

### コード修正時の必須手順
1. ローカルで修正
2. `git add` → `git commit` → `git push origin master`
3. GitHub Actionsが自動的に正しいパスにデプロイ
4. **必ずファイルマネージャーで更新時刻を確認**

### Repository Secrets設定済み
- AMAZON_ACCESS_KEY
- AMAZON_SECRET_KEY  
- AMAZON_ASSOCIATE_TAG
- GEMINI_API_KEY
- XSERVER_FTP_HOST
- XSERVER_FTP_USER
- XSERVER_FTP_PASS

## プロジェクト概要
- AI掃除アドバイザーWebアプリケーション
- 一般ユーザーがクラウドで使用
- Amazon PA-API統合でリアルタイム商品情報表示
- Gemini API統合でAI画像解析機能

## 最新状況
- デプロイパス: 正しく設定済み
- Amazon商品画像URL: 修正済み
- API統合テスト機能: 実装済み