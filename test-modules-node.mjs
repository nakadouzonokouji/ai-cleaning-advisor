/**
 * Node.js環境でのモジュールテスト
 */

import { readFile } from 'fs/promises';
import { pathToFileURL } from 'url';

async function testModules() {
    console.log('🔍 Node.js環境でのモジュールテスト開始');
    
    try {
        // 1. products.js のテスト
        console.log('\n📦 products.js テスト...');
        const productsModule = await import('./js/config/products.js');
        console.log('✅ products.js 読み込み成功');
        
        const { COMPREHENSIVE_CLEANING_PRODUCTS, COMPREHENSIVE_PRODUCT_DATABASE, DIRT_TYPE_MAPPING, LOCATION_PRODUCTS } = productsModule.default;
        
        console.log(`  🛒 COMPREHENSIVE_CLEANING_PRODUCTS: ${Object.keys(COMPREHENSIVE_CLEANING_PRODUCTS || {}).length} カテゴリ`);
        console.log(`  🛒 COMPREHENSIVE_PRODUCT_DATABASE: ${Object.keys(COMPREHENSIVE_PRODUCT_DATABASE || {}).length} カテゴリ`);
        console.log(`  🔗 DIRT_TYPE_MAPPING: ${Object.keys(DIRT_TYPE_MAPPING || {}).length} マッピング`);
        console.log(`  📍 LOCATION_PRODUCTS: ${Object.keys(LOCATION_PRODUCTS || {}).length} 場所`);
        
        // 商品総数をカウント
        let totalProducts = 0;
        Object.values(COMPREHENSIVE_CLEANING_PRODUCTS || {}).forEach(category => {
            if (category.products && Array.isArray(category.products)) {
                totalProducts += category.products.length;
                console.log(`    ${category.category || '不明'}: ${category.products.length}件`);
            }
        });
        console.log(`  📊 総商品数: ${totalProducts}件`);

        // 2. dirt-mapping.js のテスト
        console.log('\n🎯 dirt-mapping.js テスト...');
        const dirtMappingModule = await import('./js/config/dirt-mapping.js');
        console.log('✅ dirt-mapping.js 読み込み成功');
        
        const { COMPREHENSIVE_DIRT_MAPPING } = dirtMappingModule.default;
        console.log(`  🎯 COMPREHENSIVE_DIRT_MAPPING: ${Object.keys(COMPREHENSIVE_DIRT_MAPPING || {}).length} 汚れタイプ`);
        
        // 汚れタイプの詳細
        Object.entries(COMPREHENSIVE_DIRT_MAPPING || {}).forEach(([key, value]) => {
            console.log(`    ${key}: ${value.description || '説明なし'}`);
        });

        // 3. locations.js のテスト
        console.log('\n📍 locations.js テスト...');
        const locationsModule = await import('./js/config/locations.js');
        console.log('✅ locations.js 読み込み成功');
        
        const COMPREHENSIVE_LOCATION_CONFIG = locationsModule.default;
        console.log(`  📍 COMPREHENSIVE_LOCATION_CONFIG: ${Object.keys(COMPREHENSIVE_LOCATION_CONFIG || {}).length} 場所`);
        
        // 場所の詳細
        Object.entries(COMPREHENSIVE_LOCATION_CONFIG || {}).forEach(([key, value]) => {
            console.log(`    ${key}: ${value.name || '名前なし'} (汚れタイプ: ${value.commonDirtTypes ? value.commonDirtTypes.length : 0}種類)`);
        });

        // 4. システム整合性チェック
        console.log('\n🔍 システム整合性チェック...');
        
        const systemCheck = {
            productsLoaded: !!COMPREHENSIVE_CLEANING_PRODUCTS && Object.keys(COMPREHENSIVE_CLEANING_PRODUCTS).length > 0,
            dirtMappingLoaded: !!COMPREHENSIVE_DIRT_MAPPING && Object.keys(COMPREHENSIVE_DIRT_MAPPING).length > 0,
            locationsLoaded: !!COMPREHENSIVE_LOCATION_CONFIG && Object.keys(COMPREHENSIVE_LOCATION_CONFIG).length > 0,
            sufficientProducts: totalProducts > 50,
            sufficientCategories: Object.keys(COMPREHENSIVE_CLEANING_PRODUCTS || {}).length >= 5,
            sufficientDirtTypes: Object.keys(COMPREHENSIVE_DIRT_MAPPING || {}).length >= 15,
            sufficientLocations: Object.keys(COMPREHENSIVE_LOCATION_CONFIG || {}).length >= 7
        };
        
        console.log('\n📊 チェック結果:');
        Object.entries(systemCheck).forEach(([key, value]) => {
            console.log(`  ${value ? '✅' : '❌'} ${key}: ${value}`);
        });
        
        const allChecksPass = Object.values(systemCheck).every(check => check === true);
        console.log(`\n🏁 総合判定: ${allChecksPass ? '✅ 全テスト成功' : '❌ 一部テスト失敗'}`);
        
        if (allChecksPass) {
            console.log('\n🎉 モジュールシステムは正常に動作しています！');
            console.log('   ブラウザでの問題がある場合は、以下を確認してください:');
            console.log('   1. HTTPサーバー経由でアクセスしているか（file://ではなく）');
            console.log('   2. CORSエラーが発生していないか');
            console.log('   3. モジュール読み込みのタイミング問題がないか');
        } else {
            console.log('\n⚠️ システムに問題があります。上記のエラーを確認してください。');
        }
        
    } catch (error) {
        console.error('❌ モジュールテストエラー:', error);
        console.error('スタックトレース:', error.stack);
    }
}

// テスト実行
testModules();