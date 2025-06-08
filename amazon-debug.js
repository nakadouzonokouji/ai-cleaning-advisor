// Amazon PA-API デバッグ・診断ツール

class AmazonAPIDebugger {
    constructor() {
        this.testASIN = 'B000TGNG0W'; // テスト用商品ASIN
        this.setupDebugPanel();
    }

    // デバッグパネルの作成
    setupDebugPanel() {
        console.log('🔧 Amazon API デバッグツール初期化');
        
        // デバッグ用グローバル関数を作成
        window.debugAmazonAPI = () => this.runFullDiagnostics();
        window.testAmazonConnection = () => this.testConnection();
        window.showAmazonConfig = () => this.showCurrentConfig();
        
        console.log('🛠️ デバッグ機能が利用可能です:');
        console.log('  - window.debugAmazonAPI() : 完全診断');
        console.log('  - window.testAmazonConnection() : 接続テスト');
        console.log('  - window.showAmazonConfig() : 設定表示');
    }

    // 完全診断の実行
    async runFullDiagnostics() {
        console.log('🔍 Amazon API 完全診断開始');
        console.log('========================================');
        
        // 1. 環境変数チェック
        console.log('1️⃣ 環境変数チェック');
        this.checkEnvironmentVariables();
        
        // 2. 設定ファイルチェック
        console.log('\n2️⃣ 設定ファイルチェック');
        this.checkConfigFiles();
        
        // 3. API設定検証
        console.log('\n3️⃣ API設定検証');
        this.validateAPIConfiguration();
        
        // 4. 接続テスト
        console.log('\n4️⃣ 接続テスト');
        await this.testConnection();
        
        console.log('\n========================================');
        console.log('🔍 診断完了');
    }

    // 環境変数チェック
    checkEnvironmentVariables() {
        const env = window.ENV || {};
        
        console.log('📊 window.ENV の状態:', {
            定義済み: typeof window.ENV !== 'undefined',
            AMAZON_ACCESS_KEY: env.AMAZON_ACCESS_KEY ? '設定済み' : '未設定',
            AMAZON_SECRET_KEY: env.AMAZON_SECRET_KEY ? '設定済み' : '未設定',
            AMAZON_ASSOCIATE_TAG: env.AMAZON_ASSOCIATE_TAG ? '設定済み' : '未設定'
        });
        
        if (!window.ENV) {
            console.error('❌ window.ENV が定義されていません');
            console.log('💡 解決方法: env-config.js ファイルが正しく読み込まれているか確認');
        }
    }

    // 設定ファイルチェック
    checkConfigFiles() {
        console.log('📁 必要なファイルの存在確認:');
        
        const requiredFiles = [
            'window.AMAZON_CONFIG',
            'window.amazonAPI', 
            'window.validateAmazonConfig'
        ];
        
        requiredFiles.forEach(file => {
            const exists = this.getNestedProperty(window, file.replace('window.', ''));
            console.log(`  ${file}: ${exists ? '✅ 存在' : '❌ 未定義'}`);
        });
    }

    // API設定検証
    validateAPIConfiguration() {
        if (typeof window.validateAmazonConfig === 'function') {
            const isValid = window.validateAmazonConfig();
            console.log(`🔑 API設定状態: ${isValid ? '✅ 有効' : '❌ 無効'}`);
            
            if (!isValid && window.AMAZON_CONFIG) {
                console.log('🔧 設定の詳細:');
                const config = window.AMAZON_CONFIG;
                console.log('  Access Key:', config.accessKey ? `${config.accessKey.substring(0, 8)}...` : '未設定');
                console.log('  Secret Key:', config.secretKey ? `${config.secretKey.substring(0, 8)}...` : '未設定');
                console.log('  Associate Tag:', config.associateTag || '未設定');
            }
        } else {
            console.error('❌ validateAmazonConfig 関数が見つかりません');
        }
    }

    // 接続テスト
    async testConnection() {
        if (!window.amazonAPI) {
            console.error('❌ Amazon API インスタンスが見つかりません');
            return;
        }

        if (!window.validateAmazonConfig || !window.validateAmazonConfig()) {
            console.error('❌ Amazon API設定が無効のため接続テストをスキップ');
            return;
        }

        try {
            console.log('🌐 Amazon API 接続テスト開始...');
            console.log(`📦 テスト商品ASIN: ${this.testASIN}`);
            
            const startTime = Date.now();
            const result = await window.amazonAPI.getItems([this.testASIN]);
            const duration = Date.now() - startTime;
            
            if (result && result[this.testASIN]) {
                console.log(`✅ 接続テスト成功 (${duration}ms)`);
                console.log('📊 取得データ:', result[this.testASIN]);
            } else {
                console.warn('⚠️ 接続はできましたが、データが取得できませんでした');
                console.log('📊 レスポンス:', result);
            }
            
        } catch (error) {
            console.error('❌ 接続テスト失敗:', error);
            this.analyzeError(error);
        }
    }

    // 現在の設定表示
    showCurrentConfig() {
        console.log('🔧 現在のAmazon API設定:');
        
        if (window.AMAZON_CONFIG) {
            const config = window.AMAZON_CONFIG;
            console.log({
                endpoint: config.endpoint,
                region: config.region,
                marketplace: config.marketplace,
                useServerProxy: config.useServerProxy,
                proxyEndpoint: config.proxyEndpoint,
                accessKeySet: !!config.accessKey,
                secretKeySet: !!config.secretKey,
                associateTagSet: !!config.associateTag,
                resources: config.resources
            });
        } else {
            console.error('❌ AMAZON_CONFIG が見つかりません');
        }
    }

    // エラー分析
    analyzeError(error) {
        console.log('🔍 エラー分析:');
        
        if (error.message.includes('CORS')) {
            console.log('💡 CORS エラーです。サーバーサイドプロキシの使用を検討してください。');
        } else if (error.message.includes('403')) {
            console.log('💡 認証エラーです。APIキーを確認してください。');
        } else if (error.message.includes('400')) {
            console.log('💡 リクエストエラーです。リクエスト形式を確認してください。');
        } else if (error.message.includes('Network')) {
            console.log('💡 ネットワークエラーです。インターネット接続を確認してください。');
        } else {
            console.log('💡 その他のエラーです。詳細を確認してください。');
        }
    }

    // ネストされたプロパティを安全に取得
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
}

// デバッグツールの初期化
document.addEventListener('DOMContentLoaded', () => {
    window.amazonDebugger = new AmazonAPIDebugger();
});

console.log('🔧 Amazon API デバッグツール読み込み完了');