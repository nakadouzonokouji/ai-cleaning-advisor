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
     * 🔍 汚れタイプ別基本セット商品検索
     */
    public function searchByDirtType($dirtType, $itemCount = 30) {
        error_log("🔍 基本セット検索開始: $dirtType");
        
        // 汚れタイプ別の基本セットキーワード
        $basicSetKeywords = $this->generateBasicSetKeywords($dirtType);
        
        try {
            $results = $this->searchProducts([
                'Keywords' => $basicSetKeywords,
                'SearchIndex' => 'HomeGarden', // 掃除用品カテゴリに限定
                'ItemCount' => $itemCount,
                'SortBy' => 'Featured', // 売れ筋順
                'Availability' => 'Available', // 購入可能な商品のみ
                'Condition' => 'New', // 新品のみ
                'MinPrice' => 100, // 最低価格100円
                'MaxPrice' => 3000, // 最高価格3000円（基本用品の適正価格）
                'Merchant' => 'Amazon', // Amazonが販売する商品のみ
                'Resources' => [
                    'Images.Primary.Large',
                    'Images.Primary.Medium',
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ContentRating',
                    'Offers.Listings.Price',
                    'Offers.Listings.DeliveryInfo.IsAmazonFulfilled',
                    'Offers.Listings.Availability.Message',
                    'Offers.Listings.Availability.Type',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count'
                ]
            ]);
            
            error_log("🔍 基本セット検索完了: " . count($results['SearchResult']['Items'] ?? []) . "個の商品取得");
            return $results;
            
        } catch (Exception $e) {
            error_log("⚠️ 基本セット検索エラー: " . $e->getMessage());
            return ['SearchResult' => ['Items' => []]];
        }
    }
    
    /**
     * 🎯 汚れタイプ別基本セットキーワード生成
     */
    private function generateBasicSetKeywords($dirtType) {
        $basicSets = [
            '油汚れ' => 'キッチン洗剤 スポンジ ゴム手袋 掃除セット',
            'カビ' => 'カビ取り剤 ブラシ 手袋 マスク 掃除セット',
            '水垢' => '浴室洗剤 スポンジ クロス 手袋 掃除セット',
            'ホコリ' => 'マイクロファイバークロス 住宅洗剤 マスク 掃除セット',
            '手垢' => '中性洗剤 クロス 手袋 掃除セット',
            '焦げ' => 'クレンザー スポンジ たわし 手袋 掃除セット',
            '尿石' => 'トイレ洗剤 ブラシ 手袋 マスク 掃除セット',
            '石鹸カス' => '浴室洗剤 スポンジ ブラシ 手袋 掃除セット',
            'ヤニ' => '住宅洗剤 クロス 手袋 マスク 掃除セット',
            '皮脂汚れ' => '中性洗剤 クロス 手袋 掃除セット'
        ];
        
        return $basicSets[$dirtType] ?? "掃除セット 洗剤 スポンジ 手袋";
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