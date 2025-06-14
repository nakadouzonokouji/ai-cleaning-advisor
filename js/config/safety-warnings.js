/**
 * AI掃除アドバイザー - 安全警告システム
 * CX Mainte © 2025
 * 
 * 🛡️ ユーザーの安全を最優先とした包括的警告システム
 * 🚨 化学洗剤、物理的危険、健康リスクの全面的な安全管理
 */

// 🚨 重大安全警告システム
export const CRITICAL_SAFETY_WARNINGS = {
    // 塩素系洗剤の危険性
    chlorine_bleach: {
        level: "CRITICAL",
        icon: "⚠️💀",
        title: "塩素系洗剤使用時の重要な警告",
        warnings: [
            "🚫 絶対に他の洗剤と混ぜない（有毒な塩素ガス発生の危険）",
            "💨 必ず十分な換気を行う（窓を全開＋換気扇）",
            "🛡️ ゴム手袋・マスク・保護メガネを必ず着用",
            "👥 小さなお子さん・ペットは別室に移動",
            "🏠 使用中は家族に作業中であることを知らせる",
            "🚿 皮膚に付着した場合は大量の水で15分以上洗い流す",
            "😷 気分が悪くなったらすぐに作業を中止し、新鮮な空気の場所へ"
        ],
        emergency_action: "万が一の場合は救急車（119番）への連絡も検討してください",
        products: ["カビキラー", "キッチンハイター", "塩素系漂白剤"]
    },

    // 強酸性洗剤の危険性
    strong_acid: {
        level: "CRITICAL", 
        icon: "⚠️🔥",
        title: "強酸性洗剤使用時の重要な警告",
        warnings: [
            "🧤 必ずゴム手袋を着用（素手での使用は皮膚損傷の危険）",
            "👀 保護メガネまたは保護ゴーグル着用必須",
            "💨 十分な換気（酸性ガスによる呼吸器への影響防止）",
            "🚫 金属部分への長時間接触は腐食の原因",
            "💧 使用後は大量の水でしっかりと洗い流す",
            "🚿 万が一皮膚に付いた場合は即座に大量の水で洗浄",
            "👁️ 目に入った場合は15分以上水で洗い流し、医師の診察を受ける"
        ],
        emergency_action: "重篤な症状が出た場合は迷わず救急受診",
        products: ["サンポール", "茂木和哉", "トイレ用酸性洗剤"]
    },

    // 高所作業の危険性
    height_work: {
        level: "HIGH",
        icon: "⚠️📏",
        title: "高所作業時の安全対策",
        warnings: [
            "🪜 安定した脚立を使用（椅子や不安定な台は使用禁止）",
            "👥 できるだけ二人以上で作業（一人は脚立を支える）",
            "👟 滑りにくい靴を着用",
            "🧴 洗剤等は事前に手の届く場所に準備",
            "⏰ 無理をせず、疲れたら休憩",
            "🌧️ 雨天時や体調不良時は作業を避ける"
        ],
        emergency_action: "転落事故の場合は動かさず、即座に救急車要請",
        applicable_areas: ["エアコン", "換気扇", "高い窓", "照明器具"]
    },

    // 電気設備周りの安全
    electrical_safety: {
        level: "HIGH",
        icon: "⚠️⚡",
        title: "電気設備周辺での安全対策",
        warnings: [
            "🔌 必ず電源を切ってから作業開始",
            "💧 水や洗剤が電気部分にかからないよう注意",
            "🧤 濡れた手での電気操作は絶対禁止",
            "🛡️ コンセント周りは乾いた布で拭く",
            "🔧 分解が必要な場合は専門業者に依頼"
        ],
        emergency_action: "感電事故の場合は電源を切ってから救急要請",
        applicable_areas: ["エアコン", "換気扇", "洗濯機", "冷蔵庫周り"]
    }
};

// 🧪 洗剤別安全情報
export const DETERGENT_SAFETY_INFO = {
    alkaline: {
        name: "アルカリ性洗剤",
        ph_range: "9-14",
        risks: ["皮膚の炎症", "目への刺激", "アルミニウムの腐食"],
        protection: ["ゴム手袋必須", "目の保護", "換気推奨"],
        first_aid: "大量の水で洗浄後、痛みが続く場合は医師に相談"
    },
    acidic: {
        name: "酸性洗剤", 
        ph_range: "0-6",
        risks: ["化学やけど", "金属腐食", "有害ガス発生（混合時）"],
        protection: ["ゴム手袋必須", "保護メガネ必須", "強力換気必須"],
        first_aid: "即座に大量の水で15分以上洗浄、医師の診察推奨"
    },
    chlorine: {
        name: "塩素系洗剤",
        ph_range: "11-13", 
        risks: ["有毒ガス発生", "皮膚・呼吸器への重大な影響", "漂白作用"],
        protection: ["完全防護具着用", "強力換気", "家族・ペット避難"],
        first_aid: "呼吸困難等の症状があれば救急受診を躊躇しない"
    },
    neutral: {
        name: "中性洗剤",
        ph_range: "6-8",
        risks: ["軽微な皮膚刺激", "目への刺激"],
        protection: ["軽微な注意で可", "手袋推奨"],
        first_aid: "水で洗浄、問題なければ継続可能"
    }
};

