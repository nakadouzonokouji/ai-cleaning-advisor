/**
 * 商品監視システム - admin.html用
 * Amazon商品のリンク切れ・在庫切れを監視
 */

export class ProductMonitor {
    constructor() {
        this.monitoringResults = [];
        this.lastCheck = null;
        this.checkInterval = null;
        this.isMonitoring = false;
        
        // 商品チェック用の設定
        this.checkConfig = {
            timeout: 10000, // 10秒タイムアウト
            retryCount: 2,
            batchSize: 5 // 5件ずつ並列チェック
        };
        
        console.log('🔍 商品監視システム初期化完了');
    }

    /**
     * 全商品のヘルスチェック開始
     */
    async startProductHealthCheck() {
        if (this.isMonitoring) {
            console.log('⚠️ 既に監視中です');
            return;
        }

        this.isMonitoring = true;
        this.updateUI('monitoring', '商品監視を開始しています...');
        
        try {
            // 商品データを取得
            const products = await this.getAllProducts();
            console.log(`📦 監視対象商品: ${products.length}件`);
            
            // バッチごとに商品をチェック
            const results = [];
            for (let i = 0; i < products.length; i += this.checkConfig.batchSize) {
                const batch = products.slice(i, i + this.checkConfig.batchSize);
                const batchResults = await this.checkProductsBatch(batch);
                results.push(...batchResults);
                
                // UIを更新
                this.updateUI('progress', `監視中: ${i + batch.length}/${products.length}`);
                
                // API制限を避けるため少し待機
                await this.sleep(1000);
            }
            
            this.monitoringResults = results;
            this.lastCheck = new Date();
            
            // 問題のある商品を特定
            const problemProducts = results.filter(r => !r.isHealthy);
            console.log(`⚠️ 問題のある商品: ${problemProducts.length}件`);
            
            this.updateUI('complete', results, problemProducts);
            
        } catch (error) {
            console.error('❌ 商品監視エラー:', error);
            this.updateUI('error', error.message);
        } finally {
            this.isMonitoring = false;
        }
    }

    /**
     * 商品データを全て取得
     */
    async getAllProducts() {
        const products = [];
        
        try {
            // products.jsからデータを取得
            const productsModule = await import('../config/products.js');
            const { COMPREHENSIVE_CLEANING_PRODUCTS } = productsModule;
            
            Object.entries(COMPREHENSIVE_CLEANING_PRODUCTS).forEach(([categoryKey, categoryData]) => {
                if (categoryData.products) {
                    categoryData.products.forEach(product => {
                        products.push({
                            ...product,
                            categoryKey,
                            categoryName: categoryData.category,
                            id: `${categoryKey}-${product.asin}`
                        });
                    });
                }
            });
            
        } catch (error) {
            console.error('❌ 商品データ取得エラー:', error);
        }
        
        return products;
    }

    /**
     * 商品のバッチチェック
     */
    async checkProductsBatch(products) {
        const promises = products.map(product => this.checkSingleProduct(product));
        return await Promise.all(promises);
    }

    /**
     * 単一商品のヘルスチェック
     */
    async checkSingleProduct(product) {
        const result = {
            id: product.id,
            name: product.name,
            asin: product.asin,
            category: product.categoryName,
            isHealthy: true,
            issues: [],
            checkTime: new Date(),
            amazonUrl: `https://www.amazon.co.jp/dp/${product.asin}`,
            responseTime: null
        };

        try {
            // Amazon商品ページのヘルスチェック
            const healthCheck = await this.checkAmazonProductHealth(product.asin);
            
            result.responseTime = healthCheck.responseTime;
            result.httpStatus = healthCheck.status;
            
            if (!healthCheck.isAvailable) {
                result.isHealthy = false;
                result.issues.push({
                    type: 'availability',
                    message: 'Amazon商品ページにアクセスできません',
                    severity: 'high'
                });
            }
            
            if (healthCheck.responseTime > 5000) {
                result.issues.push({
                    type: 'performance',
                    message: `応答時間が遅い (${healthCheck.responseTime}ms)`,
                    severity: 'medium'
                });
            }
            
            // Amazon画像の存在チェック
            const imageCheck = await this.checkProductImage(product.asin);
            if (!imageCheck.isAvailable) {
                result.issues.push({
                    type: 'image',
                    message: '商品画像が取得できません',
                    severity: 'low'
                });
            }
            
        } catch (error) {
            result.isHealthy = false;
            result.issues.push({
                type: 'error',
                message: `チェック中にエラー: ${error.message}`,
                severity: 'high'
            });
        }

        return result;
    }

