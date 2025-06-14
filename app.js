/**
 * AI掃除アドバイザー - メインアプリケーション（リファクタリング版）
 * CX Mainte © 2025
 * 
 * 🎯 ユーザーファースト設計
 * 🔧 保守性重視の分離アーキテクチャ
 * ⚡ 高速ロード・リアルタイム検索対応
 */

// モジュールのインポート
import { COMPREHENSIVE_DIRT_MAPPING } from './js/config/dirt-mapping.js';
import { COMPREHENSIVE_CLEANING_PRODUCTS, COMPREHENSIVE_PRODUCT_DATABASE } from './js/config/products.js';
import { COMPREHENSIVE_LOCATION_CONFIG } from './js/config/locations.js';
import { APIClient } from './js/modules/api-client.js';
import UIComponents from './js/modules/ui-components.js';
import RealtimeSearchEngine from './js/modules/search-engine.js';

/**
 * AICleaningAdvisor - メインアプリケーションクラス
 */
class AICleaningAdvisor {
    constructor() {
        console.log('🚀 AI掃除アドバイザー初期化開始');
        
        // 状態管理
        this.state = {
            selectedLocation: null,
            selectedDirt: null,
            dirtSeverity: 'heavy',
            uploadedImage: null,
            analysisResult: null,
            isProcessing: false
        };
        
        // コンポーネント初期化
        this.apiClient = null;
        this.uiComponents = null;
        this.searchEngine = null;
        
        // 初期化フラグ
        this.isInitialized = false;
        
        console.log('✅ AI掃除アドバイザー基本構成完了');
    }

    /**
     * アプリケーション初期化
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ 既に初期化済み');
            return;
        }

        try {
            console.log('🔄 コンポーネント初期化中...');
            
            // APIクライアント初期化
            this.apiClient = new APIClient({
                geminiApiKey: this.getGeminiApiKey(),
                preferServerProxy: true
            });
            
            // UIコンポーネント初期化
            this.uiComponents = new UIComponents();
            await this.uiComponents.initializeUI();
            
            // 検索エンジン初期化
            this.searchEngine = new RealtimeSearchEngine();
            
            // イベントリスナー設定
            this.setupEventListeners();
            
            // UI初期状態設定
            this.setupInitialUI();
            
            // 初期化完了
            this.isInitialized = true;
            
            console.log('🎉 AI掃除アドバイザー初期化完了');
            
            // 初期化完了を外部に通知
            this.dispatchEvent('initialized');
            
        } catch (error) {
            console.error('❌ 初期化エラー:', error);
            this.showError('アプリケーションの初期化に失敗しました', error);
        }
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // UIコンポーネントとの連携
        this.uiComponents.on('locationSelected', (location) => {
            this.selectLocation(location);
        });
        
        this.uiComponents.on('severityChanged', (severity) => {
            this.state.dirtSeverity = severity;
            console.log(`🎯 汚れ度合い変更: ${severity}`);
        });
        
        this.uiComponents.on('imageUploaded', (imageData) => {
            this.handleImageUpload(imageData);
        });
        
        this.uiComponents.on('analyzeRequested', () => {
            this.startAnalysis();
        });
        
        // ウィンドウイベント
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        console.log('✅ イベントリスナー設定完了');
    }

    /**
     * UI初期状態の設定
     */
    setupInitialUI() {
        // ステータス情報の表示
        this.uiComponents.updateStatusInfo({
            dirtCount: Object.keys(COMPREHENSIVE_DIRT_MAPPING).length,
            productCount: this.getAllProductCount(),
            locationCount: Object.keys(COMPREHENSIVE_LOCATION_CONFIG).length
        });
        
        // ロケーションボタンの初期化
        this.uiComponents.setupLocationButtons(COMPREHENSIVE_LOCATION_CONFIG);
        
        console.log('✅ UI初期状態設定完了');
    }

    /**
     * 場所選択処理
     * @param {string} location - 選択された場所
     */
    async selectLocation(location) {
        console.log(`📍 場所選択: ${location}`);
        
        try {
            this.state.selectedLocation = location;
            
            // UIを更新
            this.uiComponents.updateLocationSelection(location);
            
            // 場所に関連する汚れタイプを取得・表示
            const locationConfig = COMPREHENSIVE_LOCATION_CONFIG[location];
            if (locationConfig && locationConfig.commonDirtTypes) {
                this.uiComponents.updateCommonDirtTypes(locationConfig.commonDirtTypes);
            }
            
            // 場所に基づく推奨商品のプリロード
            await this.preloadLocationProducts(location);
            
            console.log(`✅ 場所選択完了: ${location}`);
            
        } catch (error) {
            console.error('❌ 場所選択エラー:', error);
            this.showError('場所選択に失敗しました', error);
        }
    }