// 🏠 場所別安全ガイド
export const LOCATION_SAFETY_GUIDES = {
    bathroom: {
        icon: "🛁⚠️",
        title: "浴室掃除の安全対策",
        specific_risks: [
            "滑りやすい床での転倒",
            "密閉空間での有害ガス蓄積",
            "高湿度による洗剤の効果変化"
        ],
        safety_measures: [
            "滑り止めマットの使用",
            "ドアを開放して換気確保",
            "こまめな休憩で外気を吸う",
            "浴槽に足を入れる際の慎重な動作"
        ]
    },
    kitchen: {
        icon: "🍳⚠️", 
        title: "キッチン掃除の安全対策",
        specific_risks: [
            "高温部分でのやけど",
            "油汚れによる滑り",
            "換気扇での高所作業"
        ],
        safety_measures: [
            "コンロ等の完全冷却確認",
            "足元の油汚れ除去を優先",
            "換気扇は脚立使用＋補助者確保"
        ]
    },
    toilet: {
        icon: "🚽⚠️",
        title: "トイレ掃除の安全対策", 
        specific_risks: [
            "強酸性洗剤の使用頻度",
            "狭い空間での換気不足",
            "便器内での洗剤飛散"
        ],
        safety_measures: [
            "ドア開放＋換気扇で強制換気",
            "洗剤使用量の適正化",
            "保護具の確実な着用"
        ]
    }
};

// 🚨 緊急時対応フローチャート
export const EMERGENCY_RESPONSE_FLOW = {
    chemical_contact: {
        title: "化学洗剤が皮膚・目に付着した場合",
        immediate_steps: [
            "1️⃣ 作業を即座に中止",
            "2️⃣ 汚染された衣服を脱ぐ",
            "3️⃣ 大量の流水で15分以上洗浄",
            "4️⃣ 痛み・発赤が続く場合は医師に相談",
            "5️⃣ 商品ラベルを持参して受診"
        ]
    },
    gas_inhalation: {
        title: "有害ガスを吸い込んだ場合",
        immediate_steps: [
            "1️⃣ 即座に新鮮な空気の場所へ移動",
            "2️⃣ 衣服を緩めて楽な姿勢に",
            "3️⃣ 深呼吸を避け、自然な呼吸を維持",
            "4️⃣ 症状が改善しない場合は救急要請",
            "5️⃣ 使用した洗剤名を救急隊に伝達"
        ]
    },
    fall_accident: {
        title: "転倒・転落事故の場合", 
        immediate_steps: [
            "1️⃣ 無理に動かさない",
            "2️⃣ 意識・呼吸の確認",
            "3️⃣ 出血がある場合は圧迫止血",
            "4️⃣ 重篤と判断される場合は救急要請",
            "5️⃣ 安全な場所で安静にして経過観察"
        ]
    }
};

// 🎯 動的安全警告生成システム
export class SafetyWarningSystem {
    
    /**
     * 汚れタイプと場所に基づく安全警告生成
     */
    static generateSafetyWarnings(dirtType, location, severity = 'heavy') {
        const warnings = [];
        
        // 汚れタイプ別警告
        if (dirtType.includes('カビ')) {
            warnings.push(CRITICAL_SAFETY_WARNINGS.chlorine_bleach);
        }
        
        if (dirtType.includes('尿石') || dirtType.includes('水垢')) {
            warnings.push(CRITICAL_SAFETY_WARNINGS.strong_acid);
        }
        
        // 場所別警告
        if (location === 'aircon' || location === '換気扇') {
            warnings.push(CRITICAL_SAFETY_WARNINGS.height_work);
            warnings.push(CRITICAL_SAFETY_WARNINGS.electrical_safety);
        }
        
        // 場所別安全ガイド追加
        if (LOCATION_SAFETY_GUIDES[location]) {
            warnings.push(LOCATION_SAFETY_GUIDES[location]);
        }
        
        return warnings;
    }
    
    /**
     * 使用商品に基づく安全情報生成
     */
    static generateProductSafetyInfo(products) {
        const safetyInfo = [];
        
        products.forEach(product => {
            if (product.chemical_type) {
                const info = DETERGENT_SAFETY_INFO[product.chemical_type];
                if (info) {
                    safetyInfo.push({
                        product: product.name,
                        safety: info
                    });
                }
            }
        });
        
        return safetyInfo;
    }
    
    /**
     * 緊急時対応情報の取得
     */
    static getEmergencyResponseInfo() {
        return EMERGENCY_RESPONSE_FLOW;
    }
}

// デフォルトエクスポート
export default {
    CRITICAL_SAFETY_WARNINGS,
    DETERGENT_SAFETY_INFO, 
    LOCATION_SAFETY_GUIDES,
    EMERGENCY_RESPONSE_FLOW,
    SafetyWarningSystem
};