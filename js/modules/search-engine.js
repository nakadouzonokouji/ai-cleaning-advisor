/**
 * リアルタイム検索エンジン
 * AI掃除アドバイザー - 商品検索・推薦システム
 */

import { COMPREHENSIVE_CLEANING_PRODUCTS, COMPREHENSIVE_PRODUCT_DATABASE } from '../config/products.js';
import { COMPREHENSIVE_DIRT_MAPPING } from '../config/dirt-mapping.js';

export class RealtimeSearchEngine {
    constructor() {
        this.searchCache = new Map();
        this.searchHistory = [];
        this.maxHistorySize = 100;
        
        // データベース利用可能性チェック
        this.databaseStatus = this.checkDatabaseAvailability();
        
        console.log('🔍 リアルタイム検索エンジン初期化');
        if (this.databaseStatus.hasIssues) {
            console.warn('⚠️ 一部データベースが利用できません:', this.databaseStatus.issues);
        }
    }

    /**
     * データベース利用可能性をチェック
     * @returns {Object} データベース状態
     */
    checkDatabaseAvailability() {
        const status = {
            hasIssues: false,
            issues: []
        };

        try {
            if (!COMPREHENSIVE_CLEANING_PRODUCTS) {
                status.hasIssues = true;
                status.issues.push('COMPREHENSIVE_CLEANING_PRODUCTS未定義');
            } else if (typeof COMPREHENSIVE_CLEANING_PRODUCTS !== 'object') {
                status.hasIssues = true;
                status.issues.push('COMPREHENSIVE_CLEANING_PRODUCTS型不正');
            }

            if (!COMPREHENSIVE_PRODUCT_DATABASE) {
                status.hasIssues = true;
                status.issues.push('COMPREHENSIVE_PRODUCT_DATABASE未定義');
            }

            if (!COMPREHENSIVE_DIRT_MAPPING) {
                status.hasIssues = true;
                status.issues.push('COMPREHENSIVE_DIRT_MAPPING未定義');
            }
        } catch (error) {
            status.hasIssues = true;
            status.issues.push(`データベースアクセスエラー: ${error.message}`);
        }

        return status;
    }

    /**
     * 汚れタイプに基づいて商品を検索
     * @param {string} dirtType - 汚れタイプ
     * @param {string} severity - 汚れの程度 (light/heavy)
     * @param {string} location - 場所
     * @returns {Promise<Array>} 推薦商品リスト
     */
    async searchProductsByDirt(dirtType, severity = 'heavy', location = null) {
        console.log(`🔍 汚れタイプ検索: ${dirtType}, 程度: ${severity}, 場所: ${location}`);
        
        const cacheKey = `${dirtType}-${severity}-${location}`;
        if (this.searchCache.has(cacheKey)) {
            console.log('📦 キャッシュから結果を取得');
            return this.searchCache.get(cacheKey);
        }

        try {
            // 汚れタイプから商品カテゴリを特定
            const productCategories = this.getProductCategoriesForDirt(dirtType);
            
            // 各カテゴリから商品を取得
            let recommendedProducts = [];
            
            for (const category of productCategories) {
                const categoryProducts = this.getProductsFromCategory(category, severity);
                recommendedProducts = recommendedProducts.concat(categoryProducts);
            }

            // 場所に基づく追加フィルタリング
            if (location) {
                recommendedProducts = this.filterProductsByLocation(recommendedProducts, location);
            }

            // 重複除去とスコアリング
            recommendedProducts = this.deduplicateAndScore(recommendedProducts, dirtType, severity);
            
            // 結果をキャッシュ
            this.searchCache.set(cacheKey, recommendedProducts);
            
            // 検索履歴に追加
            this.addToHistory(dirtType, severity, location, recommendedProducts.length);
            
            console.log(`✅ 検索完了: ${recommendedProducts.length}件の商品`);
            return recommendedProducts;
            
        } catch (error) {
            console.error('❌ 商品検索エラー:', error);
            return this.getFallbackProducts(dirtType);
        }
    }

    /**
     * キーワードベースの商品検索
     * @param {string} keyword - 検索キーワード
     * @param {number} maxResults - 最大結果数
     * @returns {Array} 検索結果
     */
    searchProductsByKeyword(keyword, maxResults = 10) {
        console.log(`🔍 キーワード検索: ${keyword}`);
        
        const allProducts = this.getAllProducts();
        const results = [];
        
        const searchTerm = keyword.toLowerCase();
        
        for (const product of allProducts) {
            let score = 0;
            
            // 商品名での検索
            if (product.name && product.name.toLowerCase().includes(searchTerm)) {
                score += 10;
            }
            
            // 対象での検索
            if (product.target && product.target.some(t => t.toLowerCase().includes(searchTerm))) {
                score += 8;
            }
            
            // カテゴリでの検索
            if (product.category && product.category.toLowerCase().includes(searchTerm)) {
                score += 6;
            }
            
            // タイプでの検索
            if (product.type && product.type.toLowerCase().includes(searchTerm)) {
                score += 4;
            }
            
            if (score > 0) {
                results.push({ ...product, searchScore: score });
            }
        }
        
        // スコア順でソート
        results.sort((a, b) => b.searchScore - a.searchScore);
        
        return results.slice(0, maxResults);
    }