    /**
     * 画像アップロード処理
     * @param {string} imageData - Base64画像データ
     */
    async handleImageUpload(imageData) {
        console.log('📸 画像アップロード処理開始');
        
        try {
            this.state.uploadedImage = imageData;
            
            // 画像プレビューを表示
            this.uiComponents.showImagePreview(imageData);
            
            // 自動分析オプションが有効な場合は分析開始
            if (this.uiComponents.isAutoAnalysisEnabled()) {
                await this.startAnalysis();
            }
            
            console.log('✅ 画像アップロード完了');
            
        } catch (error) {
            console.error('❌ 画像アップロードエラー:', error);
            this.showError('画像のアップロードに失敗しました', error);
        }
    }

    /**
     * 分析開始処理
     */
    async startAnalysis() {
        if (this.state.isProcessing) {
            console.log('⚠️ 既に分析処理中です');
            return;
        }

        console.log('🔍 分析開始');
        
        try {
            this.state.isProcessing = true;
            this.uiComponents.showLoadingState('分析中...');
            
            let analysisResult = null;
            
            // 画像がある場合はAI分析
            if (this.state.uploadedImage) {
                analysisResult = await this.analyzeWithAI();
            } 
            // 画像がない場合は場所ベースの分析
            else if (this.state.selectedLocation) {
                analysisResult = this.analyzeByLocation();
            } 
            // どちらもない場合はエラー
            else {
                throw new Error('分析に必要な情報（画像または場所）が不足しています');
            }
            
            // 結果を保存
            this.state.analysisResult = analysisResult;
            
            // 商品推薦
            await this.generateProductRecommendations(analysisResult);
            
            // 結果表示
            this.displayAnalysisResult(analysisResult);
            
            console.log('✅ 分析完了');
            
        } catch (error) {
            console.error('❌ 分析エラー:', error);
            this.showError('分析に失敗しました', error);
        } finally {
            this.state.isProcessing = false;
            this.uiComponents.hideLoadingState();
        }
    }

    /**
     * AI画像分析
     * @returns {Promise<Object>} 分析結果
     */
    async analyzeWithAI() {
        console.log('🤖 AI画像分析開始');
        
        const result = await this.apiClient.analyzeImage(this.state.uploadedImage);
        
        // 汚れ度合いを状態に保存
        if (result.dirtLevel) {
            this.state.dirtSeverity = result.dirtLevel;
            this.uiComponents.updateSeveritySelection(result.dirtLevel);
        }
        
        console.log('🤖 AI分析結果:', result);
        return result;
    }

    /**
     * 場所ベースの分析
     * @returns {Object} 分析結果
     */
    analyzeByLocation() {
        console.log('📍 場所ベース分析開始');
        
        const locationConfig = COMPREHENSIVE_LOCATION_CONFIG[this.state.selectedLocation];
        
        if (!locationConfig) {
            throw new Error('選択された場所の情報が見つかりません');
        }
        
        // 場所の一般的な汚れタイプを使用
        const commonDirtType = locationConfig.commonDirtTypes?.[0] || 'ほこり';
        
        const result = {
            dirtType: commonDirtType,
            surface: locationConfig.label || this.state.selectedLocation,
            dirtLevel: this.state.dirtSeverity,
            location: this.state.selectedLocation,
            analysisMethod: 'location-based'
        };
        
        console.log('📍 場所ベース分析結果:', result);
        return result;
    }

    /**
     * 商品推薦の生成
     * @param {Object} analysisResult - 分析結果
     */
    async generateProductRecommendations(analysisResult) {
        console.log('🛒 商品推薦生成開始');
        
        try {
            // リアルタイム検索で商品取得
            const recommendedProducts = await this.searchEngine.searchProductsByDirt(
                analysisResult.dirtType,
                analysisResult.dirtLevel || this.state.dirtSeverity,
                analysisResult.location || this.state.selectedLocation
            );
            
            // Amazon APIで商品情報を取得・エンリッチ
            if (recommendedProducts.length > 0) {
                const asins = recommendedProducts
                    .filter(p => p.asin)
                    .map(p => p.asin)
                    .slice(0, 8); // 最大8件
                
                if (asins.length > 0) {
                    const enrichedProducts = await this.apiClient.enrichProductsWithAmazonData(
                        recommendedProducts,
                        asins
                    );
                    
                    analysisResult.recommendedProducts = enrichedProducts;
                } else {
                    analysisResult.recommendedProducts = recommendedProducts;
                }
            } else {
                analysisResult.recommendedProducts = [];
            }
            
            // 掃除方法の生成
            analysisResult.cleaningMethod = this.generateCleaningMethod(
                analysisResult.dirtType,
                analysisResult.surface,
                analysisResult.dirtLevel
            );
            
            console.log(`✅ 商品推薦生成完了: ${analysisResult.recommendedProducts.length}件`);
            
        } catch (error) {
            console.error('❌ 商品推薦生成エラー:', error);
            analysisResult.recommendedProducts = [];
            analysisResult.cleaningMethod = this.generateFallbackCleaningMethod(analysisResult.dirtType);
        }
    }

