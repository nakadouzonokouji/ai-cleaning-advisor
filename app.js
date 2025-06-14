// ステップバイステップ AI掃除アドバイザー - シンプル版
class StepWiseCleaningAdvisor {
    constructor() {
        this.currentStep = 1;
        this.selectedLocation = null;
        this.selectedLevel = null;
        this.selectedImage = null;
        
        console.log('🚀 ステップバイステップ AI掃除アドバイザー初期化開始');
        this.init();
    }
    
    init() {
        // イベントリスナーを設定
        this.setupEventListeners();
        
        // 外部プレースホルダーを無効化
        this.disableExternalPlaceholders();
        
        console.log('✅ 初期化完了');
    }
    
    setupEventListeners() {
        // ステップ1: 場所選択
        document.querySelectorAll('[data-location]').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectLocation(e.currentTarget.dataset.location);
            });
        });
        
        // ステップ2: 汚れ程度選択
        document.querySelectorAll('[data-level]').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectLevel(e.currentTarget.dataset.level);
            });
        });
        
        // ナビゲーションボタン
        const backToStep1 = document.getElementById('backToStep1');
        if (backToStep1) {
            backToStep1.addEventListener('click', () => this.goToStep(1));
        }
        
        const backToStep2 = document.getElementById('backToStep2');
        if (backToStep2) {
            backToStep2.addEventListener('click', () => this.goToStep(2));
        }
        
        // ステップ3: 写真関連
        const selectImageBtn = document.getElementById('selectImageBtn');
        if (selectImageBtn) {
            selectImageBtn.addEventListener('click', () => {
                document.getElementById('imageInput').click();
            });
        }
        
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.handleImageSelection(e);
            });
        }
        
        const skipPhoto = document.getElementById('skipPhoto');
        if (skipPhoto) {
            skipPhoto.addEventListener('click', () => {
                this.analyzeWithoutPhoto();
            });
        }
        
        const analyzeWithPhoto = document.getElementById('analyzeWithPhoto');
        if (analyzeWithPhoto) {
            analyzeWithPhoto.addEventListener('click', () => {
                this.analyzeWithPhoto();
            });
        }
        
        // ステップ4: 結果画面
        const newAnalysis = document.getElementById('newAnalysis');
        if (newAnalysis) {
            newAnalysis.addEventListener('click', () => {
                this.resetAnalysis();
            });
        }
        
        const shareResult = document.getElementById('shareResult');
        if (shareResult) {
            shareResult.addEventListener('click', () => {
                this.shareResult();
            });
        }
    }
    
    selectLocation(location) {
        console.log('📍 場所選択:', location);
        
        // 前の選択をリセット
        document.querySelectorAll('[data-location]').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 新しい選択をマーク
        event.currentTarget.classList.add('selected');
        this.selectedLocation = location;
        
        // 少し待ってから次のステップへ
        setTimeout(() => {
            this.goToStep(2);
        }, 500);
    }
    
    selectLevel(level) {
        console.log('🎯 汚れ程度選択:', level);
        
        // 前の選択をリセット
        document.querySelectorAll('[data-level]').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 新しい選択をマーク
        event.currentTarget.classList.add('selected');
        this.selectedLevel = level;
        
        // 少し待ってから次のステップへ
        setTimeout(() => {
            this.goToStep(3);
        }, 500);
    }
    
    handleImageSelection(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📷 画像選択:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('previewImg');
            const imagePreview = document.getElementById('imagePreview');
            const analyzeWithPhoto = document.getElementById('analyzeWithPhoto');
            
            if (img && imagePreview && analyzeWithPhoto) {
                img.src = e.target.result;
                imagePreview.classList.remove('hidden');
                analyzeWithPhoto.classList.remove('hidden');
                this.selectedImage = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
    
    analyzeWithoutPhoto() {
        console.log('🔍 写真なしで分析開始');
        this.startAnalysis(false);
    }
    
    analyzeWithPhoto() {
        console.log('🔍 写真ありで分析開始');
        this.startAnalysis(true);
    }
    
    async startAnalysis(withPhoto = false) {
        this.goToStep(4);
        
        // ローディング表示
        const analysisLoading = document.getElementById('analysisLoading');
        const analysisResult = document.getElementById('analysisResult');
        
        if (analysisLoading) analysisLoading.classList.remove('hidden');
        if (analysisResult) analysisResult.classList.add('hidden');
        
        try {
            // 分析実行
            const result = await this.performAnalysis(withPhoto);
            
            // 結果表示
            this.displayResult(result);
            
        } catch (error) {
            console.error('❌ 分析エラー:', error);
            this.displayError(error);
        } finally {
            if (analysisLoading) analysisLoading.classList.add('hidden');
        }
    }
    
    async performAnalysis(withPhoto) {
        console.log('🤖 AI分析実行中...');
        
        // 基本的な分析ロジック
        const locationInfo = this.getLocationInfo(this.selectedLocation);
        const levelInfo = this.getLevelInfo(this.selectedLevel);
        
        // 掃除方法を生成
        const cleaningMethod = this.generateCleaningMethod(locationInfo, levelInfo);
        
        // おすすめ商品を取得
        const products = this.getRecommendedProducts(locationInfo, levelInfo);
        
        // 2秒間の分析シミュレーション
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            location: locationInfo,
            level: levelInfo,
            cleaningMethod,
            products,
            imageAnalysis: withPhoto ? { detectedDirt: '油汚れ', confidence: 0.85 } : null
        };
    }
    
    getLocationInfo(location) {
        const locationMap = {
            kitchen: { name: 'キッチン', icon: '🔥', type: 'kitchen' },
            bathroom: { name: 'お風呂', icon: '🛁', type: 'bathroom' },
            toilet: { name: 'トイレ', icon: '🚽', type: 'toilet' },
            window: { name: '窓・ガラス', icon: '🪟', type: 'window' },
            floor: { name: '床・絨毯', icon: '🧹', type: 'floor' },
            living: { name: 'リビング', icon: '🛋️', type: 'living' }
        };
        
        return locationMap[location] || locationMap.kitchen;
    }
    
    getLevelInfo(level) {
        const levelMap = {
            light: { name: '軽い汚れ', intensity: 1, icon: '✨' },
            medium: { name: '中程度の汚れ', intensity: 2, icon: '⚠️' },
            heavy: { name: '頑固な汚れ', intensity: 3, icon: '🚨' }
        };
        
        return levelMap[level] || levelMap.medium;
    }
    
    generateCleaningMethod(location, level) {
        const methods = {
            kitchen: {
                1: {
                    title: 'キッチン軽い汚れの清掃方法',
                    steps: [
                        '🧽 **準備**: 中性洗剤、マイクロファイバークロス、乾いた布を用意',
                        '💧 **洗浄**: 汚れた箇所に中性洗剤をスプレーし、軽く拭き取る',
                        '🚰 **すすぎ**: 水で洗剤をしっかりと洗い流す',
                        '🧻 **仕上げ**: 乾いた布で水分を完全に拭き取り、乾燥させる'
                    ],
                    tips: '毎日の簡単なお手入れで汚れの蓄積を防げます',
                    time: '約5-10分'
                },
                2: {
                    title: 'キッチン中程度汚れの清掃方法', 
                    steps: [
                        '🧤 **準備**: ゴム手袋、アルカリ性洗剤、スポンジ、マイクロファイバークロスを用意',
                        '🚿 **予洗い**: 大きな汚れや食べカスを水で洗い流す',
                        '🧽 **洗剤塗布**: アルカリ性洗剤をスプレーし、10分程度放置して汚れを浮かせる',
                        '🔄 **擦り洗い**: スポンジで円を描くように擦り洗いする',
                        '💧 **すすぎ**: 洗剤を完全に洗い流す',
                        '✨ **仕上げ**: マイクロファイバークロスで仕上げ拭きし、完全に乾燥させる'
                    ],
                    tips: 'アルカリ性洗剤は油汚れに効果的です。換気を忘れずに！',
                    time: '約15-20分'
                },
                3: {
                    title: 'キッチン頑固汚れの清掃方法',
                    steps: [
                        '🧤 **安全準備**: ゴム手袋、マスク着用。換気扇を回す',
                        '🔥 **強力洗剤**: 専用の強力洗剤を汚れに直接塗布',
                        '⏰ **つけ置き**: 20-30分放置して汚れを十分に浮かせる',
                        '🪣 **温水準備**: 40-50℃のお湯を用意',
                        '🧽 **集中清掃**: ブラシで汚れを集中的に擦り落とす',
                        '🚰 **徹底すすぎ**: 温水で洗剤と汚れを完全に洗い流す',
                        '🧻 **完全乾燥**: 清潔な布で水分を拭き取り、自然乾燥させる'
                    ],
                    tips: '頑固な油汚れには温水が効果的。安全のため必ず換気してください',
                    time: '約30-45分'
                }
            },
            bathroom: {
                1: {
                    title: 'お風呂軽い汚れの清掃方法',
                    steps: [
                        '🛁 **準備**: バスクリーナー、スポンジ、シャワーを用意',
                        '💦 **予洗い**: シャワーで全体を軽く流す',
                        '🧽 **軽い清拭**: バスクリーナーをスプレーし、スポンジで軽く拭く',
                        '🚿 **すすぎ**: シャワーで洗剤を洗い流す',
                        '💨 **換気**: 換気扇を回して乾燥させる'
                    ],
                    tips: '入浴後の清掃が最も効果的です',
                    time: '約5-10分'
                },
                2: {
                    title: 'お風呂中程度汚れの清掃方法',
                    steps: [
                        '🧤 **準備**: ゴム手袋、カビ取り剤、ブラシ、スポンジを用意',
                        '💧 **予洗い**: シャワーで汚れや石鹸カスを洗い流す',
                        '🦠 **カビ取り剤**: カビ取り剤を汚れた箇所にスプレー',
                        '⏰ **待機**: 15分程度放置してカビや汚れを分解',
                        '🧽 **擦り洗い**: ブラシやスポンジで丁寧に擦り洗い',
                        '🚿 **徹底すすぎ**: シャワーで洗剤を完全に洗い流す',
                        '💨 **乾燥**: 換気扇で十分に乾燥させる'
                    ],
                    tips: 'カビ取り剤使用時は必ず換気し、他の洗剤と混ぜないよう注意',
                    time: '約20-30分'
                },
                3: {
                    title: 'お風呂頑固汚れ・カビの清掃方法',
                    steps: [
                        '🦺 **安全準備**: ゴム手袋、マスク、メガネ着用。強力換気',
                        '🧪 **強力洗剤**: 業務用強力カビ取り剤を使用',
                        '⏰ **長時間つけ置き**: 30分以上放置してカビを徹底分解',
                        '🪣 **温水準備**: 50℃程度の温水を用意',
                        '🧽 **集中清掃**: 硬めのブラシで頑固なカビを擦り落とす',
                        '🔄 **繰り返し**: 必要に応じて洗剤塗布と擦り洗いを繰り返す',
                        '🚿 **完全すすぎ**: 温水で洗剤を完全に洗い流す',
                        '💨 **徹底乾燥**: 長時間換気して完全に乾燥させる'
                    ],
                    tips: '強力な薬剤を使用するため、安全装備と換気が必須です',
                    time: '約45-60分'
                }
            },
            toilet: {
                1: {
                    title: 'トイレ軽い汚れの清掃方法',
                    steps: [
                        '🧻 **準備**: トイレクリーナー、除菌シート、トイレブラシを用意',
                        '🚽 **便器清拭**: トイレクリーナーで便器内外を軽く拭く',
                        '🧽 **ブラシ清掃**: トイレブラシで便器内を軽く擦る',
                        '💧 **水流し**: 水を流して汚れと洗剤を流す',
                        '🧻 **仕上げ**: 除菌シートで便座や周辺を拭く'
                    ],
                    tips: '毎日の軽い清掃で清潔を保てます',
                    time: '約3-5分'
                },
                2: {
                    title: 'トイレ中程度汚れの清掃方法',
                    steps: [
                        '🧤 **準備**: ゴム手袋、酸性洗剤、トイレブラシ、雑巾を用意',
                        '🚽 **便器内清掃**: 酸性洗剤を便器の縁裏まで塗布',
                        '⏰ **待機**: 10-15分放置して汚れを分解',
                        '🧽 **しっかり擦り**: トイレブラシで隅々まで擦り洗い',
                        '💧 **水流し**: 十分に水を流す',
                        '🧻 **周辺清掃**: 便座、蓋、床を除菌剤で清拭',
                        '💨 **換気**: 換気扇で臭いを除去'
                    ],
                    tips: '酸性洗剤は尿石除去に効果的。塩素系洗剤と絶対に混ぜないで',
                    time: '約15-20分'
                },
                3: {
                    title: 'トイレ頑固汚れ・尿石の清掃方法',
                    steps: [
                        '🦺 **安全準備**: ゴム手袋、マスク着用。換気扇作動',
                        '🧪 **強力酸性洗剤**: 業務用強力酸性洗剤を尿石に直接塗布',
                        '⏰ **長時間つけ置き**: 30分以上放置して尿石を溶解',
                        '🧽 **専用ブラシ**: 硬めの専用ブラシで念入りに擦る',
                        '🔄 **繰り返し**: 頑固な汚れには洗剤塗布と擦り洗いを繰り返す',
                        '💧 **大量水流し**: 大量の水で洗剤と汚れを完全に流す',
                        '🧻 **徹底清拭**: 除菌剤で便器全体と周辺を清拭',
                        '💨 **完全換気**: 長時間換気して薬剤臭を除去'
                    ],
                    tips: '強酸性洗剤は危険です。安全装備着用と換気を徹底してください',
                    time: '約40-60分'
                }
            },
            window: {
                1: {
                    title: '窓ガラス軽い汚れの清掃方法',
                    steps: [
                        '🪟 **準備**: ガラスクリーナー、マイクロファイバークロス2枚を用意',
                        '💨 **埃払い**: 乾いた布で表面の埃を払う',
                        '💦 **洗剤塗布**: ガラスクリーナーを均等にスプレー',
                        '🧻 **拭き取り**: マイクロファイバークロスで上から下に拭く',
                        '✨ **仕上げ**: 乾いたクロスで水分を完全に拭き取る'
                    ],
                    tips: 'マイクロファイバークロスで筋が残らずきれいに仕上がります',
                    time: '約5-10分'
                },
                2: {
                    title: '窓ガラス中程度汚れの清掃方法',
                    steps: [
                        '🪟 **準備**: 中性洗剤、バケツ、スポンジ、水切りワイパー、クロスを用意',
                        '💧 **洗剤水作成**: バケツにぬるま湯と中性洗剤を入れて薄める',
                        '🧽 **全体洗い**: スポンジで洗剤水を使って全体を洗う',
                        '💦 **すすぎ**: きれいな水で洗剤を洗い流す',
                        '🧽 **水切り**: 水切りワイパーで上から下に水を切る',
                        '🧻 **仕上げ拭き**: クロスで残った水分を拭き取る'
                    ],
                    tips: '水切りワイパーを使うとプロのような仕上がりになります',
                    time: '約15-25分'
                },
                3: {
                    title: '窓ガラス頑固汚れの清掃方法',
                    steps: [
                        '🪟 **準備**: 専用ガラス洗剤、スクレーパー、ワイパー、バケツ、クロスを用意',
                        '🧪 **強力洗剤**: 専用ガラス洗剤を汚れに厚めに塗布',
                        '⏰ **つけ置き**: 15-20分放置して汚れを十分に浮かせる',
                        '🔧 **スクレーパー**: 頑固な汚れをスクレーパーで慎重に削り取る',
                        '💧 **温水洗い**: 40℃程度の温水で洗剤と汚れを洗い流す',
                        '🧽 **ワイパー作業**: プロ用ワイパーで水を完全に切る',
                        '🧻 **最終仕上げ**: クロスで縁や角の水分を丁寧に拭き取る'
                    ],
                    tips: 'スクレーパー使用時はガラスを傷つけないよう注意深く作業してください',
                    time: '約30-45分'
                }
            },
            floor: {
                1: {
                    title: '床軽い汚れの清掃方法',
                    steps: [
                        '🧹 **準備**: 掃除機、フロアワイパー、ドライシートを用意',
                        '🗑️ **ゴミ除去**: 掃除機で髪の毛やゴミを吸い取る',
                        '🧽 **乾拭き**: フロアワイパーにドライシートを付けて乾拭き',
                        '✨ **仕上げ**: 隅々まで丁寧に拭いて埃を除去'
                    ],
                    tips: '毎日の簡単な掃除で床をきれいに保てます',
                    time: '約5-10分'
                },
                2: {
                    title: '床中程度汚れの清掃方法',
                    steps: [
                        '🧹 **準備**: 掃除機、モップ、フロアクリーナー、バケツを用意',
                        '🗑️ **掃除機がけ**: 髪の毛、埃、ゴミを掃除機で除去',
                        '💧 **洗剤水作成**: バケツにぬるま湯とフロアクリーナーを入れる',
                        '🧽 **モップがけ**: よく絞ったモップで全体を拭く',
                        '💨 **自然乾燥**: 窓を開けて自然乾燥させる'
                    ],
                    tips: 'モップは固く絞って水分を残さないようにしましょう',
                    time: '約15-20分'
                },
                3: {
                    title: '床頑固汚れの清掃方法',
                    steps: [
                        '🧹 **準備**: 掃除機、専用洗剤、ブラシ、モップ、バケツ2個を用意',
                        '🗑️ **完全除去**: 掃除機で大きなゴミや埃を完全に除去',
                        '🧪 **強力洗剤**: 頑固な汚れに専用洗剤を直接塗布',
                        '⏰ **つけ置き**: 15-20分放置して汚れを浮かせる',
                        '🧽 **ブラシ清掃**: ブラシで汚れを集中的に擦り落とす',
                        '💧 **温水すすぎ**: きれいな温水で洗剤を拭き取る',
                        '🧽 **モップ仕上げ**: 清潔なモップで最終的に拭き上げる',
                        '💨 **完全乾燥**: 十分に換気して完全に乾燥させる'
                    ],
                    tips: '床材に適した洗剤を選び、変色しないよう目立たない場所でテストしてください',
                    time: '約30-45分'
                }
            },
            living: {
                1: {
                    title: 'リビング軽い汚れの清掃方法',
                    steps: [
                        '🧽 **準備**: マイクロファイバークロス、ハンディモップを用意',
                        '💨 **埃払い**: ハンディモップで家具の埃を払う',
                        '🧻 **乾拭き**: マイクロファイバークロスで表面を乾拭き',
                        '✨ **仕上げ**: 隅々まで丁寧にホコリを除去'
                    ],
                    tips: 'マイクロファイバーは静電気でホコリをよく取ります',
                    time: '約5-10分'
                },
                2: {
                    title: 'リビング中程度汚れの清掃方法',
                    steps: [
                        '🧽 **準備**: 中性洗剤、クリーニングクロス、バケツを用意',
                        '💧 **洗剤水作成**: バケツにぬるま湯と中性洗剤を薄めて入れる',
                        '🧻 **固く絞る**: クロスを洗剤水に浸して固く絞る',
                        '🧽 **清拭**: 家具や表面を優しく拭き取る',
                        '💧 **水拭き**: きれいな水で洗剤を拭き取る',
                        '🧻 **乾拭き**: 乾いた布で水分を完全に拭き取る'
                    ],
                    tips: '木製家具は水分を嫌うので、クロスはしっかり絞ってください',
                    time: '約15-25分'
                },
                3: {
                    title: 'リビング頑固汚れの清掃方法',
                    steps: [
                        '🧽 **準備**: 専用クリーナー、ブラシセット、クロス複数枚を用意',
                        '🧪 **材質確認**: 家具の材質に適したクリーナーを選択',
                        '💦 **洗剤塗布**: 汚れに専用クリーナーを塗布',
                        '⏰ **待機**: 5-10分放置して汚れを浮かせる',
                        '🧽 **ブラシ清掃**: 柔らかいブラシで部分的に優しく擦る',
                        '🧻 **清拭**: きれいなクロスで洗剤を拭き取る',
                        '💧 **水拭き**: 湿らせたクロスで残った洗剤を除去',
                        '✨ **乾拭き仕上げ**: 乾いたクロスで完全に乾燥させる'
                    ],
                    tips: '素材を傷めないよう、目立たない場所で洗剤のテストを必ず行ってください',
                    time: '約25-40分'
                }
            }
        };
        
        const locationMethods = methods[location.type] || methods.kitchen;
        const method = locationMethods[level.intensity] || locationMethods[2];
        
        return {
            title: method.title,
            steps: method.steps,
            tips: method.tips,
            time: method.time
        };
    }
    
    getRecommendedProducts(location, level) {
        // 既存の包括的商品データベースを活用
        let products = [];
        
        console.log('🛒 商品推薦開始:', { location: location.type, level: level.intensity });
        
        if (window.COMPREHENSIVE_CLEANING_PRODUCTS) {
            console.log('📦 利用可能な商品カテゴリ:', Object.keys(window.COMPREHENSIVE_CLEANING_PRODUCTS));
            
            // 実際のデータベースキーに合わせて修正
            const categoryMap = {
                kitchen: ['oil_grease'],
                bathroom: ['mold_bathroom'], 
                toilet: ['toilet_cleaning'],
                window: ['glass_cleaning'],
                floor: ['floor_cleaning'],
                living: ['general_cleaning']
            };
            
            const relevantCategories = categoryMap[location.type] || ['oil_grease'];
            const allCategories = Object.keys(window.COMPREHENSIVE_CLEANING_PRODUCTS);
            
            console.log('🎯 対象カテゴリ:', relevantCategories);
            
            // まず関連カテゴリから商品を取得
            for (const categoryName of relevantCategories) {
                console.log(`🔍 カテゴリ "${categoryName}" をチェック中...`);
                
                if (window.COMPREHENSIVE_CLEANING_PRODUCTS[categoryName]?.products) {
                    const categoryProducts = window.COMPREHENSIVE_CLEANING_PRODUCTS[categoryName].products;
                    console.log(`✅ カテゴリ "${categoryName}" で ${categoryProducts.length} 商品発見`);
                    
                    // 汚れレベルに応じて商品を選択
                    let selectedProducts;
                    if (level.intensity === 1) { // 軽い汚れ
                        selectedProducts = categoryProducts.filter(p => !p.professional && !p.strength?.includes('強力'));
                    } else if (level.intensity === 3) { // 頑固な汚れ
                        selectedProducts = categoryProducts.filter(p => p.professional || p.strength?.includes('強力') || p.strength?.includes('超強力'));
                    } else { // 中程度
                        selectedProducts = categoryProducts.filter(p => !p.professional);
                    }
                    
                    // 選択された商品がない場合は全商品から選択
                    if (selectedProducts.length === 0) {
                        selectedProducts = categoryProducts;
                    }
                    
                    console.log(`🔎 レベル ${level.intensity} で選択された商品数: ${selectedProducts.length}`);
                    
                    // 上位2-3商品を追加
                    selectedProducts.slice(0, 3).forEach(product => {
                        products.push({
                            title: product.name,
                            price: this.formatPrice(product.asin),
                            image: this.getPlaceholderImage(),
                            rating: product.rating || 4.5,
                            reviews: product.reviews || 1000,
                            url: `https://www.amazon.co.jp/dp/${product.asin}?tag=${window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'}`,
                            bestseller: product.bestseller || false,
                            professional: product.professional || false,
                            description: this.getProductDescription(product, location, level)
                        });
                    });
                }
            }
            
            // 商品が足りない場合は他のカテゴリからも追加
            if (products.length < 4) {
                console.log(`🔄 商品不足 (${products.length}/4) - 他カテゴリから補充中...`);
                
                for (const categoryName of allCategories) {
                    if (products.length >= 4) break;
                    if (relevantCategories.includes(categoryName)) continue;
                    
                    console.log(`🔍 補充カテゴリ "${categoryName}" をチェック中...`);
                    
                    const categoryData = window.COMPREHENSIVE_CLEANING_PRODUCTS[categoryName];
                    if (categoryData?.products?.length > 0) {
                        const product = categoryData.products[0];
                        console.log(`✅ 補充商品追加: "${product.name}"`);
                        
                        products.push({
                            title: product.name,
                            price: this.formatPrice(product.asin),
                            image: this.getPlaceholderImage(),
                            rating: product.rating || 4.5,
                            reviews: product.reviews || 500,
                            url: `https://www.amazon.co.jp/dp/${product.asin}?tag=${window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'}`,
                            bestseller: product.bestseller || false,
                            description: '汚れ落としに効果的な洗剤です'
                        });
                    }
                }
            }
            
            console.log(`📊 最終商品数: ${products.length}`);
        } else {
            console.warn('❌ COMPREHENSIVE_CLEANING_PRODUCTS が見つかりません');
        }
        
        // フォールバック用商品データ
        if (products.length === 0) {
            console.log('🚨 フォールバック商品を使用します');
            
            const fallbackProducts = [
                {
                    title: `${location.name}用強力洗剤`,
                    price: '¥1,280',
                    image: this.getPlaceholderImage(),
                    rating: 4.4,
                    reviews: 2150,
                    url: 'https://www.amazon.co.jp/s?k=' + encodeURIComponent(`${location.name} 掃除 洗剤`) + '&tag=' + (window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'),
                    description: `${location.name}の${level.name}に特化した洗剤です`,
                    bestseller: true
                },
                {
                    title: `プロ仕様清掃ブラシセット`,
                    price: '¥980',
                    image: this.getPlaceholderImage(),
                    rating: 4.6,
                    reviews: 1850,
                    url: 'https://www.amazon.co.jp/s?k=' + encodeURIComponent('清掃 ブラシ セット') + '&tag=' + (window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'),
                    description: '様々な汚れに対応できる万能ブラシセットです',
                    professional: true
                },
                {
                    title: `マイクロファイバークロス10枚セット`,
                    price: '¥580',
                    image: this.getPlaceholderImage(),
                    rating: 4.3,
                    reviews: 3200,
                    url: 'https://www.amazon.co.jp/s?k=' + encodeURIComponent('マイクロファイバー クロス') + '&tag=' + (window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'),
                    description: '仕上げ拭きに最適な高品質クロスです'
                },
                {
                    title: `${location.name}清掃用品セット`,
                    price: '¥1,580',
                    image: this.getPlaceholderImage(),
                    rating: 4.5,
                    reviews: 1750,
                    url: 'https://www.amazon.co.jp/s?k=' + encodeURIComponent(`${location.name} 掃除 セット`) + '&tag=' + (window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'),
                    description: `${location.name}の清掃に必要な道具がセットになっています`
                }
            ];
            
            products = fallbackProducts;
        }
        
        return products.slice(0, 4); // 最大4商品を返す
    }
    
    getProductDescription(product, location, level) {
        // 商品の説明を動的に生成
        const locationDescMap = {
            kitchen: 'キッチンの油汚れ',
            bathroom: 'お風呂のカビや水垢',
            toilet: 'トイレの尿石や汚れ',
            window: 'ガラスの汚れ',
            floor: '床の汚れ',
            living: 'リビングの埃や汚れ'
        };
        
        const levelDescMap = {
            1: '軽い汚れ',
            2: '中程度の汚れ', 
            3: '頑固な汚れ'
        };
        
        const locationDesc = locationDescMap[location.type] || '汚れ';
        const levelDesc = levelDescMap[level.intensity] || '汚れ';
        
        if (product.professional) {
            return `${locationDesc}の${levelDesc}に対応するプロ仕様商品です`;
        } else if (product.bestseller) {
            return `${locationDesc}除去に人気の定番商品です`;
        } else {
            return `${locationDesc}の${levelDesc}除去に効果的です`;
        }
    }
    
    formatPrice(asin) {
        // ASINに基づく価格推定（実際のAPIは使用せず、推定価格を返す）
        const priceRange = ['¥680', '¥880', '¥1,200', '¥1,580', '¥2,200'];
        const hash = asin ? asin.charCodeAt(0) % priceRange.length : 0;
        return priceRange[hash];
    }
    
    getPlaceholderImage() {
        // Base64エンコードされたSVG画像（外部依存なし）
        const svg = `
            <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="150" fill="#f3f4f6"/>
                <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" 
                      font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
                    商品画像
                </text>
                <text x="100" y="95" text-anchor="middle" dominant-baseline="middle" 
                      font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
                    準備中
                </text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.trim())));
    }
    
    disableExternalPlaceholders() {
        // 全てのimg要素をチェックして外部プレースホルダーを無効化
        document.querySelectorAll('img').forEach(img => {
            if (img.src && (img.src.includes('via.placeholder') || img.src.includes('placeholder') || img.src.includes('placekitten') || img.src.includes('lorempixel') || img.src.includes('picsum') || img.src.includes('unsplash') || img.src.startsWith('https://via.'))) {
                console.log(`🔧 外部プレースホルダー画像を置換: ${img.src}`);
                img.src = this.getPlaceholderImage();
                img.onerror = () => { 
                    console.log('🖼️ 画像読み込み失敗 - 非表示にします');
                    img.style.display = 'none'; 
                };
            }
        });
        
        // 動的に追加される画像に対する監視
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const imgs = node.querySelectorAll ? node.querySelectorAll('img') : [];
                        imgs.forEach(img => {
                            if (img.src && (img.src.includes('via.placeholder') || img.src.includes('placeholder') || img.src.includes('placekitten') || img.src.includes('lorempixel') || img.src.includes('picsum') || img.src.startsWith('https://via.'))) {
                                console.log(`🔧 動的に追加された外部プレースホルダー画像を置換: ${img.src}`);
                                img.src = this.getPlaceholderImage();
                                img.onerror = () => { img.style.display = 'none'; };
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('✅ 外部プレースホルダー監視システム開始');
    }
    
    displayResult(result) {
        console.log('📊 結果表示:', result);
        
        // 外部プレースホルダーを無効化
        this.disableExternalPlaceholders();
        
        // 掃除方法を表示
        const methodElement = document.getElementById('cleaningMethod');
        if (methodElement) {
            const method = result.cleaningMethod;
            methodElement.innerHTML = `
                <div class="bg-blue-50 p-6 rounded-lg mb-4">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-bold text-blue-800">
                            ${result.location.icon} ${method.title}
                        </h4>
                        <span class="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ${method.time}
                        </span>
                    </div>
                    
                    <div class="space-y-3 mb-4">
                        ${method.steps.map((step, index) => `
                            <div class="flex items-start space-x-3">
                                <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                                    ${index + 1}
                                </span>
                                <p class="text-blue-700 flex-1">${step}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="bg-blue-100 p-3 rounded border-l-4 border-blue-400">
                        <p class="text-blue-800 font-semibold text-sm">💡 アドバイス</p>
                        <p class="text-blue-700 text-sm">${method.tips}</p>
                    </div>
                </div>
                
                ${result.imageAnalysis ? `
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 class="font-semibold text-green-800 mb-2 flex items-center">
                            <span class="mr-2">📷</span>AI画像分析結果
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-green-700 font-semibold">検出された汚れ:</span>
                                <span class="text-green-600">${result.imageAnalysis.detectedDirt}</span>
                            </div>
                            <div>
                                <span class="text-green-700 font-semibold">信頼度:</span>
                                <span class="text-green-600">${Math.round(result.imageAnalysis.confidence * 100)}%</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;
        }
        
        // おすすめ商品を表示
        const productsElement = document.getElementById('recommendedProducts');
        if (productsElement && result.products) {
            productsElement.innerHTML = result.products.map(product => `
                <div class="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
                    ${product.bestseller ? '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">ベストセラー</div>' : ''}
                    ${product.professional ? '<div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">プロ仕様</div>' : ''}
                    
                    <img src="${product.image}" alt="${product.title}" class="w-full h-32 object-cover rounded mb-3" 
                         onerror="this.style.display='none'">
                    
                    <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2">${product.title}</h4>
                    
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-lg font-bold text-green-600">${product.price}</p>
                        <div class="flex items-center">
                            <div class="flex text-yellow-400">
                                ${Array(5).fill().map((_, i) => 
                                    `<span class="${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}">★</span>`
                                ).join('')}
                            </div>
                            <span class="text-sm text-gray-600 ml-1">${product.rating}</span>
                        </div>
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-3">${product.description || ''}</p>
                    
                    <div class="text-xs text-gray-500 mb-3">
                        <span>レビュー: ${product.reviews?.toLocaleString() || '1,000+'}件</span>
                    </div>
                    
                    <a href="${product.url}" target="_blank" class="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 block text-center transition-colors font-semibold">
                        🛒 Amazonで購入
                    </a>
                </div>
            `).join('');
        }
        
        // 結果表示
        const analysisResult = document.getElementById('analysisResult');
        if (analysisResult) {
            analysisResult.classList.remove('hidden');
        }
    }
    
    displayError(error) {
        const methodElement = document.getElementById('cleaningMethod');
        if (methodElement) {
            methodElement.innerHTML = `
                <div class="bg-red-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-red-800 mb-2">❌ エラーが発生しました</h4>
                    <p class="text-red-700">申し訳ございません。分析中にエラーが発生しました。もう一度お試しください。</p>
                </div>
            `;
        }
        
        const analysisResult = document.getElementById('analysisResult');
        if (analysisResult) {
            analysisResult.classList.remove('hidden');
        }
    }
    
    goToStep(stepNumber) {
        console.log(`📍 ステップ${stepNumber}に移動`);
        
        // 現在のステップを非表示
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // 新しいステップを表示
        const newStep = document.getElementById(`step${stepNumber}`);
        if (newStep) {
            newStep.classList.remove('hidden');
            newStep.classList.add('fade-in');
        }
        
        // ステップインジケーターを更新
        this.updateStepIndicator(stepNumber);
        
        this.currentStep = stepNumber;
    }
    
    updateStepIndicator(currentStep) {
        for (let i = 1; i <= 4; i++) {
            const indicator = document.getElementById(`step${i}-indicator`);
            if (!indicator) continue;
            
            indicator.classList.remove('active', 'completed');
            
            if (i < currentStep) {
                indicator.classList.add('completed');
            } else if (i === currentStep) {
                indicator.classList.add('active');
            }
        }
    }
    
    resetAnalysis() {
        console.log('🔄 分析リセット');
        
        // 選択状態をリセット
        this.selectedLocation = null;
        this.selectedLevel = null;
        this.selectedImage = null;
        
        // UI選択状態をリセット
        document.querySelectorAll('.choice-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 画像プレビューをリセット
        const imagePreview = document.getElementById('imagePreview');
        const analyzeWithPhoto = document.getElementById('analyzeWithPhoto');
        const imageInput = document.getElementById('imageInput');
        
        if (imagePreview) imagePreview.classList.add('hidden');
        if (analyzeWithPhoto) analyzeWithPhoto.classList.add('hidden');
        if (imageInput) imageInput.value = '';
        
        // ステップ1に戻る
        this.goToStep(1);
    }
    
    shareResult() {
        console.log('📤 結果シェア');
        
        const shareText = `AI掃除アドバイザーで${this.getLocationInfo(this.selectedLocation).name}の${this.getLevelInfo(this.selectedLevel).name}の掃除方法を診断しました！`;
        
        if (navigator.share) {
            navigator.share({
                title: 'AI掃除アドバイザー診断結果',
                text: shareText,
                url: window.location.href
            });
        } else {
            // フォールバック: クリップボードにコピー
            navigator.clipboard.writeText(`${shareText} ${window.location.href}`).then(() => {
                alert('結果をクリップボードにコピーしました！');
            }).catch(() => {
                alert('シェア機能が利用できません');
            });
        }
    }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 DOM読み込み完了 - ステップバイステップ AI掃除アドバイザー開始');
    
    // エラーハンドリング強化
    window.addEventListener('error', (event) => {
        const errorMsg = event.error?.message || event.message || '';
        
        // 無視するエラーパターン
        const ignoredPatterns = [
            'via.placeholder',
            'Extension context invalidated',
            'chrome-extension://',
            'moz-extension://',
            'Non-Error promise rejection',
            'ResizeObserver loop limit exceeded'
        ];
        
        if (ignoredPatterns.some(pattern => 
            errorMsg.includes(pattern) || 
            (event.filename && event.filename.includes(pattern))
        )) {
            console.log('🔧 無害なエラーを無視:', errorMsg.substring(0, 50) + '...');
            event.preventDefault();
            return false;
        }
        
        console.warn('🚨 グローバルエラーをキャッチ:', errorMsg);
    });
    
    // 未処理のPromise拒否をキャッチ
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason?.toString() || '';
        
        // 無視するエラーパターン
        const ignoredPatterns = [
            'placeholder',
            'message channel closed',
            'listener indicated an asynchronous response',
            'Extension context invalidated',
            'chrome-extension://',
            'moz-extension://',
            'Non-Error promise rejection',
            'ResizeObserver loop limit exceeded',
            'Load failed'
        ];
        
        if (ignoredPatterns.some(pattern => reason.includes(pattern))) {
            console.log('🔧 無害なPromise拒否を無視:', reason.substring(0, 50) + '...');
            event.preventDefault();
            return;
        }
        
        console.warn('🚨 未処理のPromise拒否:', reason);
    });
    
    // 少し待ってから初期化（他のスクリプト読み込み完了を待つ）
    setTimeout(() => {
        try {
            window.stepWiseAdvisor = new StepWiseCleaningAdvisor();
        } catch (error) {
            console.error('❌ 初期化エラー:', error);
            // フォールバック処理
            console.log('🔄 フォールバック初期化を試行します');
            setTimeout(() => {
                try {
                    window.stepWiseAdvisor = new StepWiseCleaningAdvisor();
                } catch (fallbackError) {
                    console.error('❌ フォールバック初期化も失敗:', fallbackError);
                }
            }, 1000);
        }
    }, 500);
});

// ローディングスピナーアニメーション用CSS（既に存在しない場合）
if (!document.querySelector('#spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
        .loading-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}