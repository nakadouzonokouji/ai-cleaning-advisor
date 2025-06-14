/**
 * 汚れ種別マッピング設定
 * AI掃除アドバイザー - 設定データベース
 */

export const COMPREHENSIVE_DIRT_MAPPING = {
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

export const DIRT_TYPE_MAPPING = {
    'kitchen': ['油汚れ', '焦げ', '食べかす', '黄ばみ'],
    'bathroom': ['カビ', '水垢', '石鹸カス', '黒カビ'],
    'toilet': ['尿汚れ', '便汚れ', '黄ばみ', 'カビ'],
    'living': ['ほこり', 'ペットの毛', '皮脂汚れ'],
    'bedroom': ['ほこり', '汗染み', 'ダニ'],
    'laundry': ['汗染み', '皮脂汚れ', 'カビ'],
    'entrance': ['泥汚れ', 'ほこり']
};

// Named exports
export { COMPREHENSIVE_DIRT_MAPPING, DIRT_TYPE_MAPPING };

// Default export
export default {
    COMPREHENSIVE_DIRT_MAPPING,
    DIRT_TYPE_MAPPING
};