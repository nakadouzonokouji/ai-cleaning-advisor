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
    
    generateCleaningMethod(location, level, sublocation = null) {
        const methods = {
            kitchen: {
                1: '中性洗剤で軽く拭き取り、水で流してから乾いた布で仕上げ拭きをしてください。',
                2: '専用の強力洗剤を使用し、つけ置きしてからブラシでしっかりと擦り洗いしてください。'
            },
            bathroom: {
                1: 'バスクリーナーで軽く拭き取り、シャワーで洗い流してください。',
                2: '強力カビ取り剤で30分つけ置きし、ブラシとスポンジで徹底的に擦り洗いしてください。'
            },
            toilet: {
                1: 'トイレクリーナーで軽く拭き取り、仕上げに除菌シートで拭いてください。',
                2: '強力な酸性洗剤で30分つけ置きし、専用ブラシで念入りに擦り洗いしてください。'
            }
        };
        
        const locationMethods = methods[location.type] || methods.kitchen;
        return locationMethods[level.intensity] || locationMethods[1];
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
                            <div class="step-item mb-3 p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-start">
                                    <span class="step-number bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">${index + 1}</span>
                                    <div>
                                        <h5 class="font-medium text-gray-800">${step.title}</h5>
                                        <p class="text-gray-600 text-sm mt-1">${step.description}</p>
                                        ${step.tips ? `<p class="text-blue-600 text-sm mt-1">💡 ${step.tips}</p>` : ''}
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
        
        // 商品を取得
        const products = this.getLocationSpecificCleaners(
            this.selectedLocation, 
            this.selectedLevel, 
            this.selectedSublocation
        );
        
        if (products.length === 0) {
            productsDiv.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-500">
                    <p>商品情報を取得できませんでした。</p>
                    <p class="text-sm mt-2">一般的な住宅用洗剤をお試しください。</p>
                </div>
            `;
            return;
        }
        
        // 商品カードを生成
        productsDiv.innerHTML = products.slice(0, 6).map(product => `
            <div class="product-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="product-header mb-3">
                    <h4 class="font-semibold text-gray-800 text-sm">${product.title}</h4>
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">${product.category}</span>
                </div>
                <div class="product-body mb-3">
                    <p class="text-gray-600 text-xs mb-2">${product.description}</p>
                    <p class="text-green-600 font-medium text-sm">${product.price}</p>
                </div>
                <div class="product-footer">
                    <p class="text-blue-600 text-xs mb-2">💡 ${product.why_recommended}</p>
                    <button class="w-full bg-orange-500 text-white text-xs py-2 px-3 rounded hover:bg-orange-600 transition-colors" 
                            onclick="window.open('https://amazon.co.jp/s?k=${encodeURIComponent(product.amazon_search)}', '_blank')">
                        Amazonで検索
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${products.length}件の商品を表示しました`);
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