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
     * 🔍 汚れタイプ別基本セット商品検索（洗剤6種類、道具数種類、保護具数種類）
     */
    public function searchByDirtType($dirtType, $itemCount = 30) {
        error_log("🔍 基本セット検索開始: $dirtType");
        
        try {
            // 3つのカテゴリを並行検索
            $cleanerResults = $this->searchCleaners($dirtType, 6);
            $toolResults = $this->searchTools($dirtType, 5);
            $protectionResults = $this->searchProtection($dirtType, 4);
            
            // 結果をマージ
            $mergedItems = array_merge(
                $cleanerResults['SearchResult']['Items'] ?? [],
                $toolResults['SearchResult']['Items'] ?? [],
                $protectionResults['SearchResult']['Items'] ?? []
            );
            
            $results = [
                'SearchResult' => [
                    'Items' => $mergedItems,
                    'TotalResultCount' => count($mergedItems)
                ]
            ];
            
            error_log("🔍 基本セット検索完了: 洗剤" . count($cleanerResults['SearchResult']['Items'] ?? []) . 
                     "個、道具" . count($toolResults['SearchResult']['Items'] ?? []) . 
                     "個、保護具" . count($protectionResults['SearchResult']['Items'] ?? []) . "個");
            
            return $results;
            
        } catch (Exception $e) {
            error_log("⚠️ 基本セット検索エラー: " . $e->getMessage());
            return ['SearchResult' => ['Items' => []]];
        }
    }
    
    /**
     * 🧴 洗剤専用検索
     */
    private function searchCleaners($dirtType, $itemCount) {
        $cleanerKeywords = $this->generateBasicSetKeywords($dirtType);
        
        return $this->searchProducts([
            'Keywords' => $cleanerKeywords,
            'SearchIndex' => 'All',
            'ItemCount' => $itemCount,
            'SortBy' => 'Relevance',
            'Resources' => [
                'Images.Primary.Large',
                'ItemInfo.Title',
                'Offers.Listings.Price'
            ]
        ]);
    }
    
    /**
     * 🧽 道具専用検索
     */
    private function searchTools($dirtType, $itemCount) {
        $toolKeywords = [
            '油汚れ' => 'スポンジ ブラシ 換気扇 -洗剤',
            'カビ' => 'カビ取り ブラシ スポンジ -洗剤',
            '水垢' => 'ブラシ スポンジ 浴室 -洗剤',
            'ホコリ' => 'マイクロファイバー クロス ダスター',
            '手垢' => 'クロス タオル 雑巾',
            '焦げ' => 'たわし スポンジ 研磨 -洗剤',
            '尿石' => 'トイレブラシ スポンジ -洗剤',
            '石鹸カス' => '浴室 ブラシ スポンジ -洗剤',
            'ヤニ' => 'クロス タオル 掃除 -洗剤',
            '皮脂汚れ' => 'クロス スポンジ -洗剤'
        ];
        
        return $this->searchProducts([
            'Keywords' => $toolKeywords[$dirtType] ?? 'スポンジ ブラシ 掃除 -洗剤',
            'SearchIndex' => 'All',
            'ItemCount' => $itemCount,
            'SortBy' => 'Relevance',
            'Resources' => [
                'Images.Primary.Large',
                'ItemInfo.Title',
                'Offers.Listings.Price'
            ]
        ]);
    }
    
    /**
     * 🧤 保護具専用検索
     */
    private function searchProtection($dirtType, $itemCount) {
        return $this->searchProducts([
            'Keywords' => 'ゴム手袋 マスク エプロン 掃除 保護',
            'SearchIndex' => 'All',
            'ItemCount' => $itemCount,
            'SortBy' => 'Relevance',
            'Resources' => [
                'Images.Primary.Large',
                'ItemInfo.Title',
                'Offers.Listings.Price'
            ]
        ]);
    }
    
    /**
     * 🎯 汚れタイプ別基本セットキーワード生成
     */
    private function generateBasicSetKeywords($dirtType) {
        // 汚れタイプ別に具体的なキーワードで正確な商品を検索
        $basicSets = [
            '油汚れ' => 'マジックリン 換気扇 油汚れ 洗剤 -食器用',
            'カビ' => 'カビキラー 浴室 カビ取り 塩素系', 
            '水垢' => '茂木和哉 水垢 クエン酸 風呂',
            'ホコリ' => 'マイクロファイバー クロス 掃除',
            '手垢' => 'ウタマロ 中性 住宅 洗剤',
            '焦げ' => 'クレンザー ジフ 研磨',
            '尿石' => 'サンポール 酸性 トイレ',
            '石鹸カス' => 'バスマジックリン 浴室 石鹸カス',
            'ヤニ' => 'マイペット 住宅 ヤニ取り',
            '皮脂汚れ' => 'セスキ炭酸ソーダ アルカリ 皮脂'
        ];
        
        return $basicSets[$dirtType] ?? "住宅用 洗剤 -食器用";
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