    /**
     * 汚れタイプから商品カテゴリを特定
     * @param {string} dirtType - 汚れタイプ
     * @returns {Array} 関連商品カテゴリ
     */
    getProductCategoriesForDirt(dirtType) {
        const categoryMapping = {
            'カビ': ['mold_bathroom', 'cleaning_tools', 'protective_gear'],
            '黒カビ': ['mold_bathroom', 'cleaning_tools', 'protective_gear'],
            '白カビ': ['mold_bathroom', 'cleaning_tools'],
            '青カビ': ['mold_bathroom', 'cleaning_tools'],
            '油汚れ': ['oil_grease', 'cleaning_tools', 'detergents'],
            '水垢': ['limescale', 'cleaning_tools'],
            '石鹸カス': ['limescale', 'cleaning_tools'],
            '黄ばみ': ['detergents', 'cleaning_tools'],
            'ほこり': ['cleaning_tools', 'protective_gear'],
            '焦げ': ['oil_grease', 'cleaning_tools'],
            '血液': ['detergents', 'cleaning_tools'],
            'ワイン汚れ': ['detergents', 'cleaning_tools'],
            'コーヒー汚れ': ['detergents', 'cleaning_tools'],
            '尿汚れ': ['detergents', 'cleaning_tools'],
            '便汚れ': ['detergents', 'cleaning_tools', 'protective_gear']
        };
        
        return categoryMapping[dirtType] || ['cleaning_tools', 'detergents'];
    }

    /**
     * カテゴリから商品を取得
     * @param {string} category - 商品カテゴリ
     * @param {string} severity - 汚れの程度
     * @returns {Array} 商品リスト
     */
    getProductsFromCategory(category, severity) {
        const products = [];
        
        try {
            // COMPREHENSIVE_CLEANING_PRODUCTSから取得
            if (COMPREHENSIVE_CLEANING_PRODUCTS && COMPREHENSIVE_CLEANING_PRODUCTS[category]) {
                const categoryData = COMPREHENSIVE_CLEANING_PRODUCTS[category];
                if (categoryData && categoryData.products && Array.isArray(categoryData.products)) {
                    products.push(...categoryData.products.map(p => ({
                        ...p,
                        category: categoryData.category,
                        source: 'COMPREHENSIVE_CLEANING_PRODUCTS'
                    })));
                }
            }
            
            // COMPREHENSIVE_PRODUCT_DATABASEから取得
            if (COMPREHENSIVE_PRODUCT_DATABASE && COMPREHENSIVE_PRODUCT_DATABASE[category]) {
                const categoryData = COMPREHENSIVE_PRODUCT_DATABASE[category];
                if (categoryData && categoryData.products && Array.isArray(categoryData.products)) {
                    products.push(...categoryData.products.map(p => ({
                        ...p,
                        category: categoryData.category,
                        source: 'COMPREHENSIVE_PRODUCT_DATABASE'
                    })));
                }
            }
        } catch (error) {
            console.warn(`⚠️ カテゴリ商品取得エラー (${category}):`, error.message);
        }
        
        // 汚れの程度に基づくフィルタリング
        return products.filter(product => {
            if (severity === 'light') {
                return !product.strength || product.strength !== '強力';
            } else if (severity === 'heavy') {
                return product.strength === '強力' || product.strength === '中程度';
            }
            return true;
        });
    }

    /**
     * 場所に基づく商品フィルタリング
     * @param {Array} products - 商品リスト
     * @param {string} location - 場所
     * @returns {Array} フィルタリング済み商品リスト
     */
    filterProductsByLocation(products, location) {
        const locationMapping = {
            'kitchen': ['キッチン', '台所', 'コンロ', '換気扇', '油汚れ'],
            'bathroom': ['浴室', 'バスルーム', 'お風呂', 'カビ', '水垢'],
            'toilet': ['トイレ', '便器', '尿汚れ', '便汚れ'],
            'living': ['リビング', '居間', 'ほこり', 'ソファ'],
            'bedroom': ['寝室', 'ベッド', '汗染み', 'ダニ']
        };
        
        const locationKeywords = locationMapping[location] || [];
        
        return products.filter(product => {
            // 商品の対象に場所関連キーワードが含まれているかチェック
            if (product.target) {
                return product.target.some(target => 
                    locationKeywords.some(keyword => 
                        target.includes(keyword)
                    )
                );
            }
            return true; // 対象が指定されていない場合は含める
        });
    }

