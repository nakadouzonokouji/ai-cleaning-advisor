// ステップバイステップ AI掃除アドバイザー - 修正版
class StepWiseCleaningAdvisor {
    constructor() {
        this.currentStep = 1;
        this.selectedLocation = null;
        this.selectedSublocation = null;
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
        
        // ステップ2: サブロケーション選択
        document.querySelectorAll('[data-sublocation]').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectSublocation(e.currentTarget.dataset.sublocation, e);
            });
        });
        
        // ナビゲーションボタン
        const backToStep1FromStep2 = document.getElementById('backToStep1FromStep2');
        if (backToStep1FromStep2) {
            backToStep1FromStep2.addEventListener('click', () => this.goToStep(1));
        }
        
        const backToStep2FromStep3 = document.getElementById('backToStep2FromStep3');
        if (backToStep2FromStep3) {
            backToStep2FromStep3.addEventListener('click', () => this.goToStep(2));
        }
        
        const backToStep3 = document.getElementById('backToStep3');
        if (backToStep3) {
            backToStep3.addEventListener('click', () => this.goToStep(3));
        }
        
        // ステップ4: 写真関連
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
        
        // ステップ5: 結果画面
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
                this.showSublocationStep(location);
                this.goToStep(2);
            }, 200);
        }, 500);
    }
    
    showSublocationStep(location) {
        console.log('🎯 サブロケーション表示:', location);
        
        // 全てのサブロケーショングループを非表示
        document.querySelectorAll('.sublocation-group').forEach(group => {
            group.classList.add('hidden');
        });
        
        // 選択された場所のサブロケーションを表示
        const sublocationGroup = document.getElementById(`${location}-sublocations`);
        if (sublocationGroup) {
            sublocationGroup.classList.remove('hidden');
        } else {
            console.warn(`⚠️ サブロケーショングループが見つかりません: ${location}-sublocations`);
            // フォールバック: ステップ3（汚れ程度選択）にスキップ
            setTimeout(() => this.goToStep(3), 500);
        }
    }
    
    selectSublocation(sublocation, event = null) {
        console.log('🎯 サブロケーション選択:', sublocation);
        
        // 前の選択をリセット
        document.querySelectorAll('[data-sublocation]').forEach(card => {
            card.classList.remove('selected');
            card.style.transform = '';
        });
        
        // 新しい選択をマーク（アニメーション付き）
        const selectedCard = event ? event.currentTarget : document.querySelector(`[data-sublocation="${sublocation}"]`);
        
        if (!selectedCard) {
            console.error('❌ 選択されたサブロケーションカードが見つかりません:', sublocation);
            // フォールバック処理
            this.selectedSublocation = sublocation;
            setTimeout(() => this.goToStep(3), 500);
            return;
        }
        
        selectedCard.classList.add('selected');
        
        // 選択時のマイクロインタラクション
        selectedCard.style.transform = 'scale(1.05)';
        selectedCard.style.transition = 'all 0.3s ease';
        
        // 成功エフェクト
        this.showSelectionEffect(selectedCard);
        
        this.selectedSublocation = sublocation;
        
        // 少し待ってから次のステップへ（汚れ程度選択）
        setTimeout(() => {
            selectedCard.style.transform = 'scale(1)';
            setTimeout(() => {
                this.goToStep(3);
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
            setTimeout(() => this.goToStep(4), 500);
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
                this.goToStep(4);
            }, 200);
        }, 500);
    }
    
    getComprehensiveProductDatabase() {
        // 家中の汚れに対応する汎用商品データベース（ASINなし・検索キーワードベース）
        return {
            // ガスコンロ軽い汚れ用商品
            kitchen_stove_light: {
                cleaners: [
                    {
                        title: "重曹（食品グレード）",
                        category: "自然派洗剤",
                        price: "¥300-500",
                        description: "自然派・安全・環境に優しい・ガスコンロの軽い油汚れに効果的",
                        amazon_search: "重曹 食品グレード 掃除用",
                        why_recommended: "安全で環境に優しく、ガスコンロの軽い汚れに最適。五徳の漬け置きにも使える"
                    },
                    {
                        title: "中性食器用洗剤",
                        category: "中性洗剤",
                        price: "¥200-400",
                        description: "日常使いの中性洗剤・ガスコンロ表面の清拭に最適",
                        amazon_search: "食器用洗剤 中性 キッチン",
                        why_recommended: "日常的に使える安全な洗剤で五徳や天板の清拭に適している"
                    }
                ],
                tools: [
                    {
                        title: "マイクロファイバークロス",
                        category: "清拭用具",
                        price: "¥300-600",
                        description: "傷をつけずに清拭・繰り返し使用可能",
                        amazon_search: "マイクロファイバークロス キッチン用",
                        why_recommended: "ガスコンロ表面を傷つけず効率的に汚れを除去"
                    },
                    {
                        title: "やわらかいスポンジ",
                        category: "清掃用具",
                        price: "¥200-400",
                        description: "研磨材なし・表面を傷つけない・日常清掃に最適",
                        amazon_search: "キッチンスポンジ やわらかい 研磨材なし",
                        why_recommended: "五徳や天板を傷つけずに汚れを落とせる"
                    }
                ],
                protection: [
                    {
                        title: "ゴム手袋（キッチン用）",
                        category: "保護具",
                        price: "¥200-500",
                        description: "油汚れから手を保護・滑り止め付き",
                        amazon_search: "ゴム手袋 キッチン用 油汚れ対応",
                        why_recommended: "洗剤や油汚れから手を保護し作業性も向上"
                    }
                ]
            },
            
            // ガスコンロ頑固汚れ用商品
            kitchen_stove_heavy: {
                cleaners: [
                    {
                        title: "アルカリ性マルチクリーナー",
                        category: "アルカリ性洗剤",
                        price: "¥500-1200",
                        description: "頑固な油汚れに強力・アルカリ性で効果的な脱脂力",
                        amazon_search: "アルカリ性 マルチクリーナー 油汚れ 強力",
                        why_recommended: "頑固な油汚れに特化したアルカリ性で効果的な清掃が可能"
                    },
                    {
                        title: "酸素系漂白剤",
                        category: "酸素系洗剤",
                        price: "¥400-800",
                        description: "焦げ付きや頑固汚れに効果的・環境に優しい",
                        amazon_search: "酸素系漂白剤 キッチン用 焦げ落とし",
                        why_recommended: "焦げ付きや頑固な汚れを分解し、環境への負荷も少ない"
                    }
                ],
                tools: [
                    {
                        title: "メラミンスポンジ",
                        category: "研磨用具",
                        price: "¥200-500",
                        description: "水だけで汚れ落とし・研磨効果で頑固汚れに対応",
                        amazon_search: "メラミンスポンジ キッチン用 激落ち",
                        why_recommended: "水だけで頑固な汚れを落とせる強力な清掃力"
                    },
                    {
                        title: "ナイロンブラシ",
                        category: "ブラシ",
                        price: "¥300-700",
                        description: "五徳の隙間や細かい部分の清掃に最適",
                        amazon_search: "ナイロンブラシ キッチン 五徳用",
                        why_recommended: "五徳の細かい部分や隙間の汚れを効率的に除去"
                    }
                ],
                protection: [
                    {
                        title: "厚手ゴム手袋",
                        category: "保護具",
                        price: "¥400-800",
                        description: "強力洗剤対応・厚手で手をしっかり保護",
                        amazon_search: "厚手ゴム手袋 強力洗剤対応 キッチン",
                        why_recommended: "強力な洗剤使用時でも手をしっかり保護"
                    }
                ]
            },
            
            // IHコンロ軽い汚れ用商品
            kitchen_ih_light: {
                cleaners: [
                    {
                        title: "IH専用クリーナー",
                        category: "専用洗剤",
                        price: "¥600-1200",
                        description: "IH天板専用・傷をつけない・セラミック面対応",
                        amazon_search: "IH専用クリーナー セラミック 天板",
                        why_recommended: "IH天板を傷つけず効果的に汚れを除去する専用洗剤"
                    },
                    {
                        title: "中性ガラス用洗剤",
                        category: "中性洗剤",
                        price: "¥300-600",
                        description: "ガラス・セラミック面に安全・日常清掃に最適",
                        amazon_search: "中性洗剤 ガラス用 セラミック",
                        why_recommended: "IH天板のガラス・セラミック面を安全に清掃"
                    }
                ],
                tools: [
                    {
                        title: "IH専用スクレーパー",
                        category: "専用工具",
                        price: "¥500-1000",
                        description: "IH天板を傷つけない・焦げ付き除去に効果的",
                        amazon_search: "IH専用スクレーパー セラミック対応",
                        why_recommended: "IH天板を傷つけずに焦げ付きを安全に除去"
                    },
                    {
                        title: "セラミック用クロス",
                        category: "専用クロス",
                        price: "¥400-800",
                        description: "セラミック面専用・静電気防止・繰り返し使用可",
                        amazon_search: "セラミック用クロス IH 静電気防止",
                        why_recommended: "IHのセラミック面を傷つけず静電気も防止"
                    }
                ],
                protection: [
                    {
                        title: "静電気防止手袋",
                        category: "保護具",
                        price: "¥300-600",
                        description: "精密作業対応・静電気防止・IH清掃に最適",
                        amazon_search: "静電気防止手袋 精密作業用",
                        why_recommended: "IH清掃時の静電気を防止し精密な作業が可能"
                    }
                ]
            },
            
            // IHコンロ頑固汚れ用商品
            kitchen_ih_heavy: {
                cleaners: [
                    {
                        title: "IH強力クリーナー",
                        category: "強力洗剤",
                        price: "¥800-1500",
                        description: "IH専用強力洗剤・頑固な焦げ付きに対応・セラミック安全",
                        amazon_search: "IH強力クリーナー 焦げ付き セラミック専用",
                        why_recommended: "IH天板の頑固な焦げ付きを安全に除去する専用強力洗剤"
                    },
                    {
                        title: "セラミック復活剤",
                        category: "復活剤",
                        price: "¥1000-2000",
                        description: "セラミック面の光沢復活・細かい傷の修復",
                        amazon_search: "セラミック復活剤 IH 光沢回復",
                        why_recommended: "使用により曇ったIH天板の光沢を復活させる"
                    }
                ],
                tools: [
                    {
                        title: "IH専用研磨パッド",
                        category: "研磨用具",
                        price: "¥600-1200",
                        description: "IH専用・頑固汚れ除去・セラミック面対応",
                        amazon_search: "IH専用研磨パッド セラミック 頑固汚れ",
                        why_recommended: "IH天板を傷つけずに頑固な汚れを除去"
                    }
                ],
                protection: [
                    {
                        title: "耐薬品手袋",
                        category: "保護具",
                        price: "¥500-1000",
                        description: "強力洗剤対応・耐薬品性・精密作業可能",
                        amazon_search: "耐薬品手袋 強力洗剤対応 精密作業",
                        why_recommended: "IH用強力洗剤使用時でも手をしっかり保護"
                    }
                ]
            },
            
            // キッチンシンク軽い汚れ用
            kitchen_sink_light: {
                cleaners: [
                    {
                        title: "クエン酸",
                        category: "酸性洗剤",
                        price: "¥300-600",
                        description: "水垢・石鹸カスに効果的・自然派・安全",
                        amazon_search: "クエン酸 食品グレード 水垢除去",
                        why_recommended: "水垢や石鹸カスを安全に除去する自然派洗剤"
                    },
                    {
                        title: "中性キッチン洗剤",
                        category: "中性洗剤",
                        price: "¥200-500",
                        description: "日常清掃・除菌効果・シンク全体に安全",
                        amazon_search: "中性洗剤 キッチン用 除菌",
                        why_recommended: "シンクの日常清掃と除菌を安全に行える"
                    }
                ],
                tools: [
                    {
                        title: "キッチンスポンジ（ソフト）",
                        category: "清掃用具",
                        price: "¥200-400",
                        description: "シンクを傷つけない・抗菌加工・日常使い",
                        amazon_search: "キッチンスポンジ ソフト 抗菌 シンク用",
                        why_recommended: "シンクを傷つけず清潔に保てる"
                    },
                    {
                        title: "シンク用ブラシ",
                        category: "ブラシ",
                        price: "¥300-700",
                        description: "排水口・蛇口周り・細かい部分の清掃",
                        amazon_search: "シンク用ブラシ 排水口 蛇口",
                        why_recommended: "シンクの細かい部分や排水口を効率的に清掃"
                    }
                ],
                protection: [
                    {
                        title: "キッチン用ゴム手袋",
                        category: "保護具",
                        price: "¥200-500",
                        description: "水仕事対応・滑り止め・長時間使用可能",
                        amazon_search: "キッチン用ゴム手袋 水仕事 滑り止め",
                        why_recommended: "水仕事での手の保護と作業性向上"
                    }
                ]
            },
            
            // キッチンシンク頑固汚れ用
            kitchen_sink_heavy: {
                cleaners: [
                    {
                        title: "強力水垢除去剤",
                        category: "酸性洗剤",
                        price: "¥600-1500",
                        description: "頑固な水垢・石灰汚れに強力・業務用レベル",
                        amazon_search: "強力水垢除去剤 シンク用 業務用",
                        why_recommended: "頑固にこびりついた水垢を強力に除去"
                    },
                    {
                        title: "塩素系漂白剤",
                        category: "塩素系洗剤",
                        price: "¥300-700",
                        description: "除菌・漂白・カビ取り・強力清掃",
                        amazon_search: "塩素系漂白剤 キッチン用 除菌",
                        why_recommended: "強力な除菌効果で衛生的なシンクを実現"
                    }
                ],
                tools: [
                    {
                        title: "研磨パッド",
                        category: "研磨用具",
                        price: "¥300-600",
                        description: "頑固汚れ除去・ステンレス対応・傷つけない",
                        amazon_search: "研磨パッド ステンレス シンク用",
                        why_recommended: "ステンレスシンクを傷つけずに頑固汚れを除去"
                    },
                    {
                        title: "強力ブラシ",
                        category: "ブラシ",
                        price: "¥400-800",
                        description: "硬めの毛・頑固汚れ対応・排水口清掃",
                        amazon_search: "強力ブラシ シンク 排水口 頑固汚れ",
                        why_recommended: "頑固な汚れや排水口の汚れを強力に除去"
                    }
                ],
                protection: [
                    {
                        title: "厚手ゴム手袋",
                        category: "保護具",
                        price: "¥400-800",
                        description: "強力洗剤対応・耐薬品・長時間作業可能",
                        amazon_search: "厚手ゴム手袋 耐薬品 強力洗剤対応",
                        why_recommended: "強力洗剤使用時でも手をしっかり保護"
                    }
                ]
            }
        };
    }
    
    // 残りの基本メソッドは省略し、必要最小限のみ実装
    getLocationSpecificCleaners(locationType, dirtLevel, sublocation = null) {
        console.log(`🔍 商品検索開始: 場所=${locationType}, 汚れレベル=${dirtLevel}, サブロケーション=${sublocation}`);
        
        let targetLocation = sublocation || locationType;
        if (locationType === 'kitchen' && !sublocation) {
            targetLocation = 'kitchen_sink';
        }
        
        const dirtLevelSuffix = dirtLevel === 1 ? '_light' : '_heavy';
        const locationKey = targetLocation + dirtLevelSuffix;
        
        console.log(`🎯 最終検索キー: ${locationKey}`);
        
        const productDatabase = this.getComprehensiveProductDatabase();
        if (productDatabase[locationKey]) {
            const selectedProducts = productDatabase[locationKey];
            console.log(`✅ 商品発見: 洗剤${selectedProducts.cleaners?.length || 0}種類, 道具${selectedProducts.tools?.length || 0}種類, 保護具${selectedProducts.protection?.length || 0}種類`);
            
            return selectedProducts.cleaners || [];
        }
        
        console.log(`⚠️ フォールバック: ${locationKey} の商品が見つからません。`);
        return this.getFallbackProducts(locationType, dirtLevel);
    }
    
    getFallbackProducts(locationType, dirtLevel) {
        return [
            {
                title: "汎用住宅用洗剤",
                category: "汎用洗剤",
                price: "¥300-600",
                description: "家中の汚れに対応・安全・日常使い",
                amazon_search: "住宅用洗剤 マルチクリーナー",
                why_recommended: "家中の様々な汚れに対応できる汎用洗剤"
            },
            {
                title: "重曹",
                category: "自然派洗剤",
                price: "¥200-500",
                description: "自然派・安全・環境配慮・多目的使用可能",
                amazon_search: "重曹 掃除用 食品グレード",
                why_recommended: "安全で環境に優しい万能洗剤"
            }
        ];
    }
    
    // その他の必要メソッド（簡略版）
    showSelectionEffect(element) {
        console.log('✨ 選択エフェクト表示');
    }
    
    goToStep(stepNumber) {
        console.log(`📍 ステップ ${stepNumber} に移動`);
        // ステップ移動ロジック
    }
    
    disableExternalPlaceholders() {
        console.log('🔧 外部プレースホルダー無効化');
    }
    
    // その他のメソッドは省略
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 DOM読み込み完了 - AI掃除アドバイザー開始');
    
    try {
        const advisor = new StepWiseCleaningAdvisor();
        window.cleaningAdvisor = advisor; // グローバルアクセス用
        console.log('✅ AI掃除アドバイザー初期化完了');
    } catch (error) {
        console.error('❌ 初期化エラー:', error);
    }
});