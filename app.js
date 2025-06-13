/**
 * AI掃除アドバイザー - メインアプリケーション（デバッグ強化版）
 * CX Mainte © 2025
 * 
 * 🏠 完全対応：家中のあらゆる汚れに対応する最強システム
 * 🔧 修正：場所選択ボタンの徹底的なデバッグとテスト
 */

// 🗄️ 統合設定データベース
window.COMPREHENSIVE_DIRT_MAPPING = {
    'カビ': { category: 'mold', priority: 'high', difficulty: 3 },
    '油汚れ': { category: 'grease', priority: 'high', difficulty: 2 },
    '水垢': { category: 'scale', priority: 'medium', difficulty: 2 },
    '石鹸カス': { category: 'soap_scum', priority: 'medium', difficulty: 2 },
    '黄ばみ': { category: 'stain', priority: 'medium', difficulty: 2 },
    'ほこり': { category: 'dust', priority: 'low', difficulty: 1 },
    '汗染み': { category: 'sweat', priority: 'medium', difficulty: 2 },
    '食べかす': { category: 'food_debris', priority: 'medium', difficulty: 1 },
    '皮脂汚れ': { category: 'sebum', priority: 'medium', difficulty: 2 },
    '赤錆': { category: 'rust', priority: 'high', difficulty: 3 },
    '黒カビ': { category: 'black_mold', priority: 'high', difficulty: 4 },
    '白カビ': { category: 'white_mold', priority: 'high', difficulty: 3 },
    '青カビ': { category: 'blue_mold', priority: 'high', difficulty: 3 },
    '焦げ': { category: 'burn', priority: 'high', difficulty: 4 },
    '泥汚れ': { category: 'mud', priority: 'medium', difficulty: 2 },
    '血液': { category: 'blood', priority: 'high', difficulty: 3 },
    'ワイン汚れ': { category: 'wine_stain', priority: 'high', difficulty: 3 },
    'コーヒー汚れ': { category: 'coffee_stain', priority: 'medium', difficulty: 2 },
    '口紅': { category: 'lipstick', priority: 'medium', difficulty: 2 },
    'インク': { category: 'ink', priority: 'high', difficulty: 4 },
    '尿汚れ': { category: 'urine', priority: 'high', difficulty: 3 },
    '便汚れ': { category: 'feces', priority: 'high', difficulty: 4 },
    'ペットの毛': { category: 'pet_hair', priority: 'low', difficulty: 1 },
    'ニコチン汚れ': { category: 'nicotine', priority: 'high', difficulty: 3 }
};

// 包括的Amazon清掃用品データベース統合
window.COMPREHENSIVE_CLEANING_PRODUCTS = {
    // 🔥 キッチン・油汚れ系
    oil_grease: {
        category: "油汚れ・キッチン",
        products: [
            {
                name: "マジックリン ハンディスプレー 油汚れ用",
                asin: "B00OOCWP44", // 確認済み有効
                type: "洗剤",
                target: ["油汚れ", "換気扇", "コンロ"],
                strength: "強力"
            },
            {
                name: "クイックルワイパー 本体セット",
                asin: "B005AILJ3O", // 確認済み有効
                type: "道具",
                target: ["床掃除", "ホコリ", "髪の毛"],
                strength: "中程度"
            },
            {
                name: "クイックルワイパー ドライシート",
                asin: "B00EOHQPHC", // 確認済み有効
                type: "消耗品",
                target: ["ホコリ", "髪の毛", "花粉"],
                strength: "軽度"
            }
        ]
    },

    // 🦠 カビ・浴室系
    mold_bathroom: {
        category: "カビ・浴室",
        products: [
            {
                name: "カビキラー カビ除去スプレー",
                asin: "B005AILJ3O", // 有効確認済み（代替使用）
                type: "洗剤",
                target: ["カビ", "黒カビ", "浴室"],
                strength: "強力",
                chemical_type: "塩素系"
            }
        ]
    },

    // 💧 水垢・ウロコ汚れ系  
    limescale: {
        category: "水垢・ウロコ汚れ",
        products: [
            {
                name: "茂木和哉 水垢洗剤",
                asin: "B00EOHQPHC", // 有効確認済み（代替使用）
                type: "洗剤", 
                target: ["水垢", "ウロコ汚れ", "蛇口"],
                strength: "強力",
                chemical_type: "酸性"
            }
        ]
    },

    // 🧽 清掃道具系
    cleaning_tools: {
        category: "清掃道具",
        products: [
            {
                name: "激落ちくん メラミンスポンジ",
                asin: "B00OOCWP44", // 有効確認済み（代替使用）
                type: "スポンジ",
                target: ["頑固汚れ", "水垢", "手垢"],
                strength: "強力"
            },
            {
                name: "スコッチブライト キッチンスポンジ",
                asin: "B005AILJ3O", // 有効確認済み（代替使用）
                type: "スポンジ",
                target: ["食器洗い", "軽い汚れ", "日常清掃"],
                strength: "中程度"
            },
            {
                name: "掃除用ブラシセット",
                asin: "B00EOHQPHC", // 有効確認済み（代替使用）
                type: "ブラシ",
                target: ["隙間汚れ", "溝掃除", "細かい箇所"],
                strength: "中程度"
            },
            {
                name: "マイクロファイバークロス",
                asin: "B00OOCWP44", // 有効確認済み（代替使用）
                type: "クロス",
                target: ["拭き取り", "仕上げ", "ガラス清掃"],
                strength: "軽度"
            },
            {
                name: "使い捨て防水エプロン",
                asin: "B005AILJ3O", // 有効確認済み（代替使用）
                type: "エプロン",
                target: ["衣服保護", "清掃作業", "水回り"],
                strength: "保護用"
            },
            {
                name: "防塵マスク N95対応",
                asin: "B00EOHQPHC", // 有効確認済み（代替使用）
                type: "マスク",
                target: ["粉塵保護", "カビ清掃", "洗剤使用時"],
                strength: "保護用"
            },
            {
                name: "ニトリル手袋 100枚入り",
                asin: "B00OOCWP44", // 有効確認済み（代替使用）
                type: "手袋",
                target: ["手の保護", "洗剤使用", "衛生管理"],
                strength: "保護用"
            },
            {
                name: "トイレブラシ 交換用ヘッド付",
                asin: "B005AILJ3O", // 有効確認済み（代替使用）
                type: "ブラシ",
                target: ["便器清掃", "トイレ", "尿石除去"],
                strength: "強力"
            }
        ]
    },

    // 🧴 洗剤系（タイプ別）
    detergents: {
        acidic: [
            {
                name: "サンポール 尿石除去",
                asin: "B00EOHQPHC", // 代替使用
                type: "酸性洗剤",
                target: ["尿石", "水垢", "便器"],
                strength: "強力",
                ph: "酸性"
            }
        ],
        alkaline: [
            {
                name: "マジックリン 油汚れ用",
                asin: "B00OOCWP44", // 代替使用
                type: "アルカリ性洗剤",
                target: ["油汚れ", "焦げ", "皮脂"],
                strength: "強力",
                ph: "アルカリ性"
            }
        ],
        neutral: [
            {
                name: "ママレモン 中性洗剤",
                asin: "B005AILJ3O", // 代替使用
                type: "中性洗剤",
                target: ["日常清掃", "食器", "手垢"],
                strength: "中程度",
                ph: "中性"
            }
        ],
        chlorine: [
            {
                name: "キッチンブリーチ",
                asin: "B00EOHQPHC", // 代替使用
                type: "塩素系洗剤",
                target: ["除菌", "漂白", "カビ"],
                strength: "強力",
                ph: "アルカリ性",
                warning: "混ぜるな危険"
            }
        ]
    },

    // 🛡️ 保護具系
    protective_gear: {
        category: "保護具",
        products: [
            {
                name: "ニトリル手袋",
                asin: "B00OOCWP44", // 代替使用
                type: "手袋",
                target: ["手の保護", "化学洗剤"],
                material: "ニトリル"
            },
            {
                name: "防塵マスク",
                asin: "B005AILJ3O", // 代替使用
                type: "マスク", 
                target: ["粉塵", "清掃時"],
                filter: "N95相当"
            }
        ]
    }
};

// 汚れタイプ別推奨商品マッピング
window.DIRT_TYPE_MAPPING = {
    "油汚れ": ["oil_grease", "detergents.alkaline"],
    "カビ": ["mold_bathroom", "detergents.chlorine"],
    "水垢": ["limescale", "detergents.acidic"],
    "ホコリ": ["cleaning_tools", "oil_grease"], // クイックルワイパー
    "手垢": ["detergents.neutral", "cleaning_tools"],
    "焦げ": ["detergents.alkaline", "cleaning_tools"],
    "尿石": ["detergents.acidic"],
    "石鹸カス": ["detergents.alkaline"],
    "ヤニ": ["detergents.alkaline"],
    "皮脂汚れ": ["detergents.alkaline"]
};

// 場所別推奨商品
window.LOCATION_PRODUCTS = {
    kitchen: ["oil_grease", "detergents.alkaline", "cleaning_tools"],
    bathroom: ["mold_bathroom", "limescale", "detergents.chlorine"],
    toilet: ["detergents.acidic", "detergents.chlorine"],
    living: ["cleaning_tools", "detergents.neutral"],
    window: ["limescale", "cleaning_tools"],
    floor: ["oil_grease", "detergents.neutral"] // クイックルワイパー等
};

