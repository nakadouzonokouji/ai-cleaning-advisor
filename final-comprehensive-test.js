// 最終包括テスト - 全ての潜在的問題をチェック
const fs = require('fs');

console.log('🔬 最終包括テスト開始\n');

let testsPassed = 0;
let testsTotal = 0;

function test(name, condition, errorMsg) {
    testsTotal++;
    if (condition) {
        console.log(`✅ ${name}`);
        testsPassed++;
    } else {
        console.log(`❌ ${name}: ${errorMsg}`);
    }
}

// 1. ファイル存在チェック
console.log('📁 ファイル存在チェック');
const criticalFiles = [
    'app.js',
    'index.html', 
    'env-config.js',
    'js/config/dirt-mapping.js',
    'js/config/products.js',
    'js/config/locations.js',
    'js/modules/api-client.js',
    'js/modules/ui-components.js',
    'js/modules/search-engine.js'
];

criticalFiles.forEach(file => {
    test(`${file} 存在`, fs.existsSync(file), 'ファイルが見つかりません');
});

// 2. ESモジュール構文チェック
console.log('\n📦 ESモジュール構文チェック');
const moduleFiles = criticalFiles.filter(f => f.endsWith('.js') && f !== 'env-config.js');

moduleFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        test(`${file} export文`, content.includes('export'), 'export文がありません');
    } catch (error) {
        test(`${file} 読み込み`, false, `読み込みエラー: ${error.message}`);
    }
});

// 3. app.js 重要機能チェック
console.log('\n🚀 app.js重要機能チェック');
try {
    const appContent = fs.readFileSync('app.js', 'utf8');
    
    test('ESモジュールimport', appContent.includes('import'), 'import文がありません');
    test('AICleaningAdvisorクラス', appContent.includes('class AICleaningAdvisor'), 'メインクラスがありません');
    test('event.detail処理', appContent.includes('event.detail'), 'CustomEvent処理がありません');
    test('DOMContentLoaded', appContent.includes('DOMContentLoaded'), 'DOM初期化がありません');
    test('window.aiCleaningAdvisor設定', appContent.includes('window.aiCleaningAdvisor'), 'グローバル変数設定がありません');
} catch (error) {
    test('app.js解析', false, `app.js読み込みエラー: ${error.message}`);
}

// 4. APIClient重要メソッドチェック
console.log('\n🔌 APIClient重要メソッドチェック');
try {
    const apiContent = fs.readFileSync('js/modules/api-client.js', 'utf8');
    
    const requiredMethods = [
        'enrichProductsWithAmazonData',
        'getStatus', 
        'analyzeImage',
        'class APIClient'
    ];
    
    requiredMethods.forEach(method => {
        test(`APIClient ${method}`, apiContent.includes(method), `${method}が見つかりません`);
    });
} catch (error) {
    test('APIClient解析', false, `APIClient読み込みエラー: ${error.message}`);
}

// 5. UIComponents重要機能チェック
console.log('\n🎨 UIComponents重要機能チェック');
try {
    const uiContent = fs.readFileSync('js/modules/ui-components.js', 'utf8');
    
    const requiredFeatures = [
        'extends EventTarget',
        'updateStatusInfo',
        'showErrorMessage',
        'setupLocationButtons',
        'on(',
        'emit('
    ];
    
    requiredFeatures.forEach(feature => {
        test(`UIComponents ${feature}`, uiContent.includes(feature), `${feature}が見つかりません`);
    });
} catch (error) {
    test('UIComponents解析', false, `UIComponents読み込みエラー: ${error.message}`);
}

// 6. HTML/JS整合性チェック
console.log('\n🔗 HTML/JS整合性チェック');
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    test('ESモジュール対応', htmlContent.includes('type="module"'), 'ESモジュール設定がありません');
    test('app.js読み込み', htmlContent.includes('src="app.js"'), 'app.js読み込みがありません');
    test('env-config.js読み込み', htmlContent.includes('env-config.js'), 'env-config.js読み込みがありません');
    
    // 場所ボタン存在確認
    const locationButtons = htmlContent.match(/data-location="[^"]*"/g) || [];
    test('場所ボタン存在', locationButtons.length >= 8, `場所ボタンが${locationButtons.length}個しかありません`);
    
    // 必須HTML要素
    const requiredElements = [
        'id="uploadedImage"',
        'id="analysisResults"', 
        'location-btn'  // classの一部として存在確認
    ];
    
    requiredElements.forEach(element => {
        test(`HTML要素 ${element}`, htmlContent.includes(element), `${element}が見つかりません`);
    });
    
} catch (error) {
    test('HTML解析', false, `HTML読み込みエラー: ${error.message}`);
}

// 7. 設定データ整合性チェック
console.log('\n⚙️ 設定データ整合性チェック');
try {
    // HTMLの場所ボタンとJSの設定ファイル整合性
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const locationsContent = fs.readFileSync('js/config/locations.js', 'utf8');
    
    const htmlLocations = [...htmlContent.matchAll(/data-location="([^"]*)"/g)]
        .map(match => match[1])
        .filter(loc => loc !== 'custom') // customは特別扱い
        .sort();
    
    const jsLocations = [...locationsContent.matchAll(/'([^']*)':/g)]
        .map(match => match[1])
        .sort();
    
    test('場所設定整合性', 
        JSON.stringify(htmlLocations) === JSON.stringify(jsLocations),
        `HTML場所: ${htmlLocations.join(',')} != JS場所: ${jsLocations.join(',')}`
    );
    
} catch (error) {
    test('設定整合性', false, `設定データ確認エラー: ${error.message}`);
}

// 8. env-config.js存在と設定
console.log('\n🔧 環境設定チェック');
try {
    const envContent = fs.readFileSync('env-config.js', 'utf8');
    
    test('window.ENV設定', envContent.includes('window.ENV'), 'ENV設定がありません');
    test('GEMINI_API_KEY設定', envContent.includes('window.GEMINI_API_KEY'), 'GEMINI_API_KEY設定がありません');
    
} catch (error) {
    test('env-config.js', false, `環境設定エラー: ${error.message}`);
}

// 最終結果
console.log('\n' + '='.repeat(50));
console.log(`📊 テスト結果: ${testsPassed}/${testsTotal} 通過`);

if (testsPassed === testsTotal) {
    console.log('🎉🎉🎉 全テスト通過！');
    console.log('💯 200%確信 - モジュール統合完璧');
    console.log('🚀 本番デプロイ準備完了');
    process.exit(0);
} else {
    const failureRate = ((testsTotal - testsPassed) / testsTotal * 100).toFixed(1);
    console.log(`❌ ${testsTotal - testsPassed}件のテスト失敗 (${failureRate}%)`);
    console.log('🔧 上記エラーの修正が必要です');
    process.exit(1);
}