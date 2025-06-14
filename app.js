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
        this.uiComponents.on('locationSelected', (event) => {
            this.selectLocation(event.detail);
        });
        
        this.uiComponents.on('severityChanged', (event) => {
            this.state.dirtSeverity = event.detail;
            console.log(`🎯 汚れ度合い変更: ${event.detail}`);
        });
        
        this.uiComponents.on('imageUploaded', (event) => {
            this.handleImageUpload(event.detail);
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
        
        let dirtType = 'ほこり';
        let surface = '一般的な掃除';
        
        // 場所に基づく詳細な汚れ判定（日本語）
        switch (this.state.selectedLocation) {
            case 'kitchen':
                dirtType = this.state.dirtSeverity === 'light' ? '軽い油汚れ' : '頑固な油汚れ';
                surface = 'キッチン';
                break;
            case 'bathroom':
                dirtType = this.state.dirtSeverity === 'light' ? '軽いカビ' : '頑固なカビ';
                surface = 'バスルーム・浴室';
                break;
            case 'toilet':
                dirtType = this.state.dirtSeverity === 'light' ? '軽い汚れ' : '頑固な汚れ';
                surface = 'トイレ';
                break;
            case 'window':
                dirtType = this.state.dirtSeverity === 'light' ? '軽い水垢' : '頑固な水垢';
                surface = '窓・ガラス';
                break;
            case 'floor':
                dirtType = this.state.dirtSeverity === 'light' ? 'ホコリ' : '頑固な汚れ';
                surface = '床・フローリング';
                break;
            case 'living':
                dirtType = this.state.dirtSeverity === 'light' ? 'ホコリ' : '皮脂汚れ';
                surface = 'リビング';
                break;
            case 'aircon':
                dirtType = 'ホコリ';
                surface = 'エアコン';
                break;
            case 'washer':
                dirtType = 'カビ汚れ';
                surface = '洗濯機';
                break;
            default:
                if (this.state.selectedLocation === 'custom' && this.state.customLocation) {
                    surface = this.state.customLocation;
                    dirtType = '汚れ';
                }
        }
        
        const result = {
            dirtType: dirtType,
            surface: surface,
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
    generateCleaningMethod(dirtType, surface, severity = 'heavy') {
        console.log(`🧹 掃除方法生成: ${dirtType} - ${surface} (強度: ${severity})`);
        
        // 詳細な掃除方法テンプレート
        const methodTemplates = {
            '油汚れ': {
                light: {
                    title: `${surface}の日常的な油汚れ除去法`,
                    difficulty: '初級',
                    time: '15-20分',
                    steps: [
                        '🔧 準備：食器用中性洗剤、やわらかいスポンジ、マイクロファイバークロス2枚を用意',
                        '🌡️ 温度確認：火を使った後は完全に冷ましてから作業開始（やけど防止）',
                        '🧴 洗剤希釈：ぬるま湯200mlに食器用洗剤を2-3滴垂らして混ぜる',
                        '🧽 軽く拭き取り：希釈した洗剤でスポンジを湿らせ、円を描くように優しくこする',
                        '⏰ 理由：油は温度で柔らかくなるので、ぬるま湯が効果的',
                        '💧 1回目すすぎ：きれいな濡れタオルで洗剤をしっかり拭き取る',
                        '🔍 確認：汚れが残っていたら2-3回目の洗剤拭きを繰り返す',
                        '✨ 仕上げ：乾いたマイクロファイバークロスで水分と油膜を完全除去'
                    ],
                    tips: '💡 毎日の軽い拭き取りが一番効果的。油汚れは時間が経つほど固着するため、調理後すぐのお手入れを習慣にしましょう。',
                    warnings: '⚠️ 熱い状態での掃除は危険です。必ず冷ましてから作業してください。',
                    whyItWorks: '🔬 中性洗剤の界面活性剤が油と水を混ぜやすくし、温度で油を柔らかくすることで簡単に除去できます。'
                },
                heavy: {
                    title: `${surface}の頑固な油汚れ除去法`,
                    difficulty: '上級',
                    time: '45-60分',
                    steps: [
                        '🔧 準備：強力脱脂洗剤（マジックリンなど）、研磨パッド、ゴム手袋、マスク、プラスチックヘラ、重曹、古歯ブラシを用意',
                        '💨 環境整備：窓を開けて換気扇をまわし、ゴム手袋とマスクを着用',
                        '🌡️ 温め効果：ドライヤーで汚れ部分を30秒温める（油を柔らかくするため）',
                        '🧴 強力前処理：脱脂洗剤を厚めにスプレーし、ラップで覆って15-20分放置',
                        '⏰ 理由：時間をかけることで洗剤が油汚れの奥まで浸透します',
                        '🧽 第1段階：研磨パッドで力を入れて円を描くようにこすり落とす',
                        '🥄 固着除去：プラスチックヘラで固まった汚れを慎重に削り取る',
                        '🧂 重曹ペースト：頑固な部分は重曹+少量の水でペーストを作り、古歯ブラシでこする',
                        '💧 念入りすすぎ：お湯で洗剤と汚れをしっかり洗い流す',
                        '🔄 確認・再処理：汚れが残っていれば洗剤処理を繰り返す',
                        '✨ 最終仕上げ：乾いた布で水分を拭き取り、艶を出す'
                    ],
                    tips: '💡 一度に全部やろうとせず、小さなエリアずつ攻略しましょう。重曹は天然の研磨剤として安全で効果的です。',
                    warnings: '⚠️ 強力洗剤は皮膚を傷めるため必ず手袋着用。換気不足だと気分が悪くなる場合があります。',
                    whyItWorks: '🔬 アルカリ性洗剤が酸性の油汚れを中和し、温度と時間で分子レベルまで分解。物理的な研磨で完全除去します。'
                }
            },
            '頑固な油汚れ': {
                title: `${surface}の頑固な油汚れ除去法`,
                difficulty: '上級',
                time: '45-60分',
                steps: [
                    '🔧 準備：強力アルカリ性洗剤、研磨スポンジ、保護手袋、ヘラを用意',
                    '💨 安全確認：十分な換気を行い、保護手袋・マスクを着用する',
                    '🧴 前処理：強力洗剤を厚めにスプレーし、15-20分放置',
                    '🔥 加熱効果：可能であれば温風で温めて洗剤の効果を高める',
                    '🧽 強力清掃：研磨スポンジで力を込めてこすり落とす',
                    '🪚 固着除去：ヘラで固着した汚れを慎重に削り取る',
                    '💧 念入りすすぎ：洗剤をしっかりと拭き取る',
                    '✨ 仕上げ：乾いた布で完全に拭き取り、艶を出す'
                ],
                tips: '💡 重曹ペーストや業務用脱脂洗剤が効果的。複数回に分けて作業することも重要です。',
                warnings: '⚠️ 強力洗剤使用時は必ず保護具を着用し、十分な換気を行ってください。'
            },
            'カビ汚れ': {
                title: `${surface}のカビ除去法`,
                difficulty: '上級',
                time: '45-60分',
                steps: [
                    '🛡️ 安全準備：カビキラー、使い捨てマスク、ゴム手袋、保護メガネ、古歯ブラシ、雑巾を用意',
                    '💨 換気必須：全ての窓を開け、換気扇をつけて空気の流れを作る',
                    '👥 家族避難：小さなお子さんやペットは別の部屋に移動させる',
                    '🧴 カビ取り剤噴射：患部から20cm離してたっぷりとスプレー',
                    '⏰ 浸透時間：10-15分放置（カビの根まで薬剤を浸透させるため）',
                    '🚫 放置中注意：絶対に他の洗剤と混ぜない（有毒ガス発生の危険）',
                    '🪥 軽くブラッシング：古歯ブラシで優しくこすり、カビの根を除去',
                    '💧 大量すすぎ：シャワーで薬剤を完全に洗い流す（残留は肌に危険）',
                    '🌬️ 強制乾燥：ドライヤーや扇風機で完全に乾かす',
                    '🍶 予防処理：エタノール系除菌剤をスプレーして再発防止',
                    '🧹 清掃完了：使用した道具は全て処分またはよく洗う'
                ],
                tips: '💡 カビは見えない根っこが深くまで伸びています。表面だけでなく、しっかりと時間をかけて根絶やしにすることが重要です。',
                warnings: '⚠️ 塩素系漂白剤は強力な化学物質。肌や目に触れると危険です。万が一触れたら大量の水ですぐに洗い流してください。',
                whyItWorks: '🔬 次亜塩素酸がカビの細胞壁を破壊し、菌糸まで死滅させます。完全な乾燥で再発を防ぎます。'
            },
            '頑固なカビ': {
                title: `${surface}の頑固なカビ除去法`,
                difficulty: '上級',
                time: '60-90分',
                steps: [
                    '🛡️ 準備：強力カビ取り剤、硬めブラシ、マスク、手袋、ゴーグルを用意',
                    '💨 安全確認：強力な換気とマスク・手袋・ゴーグル着用',
                    '🧴 前処理：強力カビ取り剤を厚めに塗布し、20-30分放置',
                    '🪥 強力清掃：硬めブラシで根気よくこすり、カビを除去',
                    '🔄 再処理：必要に応じて洗剤を再塗布し、さらに放置',
                    '💧 念入りすすぎ：大量の水でカビ取り剤を完全に洗い流す',
                    '🌬️ 完全乾燥：送風機などを使用してしっかりと乾燥させる',
                    '🚿 除菌：アルコール系除菌剤で最終的な除菌を行う',
                    '🔍 確認：カビの取り残しがないか念入りにチェック'
                ],
                tips: '💡 頑固なカビには時間をかけた処理が必要。急がず丁寧に作業しましょう。',
                warnings: '⚠️ 強力なカビ取り剤使用時は特に注意。換気・保護具は絶対に必須です。'
            },
            'ホコリ': {
                title: `${surface}のホコリ除去法`,
                difficulty: '初級',
                time: '10-15分',
                steps: [
                    '🔧 準備：ダスタークロス、掃除機、雑巾を用意',
                    '💨 除塵：まずは掃除機でざっと吸い取る',
                    '🧽 拭き取り：ダスタークロスで細かいホコリを除去',
                    '💧 水拭き：軽く湿らせた雑巾で仕上げ拭き',
                    '✨ 乾拭き：乾いた布で水分を拭き取る'
                ],
                tips: '💡 定期的な掃除でホコリの蓄積を防ぎましょう。',
                warnings: '⚠️ ホコリは舞い上がりやすいので、上から下に向かって掃除しましょう。'
            }
        };
        
        // 汚れタイプに基づいてテンプレートを選択
        let template;
        if (severity === 'light' && methodTemplates[dirtType]?.light) {
            template = methodTemplates[dirtType].light;
        } else if (methodTemplates[dirtType]) {
            template = methodTemplates[dirtType].heavy || methodTemplates[dirtType];
        } else {
            // 直接一致するテンプレートを探す
            template = methodTemplates[dirtType];
        }
        
        if (!template) {
            return this.generateFallbackCleaningMethod(dirtType);
        }
        
        return {
            title: template.title || `${surface}の${dirtType}除去法`,
            dirtType,
            surface,
            severity,
            difficulty: template.difficulty || 'medium',
            time: template.time || '30分程度',
            steps: template.steps || [],
            tips: template.tips || '',
            warnings: template.warnings || '適切な道具と方法で安全に作業してください。',
            estimatedTime: template.time || '30分程度'
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
        
        // エラー通知を表示（HTMLを破壊しない）
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            z-index: 10000;
            background: #f8d7da;
            color: #721c24;
            padding: 20px;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <h3>⚠️ アプリケーションの初期化に失敗しました</h3>
            <p>エラー: ${error.message}</p>
            <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px; background: #dc3545; color: white; border: none; border-radius: 4px;">
                ページを再読み込み
            </button>
            <button onclick="this.parentElement.remove()" style="padding: 8px 16px; margin-top: 10px; margin-left: 10px; background: #6c757d; color: white; border: none; border-radius: 4px;">
                このメッセージを閉じる
            </button>
        `;
        document.body.appendChild(errorDiv);
        
        // フォールバックモード: 基本的なUI操作だけでも動作させる
        try {
            console.log('🔄 フォールバックモード開始');
            
            // 場所ボタンだけでも動作させる
            const locationButtons = document.querySelectorAll('[data-location]');
            locationButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const location = button.getAttribute('data-location');
                    console.log(`📍 フォールバックモード - 場所選択: ${location}`);
                    
                    // 簡易フィードバック
                    const feedback = document.createElement('div');
                    feedback.style.cssText = `
                        position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                        background: #d4edda; color: #155724; padding: 10px 15px;
                        border: 1px solid #c3e6cb; border-radius: 5px;
                    `;
                    feedback.textContent = `場所選択: ${location}`;
                    document.body.appendChild(feedback);
                    
                    setTimeout(() => feedback.remove(), 3000);
                });
            });
            
            console.log('✅ フォールバックモード設定完了');
        } catch (fallbackError) {
            console.error('❌ フォールバックモードも失敗:', fallbackError);
        }
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