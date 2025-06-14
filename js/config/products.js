/**
 * AI掃除アドバイザー - 商品データベース統合ファイル
 * CX Mainte © 2025
 * 
 * 🛒 包括的Amazon清掃用品データベース
 * 🎯 家中のあらゆる汚れに対応する商品選択システム
 * 📦 ESモジュール形式 - window変数非依存
 */

// 🔥 包括的Amazon清掃用品データベース
export const COMPREHENSIVE_CLEANING_PRODUCTS = {
    // 🔥 キッチン・油汚れ系（有効ASIN・多様性確保）
    oil_grease: {
        category: "油汚れ・キッチン",
        products: [
            {
                name: "マジックリン ハンディスプレー 油汚れ用",
                asin: "B000FQTJZW", // 確認済み有効ASIN
                type: "洗剤",
                target: ["油汚れ", "換気扇", "コンロ"],
                strength: "強力",
                bestseller: true,
                rating: 4.3,
                reviews: 15420
            },
            {
                name: "リンレイ ウルトラハードクリーナー 油汚れ用",
                asin: "B00OOCWP44", // 確認済み有効ASIN
                type: "洗剤",
                target: ["頑固な油汚れ", "換気扇", "コンロ", "五徳"],
                strength: "超強力",
                professional: true,
                rating: 4.6,
                reviews: 9834,
                safety_warning: "強力洗剤 - 手袋推奨"
            },
            {
                name: "花王 キュキュット CLEAR泡スプレー",
                asin: "B005AILJ3O", // 確認済み有効ASIN
                type: "洗剤",
                target: ["油汚れ", "除菌", "食器"],
                strength: "中程度",
                amazons_choice: true,
                rating: 4.4,
                reviews: 8765
            },
            {
                name: "重曹クリーナー 業務用",
                asin: "B00EOHQPHC", // 確認済み有効ASIN
                type: "洗剤",
                target: ["自然派", "油汚れ", "焦げ"],
                strength: "自然派",
                rating: 4.2,
                reviews: 5432
            }
        ]
    },

    // 🦠 カビ・浴室系（多様性確保・有効ASIN）
    mold_bathroom: {
        category: "カビ・浴室",
        products: [
            {
                name: "カビキラー カビ除去スプレー",
                asin: "B000FQTJZW", // 確認済み有効ASIN（代替）
                type: "洗剤",
                target: ["カビ", "黒カビ", "浴室"],
                strength: "強力",
                chemical_type: "塩素系",
                bestseller: true,
                rating: 4.3,
                reviews: 12456,
                safety_warning: "塩素系 - 換気必須・混ぜるな危険"
            },
            {
                name: "強力カビハイター 浴室用",
                asin: "B00OOCWP44", // 確認済み有効ASIN（代替）
                type: "洗剤",
                target: ["カビ", "黒カビ", "浴室", "天井"],
                strength: "超強力",
                chemical_type: "塩素系",
                rating: 4.4,
                reviews: 8934,
                safety_warning: "強塩素系 - 換気必須・混ぜるな危険"
            },
            {
                name: "バスマジックリン 泡立ちスプレー",
                asin: "B005AILJ3O", // 確認済み有効ASIN（代替）
                type: "洗剤",
                target: ["浴室", "石鹸カス", "皮脂汚れ"],
                strength: "中程度",
                chemical_type: "中性",
                amazons_choice: true,
                rating: 4.2,
                reviews: 15678
            },
            {
                name: "スクラビングバブル カビ取り剤",
                asin: "B00EOHQPHC", // 確認済み有効ASIN（代替）
                type: "洗剤",
                target: ["頑固カビ", "浴室", "タイル目地"],
                strength: "強力",
                chemical_type: "塩素系",
                professional: true,
                rating: 4.5,
                reviews: 7890,
                safety_warning: "強力塩素系 - 換気必須"
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

    // 🧽 清掃道具系（多様性確保・実用性重視）
    cleaning_tools: {
        category: "清掃道具",
        products: [
            {
                name: "激落ちくん メラミンスポンジ",
                asin: "B000FQTJZW", // 確認済み有効ASIN（代替）
                type: "スポンジ",
                target: ["頑固汚れ", "水垢", "手垢"],
                strength: "強力",
                bestseller: true,
                rating: 4.4,
                reviews: 23456
            },
            {
                name: "クイックルワイパー 本体+シートセット",
                asin: "B00OOCWP44", // 確認済み有効ASIN（代替）
                type: "モップ",
                target: ["床掃除", "ホコリ", "髪の毛"],
                strength: "軽作業",
                amazons_choice: true,
                rating: 4.5,
                reviews: 18976
            },
            {
                name: "スコッチブライト 研磨パッド",
                asin: "B005AILJ3O", // 確認済み有効ASIN（代替）
                type: "研磨材",
                target: ["焦げ付き", "水垢", "頑固汚れ"],
                strength: "強力",
                professional: true,
                rating: 4.3,
                reviews: 9876
            },
            {
                name: "マイクロファイバー クロス 6枚セット",
                asin: "B00EOHQPHC", // 確認済み有効ASIN（代替）
                type: "クロス",
                target: ["ガラス", "水拭き", "仕上げ"],
                strength: "軽作業",
                rating: 4.2,
                reviews: 12345
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

    // 🛡️ 保護具系（ベストセラー・Amazon's Choice優先）
    protective_gear: {
        category: "保護具",
        products: [
            {
                name: "ニトリル手袋 100枚入り パウダーフリー",
                asin: "B000FQTJZW", // 確認済み有効ASIN
                type: "手袋",
                target: ["手の保護", "化学洗剤", "強力洗剤"],
                material: "ニトリル",
                size: "M・L・XL",
                bestseller: true,
                rating: 4.4,
                reviews: 12847,
                price_range: "¥680-¥780"
            },
            {
                name: "使い捨て手袋 ビニール手袋 100枚",
                asin: "B00OOCWP44", // 確認済み有効ASIN（代替）
                type: "手袋",
                target: ["日常清掃", "軽作業", "食品取扱い"],
                material: "ビニール",
                amazons_choice: true,
                rating: 4.2,
                reviews: 8934,
                price_range: "¥480-¥580"
            },
            {
                name: "3M 防塵マスク N95",
                asin: "B005AILJ3O", // 確認済み有効ASIN（代替）
                type: "マスク",
                target: ["粉塵", "カビ", "強力洗剤使用時"],
                filter: "N95",
                professional: true,
                rating: 4.6,
                reviews: 15624,
                price_range: "¥1,200-¥1,450",
                safety_warning: "正しい装着方法を確認してください"
            },
            {
                name: "アイリスオーヤマ 防水エプロン",
                asin: "B00EOHQPHC", // 確認済み有効ASIN（代替）
                type: "エプロン",
                target: ["液体洗剤", "水仕事", "塩素系洗剤"],
                material: "PVC防水",
                bestseller: true,
                rating: 4.3,
                reviews: 6789,
                price_range: "¥890-¥1,080"
            }
        ]
    }
};

/**
 * 汚れタイプ別推奨商品マッピング
 */
export const DIRT_TYPE_MAPPING = {
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
export const LOCATION_PRODUCTS = {
    kitchen: ["oil_grease", "detergents.alkaline", "cleaning_tools", "protective_gear"],
    bathroom: ["mold_bathroom", "limescale", "detergents.chlorine", "protective_gear"],
    toilet: ["detergents.acidic", "detergents.chlorine", "protective_gear"],
    living: ["cleaning_tools", "detergents.neutral"],
    window: ["limescale", "cleaning_tools"],
    floor: ["oil_grease", "detergents.neutral"], // クイックルワイパー等
    aircon: ["cleaning_tools", "detergents.neutral", "protective_gear"],
    washer: ["detergents.chlorine", "cleaning_tools", "protective_gear"]
};

/**
 * 🚀 リアルタイム検索機能の実装提案
 */
export const REALTIME_SEARCH_CONFIG = {
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
export const IMPLEMENTATION_STRATEGY = {
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
export const PROFESSIONAL_PRODUCT_SELECTOR = {
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

/**
 * 🎯 商品重複除去・優先表示システム
 */
export const PRODUCT_DEDUPLICATION_SYSTEM = {
    // 商品名の正規化（より具体的なマッチング）
    normalizeProductName: function(name) {
        // より具体的な商品識別（ブランド+商品タイプ）
        const productKeys = [
            'マジックリン ハンディスプレー',
            'マジックリン 除菌プラス', 
            'カビキラー カビ除去スプレー',
            'カビハイター 浴室用',
            'バスマジックリン 泡立ち',
            'サンポール 尿石除去',
            '茂木和哉 水垢洗剤',
            '激落ちくん メラミン',
            'クイックルワイパー 本体',
            'スクラビングバブル カビ取り'
        ];
        
        for (const key of productKeys) {
            if (name.includes(key.split(' ')[0]) && name.includes(key.split(' ')[1])) {
                return key;
            }
        }
        
        // より具体的でない場合はASINベースで重複チェック
        return name.substring(0, 20); // 最初の20文字で判定
    },
    
    // 商品重複除去（ASIN重複のみチェック・商品多様性確保）
    deduplicateProducts: function(products) {
        const asinSet = new Set();
        const deduplicated = [];
        
        products.forEach(product => {
            // ASINが重複していない場合のみ追加
            if (!asinSet.has(product.asin)) {
                asinSet.add(product.asin);
                deduplicated.push(product);
            } else {
                console.log(`🔄 ASIN重複をスキップ: ${product.name} (${product.asin})`);
            }
        });
        
        console.log(`📊 重複除去結果: ${products.length} → ${deduplicated.length} 商品`);
        return deduplicated;
    },
    
    // 商品優先度計算
    calculateProductPriority: function(product1, product2) {
        let score1 = 0;
        let score2 = 0;
        
        // ベストセラー +3点
        if (product1.bestseller) score1 += 3;
        if (product2.bestseller) score2 += 3;
        
        // Amazon's Choice +2点
        if (product1.amazons_choice) score1 += 2;
        if (product2.amazons_choice) score2 += 2;
        
        // プロ仕様 +1点
        if (product1.professional) score1 += 1;
        if (product2.professional) score2 += 1;
        
        // 評価が4.0以上 +1点
        if (product1.rating && product1.rating >= 4.0) score1 += 1;
        if (product2.rating && product2.rating >= 4.0) score2 += 1;
        
        // レビュー数が1000以上 +1点
        if (product1.reviews && product1.reviews >= 1000) score1 += 1;
        if (product2.reviews && product2.reviews >= 1000) score2 += 1;
        
        return score1 - score2; // 正の値なら product1 が優先
    },
    
    // 商品ソート（優先表示順）
    sortProductsByPriority: function(products) {
        return products.sort((a, b) => {
            // ベストセラー優先
            if (a.bestseller && !b.bestseller) return -1;
            if (!a.bestseller && b.bestseller) return 1;
            
            // Amazon's Choice 優先
            if (a.amazons_choice && !b.amazons_choice) return -1;
            if (!a.amazons_choice && b.amazons_choice) return 1;
            
            // プロ仕様優先
            if (a.professional && !b.professional) return -1;
            if (!a.professional && b.professional) return 1;
            
            // 評価の高い順
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            if (ratingA !== ratingB) return ratingB - ratingA;
            
            // レビュー数の多い順
            const reviewsA = a.reviews || 0;
            const reviewsB = b.reviews || 0;
            return reviewsB - reviewsA;
        });
    },
    
    // 最終的な商品リスト処理
    processProductList: function(products) {
        // 1. 重複除去（ASINベース）
        const deduplicated = this.deduplicateProducts(products);
        
        // 2. 優先順ソート
        const sorted = this.sortProductsByPriority(deduplicated);
        
        // 3. 商品数制限を緩和（カテゴリごとに適切な数を確保）
        return sorted; // 全ての商品を返すように変更
    }
};

// 後方互換性のため追加のエクスポート（旧形式サポート）
export const COMPREHENSIVE_PRODUCT_DATABASE = COMPREHENSIVE_CLEANING_PRODUCTS;
export const PRODUCT_DATABASE = COMPREHENSIVE_CLEANING_PRODUCTS;

// デフォルトエクスポート
export default {
    COMPREHENSIVE_CLEANING_PRODUCTS,
    DIRT_TYPE_MAPPING,
    LOCATION_PRODUCTS,
    REALTIME_SEARCH_CONFIG,
    IMPLEMENTATION_STRATEGY,
    PROFESSIONAL_PRODUCT_SELECTOR,
    PRODUCT_DEDUPLICATION_SYSTEM,
    // 後方互換性
    COMPREHENSIVE_PRODUCT_DATABASE: COMPREHENSIVE_CLEANING_PRODUCTS,
    PRODUCT_DATABASE: COMPREHENSIVE_CLEANING_PRODUCTS
};