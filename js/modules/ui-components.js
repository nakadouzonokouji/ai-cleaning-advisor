/**
 * UI Components Module - AI掃除アドバイザー
 * すべてのUI操作、DOM操作、イベントハンドリング、表示制御を統合管理
 * CX Mainte © 2025
 */

// UI操作とDOM管理を統合するクラス
export class UIComponents extends EventTarget {
    constructor() {
        super();
        this.state = {
            selectedImage: null,
            preSelectedLocation: '',
            customLocation: '',
            dirtSeverity: null,
            analysis: null,
            showCorrection: false,
            geminiApiKey: '',
            currentFeedbackType: null
        };
        
        this.feedbackData = [];
        this.isInitialized = false;
    }

    // 🚀 UI初期化メイン処理
    async initializeUI() {
        if (this.isInitialized) {
            console.log('⚠️ UI既に初期化済み - スキップ');
            return;
        }
        
        console.log('🎨 UI Components 初期化開始');
        this.isInitialized = true;
        
        // DOM準備を待つ
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // 初期化処理実行
        this.debugDOMState();
        this.setupBasicEventListeners();
        this.setupLocationButtonsWithDebug();
        this.initializeLucideIcons();
        this.updateUI();
        
        console.log('✅ UI Components 初期化完了');
    }

    // 🔍 DOM状態デバッグ
    debugDOMState() {
        console.log('🔍 DOM状態デバッグ開始');
        console.log('document.readyState:', document.readyState);
        
        const allButtons = document.querySelectorAll('button');
        console.log(`全ボタン数: ${allButtons.length}`);
        
        const locationButtons = document.querySelectorAll('.location-btn');
        console.log(`location-btnクラスのボタン数: ${locationButtons.length}`);
        
        const dataLocationButtons = document.querySelectorAll('[data-location]');
        console.log(`data-location属性を持つ要素数: ${dataLocationButtons.length}`);
        
        locationButtons.forEach((btn, index) => {
            const location = btn.getAttribute('data-location');
            const textContent = btn.textContent.trim().substring(0, 30);
            console.log(`ボタン${index + 1}: data-location="${location}", テキスト="${textContent}"`);
            console.log(`  - disabled: ${btn.disabled}`);
            console.log(`  - style.pointerEvents: ${btn.style.pointerEvents}`);
            console.log(`  - classList: ${btn.classList.toString()}`);
        });
    }