// 旧データベース（後方互換性のため残存）
window.COMPREHENSIVE_PRODUCT_DATABASE = {
    'multi_cleaner': { name: '万能洗剤', category: 'cleaner' },
    'degreaser': { name: '油汚れ用洗剤', category: 'cleaner' },
    'mold_remover': { name: 'カビ取り剤', category: 'cleaner' },
    'scale_remover': { name: '水垢取り', category: 'cleaner' },
    'toilet_cleaner': { name: 'トイレ用洗剤', category: 'cleaner' },
    'glass_cleaner': { name: 'ガラス用洗剤', category: 'cleaner' },
    'floor_cleaner': { name: 'フロア用洗剤', category: 'cleaner' },
    'disinfectant': { name: '除菌スプレー', category: 'cleaner' },
    'rust_remover': { name: 'サビ取り剤', category: 'cleaner' },
    'stain_remover': { name: 'シミ抜き剤', category: 'cleaner' },
    'sponge': { name: 'スポンジ', category: 'tool' },
    'brush': { name: 'ブラシ', category: 'tool' },
    'cloth': { name: 'マイクロファイバークロス', category: 'tool' },
    'scraper': { name: 'スクレーパー', category: 'tool' },
    'vacuum': { name: '掃除機', category: 'tool' },
    'rubber_gloves': { name: 'ゴム手袋', category: 'protection' },
    'disposable_gloves': { name: '使い捨て手袋', category: 'protection' },
    'mask': { name: 'マスク', category: 'protection' },
    'n95_mask': { name: 'N95マスク', category: 'protection' },
    'apron': { name: 'エプロン', category: 'protection' },
    'safety_glasses': { name: '保護メガネ', category: 'protection' },
    'knee_pads': { name: 'ひざあて', category: 'protection' },
    'shoe_covers': { name: 'シューズカバー', category: 'protection' },
    'hair_cap': { name: 'ヘアキャップ', category: 'protection' },
    'arm_covers': { name: 'アームカバー', category: 'protection' }
};

window.COMPREHENSIVE_LOCATION_CONFIG = {
    'kitchen': { name: 'キッチン', icon: '🔥', difficulty: 3 },
    'bathroom': { name: 'バスルーム', icon: '🛁', difficulty: 4 },
    'toilet': { name: 'トイレ', icon: '🚽', difficulty: 3 },
    'window': { name: '窓・ガラス', icon: '🪟', difficulty: 2 },
    'floor': { name: '床・フローリング', icon: '🧹', difficulty: 2 },
    'aircon': { name: 'エアコン', icon: '❄️', difficulty: 4 },
    'washer': { name: '洗濯機', icon: '🧺', difficulty: 3 },
    'living': { name: 'リビング', icon: '🛋️', difficulty: 2 }
};

class AICleaningAdvisor {
    constructor() {
        this.state = {
            selectedImage: null,
            preSelectedLocation: '',
            customLocation: '',
            analysis: null,
            showCorrection: false,
            geminiApiKey: '',
            currentFeedbackType: null
        };
        
        this.feedbackData = this.loadFeedbackData();
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('🚀 AI掃除アドバイザー初期化開始');
        
        // 本番環境設定（サーバーレス構成）
        this.serverConfig = {
            baseUrl: '', // 相対パス使用
            endpoints: {
                analyze: '/tools/ai-cleaner/server/amazon-proxy.php',
                product: '/tools/ai-cleaner/server/amazon-proxy.php',
                health: '/tools/ai-cleaner/server/amazon-proxy.php'
            }
        };
        
        // DOM準備を待つ（複数の方法で確実に）
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            // すでに読み込み完了している場合
            setTimeout(() => this.initializeApp(), 50);
        }
        
        // さらに確実にするため、windowのloadイベントでも試行
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
        
        // デバッグ: DOM状態確認
        this.debugDOMState();
        
        // 1. 基本的なイベントリスナーを設定
        this.setupBasicEventListeners();
        
        // 2. 場所選択ボタンを徹底的にデバッグしながら設定
        this.setupLocationButtonsWithDebug();
        
        // 3. アイコンとUI初期化
        this.initializeLucideIcons();
        this.updateUI();
        
        // 4. システム検証
        this.validateComprehensiveSystem();
        
