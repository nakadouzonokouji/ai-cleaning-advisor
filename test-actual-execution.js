// 実際のモジュール動作テスト
// ESModules環境をエミュレートしてテスト

const fs = require('fs');
const vm = require('vm');

console.log('🧪 実際のモジュール実行テスト開始');

// グローバルオブジェクトをセットアップ
const globalContext = {
  console,
  window: {},
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({}),
    addEventListener: () => {},
    readyState: 'complete'
  },
  EventTarget: class EventTarget {
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {}
  },
  CustomEvent: class CustomEvent {
    constructor(type, options) {
      this.type = type;
      this.detail = options?.detail;
    }
  }
};

async function testModule(modulePath, testName) {
  try {
    console.log(`\n🔍 テスト開始: ${testName}`);
    
    // ファイル読み込み
    const content = fs.readFileSync(modulePath, 'utf8');
    
    // export文をmodule.exports形式に変換（簡易）
    let convertedContent = content
      .replace(/export\s+const\s+(\w+)/g, 'const $1')
      .replace(/export\s+class\s+(\w+)/g, 'class $1')
      .replace(/export\s+default\s+(\w+)/g, 'module.exports = $1')
      .replace(/export\s*{\s*([^}]+)\s*}/g, (match, exports) => {
        const exportList = exports.split(',').map(e => e.trim());
        return exportList.map(exp => `module.exports.${exp} = ${exp};`).join('\n');
      });
    
    // import文を削除（テスト用）
    convertedContent = convertedContent.replace(/import.*from.*['"];?/g, '');
    
    // モジュール実行
    const script = new vm.Script(convertedContent);
    const context = vm.createContext({
      ...globalContext,
      module: { exports: {} },
      exports: {},
      require: () => ({})
    });
    
    script.runInContext(context);
    
    // 結果確認
    const moduleExports = context.module.exports;
    
    if (Object.keys(moduleExports).length > 0) {
      console.log(`✅ ${testName}: エクスポート成功`);
      console.log(`   - エクスポート: ${Object.keys(moduleExports).join(', ')}`);
      return true;
    } else {
      console.log(`❌ ${testName}: エクスポートなし`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ ${testName}: 実行エラー - ${error.message}`);
    return false;
  }
}

async function testAPIClient() {
  try {
    console.log('\n🔍 APIClient詳細テスト');
    
    const content = fs.readFileSync('js/modules/api-client.js', 'utf8');
    
    // 必要なメソッドの存在確認
    const requiredMethods = [
      'enrichProductsWithAmazonData',
      'getStatus',
      'analyzeImage'
    ];
    
    let allMethodsFound = true;
    
    requiredMethods.forEach(method => {
      if (content.includes(method)) {
        console.log(`✅ APIClient.${method}: 定義あり`);
      } else {
        console.log(`❌ APIClient.${method}: 定義なし`);
        allMethodsFound = false;
      }
    });
    
    return allMethodsFound;
    
  } catch (error) {
    console.log(`❌ APIClient テストエラー: ${error.message}`);
    return false;
  }
}

async function testUIComponents() {
  try {
    console.log('\n🔍 UIComponents詳細テスト');
    
    const content = fs.readFileSync('js/modules/ui-components.js', 'utf8');
    
    // 必要なメソッドの存在確認
    const requiredMethods = [
      'updateStatusInfo',
      'showErrorMessage', 
      'setupLocationButtons',
      'on',
      'emit',
      'EventTarget'
    ];
    
    let allMethodsFound = true;
    
    requiredMethods.forEach(method => {
      if (content.includes(method)) {
        console.log(`✅ UIComponents.${method}: 定義あり`);
      } else {
        console.log(`❌ UIComponents.${method}: 定義なし`);
        allMethodsFound = false;
      }
    });
    
    // EventTarget継承チェック
    if (content.includes('extends EventTarget')) {
      console.log(`✅ UIComponents: EventTarget継承あり`);
    } else {
      console.log(`❌ UIComponents: EventTarget継承なし`);
      allMethodsFound = false;
    }
    
    return allMethodsFound;
    
  } catch (error) {
    console.log(`❌ UIComponents テストエラー: ${error.message}`);
    return false;
  }
}

async function testAppJS() {
  try {
    console.log('\n🔍 app.js統合テスト');
    
    const content = fs.readFileSync('app.js', 'utf8');
    
    // 重要な処理の存在確認
    const checks = [
      { name: 'import文', pattern: /import.*from/ },
      { name: 'AICleaningAdvisorクラス', pattern: /class AICleaningAdvisor/ },
      { name: 'initialize メソッド', pattern: /async initialize/ },
      { name: 'event.detail 処理', pattern: /event\.detail/ },
      { name: 'DOMContentLoaded', pattern: /DOMContentLoaded/ }
    ];
    
    let allChecksPass = true;
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        console.log(`✅ app.js ${check.name}: 確認`);
      } else {
        console.log(`❌ app.js ${check.name}: 未確認`);
        allChecksPass = false;
      }
    });
    
    return allChecksPass;
    
  } catch (error) {
    console.log(`❌ app.js テストエラー: ${error.message}`);
    return false;
  }
}

// メインテスト実行
async function runAllTests() {
  console.log('🚀 包括的実行テスト開始\n');
  
  const results = [];
  
  // 個別モジュールテスト
  results.push(await testModule('js/config/dirt-mapping.js', 'DirtMapping'));
  results.push(await testModule('js/config/products.js', 'Products'));
  results.push(await testModule('js/config/locations.js', 'Locations'));
  
  // 詳細機能テスト
  results.push(await testAPIClient());
  results.push(await testUIComponents());
  results.push(await testAppJS());
  
  // 総合判定
  const passCount = results.filter(r => r).length;
  const totalCount = results.length;
  
  console.log(`\n📊 テスト結果: ${passCount}/${totalCount} 通過`);
  
  if (passCount === totalCount) {
    console.log('🎉 全テスト通過！モジュール統合成功');
    return true;
  } else {
    console.log('❌ 一部テスト失敗。修正が必要');
    return false;
  }
}

runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});