/**
 * 場所設定データ - COMPREHENSIVE_LOCATION_CONFIG
 * AI掃除アドバイザーで使用する掃除場所の設定情報
 */

export const COMPREHENSIVE_LOCATION_CONFIG = {
    'kitchen': { 
        name: 'キッチン', 
        icon: '🔥', 
        difficulty: 3 
    },
    'bathroom': { 
        name: 'バスルーム', 
        icon: '🛁', 
        difficulty: 4 
    },
    'toilet': { 
        name: 'トイレ', 
        icon: '🚽', 
        difficulty: 3 
    },
    'window': { 
        name: '窓・ガラス', 
        icon: '🪟', 
        difficulty: 2 
    },
    'floor': { 
        name: '床・フローリング', 
        icon: '🧹', 
        difficulty: 2 
    },
    'aircon': { 
        name: 'エアコン', 
        icon: '❄️', 
        difficulty: 4 
    },
    'washer': { 
        name: '洗濯機', 
        icon: '🧺', 
        difficulty: 3 
    },
    'living': { 
        name: 'リビング', 
        icon: '🛋️', 
        difficulty: 2 
    }
};

/**
 * 場所名からアイコンを取得
 * @param {string} locationKey - 場所のキー
 * @returns {string} アイコン文字列
 */
export const getLocationIcon = (locationKey) => {
    return COMPREHENSIVE_LOCATION_CONFIG[locationKey]?.icon || '🏠';
};

/**
 * 場所名から表示名を取得
 * @param {string} locationKey - 場所のキー
 * @returns {string} 表示名
 */
export const getLocationName = (locationKey) => {
    return COMPREHENSIVE_LOCATION_CONFIG[locationKey]?.name || locationKey;
};

/**
 * 場所名から難易度を取得
 * @param {string} locationKey - 場所のキー
 * @returns {number} 難易度（1-5）
 */
export const getLocationDifficulty = (locationKey) => {
    return COMPREHENSIVE_LOCATION_CONFIG[locationKey]?.difficulty || 2;
};

/**
 * 全ての場所のキーを取得
 * @returns {string[]} 場所のキーの配列
 */
export const getAllLocationKeys = () => {
    return Object.keys(COMPREHENSIVE_LOCATION_CONFIG);
};

/**
 * 難易度別に場所を分類
 * @returns {Object} 難易度別の場所分類
 */
export const getLocationsByDifficulty = () => {
    const result = {};
    
    Object.entries(COMPREHENSIVE_LOCATION_CONFIG).forEach(([key, config]) => {
        const difficulty = config.difficulty;
        if (!result[difficulty]) {
            result[difficulty] = [];
        }
        result[difficulty].push({
            key,
            ...config
        });
    });
    
    return result;
};

// Named export
export { COMPREHENSIVE_LOCATION_CONFIG };

// デフォルトエクスポート
export default COMPREHENSIVE_LOCATION_CONFIG;