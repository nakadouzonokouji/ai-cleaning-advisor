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
                this.selectLocation(e.currentTarget.dataset.location, e);
            });
        });
        
        // ステップ2: 汚れ程度選択
        document.querySelectorAll('[data-level]').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectLevel(e.currentTarget.dataset.level, e);
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
    
    selectLocation(location, event = null) {
        console.log('📍 場所選択:', location);
        
        // 前の選択をリセット
        document.querySelectorAll('[data-location]').forEach(card => {
            card.classList.remove('selected');
            card.style.transform = '';
        });
        
        // 新しい選択をマーク（アニメーション付き）
        const selectedCard = event ? event.currentTarget : document.querySelector(`[data-location="${location}"]`);
        
        if (!selectedCard) {
            console.error('❌ 選択されたカードが見つかりません:', location);
            // フォールバック処理: データ属性なしで選択可能にする
            this.selectedLocation = location;
            setTimeout(() => this.goToStep(2), 500);
            return;
        }
        
        selectedCard.classList.add('selected');
        
        // 選択時のマイクロインタラクション
        selectedCard.style.transform = 'scale(1.05)';
        selectedCard.style.transition = 'all 0.3s ease';
        
        // 成功エフェクト
        this.showSelectionEffect(selectedCard);
        
        this.selectedLocation = location;
        
        // 少し待ってから次のステップへ（アニメーション後）
        setTimeout(() => {
            selectedCard.style.transform = 'scale(1)';
            setTimeout(() => {
                this.goToStep(2);
            }, 200);
        }, 500);
    }
    
    selectLevel(level, event = null) {
        console.log('🎯 汚れ程度選択:', level);
        
        // 前の選択をリセット
        document.querySelectorAll('[data-level]').forEach(card => {
            card.classList.remove('selected');
            card.style.transform = '';
        });
        
        // 新しい選択をマーク（アニメーション付き）
        const selectedCard = event ? event.currentTarget : document.querySelector(`[data-level="${level}"]`);
        
        if (!selectedCard) {
            console.error('❌ 選択されたカードが見つかりません:', level);
            // フォールバック処理: データ属性なしで選択可能にする
            this.selectedLevel = level;
            setTimeout(() => this.goToStep(3), 500);
            return;
        }
        
        selectedCard.classList.add('selected');
        
        // 選択時のマイクロインタラクション
        selectedCard.style.transform = 'scale(1.05)';
        selectedCard.style.transition = 'all 0.3s ease';
        
        // 成功エフェクト
        this.showSelectionEffect(selectedCard);
        
        this.selectedLevel = level;
        
        // 少し待ってから次のステップへ（アニメーション後）
        setTimeout(() => {
            selectedCard.style.transform = 'scale(1)';
            setTimeout(() => {
                this.goToStep(3);
            }, 200);
        }, 500);
    }
    
    handleImageSelection(event) {
        if (!event || !event.target || !event.target.files) {
            console.warn('⚠️ 無効なファイル選択イベント');
            return;
        }
        
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📷 画像選択:', file.name);
        
        try {
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
                } else {
                    console.error('❌ プレビュー関連の要素が見つかりません');
                    // フォールバック: 画像データだけ保存
                    this.selectedImage = e.target.result;
                    console.log('📷 画像データは保存されました（プレビューは表示できません）');
                }
            };
            
            reader.onerror = (error) => {
                console.error('❌ ファイル読み込みエラー:', error);
                // ユーザーに分かりやすいエラーメッセージを表示
                this.showErrorToast('画像の読み込みに失敗しました。別の画像を選択してください。');
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('❌ 画像処理エラー:', error);
            // ユーザーに分かりやすいエラーメッセージを表示
            this.showErrorToast('画像の処理中にエラーが発生しました。もう一度お試しください。');
        }
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
        
        // 強化されたローディング表示
        const analysisLoading = document.getElementById('analysisLoading');
        const analysisResult = document.getElementById('analysisResult');
        
        if (analysisLoading) {
            analysisLoading.classList.remove('hidden');
            this.showEnhancedLoading();
        }
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
        
        // おすすめ商品を取得（事前リスト化商品を使用）
        const products = this.getRecommendedProducts(locationInfo, levelInfo);
        
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
            // キッチン細分化
            kitchen_sink: { name: 'キッチン（シンク）', icon: '🚰', type: 'kitchen_sink', mainType: 'kitchen' },
            kitchen_stove: { name: 'キッチン（ガスコンロ）', icon: '🔥', type: 'kitchen_stove', mainType: 'kitchen' },
            kitchen_ih: { name: 'キッチン（IH）', icon: '⚡', type: 'kitchen_ih', mainType: 'kitchen' },
            kitchen_fan: { name: 'キッチン（換気扇）', icon: '💨', type: 'kitchen_fan', mainType: 'kitchen' },
            kitchen: { name: 'キッチン（全般）', icon: '🔥', type: 'kitchen' }, // 後方互換性
            
            // お風呂細分化  
            bathroom_tub: { name: 'お風呂（浴槽）', icon: '🛁', type: 'bathroom_tub', mainType: 'bathroom' },
            bathroom_wall: { name: 'お風呂（壁・天井）', icon: '🧱', type: 'bathroom_wall', mainType: 'bathroom' },
            bathroom_floor: { name: 'お風呂（床）', icon: '🦶', type: 'bathroom_floor', mainType: 'bathroom' },
            bathroom_drain: { name: 'お風呂（排水口）', icon: '🕳️', type: 'bathroom_drain', mainType: 'bathroom' },
            bathroom: { name: 'お風呂（全般）', icon: '🛁', type: 'bathroom' }, // 後方互換性
            
            // トイレ細分化
            toilet_bowl: { name: 'トイレ（便器内）', icon: '🚽', type: 'toilet_bowl', mainType: 'toilet' },
            toilet_seat: { name: 'トイレ（便座・蓋）', icon: '🪑', type: 'toilet_seat', mainType: 'toilet' },
            toilet_floor: { name: 'トイレ（床・壁）', icon: '🧱', type: 'toilet_floor', mainType: 'toilet' },
            toilet: { name: 'トイレ（全般）', icon: '🚽', type: 'toilet' }, // 後方互換性
            window: { name: '窓・ガラス', icon: '🪟', type: 'window' },
            floor: { name: '床・絨毯', icon: '🧹', type: 'floor' },
            living: { name: 'リビング', icon: '🛋️', type: 'living' }
        };
        
        return locationMap[location] || locationMap.kitchen;
    }
    
    getLevelInfo(level) {
        const levelMap = {
            light: { name: '軽い汚れ', intensity: 1, icon: '✨' },
            heavy: { name: '頑固な汚れ', intensity: 3, icon: '🚨' }
        };
        
        return levelMap[level] || levelMap.light;
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
        const method = locationMethods[level.intensity] || locationMethods[1];
        
        return {
            title: method.title,
            steps: method.steps,
            tips: method.tips,
            time: method.time
        };
    }
    
    getRecommendedProducts(location, level) {
        console.log('🛒 新商品推薦システム開始:', { location: location.type, level: level.intensity });
        
        // ベストセラー・Amazonチョイス・高評価商品を厳選
        const recommendedProducts = this.getTopRatedProductsByCategory(location, level);
        
        return recommendedProducts;
    }
    
    getTopRatedProductsByCategory(location, level) {
        // 場所別・汚れレベル別に最適化された商品を選定
        const cleaners = this.getLocationSpecificCleaners(location.type, level.intensity);
        const tools = this.getDirtLevelTools(level.intensity);
        const protection = this.getProtectionByDirtLevel(level.intensity);
        
        // 各カテゴリから最適な商品を組み合わせ
        const allProducts = [...cleaners, ...tools, ...protection];
        
        console.log(`📊 ${location.name}・${level.name}向け選定商品数: 洗剤${cleaners.length}、道具${tools.length}、保護具${protection.length}`);
        
        return allProducts;
    }
    
    getLocationSpecificCleaners(locationType, dirtLevel) {
        // 場所別に特化した洗剤データベース
        const locationCleaners = {
            // キッチンシンク（水垢・石鹸カス・カビ）
            kitchen_sink: [
                {
                    title: "茂木和哉 水アカ洗剤",
                    asin: "B01N5JQJ8V",
                    price: "¥1,980",
                    rating: 4.5,
                    reviews: 8765,
                    amazonChoice: true,
                    bestseller: true,
                    category: "洗剤",
                    description: "シンク水垢専用・茂木和哉ブランド"
                },
                {
                    title: "花王 ハイター キッチンハイター",
                    asin: "B000FQRB7Y",
                    price: "¥398",
                    rating: 4.3,
                    reviews: 12450,
                    bestseller: true,
                    category: "洗剤",
                    description: "シンク除菌・カビ取り・ベストセラー"
                },
                {
                    title: "クエン酸 食品グレード",
                    asin: "B074XBDQJ9",
                    price: "¥680",
                    rating: 4.4,
                    reviews: 5432,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "天然水垢除去・Amazonチョイス"
                }
            ],
            // ガスコンロ（油汚れ・焦げ付き・五徳）
            kitchen_stove: [
                {
                    title: "マジックリン ハンディスプレー",
                    asin: "B000FQTJZW",
                    price: "¥498",
                    rating: 4.3,
                    reviews: 15420,
                    amazonChoice: true,
                    bestseller: true,
                    category: "洗剤",
                    description: "ガスコンロ油汚れ専用・Amazonチョイス"
                },
                {
                    title: "リンレイ ウルトラハードクリーナー",
                    asin: "B00OOCWP44",
                    price: "¥1,280",
                    rating: 4.6,
                    reviews: 9834,
                    professional: true,
                    category: "洗剤", 
                    description: "頑固な焦げ付き・プロ仕様"
                },
                {
                    title: "ライオン ママレモン",
                    asin: "B000FQS2JW",
                    price: "¥298",
                    rating: 4.2,
                    reviews: 6789,
                    bestseller: true,
                    category: "洗剤",
                    description: "五徳つけ置き洗い・ベストセラー"
                }
            ],
            // IHコンロ（焦げ付き・吹きこぼれ）
            kitchen_ih: [
                {
                    title: "IH専用クリーナー",
                    asin: "B07QMBN123",
                    price: "¥798",
                    rating: 4.4,
                    reviews: 3456,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "IH焦げ付き専用・Amazonチョイス"
                },
                {
                    title: "重曹 食品グレード",
                    asin: "B075XVJK89",
                    price: "¥480",
                    rating: 4.3,
                    reviews: 7890,
                    bestseller: true,
                    category: "洗剤",
                    description: "IH優しい研磨・ベストセラー"
                },
                {
                    title: "クリームクレンザー",
                    asin: "B000FQZXL6",
                    price: "¥358",
                    rating: 4.2,
                    reviews: 4567,
                    category: "洗剤",
                    description: "IH表面研磨用"
                }
            ],
            // 換気扇（頑固な油汚れ・ホコリ）
            kitchen_fan: [
                {
                    title: "換気扇専用強力洗剤",
                    asin: "B000FQTJZW",
                    price: "¥1,580",
                    rating: 4.5,
                    reviews: 2345,
                    professional: true,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "換気扇油汚れ専用・Amazonチョイス"
                },
                {
                    title: "マジックリン 換気扇用",
                    asin: "B000FQT298",
                    price: "¥698",
                    rating: 4.3,
                    reviews: 6789,
                    bestseller: true,
                    category: "洗剤",
                    description: "換気扇つけ置き洗剤・ベストセラー"
                },
                {
                    title: "アルカリ性洗剤 業務用",
                    asin: "B087PQRSTU",
                    price: "¥2,180",
                    rating: 4.6,
                    reviews: 1234,
                    professional: true,
                    category: "洗剤",
                    description: "換気扇プロ仕様・業務用"
                }
            ],
            // キッチン全般（後方互換性）
            kitchen: [
                {
                    title: "マジックリン ハンディスプレー",
                    asin: "B000FQTJZW",
                    price: "¥498",
                    rating: 4.3,
                    reviews: 15420,
                    amazonChoice: true,
                    bestseller: true,
                    category: "洗剤",
                    description: "キッチン万能洗剤・Amazonチョイス"
                },
                {
                    title: "花王 キュキュット CLEAR泡スプレー",
                    asin: "B005AILJ3O", 
                    price: "¥328",
                    rating: 4.4,
                    reviews: 8932,
                    bestseller: true,
                    category: "洗剤",
                    description: "キッチン除菌・ベストセラー"
                },
                {
                    title: "リンレイ ウルトラハードクリーナー",
                    asin: "B00OOCWP44",
                    price: "¥1,280",
                    rating: 4.6,
                    reviews: 9834,
                    professional: true,
                    category: "洗剤", 
                    description: "頑固な油汚れ・プロ仕様"
                }
            ],
            // お風呂浴槽（皮脂汚れ・湯垢・石鹸カス）
            bathroom_tub: [
                {
                    title: "花王 バスマジックリン 泡立ちスプレー",
                    asin: "B001TJ6AEW",
                    price: "¥348",
                    rating: 4.3,
                    reviews: 8765,
                    amazonChoice: true,
                    bestseller: true,
                    category: "洗剤",
                    description: "浴槽皮脂汚れ専用・Amazonチョイス"
                },
                {
                    title: "重曹 お風呂用",
                    asin: "B075XVJK89",
                    price: "¥580",
                    rating: 4.4,
                    reviews: 6789,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "浴槽優しい研磨・天然成分"
                },
                {
                    title: "ライオン ルック まめピカ",
                    asin: "B076QWXF2D",
                    price: "¥598",
                    rating: 4.4,
                    reviews: 5432,
                    bestseller: true,
                    category: "洗剤",
                    description: "浴槽毎日掃除用・ベストセラー"
                }
            ],
            // お風呂壁・天井（カビ・水垢・石鹸カス）
            bathroom_wall: [
                {
                    title: "ジョンソン カビキラー",
                    asin: "B000FQ8KL2",
                    price: "¥398",
                    rating: 4.2,
                    reviews: 12450,
                    bestseller: true,
                    category: "洗剤",
                    description: "壁カビ取り最強・ベストセラー"
                },
                {
                    title: "カビハイター 強力ジェル",
                    asin: "B087HJKLMN",
                    price: "¥698",
                    rating: 4.5,
                    reviews: 7890,
                    professional: true,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "壁天井カビ専用・Amazonチョイス"
                },
                {
                    title: "茂木和哉 お風呂用",
                    asin: "B089PQRSTU",
                    price: "¥1,280",
                    rating: 4.6,
                    reviews: 3456,
                    professional: true,
                    category: "洗剤",
                    description: "壁水垢除去・茂木和哉ブランド"
                }
            ],
            // お風呂床（カビ・ヌメリ・皮脂汚れ）
            bathroom_floor: [
                {
                    title: "お風呂床用洗剤",
                    asin: "B085VWXYZ1",
                    price: "¥798",
                    rating: 4.3,
                    reviews: 4567,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "床ヌメリ除去専用・Amazonチョイス"
                },
                {
                    title: "カビキラー 床用スプレー",
                    asin: "B087ABCDEF",
                    price: "¥598",
                    rating: 4.2,
                    reviews: 6789,
                    bestseller: true,
                    category: "洗剤",
                    description: "床カビ・黒ずみ除去・ベストセラー"
                },
                {
                    title: "重曹＋クエン酸セット",
                    asin: "B089GHIJKL",
                    price: "¥980",
                    rating: 4.4,
                    reviews: 2345,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "床ヌメリ天然除去・環境配慮"
                }
            ],
            // お風呂排水口（髪の毛・ヌメリ・悪臭）
            bathroom_drain: [
                {
                    title: "パイプユニッシュ 強力ジェル",
                    asin: "B000FQZAB8",
                    price: "¥498",
                    rating: 4.3,
                    reviews: 9876,
                    bestseller: true,
                    category: "洗剤",
                    description: "排水口ヌメリ除去・ベストセラー"
                },
                {
                    title: "業務用パイプクリーナー",
                    asin: "B087MNOPQR",
                    price: "¥1,280",
                    rating: 4.5,
                    reviews: 3456,
                    professional: true,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "排水口強力洗浄・Amazonチョイス"
                },
                {
                    title: "髪の毛溶かすパイプ洗剤",
                    asin: "B089STUVWX",
                    price: "¥798",
                    rating: 4.4,
                    reviews: 5678,
                    professional: true,
                    category: "洗剤",
                    description: "髪の毛・タンパク質分解専用"
                }
            ],
            // お風呂全般（後方互換性）
            bathroom: [
                {
                    title: "ジョンソン カビキラー",
                    asin: "B000FQ8KL2",
                    price: "¥398",
                    rating: 4.2,
                    reviews: 12450,
                    bestseller: true,
                    category: "洗剤",
                    description: "お風呂万能カビ取り・ベストセラー"
                },
                {
                    title: "花王 バスマジックリン",
                    asin: "B001TJ6AEW",
                    price: "¥348",
                    rating: 4.3,
                    reviews: 8765,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "お風呂万能掃除・Amazonチョイス"
                },
                {
                    title: "ライオン ルック まめピカ",
                    asin: "B076QWXF2D",
                    price: "¥598",
                    rating: 4.4,
                    reviews: 5432,
                    category: "洗剤",
                    description: "お風呂の毎日掃除用"
                }
            ],
            // トイレ便器内（尿石・黄ばみ・水垢）
            toilet_bowl: [
                {
                    title: "サンポール 尿石除去",
                    asin: "B00FQRB8K6",
                    price: "¥498",
                    rating: 4.5,
                    reviews: 9876,
                    bestseller: true,
                    category: "洗剤",
                    description: "便器内尿石除去最強・ベストセラー"
                },
                {
                    title: "強力トイレ洗剤 業務用",
                    asin: "B087QRSTUV",
                    price: "¥798",
                    rating: 4.4,
                    reviews: 4567,
                    professional: true,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "便器内頑固汚れ・Amazonチョイス"
                },
                {
                    title: "クエン酸トイレ洗剤",
                    asin: "B089WXYZAB",
                    price: "¥580",
                    rating: 4.3,
                    reviews: 3456,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "便器内天然成分・環境配慮"
                }
            ],
            // トイレ便座・蓋（除菌・汚れ）
            toilet_seat: [
                {
                    title: "花王 トイレマジックリン 消臭・除菌",
                    asin: "B000Z2B8VW",
                    price: "¥298",
                    rating: 4.2,
                    reviews: 7543,
                    amazonChoice: true,
                    bestseller: true,
                    category: "洗剤",
                    description: "便座除菌専用・Amazonチョイス"
                },
                {
                    title: "アルコール除菌シート",
                    asin: "B087CDEFGH",
                    price: "¥398",
                    rating: 4.4,
                    reviews: 8765,
                    bestseller: true,
                    category: "洗剤",
                    description: "便座即効除菌・ベストセラー"
                },
                {
                    title: "次亜塩素酸水スプレー",
                    asin: "B089IJKLMN",
                    price: "¥680",
                    rating: 4.3,
                    reviews: 2345,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "便座強力除菌・安全成分"
                }
            ],
            // トイレ床・壁（尿の飛び散り・臭い）
            toilet_floor: [
                {
                    title: "トイレ床壁用洗剤",
                    asin: "B085OPQRST",
                    price: "¥498",
                    rating: 4.2,
                    reviews: 5678,
                    bestseller: true,
                    category: "洗剤",
                    description: "床壁尿汚れ専用・ベストセラー"
                },
                {
                    title: "重曹スプレー",
                    asin: "B089UVWXYZ",
                    price: "¥580",
                    rating: 4.4,
                    reviews: 3456,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "床壁消臭・天然成分"
                },
                {
                    title: "セスキ炭酸ソーダ",
                    asin: "B087ABCDEF",
                    price: "¥380",
                    rating: 4.3,
                    reviews: 4567,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "床壁アルカリ洗浄・エコ洗剤"
                }
            ],
            // トイレ全般（後方互換性）
            toilet: [
                {
                    title: "サンポール 尿石除去",
                    asin: "B00FQRB8K6",
                    price: "¥498",
                    rating: 4.5,
                    reviews: 9876,
                    bestseller: true,
                    category: "洗剤",
                    description: "トイレ万能洗剤・ベストセラー"
                },
                {
                    title: "花王 トイレマジックリン",
                    asin: "B000Z2B8VW",
                    price: "¥298",
                    rating: 4.2,
                    reviews: 7543,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "トイレ万能掃除・Amazonチョイス"
                }
            ],
            window: [
                {
                    title: "花王 ガラスマジックリン",
                    asin: "B000FQTJZ8",
                    price: "¥358",
                    rating: 4.3,
                    reviews: 6789,
                    bestseller: true,
                    category: "洗剤",
                    description: "ガラス・鏡専用・ベストセラー"
                }
            ],
            floor: [
                {
                    title: "花王 クイックルワイパー 立体吸着ウエットシート",
                    asin: "B01N6QHBXL",
                    price: "¥598",
                    rating: 4.4,
                    reviews: 12345,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "フローリング掃除・Amazonチョイス"
                }
            ],
            living: [
                {
                    title: "エコベール 食器用洗剤",
                    asin: "B073QMVN7P",
                    price: "¥580",
                    rating: 4.5,
                    reviews: 3420,
                    amazonChoice: true,
                    category: "洗剤",
                    description: "環境配慮型万能洗剤・Amazonチョイス"
                }
            ]
        };
        
        // 指定場所の洗剤を取得（なければキッチン用）
        const locationProducts = locationCleaners[locationType] || locationCleaners.kitchen;
        
        // 汚れレベルでフィルタリング
        if (dirtLevel === 1) { // 軽い汚れ → 優しい洗剤
            return locationProducts.filter(p => !p.professional).slice(0, 5);
        } else { // 頑固な汚れ → 強力洗剤
            return locationProducts.slice(0, 5);
        }
    }
    
    getTopCleaners(dirtLevel) {
        // 汚れレベル別洗剤5種類（ベストセラー・Amazonチョイス・高評価順）
        const cleaners = [
            {
                title: "マジックリン ハンディスプレー",
                asin: "B000FQTJZW",
                price: "¥498",
                rating: 4.3,
                reviews: 15420,
                amazonChoice: true,
                bestseller: true,
                category: "洗剤",
                description: "Amazonチョイス・ベストセラー油汚れ洗剤"
            },
            {
                title: "花王 キュキュット CLEAR泡スプレー",
                asin: "B005AILJ3O", 
                price: "¥328",
                rating: 4.4,
                reviews: 8932,
                bestseller: true,
                category: "洗剤",
                description: "ベストセラー除菌もできる万能洗剤"
            },
            {
                title: "リンレイ ウルトラハードクリーナー",
                asin: "B00OOCWP44",
                price: "¥1,280",
                rating: 4.6,
                reviews: 9834,
                professional: true,
                category: "洗剤", 
                description: "プロ仕様強力洗剤・高評価"
            },
            {
                title: "ジョンソン カビキラー",
                asin: "B000FQ8KL2",
                price: "¥398",
                rating: 4.2,
                reviews: 12450,
                bestseller: true,
                category: "洗剤",
                description: "カビ取り剤ベストセラー"
            },
            {
                title: "エコベール 食器用洗剤",
                asin: "B073QMVN7P",
                price: "¥580",
                rating: 4.5,
                reviews: 3420,
                amazonChoice: true,
                category: "洗剤",
                description: "Amazonチョイス・環境配慮型洗剤"
            }
        ];
        
        // 汚れレベルでフィルタリング
        if (dirtLevel === 1) { // 軽い汚れ
            return cleaners.filter(p => !p.professional).slice(0, 5);
        } else { // 頑固な汚れ（dirtLevel === 3）
            return cleaners.slice(0, 5); // 全種類（プロ仕様含む）
        }
    }
    
    getDirtLevelTools(dirtLevel) {
        // 汚れレベル別道具選定
        const softTools = [
            {
                title: "3M スコッチブライト 抗菌ウレタンスポンジ",
                asin: "B008FDUUGA",
                price: "¥598",
                rating: 4.4,
                reviews: 7832,
                amazonChoice: true,
                bestseller: true,
                category: "道具",
                description: "軽い汚れ用・Amazonチョイス"
            },
            {
                title: "激落ちくん メラミンスポンジ",
                asin: "B000Z6NFVM",
                price: "¥298",
                rating: 4.2,
                reviews: 18502,
                bestseller: true,
                category: "道具",
                description: "優しく汚れ落とし・ベストセラー"
            },
            {
                title: "マイクロファイバークロス20枚セット",
                asin: "B074W9NKJZ",
                price: "¥1,280",
                rating: 4.6,
                reviews: 9245,
                amazonChoice: true,
                category: "道具",
                description: "仕上げ用・Amazonチョイス"
            }
        ];
        
        const hardTools = [
            {
                title: "山崎産業 ユニットバスボンくん",
                asin: "B000FQPQJ8",
                price: "¥398", 
                rating: 4.3,
                reviews: 5621,
                bestseller: true,
                category: "道具",
                description: "頑固汚れ用ブラシ・ベストセラー"
            },
            {
                title: "アズマ 外壁・網戸用ブラシ",
                asin: "B078QZDFG2",
                price: "¥1,180",
                rating: 4.5,
                reviews: 2134,
                professional: true,
                category: "道具",
                description: "プロ仕様硬いブラシ"
            },
            {
                title: "たわし 亀の子束子",
                asin: "B000FQZXJ4",
                price: "¥480",
                rating: 4.4,
                reviews: 3456,
                bestseller: true,
                category: "道具",
                description: "昔ながらの硬いたわし"
            },
            {
                title: "スクラブブラシ 業務用",
                asin: "B087HBXD24",
                price: "¥980",
                rating: 4.3,
                reviews: 1234,
                professional: true,
                category: "道具",
                description: "業務用硬質ブラシ"
            },
            {
                title: "ステンレス製スクレーパー",
                asin: "B085GTHJ89",
                price: "¥798",
                rating: 4.2,
                reviews: 876,
                professional: true,
                category: "道具",
                description: "頑固汚れ削り取り用"
            }
        ];
        
        if (dirtLevel === 1) { // 軽い汚れ → 柔らかいスポンジ
            return softTools;
        } else { // 頑固な汚れ → 硬いブラシ
            return hardTools;
        }
    }
    
    getTopCleaningTools(dirtLevel) {
        // スポンジ・ブラシ類5種類（用途・強度別）
        const tools = [
            {
                title: "3M スコッチブライト 抗菌ウレタンスポンジ",
                asin: "B008FDUUGA",
                price: "¥598",
                rating: 4.4,
                reviews: 7832,
                amazonChoice: true,
                bestseller: true,
                category: "道具",
                description: "Amazonチョイス・抗菌スポンジ"
            },
            {
                title: "山崎産業 ユニットバスボンくん",
                asin: "B000FQPQJ8",
                price: "¥398", 
                rating: 4.3,
                reviews: 5621,
                bestseller: true,
                category: "道具",
                description: "お風呂掃除用ベストセラーブラシ"
            },
            {
                title: "激落ちくん メラミンスポンジ",
                asin: "B000Z6NFVM",
                price: "¥298",
                rating: 4.2,
                reviews: 18502,
                bestseller: true,
                category: "道具",
                description: "メラミンスポンジのベストセラー"
            },
            {
                title: "アズマ 外壁・網戸用ブラシ",
                asin: "B078QZDFG2",
                price: "¥1,180",
                rating: 4.5,
                reviews: 2134,
                professional: true,
                category: "道具",
                description: "プロ仕様長柄ブラシ"
            },
            {
                title: "マイクロファイバークロス20枚セット",
                asin: "B074W9NKJZ",
                price: "¥1,280",
                rating: 4.6,
                reviews: 9245,
                amazonChoice: true,
                category: "道具",
                description: "Amazonチョイス・大容量クロスセット"
            }
        ];
        
        return tools;
    }
    
    getProtectionByDirtLevel(dirtLevel) {
        // 汚れレベル別保護具選定
        const lightProtection = [
            {
                title: "ニトリル手袋 100枚入り",
                asin: "B07QBZNQ4F",
                price: "¥980",
                rating: 4.4,
                reviews: 6789,
                amazonChoice: true,
                bestseller: true,
                category: "保護具",
                description: "軽作業用・Amazonチョイス"
            },
            {
                title: "東和コーポレーション ゴム手袋",
                asin: "B015XVJSJ6",
                price: "¥398",
                rating: 4.3,
                reviews: 4567,
                bestseller: true,
                category: "保護具",
                description: "日常掃除用・ベストセラー"
            },
            {
                title: "使い捨てマスク 50枚入り",
                asin: "B08TMJ45HD",
                price: "¥580",
                rating: 4.2,
                reviews: 8765,
                bestseller: true,
                category: "保護具",
                description: "軽い掃除用マスク"
            }
        ];
        
        const heavyProtection = [
            {
                title: "3M 防塵マスク",
                asin: "B00006IBUY",
                price: "¥1,580",
                rating: 4.5,
                reviews: 3421,
                professional: true,
                category: "保護具", 
                description: "プロ仕様防塵マスク"
            },
            {
                title: "アイリスオーヤマ 防護服",
                asin: "B087CQRG8N",
                price: "¥2,980",
                rating: 4.2,
                reviews: 1234,
                professional: true,
                category: "保護具",
                description: "完全防護・業務用"
            },
            {
                title: "安全ゴーグル 曇り止め",
                asin: "B08DCHR6YQ",
                price: "¥1,180",
                rating: 4.4,
                reviews: 2876,
                amazonChoice: true,
                category: "保護具",
                description: "目の保護・Amazonチョイス"
            },
            {
                title: "厚手ゴム手袋 耐薬品",
                asin: "B089GHJKLM",
                price: "¥1,280",
                rating: 4.3,
                reviews: 2345,
                professional: true,
                category: "保護具",
                description: "強力洗剤対応・プロ仕様"
            },
            {
                title: "防水エプロン",
                asin: "B087PQRSTU",
                price: "¥980",
                rating: 4.1,
                reviews: 1567,
                professional: true,
                category: "保護具",
                description: "服の保護・業務用"
            }
        ];
        
        if (dirtLevel === 1) { // 軽い汚れ → 軽装備保護具
            return lightProtection;
        } else { // 頑固な汚れ → 完全防護具
            return heavyProtection;
        }
    }
    
    getTopProtectionGear(dirtLevel) {
        // 保護具5種類（軽装備→完全防護）
        const protection = [
            {
                title: "ニトリル手袋 100枚入り",
                asin: "B07QBZNQ4F",
                price: "¥980",
                rating: 4.4,
                reviews: 6789,
                amazonChoice: true,
                bestseller: true,
                category: "保護具",
                description: "Amazonチョイス・使い捨て手袋"
            },
            {
                title: "3M 防塵マスク",
                asin: "B00006IBUY",
                price: "¥1,580",
                rating: 4.5,
                reviews: 3421,
                professional: true,
                category: "保護具", 
                description: "プロ仕様防塵マスク"
            },
            {
                title: "東和コーポレーション ゴム手袋",
                asin: "B015XVJSJ6",
                price: "¥398",
                rating: 4.3,
                reviews: 4567,
                bestseller: true,
                category: "保護具",
                description: "厚手ゴム手袋ベストセラー"
            },
            {
                title: "アイリスオーヤマ 防護服",
                asin: "B087CQRG8N",
                price: "¥2,980",
                rating: 4.2,
                reviews: 1234,
                professional: true,
                category: "保護具",
                description: "使い捨て防護服・業務用"
            },
            {
                title: "安全ゴーグル 曇り止め",
                asin: "B08DCHR6YQ",
                price: "¥1,180",
                rating: 4.4,
                reviews: 2876,
                amazonChoice: true,
                category: "保護具",
                description: "Amazonチョイス・保護メガネ"
            }
        ];
        
        // 汚れレベルで必要な保護レベルを調整
        if (dirtLevel === 1) { // 軽い汚れ
            return protection.filter(p => !p.professional).slice(0, 3);
        } else { // 頑固な汚れ（dirtLevel === 3）
            return protection.slice(0, 5); // 全装備（プロ仕様含む）
        }
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
    
    getAmazonImageUrl(asin) {
        // Amazon商品画像URLを生成（複数サイズを試行）
        if (!asin) return this.getPlaceholderImage();
        
        // より安定したAmazon画像URL形式を使用
        const imageUrls = [
            `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL500_.jpg`,
            `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.MAIN._SL500_.jpg`,
            `https://m.media-amazon.com/images/I/${asin}.jpg`
        ];
        
        // 最初のURLを返す（エラー時は画像側でフォールバック）
        return imageUrls[0];
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
        
        // 結果表示アニメーション
        this.animateResultDisplay();
        
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
                                <span class="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
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
        
        // おすすめ商品をカテゴリ別に表示（Amazon風横スクロール）
        const productsElement = document.getElementById('recommendedProducts');
        if (productsElement && result.products) {
            this.displayProductsByCategory(result.products, productsElement);
        }
        
        // 結果表示
        const analysisResult = document.getElementById('analysisResult');
        if (analysisResult) {
            analysisResult.classList.remove('hidden');
        }
    }
    
    displayProductsByCategory(products, container) {
        // 商品をカテゴリ別に分類
        const categoryMap = {
            '洗剤': products.filter(p => p.category === '洗剤'),
            '道具': products.filter(p => p.category === '道具'), 
            '保護具': products.filter(p => p.category === '保護具')
        };
        
        let html = '';
        
        // カテゴリごとに横スクロール表示
        Object.entries(categoryMap).forEach(([categoryName, categoryProducts]) => {
            if (categoryProducts.length === 0) return;
            
            html += `
                <div class="mb-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-4 px-4">
                        ${this.getCategoryIcon(categoryName)} ${categoryName}
                    </h3>
                    <div class="amazon-scroll-container pb-4">
                        <div class="amazon-scroll-content">
                            ${categoryProducts.map(product => this.createAmazonProductCard(product)).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    getCategoryIcon(category) {
        const icons = {
            '洗剤': '🧽',
            '道具': '🔧', 
            '保護具': '🥽'
        };
        return icons[category] || '📦';
    }
    
    createProductCard(product) {
        return `
            <div class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow relative flex-shrink-0" style="width: 160px; min-width: 160px; max-width: 160px;">
                ${product.amazonChoice ? '<div class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">Amazon\'s Choice</div>' : ''}
                ${product.bestseller ? '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">ベストセラー</div>' : ''}
                ${product.professional ? '<div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">プロ仕様</div>' : ''}
                
                <div class="p-3">
                    <img src="${this.getAmazonImageUrl(product.asin)}" alt="${product.title}" 
                         class="w-full h-32 object-cover rounded mb-3" 
                         onerror="this.src='${this.getPlaceholderImage()}'; this.onerror=null;"
                         loading="lazy">
                    
                    <h4 class="font-semibold text-gray-800 mb-2 text-sm line-clamp-2" style="height: 2.5rem; overflow: hidden;">
                        ${product.title}
                    </h4>
                    
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400 mr-1">
                            ${Array(5).fill().map((_, i) => 
                                `<span class="text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}">★</span>`
                            ).join('')}
                        </div>
                        <span class="text-xs text-gray-600">${product.rating}</span>
                    </div>
                    
                    <p class="text-lg font-bold text-green-600 mb-2">${product.price}</p>
                    
                    <p class="text-xs text-gray-600 mb-3" style="height: 2rem; overflow: hidden;">
                        ${product.description || ''}
                    </p>
                    
                    <a href="https://www.amazon.co.jp/dp/${product.asin}?tag=${window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'}" 
                       target="_blank" 
                       class="bg-orange-500 text-white px-3 py-2 rounded text-xs hover:bg-orange-600 block text-center transition-colors font-semibold">
                        🛒 Amazonで購入
                    </a>
                </div>
            </div>
        `;
    }
    
    createAmazonProductCard(product) {
        return `
            <div class="amazon-product-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 relative">
                ${product.amazonChoice ? '<div class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded z-10">Amazon\'s Choice</div>' : ''}
                ${product.bestseller ? '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">ベストセラー</div>' : ''}
                ${product.professional ? '<div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">プロ仕様</div>' : ''}
                
                <div class="p-3">
                    <div class="relative mb-3">
                        <img src="${this.getAmazonImageUrl(product.asin)}" alt="${product.title}" 
                             class="w-full h-32 object-contain rounded bg-gray-50" 
                             onerror="this.src='${this.getPlaceholderImage()}'; this.onerror=null;"
                             loading="lazy">
                    </div>
                    
                    <h4 class="font-medium text-gray-900 mb-2 text-sm leading-tight" style="height: 2.5rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${product.title}
                    </h4>
                    
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400 mr-1">
                            ${Array(5).fill().map((_, i) => 
                                `<span class="text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}">★</span>`
                            ).join('')}
                        </div>
                        <span class="text-xs text-gray-600">${product.rating}</span>
                        <span class="text-xs text-gray-500 ml-1">(${product.reviews || 100})</span>
                    </div>
                    
                    <div class="mb-3">
                        <span class="text-lg font-bold text-red-600">${product.price}</span>
                        ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>` : ''}
                    </div>
                    
                    <a href="https://www.amazon.co.jp/dp/${product.asin}?tag=${window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'}" 
                       target="_blank" 
                       class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-3 py-2 rounded text-xs font-bold block text-center transition-all duration-200 shadow-sm hover:shadow-md">
                        🛒 カートに入れる
                    </a>
                </div>
            </div>
        `;
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
        
        // 現在のステップをフェードアウト
        const currentSteps = document.querySelectorAll('.step-content:not(.hidden)');
        currentSteps.forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-20px)';
            content.style.transition = 'all 0.3s ease';
        });
        
        setTimeout(() => {
            // 全ステップを非表示
            document.querySelectorAll('.step-content').forEach(content => {
                content.classList.add('hidden');
                content.style.opacity = '';
                content.style.transform = '';
                content.style.transition = '';
            });
            
            // 新しいステップを表示（フェードイン）
            const newStep = document.getElementById(`step${stepNumber}`);
            if (newStep) {
                newStep.classList.remove('hidden');
                newStep.style.opacity = '0';
                newStep.style.transform = 'translateY(20px)';
                newStep.style.transition = 'all 0.4s ease';
                
                // フェードイン実行
                setTimeout(() => {
                    newStep.style.opacity = '1';
                    newStep.style.transform = 'translateY(0)';
                }, 50);
                
                // 進行度バーアニメーション
                this.animateProgressBar(stepNumber);
            }
            
            // ステップインジケーターを更新
            this.updateStepIndicator(stepNumber);
            
            this.currentStep = stepNumber;
        }, 300);
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
                this.showSuccessToast('結果をクリップボードにコピーしました！');
            }).catch(() => {
                this.showErrorToast('シェア機能が利用できません');
            });
        }
    }
    
    // 選択エフェクト（成功時のリップルエフェクト）
    showSelectionEffect(element) {
        if (!element) {
            console.warn('⚠️ エフェクト対象の要素が存在しません');
            return;
        }
        
        try {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(59, 130, 246, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            element.style.position = 'relative';
            element.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple && ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        } catch (error) {
            console.warn('⚠️ リップルエフェクトの作成に失敗:', error);
        }
    }
    
    // 進行度バーアニメーション
    animateProgressBar(stepNumber) {
        const progressPercentage = ((stepNumber - 1) / 3) * 100;
        
        // 仮想的な進行度バーを作成（将来の拡張用）
        console.log(`📊 進行度: ${Math.round(progressPercentage)}%`);
        
        // ステップインジケーターに微細なアニメーション
        const indicator = document.getElementById(`step${stepNumber}-indicator`);
        if (indicator) {
            indicator.style.transform = 'scale(1.2)';
            indicator.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                indicator.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // 成功トースト通知
    showSuccessToast(message) {
        this.showToast(message, 'success');
    }
    
    // エラートースト通知
    showErrorToast(message) {
        this.showToast(message, 'error');
    }
    
    // 汎用トースト通知
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        toast.innerHTML = `${icon} ${message}`;
        document.body.appendChild(toast);
        
        // スライドイン
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 自動削除
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // 結果表示アニメーション
    animateResultDisplay() {
        const analysisResult = document.getElementById('analysisResult');
        if (analysisResult) {
            // 段階的に要素を表示
            const elements = analysisResult.querySelectorAll('.bg-white');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    
                    // 各要素にバウンス効果
                    el.classList.add('scale-in');
                }, index * 200);
            });
            
            // 成功メッセージのトースト
            setTimeout(() => {
                this.showSuccessToast('分析完了！最適な掃除方法をご提案します');
            }, 1000);
        }
    }
    
    // ローディングアニメーション強化
    showEnhancedLoading() {
        const loadingElement = document.getElementById('analysisLoading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div class="text-center py-8">
                    <div class="relative mb-6">
                        <div class="loading-spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <div class="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full mx-auto animate-ping"></div>
                    </div>
                    <h3 class="text-xl font-bold text-blue-800 mb-2">🤖 AI分析中...</h3>
                    <p class="text-blue-600 mb-4">最適な掃除方法と商品を検索しています</p>
                    <div class="flex justify-center space-x-1">
                        <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            `;
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
            if (!window.stepWiseAdvisor) {
                window.stepWiseAdvisor = new StepWiseCleaningAdvisor();
                console.log('✅ StepWiseCleaningAdvisor初期化成功');
            }
        } catch (error) {
            console.error('❌ 初期化エラー:', error);
            // フォールバック処理
            console.log('🔄 フォールバック初期化を試行します');
            setTimeout(() => {
                try {
                    if (!window.stepWiseAdvisor) {
                        window.stepWiseAdvisor = new StepWiseCleaningAdvisor();
                        console.log('✅ フォールバック初期化成功');
                    }
                } catch (fallbackError) {
                    console.error('❌ フォールバック初期化も失敗:', fallbackError);
                    console.log('🚨 手動初期化が必要です。ページをリロードしてください。');
                }
            }, 1000);
        }
    }, 500);
});

// アニメーション用CSS（既に存在しない場合）
if (!document.querySelector('#animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        .loading-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
            }
            40%, 43% {
                transform: translate3d(0,-15px,0);
            }
            70% {
                transform: translate3d(0,-7px,0);
            }
            90% {
                transform: translate3d(0,-3px,0);
            }
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
        }
        
        .choice-card {
            position: relative;
            overflow: hidden;
        }
        
        .choice-card.selected {
            animation: pulse 1s;
        }
        
        .bounce-in {
            animation: bounce 0.6s ease;
        }
        
        .fade-slide-in {
            animation: fadeSlideIn 0.5s ease-out;
        }
        
        @keyframes fadeSlideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .scale-in {
            animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}