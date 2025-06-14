// ステップバイステップ AI掃除アドバイザー
class StepWiseCleaningAdvisor {
    constructor() {
        this.currentStep = 1;
        this.selectedLocation = null;
        this.selectedLevel = null;
        this.selectedImage = null;
        this.apiClient = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 ステップバイステップ AI掃除アドバイザー初期化開始');
        
        // 既存のモジュールを読み込み
        await this.loadModules();
        
        // イベントリスナーを設定
        this.setupEventListeners();
        
        console.log('✅ 初期化完了');
    }
    
    async loadModules() {
        try {
            // 既存のデータベースとAPIクライアントを利用
            if (window.COMPREHENSIVE_CLEANING_PRODUCTS) {
                this.productsData = window.COMPREHENSIVE_CLEANING_PRODUCTS;
            }
            if (window.COMPREHENSIVE_DIRT_MAPPING) {
                this.dirtMapping = window.COMPREHENSIVE_DIRT_MAPPING;
            }
            if (window.COMPREHENSIVE_LOCATION_CONFIG) {
                this.locationConfig = window.COMPREHENSIVE_LOCATION_CONFIG;
            }
            
            console.log('✅ 既存モジュール読み込み完了');
        } catch (error) {
            console.error('❌ モジュール読み込みエラー:', error);
        }
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
        document.getElementById('backToStep1')?.addEventListener('click', () => this.goToStep(1));
        document.getElementById('backToStep2')?.addEventListener('click', () => this.goToStep(2));
        
        // ステップ3: 写真関連
        document.getElementById('selectImageBtn')?.addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        document.getElementById('imageInput')?.addEventListener('change', (e) => {
            this.handleImageSelection(e);
        });
        
        document.getElementById('skipPhoto')?.addEventListener('click', () => {
            this.analyzeWithoutPhoto();
        });
        
        document.getElementById('analyzeWithPhoto')?.addEventListener('click', () => {
            this.analyzeWithPhoto();
        });
        
        // ステップ4: 結果画面
        document.getElementById('newAnalysis')?.addEventListener('click', () => {
            this.resetAnalysis();
        });
        
        document.getElementById('shareResult')?.addEventListener('click', () => {
            this.shareResult();
        });
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
            img.src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
            document.getElementById('analyzeWithPhoto').classList.remove('hidden');
            this.selectedImage = e.target.result;
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
        document.getElementById('analysisLoading').classList.remove('hidden');
        document.getElementById('analysisResult').classList.add('hidden');
        
        try {
            // 分析実行
            const result = await this.performAnalysis(withPhoto);
            
            // 結果表示
            this.displayResult(result);
            
        } catch (error) {
            console.error('❌ 分析エラー:', error);
            this.displayError(error);
        } finally {
            document.getElementById('analysisLoading').classList.add('hidden');
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
        
        // 写真分析（もしあれば）
        let imageAnalysis = null;
        if (withPhoto && this.selectedImage) {
            imageAnalysis = await this.analyzeImage(this.selectedImage);
        }
        
        return {
            location: locationInfo,
            level: levelInfo,
            cleaningMethod,
            products,
            imageAnalysis
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
            }
        };
        
        const locationMethods = methods[location.type] || methods.kitchen;
        return locationMethods[level.intensity] || locationMethods[2];
    }
    
    getRecommendedProducts(location, level) {
        // 既存の商品データベースから適切な商品を選択
        const products = [];
        
        // ダミーデータ（実際は既存のデータベースから取得）
        const sampleProducts = [
            {
                title: 'おすすめ洗剤A',
                price: '¥880',
                image: 'https://via.placeholder.com/150',
                rating: 4.5,
                url: '#'
            },
            {
                title: 'おすすめブラシB',
                price: '¥1,200',
                image: 'https://via.placeholder.com/150',
                rating: 4.3,
                url: '#'
            }
        ];
        
        return sampleProducts;
    }
    
    async analyzeImage(imageData) {
        try {
            console.log('🤖 AI画像分析開始...');
            // 実際のAI分析ロジックをここに実装
            // 現在は簡単なダミー応答を返す
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
            
            return {
                confidence: 0.85,
                detectedDirt: '油汚れ',
                suggestions: '中性洗剤での清拭をおすすめします'
            };
        } catch (error) {
            console.error('❌ 画像分析エラー:', error);
            return null;
        }
    }
    
    displayResult(result) {
        console.log('📊 結果表示:', result);
        
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
                        <p class="text-green-700">提案: ${result.imageAnalysis.suggestions}</p>
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
                    <img src="${product.image}" alt="${product.title}" class="w-full h-32 object-cover rounded mb-3">
                    <h4 class="font-semibold text-gray-800 mb-1">${product.title}</h4>
                    <p class="text-lg font-bold text-green-600 mb-2">${product.price}</p>
                    <div class="flex items-center mb-3">
                        <span class="text-yellow-500">★</span>
                        <span class="text-sm text-gray-600 ml-1">${product.rating}</span>
                    </div>
                    <a href="${product.url}" class="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 block text-center">
                        Amazonで見る
                    </a>
                </div>
            `).join('');
        }
        
        // 結果表示
        document.getElementById('analysisResult').classList.remove('hidden');
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
        
        document.getElementById('analysisResult').classList.remove('hidden');
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
        document.getElementById('imagePreview').classList.add('hidden');
        document.getElementById('analyzeWithPhoto').classList.add('hidden');
        document.getElementById('imageInput').value = '';
        
        // ステップ1に戻る
        this.goToStep(1);
    }
    
    shareResult() {
        console.log('📤 結果シェア');
        
        const shareText = `AI掃除アドバイザーで${this.selectedLocation}の${this.selectedLevel}の掃除方法を診断しました！`;
        
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
            });
        }
    }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 DOM読み込み完了 - ステップバイステップ AI掃除アドバイザー開始');
    
    // 既存のモジュールが読み込まれるまで少し待つ
    setTimeout(() => {
        window.stepWiseAdvisor = new StepWiseCleaningAdvisor();
    }, 1000);
});

// ローディングスピナーアニメーション用CSS
const style = document.createElement('style');
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