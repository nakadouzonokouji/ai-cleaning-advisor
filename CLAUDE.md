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

## 🎯 重要機能実装計画：全場所サブロケーション対応

### 📋 完全サブロケーション体系設計
**重要事項：ユーザーの具体的清掃ニーズに完全対応するため、全場所の詳細サブロケーション実装必須**

#### **浴室** 🛁 
- 浴槽・壁天井・床・排水口・鏡洗面

#### **トイレ** 🚽
- 便器内・便座蓋・床壁・タンク・手洗い

#### **キッチン** 🔥
- シンク・ガスコンロ・IHコンロ・換気扇・食器棚

#### **リビング** 🛋️
- ソファ・絨毯・フローリング・家具・TV台

#### **窓** 🪟
- ガラス・サッシ枠・網戸・窓台・カーテン

#### **床** 🏠
- フローリング・タイル・絨毯・畳・階段

### ✅ 実装状況（最新）
- **キッチン**: シンク・換気扇完全対応（ガスコンロ・IH未実装）
- **浴室**: 全サブロケーション完全実装済み（浴槽・壁天井・床・排水口）
- **トイレ**: 全サブロケーション完全実装済み（便器内・便座蓋・床壁）
- **リビング**: 全サブロケーション完全実装済み（ソファ・絨毯・フローリング・家具・TV台）
- **窓・床**: サブ分化未実装（次期対応予定）
- **UI**: サブロケーション選択機能未実装（次期対応予定）

### 🎯 次期実装優先度
1. **重要**: キッチンガスコンロ・IH商品DB作成
2. **必須**: 全サブロケーション選択UI実装
3. **拡張**: 窓・床サブロケーション分化

## 最新状況
- デプロイパス: 正しく設定済み
- Amazon商品画像URL: 修正済み
- API統合テスト機能: 実装済み
- locationCleaners未定義エラー: 修正済み