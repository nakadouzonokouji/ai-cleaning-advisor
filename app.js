 /**
   * AI掃除アドバイザー - メインアプリケーション（統合サーバー対応版）
   * CX Mainte © 2025
   *
   * 🏠 完全対応：家中のあらゆる汚れに対応する最強システム
   * 🚀 統合サーバー：Gemini AI + Amazon PA-API対応
   */

  class AICleaningAdvisor {
      constructor() {
          this.state = {
              selectedImage: null,
              preSelectedLocation: '',
              customLocation: '',
              analysis: null,
              showCorrection: false,
              currentFeedbackType: null
          };

          this.feedbackData = this.loadFeedbackData();
          this.isInitialized = false;
          this.init();
      }

      init() {
          console.log('🚀 AI掃除アドバイザー初期化開始');

          // 統合サーバー設定
          this.serverConfig = {
              baseUrl: 'https://glowing-couscous-pv7g96gpj47f69r9-3001.app.github.dev',
              endpoints: {
                  analyze: '/api/analyze',
                  product: '/api/product',
                  health: '/api/health'
              }
          };

          // DOM準備を待つ
          if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => this.initializeApp());
          } else {
              setTimeout(() => this.initializeApp(), 50);
          }

          window.addEventListener('load', () => {
              if (!this.isInitialized) {
                  setTimeout(() => this.initializeApp(), 100);
              }
          });
      }

      initializeApp() {
          if (this.isInitialized) {
              console.log('⚠️ 既に初期化済み - スキップ');
              return;
          }
          this.isInitialized = true;

          console.log('🔧 アプリケーション本体初期化開始');

          this.setupBasicEventListeners();
          this.setupLocationButtons();
          this.initializeLucideIcons();
          this.updateUI();

          console.log('✅ AI掃除アドバイザー初期化完了');
      }

      setupBasicEventListeners() {
          // 画像アップロード
          this.addEventListenerSafe('imageUpload', 'change', (e) => this.handleImageUpload(e));

          // 分析実行
          this.addEventListenerSafe('analyzeBtn', 'click', () => this.executeAnalysis());

          // フィードバック
          this.addEventListenerSafe('goodBtn', 'click', () => this.submitFeedback('good'));
          this.addEventListenerSafe('badBtn', 'click', () => this.submitFeedback('bad'));

          // その他のイベント
          this.addEventListenerSafe('customLocationInput', 'input', (e) => {
              this.state.customLocation = e.target.value;
          });
      }

      setupLocationButtons() {
          const locationButtons = document.querySelectorAll('.location-btn');
          console.log(`🔧 場所選択ボタン設定: ${locationButtons.length}個`);

          locationButtons.forEach((btn, index) => {
              const location = btn.getAttribute('data-location');
              console.log(`ボタン${index + 1}: ${location}`);

              btn.addEventListener('click', () => {
                  console.log(`📍 場所選択: ${location}`);
                  this.selectLocation(location);
              });
          });
      }

      selectLocation(location) {
          this.state.preSelectedLocation = location;

          // ボタンのスタイル更新
          document.querySelectorAll('.location-btn').forEach(btn => {
              btn.classList.remove('bg-blue-600', 'text-white');
              btn.classList.add('bg-gray-200', 'text-gray-700');
          });

          const selectedBtn = document.querySelector(`[data-location="${location}"]`);
          if (selectedBtn) {
              selectedBtn.classList.remove('bg-gray-200', 'text-gray-700');
              selectedBtn.classList.add('bg-blue-600', 'text-white');
          }

          // カスタム入力の表示制御
          const customInput = document.getElementById('customLocationContainer');
          if (customInput) {
              if (location === 'custom') {
                  customInput.classList.remove('hidden');
              } else {
                  customInput.classList.add('hidden');
              }
          }

          console.log(`✅ 場所選択完了: ${location}`);
      }

      handleImageUpload(event) {
          const file = event.target.files[0];
          if (!file) return;

          console.log('📸 画像アップロード:', file.name);

          if (file.size > 10 * 1024 * 1024) {
              this.showError('ファイルサイズエラー', 'ファイルサイズは10MB以下にしてください');
              return;
          }

          this.state.selectedImage = file;

          // プレビュー表示
          const reader = new FileReader();
          reader.onload = (e) => {
              const preview = document.getElementById('imagePreview');
              if (preview) {
                  preview.src = e.target.result;
                  preview.classList.remove('hidden');
              }
          };
          reader.readAsDataURL(file);

          this.updateUI();
      }

      // 🖼️ 統合サーバーでの画像解析
      async executeAnalysis() {
          console.log('🚀 AI掃除方法生成開始');

          if (!this.state.selectedImage) {
              this.showError('画像が必要です', '画像をアップロードしてください');
              return;
          }

          if (this.state.preSelectedLocation === 'custom' && !this.state.customLocation.trim()) {
              this.showError('場所を入力してください', 'カスタム場所を入力してください');
              return;
          }

          this.showAnalysisLoading(true);

          try {
              let analysisResult;

              if (this.serverConfig.baseUrl) {
                  // 統合サーバーで解析
                  analysisResult = await this.executeServerAnalysis();
              } else {
                  // ローカル解析（フォールバック）
                  analysisResult = await this.executeLocalAnalysis();
              }

              if (analysisResult) {
                  this.state.analysis = analysisResult;
                  setTimeout(() => this.displayAnalysisResults(), 1000);
                  console.log('✅ 分析完了');
              }

          } catch (error) {
              console.error(`💥 分析エラー: ${error.message}`);
              this.showError('分析エラー', error.message);
          } finally {
              this.showAnalysisLoading(false);
          }
      }

      // 統合サーバーでの解析
      async executeServerAnalysis() {
          console.log('🖼️ 統合サーバーでの画像分析実行');

          try {
              const formData = new FormData();
              formData.append('image', this.state.selectedImage);

              if (this.state.preSelectedLocation && this.state.preSelectedLocation !== 'custom') {
                  formData.append('location', this.state.preSelectedLocation);
              } else if (this.state.customLocation) {
                  formData.append('location', this.state.customLocation);
              }

              const response = await fetch(`${this.serverConfig.baseUrl}${this.serverConfig.endpoints.analyze}`, {
                  method: 'POST',
                  body: formData
              });

              if (!response.ok) {
                  throw new Error(`サーバーエラー: ${response.status}`);
              }

              const serverResult = await response.json();

              if (!serverResult.success) {
                  throw new Error(serverResult.error?.message || 'サーバー解析に失敗しました');
              }

              // レスポンスを内部形式に変換
              const result = {
                  dirtType: serverResult.analysis.dirtType,
                  surface: serverResult.analysis.surface,
                  confidence: serverResult.analysis.confidence,
                  isAIAnalyzed: true,
                  hasPhoto: true,
                  location: serverResult.analysis.surface,
                  analysisVersion: 'server-based'
              };

              result.cleaningMethod = serverResult.analysis.recommendedMethod ||
                                     this.generateCleaningMethod(result.dirtType, result.surface);

              result.recommendedProducts = serverResult.products || [];

              console.log('✅ 統合サーバー分析完了:', result);
              return result;

          } catch (error) {
              console.error('💥 統合サーバー分析エラー:', error);
              throw error;
          }
      }

      // ローカル解析（フォールバック）
      async executeLocalAnalysis() {
          console.log('🔄 ローカル分析実行（フォールバック）');

          const locationInfo = this.getLocationInfo(this.state.preSelectedLocation);

          const result = {
              dirtType: locationInfo?.dirtTypes?.[0] || '油汚れ',
              surface: locationInfo?.surface || '対象箇所',
              confidence: 75,
              isAIAnalyzed: false,
              hasPhoto: true,
              location: this.state.preSelectedLocation || 'other',
              analysisVersion: 'local-fallback'
          };

          result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface);
          result.recommendedProducts = this.getRecommendedProducts(result.dirtType);

          return result;
      }

      getLocationInfo(location) {
          const locationConfig = {
              'kitchen': { dirtTypes: ['油汚れ'], surface: 'キッチン' },
              'bathroom': { dirtTypes: ['カビ'], surface: '浴室' },
              'toilet': { dirtTypes: ['水垢'], surface: 'トイレ' },
              'floor': { dirtTypes: ['ホコリ'], surface: '床' }
          };
          return locationConfig[location];
      }

      generateCleaningMethod(dirtType, surface) {
          const methods = {
              '油汚れ': `${surface}の油汚れには、アルカリ性洗剤が効果的です。マジックリンなどの専用洗剤を使用し、しっかりと拭き取ってください。`,
              'カビ': `${surface}のカビには、塩素系漂白剤が効果的です。カビキラーなどを使用し、十分に換気して作業してください。`,
              '水垢': `${surface}の水垢には、酸性洗剤やクエン酸が効果的です。しっかりとこすり洗いしてください。`,
              'ホコリ': `${surface}のホコリは、掃除機で吸い取った後、モップやワイパーで仕上げてください。`
          };
          return methods[dirtType] || `${surface}の${dirtType}に適した洗剤で清拭してください。`;
      }

      getRecommendedProducts(dirtType) {
          const products = {
              '油汚れ': [
                  {
                      title: '花王 マジックリン ハンディスプレー',
                      price: '¥398',
                      image: 'https://images-na.ssl-images-amazon.com/images/P/B000TGNG0W.01.LZZZZZZZ.jpg',
                      urlWithTag: 'https://www.amazon.co.jp/dp/B000TGNG0W?tag=asdfghj12-22',
                      asin: 'B000TGNG0W'
                  }
              ]
          };
          return products[dirtType] || products['油汚れ'];
      }

      displayAnalysisResults() {
          const resultsSection = document.getElementById('resultsSection');
          if (!resultsSection) return;

          const result = this.state.analysis;

          resultsSection.innerHTML = `
              <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-4">🔍 AI分析結果</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div class="bg-blue-50 p-4 rounded-lg">
                          <p class="text-sm text-blue-600 font-semibold">汚れの種類</p>
                          <p class="text-lg font-bold text-blue-800">${result.dirtType}</p>
                      </div>
                      <div class="bg-green-50 p-4 rounded-lg">
                          <p class="text-sm text-green-600 font-semibold">信頼度</p>
                          <p class="text-lg font-bold text-green-800">${result.confidence}%</p>
                      </div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg mb-4">
                      <p class="text-sm text-gray-600 font-semibold mb-2">推奨掃除方法</p>
                      <p class="text-gray-800">${result.cleaningMethod}</p>
                  </div>
              </div>

              <div class="bg-white rounded-xl shadow-lg p-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-4">🛒 おすすめ商品</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      ${result.recommendedProducts.map(product => `
                          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <img src="${product.image}" alt="${product.title}" class="w-full h-32 object-contain mb-3">
                              <h4 class="font-semibold text-sm mb-2 line-clamp-2">${product.title}</h4>
                              <p class="text-lg font-bold text-blue-600 mb-3">${product.price}</p>
                              <a href="${product.urlWithTag}" target="_blank"
                                 class="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center block">
                                  Amazonで見る
                              </a>
                          </div>
                      `).join('')}
                  </div>
              </div>
          `;

          resultsSection.classList.remove('hidden');

          // フィードバックボタンを表示
          const feedbackSection = document.getElementById('feedbackSection');
          if (feedbackSection) {
              feedbackSection.classList.remove('hidden');
          }
      }

      submitFeedback(type) {
          console.log(`👍 フィードバック送信: ${type}`);

          const feedback = {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              type: type,
              comment: '',
              analysisResult: this.state.analysis
          };

          this.feedbackData.push(feedback);
          this.saveFeedbackData();

          this.showNotification(
              type === 'good' ? '👍 ありがとうございます！' : '👎 フィードバックを受け付けました',
              type === 'good' ? 'お役に立てて嬉しいです' : '改善に努めます'
          );
      }

      showAnalysisLoading(show) {
          const analyzeBtn = document.getElementById('analyzeBtn');
          const loadingBtn = document.getElementById('analyzeLoadingBtn');

          if (show) {
              if (analyzeBtn) analyzeBtn.classList.add('hidden');
              if (loadingBtn) loadingBtn.classList.remove('hidden');
          } else {
              if (loadingBtn) loadingBtn.classList.add('hidden');
              if (analyzeBtn) analyzeBtn.classList.remove('hidden');
          }
      }

      showError(title, message) {
          console.error(`❌ ${title}: ${message}`);
          alert(`${title}\n${message}`);
      }

      showNotification(title, message) {
          console.log(`✅ ${title}: ${message}`);
          // 簡易通知
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
          notification.innerHTML = `<strong>${title}</strong><br>${message}`;
          document.body.appendChild(notification);

          setTimeout(() => {
              notification.remove();
          }, 3000);
      }

      updateUI() {
          // UI状態を更新
          const analyzeBtn = document.getElementById('analyzeBtn');
          if (analyzeBtn) {
              analyzeBtn.disabled = !this.state.selectedImage;
          }
      }

      loadFeedbackData() {
          try {
              const data = localStorage.getItem('ai_cleaner_feedbacks');
              return data ? JSON.parse(data) : [];
          } catch (error) {
              console.error('フィードバックデータ読み込みエラー:', error);
              return [];
          }
      }

      saveFeedbackData() {
          try {
              localStorage.setItem('ai_cleaner_feedbacks', JSON.stringify(this.feedbackData));
          } catch (error) {
              console.error('フィードバックデータ保存エラー:', error);
          }
      }

      addEventListenerSafe(elementId, event, handler) {
          const element = document.getElementById(elementId);
          if (element) {
              element.addEventListener(event, handler);
          } else {
              console.warn(`⚠️ 要素が見つかりません: ${elementId}`);
          }
      }

      initializeLucideIcons() {
          setTimeout(() => {
              if (typeof lucide !== 'undefined' && lucide.createIcons) {
                  try {
                      lucide.createIcons();
                  } catch (error) {
                      console.log('アイコン初期化エラー（無視）:', error.message);
                  }
              }
          }, 100);
      }
  }

  // アプリケーション初期化
  document.addEventListener('DOMContentLoaded', () => {
      window.aiCleaningAdvisor = new AICleaningAdvisor();
      console.log('🎉 AI掃除アドバイザー準備完了！');
  });