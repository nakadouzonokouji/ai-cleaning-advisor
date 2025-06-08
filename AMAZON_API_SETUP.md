# Amazon PA-API 設定手順書

## 🔍 現在の問題
- Amazon PA-API統合が動作せず、フォールバック処理になっている
- 環境変数が正しく設定されていない
- API認証情報が不足または無効

## 🛠️ 解決手順

### 1. Amazon PA-API アカウント設定

#### 1.1 Amazonアソシエイトプログラム登録
1. [Amazon アソシエイト](https://affiliate.amazon.co.jp/)にアクセス
2. アカウント作成・ログイン
3. サイト情報を登録して承認を得る

#### 1.2 PA-API アクセス申請
1. アソシエイト管理画面から「ツール」→「Product Advertising API」
2. PA-APIアクセスを申請
3. 承認後、APIキーを取得

### 2. 環境変数の設定

#### 2.1 ローカル開発環境
`.env`ファイルに実際のキーを設定:
```env
# Amazon PA-API 設定
PAAPI_ACCESS_KEY=AKIA1234567890ABCDEF  # 実際のアクセスキー
PAAPI_SECRET_KEY=abcdefghijk1234567890ABCDEFGHIJK1234567890  # 実際のシークレットキー
PAAPI_ASSOC_TAG=yourtagname-22  # 実際のアソシエイトタグ

# Gemini AI API設定
GEMINI_API_KEY=AIzaSyAbCdEf1234567890GhIjKlMnOpQrStUvWxYz  # 実際のAPIキー
```

#### 2.2 本番環境（GitHub Actions）
GitHub Secrets に以下を設定:
- `AMAZON_ACCESS_KEY`
- `AMAZON_SECRET_KEY` 
- `AMAZON_ASSOCIATE_TAG`
- `GEMINI_API_KEY`

### 3. 設定確認方法

#### 3.1 ブラウザコンソールでの診断
```javascript
// 完全診断の実行
debugAmazonAPI();

// 個別チェック
showAmazonConfig();
testAmazonConnection();
```

#### 3.2 期待される出力
```
✅ Amazon API設定確認完了
🛒 Amazon API呼び出し: 1商品
✅ Amazon商品情報取得完了: 1商品
```

### 4. トラブルシューティング

#### 4.1 よくある問題と解決方法

**問題**: `❌ Amazon API設定が不完全です`
**原因**: 環境変数が正しく読み込まれていない
**解決**: 
1. `env-config.js`が正しく読み込まれているか確認
2. `.env`ファイルの内容確認
3. GitHub Secrets の設定確認

**問題**: `❌ Amazon APIキーの形式が正しくありません`
**原因**: APIキーが例の値のまま、または形式が間違っている
**解決**:
1. Amazon PA-APIから実際のキーを取得
2. アクセスキー: 20文字（AKIA...）
3. シークレットキー: 40文字
4. アソシエイトタグ: `tag-22`形式

**問題**: CORS エラー
**原因**: ブラウザから直接Amazon APIを呼び出そうとしている
**解決**: サーバーサイドプロキシを使用（amazon-proxy.js）

#### 4.2 デバッグログの確認ポイント

1. **環境変数の読み込み**
   ```
   🔧 環境変数設定ファイル読み込み完了
   📊 Amazon API設定状況: { accessKey: '設定済み', ... }
   ```

2. **API設定の検証**
   ```
   🔍 Amazon API設定検証開始
   ✅ Amazon API設定確認完了
   ```

3. **API呼び出し**
   ```
   🛒 Amazon API呼び出し: X個商品
   ✅ Amazon商品情報取得完了: X商品
   ```

### 5. 本番デプロイ時の注意事項

1. **GitHub Secrets の設定**
   - リポジトリ設定 → Secrets and variables → Actions
   - 必要なシークレットを全て設定

2. **env-config.js の更新**
   - GitHub Actions で環境変数を注入する処理を追加

3. **CORS 対応**
   - 本番環境ではサーバーサイドプロキシを使用
   - 直接API呼び出しは制限される

### 6. 監視とメンテナンス

#### 6.1 定期チェック項目
- API利用制限の確認
- アソシエイトプログラムの状態確認
- エラーログの監視

#### 6.2 パフォーマンス最適化
- キャッシュの活用（1時間）
- バッチでの商品情報取得
- 適切なエラーハンドリング

## 🔗 関連リンク

- [Amazon Product Advertising API Documentation](https://webservices.amazon.com/paapi5/documentation/)
- [Amazon アソシエイトプログラム](https://affiliate.amazon.co.jp/)
- [PA-API 5.0 Getting Started](https://webservices.amazon.com/paapi5/documentation/quick-start/)

## 📞 サポート

問題が解決しない場合は、以下の情報を含めてサポートに連絡:
1. デバッグログの出力
2. 設定ファイルの内容（キーは除く）
3. エラーメッセージの詳細