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
                'SearchIndex' => 'All', // より広範囲で検索
                'ItemCount' => $itemCount,
                'SortBy' => 'Relevance', // 関連性順
                'Resources' => [
                    'Images.Primary.Large',
                    'ItemInfo.Title',
                    'Offers.Listings.Price'
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
        // シンプルなキーワードで成功率を上げる
        $basicSets = [
            '油汚れ' => 'キッチン 洗剤',
            'カビ' => 'カビ取り 洗剤', 
            '水垢' => '浴室 洗剤',
            'ホコリ' => '掃除 クロス',
            '手垢' => '中性 洗剤',
            '焦げ' => 'クレンザー',
            '尿石' => 'トイレ 洗剤',
            '石鹸カス' => '浴室 洗剤',
            'ヤニ' => '住宅 洗剤',
            '皮脂汚れ' => '中性 洗剤'
        ];
        
        return $basicSets[$dirtType] ?? "洗剤";
    }
    
    
    
    /**
     * 🛒 Amazon PA-API SearchItems 実行
     */
    private function searchProducts($params) {
        $payloadData = [
            'Keywords' => $params['Keywords'],
            'SearchIndex' => $params['SearchIndex'],
            'ItemCount' => $params['ItemCount'],
            'PartnerTag' => $this->associateTag,
            'PartnerType' => 'Associates',
            'SortBy' => $params['SortBy'],
            'Availability' => $params['Availability'] ?? 'Available',
            'Condition' => $params['Condition'] ?? 'New',
            'Resources' => $params['Resources']
        ];
        
        // Optional parameters (only add if not null)
        if (isset($params['MinPrice'])) $payloadData['MinPrice'] = $params['MinPrice'];
        if (isset($params['MaxPrice'])) $payloadData['MaxPrice'] = $params['MaxPrice'];
        if (isset($params['Merchant'])) $payloadData['Merchant'] = $params['Merchant'];
        
        $payload = json_encode($payloadData);
        error_log("🔍 Amazon API Payload: " . $payload);
        
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
        $curlError = curl_error($ch);
        curl_close($ch);
        
        error_log("🔍 Amazon API Response: HTTP $httpCode");
        error_log("🔍 Response body: " . substr($response, 0, 500));
        
        if ($curlError) {
            error_log("🚨 CURL Error: $curlError");
            throw new Exception("CURL error: $curlError");
        }
        
        if ($httpCode !== 200) {
            error_log("Amazon API Error: HTTP $httpCode - Response: $response");
            throw new Exception("Amazon API request failed: HTTP $httpCode");
        }
        
        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("🚨 JSON Decode Error: " . json_last_error_msg());
            throw new Exception("JSON decode error: " . json_last_error_msg());
        }
        
        return $decoded;
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