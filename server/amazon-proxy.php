<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['asins']) || !is_array($input['asins'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid ASINs']);
    exit;
}

// Amazon PA-API v5 実装
function getAmazonProducts($asins) {
    $host = 'webservices.amazon.co.jp';
    $region = 'us-west-2';
    $service = 'ProductAdvertisingAPI';
    $endpoint = 'https://webservices.amazon.co.jp/paapi5/getitems';
    
    $payload = json_encode([
        'ItemIds' => $asins,
        'Resources' => [
            'Images.Primary.Medium',
            'Images.Primary.Large',
            'ItemInfo.Title',
            'ItemInfo.Features',
            'Offers.Listings.Price'
        ],
        'PartnerTag' => AMAZON_ASSOCIATE_TAG,
        'PartnerType' => 'Associates',
        'Marketplace' => 'www.amazon.co.jp'
    ]);
    
    // AWS Signature V4
    $accessKey = AMAZON_ACCESS_KEY;
    $secretKey = AMAZON_SECRET_KEY;
    
    $timestamp = gmdate('Ymd\THis\Z');
    $date = gmdate('Ymd');
    
    // Create canonical request
    $canonicalHeaders = "content-type:application/json; charset=utf-8\n";
    $canonicalHeaders .= "host:$host\n";
    $canonicalHeaders .= "x-amz-date:$timestamp\n";
    $canonicalHeaders .= "x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems\n";
    
    $signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
    $payloadHash = hash('sha256', $payload);
    
    $canonicalRequest = "POST\n/paapi5/getitems\n\n$canonicalHeaders\n$signedHeaders\n$payloadHash";
    
    // Create string to sign
    $algorithm = 'AWS4-HMAC-SHA256';
    $credentialScope = "$date/$region/$service/aws4_request";
    $stringToSign = "$algorithm\n$timestamp\n$credentialScope\n" . hash('sha256', $canonicalRequest);
    
    // Calculate signature
    $kDate = hash_hmac('sha256', $date, 'AWS4' . $secretKey, true);
    $kRegion = hash_hmac('sha256', $region, $kDate, true);
    $kService = hash_hmac('sha256', $service, $kRegion, true);
    $kSigning = hash_hmac('sha256', 'aws4_request', $kService, true);
    $signature = hash_hmac('sha256', $stringToSign, $kSigning);
    
    // Create authorization header
    $authorization = "$algorithm Credential=$accessKey/$credentialScope, SignedHeaders=$signedHeaders, Signature=$signature";
    
    // Make request
    $headers = [
        'Content-Type: application/json; charset=utf-8',
        'Host: ' . $host,
        'X-Amz-Date: ' . $timestamp,
        'X-Amz-Target: com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
        'Authorization: ' . $authorization
    ];
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $endpoint,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        return null;
    }
}

try {
    $amazonResponse = getAmazonProducts($input['asins']);
    
    if ($amazonResponse && isset($amazonResponse['ItemsResult']['Items'])) {
        $products = [];
        foreach ($amazonResponse['ItemsResult']['Items'] as $item) {
            $asin = $item['ASIN'];
            $title = $item['ItemInfo']['Title']['DisplayValue'] ?? '';
            $imageUrl = $item['Images']['Primary']['Medium']['URL'] ?? '';
            $price = $item['Offers']['Listings'][0]['Price']['DisplayAmount'] ?? '';
            
            $products[] = [
                'asin' => $asin,
                'title' => $title,
                'image' => $imageUrl,
                'price' => $price,
                'url' => "https://www.amazon.co.jp/dp/$asin?tag=" . AMAZON_ASSOCIATE_TAG
            ];
        }
        
        echo json_encode([
            'success' => true,
            'products' => $products,
            'message' => 'Amazon商品情報取得成功'
        ]);
    } else {
        // フォールバック: 静的画像URL生成
        $products = [];
        foreach ($input['asins'] as $asin) {
            $products[] = [
                'asin' => $asin,
                'title' => '商品名取得中...',
                'image' => "https://images-na.ssl-images-amazon.com/images/P/$asin.01._SCLZZZZZZZ_SX300_.jpg",
                'price' => '価格確認中...',
                'url' => "https://www.amazon.co.jp/dp/$asin?tag=" . AMAZON_ASSOCIATE_TAG
            ];
        }
        
        echo json_encode([
            'success' => true,
            'products' => $products,
            'message' => 'フォールバック画像使用'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>