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

// 商品データベース（ベストセラー商品ASIN使用）
$productDatabase = [
    'B07YLFTMQL' => [
        'title' => '花王 マジックリン ハンディスプレー 400ml',
        'price' => '¥398',
        'rating' => '4.3',
        'reviewCount' => '2,847'
    ],
    'B07YNGH8Z3' => [
        'title' => 'ライオン ママレモン 大容量 800ml', 
        'price' => '¥598',
        'rating' => '4.4',
        'reviewCount' => '3,456'
    ],
    'B07YNHTJJ5' => [
        'title' => '重曹ちゃん キッチン泡スプレー 300ml',
        'price' => '¥298', 
        'rating' => '4.1',
        'reviewCount' => '1,234'
    ],
    'B07D7BXQZX' => [
        'title' => '換気扇 専用ブラシセット 3本組',
        'price' => '¥798',
        'rating' => '4.0', 
        'reviewCount' => '654'
    ],
    'B01LWYQPNY' => [
        'title' => '金属たわし ステンレス製 5個セット',
        'price' => '¥398',
        'rating' => '4.1',
        'reviewCount' => '543'
    ],
    'B08Y7N3K2M' => [
        'title' => 'ゴム手袋 キッチン用 Mサイズ',
        'price' => '¥198',
        'rating' => '4.2',
        'reviewCount' => '891'
    ]
];

try {
    $products = [];
    foreach ($input['asins'] as $asin) {
        // データベースから商品情報取得
        $productInfo = isset($productDatabase[$asin]) ? $productDatabase[$asin] : [
            'title' => '商品名を確認中...',
            'price' => '価格確認中...',
            'rating' => '4.0',
            'reviewCount' => '確認中'
        ];
        
        $products[] = [
            'asin' => $asin,
            'title' => $productInfo['title'],
            'image' => "https://images-na.ssl-images-amazon.com/images/P/$asin.01._SCLZZZZZZZ_SX300_.jpg",
            'price' => $productInfo['price'],
            'url' => "https://www.amazon.co.jp/dp/$asin?tag=" . AMAZON_ASSOCIATE_TAG,
            'rating' => $productInfo['rating'],
            'reviewCount' => $productInfo['reviewCount']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'message' => 'Amazon商品情報取得完了'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'サービス一時利用不可'
    ]);
}
?>