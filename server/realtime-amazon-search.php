<?php
/**
 * 🚀 リアルタイムAmazon PA-API検索クラスライブラリ
 * ユーザーファースト: 正確な価格・在庫・売れ筋情報をリアルタイム取得
 */

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
            'Availability' => 'Available', // 購入可能な商品のみ
            'Condition' => 'New', // 新品のみ
            'MinPrice' => 100, // 最低価格100円（無効な商品を除外）
            'Resources' => [
                'Images.Primary.Large',
                'Images.Primary.Medium',
                'ItemInfo.Title',
                'ItemInfo.Features',
                'ItemInfo.ContentRating',
                'Offers.Listings.Price',
                'Offers.Listings.DeliveryInfo.IsAmazonFulfilled',
                'Offers.Listings.Availability.Message',
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
            '油汚れ' => '油汚れ 洗剤 スポンジ ブラシ 手袋 換気扇 キッチン 掃除',
            'カビ' => 'カビ取り 洗剤 ブラシ マスク 手袋 浴室 掃除',
            '水垢' => '水垢 除去 スポンジ クロス 手袋 クエン酸 掃除',
            'ホコリ' => 'ホコリ取り クロス マスク 掃除機 ワイパー 掃除',
            '手垢' => '手垢 除去 クロス スポンジ 洗剤 掃除',
            '焦げ' => '焦げ落とし スポンジ ブラシ 重曹 クレンザー 掃除',
            '尿石' => '尿石 除去 ブラシ 手袋 マスク トイレ 掃除',
            '石鹸カス' => '石鹸カス 除去 スポンジ ブラシ 浴室 掃除',
            'ヤニ' => 'ヤニ取り クロス スポンジ 洗剤 掃除',
            '皮脂汚れ' => '皮脂汚れ 除去 クロス スポンジ 洗剤 掃除'
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

// このファイルはクラスライブラリとして使用されます
// HTTP処理は amazon-proxy.php で行います
?>