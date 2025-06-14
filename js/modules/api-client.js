/**
 * API Client Module for AI Cleaning Advisor
 * Handles all API communications (Gemini AI, Amazon API, Server Proxy)
 * 
 * Features:
 * - Gemini AI image analysis
 * - Amazon Product API integration  
 * - Server proxy communication
 * - Error handling and fallbacks
 * - API key management
 * - Real-time product search
 * 
 * @version 1.0.0
 * @author CX Mainte
 */

// =============================================================================
// API CONFIGURATION
// =============================================================================

/**
 * Server configuration for API endpoints
 */
const SERVER_CONFIG = {
    baseUrl: '', // Relative paths for production
    endpoints: {
        analyze: '/tools/ai-cleaner/server/amazon-proxy.php',
        product: '/tools/ai-cleaner/server/amazon-proxy.php', 
        health: '/tools/ai-cleaner/server/amazon-proxy.php'
    }
};

/**
 * Gemini API configuration
 */
const GEMINI_CONFIG = {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    maxRetries: 3,
    timeout: 30000
};

// =============================================================================
// GEMINI AI API CLIENT
// =============================================================================

/**
 * Gemini AI Image Analysis Client
 */
class GeminiAPIClient {
    constructor(apiKey = null) {
        this.apiKey = apiKey || this.getApiKey();
        this.retryCount = 0;
    }

    /**
     * Get API key from various sources
     */
    getApiKey() {
        // Try multiple sources for API key
        if (typeof window !== 'undefined') {
            if (window.GEMINI_API_KEY) {
                return window.GEMINI_API_KEY;
            }
            if (window.GEMINI_API_CONFIG?.apiKey) {
                return window.GEMINI_API_CONFIG.apiKey;
            }
        }
        return null;
    }

    /**
     * Set API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        console.log(`✅ Gemini APIキー設定完了: ${apiKey.substring(0, 20)}...`);
    }

    /**
     * Analyze image with Gemini AI
     * @param {string} base64Image - Base64 encoded image data
     * @param {Object} options - Analysis options
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeImage(base64Image, options = {}) {
        console.log('🤖 Gemini AI画像分析開始');
        
        try {
            if (!this.apiKey) {
                throw new Error('Gemini APIキーが設定されていません');
            }

            // Remove data URL prefix if present
            const base64Data = base64Image.includes(',') ? 
                base64Image.split(',')[1] : base64Image;

            // Build request payload
            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: this.buildAnalysisPrompt(options)
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

            // Make API call
            const response = await this.makeRequest(requestBody);
            return this.processResponse(response);

        } catch (error) {
            console.error('❌ Gemini分析エラー:', error);
            throw error;
        }
    }

    /**
     * Build analysis prompt for Gemini
     */
    buildAnalysisPrompt(options = {}) {
        return `この画像を分析して、以下のJSON形式で掃除に関する情報を教えてください：

{
    "location": "場所名（キッチン、浴室、トイレ、リビング、など）",
    "surface": "表面の材質（タイル、ステンレス、木材、など）", 
    "dirtType": "汚れの種類（油汚れ、カビ、水垢、ホコリ、など）",
    "dirtLevel": "汚れの程度（light、heavy のいずれか）",
    "description": "汚れの詳細説明",
    "analysisVersion": "gemini-analysis"
}

重要な判定基準：
- location: 画像から推測される場所を特定
- surface: 掃除対象の材質を正確に判断  
- dirtType: 主要な汚れタイプを1つ選択
- dirtLevel: lightは日常的な軽い汚れ、heavyは頑固でこびりついた汚れ
- JSONのみを出力し、他の文章は含めないでください`;
    }