    /**
     * 重複除去とスコアリング
     * @param {Array} products - 商品リスト
     * @param {string} dirtType - 汚れタイプ
     * @param {string} severity - 汚れの程度
     * @returns {Array} スコアリング済み商品リスト
     */
    deduplicateAndScore(products, dirtType, severity) {
        const productMap = new Map();
        
        products.forEach(product => {
            const key = product.asin || product.name;
            
            if (!productMap.has(key)) {
                // スコア計算
                let score = 0;
                
                // 汚れタイプとの適合度
                if (product.target && product.target.includes(dirtType)) {
                    score += 10;
                }
                
                // 強度の適合度
                if (severity === 'heavy' && product.strength === '強力') {
                    score += 8;
                } else if (severity === 'light' && product.strength !== '強力') {
                    score += 6;
                }
                
                // 商品タイプによるスコア
                const typeScores = {
                    '洗剤': 10,
                    'スプレー': 9,
                    'スポンジ': 7,
                    'ブラシ': 6,
                    'クロス': 5,
                    '道具': 5
                };
                
                score += typeScores[product.type] || 3;
                
                productMap.set(key, { ...product, relevanceScore: score });
            }
        });
        
        // スコア順でソート
        return Array.from(productMap.values())
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 12); // 最大12件
    }

    /**
     * すべての商品を取得
     * @returns {Array} 全商品リスト
     */
    getAllProducts() {
        const allProducts = [];
        
        try {
            // COMPREHENSIVE_CLEANING_PRODUCTSから取得
            if (COMPREHENSIVE_CLEANING_PRODUCTS && typeof COMPREHENSIVE_CLEANING_PRODUCTS === 'object') {
                Object.entries(COMPREHENSIVE_CLEANING_PRODUCTS).forEach(([key, categoryData]) => {
                    if (categoryData && categoryData.products && Array.isArray(categoryData.products)) {
                        allProducts.push(...categoryData.products.map(p => ({
                            ...p,
                            category: categoryData.category,
                            categoryKey: key,
                            source: 'COMPREHENSIVE_CLEANING_PRODUCTS'
                        })));
                    }
                });
            }
            
            // COMPREHENSIVE_PRODUCT_DATABASEから取得
            if (COMPREHENSIVE_PRODUCT_DATABASE && typeof COMPREHENSIVE_PRODUCT_DATABASE === 'object') {
                Object.entries(COMPREHENSIVE_PRODUCT_DATABASE).forEach(([key, categoryData]) => {
                    if (categoryData && categoryData.products && Array.isArray(categoryData.products)) {
                        allProducts.push(...categoryData.products.map(p => ({
                            ...p,
                            category: categoryData.category,
                            categoryKey: key,
                            source: 'COMPREHENSIVE_PRODUCT_DATABASE'
                        })));
                    }
                });
            }
        } catch (error) {
            console.warn('⚠️ 全商品取得エラー:', error.message);
        }
        
        return allProducts;
    }

    /**
     * フォールバック商品を取得
     * @param {string} dirtType - 汚れタイプ
     * @returns {Array} フォールバック商品リスト
     */
    getFallbackProducts(dirtType) {
        console.log(`⚠️ フォールバック商品を取得: ${dirtType}`);
        
        // 汚れタイプに関係なく汎用的な商品を返す
        return [
            {
                name: "激落ちくん メラミンスポンジ",
                asin: "B00OOCWP44",
                type: "スポンジ",
                target: ["汚れ全般", "水垢", "黄ばみ"],
                strength: "強力",
                category: "汎用清掃用品",
                relevanceScore: 5
            },
            {
                name: "マイクロファイバークロス",
                asin: "B005AILJ3O",
                type: "クロス",
                target: ["拭き取り", "仕上げ", "ホコリ"],
                strength: "軽度",
                category: "汎用清掃用品", 
                relevanceScore: 4
            },
            {
                name: "中性洗剤",
                asin: "B00EOHQPHC",
                type: "洗剤",
                target: ["軽い汚れ", "日常清掃"],
                strength: "中程度",
                category: "汎用清掃用品",
                relevanceScore: 3
            }
        ];
    }

    /**
     * 検索履歴に追加
     * @param {string} dirtType - 汚れタイプ
     * @param {string} severity - 汚れの程度
     * @param {string} location - 場所
     * @param {number} resultCount - 結果数
     */
    addToHistory(dirtType, severity, location, resultCount) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            dirtType,
            severity,
            location,
            resultCount
        };
        
        this.searchHistory.unshift(historyEntry);
        
        // 履歴サイズを制限
        if (this.searchHistory.length > this.maxHistorySize) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * 検索キャッシュをクリア
     */
    clearCache() {
        this.searchCache.clear();
        console.log('🗑️ 検索キャッシュをクリア');
    }

    /**
     * 検索統計を取得
     * @returns {Object} 検索統計
     */
    getSearchStats() {
        return {
            cacheSize: this.searchCache.size,
            historySize: this.searchHistory.length,
            recentSearches: this.searchHistory.slice(0, 5)
        };
    }
}

// デフォルトエクスポート
export { RealtimeSearchEngine };
export default RealtimeSearchEngine;

// ブラウザ互換性のため
if (typeof window !== 'undefined') {
    window.RealtimeSearchEngine = RealtimeSearchEngine;
}