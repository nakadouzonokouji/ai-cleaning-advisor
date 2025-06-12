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
     * 🔍 汚れタイプ別リアルタイム商品検索（3グループ並行）
     */
    public function searchByDirtType($dirtType, $itemCount = 30) {
        error_log("🔍 3グループ並行検索開始: $dirtType");
        
        // 3つのグループで並行検索（エラーハンドリング付き）
        try {
            $cleanerResults = $this->searchProductGroup($dirtType, 'cleaners', 10);
        } catch (Exception $e) {
            error_log("⚠️ 洗剤検索エラー: " . $e->getMessage());
            $cleanerResults = ['SearchResult' => ['Items' => []]];
        }
        
        try {
            $toolResults = $this->searchProductGroup($dirtType, 'tools', 10);
        } catch (Exception $e) {
            error_log("⚠️ 道具検索エラー: " . $e->getMessage());
            $toolResults = ['SearchResult' => ['Items' => []]];
        }
        
        try {
            $protectionResults = $this->searchProductGroup($dirtType, 'protection', 10);
        } catch (Exception $e) {
            error_log("⚠️ 保護具検索エラー: " . $e->getMessage());
            $protectionResults = ['SearchResult' => ['Items' => []]];
        }
        
        // 結果をマージ
        $mergedResults = [
            'SearchResult' => [
                'Items' => array_merge(
                    $cleanerResults['SearchResult']['Items'] ?? [],
                    $toolResults['SearchResult']['Items'] ?? [],
                    $protectionResults['SearchResult']['Items'] ?? []
                )
            ]
        ];
        
        error_log("🔍 3グループ検索完了: 洗剤" . count($cleanerResults['SearchResult']['Items'] ?? []) . 
                  "個, 道具" . count($toolResults['SearchResult']['Items'] ?? []) . 
                  "個, 保護具" . count($protectionResults['SearchResult']['Items'] ?? []) . "個");
        
        return $mergedResults;
    }
    
    /**
     * 🎯 商品グループ別検索
     */
    private function searchProductGroup($dirtType, $group, $itemCount) {
        $keywords = $this->generateGroupKeywords($dirtType, $group);
        
        error_log("🔍 グループ検索: $group -> $keywords");
        
        return $this->searchProducts([
            'Keywords' => $keywords,
            'SearchIndex' => 'All',
            'ItemCount' => $itemCount,
            'SortBy' => 'Featured', // 売れ筋順
            'Availability' => 'Available', // 購入可能な商品のみ
            'Condition' => 'New', // 新品のみ
            'MinPrice' => 100, // 最低価格100円（無効な商品を除外）
            'MaxPrice' => 50000, // 最高価格5万円（異常な高額商品を除外）
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
    }
    
    /**
     * 🎯 グループ別キーワード生成
     */
    private function generateGroupKeywords($dirtType, $group) {
        $baseKeywords = [
            'cleaners' => [
                '油汚れ' => '油汚れ 洗剤 キッチン クリーナー マジックリン アルカリ性',
                'カビ' => 'カビ取り 洗剤 カビキラー 塩素系 除菌 漂白 浴室',
                '水垢' => '水垢 除去 洗剤 クエン酸 茂木和哉 酸性 バス',
                'ホコリ' => 'ホコリ取り 洗剤 クリーナー 中性',
                '手垢' => '手垢 除去 洗剤 中性洗剤 アルコール',
                '焦げ' => '焦げ落とし 洗剤 重曹 クレンザー キッチン',
                '尿石' => '尿石 除去 洗剤 サンポール 酸性 トイレ',
                '石鹸カス' => '石鹸カス 除去 洗剤 バス クリーナー',
                'ヤニ' => 'ヤニ取り 洗剤 除去 クリーナー',
                '皮脂汚れ' => '皮脂汚れ 除去 洗剤 中性洗剤'
            ],
            'tools' => [
                '油汚れ' => 'スポンジ ブラシ キッチン 掃除用具 激落ちくん',
                'カビ' => 'ブラシ スポンジ カビ取り 浴室 掃除用具',
                '水垢' => 'スポンジ クロス 水垢 除去 掃除用具',
                'ホコリ' => 'クロス ワイパー モップ ホコリ取り 掃除用具',
                '手垢' => 'クロス スポンジ 掃除用具 マイクロファイバー',
                '焦げ' => 'スポンジ ブラシ たわし 掃除用具 キッチン',
                '尿石' => 'ブラシ トイレブラシ 掃除用具',
                '石鹸カス' => 'スポンジ ブラシ 浴室 掃除用具',
                'ヤニ' => 'クロス スポンジ 掃除用具',
                '皮脂汚れ' => 'クロス スポンジ 掃除用具'
            ],
            'protection' => [
                '油汚れ' => '手袋 マスク ゴム手袋 キッチン用 保護具',
                'カビ' => '手袋 マスク 防塵マスク ゴム手袋 保護具',
                '水垢' => '手袋 ゴム手袋 掃除用手袋 保護具',
                'ホコリ' => 'マスク 防塵マスク 手袋 保護具',
                '手垢' => '手袋 ゴム手袋 保護具',
                '焦げ' => '手袋 ゴム手袋 キッチン用 保護具',
                '尿石' => '手袋 マスク ゴム手袋 保護具',
                '石鹸カス' => '手袋 ゴム手袋 保護具',
                'ヤニ' => '手袋 マスク 保護具',
                '皮脂汚れ' => '手袋 ゴム手袋 保護具'
            ]
        ];
        
        return $baseKeywords[$group][$dirtType] ?? "$dirtType 掃除";
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