    // 🔧 基本イベントリスナー設定
    setupBasicEventListeners() {
        console.log('🔧 基本イベントリスナー設定開始');
        
        // API設定関連
        this.addEventListenerSafe('saveGeminiApiBtn', 'click', () => this.saveGeminiApiKey());
        this.addEventListenerSafe('testGeminiApiBtn', 'click', () => this.testGeminiConnection());
        this.addEventListenerSafe('toggleApiKeyVisibility', 'click', () => this.toggleApiKeyVisibility());

        // デバッグ機能
        this.addEventListenerSafe('testConnectionBtn', 'click', () => this.testAllConnections());
        this.addEventListenerSafe('toggleDebugBtn', 'click', () => {
            if (typeof window.debugUI !== 'undefined') {
                window.debugUI.toggleDebugLog();
            }
        });
        this.addEventListenerSafe('exportConfigBtn', 'click', () => this.showExportModal());
        this.addEventListenerSafe('clearLogBtn', 'click', () => {
            if (typeof window.debugLogger !== 'undefined') {
                window.debugLogger.clear();
            }
        });

        // カスタム場所入力
        this.addEventListenerSafe('customLocation', 'input', (e) => {
            this.state.customLocation = e.target.value;
            this.updateSelectedLocationDisplay();
            this.updateClearButtonVisibility();
        });

        // 画像アップロード
        this.addEventListenerSafe('imageInput', 'change', (e) => this.handleImageUpload(e));
        this.addEventListenerSafe('skipPhotoBtn', 'click', () => this.skipPhotoUpload());

        // 分析実行
        this.addEventListenerSafe('analyzeBtn', 'click', () => this.executeAnalysis());

        // 結果操作
        this.addEventListenerSafe('correctionBtn', 'click', () => this.toggleCorrection());
        this.addEventListenerSafe('copyResultBtn', 'click', () => this.copyAnalysisResult());
        this.addEventListenerSafe('copyMethodBtn', 'click', () => this.copyCleaningMethod());
        this.addEventListenerSafe('refreshPricesBtn', 'click', () => this.refreshProductPrices());

        // 修正オプション
        const correctionOptions = document.querySelectorAll('.correction-option');
        correctionOptions.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyComprehensiveCorrection(e.target.dataset.type));
        });

        // フィードバック
        this.addEventListenerSafe('feedbackGoodBtn', 'click', () => this.showFeedbackModal('good'));
        this.addEventListenerSafe('feedbackBadBtn', 'click', () => this.showFeedbackModal('bad'));
        this.addEventListenerSafe('submitFeedback', 'click', () => this.submitFeedback());
        this.addEventListenerSafe('skipFeedback', 'click', () => this.submitFeedback(''));

        // モーダル制御
        this.addEventListenerSafe('closeFeedbackModal', 'click', () => this.closeFeedbackModal());
        this.addEventListenerSafe('closeExportModal', 'click', () => this.closeExportModal());
        this.addEventListenerSafe('copyConfigBtn', 'click', () => this.copyConfiguration());

        // クリア機能
        this.addEventListenerSafe('clearBtn', 'click', () => this.clearAll());

        // モーダル外クリック
        this.addEventListenerSafe('feedbackModal', 'click', (e) => {
            if (e.target.id === 'feedbackModal') this.closeFeedbackModal();
        });
        this.addEventListenerSafe('exportModal', 'click', (e) => {
            if (e.target.id === 'exportModal') this.closeExportModal();
        });

        // ESCキー
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFeedbackModal();
                this.closeExportModal();
            }
        });

        console.log('✅ 基本イベントリスナー設定完了');
    }

    // 🎯 場所選択ボタン設定（デバッグ強化版）
    setupLocationButtonsWithDebug() {
        console.log('📍 場所選択ボタン設定開始（デバッグ版）');
        
        const methods = [
            () => document.querySelectorAll('.location-btn'),
            () => document.querySelectorAll('button[data-location]'),
            () => document.querySelectorAll('button.location-btn'),
            () => Array.from(document.querySelectorAll('button')).filter(btn => btn.hasAttribute('data-location'))
        ];
        
        let locationButtons = null;
        
        for (let i = 0; i < methods.length; i++) {
            try {
                locationButtons = methods[i]();
                if (locationButtons.length > 0) {
                    console.log(`✅ 方法${i + 1}で${locationButtons.length}個のボタンを発見`);
                    break;
                } else {
                    console.log(`❌ 方法${i + 1}: ボタンが見つかりません`);
                }
            } catch (error) {
                console.error(`❌ 方法${i + 1}でエラー:`, error);
            }
        }
        
        if (!locationButtons || locationButtons.length === 0) {
            console.error('❌ 場所選択ボタンが見つかりません');
            return;
        }
        
        // 各ボタンに対して設定
        locationButtons.forEach((btn, index) => {
            try {
                const location = btn.getAttribute('data-location') || btn.dataset.location;
                
                if (!location) {
                    console.warn(`⚠️ ボタン${index + 1}: data-location属性がありません`);
                    return;
                }
                
                console.log(`🔗 ボタン${index + 1}設定開始: ${location}`);
                
                // ボタンを強制的に有効化
                btn.disabled = false;
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.removeAttribute('disabled');
                
                // 既存のイベントリスナーを削除
                this.removeAllEventListeners(btn, index);
                
                // 新しいイベントリスナーを追加
                this.addLocationEventListener(btn, location, index);
                
                console.log(`✅ ボタン${index + 1}設定完了: ${location}`);
                
            } catch (error) {
                console.error(`❌ ボタン${index + 1}設定エラー:`, error);
            }
        });
        
        console.log('✅ 場所選択ボタン設定完了');
        this.testButtonSetup();
    }

    // 🎯 場所選択処理
    selectLocation(locationId) {
        console.log(`🎯 場所選択処理開始: "${locationId}"`);
        
        if (!locationId) {
            console.error('❌ 場所IDが未定義またはnull');
            return;
        }
        
        // 状態を更新
        this.state.preSelectedLocation = locationId;
        console.log(`💾 状態更新完了: preSelectedLocation = "${locationId}"`);
        
        // 全ボタンをリセット
        this.resetAllLocationButtons();
        
        // 選択ボタンをハイライト
        this.highlightSelectedButton(locationId);
        
        // カスタム入力の表示制御
        this.handleCustomInput(locationId);
        
        // UI更新
        this.updateSelectedLocationDisplay();
        this.updateClearButtonVisibility();
        
        console.log(`🎉 場所選択完了: "${locationId}"`);
        this.showSuccessNotification(`場所選択: ${locationId}`);
        
        // イベント発火
        this.emit('locationSelected', locationId);
    }

    // 🎯 汚れの強度選択処理
    selectDirtSeverity(severity) {
        console.log(`🎯 汚れの強度選択: ${severity}`);
        
        this.state.dirtSeverity = severity;
        
        // 全ての強度ボタンをリセット
        const severityButtons = document.querySelectorAll('.severity-btn');
        severityButtons.forEach(btn => {
            btn.className = 'severity-btn p-4 border-2 rounded-lg transition-colors text-sm text-left border-gray-200 hover:border-green-300 hover:bg-green-50';
        });
        
        // 選択されたボタンをハイライト
        const selectedBtn = document.querySelector(`[data-severity="${severity}"]`);
        if (selectedBtn) {
            if (severity === 'light') {
                selectedBtn.className = 'severity-btn p-4 border-2 rounded-lg transition-colors text-sm text-left border-green-500 bg-green-50 text-green-700';
            } else {
                selectedBtn.className = 'severity-btn p-4 border-2 rounded-lg transition-colors text-sm text-left border-red-500 bg-red-50 text-red-700';
            }
        }
        
        this.updateSelectedSeverityDisplay(severity);
        console.log(`💾 汚れの強度設定完了: ${severity}`);
        
        // イベント発火
        this.emit('severityChanged', severity);
    }

    // 🖼️ 画像アップロード処理
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            console.log('📷 ファイルが選択されていません');
            return;
        }

        console.log(`📷 画像アップロード開始: ${file.name} (${Math.round(file.size/1024)}KB)`);
        
        if (!file.type.startsWith('image/')) {
            this.showError('ファイル形式エラー', '画像ファイルを選択してください');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showCompressionNotification();
        }

        try {
            const compressedFile = await this.compressImage(file);
            console.log(`✅ 画像圧縮完了: ${Math.round(file.size/1024)}KB → ${Math.round(compressedFile.size/1024)}KB`);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.state.selectedImage = e.target.result;
                console.log('✅ 画像読み込み成功');
                
                const uploadedImage = document.getElementById('uploadedImage');
                if (uploadedImage) {
                    uploadedImage.src = e.target.result;
                    uploadedImage.style.display = 'block';
                    console.log('✅ 画像表示完了');
                }
                
                // イベント発火
                this.emit('imageUploaded', e.target.result);
                
                const uploadedImageArea = document.getElementById('uploadedImageArea');
                if (uploadedImageArea) {
                    uploadedImageArea.classList.remove('hidden');
                    console.log('✅ アップロード済み画像エリア表示');
                }
                
                this.updateSelectedLocationDisplay();
                this.updateClearButtonVisibility();
                this.hideResults();
                
                const originalSize = Math.round(file.size/1024);
                const compressedSize = Math.round(compressedFile.size/1024);
                if (originalSize > compressedSize) {
                    this.showSuccessNotification(`画像アップロード完了 (${originalSize}KB→${compressedSize}KB)`);
                } else {
                    this.showSuccessNotification('画像アップロード完了');
                }
            };

            reader.onerror = () => {
                console.error('💥 画像読み込みエラー');
                this.showError('画像読み込みエラー', 'ファイルの読み込みに失敗しました');
            };

            reader.readAsDataURL(compressedFile);
            
        } catch (error) {
            console.error('💥 画像圧縮エラー:', error);
            this.showError('画像処理エラー', '画像の処理に失敗しました');
        }
    }

    // 📦 画像圧縮機能
    async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
        return new Promise((resolve) => {
            if (file.size <= 2 * 1024 * 1024) {
                resolve(file);
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob.size > 5 * 1024 * 1024) {
                        canvas.toBlob((secondBlob) => {
                            resolve(new File([secondBlob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            }));
                        }, 'image/jpeg', 0.6);
                    } else {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    }
                }, 'image/jpeg', quality);
            };

            img.onerror = () => {
                console.warn('画像圧縮失敗 - 元ファイルを使用');
                resolve(file);
            };

            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(file);
        });
    }

    // 📸 写真スキップ機能
    skipPhotoUpload() {
        console.log('📸 写真スキップ処理');
        
        if (this.state.preSelectedLocation === 'custom' && !this.state.customLocation.trim()) {
            const customValidation = document.getElementById('customValidation');
            if (customValidation) {
                customValidation.classList.remove('hidden');
            }
            const customInput = document.getElementById('customLocation');
            if (customInput) {
                customInput.focus();
                customInput.classList.add('error');
                setTimeout(() => customInput.classList.remove('error'), 2000);
            }
            return;
        }
        
        console.log('📍 写真なしで分析開始');
        this.state.selectedImage = 'no-photo';
        
        const uploadArea = document.getElementById('uploadArea');
        const analysisArea = document.getElementById('analysisArea');
        if (uploadArea) {
            uploadArea.classList.add('hidden');
        }
        if (analysisArea) {
            analysisArea.classList.remove('hidden');
        }
        
        const uploadedImage = document.getElementById('uploadedImage');
        if (uploadedImage) uploadedImage.style.display = 'none';
        
        this.updateSelectedLocationDisplay();
        this.updateClearButtonVisibility();
        this.hideResults();
        
        const customValidation = document.getElementById('customValidation');
        if (customValidation) {
            customValidation.classList.add('hidden');
        }
        
        this.showSuccessNotification('写真なしで分析準備完了');
        
        setTimeout(() => {
            this.executeAnalysis();
        }, 500);
    }

    // 🎯 分析結果表示
    displayAnalysisResults() {
        if (!this.state.analysis) {
            console.warn('⚠️ 分析結果がありません');
            return;
        }

        console.log('🎯 分析結果表示開始');
        
        const analysisResults = document.getElementById('analysisResults');
        if (analysisResults) {
            analysisResults.classList.remove('hidden');
            
            // 掃除方法を表示
            if (this.state.analysis.cleaningMethod) {
                this.displayCleaningMethod(this.state.analysis.cleaningMethod);
            }
            
            // 商品を表示
            if (this.state.analysis.recommendedProducts) {
                this.displayProducts(this.state.analysis.recommendedProducts);
            }
            
            // スクロール
            analysisResults.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        }
        
        console.log('✅ 分析結果表示完了');
    }

    // 🧹 掃除方法表示
    displayCleaningMethod(cleaningMethod) {
        if (!cleaningMethod || !cleaningMethod.steps) {
            console.warn('⚠️ 掃除方法データが不正です:', cleaningMethod);
            return;
        }

        console.log('🎯 掃除方法表示開始:', cleaningMethod);

        let html = `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span class="text-3xl mr-3">🧹</span>
                    ${cleaningMethod.title}
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white rounded-lg p-3 text-center border border-blue-200">
                        <div class="text-lg font-semibold text-blue-600">難易度</div>
                        <div class="text-gray-700">${cleaningMethod.difficulty}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center border border-blue-200">
                        <div class="text-lg font-semibold text-green-600">所要時間</div>
                        <div class="text-gray-700">${cleaningMethod.time}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center border border-blue-200">
                        <div class="text-lg font-semibold text-purple-600">手順数</div>
                        <div class="text-gray-700">${cleaningMethod.steps.length}ステップ</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span class="text-xl mr-2">📋</span>
                        掃除手順
                    </h4>
                    <ol class="space-y-2">
        `;

        cleaningMethod.steps.forEach((step, index) => {
            html += `
                <li class="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        ${index + 1}
                    </span>
                    <span class="text-gray-700">${step}</span>
                </li>
            `;
        });

        html += `
                    </ol>
                </div>

                ${cleaningMethod.tips ? `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-yellow-800 mb-2">💡 コツ・ポイント</h4>
                    <p class="text-yellow-700">${cleaningMethod.tips}</p>
                </div>
                ` : ''}

                ${cleaningMethod.warnings ? `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 class="font-semibold text-red-800 mb-2">⚠️ 注意事項</h4>
                    <p class="text-red-700">${cleaningMethod.warnings}</p>
                </div>
                ` : ''}
            </div>
        `;

        const cleaningMethodContent = document.getElementById('cleaningMethodContent');
        if (cleaningMethodContent) {
            cleaningMethodContent.innerHTML = html;
            console.log('✅ 掃除方法表示完了');
        }
    }

    // 🛒 商品表示
    displayProducts(products) {
        console.log('🛒 商品表示開始', products);
        
        if (!products) {
            products = { cleaners: [], tools: [], protection: [] };
        }
        
        const generateProductGrid = (categoryProducts, categoryName, categoryIcon) => {
            if (!categoryProducts || categoryProducts.length === 0) {
                return `<div class="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    <div class="text-2xl mb-2">${categoryIcon}</div>
                    <p class="text-sm">現在、該当する商品が見つかりませんでした</p>
                    <p class="text-xs text-gray-400 mt-1">検索条件を変更してお試しください</p>
                </div>`;
            }

            return categoryProducts.slice(0, 6).map(product => {
                let imageUrl = '';
                if (product.image_url) {
                    imageUrl = product.image_url.replace(/^http:/, 'https:');
                } else if (product.asin) {
                    imageUrl = `https://m.media-amazon.com/images/I/${product.asin}._SL500_.jpg`;
                } else {
                    imageUrl = 'https://via.placeholder.com/150x150/f0f0f0/999999?text=No+Image';
                }

                return `
                    <div class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow duration-200 min-w-[200px] max-w-[220px] flex-shrink-0">
                        <div class="relative">
                            <img src="${imageUrl}" 
                                alt="${product.name}" 
                                class="w-full h-32 object-contain rounded-md mb-2"
                                onerror="this.src='https://via.placeholder.com/150x150/f0f0f0/999999?text=No+Image'"
                                loading="lazy">
                            <div class="absolute top-1 right-1">
                                <div class="text-4xl mb-2">${product.emoji}</div>
                                <div class="text-sm text-gray-600">${product.name.split(' ')[0]}</div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${product.bestseller ? '<div class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">🏆 ベストセラー</div>' : ''}
                            ${product.amazons_choice ? '<div class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">🎯 Amazon\'s Choice</div>' : ''}
                            ${product.professional ? '<div class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-bold">💼 プロ仕様</div>' : ''}
                            ${product.badge ? '<div class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">' + product.badge + '</div>' : ''}
                        </div>
                        
                        ${product.safety_warning ? 
                        '<div class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mb-2 border-l-4 border-orange-400">' +
                            '<div class="flex items-center">' +
                                '<span class="mr-1">⚠️</span>' +
                                '<span class="font-bold">' + product.safety_warning + '</span>' +
                            '</div>' +
                        '</div>' : ''}
                        
                        <h4 class="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight">${product.name}</h4>
                        
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-lg font-bold text-orange-600">${product.price}</span>
                            <div class="flex items-center text-sm text-gray-600">
                                <span class="text-yellow-400">★</span>
                                <span class="ml-1">${product.rating}</span>
                                <span class="ml-1 text-gray-400">(${product.reviews.toLocaleString()})</span>
                            </div>
                        </div>
                        
                        <a href="https://amazon.co.jp/dp/${product.asin}?tag=${window.AMAZON_ASSOCIATE_TAG || 'aiclean-22'}" 
                           target="_blank" 
                           class="block w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-center py-2 rounded-md hover:from-orange-500 hover:to-orange-600 transition-all duration-200 text-sm font-semibold shadow-sm">
                            🛒 Amazonで購入
                        </a>
                    </div>
                `;
            }).join('');
        };

        const html = `
            <div class="space-y-6">
                <!-- 洗剤・クリーナー -->
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <span class="text-2xl mr-2">🧴</span>
                        洗剤・クリーナー
                        <span class="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">${products.cleaners?.length || 0}種類</span>
                    </h3>
                    <div class="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
                        ${generateProductGrid(products.cleaners, '洗剤・クリーナー', '🧴')}
                    </div>
                </div>

                <!-- 掃除道具 -->
                <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <span class="text-2xl mr-2">🧹</span>
                        掃除道具
                        <span class="ml-2 text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">${products.tools?.length || 0}種類</span>
                    </h3>
                    <div class="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100">
                        ${generateProductGrid(products.tools, '掃除道具', '🧹')}
                    </div>
                </div>

                <!-- 保護具 -->
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <span class="text-2xl mr-2">🛡️</span>
                        保護具・安全用品
                        <span class="ml-2 text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded-full">${products.protection?.length || 0}種類</span>
                    </h3>
                    <div class="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
                        ${generateProductGrid(products.protection, '保護具', '🛡️')}
                    </div>
                </div>
            </div>
        `;

        const productsContainer = document.getElementById('productsContainer');
        if (productsContainer) {
            productsContainer.innerHTML = html;
            console.log('✅ 商品表示完了');
        }
    }

    // 📊 ローディング表示制御
    showAnalysisLoading(show) {
        const loadingElement = document.getElementById('analysisLoading');
        if (loadingElement) {
            if (show) {
                loadingElement.classList.remove('hidden');
                loadingElement.innerHTML = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <h3 class="text-lg font-semibold text-blue-800 mb-2">🤖 AI分析中...</h3>
                        <p class="text-blue-600">最適な掃除方法と商品を検索しています</p>
                    </div>
                `;
            } else {
                loadingElement.classList.add('hidden');
            }
        }
    }

    // 🗑️ 全データクリア
    clearAll() {
        console.log('🔄 データクリア実行');
        
        this.state = {
            selectedImage: null,
            preSelectedLocation: '',
            customLocation: '',
            analysis: null,
            showCorrection: false,
            geminiApiKey: this.state.geminiApiKey,
            currentFeedbackType: null,
            dirtSeverity: null
        };

        const uploadedImageArea = document.getElementById('uploadedImageArea');
        const customInput = document.getElementById('customInput');
        
        if (uploadedImageArea) {
            uploadedImageArea.classList.add('hidden');
        }
        if (customInput) {
            customInput.classList.add('hidden');
        }
        
        const customLocation = document.getElementById('customLocation');
        if (customLocation) customLocation.value = '';
        
        const imageInput = document.getElementById('imageInput');
        if (imageInput) imageInput.value = '';
        
        const selectedLocationText = document.getElementById('selectedLocationText');
        const selectedLocationDisplay = document.getElementById('selectedLocationDisplay');
        const customValidation = document.getElementById('customValidation');
        
        if (selectedLocationText) selectedLocationText.classList.add('hidden');
        if (selectedLocationDisplay) selectedLocationDisplay.classList.add('hidden');
        if (customValidation) customValidation.classList.add('hidden');
        
        this.hideResults();
        this.updateClearButtonVisibility();
        this.resetAllLocationButtons();
        
        console.log('✅ クリア完了');
        this.showSuccessNotification('すべてリセット完了');
    }

    // 🚫 結果非表示
    hideResults() {
        const analysisResults = document.getElementById('analysisResults');
        const errorDisplay = document.getElementById('errorDisplay');
        const correctionOptions = document.getElementById('correctionOptions');
        const analysisDisplay = document.getElementById('analysisDisplay');
        
        if (analysisResults) analysisResults.classList.add('hidden');
        if (errorDisplay) errorDisplay.classList.add('hidden');
        if (correctionOptions) correctionOptions.classList.add('hidden');
        if (analysisDisplay) analysisDisplay.classList.remove('hidden');
        
        this.state.analysis = null;
        this.state.showCorrection = false;
    }

    // ⚠️ エラー表示
    showError(message, details = null) {
        console.error(`💥 エラー: ${message} ${details || ''}`);
        
        const errorDisplay = document.getElementById('errorDisplay');
        const errorIcon = errorDisplay?.querySelector('i');
        const errorText = errorDisplay?.querySelector('p');
        const errorDetailsEl = document.getElementById('errorDetails');
        
        if (errorDisplay && errorText) {
            errorDisplay.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-6';
            if (errorIcon) {
                errorIcon.className = 'w-5 h-5 text-red-500 mr-2';
                errorIcon.setAttribute('data-lucide', 'alert-circle');
            }
            
            errorText.className = 'text-red-700 font-semibold';
            errorText.textContent = message;
            
            if (details && errorDetailsEl) {
                errorDetailsEl.className = 'text-sm text-red-600 mt-2';
                errorDetailsEl.textContent = details;
                errorDetailsEl.classList.remove('hidden');
            } else if (errorDetailsEl) {
                errorDetailsEl.classList.add('hidden');
            }
            
            errorDisplay.classList.remove('hidden');
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            setTimeout(() => {
                errorDisplay.classList.add('hidden');
            }, 10000);
        }
    }

    // ✅ 成功通知表示
    showSuccessNotification(message) {
        console.log(`✅ ${message}`);
        
        try {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: bold;
            `;
            notification.textContent = `✅ ${message}`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        } catch (error) {
            console.warn('通知表示エラー:', error);
        }
    }

    // 圧縮中通知
    showCompressionNotification() {
        try {
            const notification = document.createElement('div');
            notification.id = 'compressionNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #3b82f6;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: bold;
                max-width: 300px;
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div style="margin-right: 10px;">
                        <div style="width: 20px; height: 20px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                    <div>
                        <div>画像を最適化中...</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
                            高速アップロードのため圧縮しています
                        </div>
                    </div>
                </div>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                const existing = document.getElementById('compressionNotification');
                if (existing) existing.remove();
            }, 8000);
        } catch (error) {
            console.warn('圧縮通知表示エラー:', error);
        }
    }

    // 🎯 選択場所表示更新
    updateSelectedLocationDisplay() {
        const selectedLocationText = document.getElementById('selectedLocationText');
        
        if (!selectedLocationText) {
            console.log('ℹ️ selectedLocationText要素が見つかりません');
            return;
        }
        
        if (this.state.preSelectedLocation) {
            let text = '';
            
            if (this.state.preSelectedLocation === 'custom') {
                const customText = this.state.customLocation || '自由記述';
                text = `選択中: ✏️ ${customText}`;
                
                if (this.state.customLocation && this.state.customLocation.trim()) {
                    const estimatedDirt = this.comprehensiveEstimateDirtTypes(this.state.customLocation);
                    if (estimatedDirt.length > 0) {
                        text += ` (推定: ${estimatedDirt.slice(0, 2).join(', ')})`;
                    }
                }
            } else {
                const locationInfo = window.COMPREHENSIVE_LOCATION_CONFIG?.[this.state.preSelectedLocation];
                
                const basicLocationMapping = {
                    'kitchen': { label: 'キッチン・換気扇', dirtTypes: ['油汚れ'] },
                    'bathroom': { label: '浴室・お風呂', dirtTypes: ['カビ汚れ'] },
                    'toilet': { label: 'トイレ', dirtTypes: ['尿石'] },
                    'window': { label: '窓・ガラス', dirtTypes: ['水垢'] },
                    'floor': { label: '床・フローリング', dirtTypes: ['ホコリ'] },
                    'aircon': { label: 'エアコン', dirtTypes: ['ホコリ'] },
                    'washer': { label: '洗濯機', dirtTypes: ['カビ汚れ'] },
                    'custom': { label: 'その他（自由記述）', dirtTypes: [] },
                    'general': { label: '一般的な掃除', dirtTypes: ['ホコリ'] }
                };
                
                const mappingInfo = locationInfo || basicLocationMapping[this.state.preSelectedLocation];
                
                if (!mappingInfo) {
                    const fallbackText = `選択中: 場所が選択されていません`;
                    selectedLocationText.textContent = fallbackText;
                    selectedLocationText.classList.remove('hidden');
                    return;
                }
                
                let safeLabel = mappingInfo?.label;
                if (!safeLabel && this.state.preSelectedLocation) {
                    safeLabel = basicLocationMapping[this.state.preSelectedLocation]?.label;
                }
                if (!safeLabel) {
                    safeLabel = this.state.preSelectedLocation === 'kitchen' ? 'キッチン・換気扇' : '選択された場所';
                }
                
                text = `選択中: ${safeLabel}`;
                
                if (mappingInfo.dirtTypes && mappingInfo.dirtTypes.length > 0) {
                    text += ` (対応: ${mappingInfo.dirtTypes.slice(0, 2).join(', ')})`;
                }
            }
            
            if (selectedLocationText) {
                selectedLocationText.textContent = text;
                selectedLocationText.classList.remove('hidden');
                console.log(`✅ 選択場所表示更新: ${text}`);
            }

            // 分析エリアでの表示
            if (this.state.selectedImage) {
                const display = document.getElementById('selectedLocationDisplay');
                if (display) {
                    const p = display.querySelector('p');
                    if (p && text) {
                        p.textContent = `📍 選択した場所: ${text.replace('選択中: ', '')}`;
                    }
                    display.classList.remove('hidden');
                }
            }
        } else {
            if (selectedLocationText) {
                selectedLocationText.classList.add('hidden');
            }
            const selectedLocationDisplay = document.getElementById('selectedLocationDisplay');
            if (selectedLocationDisplay) {
                selectedLocationDisplay.classList.add('hidden');
            }
        }
    }

    // 汚れ度合い表示更新
    updateSelectedSeverityDisplay(severity) {
        try {
            const severityDisplay = document.getElementById('selectedSeverityDisplay');
            if (severityDisplay && severity) {
                const severityLabels = {
                    'light': '🧽 日常的な汚れ（軽度）',
                    'heavy': '⚡ 頑固な汚れ・こびりつき（強度）'
                };
                const label = severityLabels[severity] || severity;
                const severityDisplayText = severityDisplay.querySelector('p');
                if (severityDisplayText) {
                    severityDisplayText.textContent = `汚れの程度: ${label}`;
                }
                severityDisplay.classList.remove('hidden');
                console.log(`✅ 汚れ程度表示更新: ${label}`);
            }
            
            const severityText = document.getElementById('selectedSeverityText');
            if (severityText && severity) {
                const severityLabels = {
                    'light': '🧽 日常的な汚れ（軽度）',
                    'heavy': '⚡ 頑固な汚れ・こびりつき（強度）'
                };
                const label = severityLabels[severity] || severity;
                severityText.textContent = `汚れの程度: ${label}`;
                severityText.classList.remove('hidden');
                console.log(`✅ 汚れ程度表示更新: ${label}`);
            }
        } catch (error) {
            console.error('❌ 汚れ程度表示エラー:', error);
        }
    }

    // クリアボタン表示制御
    updateClearButtonVisibility() {
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            const shouldShow = this.state.selectedImage || this.state.preSelectedLocation || this.state.customLocation;
            clearBtn.classList.toggle('hidden', !shouldShow);
        }
    }

    // 全ボタンリセット
    resetAllLocationButtons() {
        try {
            const locationButtons = document.querySelectorAll('.location-btn');
            locationButtons.forEach(btn => {
                btn.className = 'location-btn p-3 border-2 rounded-lg transition-colors text-sm text-left border-gray-200 hover:border-blue-300 hover:bg-blue-50';
            });
            console.log(`🔄 ${locationButtons.length}個のボタンをリセット`);
        } catch (error) {
            console.error('ボタンリセットエラー:', error);
        }
    }

    // 選択ボタンハイライト
    highlightSelectedButton(locationId) {
        try {
            const selectedBtn = document.querySelector(`[data-location="${locationId}"]`);
            if (selectedBtn) {
                let colorClass = 'border-blue-500 bg-blue-50 text-blue-700';
                if (['aircon', 'washer'].includes(locationId)) {
                    colorClass = 'border-green-500 bg-green-50 text-green-700';
                } else if (locationId === 'custom') {
                    colorClass = 'border-yellow-500 bg-yellow-50 text-yellow-700';
                }
                
                selectedBtn.className = `location-btn p-3 border-2 rounded-lg transition-colors text-sm text-left ${colorClass}`;
                console.log(`✅ ボタンハイライト完了: ${locationId}`);
            } else {
                console.warn(`⚠️ 選択ボタンが見つかりません: ${locationId}`);
            }
        } catch (error) {
            console.error('ボタンハイライトエラー:', error);
        }
    }

    // カスタム入力制御
    handleCustomInput(locationId) {
        try {
            const customInput = document.getElementById('customInput');
            const customLocationInput = document.getElementById('customLocation');
            
            if (locationId === 'custom') {
                if (customInput) {
                    customInput.classList.remove('hidden');
                    console.log('✅ カスタム入力表示');
                }
                setTimeout(() => {
                    if (customLocationInput) {
                        customLocationInput.focus();
                    }
                }, 100);
            } else {
                if (customInput) {
                    customInput.classList.add('hidden');
                    console.log('✅ カスタム入力非表示');
                }
                this.state.customLocation = '';
                if (customLocationInput) {
                    customLocationInput.value = '';
                }
            }
        } catch (error) {
            console.error('カスタム入力制御エラー:', error);
        }
    }

    // 汚れタイプ推定
    comprehensiveEstimateDirtTypes(customLocation) {
        const locationLower = customLocation.toLowerCase();
        const detectedDirtTypes = [];
        
        if (locationLower.includes('油') || locationLower.includes('キッチン')) {
            detectedDirtTypes.push('油汚れ');
        } else if (locationLower.includes('カビ') || locationLower.includes('浴室')) {
            detectedDirtTypes.push('カビ汚れ');
        } else if (locationLower.includes('水垢') || locationLower.includes('ウロコ')) {
            detectedDirtTypes.push('水垢汚れ');
        } else if (locationLower.includes('トイレ') || locationLower.includes('便器')) {
            detectedDirtTypes.push('尿石');
        } else if (locationLower.includes('窓') || locationLower.includes('ガラス')) {
            detectedDirtTypes.push('窓の水垢');
        } else {
            detectedDirtTypes.push('汚れ');
        }
        
        return detectedDirtTypes;
    }

    // Lucideアイコン初期化
    initializeLucideIcons() {
        const initLucide = () => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log('🎨 Lucideアイコン初期化完了');
            } else {
                setTimeout(initLucide, 100);
            }
        };
        initLucide();
    }

    // UI状態更新
    updateUI() {
        if (typeof window.debugUI !== 'undefined') {
            window.debugUI.updateStatusIndicators();
        }
        this.updateClearButtonVisibility();
    }

    // 安全なイベントリスナー追加
    addEventListenerSafe(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
            console.log(`✅ ${elementId} にイベントリスナー追加`);
        } else {
            console.log(`⚠️ ${elementId} が見つかりません`);
        }
    }

    // イベントリスナー削除
    removeAllEventListeners(btn, index) {
        try {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            console.log(`  📝 ボタン${index + 1}: cloneNodeで古いリスナー削除`);
            return newBtn;
        } catch (error) {
            console.warn(`  ⚠️ ボタン${index + 1}: cloneNode失敗`, error);
            return btn;
        }
    }

    // 場所選択イベントリスナー追加
    addLocationEventListener(btn, location, index) {
        const actualBtn = btn.parentNode ? btn : document.querySelectorAll('.location-btn')[index];
        
        if (!actualBtn) {
            console.error(`❌ ボタン${index + 1}が見つかりません`);
            return;
        }

        try {
            const clickHandler = (e) => {
                console.log(`🎯 ボタンクリック検出: ${location}`);
                e.preventDefault();
                e.stopPropagation();
                this.selectLocation(location);
            };
            
            actualBtn.addEventListener('click', clickHandler);
            console.log(`  ✅ ボタン${index + 1}: addEventListener設定完了`);
        } catch (error) {
            console.error(`  ❌ ボタン${index + 1}: addEventListener失敗`, error);
        }

        try {
            actualBtn.onclick = (e) => {
                console.log(`🎯 ボタンクリック検出: ${location} (onclick)`);
                e.preventDefault();
                e.stopPropagation();
                this.selectLocation(location);
            };
            console.log(`  ✅ ボタン${index + 1}: onclick設定完了`);
        } catch (error) {
            console.error(`  ❌ ボタン${index + 1}: onclick失敗`, error);
        }
    }

    // ボタン設定テスト
    testButtonSetup() {
        console.log('🧪 ボタン設定テスト開始');
        
        const locationButtons = document.querySelectorAll('.location-btn');
        locationButtons.forEach((btn, index) => {
            const location = btn.getAttribute('data-location');
            console.log(`テスト${index + 1}: ${location}`);
            console.log(`  - disabled: ${btn.disabled}`);
            console.log(`  - pointerEvents: ${btn.style.pointerEvents}`);
            console.log(`  - hasClickListener: ${btn.onclick !== null}`);
        });
        
        console.log('🧪 ボタン設定テスト完了');
    }

    // API関連UI操作メソッド群
    saveGeminiApiKey() {
        const apiKeyInput = document.getElementById('geminiApiKey');
        if (apiKeyInput) {
            this.state.geminiApiKey = apiKeyInput.value;
            window.currentGeminiApiKey = apiKeyInput.value;
            console.log('✅ Gemini APIキー保存完了');
            this.showSuccessNotification('APIキーを保存しました');
        }
    }

    testGeminiConnection() {
        console.log('🧪 Gemini接続テスト開始');
        // テスト実装は別途必要
        this.showSuccessNotification('接続テスト実行中...');
    }

    toggleApiKeyVisibility() {
        const apiKeyInput = document.getElementById('geminiApiKey');
        if (apiKeyInput) {
            const type = apiKeyInput.type === 'password' ? 'text' : 'password';
            apiKeyInput.type = type;
            console.log(`🔒 APIキー表示切り替え: ${type}`);
        }
    }

    testAllConnections() {
        console.log('🧪 全接続テスト開始');
        this.showSuccessNotification('全接続テスト実行中...');
    }

    // 修正・フィードバック関連
    toggleCorrection() {
        this.state.showCorrection = !this.state.showCorrection;
        const correctionOptions = document.getElementById('correctionOptions');
        if (correctionOptions) {
            correctionOptions.classList.toggle('hidden', !this.state.showCorrection);
        }
        console.log(`🔄 修正オプション表示: ${this.state.showCorrection}`);
    }

    showFeedbackModal(type) {
        this.state.currentFeedbackType = type;
        const feedbackModal = document.getElementById('feedbackModal');
        if (feedbackModal) {
            feedbackModal.classList.remove('hidden');
        }
        console.log(`💬 フィードバックモーダル表示: ${type}`);
    }

    closeFeedbackModal() {
        const feedbackModal = document.getElementById('feedbackModal');
        if (feedbackModal) {
            feedbackModal.classList.add('hidden');
        }
        this.state.currentFeedbackType = null;
        console.log('💬 フィードバックモーダル閉じる');
    }

    showExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.classList.remove('hidden');
        }
        console.log('📤 エクスポートモーダル表示');
    }

    closeExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.classList.add('hidden');
        }
        console.log('📤 エクスポートモーダル閉じる');
    }

    submitFeedback(feedback = '') {
        console.log(`📝 フィードバック送信: ${this.state.currentFeedbackType} - ${feedback}`);
        this.closeFeedbackModal();
        this.showSuccessNotification('フィードバックありがとうございます');
    }

    copyAnalysisResult() {
        if (this.state.analysis) {
            const text = `AI掃除アドバイザー分析結果\n汚れタイプ: ${this.state.analysis.dirtType}\n場所: ${this.state.analysis.surface}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccessNotification('分析結果をコピーしました');
            });
        }
    }

    copyCleaningMethod() {
        if (this.state.analysis?.cleaningMethod) {
            const method = this.state.analysis.cleaningMethod;
            const text = `${method.title}\n\n手順:\n${method.steps.join('\n')}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccessNotification('掃除方法をコピーしました');
            });
        }
    }

    copyConfiguration() {
        const config = {
            apiKey: this.state.geminiApiKey ? '設定済み' : '未設定',
            selectedLocation: this.state.preSelectedLocation,
            dirtSeverity: this.state.dirtSeverity
        };
        const text = JSON.stringify(config, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccessNotification('設定をコピーしました');
        });
    }

    refreshProductPrices() {
        console.log('💰 商品価格更新開始');
        this.showSuccessNotification('商品価格を更新中...');
        // 実装は別途必要
    }

    applyComprehensiveCorrection(type) {
        console.log(`🔧 包括的修正適用: ${type}`);
        this.showSuccessNotification(`修正を適用しました: ${type}`);
    }

    // ダミーメソッド（分析処理は別モジュールが担当）
    executeAnalysis() {
        console.log('🚀 分析実行要求 - 別モジュールが処理');
        this.emit('analyzeRequested');
    }

    /**
     * イベントリスナー追加（EventTarget互換）
     * @param {string} eventType - イベントタイプ
     * @param {Function} callback - コールバック関数
     */
    on(eventType, callback) {
        this.addEventListener(eventType, callback);
    }

    /**
     * イベント発火（EventTarget互換）
     * @param {string} eventType - イベントタイプ
     * @param {*} detail - イベントデータ
     */
    emit(eventType, detail = null) {
        this.dispatchEvent(new CustomEvent(eventType, { detail }));
    }

    /**
     * ステータス情報を更新
     * @param {Object} info - 統計情報
     */
    updateStatusInfo(info) {
        console.log('📊 ステータス情報更新:', info);
        
        // 統計情報の表示更新
        if (info.dirtCount) {
            const dirtCountEl = document.querySelector('[data-stat="dirt-count"]');
            if (dirtCountEl) dirtCountEl.textContent = info.dirtCount;
        }
        
        if (info.productCount) {
            const productCountEl = document.querySelector('[data-stat="product-count"]');
            if (productCountEl) productCountEl.textContent = info.productCount;
        }
        
        if (info.locationCount) {
            const locationCountEl = document.querySelector('[data-stat="location-count"]');
            if (locationCountEl) locationCountEl.textContent = info.locationCount;
        }
    }

    /**
     * エラーメッセージを表示
     * @param {string} message - エラーメッセージ
     * @param {Error} error - エラーオブジェクト
     */
    showErrorMessage(message, error = null) {
        console.error(`❌ ${message}:`, error);
        
        try {
            // エラー通知を表示
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(220,53,69,0.3);
                z-index: 10000;
                max-width: 300px;
                word-wrap: break-word;
            `;
            
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">⚠️ エラー</div>
                <div style="font-size: 14px;">${message}</div>
                ${error ? `<div style="font-size: 12px; margin-top: 4px; opacity: 0.8;">${error.message}</div>` : ''}
            `;
            
            document.body.appendChild(notification);
            
            // 5秒後に自動削除
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 5000);
            
        } catch (displayError) {
            console.error('エラー表示に失敗:', displayError);
        }
    }

    /**
     * 場所ボタンをセットアップ
     * @param {Object} locationConfig - 場所設定
     */
    setupLocationButtons(locationConfig) {
        console.log('🏠 場所ボタンセットアップ開始');
        
        // 既存のsetupLocationButtonsWithDebugを使用
        this.setupLocationButtonsWithDebug();
        
        console.log('✅ 場所ボタンセットアップ完了');
    }

    /**
     * 場所選択を更新
     * @param {string} location - 選択された場所
     */
    updateLocationSelection(location) {
        console.log(`📍 場所選択UI更新: ${location}`);
        this.selectLocation(location);
    }

    /**
     * 一般的な汚れタイプを表示
     * @param {Array} dirtTypes - 汚れタイプ配列
     */
    updateCommonDirtTypes(dirtTypes) {
        console.log('🧽 一般的な汚れタイプ表示:', dirtTypes);
        
        const container = document.getElementById('commonDirtTypes');
        if (container && dirtTypes && dirtTypes.length > 0) {
            container.innerHTML = `
                <div class="text-sm text-gray-600 mb-2">この場所でよくある汚れ:</div>
                <div class="flex flex-wrap gap-2">
                    ${dirtTypes.map(dirt => `
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            ${dirt}
                        </span>
                    `).join('')}
                </div>
            `;
            container.classList.remove('hidden');
        }
    }

    /**
     * 汚れ度合い選択を更新
     * @param {string} severity - 汚れ度合い
     */
    updateSeveritySelection(severity) {
        console.log(`🎯 汚れ度合いUI更新: ${severity}`);
        this.selectDirtSeverity(severity);
    }

    /**
     * 画像プレビューを表示
     * @param {string} imageData - Base64画像データ
     */
    showImagePreview(imageData) {
        console.log('🖼️ 画像プレビュー表示');
        
        const uploadedImage = document.getElementById('uploadedImage');
        if (uploadedImage) {
            uploadedImage.src = imageData;
            uploadedImage.style.display = 'block';
        }
        
        const uploadedImageArea = document.getElementById('uploadedImageArea');
        if (uploadedImageArea) {
            uploadedImageArea.classList.remove('hidden');
        }
    }

    /**
     * 自動分析が有効かチェック
     * @returns {boolean} 自動分析が有効かどうか
     */
    isAutoAnalysisEnabled() {
        const autoAnalysisEl = document.getElementById('autoAnalysis');
        return autoAnalysisEl ? autoAnalysisEl.checked : false;
    }

    /**
     * ローディング状態を表示
     * @param {string} message - ローディングメッセージ
     */
    showLoadingState(message = '処理中...') {
        console.log(`⏳ ローディング表示: ${message}`);
        
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.textContent = message;
            loadingEl.classList.remove('hidden');
        }
    }

    /**
     * ローディング状態を非表示
     */
    hideLoadingState() {
        console.log('⏳ ローディング非表示');
        
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
    }

    /**
     * 分析結果を表示
     * @param {Object} result - 分析結果
     */
    displayAnalysisResult(result) {
        console.log('📊 分析結果表示:', result);
        
        const resultsEl = document.getElementById('analysisResults');
        if (resultsEl) {
            resultsEl.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-bold mb-4">分析結果</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>汚れタイプ:</strong> ${result.dirtType}</p>
                            <p><strong>場所:</strong> ${result.surface}</p>
                            <p><strong>程度:</strong> ${result.severity}</p>
                        </div>
                        <div>
                            <p><strong>分析方法:</strong> ${result.analysisMethod || 'AI分析'}</p>
                        </div>
                    </div>
                    
                    ${result.cleaningMethod ? `
                        <div class="mt-6">
                            <h4 class="font-bold mb-2">推奨掃除方法</h4>
                            <ol class="list-decimal list-inside space-y-1">
                                ${result.cleaningMethod.steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                            ${result.cleaningMethod.warning ? `
                                <div class="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                                    <p class="text-sm">${result.cleaningMethod.warning}</p>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${result.recommendedProducts && result.recommendedProducts.length > 0 ? `
                        <div class="mt-6">
                            <h4 class="font-bold mb-4">推奨商品</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                ${result.recommendedProducts.slice(0, 6).map(product => `
                                    <div class="border rounded-lg p-3">
                                        <h5 class="font-medium text-sm mb-1">${product.name}</h5>
                                        <p class="text-xs text-gray-600 mb-2">${product.type}</p>
                                        ${product.amazonUrl ? `
                                            <a href="${product.amazonUrl}" target="_blank" 
                                               class="text-blue-600 hover:text-blue-800 text-xs">
                                                Amazonで見る →
                                            </a>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            resultsEl.classList.remove('hidden');
        }
    }

    /**
     * クリーンアップ処理
     */
    cleanup() {
        console.log('🧹 UIComponents クリーンアップ');
        // 必要に応じてイベントリスナーの削除等
    }
}

// ES Module Export
export default UIComponents;