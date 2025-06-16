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
            kitchen_gas_light: {
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
            
            // ガスコンロ軽い汚れ用商品
            kitchen_gas_light: {
                cleaners: [
                    {
                        title: "中性食器用洗剤",
                        category: "中性洗剤", 
                        price: "¥200-400",
                        description: "日常使い・五徳の漬け置き・ガスコンロ表面の清拭に最適",
                        amazon_search: "食器用洗剤 中性 キッチン用",
                        why_recommended: "五徳の漬け置きや天板の日常的な清拭に安全に使える"
                    },
                    {
                        title: "重曹（食品グレード）",
                        category: "自然派洗剤",
                        price: "¥300-600",
                        description: "自然派・環境に優しい・五徳の漬け置きに効果的",
                        amazon_search: "重曹 食品グレード 掃除用 キッチン",
                        why_recommended: "五徳の漬け置きや軽い焦げ付きを安全に除去"
                    },
                    {
                        title: "セスキ炭酸ソーダ",
                        category: "アルカリ性洗剤",
                        price: "¥400-700",
                        description: "油汚れに効果的・重曹より強力・環境配慮",
                        amazon_search: "セスキ炭酸ソーダ キッチン 油汚れ",
                        why_recommended: "重曹より強力で、軽い油汚れを効率的に除去"
                    }
                ],
                tools: [
                    {
                        title: "やわらかいスポンジ",
                        category: "清掃用具",
                        price: "¥200-400",
                        description: "傷をつけない・五徳の清掃に最適",
                        amazon_search: "やわらかいスポンジ キッチン用 傷つけない",
                        why_recommended: "ガスコンロ表面や五徳を傷つけずに清掃"
                    },
                    {
                        title: "歯ブラシ（掃除用）",
                        category: "細部清掃用具",
                        price: "¥100-300",
                        description: "五徳の細かい部分・バーナー周りの清掃",
                        amazon_search: "歯ブラシ 掃除用 キッチン用",
                        why_recommended: "五徳の細かい溝やバーナー周りの汚れを除去"
                    },
                    {
                        title: "マイクロファイバークロス",
                        category: "清拭用具",
                        price: "¥300-600",
                        description: "仕上げ拭き・水拭き・繰り返し使用可能",
                        amazon_search: "マイクロファイバークロス キッチン用",
                        why_recommended: "最後の仕上げ拭きで綺麗な仕上がりに"
                    }
                ],
                protection: [
                    {
                        title: "薄手ゴム手袋",
                        category: "保護具",
                        price: "¥200-400",
                        description: "軽作業用・細かい作業もしやすい",
                        amazon_search: "薄手ゴム手袋 キッチン用",
                        why_recommended: "軽い清掃作業時に手を保護しながら作業性も確保"
                    }
                ]
            },
            
            // ガスコンロ頑固汚れ用商品
            kitchen_gas_heavy: {
                cleaners: [
                    {
                        title: "油汚れ用マジックリン",
                        category: "アルカリ性洗剤",
                        price: "¥400-700",
                        description: "油汚れ専用・泡スプレー・強力除去",
                        amazon_search: "マジックリン 油汚れ用 キッチン ガスコンロ",
                        why_recommended: "頑固な油汚れを泡の力で浮かせて除去"
                    },
                    {
                        title: "ウルトラハードクリーナー 油汚れ用",
                        category: "強力洗剤",
                        price: "¥800-1500",
                        description: "業務用強力・頑固な焦げ付き・プロ仕様",
                        amazon_search: "ウルトラハードクリーナー 油汚れ ガスコンロ 業務用",
                        why_recommended: "プロも使う強力洗剤で頑固な焦げ付きも除去"
                    },
                    {
                        title: "オキシクリーン",
                        category: "酸素系漂白剤",
                        price: "¥500-1000",
                        description: "漬け置き洗い・五徳の頑固汚れ・除菌効果",
                        amazon_search: "オキシクリーン キッチン用 五徳 漬け置き",
                        why_recommended: "五徳の漬け置きで頑固な汚れを分解除去"
                    },
                    {
                        title: "茂木和哉 焦げ落とし",
                        category: "研磨剤入り洗剤",
                        price: "¥1000-1800",
                        description: "頑固な焦げ専用・研磨剤配合・プロ推奨",
                        amazon_search: "茂木和哉 焦げ落とし ガスコンロ",
                        why_recommended: "研磨剤配合で頑固な焦げも確実に除去"
                    }
                ],
                tools: [
                    {
                        title: "金属たわし（ステンレス）",
                        category: "研磨用具",
                        price: "¥300-600",
                        description: "頑固な焦げ除去・五徳専用・強力研磨",
                        amazon_search: "金属たわし ステンレス 五徳 焦げ落とし",
                        why_recommended: "五徳の頑固な焦げを物理的に削り落とす"
                    },
                    {
                        title: "スクレーパー（金属製）",
                        category: "削り取り用具",
                        price: "¥500-1000",
                        description: "こびりつき除去・平面の焦げ・プロ仕様",
                        amazon_search: "スクレーパー 金属製 ガスコンロ 焦げ落とし",
                        why_recommended: "天板の頑固な焦げ付きを効率的に削り取る"
                    },
                    {
                        title: "激落ちくん（メラミンスポンジ）",
                        category: "研磨スポンジ",
                        price: "¥300-600",
                        description: "水だけで落とす・細かい汚れ・仕上げ用",
                        amazon_search: "激落ちくん メラミンスポンジ キッチン用",
                        why_recommended: "洗剤を使わずに細かい汚れを除去"
                    },
                    {
                        title: "真鍮ブラシ",
                        category: "特殊ブラシ",
                        price: "¥400-800",
                        description: "バーナー部分・細部清掃・詰まり除去",
                        amazon_search: "真鍮ブラシ ガスコンロ バーナー 掃除",
                        why_recommended: "バーナーの目詰まりを安全に除去"
                    }
                ],
                protection: [
                    {
                        title: "厚手ゴム手袋（耐薬品）",
                        category: "保護具",
                        price: "¥500-1000",
                        description: "強力洗剤対応・長時間作業・手首まで保護",
                        amazon_search: "厚手ゴム手袋 耐薬品 強力洗剤対応",
                        why_recommended: "強力洗剤使用時も手を完全に保護"
                    },
                    {
                        title: "保護メガネ",
                        category: "保護具",
                        price: "¥800-1500",
                        description: "飛沫防止・強力洗剤使用時・目の保護",
                        amazon_search: "保護メガネ 掃除用 飛沫防止",
                        why_recommended: "強力洗剤の飛沫から目を保護"
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
            
            // 窓ガラス軽い汚れ用
            window_glass_light: {
                cleaners: [
                    {
                        title: "ガラスマジックリン",
                        category: "ガラス用洗剤",
                        price: "¥300-500",
                        description: "ガラス専用・拭き跡なし・速乾性",
                        amazon_search: "ガラスマジックリン 窓用",
                        why_recommended: "拭き跡を残さずガラスをピカピカに"
                    },
                    {
                        title: "エタノール（アルコール）",
                        category: "自然派洗剤",
                        price: "¥400-700",
                        description: "速乾性・除菌効果・安全",
                        amazon_search: "エタノール ガラス掃除用",
                        why_recommended: "速乾性で拭き跡が残らず除菌効果も"
                    }
                ],
                tools: [
                    {
                        title: "マイクロファイバークロス",
                        category: "清拭用具",
                        price: "¥300-600",
                        description: "ガラス専用・繊維残りなし",
                        amazon_search: "マイクロファイバー 窓ガラス用",
                        why_recommended: "繊維を残さずガラスを綺麗に拭き上げ"
                    },
                    {
                        title: "スクイージー",
                        category: "清掃用具",
                        price: "¥500-1000",
                        description: "水切り・プロ仕様・効率的",
                        amazon_search: "スクイージー 窓掃除用",
                        why_recommended: "プロのような仕上がりで効率的に清掃"
                    }
                ]
            },
            
            // フローリング軽い汚れ用
            floor_wood_light: {
                cleaners: [
                    {
                        title: "フローリング用ワイパー",
                        category: "床用洗剤",
                        price: "¥400-700",
                        description: "ワックス効果・艶出し・保護",
                        amazon_search: "フローリングワイパー ワックス効果",
                        why_recommended: "掃除と同時にワックス効果で床を保護"
                    },
                    {
                        title: "中性フローリング洗剤",
                        category: "中性洗剤",
                        price: "¥300-600",
                        description: "木材に優しい・日常清掃用",
                        amazon_search: "フローリング洗剤 中性",
                        why_recommended: "木材を傷めずに日常の汚れを除去"
                    }
                ],
                tools: [
                    {
                        title: "フローリングワイパー",
                        category: "清掃用具",
                        price: "¥1000-2000",
                        description: "伸縮式・軽量・疲れにくい",
                        amazon_search: "フローリングワイパー 本体",
                        why_recommended: "立ったまま楽に床掃除が可能"
                    },
                    {
                        title: "フローリング用モップ",
                        category: "モップ",
                        price: "¥800-1500",
                        description: "マイクロファイバー・洗える",
                        amazon_search: "フローリングモップ マイクロファイバー",
                        why_recommended: "繊維が細かい汚れまでキャッチ"
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
        for (let i = 1; i <= 5; i++) {
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
    
    handleImageSelection(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📷 画像選択:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('previewImg');
            if (img) {
                img.src = e.target.result;
            }
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.classList.remove('hidden');
            }
            const analyzeBtn = document.getElementById('analyzeWithPhoto');
            if (analyzeBtn) {
                analyzeBtn.classList.remove('hidden');
            }
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
        this.goToStep(5);
        
        // ローディング表示
        const analysisLoading = document.getElementById('analysisLoading');
        if (analysisLoading) {
            analysisLoading.classList.remove('hidden');
        }
        const analysisResult = document.getElementById('analysisResult');
        if (analysisResult) {
            analysisResult.classList.add('hidden');
        }
        
        try {
            // 分析実行
            const result = await this.performAnalysis(withPhoto);
            
            // 結果表示
            this.displayResult(result);
            
        } catch (error) {
            console.error('❌ 分析エラー:', error);
            this.displayError(error);
        } finally {
            if (analysisLoading) {
                analysisLoading.classList.add('hidden');
            }
        }
    }
    
    async performAnalysis(withPhoto) {
        console.log('🤖 AI分析実行中...');
        
        // 基本的な分析ロジック
        const locationInfo = this.getLocationInfo(this.selectedLocation);
        const levelInfo = this.getLevelInfo(this.selectedLevel);
        const sublocationInfo = this.getSublocationInfo(this.selectedSublocation);
        
        // 掃除方法を生成
        const cleaningMethod = this.generateCleaningMethod(locationInfo, levelInfo, sublocationInfo);
        
        // おすすめ商品を取得
        const products = this.getLocationSpecificCleaners(this.selectedLocation, this.selectedLevel, this.selectedSublocation);
        
        // 写真分析（もしあれば）
        let imageAnalysis = null;
        if (withPhoto && this.selectedImage) {
            imageAnalysis = await this.analyzeImage(this.selectedImage);
        }
        
        return {
            location: locationInfo,
            level: levelInfo,
            sublocation: sublocationInfo,
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
            1: { name: '軽い汚れ', intensity: 1, icon: '✨' },
            2: { name: '頑固な汚れ', intensity: 2, icon: '🚨' },
            light: { name: '軽い汚れ', intensity: 1, icon: '✨' },
            heavy: { name: '頑固な汚れ', intensity: 2, icon: '🚨' }
        };
        
        return levelMap[level] || levelMap[1];
    }
    
    getSublocationInfo(sublocation) {
        if (!sublocation) return null;
        
        const sublocationMap = {
            // キッチン
            kitchen_sink: { name: 'シンク', icon: '🚰' },
            kitchen_gas: { name: 'ガスコンロ', icon: '🔥' },
            kitchen_ih: { name: 'IHコンロ', icon: '⚡' },
            kitchen_vent: { name: '換気扇', icon: '💨' },
            kitchen_cabinet: { name: '食器棚', icon: '🗄️' },
            
            // 浴室
            bathroom_tub: { name: '浴槽', icon: '🛁' },
            bathroom_walls: { name: '壁・天井', icon: '🧱' },
            bathroom_floor: { name: '床', icon: '🏠' },
            bathroom_drain: { name: '排水口', icon: '🕳️' },
            bathroom_mirror: { name: '鏡・洗面', icon: '🪞' },
            
            // トイレ
            toilet_bowl: { name: '便器内', icon: '🚽' },
            toilet_seat: { name: '便座・蓋', icon: '🪑' },
            toilet_floor_wall: { name: '床・壁', icon: '🧱' },
            toilet_tank: { name: 'タンク', icon: '💧' },
            toilet_washbasin: { name: '手洗い', icon: '🚰' },
            
            // リビング
            living_sofa: { name: 'ソファ', icon: '🛋️' },
            living_carpet: { name: '絨毯', icon: '🏠' },
            living_flooring: { name: 'フローリング', icon: '🏠' },
            living_furniture: { name: '家具', icon: '🪑' },
            living_tv: { name: 'TV台', icon: '📺' }
        };
        
        return sublocationMap[sublocation] || { name: sublocation, icon: '🏠' };
    }
    
    generateCleaningMethod(location, sublocation, level) {
        const locationKey = location || this.selectedLocation;
        const sublocationKey = sublocation || this.selectedSublocation;
        const levelKey = level || this.selectedLevel;
        
        const methods = {
            // キッチン系
            kitchen_sink: {
                1: {
                    steps: [
                        {
                            title: "前準備",
                            description: "食器や調理器具を移動し、シンク周りを整理します",
                            tips: "作業スペースを確保することで効率的に清掃できます"
                        },
                        {
                            title: "水垢除去",
                            description: "クエン酸を水に溶かしてスプレーし、5-10分放置します",
                            tips: "クエン酸の濃度は5%程度が適切です"
                        },
                        {
                            title: "軽く擦り洗い",
                            description: "スポンジで優しく擦り、水で洗い流します",
                            tips: "傷つけないよう柔らかいスポンジを使用"
                        },
                        {
                            title: "仕上げ",
                            description: "マイクロファイバークロスで水気を拭き取り完了",
                            tips: "水滴を残すと新たな水垢の原因になります"
                        }
                    ],
                    warning: "クエン酸は酸性のため、大理石などには使用しないでください"
                },
                2: {
                    steps: [
                        {
                            title: "前準備・保護",
                            description: "手袋を着用し、換気を十分に行います",
                            tips: "強力洗剤使用時は必ず保護具を着用"
                        },
                        {
                            title: "強力洗剤適用",
                            description: "業務用水垢除去剤を塗布し、15-20分つけ置きします",
                            tips: "頑固な汚れには時間をかけて化学反応を待つ"
                        },
                        {
                            title: "研磨作業",
                            description: "研磨パッドで頑固な汚れを物理的に除去します",
                            tips: "力を入れすぎず、円を描くように研磨"
                        },
                        {
                            title: "徹底洗浄",
                            description: "大量の水で洗剤をしっかり洗い流します",
                            tips: "洗剤残りは変色や腐食の原因になります"
                        },
                        {
                            title: "最終仕上げ",
                            description: "乾いたクロスで水気を拭き取り、艶出し剤で仕上げ",
                            tips: "艶出し剤は汚れ防止効果もあります"
                        }
                    ],
                    warning: "強力な酸性洗剤使用時は必ず手袋・マスクを着用し、十分な換気を行ってください"
                }
            },
            kitchen_gas: {
                1: {
                    steps: [
                        {
                            title: "安全確認",
                            description: "ガスの元栓を閉め、コンロが完全に冷めていることを確認",
                            tips: "安全第一、火傷に注意してください"
                        },
                        {
                            title: "五徳取り外し",
                            description: "五徳とバーナーキャップを取り外します",
                            tips: "部品の配置を覚えておくと組み立てが楽です"
                        },
                        {
                            title: "漬け置き洗い",
                            description: "五徳を重曹水に30分漬け置きします",
                            tips: "40℃程度のぬるま湯を使うと効果的"
                        },
                        {
                            title: "本体清拭",
                            description: "天板を中性洗剤で拭き、水拭きで仕上げます",
                            tips: "電気部分に水がかからないよう注意"
                        },
                        {
                            title: "組み立て",
                            description: "乾燥させた部品を元の位置に戻します",
                            tips: "完全に乾燥してから組み立ててください"
                        }
                    ],
                    warning: "必ずガスの元栓を閉めてから作業を開始してください"
                },
                2: {
                    steps: [
                        {
                            title: "安全準備",
                            description: "ガス栓を閉め、手袋・保護眼鏡を着用します",
                            tips: "強力洗剤の飛沫から目と手を保護"
                        },
                        {
                            title: "分解作業",
                            description: "五徳、バーナーキャップ、点火プラグカバーを全て外します",
                            tips: "写真を撮っておくと組み立て時に便利"
                        },
                        {
                            title: "強力洗剤処理",
                            description: "油汚れ専用洗剤で全体を覆い、30分放置します",
                            tips: "焦げ付きがひどい場合は1時間程度つけ置き"
                        },
                        {
                            title: "物理的除去",
                            description: "金属たわしやスクレーパーで焦げを削り落とします",
                            tips: "傷つけない程度の力で根気よく作業"
                        },
                        {
                            title: "詳細清掃",
                            description: "歯ブラシでバーナーの目詰まりを除去します",
                            tips: "目詰まりは不完全燃焼の原因になります"
                        },
                        {
                            title: "最終仕上げ",
                            description: "全体を水洗いし、完全に乾燥させてから組み立て",
                            tips: "水気が残ると錆の原因になります"
                        }
                    ],
                    warning: "強力洗剤使用時は換気を十分に行い、皮膚や目への接触を避けてください"
                }
            },
            kitchen_ih: {
                1: {
                    steps: [
                        {
                            title: "電源確認",
                            description: "IHの電源を切り、天板が冷めていることを確認",
                            tips: "高温時の清掃は火傷の危険があります"
                        },
                        {
                            title: "専用洗剤適用",
                            description: "IH専用クリーナーを天板全体に塗布します",
                            tips: "IH専用洗剤は天板を傷めません"
                        },
                        {
                            title: "汚れ浮上待機",
                            description: "5-10分放置して汚れを浮き上がらせます",
                            tips: "時間を置くことで軽い力で汚れが落ちます"
                        },
                        {
                            title: "優しく清拭",
                            description: "セラミック用クロスで円を描くように拭き取ります",
                            tips: "直線的に拭くと傷が目立ちやすくなります"
                        },
                        {
                            title: "最終仕上げ",
                            description: "乾いたクロスで仕上げ拭きを行います",
                            tips: "水滴跡を残さないよう丁寧に"
                        }
                    ],
                    warning: "天板に傷をつけないよう、必ずIH専用の清掃用具を使用してください"
                },
                2: {
                    steps: [
                        {
                            title: "安全確認",
                            description: "電源を切り、コンセントも抜いて安全を確保",
                            tips: "水を使う作業前は必ず電源を遮断"
                        },
                        {
                            title: "強力洗剤適用",
                            description: "IH用強力クリーナーを焦げ部分に厚く塗布",
                            tips: "焦げ付きが厚い場合は洗剤も厚めに"
                        },
                        {
                            title: "長時間放置",
                            description: "ラップで覆い、30-60分しっかりつけ置きします",
                            tips: "ラップで密封すると洗剤の効果が高まります"
                        },
                        {
                            title: "専用スクレーパー作業",
                            description: "IH専用スクレーパーで焦げを丁寧に削り取ります",
                            tips: "45度の角度で一方向に削るのがコツ"
                        },
                        {
                            title: "研磨処理",
                            description: "IH用研磨パッドで細かい傷と汚れを除去",
                            tips: "軽い力で円を描くように研磨"
                        },
                        {
                            title: "復活処理",
                            description: "IH復活剤で天板の光沢を回復させます",
                            tips: "復活剤は保護膜も形成します"
                        }
                    ],
                    warning: "IH天板は傷つきやすいため、必ずIH専用の工具・洗剤を使用してください"
                }
            },
            // 浴室系
            bathroom_floor: {
                1: {
                    steps: [
                        {
                            icon: "🧹",
                            title: "前準備と安全確認",
                            description: "床の物を全て移動し、換気扇を回して十分な換気を確保します。滑り止めマットを敷くか、滑りにくい靴を履いて安全を確保してください。",
                            tips: "事前に大まかな汚れを落としておくと、後の作業が大幅に楽になります"
                        },
                        {
                            icon: "💧",
                            title: "予備洗浄",
                            description: "40℃程度のぬるま湯で床全体を洗い流し、髪の毛やゴミなどの大きな汚れを除去します。排水口の詰まりも確認してください。",
                            tips: "お湯を使うことで皮脂汚れが落ちやすくなり、洗剤の効果も高まります"
                        },
                        {
                            icon: "🧴",
                            title: "洗剤適用と浸透",
                            description: "浴室用中性洗剤を床全体にスプレーし、特に汚れが目立つ部分には重点的に塗布します。5-10分放置して汚れを浮き上がらせます。",
                            tips: "洗剤は隅々まで均等に行き渡らせ、目地の奥まで浸透させることが重要です"
                        },
                        {
                            icon: "🪥",
                            title: "ブラッシング作業",
                            description: "柔らかいブラシで目地に沿って丁寧に擦り洗いします。円を描くような動きで汚れを浮かせ、直線的な動きで掻き出します。",
                            tips: "力を入れすぎると床材を傷める可能性があるため、適度な力加減で根気よく作業してください"
                        },
                        {
                            icon: "🚿",
                            title: "徹底洗浄",
                            description: "シャワーの強めの水圧で洗剤と浮いた汚れを完全に洗い流します。目地の奥に洗剤が残らないよう、十分な時間をかけて流してください。",
                            tips: "洗剤残りはぬめりや変色の原因になるため、最低2回は全体を洗い流しましょう"
                        },
                        {
                            icon: "🧽",
                            title: "水切りと乾燥",
                            description: "スクイージーやモップで床の水を排水口に導き、マイクロファイバークロスで仕上げ拭きを行います。可能であれば窓を開けて自然乾燥させてください。",
                            tips: "水滴を残すと新たなカビの原因になるため、隅々まで水気を取り除くことが重要です"
                        }
                    ],
                    warning: "濡れた床は非常に滑りやすいため、転倒防止対策を必ず講じてください"
                },
                2: {
                    steps: [
                        {
                            icon: "🛡️",
                            title: "完全防護と環境準備",
                            description: "耐薬品手袋、N95マスク、保護眼鏡を着用し、換気扇を最強にして窓も開放します。家族やペットを別の部屋に移動させ、作業エリアを完全に隔離してください。",
                            tips: "強力洗剤は皮膚や呼吸器に重篤な影響を与える可能性があるため、防護を怠らないでください"
                        },
                        {
                            icon: "🧪",
                            title: "強力カビ取り剤の戦略的適用",
                            description: "業務用カビ取り剤を床全体、特に目地部分に集中的に塗布します。スプレーボトルとハケを併用し、洗剤が確実に浸透するよう厚めに塗ってください。",
                            tips: "目地の奥深くまで洗剤が浸透するよう、ハケで押し込むように塗布するのがプロの技術です"
                        },
                        {
                            icon: "⏰",
                            title: "長時間化学反応待機",
                            description: "30分から最大2時間、洗剤を完全に浸透させます。この間、室内に立ち入らず、定期的に換気状況を確認してください。",
                            tips: "頑固なカビには時間をかけて化学的に分解させることが、物理的な力による除去よりも効果的です"
                        },
                        {
                            icon: "🔧",
                            title: "専門工具による物理除去",
                            description: "硬毛ブラシ、目地専用ブラシ、スクレーパーを使い分けて、浮き上がったカビを徹底的に除去します。特に頑固な部分は工業用スチームクリーナーも有効です。",
                            tips: "古い歯ブラシや使い古しのクレジットカードも、細かい部分の清掃に意外なほど有効な道具です"
                        },
                        {
                            icon: "💦",
                            title: "高圧・大量洗浄",
                            description: "シャワーを最強水圧に設定し、全体を最低15分間かけて洗い流します。洗剤とカビの残骸を完全に除去し、化学物質を一切残さないよう徹底してください。",
                            tips: "洗剤が残ると後に変色や腐食の原因となるため、「流しすぎ」ということはありません"
                        },
                        {
                            icon: "🌿",
                            title: "予防的アフターケア",
                            description: "完全に乾燥させた後、防カビ・抗菌スプレーを全体に適用し、今後のカビ発生を予防します。月1回の定期的な防カビ処理スケジュールも立てましょう。",
                            tips: "定期的な防カビ処理により、今回のような大掃除の頻度を大幅に減らすことができます"
                        }
                    ],
                    warning: "塩素系洗剤使用時は絶対に酸性洗剤と混ぜないでください。有毒な塩素ガスが発生し、生命に危険が及ぶ可能性があります。また、作業中は絶対に一人にならず、緊急時の連絡手段を確保してください。"
                }
            }
        };
        
        // デフォルトメソッド
        const defaultMethod = {
            steps: [
                {
                    title: "基本清掃",
                    description: "適切な洗剤を使用して汚れを除去します",
                    tips: "場所に応じた専用洗剤を使用することをお勧めします"
                },
                {
                    title: "すすぎ・仕上げ",
                    description: "きれいな水で洗い流し、乾いた布で仕上げます",
                    tips: "洗剤を残さないようしっかりとすすぎましょう"
                }
            ],
            warning: "清掃時は換気を行い、適切な保護具を着用してください"
        };
        
        const locationMethods = methods[sublocationKey];
        if (locationMethods && locationMethods[levelKey]) {
            return locationMethods[levelKey];
        }
        
        return defaultMethod;
    }
    
    // 拡張商品データベースを追加
    getExtendedProductDatabase() {
        return {
            // 浴室床軽い汚れ用
            bathroom_floor_light: {
                cleaners: [
                    {
                        title: "バスマジックリン 泡立ちスプレー",
                        category: "浴室用洗剤",
                        price: "¥350-600",
                        description: "泡が汚れに密着・除菌効果・日常清掃に最適",
                        amazon_search: "バスマジックリン 泡立ち 浴室床",
                        why_recommended: "浴室の日常清掃に最適で、泡が汚れをしっかり浮かせます",
                        professional: false
                    },
                    {
                        title: "スクラビングバブル バス用",
                        category: "浴室用洗剤",
                        price: "¥400-700",
                        description: "強力泡洗浄・カビ予防・香り付き",
                        amazon_search: "スクラビングバブル バス用 床",
                        why_recommended: "強力な泡で汚れを分解し、カビの発生も予防します",
                        professional: false
                    },
                    {
                        title: "ウタマロクリーナー",
                        category: "中性洗剤",
                        price: "¥300-500",
                        description: "中性・肌に優しい・環境配慮・万能クリーナー",
                        amazon_search: "ウタマロクリーナー 浴室",
                        why_recommended: "肌に優しく安全性が高いため、安心して使用できます",
                        professional: false
                    },
                    {
                        title: "重曹クリーナー（天然成分）",
                        category: "自然派洗剤",
                        price: "¥250-450",
                        description: "天然成分100%・環境に優しい・研磨効果",
                        amazon_search: "重曹クリーナー 天然成分 浴室",
                        why_recommended: "天然成分で安全、軽い研磨効果で汚れをやさしく除去",
                        professional: false
                    },
                    {
                        title: "セスキ炭酸ソーダクリーナー",
                        category: "アルカリ性洗剤",
                        price: "¥300-550",
                        description: "皮脂汚れに効果的・重曹より強力・環境配慮",
                        amazon_search: "セスキ炭酸ソーダ 浴室用",
                        why_recommended: "皮脂汚れに特に効果的で、重曹より強力な洗浄力",
                        professional: false
                    }
                ],
                tools: [
                    {
                        title: "バススポンジ（抗菌加工）",
                        category: "スポンジ",
                        price: "¥200-400",
                        description: "抗菌加工・目地対応・持ちやすい形状",
                        amazon_search: "バススポンジ 抗菌 目地",
                        why_recommended: "抗菌加工で衛生的、目地の掃除にも最適な形状",
                        professional: false
                    },
                    {
                        title: "浴室用デッキブラシ",
                        category: "ブラシ",
                        price: "¥800-1500",
                        description: "長柄・広範囲清掃・腰への負担軽減",
                        amazon_search: "浴室用デッキブラシ 長柄",
                        why_recommended: "立ったまま床全体を効率的に清掃でき、腰への負担を軽減",
                        professional: false
                    },
                    {
                        title: "目地用ブラシ（細毛）",
                        category: "専用ブラシ",
                        price: "¥300-600",
                        description: "目地専用・細かい毛・深部まで届く",
                        amazon_search: "目地用ブラシ 細毛 浴室",
                        why_recommended: "目地の奥深くまで届く細かい毛で、隅々まで清掃可能",
                        professional: false
                    },
                    {
                        title: "マイクロファイバーモップ",
                        category: "モップ",
                        price: "¥600-1200",
                        description: "超吸水・繰り返し使用可・静電気除去",
                        amazon_search: "マイクロファイバーモップ 浴室用",
                        why_recommended: "超吸水性で水切り効果が高く、静電気も除去します",
                        professional: false
                    }
                ],
                protection: [
                    {
                        title: "滑り止め付きゴム手袋",
                        category: "手袋",
                        price: "¥300-600",
                        description: "滑り止め加工・水仕事対応・フィット感良好",
                        amazon_search: "滑り止め ゴム手袋 浴室用",
                        why_recommended: "濡れた状態でもしっかりグリップでき、安全に作業できます",
                        professional: false
                    },
                    {
                        title: "ひざ当てパッド",
                        category: "保護具",
                        price: "¥500-1000",
                        description: "膝保護・滑り止め・長時間作業対応",
                        amazon_search: "ひざ当てパッド 掃除用",
                        why_recommended: "床掃除時の膝への負担を軽減し、快適に作業できます",
                        professional: false
                    },
                    {
                        title: "防水エプロン",
                        category: "保護具",
                        price: "¥800-1500",
                        description: "防水・調節可能・長時間作業対応",
                        amazon_search: "防水エプロン 掃除用",
                        why_recommended: "水しぶきから衣服を守り、清潔に作業できます",
                        professional: false
                    },
                    {
                        title: "滑り止めシューズ",
                        category: "安全靴",
                        price: "¥1200-2500",
                        description: "浴室対応・滑り止めソール・速乾性",
                        amazon_search: "滑り止めシューズ 浴室用",
                        why_recommended: "濡れた浴室でも安全に歩行でき、転倒事故を防止します",
                        professional: false
                    },
                    {
                        title: "換気マスク（防湿）",
                        category: "マスク",
                        price: "¥400-800",
                        description: "防湿・通気性良好・長時間着用可能",
                        amazon_search: "防湿マスク 浴室清掃用",
                        why_recommended: "湿度の高い浴室でも快適に呼吸でき、長時間の作業に対応",
                        professional: false
                    }
                ]
            },
            
            // 浴室床頑固汚れ用
            bathroom_floor_heavy: {
                cleaners: [
                    {
                        title: "カビキラー 強力ジェル",
                        category: "強力洗剤",
                        price: "¥600-1000",
                        description: "ジェルタイプ・密着力強・頑固カビ対応",
                        amazon_search: "カビキラー 強力ジェル 目地",
                        why_recommended: "ジェル状で垂れにくく、頑固なカビにしっかり密着して除去",
                        professional: true
                    },
                    {
                        title: "業務用カビ取りクリーナー",
                        category: "業務用洗剤",
                        price: "¥1200-2000",
                        description: "プロ仕様・超強力・業務用濃度",
                        amazon_search: "業務用カビ取り 浴室 プロ仕様",
                        why_recommended: "プロも使用する強力洗剤で、最も頑固なカビも確実に除去",
                        professional: true
                    },
                    {
                        title: "茂木和哉 バスタブ用",
                        category: "研磨剤入り洗剤",
                        price: "¥1500-2500",
                        description: "研磨剤配合・水垢対応・プロ推奨",
                        amazon_search: "茂木和哉 バスタブ用 研磨",
                        why_recommended: "研磨剤配合で頑固な水垢と汚れを物理的・化学的に除去",
                        professional: true
                    },
                    {
                        title: "ハイター 泡ハイター",
                        category: "塩素系洗剤",
                        price: "¥400-700",
                        description: "塩素系・除菌効果・漂白作用",
                        amazon_search: "ハイター 泡ハイター 浴室",
                        why_recommended: "強力な除菌・漂白効果で、カビと雑菌を根こそぎ除去",
                        professional: false
                    },
                    {
                        title: "オキシクリーン（酸素系漂白剤）",
                        category: "酸素系漂白剤",
                        price: "¥800-1500",
                        description: "酸素系・つけ置き対応・環境配慮",
                        amazon_search: "オキシクリーン 浴室用 酸素系",
                        why_recommended: "つけ置きで頑固な汚れを分解し、環境にも優しい漂白剤",
                        professional: false
                    }
                ],
                tools: [
                    {
                        title: "硬毛ブラシ（業務用）",
                        category: "業務用ブラシ",
                        price: "¥800-1500",
                        description: "硬い毛・頑固汚れ対応・プロ仕様",
                        amazon_search: "硬毛ブラシ 業務用 浴室",
                        why_recommended: "プロ仕様の硬毛で、最も頑固な汚れも物理的に除去可能",
                        professional: true
                    },
                    {
                        title: "スクレーパー（金属製）",
                        category: "削り取り用具",
                        price: "¥600-1200",
                        description: "金属製・こびりつき除去・角度調整可能",
                        amazon_search: "金属スクレーパー 浴室用",
                        why_recommended: "こびりついた汚れを物理的に削り取る、最終手段の強力ツール",
                        professional: true
                    },
                    {
                        title: "電動ブラシ",
                        category: "電動工具",
                        price: "¥2000-4000",
                        description: "電動・高速回転・省力化",
                        amazon_search: "電動ブラシ 浴室掃除用",
                        why_recommended: "電動の力で労力を大幅削減し、効率的に頑固汚れを除去",
                        professional: true
                    },
                    {
                        title: "高圧洗浄機（小型）",
                        category: "洗浄機器",
                        price: "¥8000-15000",
                        description: "高圧水流・洗剤混合可能・家庭用",
                        amazon_search: "高圧洗浄機 小型 浴室用",
                        why_recommended: "高圧水流で洗剤と汚れを一気に洗い流す、最強の洗浄力",
                        professional: true
                    }
                ],
                protection: [
                    {
                        title: "耐薬品手袋（厚手）",
                        category: "特殊手袋",
                        price: "¥800-1500",
                        description: "耐薬品・厚手・長時間対応・肘まで保護",
                        amazon_search: "耐薬品手袋 厚手 強力洗剤対応",
                        why_recommended: "強力洗剤から手を完全保護し、長時間の作業も安心",
                        professional: true
                    },
                    {
                        title: "防毒マスク（有機溶剤対応）",
                        category: "防毒マスク",
                        price: "¥2000-4000",
                        description: "有機溶剤対応・交換フィルター・長時間使用可",
                        amazon_search: "防毒マスク 有機溶剤 強力洗剤",
                        why_recommended: "強力洗剤の有害ガスから呼吸器を完全保護",
                        professional: true
                    },
                    {
                        title: "保護眼鏡（密閉型）",
                        category: "保護眼鏡",
                        price: "¥1000-2000",
                        description: "密閉型・飛沫完全防止・曇り止め",
                        amazon_search: "保護眼鏡 密閉型 強力洗剤用",
                        why_recommended: "洗剤の飛沫から目を完全保護し、視界もクリアに保持",
                        professional: true
                    },
                    {
                        title: "全身防護服（使い捨て）",
                        category: "防護服",
                        price: "¥500-1000",
                        description: "使い捨て・全身保護・通気性確保",
                        amazon_search: "防護服 使い捨て 清掃用",
                        why_recommended: "強力洗剤から全身を保護し、作業後は廃棄で衛生的",
                        professional: true
                    },
                    {
                        title: "安全長靴（耐薬品）",
                        category: "安全靴",
                        price: "¥1500-3000",
                        description: "耐薬品・滑り止め・長時間立ち作業対応",
                        amazon_search: "安全長靴 耐薬品 滑り止め",
                        why_recommended: "足元の安全と薬品からの保護を両立した専門靴",
                        professional: true
                    }
                ]
            }
        };
    }
    
    async analyzeImage(imageData) {
        try {
            console.log('🤖 AI画像分析開始...');
            // 実際のAI分析ロジックをここに実装
            // 現在は簡単なダミー応答を返す
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
            
            return {
                detected: true,
                dirtType: '油汚れ',
                severity: 'medium',
                confidence: 0.85,
                recommendations: [
                    '油汚れが検出されました',
                    'アルカリ性洗剤の使用をお勧めします',
                    '温水での洗浄が効果的です'
                ]
            };
        } catch (error) {
            console.error('❌ 画像分析エラー:', error);
            return null;
        }
    }
    
    displayResult(result) {
        console.log('📊 結果表示:', result);
        
        // ローディングを非表示
        const loading = document.getElementById('analysisLoading');
        if (loading) {
            loading.classList.add('hidden');
        }
        
        // 結果表示エリアを表示
        const analysisResult = document.getElementById('analysisResult');
        if (analysisResult) {
            analysisResult.classList.remove('hidden');
        }
        
        // 掃除方法を表示
        this.displayCleaningMethod(result);
        
        // おすすめ商品を表示
        this.displayRecommendedProducts(result);
    }
    
    displayCleaningMethod(result) {
        const cleaningMethodDiv = document.getElementById('cleaningMethod');
        if (!cleaningMethodDiv) return;
        
        const location = this.getLocationInfo(this.selectedLocation);
        const sublocation = this.getSublocationInfo(this.selectedSublocation);
        const level = this.getLevelInfo(this.selectedLevel);
        
        const method = this.generateCleaningMethod(this.selectedLocation, this.selectedSublocation, this.selectedLevel);
        
        cleaningMethodDiv.innerHTML = `
            <div class="cleaning-method-content">
                <div class="mb-4">
                    <h4 class="font-semibold text-lg mb-2">📍 対象場所</h4>
                    <p class="text-gray-700">${location.name} → ${sublocation.name}</p>
                    <p class="text-sm text-gray-600">${sublocation.description}</p>
                </div>
                <div class="mb-4">
                    <h4 class="font-semibold text-lg mb-2">🎯 汚れレベル</h4>
                    <p class="text-gray-700">${level.name}</p>
                    <p class="text-sm text-gray-600">${level.description}</p>
                </div>
                <div class="mb-4">
                    <h4 class="font-semibold text-lg mb-2">🧽 推奨手順</h4>
                    <div class="cleaning-steps">
                        ${method.steps.map((step, index) => `
                            <div class="step-item mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400 hover:shadow-md transition-all duration-300">
                                <div class="flex items-start">
                                    <div class="step-number-container flex-shrink-0 mr-4">
                                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transform hover:scale-105 transition-transform">
                                            ${index + 1}
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <h5 class="font-bold text-gray-800 text-base mb-2 flex items-center">
                                            ${step.icon || '🧽'} ${step.title}
                                        </h5>
                                        <p class="text-gray-700 mb-3 leading-relaxed">${step.description}</p>
                                        ${step.tips ? `
                                            <div class="bg-blue-100 border border-blue-200 rounded-lg p-3">
                                                <p class="text-blue-800 text-sm font-medium flex items-start">
                                                    <span class="mr-2">💡</span>
                                                    <span><strong>プロのコツ:</strong> ${step.tips}</span>
                                                </p>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${method.warning ? `
                    <div class="warning-box bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 class="font-semibold text-yellow-800 mb-2">⚠️ 注意事項</h4>
                        <p class="text-yellow-700">${method.warning}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    displayRecommendedProducts(result) {
        const productsDiv = document.getElementById('recommendedProducts');
        if (!productsDiv) return;
        
        // 商品データベースから商品を取得
        const productDatabase = this.getComprehensiveProductDatabase();
        const extendedDatabase = this.getExtendedProductDatabase();
        const locationKey = this.selectedSublocation || this.selectedLocation;
        const levelSuffix = this.selectedLevel === 1 ? '_light' : '_heavy';
        const fullKey = locationKey + levelSuffix;
        
        // 拡張データベースを優先して確認
        let productData = extendedDatabase[fullKey] || productDatabase[fullKey];
        
        if (!productData) {
            productsDiv.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-500">
                    <p>この場所・汚れレベルの商品情報を準備中です。</p>
                    <p class="text-sm mt-2">一般的な住宅用洗剤をお試しください。</p>
                </div>
            `;
            return;
        }
        
        // カテゴリ別表示
        let html = '';
        
        // 洗剤カテゴリ（5種類以上）
        if (productData.cleaners && productData.cleaners.length > 0) {
            html += `
                <div class="col-span-full mb-6">
                    <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        🧴 洗剤・クリーナー（${productData.cleaners.length}種類）
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${productData.cleaners.map(product => this.generateProductCard(product)).join('')}
                    </div>
                </div>
            `;
        }
        
        // 道具・ブラシカテゴリ（4種類以上）
        if (productData.tools && productData.tools.length > 0) {
            html += `
                <div class="col-span-full mb-6">
                    <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        🧽 清掃道具・ブラシ（${productData.tools.length}種類）
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${productData.tools.map(product => this.generateProductCard(product)).join('')}
                    </div>
                </div>
            `;
        }
        
        // 保護具カテゴリ（5種類以上）
        if (productData.protection && productData.protection.length > 0) {
            html += `
                <div class="col-span-full mb-6">
                    <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        🛡️ 保護具・安全用品（${productData.protection.length}種類）
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${productData.protection.map(product => this.generateProductCard(product)).join('')}
                    </div>
                </div>
            `;
        }
        
        if (html === '') {
            html = `
                <div class="col-span-full text-center py-8 text-gray-500">
                    <p>商品情報を取得できませんでした。</p>
                    <p class="text-sm mt-2">一般的な住宅用洗剤をお試しください。</p>
                </div>
            `;
        }
        
        productsDiv.innerHTML = html;
        
        console.log(`✅ カテゴリ別商品を表示しました`);
    }
    
    generateProductCard(product) {
        return `
            <div class="product-card bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div class="product-header mb-3">
                    <h5 class="font-bold text-gray-800 text-sm mb-2">${product.title}</h5>
                    <div class="flex justify-between items-center mb-2">
                        <span class="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">${product.category}</span>
                        ${product.professional ? '<span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">プロ仕様</span>' : ''}
                    </div>
                </div>
                <div class="product-body mb-4">
                    <p class="text-gray-600 text-xs mb-3 leading-relaxed">${product.description}</p>
                    <p class="text-green-600 font-bold text-base">${product.price}</p>
                </div>
                <div class="product-footer">
                    <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                        <p class="text-blue-800 text-xs font-medium flex items-start">
                            <span class="mr-2">💡</span>
                            <span>${product.why_recommended}</span>
                        </p>
                    </div>
                    <button class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:scale-105" 
                            onclick="window.open('https://amazon.co.jp/s?k=${encodeURIComponent(product.amazon_search)}', '_blank')">
                        🛒 Amazonで検索
                    </button>
                </div>
            </div>
        `;
    }
    
    displayError(error) {
        console.error('❌ エラー表示:', error);
        // エラー表示の実装
        // TODO: エラー表示UIの実装
    }
    
    resetAnalysis() {
        console.log('🔄 分析リセット');
        
        // 選択状態をリセット
        this.selectedLocation = null;
        this.selectedSublocation = null;
        this.selectedLevel = null;
        this.selectedImage = null;
        
        // UI選択状態をリセット
        document.querySelectorAll('.choice-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 最初のステップに戻る
        this.goToStep(1);
    }
    
    shareResult() {
        console.log('📤 結果共有');
        // 結果共有の実装
        // TODO: 共有機能の実装
    }
    
    disableExternalPlaceholders() {
        console.log('🔧 外部プレースホルダー無効化');
    }
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