    /**
     * 掃除方法の生成
     * @param {string} dirtType - 汚れタイプ
     * @param {string} surface - 表面
     * @param {string} severity - 汚れの程度
     * @returns {Object} 掃除方法
     */
    generateCleaningMethod(dirtType, surface, severity) {
        // 掃除方法のテンプレート
        const methodTemplates = {
            'カビ': {
                light: {
                    steps: [
                        '中性洗剤で軽く拭き取る',
                        '十分に乾燥させる',
                        '換気を良くして湿度を下げる'
                    ],
                    warning: '軽度なので早めの対処で除去可能です',
                    difficulty: 'easy'
                },
                heavy: {
                    steps: [
                        '塩素系漂白剤を使用（必ず換気）',
                        '30分程度放置して除菌',
                        'スポンジで軽くこする',
                        '水で十分にすすぐ',
                        '完全に乾燥させる'
                    ],
                    warning: '塩素系洗剤使用時は必ず換気し、他の洗剤と混ぜないでください',
                    difficulty: 'hard'
                }
            },
            '油汚れ': {
                light: {
                    steps: [
                        '中性洗剤で拭き取る',
                        'マイクロファイバークロスで仕上げ'
                    ],
                    warning: '早めの掃除で簡単に除去できます',
                    difficulty: 'easy'
                },
                heavy: {
                    steps: [
                        'アルカリ性洗剤を使用',
                        '15-20分放置',
                        'スポンジでこすり洗い',
                        '中性洗剤で仕上げ拭き'
                    ],
                    warning: '頑固な油汚れには専用洗剤が効果的です',
                    difficulty: 'medium'
                }
            },
            '水垢': {
                light: {
                    steps: [
                        '酸性洗剤を少量使用',
                        'スポンジで軽くこする',
                        '水で十分にすすぐ'
                    ],
                    warning: '定期的な掃除で予防できます',
                    difficulty: 'easy'
                },
                heavy: {
                    steps: [
                        '酸性洗剤を厚めに塗布',
                        '30分程度放置',
                        'メラミンスポンジでこする',
                        '中性洗剤で中和',
                        '水で十分にすすぎ乾拭き'
                    ],
                    warning: '酸性洗剤は金属部分に注意して使用してください',
                    difficulty: 'medium'
                }
            }
        };
        
        const template = methodTemplates[dirtType]?.[severity] || methodTemplates[dirtType]?.['heavy'];
        
        if (!template) {
            return this.generateFallbackCleaningMethod(dirtType);
        }
        
        return {
            dirtType,
            surface,
            severity,
            steps: template.steps,
            warning: template.warning,
            difficulty: template.difficulty,
            estimatedTime: this.getEstimatedTime(template.difficulty, template.steps.length)
        };
    }

    /**
     * フォールバック掃除方法の生成
     * @param {string} dirtType - 汚れタイプ
     * @returns {Object} 掃除方法
     */
    generateFallbackCleaningMethod(dirtType) {
        return {
            dirtType,
            surface: '一般的な表面',
            severity: 'medium',
            steps: [
                '適切な洗剤を選択',
                '汚れに洗剤を塗布',
                '適切な道具でこすり洗い',
                '水で十分にすすぐ',
                '乾いた布で水分を拭き取る'
            ],
            warning: '汚れの程度に応じて洗剤や方法を調整してください',
            difficulty: 'medium',
            estimatedTime: '15-30分'
        };
    }

    /**
     * 推定時間の計算
     * @param {string} difficulty - 難易度
     * @param {number} stepCount - ステップ数
     * @returns {string} 推定時間
     */
    getEstimatedTime(difficulty, stepCount) {
        const baseTimeMap = {
            'easy': 5,
            'medium': 10,
            'hard': 20
        };
        
        const baseTime = baseTimeMap[difficulty] || 10;
        const totalMinutes = baseTime + (stepCount * 2);
        
        return `${totalMinutes}分程度`;
    }

    /**
     * 分析結果の表示
     * @param {Object} result - 分析結果
     */
    displayAnalysisResult(result) {
        console.log('📊 分析結果表示開始');
        
        this.uiComponents.displayAnalysisResult({
            dirtType: result.dirtType,
            surface: result.surface,
            severity: result.dirtLevel || this.state.dirtSeverity,
            cleaningMethod: result.cleaningMethod,
            recommendedProducts: result.recommendedProducts || [],
            analysisMethod: result.analysisMethod
        });
        
        // 成功通知
        this.uiComponents.showSuccessNotification(
            `${result.dirtType}の分析が完了しました！`
        );
        
        console.log('✅ 分析結果表示完了');
    }

