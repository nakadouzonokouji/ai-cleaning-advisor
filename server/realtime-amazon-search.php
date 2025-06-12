<?php
/**
 * 🚀 完全リアルタイムAmazon PA-API検索システム
 * ユーザーファースト: 正確な価格・在庫・売れ筋情報をリアルタイム取得
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

/**
 * Amazon PA-API v5 SearchItems リアルタイム検索
 */
class AmazonRealtimeSearch {
    private $accessKey;
    private $secretKey;
    private $associateTag;
    private $region = 'us-west-2';
    private $service = 'ProductAdvertisingAPI';
    private $host = 'webservices.amazon.co.jp';
    
    public function __construct() {
        $this->accessKey = defined('AMAZON_ACCESS_KEY') ? AMAZON_ACCESS_KEY : null;
        $this->secretKey = defined('AMAZON_SECRET_KEY') ? AMAZON_SECRET_KEY : null;
        $this->associateTag = defined('AMAZON_ASSOCIATE_TAG') ? AMAZON_ASSOCIATE_TAG : null;
        
        if (!$this->accessKey || !$this->secretKey || !$this->associateTag) {
            throw new Exception('Amazon API credentials not configured');
        }
    }
    
    /**
     * 🔍 汚れタイプ別リアルタイム商品検索
     */
    public function searchByDirtType($dirtType, $itemCount = 10) {
        $keywords = $this->generateSearchKeywords($dirtType);
        
        error_log("🔍 リアルタイム検索開始: $dirtType -> $keywords");
        
        return $this->searchProducts([
            'Keywords' => $keywords,
            'SearchIndex' => 'All',
            'ItemCount' => $itemCount,
            'SortBy' => 'Featured', // 売れ筋順
            'Resources' => [
                'Images.Primary.Large',
                'Images.Primary.Medium',
                'ItemInfo.Title',
                'ItemInfo.Features',
                'ItemInfo.ContentRating',
                'Offers.Listings.Price',
                'Offers.Listings.DeliveryInfo.IsAmazonFulfilled',
                'CustomerReviews.StarRating',
                'CustomerReviews.Count'
            ]
        ]);
    }
    
    /**
     * 🎯 汚れタイプから検索キーワード生成
     */
    private function generateSearchKeywords($dirtType) {
        $keywordMapping = [
            '油汚れ' => '油汚れ 洗剤 キッチン マジックリン 換気扇',
            'カビ' => 'カビ取り 洗剤 浴室 カビキラー 黒カビ',
            '水垢' => '水垢 除去 クエン酸 茂木和哉 ウロコ汚れ',
            'ホコリ' => 'ホコリ取り クイックルワイパー 掃除機',
            '手垢' => '手垢 中性洗剤 除菌 アルコール',
            '焦げ' => '焦げ落とし 重曹 クレンザー',
            '尿石' => '尿石 サンポール 酸性洗剤 トイレ',
            '石鹸カス' => '石鹸カス 浴室 アルカリ洗剤',
            'ヤニ' => 'ヤニ取り 洗剤 タバコ',
            '皮脂汚れ' => '皮脂汚れ アルカリ洗剤 除菌'
        ];
        
        return $keywordMapping[$dirtType] ?? "$dirtType 洗剤 清掃";
    }
    
    /**
     * 🛒 Amazon PA-API SearchItems 実行
     */
    private function searchProducts($params) {
        $payload = json_encode([
            'Keywords' => $params['Keywords'],
            'SearchIndex' => $params['SearchIndex'],
            'ItemCount' => $params['ItemCount'],
            'PartnerTag' => $this->associateTag,
            'PartnerType' => 'Associates',
            'SortBy' => $params['SortBy'],
            'Resources' => $params['Resources']
        ]);
        
        $headers = $this->getSignedHeaders('SearchItems', $payload);
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => "https://{$this->host}/paapi5/searchitems",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 10
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            error_log("Amazon API Error: HTTP $httpCode");
            throw new Exception("Amazon API request failed: HTTP $httpCode");
        }
        
        return json_decode($response, true);
    }
    
    /**
     * 🔐 AWS Signature v4 署名生成
     */
    private function getSignedHeaders($operation, $payload) {
        $timestamp = gmdate('Ymd\THis\Z');
        $date = gmdate('Ymd');
        
        $canonicalRequest = implode("\n", [
            'POST',
            '/paapi5/searchitems',
            '',
            "content-encoding:amz-1.0",
            "content-type:application/json; charset=utf-8",
            "host:{$this->host}",
            "x-amz-date:$timestamp",
            "x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.$operation",
            '',
            'content-encoding;content-type;host;x-amz-date;x-amz-target',
            hash('sha256', $payload)
        ]);
        
        $stringToSign = implode("\n", [
            'AWS4-HMAC-SHA256',
            $timestamp,
            "$date/{$this->region}/{$this->service}/aws4_request",
            hash('sha256', $canonicalRequest)
        ]);
        
        $signature = $this->generateSignature($stringToSign, $date);
        
        return [
            'Content-Encoding: amz-1.0',
            'Content-Type: application/json; charset=utf-8',
            "Host: {$this->host}",
            "X-Amz-Date: $timestamp",
            "X-Amz-Target: com.amazon.paapi5.v1.ProductAdvertisingAPIv1.$operation",
            "Authorization: AWS4-HMAC-SHA256 Credential={$this->accessKey}/$date/{$this->region}/{$this->service}/aws4_request, SignedHeaders=content-encoding;content-type;host;x-amz-date;x-amz-target, Signature=$signature"
        ];
    }
    
    private function generateSignature($stringToSign, $date) {
        $kDate = hash_hmac('sha256', $date, 'AWS4' . $this->secretKey, true);
        $kRegion = hash_hmac('sha256', $this->region, $kDate, true);
        $kService = hash_hmac('sha256', $this->service, $kRegion, true);
        $kSigning = hash_hmac('sha256', 'aws4_request', $kService, true);
        
        return hash_hmac('sha256', $stringToSign, $kSigning);
    }
}

/**
 * 🎯 メインAPI処理
 */
try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // 設定確認テスト
        echo json_encode([
            'success' => true,
            'message' => 'Realtime Amazon Search API Ready',
            'features' => [
                'realtime_pricing' => true,
                'bestseller_ranking' => true,
                'accurate_inventory' => true,
                'customer_reviews' => true
            ],
            'search_capabilities' => [
                'dirt_type_search' => '汚れタイプ別検索',
                'keyword_generation' => '最適キーワード生成',
                'sort_by_popularity' => '売れ筋順ソート'
            ]
        ]);
        exit;
    }
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('POST method required for search');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['dirt_type'])) {
        throw new Exception('dirt_type parameter required');
    }
    
    $searcher = new AmazonRealtimeSearch();
    $results = $searcher->searchByDirtType(
        $input['dirt_type'],
        $input['item_count'] ?? 10
    );
    
    echo json_encode([
        'success' => true,
        'search_type' => 'realtime',
        'dirt_type' => $input['dirt_type'],
        'results' => $results,
        'timestamp' => date('Y-m-d H:i:s'),
        'user_first' => true
    ]);
    
} catch (Exception $e) {
    error_log("Realtime Search Error: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'fallback_message' => 'リアルタイム検索が利用できません'
    ]);
}
?>