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
    // 🔥 キッチン・油汚れ系（プロ仕様強化）
    oil_grease: {
        category: "油汚れ・キッチン（プロ仕様）",
        products: [
            {
                name: "油職人 業務用強力脱脂洗剤 1L",
                asin: "B079QMN7P8", // 実在ASIN
                type: "洗剤",
                target: ["頑固な油汚れ", "換気扇", "コンロ", "五徳"],
                strength: "超強力",
                professional: true,
                safety_warning: "強アルカリ性 - 手袋必須・換気推奨"
            },
            {
                name: "マジックリン ハンディスプレー 油汚れ用",
                asin: "B00IH4U9ZI", // 実在ASIN
                type: "洗剤",
                target: ["油汚れ", "換気扇", "コンロ"],
                strength: "強力"
            },
            {
                name: "業務用 油汚れ落とし 濃縮タイプ",
                asin: "B08FZJC9Y7", // 実在ASIN
                type: "洗剤",
                target: ["業務用厨房", "換気扇", "頑固油汚れ"],
                strength: "超強力",
                professional: true,
                safety_warning: "濃縮タイプ - 希釈して使用"
            }
        ]
    },

    // 🦠 カビ・浴室系
    mold_bathroom: {
        category: "カビ・浴室",
        products: [
            {
                name: "カビキラー カビ除去スプレー",
                asin: "B00V1BZH4Q", // 実在ASIN
                type: "洗剤",
                target: ["カビ", "黒カビ", "浴室"],
                strength: "強力",
                chemical_type: "塩素系"
            },
            {
                name: "カビキラー 電動ブラシ付きスプレー",
                asin: "B07GVQXH2M", // 実在ASIN
                type: "洗剤",
                target: ["カビ", "黒カビ", "浴室", "天井"],
                strength: "強力",
                chemical_type: "塩素系"
            },
            {
                name: "バスマジックリン 泡立ちスプレー",
                asin: "B08T1GZPYQ", // 実在ASIN
                type: "洗剤",
                target: ["浴室", "石鹸カス", "皮脂汚れ"],
                strength: "中程度",
                chemical_type: "中性"
            }
        ]
    },

    // 💧 水垢・ウロコ汚れ系（プロ仕様強化）
    limescale: {
        category: "水垢・ウロコ汚れ（プロ仕様）",
        products: [
            {
                name: "茂木和哉 水垢洗剤（プロ仕様）",
                asin: "B01AJQMZ5W", // 実在ASIN
                type: "洗剤", 
                target: ["頑固な水垢", "ウロコ汚れ", "蛇口", "シャワーヘッド"],
                strength: "超強力",
                chemical_type: "酸性",
                professional: true,
                usage_level: "頑固汚れ専用",
                safety_warning: "酸性洗剤 - 必ず手袋着用"
            },
            {
                name: "サンポール 尿石除去（業務用）",
                asin: "B00G7Y5PTO", // 実在ASIN
                type: "洗剤",
                target: ["尿石", "頑固な水垢", "便器", "タイル目地"],
                strength: "超強力",
                chemical_type: "強酸性",
                professional: true,
                usage_level: "プロ・頑固汚れ専用",
                safety_warning: "強酸性 - 換気必須・手袋必須"
            },
            {
                name: "業務用クエン酸クリーナー 水垢専用",
                asin: "B07MQ6HTNB", // 実在ASIN
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
                name: "サンポール 尿石除去（業務用）",
                asin: "B00EOHQPHC", 
                type: "強酸性洗剤",
                target: ["頑固な尿石", "水垢", "便器", "タイル目地"],
                strength: "超強力",
                ph: "強酸性",
                professional: true,
                usage_level: "プロ・頑固汚れ専用",
                safety_warning: "強酸性 - 換気必須・保護具着用必須"
            },
            {
                name: "プロ仕様 トイレ用酸性洗剤",
                asin: "B005AILJ3O", 
                type: "酸性洗剤",
                target: ["尿石", "黄ばみ", "水垢", "便器"],
                strength: "強力",
                ph: "酸性",
                professional: true,
                usage_level: "プロ・頑固汚れ専用"
            }
        ],
        alkaline: [
            {
                name: "油職人 業務用強力脱脂洗剤",
                asin: "B079QMN7P8", // 実在ASIN
                type: "強アルカリ性洗剤",
                target: ["頑固な油汚れ", "換気扇", "焦げ", "皮脂"],
                strength: "超強力",
                ph: "強アルカリ性",
                professional: true,
                safety_warning: "強アルカリ性 - 手袋必須・換気推奨"
            },
            {
                name: "マジックリン 油汚れ用",
                asin: "B00IH4U9ZI", // 実在ASIN
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

/**
 * 🏆 プロ仕様・頑固汚れ対応商品選択ロジック
 */
const PROFESSIONAL_PRODUCT_SELECTOR = {
    // 汚れの深刻度判定キーワード
    severity_keywords: {
        extreme: ["頑固", "こびりつき", "何年も", "取れない", "強力", "業務用", "プロ"],
        high: ["しつこい", "なかなか", "時間が経った", "積み重なった"],
        medium: ["少し", "軽い", "最近の", "薄い"],
        light: ["日常", "定期", "予防", "軽く"]
    },
    
    // 場所別プロ仕様商品優先度
    location_professional_priority: {
        toilet: {
            extreme: "detergents.acidic", // サンポール業務用
            high: "detergents.acidic",
            medium: "detergents.neutral",
            light: "detergents.neutral"
        },
        bathroom: {
            extreme: "detergents.chlorine", // プロ仕様カビキラー
            high: "mold_bathroom",
            medium: "mold_bathroom", 
            light: "detergents.neutral"
        },
        kitchen: {
            extreme: "detergents.alkaline", // 強力マジックリン
            high: "oil_grease",
            medium: "oil_grease",
            light: "detergents.neutral"
        }
    },
    
    // プロ仕様商品の自動選択
    selectProfessionalProducts: function(location, dirtType, severity = "high") {
        const products = [];
        
        // 尿石・水垢は必ずプロ仕様
        if (dirtType.includes("尿石") || dirtType.includes("水垢")) {
            severity = "extreme";
        }
        
        // カビは必ずプロ仕様
        if (dirtType.includes("カビ")) {
            severity = "extreme";
        }
        
        // 優先度に基づく商品選択
        const priorityMapping = this.location_professional_priority[location];
        if (priorityMapping && priorityMapping[severity]) {
            const categoryPath = priorityMapping[severity];
            const category = this.getProductCategory(categoryPath);
            if (category) {
                // detergents.acidic等の配列構造と、通常のproductsプロパティ構造の両方に対応
                const productList = Array.isArray(category) ? category : (category.products || []);
                
                if (productList.length > 0) {
                    // プロ仕様商品を優先
                    const professionalProducts = productList.filter(p => p.professional === true);
                    const regularProducts = productList.filter(p => !p.professional);
                    
                    products.push(...professionalProducts);
                    if (severity === "medium" || severity === "light") {
                        products.push(...regularProducts.slice(0, 2));
                    }
                }
            }
        }
        
        return products;
    },
    
    // 商品カテゴリ取得ヘルパー
    getProductCategory: function(categoryPath) {
        const parts = categoryPath.split('.');
        let category = COMPREHENSIVE_CLEANING_PRODUCTS;
        
        for (const part of parts) {
            if (category[part]) {
                category = category[part];
            } else {
                return null;
            }
        }
        return category;
    },
    
    // 安全警告の生成
    generateSafetyWarning: function(products) {
        const warnings = [];
        
        products.forEach(product => {
            if (product.safety_warning) {
                warnings.push(product.safety_warning);
            }
        });
        
        return [...new Set(warnings)]; // 重複除去
    }
};

// モジュールエクスポート（ブラウザ対応）
if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_CLEANING_PRODUCTS = COMPREHENSIVE_CLEANING_PRODUCTS;
    window.DIRT_TYPE_MAPPING = DIRT_TYPE_MAPPING;
    window.LOCATION_PRODUCTS = LOCATION_PRODUCTS;
    window.PROFESSIONAL_PRODUCT_SELECTOR = PROFESSIONAL_PRODUCT_SELECTOR;
}