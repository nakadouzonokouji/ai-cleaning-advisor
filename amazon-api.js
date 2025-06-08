// Amazon Product Advertising API v5 クライアント

class AmazonProductAPI {
    constructor() {
        this.config = window.AMAZON_CONFIG;
        this.cache = new Map(); // 商品情報キャッシュ
        this.cacheExpiry = 60 * 60 * 1000; // 1時間
    }

    // SHA256 HMAC 署名生成（Web Crypto API使用）
    async createSignature(stringToSign, secretKey) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(stringToSign);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    // ISO 8601 形式の現在時刻
    getTimestamp() {
        return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    }

    // クエリ文字列をソート
    sortQueryString(params) {
        return Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    // AWS署名 v4 の生成
    async generateAWSSignature(method, path, queryString, payload) {
        const timestamp = this.getTimestamp();
        const date = timestamp.substr(0, 8);
        
        // 正規化リクエスト
        const canonicalRequest = [
            method,
            path,
            queryString,
            `host:${this.config.endpoint}`,
            'x-amz-date:' + timestamp,
            '',
            'host;x-amz-date',
            await this.sha256Hash(payload)
        ].join('\n');

        // 署名文字列
        const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
        const stringToSign = [
            'AWS4-HMAC-SHA256',
            timestamp,
            scope,
            await this.sha256Hash(canonicalRequest)
        ].join('\n');

        // 署名キー生成
        const kDate = await this.hmac(`AWS4${this.config.secretKey}`, date);
        const kRegion = await this.hmac(kDate, this.config.region);
        const kService = await this.hmac(kRegion, 'ProductAdvertisingAPI');
        const kSigning = await this.hmac(kService, 'aws4_request');

        // 最終署名
        const signature = await this.hmac(kSigning, stringToSign);
        
        return {
            timestamp,
            signature: Array.from(new Uint8Array(signature))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('')
        };
    }

    // SHA256ハッシュ
    async sha256Hash(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // HMAC生成
    async hmac(key, message) {
        const keyData = typeof key === 'string' ? new TextEncoder().encode(key) : key;
        const messageData = new TextEncoder().encode(message);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        return await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    }

    // 複数商品情報取得
    async getItems(asinList) {
        console.warn('⚠️ Amazon PA-API直接呼び出しはCORS制限のため不可能です');
        console.log('💡 フォールバック: 静的データを返します');
        
        // フォールバック：静的データを返す
        const fallbackData = {};
        for (const asin of asinList) {
            fallbackData[asin] = {
                asin: asin,
                title: '商品情報取得中...',
                price: '価格確認中',
                rating: null,
                reviewCount: null,
                availability: '在庫確認中',
                images: {
                    large: null,
                    medium: null
                },
                url: `https://www.amazon.co.jp/dp/${asin}?tag=${this.config.associateTag}`,
                isRealData: false
            };
        }
        
        return fallbackData;
    }

    // キャッシュクリア
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Amazon商品キャッシュをクリアしました');
    }
}

// グローバルインスタンス
window.amazonAPI = new AmazonProductAPI();