    /**
     * Amazon商品の可用性チェック
     */
    async checkAmazonProductHealth(asin) {
        const startTime = Date.now();
        
        try {
            // サーバープロキシ経由でチェック
            const response = await fetch('/tools/ai-cleaner/server/amazon-proxy.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'health_check',
                    asin: asin
                })
            });
            
            const responseTime = Date.now() - startTime;
            
            return {
                isAvailable: response.ok,
                status: response.status,
                responseTime: responseTime
            };
            
        } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                isAvailable: false,
                status: 0,
                responseTime: responseTime,
                error: error.message
            };
        }
    }

    /**
     * 商品画像の存在チェック
     */
    async checkProductImage(asin) {
        const imageUrls = [
            `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`,
            `https://m.media-amazon.com/images/I/${asin}.jpg`
        ];

        for (const url of imageUrls) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    return { isAvailable: true, url: url };
                }
            } catch (e) {
                continue;
            }
        }

        return { isAvailable: false };
    }

    /**
     * 自動監視開始
     */
    startAutoMonitoring(intervalHours = 24) {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        const intervalMs = intervalHours * 60 * 60 * 1000;
        this.checkInterval = setInterval(() => {
            console.log('🔄 定期商品監視を実行');
            this.startProductHealthCheck();
        }, intervalMs);

        console.log(`⏰ 自動監視開始: ${intervalHours}時間間隔`);
    }

    /**
     * 自動監視停止
     */
    stopAutoMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('⏹️ 自動監視停止');
        }
    }

    /**
     * 問題レポート生成
     */
    generateProblemReport() {
        const problems = this.monitoringResults.filter(r => !r.isHealthy);
        
        const report = {
            summary: {
                totalProducts: this.monitoringResults.length,
                healthyProducts: this.monitoringResults.filter(r => r.isHealthy).length,
                problemProducts: problems.length,
                checkTime: this.lastCheck
            },
            highPriorityIssues: problems.filter(p => 
                p.issues.some(issue => issue.severity === 'high')
            ),
            mediumPriorityIssues: problems.filter(p => 
                p.issues.some(issue => issue.severity === 'medium')
            ),
            lowPriorityIssues: problems.filter(p => 
                p.issues.every(issue => issue.severity === 'low')
            )
        };

        return report;
    }

    /**
     * レポートをCSVエクスポート
     */
    exportReportCSV() {
        const report = this.generateProblemReport();
        const allProblems = [
            ...report.highPriorityIssues,
            ...report.mediumPriorityIssues,
            ...report.lowPriorityIssues
        ];

        const csv = [
            'カテゴリ,商品名,ASIN,問題の種類,詳細,重要度,チェック時刻',
            ...allProblems.map(product => 
                product.issues.map(issue => 
                    `"${product.category}","${product.name}","${product.asin}","${issue.type}","${issue.message}","${issue.severity}","${product.checkTime.toLocaleString('ja-JP')}"`
                ).join('\n')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `product-issues-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    /**
     * UI更新
     */
    updateUI(status, data, problemData = null) {
        const statusElement = document.getElementById('monitorStatus');
        const resultsElement = document.getElementById('monitorResults');
        const statsElement = document.getElementById('monitorStats');

        switch (status) {
            case 'monitoring':
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="flex items-center text-blue-600">
                            <div class="loading w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                            ${data}
                        </div>
                    `;
                }
                break;

            case 'progress':
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="flex items-center text-blue-600">
                            <div class="loading w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                            ${data}
                        </div>
                    `;
                }
                break;

            case 'complete':
                const report = this.generateProblemReport();
                
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="text-green-600">
                            ✅ 監視完了 (${new Date().toLocaleString('ja-JP')})
                        </div>
                    `;
                }

                if (statsElement) {
                    statsElement.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <div class="text-2xl font-bold text-blue-600">${report.summary.totalProducts}</div>
                                <div class="text-sm text-gray-600">総商品数</div>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <div class="text-2xl font-bold text-green-600">${report.summary.healthyProducts}</div>
                                <div class="text-sm text-gray-600">正常商品</div>
                            </div>
                            <div class="bg-red-50 p-4 rounded-lg">
                                <div class="text-2xl font-bold text-red-600">${report.summary.problemProducts}</div>
                                <div class="text-sm text-gray-600">問題商品</div>
                            </div>
                            <div class="bg-yellow-50 p-4 rounded-lg">
                                <div class="text-2xl font-bold text-yellow-600">${report.highPriorityIssues.length}</div>
                                <div class="text-sm text-gray-600">緊急対応要</div>
                            </div>
                        </div>
                    `;
                }

                if (resultsElement && problemData) {
                    resultsElement.innerHTML = this.renderProblemTable(problemData);
                }
                break;

            case 'error':
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="text-red-600">
                            ❌ エラー: ${data}
                        </div>
                    `;
                }
                break;
        }
    }

    /**
     * 問題商品のテーブル表示
     */
    renderProblemTable(problems) {
        if (problems.length === 0) {
            return '<div class="text-center text-green-600 py-8">🎉 すべての商品が正常です！</div>';
        }

        return `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left">商品名</th>
                            <th class="px-4 py-3 text-left">カテゴリ</th>
                            <th class="px-4 py-3 text-left">問題</th>
                            <th class="px-4 py-3 text-left">重要度</th>
                            <th class="px-4 py-3 text-left">ASIN</th>
                            <th class="px-4 py-3 text-left">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${problems.map(product => `
                            <tr class="border-t">
                                <td class="px-4 py-3">${product.name}</td>
                                <td class="px-4 py-3">${product.category}</td>
                                <td class="px-4 py-3">
                                    ${product.issues.map(issue => `
                                        <div class="mb-1">
                                            <span class="text-xs ${this.getSeverityColor(issue.severity)}">${issue.message}</span>
                                        </div>
                                    `).join('')}
                                </td>
                                <td class="px-4 py-3">
                                    ${this.getHighestSeverityBadge(product.issues)}
                                </td>
                                <td class="px-4 py-3">
                                    <code class="text-xs bg-gray-100 px-1 py-0.5 rounded">${product.asin}</code>
                                </td>
                                <td class="px-4 py-3">
                                    <a href="${product.amazonUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 text-xs">
                                        Amazon確認
                                    </a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * 重要度の色を取得
     */
    getSeverityColor(severity) {
        switch (severity) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    }

    /**
     * 最高重要度のバッジを取得
     */
    getHighestSeverityBadge(issues) {
        const hasHigh = issues.some(i => i.severity === 'high');
        const hasMedium = issues.some(i => i.severity === 'medium');
        
        if (hasHigh) {
            return '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">緊急</span>';
        } else if (hasMedium) {
            return '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">中</span>';
        } else {
            return '<span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">低</span>';
        }
    }

    /**
     * 待機処理
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ProductMonitor;