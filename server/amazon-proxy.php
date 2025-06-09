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

try {
    // 現在はフォールバック商品情報を提供（Amazon PA-API統合は将来実装）
    $products = [];
    foreach ($input['asins'] as $asin) {
        // 基本的な商品情報を構築
        $products[] = [
            'asin' => $asin,
            'title' => '商品情報を確認中...',
            'image' => "https://images-na.ssl-images-amazon.com/images/P/$asin.01._SCLZZZZZZZ_SX300_.jpg",
            'price' => '価格を確認中...',
            'url' => "https://www.amazon.co.jp/dp/$asin?tag=" . AMAZON_ASSOCIATE_TAG,
            'rating' => '4.0',
            'reviewCount' => '確認中'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'message' => 'Amazon商品リンク準備完了'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'サービス一時利用不可'
    ]);
}
?>