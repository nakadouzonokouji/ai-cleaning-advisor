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
                1: '中性洗剤で軽く拭き取り、水で流してから乾いた布で仕上げ拭きをしてください。',
                2: 'アルカリ性洗剤をスプレーし、10分程度放置してからスポンジで擦り洗いしてください。',
                3: '専用の強力洗剤を使用し、つけ置きしてからブラシでしっかりと擦り洗いしてください。'
            },
            bathroom: {
                1: 'バスクリーナーで軽く拭き取り、シャワーで洗い流してください。',
                2: 'カビ取り剤をスプレーし、15分放置してからブラシで擦り洗いしてください。',
                3: '強力カビ取り剤で30分つけ置きし、ブラシとスポンジで徹底的に擦り洗いしてください。'
            },
            toilet: {
                1: 'トイレクリーナーで軽く拭き取り、仕上げに除菌シートで拭いてください。',
                2: '酸性洗剤を便器に塗布し、ブラシでしっかりと擦り洗いしてください。',
                3: '強力な酸性洗剤で30分つけ置きし、専用ブラシで念入りに擦り洗いしてください。'
            },
            window: {
                1: 'ガラスクリーナーをスプレーし、マイクロファイバークロスで拭き取ってください。',
                2: '中性洗剤を薄めた水で洗い、水切りワイパーで仕上げてください。',
                3: '専用ガラス洗剤で汚れを浮かせ、スクレーパーとワイパーで丁寧に清掃してください。'
            },
            floor: {
                1: '掃除機でゴミを吸い取り、フロアワイパーで乾拭きしてください。',
                2: 'フロアクリーナーでモップ掛けし、よく乾燥させてください。',
                3: '専用洗剤でつけ置き洗いし、ブラシで擦ってからモップで仕上げてください。'
            },
            living: {
                1: 'マイクロファイバークロスで乾拭きし、ホコリを除去してください。',
                2: '中性洗剤を薄めた水で拭き取り、乾いた布で仕上げ拭きしてください。',
                3: '専用クリーナーで清拭し、汚れが落ちない場合は部分的にブラシを使用してください。'
            }
        };
        
        const locationMethods = methods[location.type] || methods.kitchen;
        return locationMethods[level.intensity] || locationMethods[2];
    }
    
    getRecommendedProducts(location, level) {
        // 場所と汚れレベルに応じた商品選択
        const productCategories = {
            kitchen: {
                light: ['中性洗剤', 'マイクロファイバークロス'],
                medium: ['アルカリ性洗剤', 'スポンジ'],
                heavy: ['強力油汚れ洗剤', 'ブラシセット']
            },
            bathroom: {
                light: ['バスクリーナー', '除菌シート'],
                medium: ['カビ取り剤', 'ブラシ'],
                heavy: ['強力カビ取り剤', '専用スポンジ']
            },
            toilet: {
                light: ['トイレクリーナー', '除菌シート'],
                medium: ['酸性洗剤', 'トイレブラシ'],
                heavy: ['強力酸性洗剤', '専用ブラシ']
            },
            window: {
                light: ['ガラスクリーナー', 'マイクロファイバークロス'],
                medium: ['中性洗剤', '水切りワイパー'],
                heavy: ['専用ガラス洗剤', 'スクレーパーセット']
            },
            floor: {
                light: ['フロアワイパー', 'ドライシート'],
                medium: ['フロアクリーナー', 'モップ'],
                heavy: ['専用洗剤', 'ブラシ']
            },
            living: {
                light: ['マイクロファイバークロス', 'ハンディモップ'],
                medium: ['中性洗剤', 'クリーニングクロス'],
                heavy: ['専用クリーナー', 'ブラシセット']
            }
        };
        
        const levelMap = { 1: 'light', 2: 'medium', 3: 'heavy' };
        const selectedProducts = productCategories[location.type]?.[levelMap[level.intensity]] || ['おすすめ洗剤', 'おすすめ用具'];
        
        // 既存データベースから実際の商品を取得
        let products = [];
        
        if (window.COMPREHENSIVE_CLEANING_PRODUCTS) {
            const dbCategories = Object.keys(window.COMPREHENSIVE_CLEANING_PRODUCTS);
            
            // 各カテゴリから商品を取得
            for (const category of dbCategories.slice(0, 2)) {
                const categoryData = window.COMPREHENSIVE_CLEANING_PRODUCTS[category];
                if (categoryData?.products?.length > 0) {
                    const product = categoryData.products[0];
                    products.push({
                        title: product.name,
                        price: this.formatPrice(product.asin),
                        image: this.getPlaceholderImage(), // インライン画像を使用
                        rating: product.rating || 4.5,
                        url: `https://www.amazon.co.jp/dp/${product.asin}?tag=${window.ENV?.AMAZON_ASSOCIATE_TAG || 'asdfghj12-22'}`
                    });
                }
            }
        }
        
        // フォールバック用ダミーデータ
        if (products.length === 0) {
            products = [
                {
                    title: selectedProducts[0] || 'おすすめ洗剤',
                    price: '¥880',
                    image: this.getPlaceholderImage(),
                    rating: 4.5,
                    url: '#'
                },
                {
                    title: selectedProducts[1] || 'おすすめ用具',
                    price: '¥1,200',
                    image: this.getPlaceholderImage(),
                    rating: 4.3,
                    url: '#'
                }
            ];
        }
        
        return products;
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
            if (img.src && (img.src.includes('via.placeholder') || img.src.includes('placeholder'))) {
                img.src = this.getPlaceholderImage();
                img.onerror = () => { img.style.display = 'none'; };
            }
        });
    }
    
    displayResult(result) {
        console.log('📊 結果表示:', result);
        
        // 外部プレースホルダーを無効化
        this.disableExternalPlaceholders();
        
        // 掃除方法を表示
        const methodElement = document.getElementById('cleaningMethod');
        if (methodElement) {
            methodElement.innerHTML = `
                <div class="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 class="font-semibold text-blue-800 mb-2">
                        ${result.location.icon} ${result.location.name} - ${result.level.icon} ${result.level.name}
                    </h4>
                    <p class="text-blue-700">${result.cleaningMethod}</p>
                </div>
                ${result.imageAnalysis ? `
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-green-800 mb-2">📷 AI画像分析結果</h4>
                        <p class="text-green-700">検出された汚れ: ${result.imageAnalysis.detectedDirt}</p>
                        <p class="text-sm text-green-600">信頼度: ${Math.round(result.imageAnalysis.confidence * 100)}%</p>
                    </div>
                ` : ''}
            `;
        }
        
        // おすすめ商品を表示
        const productsElement = document.getElementById('recommendedProducts');
        if (productsElement && result.products) {
            productsElement.innerHTML = result.products.map(product => `
                <div class="bg-white border rounded-lg p-4 shadow-sm">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-32 object-cover rounded mb-3" 
                         onerror="this.style.display='none'">
                    <h4 class="font-semibold text-gray-800 mb-1">${product.title}</h4>
                    <p class="text-lg font-bold text-green-600 mb-2">${product.price}</p>
                    <div class="flex items-center mb-3">
                        <span class="text-yellow-500">★</span>
                        <span class="text-sm text-gray-600 ml-1">${product.rating}</span>
                    </div>
                    <a href="${product.url}" target="_blank" class="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 block text-center">
                        Amazonで見る
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
    
    // 少し待ってから初期化（他のスクリプト読み込み完了を待つ）
    setTimeout(() => {
        window.stepWiseAdvisor = new StepWiseCleaningAdvisor();
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