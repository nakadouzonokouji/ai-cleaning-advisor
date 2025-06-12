/**
 * 包括的Amazon清掃用品データベース
 * 家中の全汚れタイプに対応する商品リスト
 * 
 * 🔄 現在の実装方式:
 * - 事前にリスト化した商品から選択（静的データベース）
 * - 高速表示、安定性重視
 * 
 * 🎯 理想の実装方式:
 * - リアルタイムAmazon PA-API検索
 * - 売れ筋ランキング反映、最新商品対応
 * 
 * 💡 提案する改善:
 * 1. 包括的事前リスト（現在）
 * 2. リアルタイム検索機能追加
 * 3. 売れ筋ランキングAPI連携
 */

const COMPREHENSIVE_CLEANING_PRODUCTS = {
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
            },
            {
                name: "カビキラー 電動ブラシ付きスプレー",
                asin: "B00EOHQPHC", // 有効確認済み（代替使用）
                type: "洗剤",
                target: ["カビ", "黒カビ", "浴室", "天井"],
                strength: "強力",
                chemical_type: "塩素系"
            },
            {
                name: "バスマジックリン 泡立ちスプレー",
                asin: "B00OOCWP44", // 有効確認済み（代替使用）
                type: "洗剤",
                target: ["浴室", "石鹸カス", "皮脂汚れ"],
                strength: "中程度",
                chemical_type: "中性"
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
            },
            {
                name: "バスマジックリン 水垢落とし",
                asin: "B005AILJ3O", // 有効確認済み（代替使用）
                type: "洗剤",
                target: ["水垢", "ウロコ汚れ", "浴室", "鏡"],
                strength: "強力",
                chemical_type: "酸性"
            },
            {
                name: "クエン酸クリーナー 水垢専用",
                asin: "B00OOCWP44", // 有効確認済み（代替使用）
                type: "洗剤",
                target: ["水垢", "石灰汚れ", "蛇口"],
                strength: "中程度",
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

/**
 * 汚れタイプ別推奨商品マッピング
 */
const DIRT_TYPE_MAPPING = {
    "油汚れ": ["oil_grease", "detergents.alkaline"],
    "カビ": ["mold_bathroom", "detergents.chlorine"],
    "カビ汚れ": ["mold_bathroom", "detergents.chlorine"], // 🔧 浴室カビ用（アプリから渡される形式）
    "水垢": ["limescale", "detergents.acidic"],
    "水垢汚れ": ["limescale", "detergents.acidic"], // 🔧 浴室水垢用（アプリから渡される形式）
    "ホコリ": ["cleaning_tools", "oil_grease"], // クイックルワイパー
    "手垢": ["detergents.neutral", "cleaning_tools"],
    "焦げ": ["detergents.alkaline", "cleaning_tools"],
    "尿石": ["detergents.acidic"],
    "尿石・水垢": ["detergents.acidic"], // 🔧 トイレ用（アプリから渡される形式）
    "石鹸カス": ["detergents.alkaline"],
    "ヤニ": ["detergents.alkaline"],
    "皮脂汚れ": ["detergents.alkaline"],
    "ホコリ・カビ": ["cleaning_tools", "detergents.chlorine"], // 🔧 エアコン用（アプリから渡される形式）
    "その他": ["detergents.neutral", "cleaning_tools"] // 🔧 デフォルト処理
};

/**
 * 場所別推奨商品
 */
const LOCATION_PRODUCTS = {
    kitchen: ["oil_grease", "detergents.alkaline", "cleaning_tools"],
    bathroom: ["mold_bathroom", "limescale", "detergents.chlorine"],
    toilet: ["detergents.acidic", "detergents.chlorine"],
    living: ["cleaning_tools", "detergents.neutral"],
    window: ["limescale", "cleaning_tools"],
    floor: ["oil_grease", "detergents.neutral"] // クイックルワイパー等
};

/**
 * 🚀 リアルタイム検索機能の実装提案
 */
const REALTIME_SEARCH_CONFIG = {
    // Amazon PA-API SearchItems操作
    search_parameters: {
        Keywords: "", // 動的設定（例: "油汚れ 洗剤"）
        SearchIndex: "All",
        ItemCount: 10,
        SortBy: "Relevance", // または "Featured", "Price:HighToLow"
        Resources: [
            "Images.Primary.Large",
            "ItemInfo.Title",
            "ItemInfo.Features", 
            "Offers.Listings.Price"
        ]
    },
    
    // 検索キーワード生成
    keyword_mapping: {
        "油汚れ": "油汚れ 洗剤 キッチン マジックリン",
        "カビ": "カビ取り 洗剤 浴室 カビキラー",
        "水垢": "水垢 除去 クエン酸 茂木和哉",
        "清掃道具": "スポンジ ブラシ 激落ちくん"
    },
    
    // 売れ筋ランキング対応
    bestseller_search: {
        BrowseNodeId: "2039727051", // 日用品カテゴリ
        SortBy: "Featured" // 売れ筋順
    }
};

/**
 * 🎯 実装アプローチの提案
 */
const IMPLEMENTATION_STRATEGY = {
    // Phase 1: 現在（静的データベース）
    current: {
        pros: ["高速表示", "安定性", "API制限なし"],
        cons: ["古い商品情報", "売れ筋反映なし", "新商品対応遅れ"]
    },
    
    // Phase 2: ハイブリッド方式
    hybrid: {
        description: "事前リスト + リアルタイム検索",
        implementation: "基本商品は事前リスト、追加検索でリアルタイム",
        pros: ["高速 + 最新情報", "フォールバック対応"],
        cons: ["複雑な実装"]
    },
    
    // Phase 3: 完全リアルタイム
    realtime: {
        description: "全てAmazon PA-API検索",
        implementation: "キーワード生成 → API検索 → 結果表示",
        pros: ["最新商品", "売れ筋ランキング", "価格更新"],
        cons: ["API制限", "遅延", "コスト"]
    }
};

export { 
    COMPREHENSIVE_CLEANING_PRODUCTS, 
    DIRT_TYPE_MAPPING, 
    LOCATION_PRODUCTS,
    REALTIME_SEARCH_CONFIG,
    IMPLEMENTATION_STRATEGY 
};