    /**
     * Make HTTP request to Gemini API
     */
    async makeRequest(requestBody) {
        const url = `${GEMINI_CONFIG.apiUrl}?key=${this.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Gemini API エラー: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Process Gemini API response
     */
    processResponse(data) {
        console.log('🤖 Gemini API レスポンス:', data);

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const responseText = data.candidates[0].content.parts[0].text;
            console.log('📝 Gemini 応答テキスト:', responseText);

            // Extract and parse JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const result = JSON.parse(jsonMatch[0]);
                    console.log('✅ Gemini分析完了:', result);
                    return result;
                } catch (parseError) {
                    console.error('JSON解析エラー:', parseError);
                    throw new Error('Gemini応答のJSON解析に失敗しました');
                }
            } else {
                throw new Error('有効なJSONが見つかりませんでした');
            }
        } else {
            throw new Error('Gemini APIから有効な応答が得られませんでした');
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            if (!this.apiKey) {
                return { success: false, error: 'APIキーが設定されていません' };
            }

            // Simple test request
            const testResponse = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Hello" }]
                    }]
                })
            });

            return { 
                success: testResponse.ok, 
                status: testResponse.status,
                statusText: testResponse.statusText
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// =============================================================================
// AMAZON API CLIENT
// =============================================================================

/**
 * Amazon Product API Client
 */
class AmazonAPIClient {
    constructor() {
        this.config = this.getConfig();
        this.cache = new Map();
        this.cacheExpiry = 60 * 60 * 1000; // 1 hour
    }

    /**
     * Get Amazon API configuration
     */
    getConfig() {
        if (typeof window !== 'undefined' && window.AMAZON_CONFIG) {
            return window.AMAZON_CONFIG;
        }
        return null;
    }

    /**
     * Validate Amazon configuration
     */
    validateConfig() {
        if (!this.config) {
            return { valid: false, error: 'Amazon設定が見つかりません' };
        }

        const required = ['accessKey', 'secretKey', 'associateTag', 'endpoint', 'region'];
        for (const field of required) {
            if (!this.config[field]) {
                return { valid: false, error: `${field}が設定されていません` };
            }
        }

        return { valid: true };
    }

    /**
     * Get multiple items by ASIN
     * @param {Array<string>} asinList - List of ASINs
     * @returns {Promise<Object>} Product data keyed by ASIN
     */
    async getItems(asinList) {
        const validation = this.validateConfig();
        if (!validation.valid) {
            console.error('❌ Amazon API設定エラー:', validation.error);
            return null;
        }

        console.log(`🛒 Amazon API呼び出し: ${asinList.length}商品`);

        // Check cache first
        const cachedResults = {};
        const uncachedAsins = [];
        
        for (const asin of asinList) {
            const cached = this.cache.get(asin);
            if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
                cachedResults[asin] = cached.data;
            } else {
                uncachedAsins.push(asin);
            }
        }

        if (uncachedAsins.length === 0) {
            console.log('✅ 全商品キャッシュから取得');
            return cachedResults;
        }

        try {
            const requestPayload = {
                ItemIds: uncachedAsins,
                Resources: this.config.resources || [
                    'Images.Primary.Large',
                    'Images.Primary.Medium', 
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ByLineInfo',
                    'Offers.Listings.Price',
                    'Offers.Listings.Availability',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count'
                ],
                PartnerTag: this.config.associateTag,
                PartnerType: 'Associates',
                Marketplace: this.config.marketplace || 'www.amazon.co.jp'
            };

            const path = '/paapi5/getitems';
            const payload = JSON.stringify(requestPayload);
            
            const { timestamp, signature } = await this.generateAWSSignature(
                'POST', path, '', payload
            );

            const response = await fetch(`https://${this.config.endpoint}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Host': this.config.endpoint,
                    'X-Amz-Date': timestamp,
                    'Authorization': this.buildAuthorizationHeader(timestamp, signature)
                },
                body: payload
            });

            if (!response.ok) {
                throw new Error(`API呼び出し失敗: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return this.processItemsResponse(data, cachedResults);

        } catch (error) {
            console.error('💥 Amazon API呼び出しエラー:', error);
            return cachedResults; // Return cached data if available
        }
    }

    /**
     * Search for products
     * @param {string} keywords - Search keywords
     * @param {Object} options - Search options
     * @returns {Promise<Array>} Search results
     */
    async searchProducts(keywords, options = {}) {
        const validation = this.validateConfig();
        if (!validation.valid) {
            console.error('❌ Amazon API設定エラー:', validation.error);
            return [];
        }

        console.log(`🔍 Amazon検索: ${keywords}`);

        try {
            const requestPayload = {
                Keywords: keywords,
                Resources: this.config.resources || [
                    'Images.Primary.Large',
                    'Images.Primary.Medium',
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ByLineInfo',
                    'Offers.Listings.Price',
                    'Offers.Listings.Availability',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count'
                ],
                PartnerTag: this.config.associateTag,
                PartnerType: 'Associates',
                Marketplace: this.config.marketplace || 'www.amazon.co.jp',
                SearchIndex: options.searchIndex || 'All',
                ItemCount: options.itemCount || 10,
                SortBy: options.sortBy || 'Relevance'
            };

            const path = '/paapi5/searchitems';
            const payload = JSON.stringify(requestPayload);
            
            const { timestamp, signature } = await this.generateAWSSignature(
                'POST', path, '', payload
            );

            const response = await fetch(`https://${this.config.endpoint}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Host': this.config.endpoint,
                    'X-Amz-Date': timestamp,
                    'Authorization': this.buildAuthorizationHeader(timestamp, signature)
                },
                body: payload
            });

            if (!response.ok) {
                throw new Error(`検索API呼び出し失敗: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return this.processSearchResponse(data);

        } catch (error) {
            console.error('💥 Amazon検索エラー:', error);
            return [];
        }
    }

    /**
     * Process Amazon API items response
     */
    processItemsResponse(data, cachedResults) {
        const results = { ...cachedResults };
        
        if (data.ItemsResult && data.ItemsResult.Items) {
            for (const item of data.ItemsResult.Items) {
                const processedItem = this.processItemData(item);
                results[item.ASIN] = processedItem;
                
                // Cache the result
                this.cache.set(item.ASIN, {
                    data: processedItem,
                    timestamp: Date.now()
                });
            }
        }

        if (data.Errors) {
            console.warn('⚠️ Amazon API エラー:', data.Errors);
        }

        console.log(`✅ Amazon商品情報取得完了: ${Object.keys(results).length}商品`);
        return results;
    }

    /**
     * Process Amazon API search response
     */
    processSearchResponse(data) {
        const results = [];
        
        if (data.SearchResult && data.SearchResult.Items) {
            for (const item of data.SearchResult.Items) {
                results.push(this.processItemData(item));
            }
        }

        if (data.Errors) {
            console.warn('⚠️ Amazon検索API エラー:', data.Errors);
        }

        console.log(`✅ Amazon検索完了: ${results.length}商品`);
        return results;
    }

    /**
     * Process individual item data
     */
    processItemData(item) {
        try {
            const result = {
                asin: item.ASIN,
                title: item.ItemInfo?.Title?.DisplayValue || '商品名取得不可',
                brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || '',
                price: null,
                originalPrice: null,
                currency: 'JPY',
                availability: '在庫確認中',
                rating: null,
                reviewCount: null,
                images: {
                    large: null,
                    medium: null
                },
                url: `https://www.amazon.co.jp/dp/${item.ASIN}?tag=${this.config.associateTag}`
            };

            // Price information
            if (item.Offers?.Listings?.[0]?.Price) {
                const price = item.Offers.Listings[0].Price;
                result.price = price.DisplayAmount || price.Amount;
                if (price.Savings) {
                    result.originalPrice = price.Savings.DisplayAmount;
                }
            }

            // Availability
            if (item.Offers?.Listings?.[0]?.Availability) {
                result.availability = item.Offers.Listings[0].Availability.Message || '在庫あり';
            }

            // Reviews
            if (item.CustomerReviews) {
                result.rating = item.CustomerReviews.StarRating?.Value || null;
                result.reviewCount = item.CustomerReviews.Count || null;
            }

            // Images
            if (item.Images?.Primary) {
                result.images.large = item.Images.Primary.Large?.URL;
                result.images.medium = item.Images.Primary.Medium?.URL;
            }

            return result;

        } catch (error) {
            console.error('商品データ処理エラー:', error);
            return {
                asin: item.ASIN,
                title: '商品情報エラー',
                error: true
            };
        }
    }

    /**
     * Generate AWS Signature v4
     */
    async generateAWSSignature(method, path, queryString, payload) {
        const timestamp = this.getTimestamp();
        const date = timestamp.substr(0, 8);
        
        // Canonical request
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

        // String to sign
        const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
        const stringToSign = [
            'AWS4-HMAC-SHA256',
            timestamp,
            scope,
            await this.sha256Hash(canonicalRequest)
        ].join('\n');

        // Signing key
        const kDate = await this.hmac(`AWS4${this.config.secretKey}`, date);
        const kRegion = await this.hmac(kDate, this.config.region);
        const kService = await this.hmac(kRegion, 'ProductAdvertisingAPI');
        const kSigning = await this.hmac(kService, 'aws4_request');

        // Final signature
        const signature = await this.hmac(kSigning, stringToSign);
        
        return {
            timestamp,
            signature: Array.from(new Uint8Array(signature))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('')
        };
    }

    /**
     * Build authorization header
     */
    buildAuthorizationHeader(timestamp, signature) {
        const date = timestamp.substr(0, 8);
        const scope = `${date}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
        
        return [
            'AWS4-HMAC-SHA256',
            `Credential=${this.config.accessKey}/${scope}`,
            'SignedHeaders=host;x-amz-date',
            `Signature=${signature}`
        ].join(' ');
    }

    /**
     * Get ISO 8601 timestamp
     */
    getTimestamp() {
        return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    }

    /**
     * SHA256 hash
     */
    async sha256Hash(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * HMAC generation
     */
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

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Amazon商品キャッシュをクリアしました');
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            const validation = this.validateConfig();
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // Simple test with a known ASIN
            const testResult = await this.getItems(['B000FQTJZW']);
            return { 
                success: testResult !== null,
                itemCount: testResult ? Object.keys(testResult).length : 0
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// =============================================================================
// SERVER PROXY CLIENT
// =============================================================================

/**
 * Server Proxy Communication Client
 */
class ServerProxyClient {
    constructor() {
        this.config = SERVER_CONFIG;
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Make request to server proxy
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async makeRequest(endpoint, data = {}, options = {}) {
        const url = `${this.config.baseUrl}${this.config.endpoints[endpoint] || endpoint}`;
        
        console.log(`📡 サーバープロキシ通信: ${url}`);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ サーバープロキシレスポンス受信');
            return result;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('リクエストタイムアウト');
            }
            console.error('❌ サーバープロキシエラー:', error);
            throw error;
        }
    }

    /**
     * Analyze image via server proxy
     * @param {string} imageData - Base64 image data
     * @param {Object} analysisOptions - Analysis options
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeImage(imageData, analysisOptions = {}) {
        return await this.makeRequest('analyze', {
            action: 'analyze_image',
            image_data: imageData,
            options: analysisOptions
        });
    }

    /**
     * Get product information via server proxy
     * @param {Array<string>} asinList - List of ASINs
     * @returns {Promise<Object>} Product data
     */
    async getProducts(asinList) {
        return await this.makeRequest('product', {
            action: 'get_products',
            asins: asinList
        });
    }

    /**
     * Search products via server proxy
     * @param {string} keywords - Search keywords
     * @param {Object} searchOptions - Search options
     * @returns {Promise<Array>} Search results
     */
    async searchProducts(keywords, searchOptions = {}) {
        return await this.makeRequest('product', {
            action: 'search_products',
            keywords: keywords,
            options: searchOptions
        });
    }

    /**
     * Test server connection
     */
    async testConnection() {
        try {
            const result = await this.makeRequest('health', { action: 'health_check' });
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// =============================================================================
// UNIFIED API CLIENT
// =============================================================================

/**
 * Unified API Client - Main interface for all API operations
 */
class APIClient {
    constructor(options = {}) {
        this.gemini = new GeminiAPIClient(options.geminiApiKey);
        this.amazon = new AmazonAPIClient();
        this.server = new ServerProxyClient();
        
        this.preferServerProxy = options.preferServerProxy !== false;
        this.retryAttempts = options.retryAttempts || 3;
    }

    /**
     * Set Gemini API key
     * @param {string} apiKey - Gemini API key
     */
    setGeminiApiKey(apiKey) {
        this.gemini.setApiKey(apiKey);
    }

    /**
     * Analyze image with fallback strategy
     * @param {string} imageData - Base64 image data
     * @param {Object} options - Analysis options
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeImage(imageData, options = {}) {
        console.log('🔍 統合画像分析開始');

        // Try server proxy first if preferred
        if (this.preferServerProxy) {
            try {
                console.log('📡 サーバープロキシで分析試行');
                const result = await this.server.analyzeImage(imageData, options);
                console.log('✅ サーバープロキシ分析成功');
                return result;
            } catch (error) {
                console.warn('⚠️ サーバープロキシ分析失敗、直接API呼び出しにフォールバック');
            }
        }

        // Fallback to direct Gemini API
        try {
            console.log('🤖 Gemini API直接呼び出し');
            const result = await this.gemini.analyzeImage(imageData, options);
            console.log('✅ Gemini API分析成功');
            return result;
        } catch (error) {
            console.error('❌ すべての分析方法が失敗');
            throw new Error('画像分析に失敗しました。APIキーまたはネットワーク接続を確認してください。');
        }
    }

    /**
     * Get product information with fallback strategy
     * @param {Array<string>} asinList - List of ASINs
     * @returns {Promise<Object>} Product data
     */
    async getProducts(asinList) {
        console.log('🛒 統合商品情報取得開始');

        // Try server proxy first if preferred
        if (this.preferServerProxy) {
            try {
                console.log('📡 サーバープロキシで商品情報取得試行');
                const result = await this.server.getProducts(asinList);
                console.log('✅ サーバープロキシ商品取得成功');
                return result;
            } catch (error) {
                console.warn('⚠️ サーバープロキシ商品取得失敗、直接API呼び出しにフォールバック');
            }
        }

        // Fallback to direct Amazon API
        try {
            console.log('🔗 Amazon API直接呼び出し');
            const result = await this.amazon.getItems(asinList);
            console.log('✅ Amazon API商品取得成功');
            return result;
        } catch (error) {
            console.error('❌ すべての商品取得方法が失敗');
            throw new Error('商品情報の取得に失敗しました。');
        }
    }

    /**
     * Search products with fallback strategy
     * @param {string} keywords - Search keywords
     * @param {Object} options - Search options
     * @returns {Promise<Array>} Search results
     */
    async searchProducts(keywords, options = {}) {
        console.log('🔍 統合商品検索開始');

        // Try server proxy first if preferred
        if (this.preferServerProxy) {
            try {
                console.log('📡 サーバープロキシで商品検索試行');
                const result = await this.server.searchProducts(keywords, options);
                console.log('✅ サーバープロキシ商品検索成功');
                return result;
            } catch (error) {
                console.warn('⚠️ サーバープロキシ商品検索失敗、直接API呼び出しにフォールバック');
            }
        }

        // Fallback to direct Amazon API
        try {
            console.log('🔗 Amazon API直接呼び出し');
            const result = await this.amazon.searchProducts(keywords, options);
            console.log('✅ Amazon API商品検索成功');
            return result;
        } catch (error) {
            console.error('❌ すべての商品検索方法が失敗');
            throw new Error('商品検索に失敗しました。');
        }
    }

    /**
     * Enhance products with real-time Amazon data
     * @param {Object} baseProducts - Base product data
     * @param {string} dirtType - Type of dirt for context
     * @returns {Promise<Object>} Enhanced product data
     */
    async enrichProductsWithAmazonData(baseProducts, dirtType = '') {
        console.log('🔗 リアルタイム商品データ統合開始');

        try {
            const enrichedProducts = {
                cleaners: [],
                tools: [],
                protection: []
            };

            // Process each category
            for (const [category, products] of Object.entries(baseProducts)) {
                if (!products || !Array.isArray(products)) continue;

                console.log(`📦 カテゴリ処理中: ${category} (${products.length}商品)`);

                // Extract ASINs for batch lookup
                const asins = products
                    .filter(p => p.asin)
                    .map(p => p.asin)
                    .slice(0, 10); // Limit to avoid API quota issues

                if (asins.length > 0) {
                    try {
                        // Get real-time product data
                        const amazonData = await this.getProducts(asins);
                        
                        // Merge base products with Amazon data
                        const enhancedCategoryProducts = products.map(baseProduct => {
                            const amazonProduct = amazonData?.[baseProduct.asin];
                            if (amazonProduct && !amazonProduct.error) {
                                return {
                                    ...baseProduct,
                                    name: amazonProduct.title || baseProduct.name,
                                    price: amazonProduct.price || baseProduct.price || '価格確認中',
                                    rating: amazonProduct.rating || baseProduct.rating || 4.0,
                                    reviews: amazonProduct.reviewCount || baseProduct.reviews || 100,
                                    image_url: amazonProduct.images?.large || amazonProduct.images?.medium,
                                    availability: amazonProduct.availability || '在庫あり',
                                    url: amazonProduct.url,
                                    realtime: true // Mark as real-time data
                                };
                            }
                            return baseProduct;
                        });

                        enrichedProducts[category] = enhancedCategoryProducts;
                    } catch (error) {
                        console.warn(`⚠️ ${category}カテゴリのリアルタイムデータ取得失敗:`, error);
                        enrichedProducts[category] = products; // Use base data
                    }
                } else {
                    enrichedProducts[category] = products; // No ASINs to lookup
                }
            }

            // Perform real-time search if dirt type is specified
            if (dirtType) {
                try {
                    const searchResults = await this.performRealtimeSearch(dirtType);
                    if (searchResults.length > 0) {
                        // Add top search results to cleaners
                        enrichedProducts.cleaners = [
                            ...searchResults.slice(0, 3),
                            ...enrichedProducts.cleaners
                        ];
                    }
                } catch (error) {
                    console.warn('⚠️ リアルタイム検索失敗:', error);
                }
            }

            console.log('✅ リアルタイム商品データ統合完了');
            return enrichedProducts;

        } catch (error) {
            console.error('❌ 商品データ統合エラー:', error);
            return baseProducts; // Return original data on error
        }
    }

    /**
     * Perform real-time product search based on dirt type
     * @param {string} dirtType - Type of dirt
     * @returns {Promise<Array>} Search results
     */
    async performRealtimeSearch(dirtType) {
        console.log(`🔍 リアルタイム検索実行: ${dirtType}`);

        // Define search keywords mapping
        const searchKeywords = {
            '油汚れ': '油汚れ 洗剤 キッチン',
            'カビ': 'カビ取り 洗剤 浴室',
            'カビ汚れ': 'カビ取り 洗剤 浴室',
            '水垢': '水垢 除去 クエン酸',
            '水垢汚れ': '水垢 除去 洗剤',
            'ホコリ': 'ホコリ取り クイックル',
            '尿石': '尿石 除去 トイレ洗剤',
            'その他': '掃除 洗剤'
        };

        const keywords = searchKeywords[dirtType] || searchKeywords['その他'];
        
        try {
            const searchResults = await this.searchProducts(keywords, {
                searchIndex: 'All',
                itemCount: 5,
                sortBy: 'Featured'
            });

            // Transform search results to match expected format
            return searchResults.map(product => ({
                name: product.title,
                asin: product.asin,
                price: product.price || '価格確認中',
                rating: product.rating || 4.0,
                reviews: product.reviewCount || 100,
                image_url: product.images?.large || product.images?.medium,
                type: "洗剤",
                target: [dirtType],
                strength: "リアルタイム検索",
                badge: "🔍 検索結果",
                realtime_search: true
            }));

        } catch (error) {
            console.error('❌ リアルタイム検索エラー:', error);
            return [];
        }
    }

    /**
     * Test all API connections
     * @returns {Promise<Object>} Test results
     */
    async testAllConnections() {
        console.log('🧪 全API接続テスト開始');

        const results = {
            gemini: await this.gemini.testConnection(),
            amazon: await this.amazon.testConnection(),
            server: await this.server.testConnection()
        };

        console.log('📊 API接続テスト結果:', results);
        return results;
    }

    /**
     * Get API status summary
     * @returns {Object} API status
     */
    getApiStatus() {
        return {
            gemini: {
                configured: !!this.gemini.apiKey,
                apiKey: this.gemini.apiKey ? 
                    `${this.gemini.apiKey.substring(0, 10)}...` : null
            },
            amazon: {
                configured: !!this.amazon.config,
                validation: this.amazon.validateConfig()
            },
            server: {
                configured: true,
                baseUrl: this.server.config.baseUrl,
                endpoints: Object.keys(this.server.config.endpoints)
            }
        };
    }
}

// =============================================================================
// EXPORTS
// =============================================================================

// ES Module exports
export {
    APIClient,
    GeminiAPIClient,
    AmazonAPIClient,
    ServerProxyClient
};

// Default export
export default APIClient;

// Browser compatibility (global window object)
if (typeof window !== 'undefined') {
    window.APIClient = APIClient;
    window.GeminiAPIClient = GeminiAPIClient;
    window.AmazonAPIClient = AmazonAPIClient;
    window.ServerProxyClient = ServerProxyClient;
    
    console.log('✅ API Client モジュール読み込み完了');
}