    /**
     * 場所別商品のプリロード
     * @param {string} location - 場所
     */
    async preloadLocationProducts(location) {
        try {
            const locationConfig = COMPREHENSIVE_LOCATION_CONFIG[location];
            if (locationConfig && locationConfig.commonDirtTypes) {
                // 最も一般的な汚れタイプで商品をプリロード
                const commonDirtType = locationConfig.commonDirtTypes[0];
                await this.searchEngine.searchProductsByDirt(commonDirtType, 'heavy', location);
                console.log(`📦 ${location}の商品をプリロード完了`);
            }
        } catch (error) {
            console.log(`⚠️ ${location}の商品プリロードをスキップ:`, error.message);
        }
    }

    /**
     * 全商品数の取得
     * @returns {number} 商品数
     */
    getAllProductCount() {
        let count = 0;
        
        Object.values(COMPREHENSIVE_CLEANING_PRODUCTS).forEach(category => {
            if (category.products) {
                count += category.products.length;
            }
        });
        
        Object.values(COMPREHENSIVE_PRODUCT_DATABASE).forEach(category => {
            if (category.products) {
                count += category.products.length;
            }
        });
        
        return count;
    }

    /**
     * Gemini APIキーの取得
     * @returns {string|null} APIキー
     */
    getGeminiApiKey() {
        return window.GEMINI_API_KEY || 
               localStorage.getItem('gemini_api_key') || 
               sessionStorage.getItem('gemini_api_key') || 
               null;
    }

    /**
     * エラー表示
     * @param {string} message - エラーメッセージ
     * @param {Error} error - エラーオブジェクト
     */
    showError(message, error) {
        console.error(`❌ ${message}:`, error);
        this.uiComponents.showErrorMessage(message, error);
    }

    /**
     * カスタムイベントの発火
     * @param {string} eventName - イベント名
     * @param {*} detail - イベント詳細
     */
    dispatchEvent(eventName, detail = null) {
        window.dispatchEvent(new CustomEvent(`aiCleaningAdvisor:${eventName}`, { detail }));
    }

    /**
     * クリーンアップ処理
     */
    cleanup() {
        if (this.searchEngine) {
            this.searchEngine.clearCache();
        }
        
        if (this.uiComponents) {
            this.uiComponents.cleanup();
        }
        
        console.log('🧹 クリーンアップ完了');
    }

    /**
     * アプリケーション状態の取得
     * @returns {Object} 現在の状態
     */
    getState() {
        return { ...this.state };
    }

    /**
     * デバッグ情報の取得
     * @returns {Object} デバッグ情報
     */
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            state: this.getState(),
            searchStats: this.searchEngine?.getSearchStats(),
            apiStatus: this.apiClient?.getStatus()
        };
    }
}

// アプリケーション初期化
let aiCleaningAdvisor = null;

/**
 * DOMContentLoaded時の初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 DOM読み込み完了 - AI掃除アドバイザー開始');
    
    try {
        aiCleaningAdvisor = new AICleaningAdvisor();
        await aiCleaningAdvisor.initialize();
        
        // グローバルアクセス用
        window.aiCleaningAdvisor = aiCleaningAdvisor;
        
        console.log('🎉 AI掃除アドバイザー起動完了');
        
    } catch (error) {
        console.error('💥 AI掃除アドバイザー起動失敗:', error);
        
        // フォールバック表示
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #dc3545;">
                <h2>⚠️ アプリケーションの初期化に失敗しました</h2>
                <p>ページを再読み込みしてください</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px;">
                    再読み込み
                </button>
            </div>
        `;
    }
});

/**
 * ページリロード時の初期化（フォールバック）
 */
window.addEventListener('load', () => {
    if (!window.aiCleaningAdvisor) {
        console.log('🔄 Window Load - AICleaningAdvisor再初期化');
        setTimeout(async () => {
            if (!window.aiCleaningAdvisor) {
                aiCleaningAdvisor = new AICleaningAdvisor();
                await aiCleaningAdvisor.initialize();
                window.aiCleaningAdvisor = aiCleaningAdvisor;
            }
        }, 100);
    }
});

// デバッグ用グローバル関数
window.debugAICleaningAdvisor = () => {
    if (window.aiCleaningAdvisor) {
        console.log('🔍 AI掃除アドバイザー デバッグ情報:', window.aiCleaningAdvisor.getDebugInfo());
    } else {
        console.log('⚠️ AI掃除アドバイザーが初期化されていません');
    }
};

// モジュールエクスポート
export default AICleaningAdvisor;