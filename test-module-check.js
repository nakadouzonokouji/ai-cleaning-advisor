const fs = require('fs');
const path = require('path');

console.log('🧪 モジュール統合テスト開始');

// テスト対象モジュール
const modules = [
  'js/config/dirt-mapping.js',
  'js/config/products.js', 
  'js/config/locations.js',
  'js/modules/api-client.js',
  'js/modules/ui-components.js',
  'js/modules/search-engine.js'
];

let allValid = true;
let results = [];

// 1. ファイル存在チェック
modules.forEach(module => {
  try {
    if (fs.existsSync(module)) {
      results.push(`✅ ${module}: ファイル存在`);
    } else {
      results.push(`❌ ${module}: ファイル不在`);
      allValid = false;
    }
  } catch (error) {
    results.push(`❌ ${module}: アクセスエラー`);
    allValid = false;
  }
});

// 2. export文存在チェック
modules.forEach(module => {
  try {
    if (fs.existsSync(module)) {
      const content = fs.readFileSync(module, 'utf8');
      
      if (content.includes('export')) {
        results.push(`✅ ${module}: export文あり`);
      } else {
        results.push(`❌ ${module}: export文なし`);
        allValid = false;
      }
      
      // import文チェック
      const imports = content.match(/import.*from.*\.js/g);
      if (imports) {
        results.push(`📦 ${module}: ${imports.length}個のimport`);
      }
    }
  } catch (error) {
    results.push(`❌ ${module}: 読み込みエラー - ${error.message}`);
    allValid = false;
  }
});

// 3. app.jsのimport文チェック
try {
  if (fs.existsSync('app.js')) {
    const appContent = fs.readFileSync('app.js', 'utf8');
    
    const appImports = appContent.match(/import.*from.*\.js/g);
    if (appImports) {
      results.push(`📱 app.js: ${appImports.length}個のimport文`);
      
      // import先ファイルの存在確認
      appImports.forEach(importLine => {
        const pathMatch = importLine.match(/from\s+['"]([^'"]+)['"]/);
        if (pathMatch) {
          const importPath = pathMatch[1];
          if (fs.existsSync(importPath)) {
            results.push(`✅ app.js import: ${importPath} 存在`);
          } else {
            results.push(`❌ app.js import: ${importPath} 不在`);
            allValid = false;
          }
        }
      });
    } else {
      results.push(`❌ app.js: import文なし`);
      allValid = false;
    }
  }
} catch (error) {
  results.push(`❌ app.js読み込みエラー: ${error.message}`);
  allValid = false;
}

// 4. index.htmlのscriptタグチェック  
try {
  if (fs.existsSync('index.html')) {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    if (htmlContent.includes('type="module"')) {
      results.push(`✅ index.html: ESモジュール対応`);
    } else {
      results.push(`❌ index.html: ESモジュール未対応`);
      allValid = false;
    }
    
    if (htmlContent.includes('src="app.js"')) {
      results.push(`✅ index.html: app.js読み込みあり`);
    } else {
      results.push(`❌ index.html: app.js読み込みなし`);
      allValid = false;
    }
  }
} catch (error) {
  results.push(`❌ index.html読み込みエラー: ${error.message}`);
  allValid = false;
}

// 結果出力
console.log('\n📊 テスト結果:');
results.forEach(result => console.log(result));

console.log(`\n🎯 総合結果: ${allValid ? '✅ 全テスト通過' : '❌ 一部テスト失敗'}`);

if (!allValid) {
  console.log('\n🔧 修正が必要な項目があります');
  process.exit(1);
} else {
  console.log('\n🎉 モジュール構成に問題なし！');
}