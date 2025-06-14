/**
 * 画像フォールバック処理ユーティリティ
 * Amazon商品画像や外部画像が読み込めない場合の代替処理
 */

export class ImageFallbackHandler {
    constructor() {
        this.fallbackImages = {
            // 商品カテゴリ別フォールバック画像
            洗剤: this.generateProductIcon('🧴', '洗剤'),
            スプレー: this.generateProductIcon('💨', 'スプレー'),
            スポンジ: this.generateProductIcon('🧽', 'スポンジ'),
            ブラシ: this.generateProductIcon('🪥', 'ブラシ'),
            クロス: this.generateProductIcon('🧻', 'クロス'),
            手袋: this.generateProductIcon('🧤', '手袋'),
            マスク: this.generateProductIcon('😷', 'マスク'),
            道具: this.generateProductIcon('🔧', '道具'),
            default: this.generateProductIcon('📦', '商品')
        };
    }

    /**
     * SVGアイコンを生成（外部サービス不要）
     * @param {string} emoji - 表示する絵文字
     * @param {string} text - 表示するテキスト
     * @returns {string} data URL形式のSVG画像
     */
    generateProductIcon(emoji, text) {
        const svg = `
            <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="150" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
                <text x="75" y="60" text-anchor="middle" font-size="30" font-family="Arial, sans-serif">${emoji}</text>
                <text x="75" y="90" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="#6c757d">${text}</text>
                <text x="75" y="110" text-anchor="middle" font-size="10" font-family="Arial, sans-serif" fill="#adb5bd">画像準備中</text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }

    /**
     * 商品タイプに基づいてフォールバック画像を取得
     * @param {string} productType - 商品タイプ
     * @returns {string} フォールバック画像URL
     */
    getFallbackImage(productType) {
        return this.fallbackImages[productType] || this.fallbackImages.default;
    }

    /**
     * 画像要素にフォールバック処理を設定
     * @param {HTMLImageElement} imgElement - 画像要素
     * @param {string} productType - 商品タイプ
     */
    setupImageFallback(imgElement, productType) {
        const fallbackUrl = this.getFallbackImage(productType);
        
        imgElement.onerror = () => {
            imgElement.src = fallbackUrl;
            imgElement.onerror = null; // 無限ループ防止
        };
        
        // ローディング中の表示
        imgElement.style.backgroundColor = '#f8f9fa';
        imgElement.style.border = '1px solid #dee2e6';
    }

    /**
     * Amazon商品画像URLを修正
     * @param {string} asin - Amazon ASIN
     * @returns {string} 修正された画像URL
     */
    getAmazonImageUrl(asin) {
        // より信頼性の高いAmazon画像URL形式を使用
        return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`;
    }

    /**
     * 複数の画像URLを試行
     * @param {string} asin - Amazon ASIN
     * @param {string} productType - 商品タイプ
     * @returns {Promise<string>} 有効な画像URL
     */
    async findValidImageUrl(asin, productType) {
        const imageUrls = [
            `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`,
            `https://m.media-amazon.com/images/I/${asin}.jpg`,
            `https://images-fe.ssl-images-amazon.com/images/P/${asin}.01.SCLZZZZZZZ.jpg`,
            this.getFallbackImage(productType)
        ];

        for (const url of imageUrls) {
            try {
                if (await this.testImageUrl(url)) {
                    return url;
                }
            } catch (e) {
                continue;
            }
        }

        return this.getFallbackImage(productType);
    }

    /**
     * 画像URLの有効性をテスト
     * @param {string} url - テストする画像URL
     * @returns {Promise<boolean>} 有効かどうか
     */
    testImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            
            // タイムアウト設定（3秒）
            setTimeout(() => resolve(false), 3000);
        });
    }
}

// デフォルトエクスポート
export default ImageFallbackHandler;

// ブラウザ互換性
if (typeof window !== 'undefined') {
    window.ImageFallbackHandler = ImageFallbackHandler;
}