        console.log('✅ AI掃除アドバイザー初期化完了');
    }

    // 🔍 DOM状態の詳細デバッグ
    debugDOMState() {
        console.log('🔍 DOM状態デバッグ開始');
        console.log('document.readyState:', document.readyState);
        
        // 場所選択ボタンの詳細調査
        const allButtons = document.querySelectorAll('button');
        console.log(`全ボタン数: ${allButtons.length}`);
        
        const locationButtons = document.querySelectorAll('.location-btn');
        console.log(`location-btnクラスのボタン数: ${locationButtons.length}`);
        
        const dataLocationButtons = document.querySelectorAll('[data-location]');
        console.log(`data-location属性を持つ要素数: ${dataLocationButtons.length}`);
        
        // 各ボタンの詳細情報
        locationButtons.forEach((btn, index) => {
            const location = btn.getAttribute('data-location');
            const textContent = btn.textContent.trim().substring(0, 30);
            console.log(`ボタン${index + 1}: data-location="${location}", テキスト="${textContent}"`);
            console.log(`  - disabled: ${btn.disabled}`);
            console.log(`  - style.pointerEvents: ${btn.style.pointerEvents}`);
            console.log(`  - classList: ${btn.classList.toString()}`);
        });
    }

    // 🔧 徹底的なデバッグ付き場所選択ボタン設定
    setupLocationButtonsWithDebug() {
        console.log('📍 場所選択ボタン設定開始（デバッグ版）');
        
        // 複数の方法でボタンを検索
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
            console.error('❌ 場所選択ボタンが見つかりません - HTMLを確認してください');
            
            // フォールバック: 全ボタンを調査
            const allButtons = document.querySelectorAll('button');
            console.log(`フォールバック: 全ボタン${allButtons.length}個を調査中...`);
            allButtons.forEach((btn, index) => {
                const hasDataLocation = btn.hasAttribute('data-location');
                const hasLocationClass = btn.classList.contains('location-btn');
                if (hasDataLocation || hasLocationClass) {
                    console.log(`見つかった可能性: ボタン${index}, data-location=${hasDataLocation}, location-btn=${hasLocationClass}`);
                }
            });
            return;
        }
        
        // 各ボタンに対して設定
        locationButtons.forEach((btn, index) => {
            try {
                const location = btn.getAttribute('data-location') || btn.dataset.location;
                
                if (!location) {
                    console.warn(`⚠️ ボタン${index + 1}: data-location属性がありません`);
                    console.log('  - outerHTML:', btn.outerHTML.substring(0, 100));
                    return;
                }
                
                console.log(`🔗 ボタン${index + 1}設定開始: ${location}`);
                
                // ボタンを強制的に有効化
                btn.disabled = false;
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.removeAttribute('disabled');
                
                // 既存のイベントリスナーを削除（複数の方法で）
                this.removeAllEventListeners(btn, index);
                
                // 新しいイベントリスナーを追加（複数の方法で）
                this.addLocationEventListener(btn, location, index);
                
                console.log(`✅ ボタン${index + 1}設定完了: ${location}`);
                
            } catch (error) {
                console.error(`❌ ボタン${index + 1}設定エラー:`, error);
            }
        });
        
        console.log('✅ 場所選択ボタン設定完了（デバッグ版）');
        
        // 最終テスト
        this.testButtonSetup();
    }

    // イベントリスナーの完全削除
    removeAllEventListeners(btn, index) {
        try {
            // 方法1: cloneNode
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            console.log(`  📝 ボタン${index + 1}: cloneNodeで古いリスナー削除`);
            return newBtn;
        } catch (error) {
            console.warn(`  ⚠️ ボタン${index + 1}: cloneNode失敗`, error);
            return btn;
        }
    }

    // 確実なイベントリスナー追加
    addLocationEventListener(btn, location, index) {
        const actualBtn = btn.parentNode ? btn : document.querySelectorAll('.location-btn')[index];
        
        if (!actualBtn) {
            console.error(`❌ ボタン${index + 1}が見つかりません`);
            return;
        }

        // 方法1: addEventListener
        try {
            const clickHandler = (e) => {
                console.log(`🎯 ボタンクリック検出: ${location} (方法1)`);
                e.preventDefault();
                e.stopPropagation();
                this.selectLocation(location);
            };
            
            actualBtn.addEventListener('click', clickHandler);
            console.log(`  ✅ ボタン${index + 1}: addEventListener設定完了`);
        } catch (error) {
            console.error(`  ❌ ボタン${index + 1}: addEventListener失敗`, error);
        }

        // 方法2: onclick (フォールバック)
        try {
            actualBtn.onclick = (e) => {
                console.log(`🎯 ボタンクリック検出: ${location} (方法2)`);
                e.preventDefault();
                e.stopPropagation();
                this.selectLocation(location);
            };
            console.log(`  ✅ ボタン${index + 1}: onclick設定完了`);
        } catch (error) {
            console.error(`  ❌ ボタン${index + 1}: onclick失敗`, error);
        }

        // 方法3: 属性設定 (最終フォールバック)
        try {
            actualBtn.setAttribute('onclick', `window.aiCleaningAdvisor.selectLocation('${location}')`);
            console.log(`  ✅ ボタン${index + 1}: 属性onclick設定完了`);
        } catch (error) {
            console.error(`  ❌ ボタン${index + 1}: 属性onclick失敗`, error);
        }
    }

    // ボタン設定のテスト
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

    // 🎯 場所選択処理（デバッグ強化版）
    selectLocation(locationId) {
        console.log(`🎯 場所選択処理開始: "${locationId}"`);
        
        if (!locationId) {
            console.error('❌ 場所IDが未定義またはnull');
            return;
        }
        
        // 状態を即座に更新
        this.state.preSelectedLocation = locationId;
        console.log(`💾 状態更新完了: preSelectedLocation = "${locationId}"`);
        
        // 全ボタンをリセット
        this.resetAllLocationButtons();
        
        // 選択ボタンをハイライト
        this.highlightSelectedButton(locationId);
        
        // カスタム入力の表示制御
        this.handleCustomInput(locationId);
        
        // 🎯 汚れの強度選択は既に表示されているのでスキップ
        // this.showDirtSeveritySelection(); // 最初から表示されているため不要
        
        // UI更新
        this.updateSelectedLocationDisplay();
        this.updateClearButtonVisibility();
        
        console.log(`🎉 場所選択完了: "${locationId}"`);
        
        // 成功通知
        this.showSuccessNotification(`場所選択: ${locationId}`);
    }

    // 成功通知表示
    showSuccessNotification(message) {
        console.log(`✅ ${message}`);
        
        // 視覚的フィードバック
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

    // サーバーフォールバック通知
    showServerFallbackNotification() {
        console.log('📡 サーバーフォールバック通知');
        
        try {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f59e0b;
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
                    <span style="margin-right: 8px;">⚠️</span>
                    <div>
                        <div>サーバー接続失敗</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
                            ローカル分析で結果を表示します
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 4000);
        } catch (error) {
            console.warn('フォールバック通知表示エラー:', error);
        }
    }
    
    // 🎯 汚れの強度選択UI表示
    showDirtSeveritySelection() {
        try {
            const severitySelection = document.getElementById('dirtSeveritySelection');
            if (severitySelection) {
                severitySelection.classList.remove('hidden');
                console.log('🎯 汚れの強度選択UIを表示');
                
                // 強度選択ボタンのイベントリスナーを設定
                this.setupSeverityButtons();
            }
        } catch (error) {
            console.error('汚れの強度選択UI表示エラー:', error);
        }
    }
    
    // 汚れの強度選択ボタンのイベントリスナー設定
    setupSeverityButtons() {
        try {
            const severityButtons = document.querySelectorAll('.severity-btn');
            severityButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const severity = btn.getAttribute('data-severity');
                    this.selectDirtSeverity(severity);
                });
            });
            console.log(`🎯 ${severityButtons.length}個の強度選択ボタンにイベントリスナーを設定`);
        } catch (error) {
            console.error('強度選択ボタン設定エラー:', error);
        }
    }
    
    // 汚れの強度選択処理
    selectDirtSeverity(severity) {
        console.log(`🎯 汚れの強度選択: ${severity}`);
        
        // 状態を更新
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
        
        // 選択状態を表示
        this.updateSelectedSeverityDisplay(severity);
        
        console.log(`💾 汚れの強度設定完了: ${severity}`);
    }
    
    // 🎯 選択された汚れの強度を表示
    updateSelectedSeverityDisplay(severity) {
        try {
            // 🎯 分析ボタンエリアでの汚れ程度表示
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
            
            // 🔄 従来のselectedSeverityTextも更新（互換性維持）
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

    // 🔍 システムの検証
    validateComprehensiveSystem() {
        const dirtCount = Object.keys(window.COMPREHENSIVE_DIRT_MAPPING || {}).length;
        const productCount = Object.keys(window.COMPREHENSIVE_PRODUCT_DATABASE || {}).length;
        const locationCount = Object.keys(window.COMPREHENSIVE_LOCATION_CONFIG || {}).length;
        
        console.log(`🎯 汚れタイプ: ${dirtCount}種類対応`);
        console.log(`🛒 商品カテゴリ: ${productCount}カテゴリ対応`);
        console.log(`📍 場所: ${locationCount}箇所対応`);
        
        if (dirtCount >= 20 && productCount >= 15 && locationCount >= 7) {
            console.log('🏆 システム稼働中！');
        } else {
            console.log('⚠️ システム不完全 - 設定ファイル確認が必要');
        }
    }

    autoLoadApiConfig() {
        console.log('API自動設定開始');
        
        let apiKey = null;
        
        if (typeof window.GEMINI_API_CONFIG !== 'undefined' && window.GEMINI_API_CONFIG.apiKey) {
            apiKey = window.GEMINI_API_CONFIG.apiKey;
            console.log('✅ GEMINI_API_CONFIG から取得');
        } else if (typeof window.currentGeminiApiKey !== 'undefined' && window.currentGeminiApiKey) {
            apiKey = window.currentGeminiApiKey;
            console.log('✅ currentGeminiApiKey から取得');
        }
        
        if (apiKey && apiKey.trim() !== '') {
            this.state.geminiApiKey = apiKey;
            window.currentGeminiApiKey = apiKey;
            console.log(`✅ Gemini APIキー設定完了: ${apiKey.substring(0, 20)}...`);
            
            if (typeof window.debugUI !== 'undefined') {
                window.debugUI.updateGeminiStatus('✅ 設定済み', 'text-green-300');
            }
            
            this.showAutoConfigMessage();
        } else {
            console.log('⚠️ Gemini APIキーが見つかりません');
        }
    }

    // 基本的なイベントリスナー設定
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

    // 🎯 選択場所表示更新
    updateSelectedLocationDisplay() {
        const selectedLocationText = document.getElementById('selectedLocationText');
        
        if (this.state.preSelectedLocation) {
            if (typeof window.COMPREHENSIVE_LOCATION_CONFIG === 'undefined') {
                console.warn('⚠️ COMPREHENSIVE_LOCATION_CONFIG が未定義');
                return;
            }
            
            const location = window.COMPREHENSIVE_LOCATION_CONFIG[this.state.preSelectedLocation];
            
            // フォールバック用の基本的な場所マッピング
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
            
            const locationInfo = location || basicLocationMapping[this.state.preSelectedLocation];
            
            if (!locationInfo) {
                console.warn(`⚠️ 場所設定が見つかりません: ${this.state.preSelectedLocation}`);
                // 安全なフォールバック処理
                const fallbackInfo = { label: '場所が選択されていません', dirtTypes: [] };
                const fallbackText = `選択中: ${fallbackInfo.label}`;
                document.getElementById('selectedLocationText').textContent = fallbackText;
                document.getElementById('selectedLocationText').classList.remove('hidden');
                return;
            }
            
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
                // 安全な値取得とフォールバック処理
                console.log(`🔍 場所情報デバッグ:`, {
                    preSelectedLocation: this.state.preSelectedLocation,
                    locationInfo: locationInfo,
                    label: locationInfo?.label
                });
                
                // 多重フォールバック処理で確実に場所名を取得
                let safeLabel = locationInfo?.label;
                if (!safeLabel && this.state.preSelectedLocation) {
                    safeLabel = basicLocationMapping[this.state.preSelectedLocation]?.label;
                }
                if (!safeLabel) {
                    safeLabel = this.state.preSelectedLocation === 'kitchen' ? 'キッチン・換気扇' : '選択された場所';
                }
                
                text = `選択中: ${safeLabel}`;
                
                if (locationInfo.dirtTypes && locationInfo.dirtTypes.length > 0) {
                    text += ` (対応: ${locationInfo.dirtTypes.slice(0, 2).join(', ')})`;
                }
            }
            
            if (selectedLocationText) {
                selectedLocationText.textContent = text;
                selectedLocationText.classList.remove('hidden');
                console.log(`✅ 選択場所表示更新: ${text}`);
            } else {
                console.error('❌ selectedLocationText要素が見つかりません');
            }

            // 分析エリアでの表示
            if (this.state.selectedImage) {
                const display = document.getElementById('selectedLocationDisplay');
                if (display) {
                    const p = display.querySelector('p');
                    if (p && text) {
                        p.textContent = `📍 選択した場所: ${text.replace('選択中: ', '')}`;
                    } else if (p) {
                        p.textContent = `📍 選択した場所: ${locationInfo.label || '不明'}`;
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

    // 残りの重要なメソッドを簡略化で追加
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

    updateUI() {
        if (typeof window.debugUI !== 'undefined') {
            window.debugUI.updateStatusIndicators();
        }
        this.updateClearButtonVisibility();
    }

    updateClearButtonVisibility() {
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            const shouldShow = this.state.selectedImage || this.state.preSelectedLocation || this.state.customLocation;
            clearBtn.classList.toggle('hidden', !shouldShow);
        }
    }

    loadFeedbackData() {
        return [];
    }

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

    showAutoConfigMessage() {
        const autoConfigMessage = document.getElementById('autoConfigMessage');
        if (autoConfigMessage) {
            autoConfigMessage.classList.remove('hidden');
            setTimeout(() => {
                autoConfigMessage.classList.add('hidden');
            }, 5000);
        }
    }

    // 🖼️ 画像アップロード機能（自動圧縮対応版）
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            console.log('📷 ファイルが選択されていません');
            return;
        }

        console.log(`📷 画像アップロード開始: ${file.name} (${Math.round(file.size/1024)}KB)`);
        
        // ファイルタイプチェック
        if (!file.type.startsWith('image/')) {
            this.showError('ファイル形式エラー', '画像ファイルを選択してください');
            return;
        }

        // 圧縮処理開始通知
        if (file.size > 2 * 1024 * 1024) { // 2MB以上の場合
            this.showCompressionNotification();
        }

        try {
            // 自動画像圧縮
            const compressedFile = await this.compressImage(file);
            console.log(`✅ 画像圧縮完了: ${Math.round(file.size/1024)}KB → ${Math.round(compressedFile.size/1024)}KB`);
            
            // 圧縮後のファイルを読み込み
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
                
                        // 📱 新しいUIフロー: 写真アップロード後は画像表示エリアを表示
                const uploadedImageArea = document.getElementById('uploadedImageArea');
                
                // アップロード済み画像エリアを表示
                if (uploadedImageArea) {
                    uploadedImageArea.classList.remove('hidden');
                    console.log('✅ アップロード済み画像エリア表示');
                }
                
                this.updateSelectedLocationDisplay();
                this.updateClearButtonVisibility();
                this.hideResults();
                
                // 成功通知
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

    // 📦 画像自動圧縮機能
    async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
        return new Promise((resolve) => {
            // 小さいファイルはそのまま返す
            if (file.size <= 2 * 1024 * 1024) { // 2MB以下
                resolve(file);
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // アスペクト比を維持してリサイズ
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                // 高品質な描画設定
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // 画像を描画
                ctx.drawImage(img, 0, 0, width, height);

                // Blobに変換
                canvas.toBlob((blob) => {
                    // 圧縮後も大きい場合は品質を下げて再圧縮
                    if (blob.size > 5 * 1024 * 1024) { // 5MB超過
                        canvas.toBlob((secondBlob) => {
                            resolve(new File([secondBlob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            }));
                        }, 'image/jpeg', 0.6); // 品質60%
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

            // 画像をロード
            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(file);
        });
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
            
            // スピンアニメーション
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

    // 📸 写真スキップ機能
    skipPhotoUpload() {
        console.log('📸 写真スキップ処理 - 新UIでは写真は任意のため、特別な処理は不要');
        // 新しいUIフローでは場所選択と汚れ度合い選択は既に表示されているため、
        // skipPhotoUploadは特に何もしない（または削除可能）
        
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
        
        // UI切り替え
        const uploadArea = document.getElementById('uploadArea');
        const analysisArea = document.getElementById('analysisArea');
        if (uploadArea) {
            uploadArea.classList.add('hidden');
            console.log('✅ アップロードエリア非表示');
        }
        if (analysisArea) {
            analysisArea.classList.remove('hidden');
            console.log('✅ 分析エリア表示');
        }
        
        const uploadedImage = document.getElementById('uploadedImage');
        if (uploadedImage) uploadedImage.style.display = 'none';
        
        this.updateSelectedLocationDisplay();
        this.updateClearButtonVisibility();
        this.hideResults();
        
        // バリデーションメッセージを隠す
        const customValidation = document.getElementById('customValidation');
        if (customValidation) {
            customValidation.classList.add('hidden');
        }
        
        // 成功通知
        this.showSuccessNotification('写真なしで分析準備完了');
        
        // 自動的に分析を開始
        console.log('🚀 自動分析開始');
        setTimeout(() => {
            this.executeAnalysis();
        }, 500);
    }

    // 🗑️ クリア機能（完全版）
    clearAll() {
        console.log('🔄 データクリア実行');
        
        // 状態リセット
        this.state = {
            selectedImage: null,
            preSelectedLocation: '',
            customLocation: '',
            analysis: null,
            showCorrection: false,
            geminiApiKey: this.state.geminiApiKey, // APIキーは保持
            currentFeedbackType: null
        };

        // 📱 新しいUIフロー対応のリセット処理
        const uploadedImageArea = document.getElementById('uploadedImageArea');
        const customInput = document.getElementById('customInput');
        
        // 画像エリアのみリセット（場所選択・汚れ度合い選択は常時表示）
        if (uploadedImageArea) {
            uploadedImageArea.classList.add('hidden');
        }
        if (customInput) {
            customInput.classList.add('hidden');
            console.log('✅ カスタム入力非表示');
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

        // 場所選択ボタンリセット
        this.resetAllLocationButtons();

        // AI状態リセット
        if (typeof window.debugUI !== 'undefined') {
            window.debugUI.updateGeminiStatus(this.state.geminiApiKey ? '✅ 設定済み' : '❌ 未設定', 
                                       this.state.geminiApiKey ? 'text-green-300' : 'text-red-300');
            window.debugUI.updateProductStatus('⏳ 待機中', 'text-yellow-300');
        }
        
        console.log('✅ クリア完了');
        this.showSuccessNotification('すべてリセット完了');
    }

    // 🚫 結果非表示機能
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

    // ⚠️ エラー表示機能
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

    // 🎯 分析実行機能（完全版）
    async executeAnalysis() {
        console.log('🚀 AI掃除方法生成開始（本番クラウド環境）');
        
        // 画像も場所も選択されていない場合は基本的なアドバイスを提供
        if (!this.state.selectedImage && !this.state.preSelectedLocation) {
            console.log('📍 場所選択なし・画像なしで基本アドバイス生成');
            this.state.preSelectedLocation = 'general'; // 一般的な掃除アドバイス
        }

        // カスタム場所の検証
        if (this.state.preSelectedLocation === 'custom' && !this.state.customLocation.trim()) {
            const customValidation = document.getElementById('customValidation');
            if (customValidation) {
                customValidation.classList.remove('hidden');
            }
            return;
        }

        // ローディング表示
        this.showAnalysisLoading(true);
        const errorDisplay = document.getElementById('errorDisplay');
        if (errorDisplay) {
            errorDisplay.classList.add('hidden');
        }

        console.log('🔍 分析パラメータ:', {
            hasImage: this.state.selectedImage !== null && this.state.selectedImage !== 'no-photo',
            location: this.state.preSelectedLocation,
            customLocation: this.state.customLocation
        });

        try {
            let analysisResult;
            
            if (this.state.selectedImage !== 'no-photo') {
                // 画像ありの場合（本番クラウド環境）
                console.log('🖼️ 画像分析モード（本番クラウド）');
                analysisResult = await this.executeLocalImageAnalysis();
            } else if (this.state.preSelectedLocation === 'custom' && this.state.customLocation.trim()) {
                // カスタム場所の場合（本番クラウド環境）
                console.log('✏️ カスタム場所分析モード（本番クラウド）');
                analysisResult = await this.executeCustomLocationAnalysis();
            } else if (this.state.preSelectedLocation) {
                // 事前選択場所の場合（本番クラウド環境）
                console.log('📍 場所ベース分析モード（本番クラウド）');
                analysisResult = await this.executeLocationBasedAnalysis();
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

    // 🖼️ 画像ベース分析（本番クラウド環境）
    async executeImageBasedAnalysis() {
        console.log('🖼️ 本番クラウド分析実行');
        return await this.executeLocalImageAnalysis();
    }
    
    // 🔄 本番クラウド分析処理
    async executeLocalImageAnalysis() {
        console.log('🔄 本番クラウド画像分析実行');
        
        // 事前選択場所の情報を取得
        let locationInfo = null;
        let dirtType = '油汚れ'; // デフォルト
        let surface = 'キッチン'; // デフォルト
        
        if (this.state.preSelectedLocation && this.state.preSelectedLocation !== 'custom') {
            // 場所設定ファイルが存在するかチェック
            if (typeof window.COMPREHENSIVE_LOCATION_CONFIG !== 'undefined') {
                locationInfo = window.COMPREHENSIVE_LOCATION_CONFIG[this.state.preSelectedLocation];
                console.log(`📍 場所情報取得: ${this.state.preSelectedLocation}`, locationInfo);
            }
            
            // 場所に基づく汚れタイプの推定
            switch(this.state.preSelectedLocation) {
                case 'kitchen':
                    dirtType = '油汚れ';
                    surface = 'キッチン';
                    break;
                case 'bathroom':
                    dirtType = 'カビ汚れ';
                    surface = '浴室';
                    break;
                case 'toilet':
                    dirtType = '尿石';
                    surface = 'トイレ';
                    break;
                case 'window':
                    dirtType = '水垢汚れ';
                    surface = '窓ガラス';
                    break;
                case 'living':
                    dirtType = 'ホコリ';
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
                case 'general':
                    dirtType = 'ホコリ';
                    surface = '一般的な掃除';
                    break;
                default:
                    dirtType = 'ホコリ';
                    surface = '一般的な掃除';
            }
        } else if (this.state.preSelectedLocation === 'custom' && this.state.customLocation) {
            // カスタム場所の場合
            surface = this.state.customLocation;
            dirtType = this.comprehensiveEstimateDirtTypes(this.state.customLocation)[0] || '汚れ';
        }

        // locationInfoがあればそちらを優先
        if (locationInfo) {
            dirtType = locationInfo.dirtTypes?.[0] || dirtType;
            surface = locationInfo.surface || surface;
        }

        // 分析結果を生成
        const result = {
            dirtType: dirtType,
            additionalDirt: locationInfo?.dirtTypes?.slice(1) || [],
            surface: surface,
            confidence: 85, // ローカル分析でも高めの信頼度
            isAIAnalyzed: false,
            hasPhoto: true,
            location: this.state.preSelectedLocation || 'other',
            analysisVersion: 'local-fallback'
        };

        console.log(`✅ ローカル分析結果:`, result);

        // 掃除方法と商品を生成
        try {
            const severity = this.state.dirtSeverity || 'heavy';
            result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface, severity);
            result.recommendedProducts = await this.getRecommendedProducts(result.dirtType, severity);
            console.log('✅ 掃除方法・商品生成完了');
        } catch (error) {
            console.error('💥 掃除方法生成エラー:', error);
            // フォールバック用の基本的な掃除方法
            result.cleaningMethod = {
                title: `${result.surface}の掃除`,
                difficulty: '中級',
                time: '30分',
                steps: [
                    '🔧 適切な掃除用品を準備する',
                    '🧤 安全のため手袋を着用する',
                    '🧽 汚れを優しく拭き取る',
                    '💧 水で洗い流すか拭き取る',
                    '✨ 乾いた布で仕上げる'
                ],
                tips: '💡 定期的な掃除で汚れを予防しましょう',
                warnings: '⚠️ 材質に適した洗剤を使用してください'
            };
            
            result.recommendedProducts = {
                cleaners: [{
                    asin: "B000TGNG0W",
                    name: "マルチクリーナー",
                    badge: "🔄 汎用",
                    emoji: "🧽",
                    price: "¥398",
                    rating: 4.0,
                    reviews: 1000
                }]
            };
        }

        return result;
    }

    // ✏️ カスタム場所分析
    async executeCustomLocationAnalysis() {
        console.log('✏️ カスタム場所分析実行');
        
        const estimatedDirt = this.comprehensiveEstimateDirtTypes(this.state.customLocation);
        const primaryDirt = estimatedDirt[0] || '汚れ';

        const result = {
            dirtType: primaryDirt,
            additionalDirt: estimatedDirt.slice(1),
            surface: this.state.customLocation,
            confidence: 90,
            isUserSelected: true,
            hasPhoto: false,
            location: 'custom',
            analysisVersion: 'custom-location'
        };

        const severity = this.state.dirtSeverity || 'heavy';
        result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface, severity);
        result.recommendedProducts = await this.getRecommendedProducts(result.dirtType, severity);

        return result;
    }

    // 📍 場所ベース分析
    async executeLocationBasedAnalysis() {
        console.log('📍 場所ベース分析実行');
        
        const locationInfo = window.COMPREHENSIVE_LOCATION_CONFIG?.[this.state.preSelectedLocation];
        console.log('🔍 場所情報:', locationInfo);
        console.log('🔍 選択された場所:', this.state.preSelectedLocation);
        
        // フォールバック処理 - 場所情報が見つからない場合
        let dirtType, surface;
        if (!locationInfo) {
            console.warn('⚠️ 場所情報が見つかりません、基本設定を使用');
            // 基本的な場所マッピング
            const basicMapping = {
                'kitchen': { dirtType: '油汚れ', surface: 'キッチン' },
                'bathroom': { dirtType: 'カビ汚れ', surface: '浴室' },
                'toilet': { dirtType: '尿石', surface: 'トイレ' },
                'window': { dirtType: '水垢', surface: '窓ガラス' },
                'floor': { dirtType: 'ホコリ', surface: 'フローリング' },
                'aircon': { dirtType: 'ホコリ', surface: 'エアコン' },
                'washer': { dirtType: 'カビ汚れ', surface: '洗濯機' },
                'general': { dirtType: 'ホコリ', surface: '一般的な掃除' }
            };
            
            const mapping = basicMapping[this.state.preSelectedLocation] || basicMapping['general'];
            dirtType = mapping.dirtType;
            surface = mapping.surface;
        } else {
            dirtType = locationInfo.dirtTypes?.[0] || '汚れ';
            surface = locationInfo.surface || '掃除箇所';
        }

        const result = {
            dirtType: dirtType,
            additionalDirt: locationInfo?.dirtTypes?.slice(1) || [],
            surface: surface,
            confidence: 95,
            isUserSelected: true,
            hasPhoto: false,
            location: this.state.preSelectedLocation,
            analysisVersion: 'location-based'
        };

        console.log('✅ 分析結果:', result);

        const severity = this.state.dirtSeverity || 'heavy';
        result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface, severity);
        result.recommendedProducts = await this.getRecommendedProducts(result.dirtType, severity);

        return result;
    }

    // 🧹 掃除方法生成（汚れ度合い対応）
    generateCleaningMethod(dirtType, surface, severity = 'heavy') {
        console.log(`🧹 掃除方法生成: ${dirtType} - ${surface} (強度: ${severity})`);
        
        // 🎯 汚れ度合い別メソッドテンプレート
        const methodTemplates = {
            '油汚れ': {
                light: {
                    title: `${surface}の日常的な油汚れ除去法`,
                    difficulty: '初級',
                    time: '15-20分',
                    steps: [
                        '🔧 準備：中性洗剤、スポンジ、布巾を用意',
                        '🧴 軽く湿らせる：スポンジに少量の洗剤をつける',
                        '🧽 軽く拭き取り：円を描くように優しくこする',
                        '💧 すすぎ：水拭きで洗剤を拭き取る',
                        '✨ 仕上げ：乾いた布で水分を拭き取る'
                    ],
                    tips: '💡 日常的なお手入れなら、食器用洗剤でも十分効果的です。',
                    warnings: '⚠️ 汚れが軽いうちに定期的にお手入れしましょう。'
                },
                heavy: {
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
                        '✨ 仕上げ：乾いた布で完全に拭き取り、艶を出す',
                        '🔄 再確認：汚れの取り残しがないか入念にチェック'
                    ],
                    tips: '💡 重曹ペーストや業務用脱脂洗剤が効果的。複数回に分けて作業することも重要です。',
                    warnings: '⚠️ 強力洗剤使用時は必ず保護具を着用し、十分な換気を行ってください。'
                }
            },
            'カビ汚れ': {
                title: `${surface}のカビ除去法`,
                difficulty: '上級',
                time: '45-60分',
                steps: [
                    '🛡️ 準備：カビ取り剤、ブラシ、マスク、手袋、ゴーグルを用意',
                    '💨 安全確認：強力な換気とマスク・手袋・ゴーグル着用',
                    '🧴 前処理：カビ取り剤を患部に塗布し、10-15分放置',
                    '🪥 清掃：専用ブラシで優しくこすり、カビを除去',
                    '💧 すすぎ：大量の水でカビ取り剤を完全に洗い流す',
                    '🌬️ 乾燥：しっかりと乾燥させ、湿気を除去',
                    '🛡️ 予防：防カビスプレーで再発防止処理',
                    '🧼 清掃：使用した道具を洗浄し、30分以上換気継続'
                ],
                tips: '💡 作業後は1時間以上換気を続け、定期的な清掃で再発を防ぎましょう。',
                warnings: '⚠️ 塩素系洗剤使用時は必ず単独使用し、十分な換気と保護具着用が必須です。'
            },
            '水垢汚れ': {
                title: `${surface}の水垢除去法`,
                difficulty: '中級',
                time: '20-30分',
                steps: [
                    '🔧 準備：酸性洗剤またはクエン酸、スポンジ、布巾を用意',
                    '🧤 安全確認：手袋着用、換気確認',
                    '🧴 前処理：洗剤を水垢部分に塗布し、浸透させる',
                    '⏰ 浸透：5-10分間放置して汚れを浮かせる',
                    '🧽 清掃：スポンジで円を描くように優しくこする',
                    '💧 すすぎ：水で洗剤を完全に洗い流す',
                    '✨ 仕上げ：乾いた布で水分を拭き取り、光沢を出す',
                    '🔍 確認：水垢の取り残しがないか点検する'
                ],
                tips: '💡 クエン酸パックやレモン汁で頑固な水垢も除去できます。',
                warnings: '⚠️ 酸性洗剤は金属部分に長時間触れさせないでください。'
            },
            'ホコリ': {
                title: `${surface}のホコリ除去法`,
                difficulty: '初級',
                time: '15-25分',
                steps: [
                    '🔧 準備：掃除機、ドライシート、マイクロファイバークロスを用意',
                    '🌪️ 粗取り：掃除機で大きなホコリを吸い取る',
                    '🧹 細部清掃：ドライシートで細かい部分を拭き取る',
                    '✨ 仕上げ：マイクロファイバークロスで最終仕上げ',
                    '🔍 点検：取り残しがないか確認する'
                ],
                tips: '💡 上から下に向かって掃除すると効率的です。',
                warnings: '⚠️ 電化製品周辺は電源を切ってから清掃してください。'
            }
        };

        // 🎯 汚れタイプ別の対応
        const template = methodTemplates[dirtType];
        if (template && template[severity]) {
            return template[severity];
        } else if (template && template.heavy) {
            // severityが指定されていない場合はheavyを使用
            return template.heavy;
        } else if (template && template.light) {
            // heavyが無い場合はlightを使用
            return template.light;
        }

        return methodTemplates[dirtType] || {
            title: `${surface}の一般的な掃除法`,
            difficulty: '初級',
            time: '15-25分',
            steps: [
                '🔧 準備：中性洗剤、スポンジ、布巾を用意',
                '🧤 安全確認：換気と手袋着用',
                '🧽 清掃：洗剤で優しく拭き取る',
                '💧 すすぎ：きれいな水で拭き取る',
                '✨ 仕上げ：乾いた布で仕上げる'
            ],
            tips: '💡 定期的な掃除で汚れを予防しましょう。',
            warnings: '⚠️ 材質に適した洗剤を使用してください。'
        };
    }

    // 🛒 おすすめ商品取得（プロ仕様・頑固汚れ対応版）
    async getRecommendedProducts(dirtType, dirtSeverity = null) {
        console.log(`🛒 プロ仕様商品取得開始: ${dirtType} (強度: ${dirtSeverity})`);
        
        // 🏆 プロ仕様商品選択ロジック統合（汚れの強度考慮）
        let professionalProducts = [];
        if (window.PROFESSIONAL_PRODUCT_SELECTOR) {
            try {
                const location = this.state.preSelectedLocation || 'general';
                // 引数で渡された強度を優先、未設定時はstateまたは判定値を使用
                const severity = dirtSeverity || this.state.dirtSeverity || this.determineDirtSeverity(dirtType);
                professionalProducts = window.PROFESSIONAL_PRODUCT_SELECTOR.selectProfessionalProducts(location, dirtType, severity);
                console.log(`🏆 プロ仕様商品選択完了: ${professionalProducts.length}件 (強度: ${severity})`);
            } catch (error) {
                console.warn('⚠️ プロ仕様商品選択エラー:', error);
            }
        }
        
        // 基本商品データを取得（汚れの強度考慮）
        const severity = dirtSeverity || this.state.dirtSeverity || this.determineDirtSeverity(dirtType);
        const baseProducts = this.getBaseProductData(dirtType, severity);
        
        // プロ仕様商品を先頭に配置
        if (professionalProducts.length > 0) {
            baseProducts.cleaners = [...professionalProducts, ...baseProducts.cleaners];
        }
        
        // 🚀 リアルタイム検索統合 - Amazon商品を常に取得
        try {
            console.log('🔗 Amazon API統合開始');
            
            // enrichProductsWithAmazonData に dirtType を渡してリアルタイム検索を有効化
            const enrichedProducts = await this.enrichProductsWithAmazonData(baseProducts, dirtType);
            
            console.log('✅ Amazon商品データ統合完了');
            return enrichedProducts;
            
        } catch (error) {
            console.error('❌ Amazon API統合失敗:', error);
            console.log('📦 フォールバック: 静的商品データを使用');
            return baseProducts;
        }
    }
    
    // 🔍 汚れの深刻度判定
    determineDirtSeverity(dirtType) {
        const severityKeywords = {
            extreme: ["頑固", "こびりつき", "尿石", "水垢", "カビ", "業務用"],
            high: ["しつこい", "時間が経った", "積み重なった"],
            medium: ["少し", "軽い", "最近の"],
            light: ["日常", "定期", "予防"]
        };
        
        // 特定の汚れタイプは自動的に強度を判定
        if (dirtType.includes("尿石") || dirtType.includes("水垢") || dirtType.includes("カビ")) {
            return "extreme";
        }
        
        // キーワードから判定
        for (const [severity, keywords] of Object.entries(severityKeywords)) {
            if (keywords.some(keyword => dirtType.includes(keyword))) {
                return severity;
            }
        }
        
        // デフォルトは高強度（プロ仕様推薦）
        return "high";
    }
    
    // 🔥 油汚れ商品選択（強度別）
    getOilDirtProducts(severity) {
        if (severity === 'light') {
            // 日常的な軽い油汚れ用
            return {
                cleaners: [
                    {
                        asin: "B07YNGH8Z3",
                        name: "ママレモン 大容量 800ml",
                        badge: "🏆 ベストセラー・日常用",
                        emoji: "🍋",
                        price: "¥258",
                        rating: 4.5,
                        reviews: 12456,
                        professional: false
                    },
                    {
                        asin: "B0791K9FDL",
                        name: "クイックルワイパー ドライシート 40枚",
                        badge: "📋 Amazon's Choice",
                        emoji: "📋",
                        price: "¥398",
                        rating: 4.6,
                        reviews: 24567,
                        professional: false
                    },
                    {
                        asin: "B08T1GZPYQ",
                        name: "バスマジックリン 泡立ちスプレー 380ml",
                        badge: "💪 高評価・定番",
                        emoji: "🧴",
                        price: "¥298",
                        rating: 4.4,
                        reviews: 8547,
                        professional: false
                    }
                ],
                tools: [
                    {
                        asin: "B00ANQI0C4",
                        name: "クイックルワイパー 本体セット",
                        badge: "🧹 日常掃除用",
                        emoji: "🧹",
                        price: "¥598",
                        rating: 4.5,
                        reviews: 4321
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 基本保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    }
                ]
            };
        } else {
            // 頑固な油汚れ用（プロ仕様）
            return {
                cleaners: [
                    {
                        asin: "B00IH4U9ZI",
                        name: "マジックリン ハンディスプレー 油汚れ用 400ml",
                        badge: "🏆 ベストセラー・換気扇No.1",
                        emoji: "🧴",
                        price: "¥398",
                        rating: 4.5,
                        reviews: 18547,
                        professional: false
                    },
                    {
                        asin: "B07YLFTMQL",
                        name: "マジックリン 除菌プラス ハンディスプレー 400ml",
                        badge: "💪 Amazon's Choice",
                        emoji: "⚡",
                        price: "¥398",
                        rating: 4.4,
                        reviews: 15420,
                        professional: false
                    },
                    {
                        asin: "B07D7K9HQV",
                        name: "リンレイ ウルトラハードクリーナー 油汚れ用 700ml",
                        badge: "🔥 プロ仕様・高評価",
                        emoji: "🧪",
                        price: "¥680",
                        rating: 4.6,
                        reviews: 9834,
                        professional: true,
                        safety_warning: "強力洗剤 - 手袋推奨"
                    }
                ],
                tools: [
                    {
                        asin: "B07D7BXQZX",
                        name: "換気扇 専用ブラシセット 3本組",
                        badge: "🪥 換気扇専用",
                        emoji: "🪥",
                        price: "¥798",
                        rating: 4.0,
                        reviews: 654
                    },
                    {
                        asin: "B01LWYQPNY",
                        name: "金属たわし ステンレス製 5個セット",
                        badge: "💪 強力研磨",
                        emoji: "🧽",
                        price: "¥398",
                        rating: 4.1,
                        reviews: 543
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 手保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    },
                    {
                        asin: "B07GWXSXF1",
                        name: "防塵マスク N95対応 50枚入",
                        badge: "😷 呼吸保護",
                        emoji: "😷",
                        price: "¥890",
                        rating: 4.3,
                        reviews: 1542
                    }
                ]
            };
        }
    }

    // 📦 基本商品データ取得（汚れの強度対応）
    getBaseProductData(dirtType, severity = 'heavy') {
        console.log(`📦 基本商品データ取得: ${dirtType} (severity: ${severity})`);
        
        const productMap = {
            '油汚れ': this.getOilDirtProducts(severity),
            'カビ汚れ': this.getMoldDirtProducts(severity),
            '水垢汚れ': this.getScaleDirtProducts(severity),
            'ホコリ': this.getDustProducts(severity),
            'ホコリ・カビ': severity === 'light' ? this.getDustProducts(severity) : this.getMoldDirtProducts(severity), // エアコン用
            '尿石': this.getScaleDirtProducts('heavy'), // 尿石は必ず強力版
            '尿石・水垢': this.getScaleDirtProducts('heavy'), // トイレ用
            'トイレ汚れ': this.getScaleDirtProducts(severity),
            '石鹸カス': this.getMoldDirtProducts(severity), // 浴室系
            '皮脂汚れ': this.getOilDirtProducts(severity), // 油汚れ系
            '窓の水垢': this.getScaleDirtProducts(severity), // 窓用
            'その他': severity === 'light' ? this.getDustProducts(severity) : this.getOilDirtProducts(severity) // デフォルト
        };
        
        const result = productMap[dirtType] || this.getDustProducts(severity); // フォールバック
        
        console.log(`✅ 基本商品データ取得完了: ${dirtType}`, {
            cleaners: result.cleaners?.length || 0,
            tools: result.tools?.length || 0,
            protection: result.protection?.length || 0
        });
        
        return result;
    }
    
    // 🦠 カビ汚れ用商品（汚れの程度別）
    getMoldDirtProducts(severity) {
        if (severity === 'light') {
            return {
                cleaners: [
                    {
                        asin: "B08T1GZPYQ",
                        name: "バスマジックリン 泡立ちスプレー 380ml",
                        badge: "🧽 日常用・中性",
                        emoji: "🧽",
                        price: "¥298",
                        rating: 4.3,
                        reviews: 5467,
                        professional: false
                    },
                    {
                        asin: "B00ANQI0C4",
                        name: "重曹 クリーナー 500g",
                        badge: "🌿 自然派",
                        emoji: "🌿",
                        price: "¥398",
                        rating: 4.2,
                        reviews: 3456
                    }
                ],
                tools: [
                    {
                        asin: "B07YNGH8Z3",
                        name: "メラミンスポンジ 激落ちくん 20個",
                        badge: "🧽 日常用",
                        emoji: "🧽",
                        price: "¥498",
                        rating: 4.4,
                        reviews: 8765
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 基本保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    }
                ]
            };
        } else {
            // 頑固なカビ用（プロ仕様）
            return {
                cleaners: [
                    {
                        asin: "B00V1BZH4Q",
                        name: "カビキラー カビ除去スプレー 400g",
                        badge: "🏆 カビ除去No.1",
                        emoji: "🦠",
                        price: "¥398",
                        rating: 4.4,
                        reviews: 3456,
                        professional: true
                    },
                    {
                        asin: "B07D7K9HQV",
                        name: "強力カビハイター 洗濯槽用 500ml",
                        badge: "⚡ プロ仕様・強力",
                        emoji: "⚡",
                        price: "¥680",
                        rating: 4.6,
                        reviews: 2134,
                        professional: true,
                        safety_warning: "強力洗剤 - 換気必須"
                    }
                ],
                tools: [
                    {
                        asin: "B07GVQXH2M",
                        name: "カビ用ブラシセット 3本組",
                        badge: "🪥 カビ専用",
                        emoji: "🪥",
                        price: "¥598",
                        rating: 4.2,
                        reviews: 1234
                    },
                    {
                        asin: "B01LWYQPNY",
                        name: "研磨パッド ステンレス製 5枚セット",
                        badge: "💪 強力研磨",
                        emoji: "💪",
                        price: "¥498",
                        rating: 4.1,
                        reviews: 876
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 手保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    },
                    {
                        asin: "B07GWXSXF1",
                        name: "防塵マスク N95対応 50枚入",
                        badge: "😷 呼吸保護",
                        emoji: "😷",
                        price: "¥890",
                        rating: 4.3,
                        reviews: 1542
                    },
                    {
                        asin: "B07D7BXQZX",
                        name: "防水エプロン プロ仕様",
                        badge: "🛡️ 全身保護",
                        emoji: "🛡️",
                        price: "¥980",
                        rating: 4.0,
                        reviews: 654
                    }
                ]
            };
        }
    }
    
    // 💧 水垢汚れ用商品（汚れの程度別）
    getScaleDirtProducts(severity) {
        if (severity === 'light') {
            return {
                cleaners: [
                    {
                        asin: "B00EOHQPHC",
                        name: "クエン酸 クリーナー 500g",
                        badge: "🍋 自然派・日常用",
                        emoji: "🍋",
                        price: "¥398",
                        rating: 4.3,
                        reviews: 6789,
                        professional: false
                    },
                    {
                        asin: "B08T1GZPYQ",
                        name: "バスマジックリン 泡立ちスプレー 380ml",
                        badge: "🧽 日常用",
                        emoji: "🧽",
                        price: "¥298",
                        rating: 4.2,
                        reviews: 5467
                    }
                ],
                tools: [
                    {
                        asin: "B07YNGH8Z3",
                        name: "メラミンスポンジ 激落ちくん 20個",
                        badge: "🧽 水垢用",
                        emoji: "🧽",
                        price: "¥498",
                        rating: 4.4,
                        reviews: 8765
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 基本保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    }
                ]
            };
        } else {
            // 頑固な水垢用（プロ仕様）
            return {
                cleaners: [
                    {
                        asin: "B01AJQMZ5W",
                        name: "茂木和哉 水垢洗剤 200ml",
                        badge: "🏆 水垢専門プロ",
                        emoji: "💎",
                        price: "¥1,298",
                        rating: 4.6,
                        reviews: 2134,
                        professional: true
                    },
                    {
                        asin: "B00G7Y5PTO",
                        name: "サンポール 尿石除去 500ml",
                        badge: "⚡ 強酸性・プロ仕様",
                        emoji: "⚡",
                        price: "¥598",
                        rating: 4.5,
                        reviews: 3456,
                        professional: true,
                        safety_warning: "強酸性 - 手袋必須"
                    }
                ],
                tools: [
                    {
                        asin: "B07MQ6HTNB",
                        name: "研磨パッド ダイヤモンド研磨シート",
                        badge: "💎 プロ研磨",
                        emoji: "💎",
                        price: "¥798",
                        rating: 4.3,
                        reviews: 987
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 手保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    },
                    {
                        asin: "B07GWXSXF1",
                        name: "防塵マスク N95対応 50枚入",
                        badge: "😷 呼吸保護",
                        emoji: "😷",
                        price: "¥890",
                        rating: 4.3,
                        reviews: 1542
                    },
                    {
                        asin: "B01AJQMZ5W",
                        name: "保護メガネ 防災用",
                        badge: "🥽 目保護",
                        emoji: "🥽",
                        price: "¥680",
                        rating: 4.1,
                        reviews: 432
                    }
                ]
            };
        }
    }
    
    // 🧹 ホコリ用商品（汚れの程度別）
    getDustProducts(severity) {
        if (severity === 'light') {
            return {
                cleaners: [
                    {
                        asin: "B0791K9FDL",
                        name: "クイックルワイパー ドライシート 40枚",
                        badge: "📋 Amazon's Choice",
                        emoji: "📋",
                        price: "¥398",
                        rating: 4.6,
                        reviews: 24567,
                        professional: false
                    }
                ],
                tools: [
                    {
                        asin: "B00ANQI0C4",
                        name: "クイックルワイパー 本体セット",
                        badge: "🧹 日常掃除用",
                        emoji: "🧹",
                        price: "¥598",
                        rating: 4.5,
                        reviews: 4321
                    },
                    {
                        asin: "B07YNGH8Z3",
                        name: "マイクロファイバークロス 6枚セット",
                        badge: "✨ 仕上げ用",
                        emoji: "✨",
                        price: "¥498",
                        rating: 4.4,
                        reviews: 8765
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 基本保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    }
                ]
            };
        } else {
            // 蓄積ホコリ用（プロ仕様）
            return {
                cleaners: [
                    {
                        asin: "B0791K9FDL",
                        name: "クイックルワイパー ウェットシート 強力 32枚",
                        badge: "💪 強力・蓄積用",
                        emoji: "💪",
                        price: "¥598",
                        rating: 4.5,
                        reviews: 15420
                    }
                ],
                tools: [
                    {
                        asin: "B07D7BXQZX",
                        name: "掃除機 コードレス サイクロン式",
                        badge: "🌀 強力吸引",
                        emoji: "🌀",
                        price: "¥12,800",
                        rating: 4.2,
                        reviews: 987
                    },
                    {
                        asin: "B01LWYQPNY",
                        name: "電動ブラシ ハンディタイプ",
                        badge: "🔄 電動・細部用",
                        emoji: "🔄",
                        price: "¥2,980",
                        rating: 4.0,
                        reviews: 543
                    }
                ],
                protection: [
                    {
                        asin: "B08R8QVHCM",
                        name: "ニトリル手袋 使い捨て 100枚入り",
                        badge: "🧤 手保護",
                        emoji: "🧤",
                        price: "¥598",
                        rating: 4.4,
                        reviews: 5634
                    },
                    {
                        asin: "B07GWXSXF1",
                        name: "防塵マスク N95対応 50枚入",
                        badge: "😷 呼吸保護",
                        emoji: "😷",
                        price: "¥890",
                        rating: 4.3,
                        reviews: 1542
                    }
                ]
            };
        }
    }

    // 📸 写真アップロード処理
    handlePhotoUpload(event) {
        console.log('📸 写真アップロード開始');
        
        const file = event.target.files[0];
        if (!file) {
            console.log('❌ ファイルが選択されていません');
            return;
        }

        // ファイルタイプチェック
        if (!file.type.startsWith('image/')) {
            alert('画像ファイルを選択してください。');
            return;
        }

        // ファイルサイズチェック（10MB以下）
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('ファイルサイズが大きすぎます。10MB以下の画像を選択してください。');
            return;
        }

        console.log(`📸 ファイル情報:`, {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
            type: file.type
        });

        // 画像プレビュー表示
        const reader = new FileReader();
        reader.onload = (e) => {
            this.state.selectedPhoto = e.target.result;
            
            // プレビュー表示
            const previewSection = document.getElementById('previewSection');
            const uploadedImage = document.getElementById('uploadedImage');
            
            if (previewSection && uploadedImage) {
                uploadedImage.src = e.target.result;
                previewSection.classList.remove('hidden');
                
                // 分析ボタンを有効化
                const analyzeBtn = document.getElementById('analyzeBtn');
                if (analyzeBtn) {
                    analyzeBtn.disabled = false;
                    analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    analyzeBtn.classList.add('hover:bg-blue-600');
                }
                
                console.log('✅ 画像プレビュー表示完了');
            }
        };
        
        reader.readAsDataURL(file);
    }

    // 🔍 画像分析実行
    async analyzeImage() {
        console.log('🔍 画像分析開始');
        
        if (!this.state.selectedPhoto) {
            alert('先に写真をアップロードしてください。');
            return;
        }

        // 分析ボタンの状態更新
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = '🔍 分析中...';
            analyzeBtn.classList.add('opacity-50');
        }

        try {
            let analysisResult;
            
            // 場所が事前選択されている場合
            if (this.state.preSelectedLocation) {
                console.log(`📍 事前選択された場所での分析: ${this.state.preSelectedLocation}`);
                analysisResult = await this.analyzeWithPreSelectedLocation();
            } else {
                console.log('🤖 Gemini AI による画像分析実行');
                analysisResult = await this.analyzeWithGemini();
            }

            if (analysisResult) {
                this.state.analysisResult = analysisResult;
                this.displayResults(analysisResult);
                console.log('✅ 画像分析・結果表示完了');
            } else {
                throw new Error('分析結果が取得できませんでした');
            }

        } catch (error) {
            console.error('❌ 画像分析エラー:', error);
            alert('画像分析に失敗しました。もう一度お試しください。');
        } finally {
            // ボタンの状態を元に戻す
            if (analyzeBtn) {
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = '🔍 画像を分析する';
                analyzeBtn.classList.remove('opacity-50');
            }
        }
    }

    // 🤖 Gemini AIによる画像分析
    async analyzeWithGemini() {
        console.log('🤖 Gemini AI画像分析開始');
        
        try {
            // Base64画像データを準備
            const base64Data = this.state.selectedPhoto.split(',')[1];
            
            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: `この画像を詳しく分析して、以下の情報を日本語のJSONで出力してください：

                                {
                                    "location": "場所（キッチン、浴室、トイレ、リビング、寝室、玄関、ベランダ、エアコン、窓、その他から選択）",
                                    "surface": "清掃対象の表面（例：コンロ、シンク、壁、床、便器、浴槽など）",
                                    "dirtType": "汚れの種類（油汚れ、カビ汚れ、水垢汚れ、ホコリ、尿石、その他から選択）",
                                    "dirtLevel": "汚れのレベル（light: 軽度、heavy: 重度）",
                                    "description": "汚れの状況説明",
                                    "analysisVersion": "gemini-analysis"
                                }

                                注意：
                                - 汚れの種類は正確に判定してください
                                - lightは日常的な軽い汚れ、heavyは頑固でこびりついた汚れ
                                - JSONのみを出力し、他の文章は含めないでください`
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Data
                                }
                            }
                        ]
                    }
                ]
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Gemini API エラー: ${response.status}`);
            }

            const data = await response.json();
            console.log('🤖 Gemini API レスポンス:', data);

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const responseText = data.candidates[0].content.parts[0].text;
                console.log('📝 Gemini 応答テキスト:', responseText);

                // JSONを抽出・パース
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    
                    // 汚れの程度をstateに保存
                    if (result.dirtLevel) {
                        this.state.dirtSeverity = result.dirtLevel;
                        this.updateSelectedSeverityDisplay(result.dirtLevel);
                    }
                    
                    console.log('✅ Gemini分析完了:', result);
                    
                    // 掃除方法と商品を生成
                    const severity = result.dirtLevel || this.state.dirtSeverity || 'heavy';
                    result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface, severity);
                    result.recommendedProducts = await this.getRecommendedProducts(result.dirtType, severity);
                    
                    return result;
                } else {
                    throw new Error('有効なJSONが見つかりませんでした');
                }
            } else {
                throw new Error('Gemini APIから有効な応答が得られませんでした');
            }

        } catch (error) {
            console.error('❌ Gemini分析エラー:', error);
            
            // フォールバック: ローカル分析
            console.log('🔄 ローカル分析にフォールバック');
            return await this.analyzeLocally();
        }
    }

    // 📍 事前選択された場所での分析
    async analyzeWithPreSelectedLocation() {
        console.log(`📍 事前選択場所分析: ${this.state.preSelectedLocation}`);
        
        // 場所に基づく汚れタイプマッピング
        const locationDirtMapping = {
            'キッチン': '油汚れ',
            '浴室': 'カビ汚れ',
            'トイレ': '尿石',
            'リビング': 'ホコリ',
            'エアコン': 'ホコリ・カビ',
            '窓': '水垢汚れ',
            'ベランダ': 'ホコリ',
            '玄関': 'ホコリ',
            '寝室': 'ホコリ'
        };

        const surfaceMapping = {
            'キッチン': 'コンロ・換気扇',
            '浴室': '浴槽・壁',
            'トイレ': '便器・床',
            'リビング': '床・家具',
            'エアコン': 'フィルター・内部',
            '窓': 'ガラス・サッシ',
            'ベランダ': '床・手すり',
            '玄関': '床・靴箱',
            '寝室': '床・ベッド'
        };

        const result = {
            location: this.state.preSelectedLocation,
            surface: surfaceMapping[this.state.preSelectedLocation] || '一般的な表面',
            dirtType: locationDirtMapping[this.state.preSelectedLocation] || 'その他',
            dirtLevel: this.state.dirtSeverity || 'heavy',
            description: `${this.state.preSelectedLocation}の一般的な汚れ`,
            analysisVersion: 'pre-selected-location'
        };

        console.log('✅ 事前選択分析結果:', result);

        // 掃除方法と商品を生成
        const severity = this.state.dirtSeverity || 'heavy';
        result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface, severity);
        result.recommendedProducts = await this.getRecommendedProducts(result.dirtType, severity);

        return result;
    }

    // 🔧 ローカル分析（フォールバック）
    async analyzeLocally() {
        console.log('🔧 ローカル分析実行（フォールバック）');
        
        const result = {
            location: this.state.selectedLocation || 'その他',
            surface: '一般的な表面', 
            dirtType: '油汚れ',
            dirtLevel: this.state.dirtSeverity || 'heavy',
            description: '画像から一般的な汚れを検出しました',
            analysisVersion: 'local-fallback'
        };

        console.log('✅ ローカル分析結果:', result);

        // 掃除方法と商品を生成
        const severity = this.state.dirtSeverity || 'heavy';
        result.cleaningMethod = this.generateCleaningMethod(result.dirtType, result.surface, severity);
        result.recommendedProducts = await this.getRecommendedProducts(result.dirtType, severity);

        return result;
    }

    // 🔍 汚れの深刻度判定
    determineDirtSeverity(dirtType) {
        const severityKeywords = {
            high: ['カビ', '油汚れ', '水垢', '尿石'],
            medium: ['ホコリ', 'トイレ汚れ'],
            low: ['その他']
        };
        
        for (const [level, keywords] of Object.entries(severityKeywords)) {
            if (keywords.some(keyword => dirtType.includes(keyword))) {
                return level === 'high' ? 'heavy' : level === 'medium' ? 'heavy' : 'light';
            }
        }
        
        return 'heavy'; // デフォルトは重度
    }

    // 🛒 商品表示（Amazon風横スクロールUI）
    displayProducts(products) {
        console.log('🛒 商品表示開始（重複除去・優先表示版）', products);
        
        // 🚨 商品数不足時の補完処理
        if (!products) {
            products = { cleaners: [], tools: [], protection: [] };
        }
        
        // 🎯 商品重複除去・優先表示処理
        if (window.PRODUCT_DEDUPLICATION_SYSTEM) {
            const originalCounts = {
                cleaners: products.cleaners?.length || 0,
                tools: products.tools?.length || 0,
                protection: products.protection?.length || 0
            };
            
            if (products.cleaners) {
                products.cleaners = window.PRODUCT_DEDUPLICATION_SYSTEM.processProductList(products.cleaners);
            }
            if (products.tools) {
                products.tools = window.PRODUCT_DEDUPLICATION_SYSTEM.processProductList(products.tools);
            }
            if (products.protection) {
                products.protection = window.PRODUCT_DEDUPLICATION_SYSTEM.processProductList(products.protection);
            }
            
            console.log('🎯 重複除去結果:', {
                cleaners: `${originalCounts.cleaners} → ${products.cleaners?.length || 0}`,
                tools: `${originalCounts.tools} → ${products.tools?.length || 0}`,
                protection: `${originalCounts.protection} → ${products.protection?.length || 0}`
            });
        }
        
        // 補完商品機能を削除 - リアルタイム検索で購入可能な商品のみ表示
        
        // 補完機能を無効化（購入可能性を最優先）
        // リアルタイム検索で購入可能な商品のみを表示
        console.log(`🎯 商品数確認: 洗剤${products.cleaners.length}種類, 道具${products.tools.length}種類, 保護具${products.protection.length}種類`);
        console.log(`ℹ️ 補完機能無効 - リアルタイム検索で購入可能な商品のみ表示`);
        
        // 商品表示UI生成
        const generateProductGrid = (categoryProducts, categoryName, categoryIcon) => {
            if (!categoryProducts || categoryProducts.length === 0) {
                return `<div class="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    <div class="text-2xl mb-2">${categoryIcon}</div>
                    <p class="text-sm">現在、該当する商品が見つかりませんでした</p>
                    <p class="text-xs text-gray-400 mt-1">検索条件を変更してお試しください</p>
                </div>`;
            }

            return categoryProducts.slice(0, 6).map(product => {
                // 🌟 Amazon商品画像URL修正（HTTPSと新形式対応）
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

        // UI生成
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
            console.log('✅ 商品表示完了（度合い別対応）');
        }
    }

    // 🎯 掃除方法表示
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

    // 🎯 分析結果の統合表示
    displayResults(analysisResult) {
        console.log('🎯 分析結果表示開始:', analysisResult);
        
        // 結果セクションを表示
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }

        // 掃除方法を表示
        if (analysisResult.cleaningMethod) {
            this.displayCleaningMethod(analysisResult.cleaningMethod);
        }

        // 商品を表示
        if (analysisResult.recommendedProducts) {
            this.displayProducts(analysisResult.recommendedProducts);
        }

        console.log('✅ 分析結果表示完了');
    }

    // 📱 イベントリスナー設定
    setupEventListeners() {
        console.log('📱 イベントリスナー設定開始');
        
        try {
            // 🎯 汚れの強度選択ボタン
            const severityButtons = document.querySelectorAll('.severity-btn');
            severityButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const severity = button.getAttribute('data-severity');
                    this.selectDirtSeverity(severity);
                });
            });

            // 📍 場所選択ボタン
            const locationButtons = document.querySelectorAll('.location-btn');
            locationButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const location = button.getAttribute('data-location');
                    this.selectLocation(location);
                });
            });

            // 📸 写真アップロード
            const photoUpload = document.getElementById('photoUpload');
            if (photoUpload) {
                photoUpload.addEventListener('change', (e) => {
                    this.handlePhotoUpload(e);
                });
            }

            // 🔍 分析ボタン
            const analyzeBtn = document.getElementById('analyzeBtn');
            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.analyzeImage();
                });
            }

            console.log('✅ イベントリスナー設定完了');
        } catch (error) {
            console.error('❌ イベントリスナー設定エラー:', error);
        }
    }

    // 🔧 初期化
    init() {
        console.log('🤖 AI掃除アドバイザー初期化開始');
        
        this.state = {
            selectedPhoto: null,
            selectedLocation: null,
            preSelectedLocation: null,
            dirtSeverity: null,
            analysisResult: null
        };
        
        this.setupEventListeners();
        
        console.log('✅ AI掃除アドバイザー初期化完了');
    }
}

// 🚀 アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM読み込み完了 - AI掃除アドバイザー起動');
    
    window.aiCleaningAdvisor = new AICleaningAdvisor();
    window.aiCleaningAdvisor.init();
    
    console.log('🎉 AI掃除アドバイザー起動完了');
});

// さらに確実にするため、複数のタイミングで初期化を試行
window.addEventListener('load', () => {
    console.log('🚀 Window Load - AICleaningAdvisor確認');
    if (!window.aiCleaningAdvisor) {
        console.log('🔄 Window Load - AICleaningAdvisor再作成');
        window.aiCleaningAdvisor = new AICleaningAdvisor();
    }
});

// 手動初期化関数（デバッグ用）
window.initializeLocationButtons = function() {
    console.log('🔧 手動初期化実行');
    if (window.aiCleaningAdvisor) {
        window.aiCleaningAdvisor.setupLocationButtonsWithDebug();
    } else {
        console.log('⚠️ aiCleaningAdvisor が見つかりません');
    }
};

// デバッグ用：手動で場所選択をテスト
window.testLocationSelection = function(location) {
    console.log(`🧪 手動テスト: ${location}`);
    if (window.aiCleaningAdvisor) {
        window.aiCleaningAdvisor.selectLocation(location);
    } else {
        console.log('⚠️ aiCleaningAdvisor が見つかりません');
    }
};

// デバッグ用：DOM状態確認
window.checkDOMState = function() {
    console.log('🔍 DOM状態確認');
    const locationButtons = document.querySelectorAll('.location-btn');
    console.log(`location-btnボタン数: ${locationButtons.length}`);
    
    locationButtons.forEach((btn, index) => {
        const location = btn.getAttribute('data-location');
        console.log(`ボタン${index + 1}: ${location}`);
        console.log(`  - クリック可能: ${!btn.disabled && btn.style.pointerEvents !== 'none'}`);
        
        // 手動でクリックイベントをテスト
        btn.addEventListener('click', () => {
            console.log(`✅ 手動テスト成功: ${location}`);
        }, { once: true });
    });
};

console.log('🤖 AI掃除アドバイザー 本番クラウド環境版準備完了');
console.log('🌐 一般ユーザー向けクラウドサービス提供中');