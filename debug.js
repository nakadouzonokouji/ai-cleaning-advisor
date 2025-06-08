/**
 * AI掃除アドバイザー - デバッグシステム（修正版）
 * CX Mainte © 2025
 */

class DebugLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
        this.enableConsole = true;
        this.startTime = Date.now();
        this.performanceMarks = new Map();
        this.isReady = false;
        
        // 設定が読み込まれるまで待機
        this.initializeWhenReady();
    }

    initializeWhenReady() {
        const checkReady = () => {
            if (typeof window.DEBUG_CONFIG !== 'undefined') {
                this.maxLogs = window.DEBUG_CONFIG.maxLogEntries || 100;
                this.enableConsole = window.DEBUG_CONFIG.enableConsoleLog !== false;
                this.isReady = true;
                this.log('デバッグシステム初期化完了', 'success');
            } else {
                setTimeout(checkReady, 50);
            }
        };
        checkReady();
    }

    log(message, type = 'info', data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { 
            timestamp, 
            message, 
            type, 
            data,
            elapsed: Date.now() - this.startTime
        };
        
        this.logs.push(logEntry);
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        if (this.enableConsole) {
            const consoleMethod = type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'log';
            console[consoleMethod](`[${type.toUpperCase()}] ${message}`, data || '');
        }
        
        // DOM準備完了後にUI更新
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.updateLogDisplay();
        }
        
        this.updatePerformanceStats();
    }

    updateLogDisplay() {
        const logContent = document.getElementById('logContent');
        if (!logContent) return;

        const colorMap = {
            'info': 'text-green-400',
            'warn': 'text-yellow-400', 
            'error': 'text-red-400',
            'success': 'text-blue-400'
        };
        
        const recentLogs = this.logs.slice(-20);
        const logHtml = recentLogs.map(log => {
            const color = colorMap[log.type] || 'text-green-400';
            const elapsed = `+${log.elapsed}ms`;
            return `<div class="${color}">[${log.timestamp}] [${elapsed}] ${this.escapeHtml(log.message)}</div>`;
        }).join('');
        
        logContent.innerHTML = logHtml;
        logContent.scrollTop = logContent.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updatePerformanceStats() {
        // メモリ情報取得（利用可能な場合のみ）
        let memoryInfo = null;
        try {
            if (performance.memory) {
                memoryInfo = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                };
            }
        } catch (e) {
            // performance.memory が利用できない環境では無視
        }

        if (memoryInfo && this.logs.length % 20 === 0) {
            this.log(`メモリ使用量: ${memoryInfo.used}MB / ${memoryInfo.total}MB`, 'info');
        }
    }

    markPerformance(name) {
        try {
            const now = performance.now();
            if (this.performanceMarks.has(name)) {
                const startTime = this.performanceMarks.get(name);
                const duration = now - startTime;
                this.log(`パフォーマンス[${name}]: ${duration.toFixed(2)}ms`, 'info');
                this.performanceMarks.delete(name);
            } else {
                this.performanceMarks.set(name, now);
            }
        } catch (e) {
            this.log(`パフォーマンス測定エラー: ${e.message}`, 'warn');
        }
    }

    clear() {
        this.logs = [];
        this.performanceMarks.clear();
        this.updateLogDisplay();
        this.log('ログクリア完了', 'info');
    }

    exportLogs() {
        const exportData = {
            timestamp: new Date().toISOString(),
            logs: this.logs,
            system: this.getSystemInfo(),
            performance: this.getPerformanceInfo()
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    getSystemInfo() {
        try {
            return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
        } catch (e) {
            return { error: 'システム情報取得エラー: ' + e.message };
        }
    }

    getPerformanceInfo() {
        try {
            const perfInfo = {};
            
            if (performance.timing) {
                perfInfo.timing = {
                    loadStart: performance.timing.loadEventStart - performance.timing.navigationStart,
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                };
            }
            
            if (performance.memory) {
                perfInfo.memory = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }
            
            return perfInfo;
        } catch (e) {
            return { error: 'パフォーマンス情報取得エラー: ' + e.message };
        }
    }
}

class ConnectionTester {
    constructor(debugLogger) {
        this.debugLogger = debugLogger;
        this.testResults = new Map();
    }

    async testGeminiConnection(apiKey) {
        this.debugLogger.log('Gemini API接続テスト開始', 'info');
        this.debugLogger.markPerformance('gemini-test');
        
        if (!apiKey || apiKey.trim() === '') {
            const error = 'APIキーが設定されていません';
            this.debugLogger.log(error, 'error');
            return { success: false, error };
        }
        
        try {
            const testPrompt = 'こんにちは。これはAPI接続テストです。「テスト成功」と返答してください。';
            
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: testPrompt }] }]
                    })
                }
            );

            this.debugLogger.markPerformance('gemini-test');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'レスポンス取得エラー';
            
            this.debugLogger.log(`Gemini API応答: ${responseText.substring(0, 50)}...`, 'success');
            
            this.testResults.set('gemini', {
                status: 'success',
                responseTime: performance.now(),
                response: responseText
            });
            
            return { success: true, message: 'Gemini API接続成功', response: responseText };
            
        } catch (error) {
            this.debugLogger.log(`Gemini API接続エラー: ${error.message}`, 'error');
            
            this.testResults.set('gemini', {
                status: 'error',
                error: error.message,
                responseTime: performance.now()
            });
            
            return { success: false, error: error.message };
        }
    }

    async testAmazonPAAPI() {
        this.debugLogger.log('Amazon PA-API設定確認開始', 'info');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const hasConfig = typeof window.AMAZON_PA_API_CONFIG !== 'undefined';
                    const hasAccessKey = hasConfig && window.AMAZON_PA_API_CONFIG.accessKey;
                    const hasSecretKey = hasConfig && window.AMAZON_PA_API_CONFIG.secretKey;
                    const hasAssociateTag = hasConfig && window.AMAZON_PA_API_CONFIG.associateTag;
                    
                    if (hasAccessKey && hasSecretKey && hasAssociateTag) {
                        this.debugLogger.log('Amazon PA-API設定確認完了', 'success');
                        this.testResults.set('amazon', {
                            status: 'configured',
                            message: 'アクセスキー設定済み'
                        });
                        resolve({ success: true, message: 'Amazon PA-API設定確認済み' });
                    } else {
                        this.debugLogger.log('Amazon PA-API設定が不完全です', 'warn');
                        resolve({ success: false, error: 'PA-API設定不完全' });
                    }
                } catch (error) {
                    this.debugLogger.log(`Amazon PA-API確認エラー: ${error.message}`, 'error');
                    resolve({ success: false, error: error.message });
                }
            }, 500);
        });
    }

    async testAllConnections(geminiApiKey) {
        this.debugLogger.log('全接続テスト開始', 'info');
        
        try {
            const results = await Promise.allSettled([
                this.testGeminiConnection(geminiApiKey),
                this.testAmazonPAAPI()
            ]);
            
            const summary = {
                gemini: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason?.message || 'テスト失敗' },
                amazon: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason?.message || 'テスト失敗' }
            };
            
            this.debugLogger.log(`接続テスト完了 - Gemini: ${summary.gemini.success ? '✅' : '❌'}, Amazon: ${summary.amazon.success ? '✅' : '❌'}`, 'info');
            
            return summary;
        } catch (error) {
            this.debugLogger.log(`接続テストエラー: ${error.message}`, 'error');
            return {
                gemini: { success: false, error: error.message },
                amazon: { success: false, error: error.message }
            };
        }
    }

    getTestResults() {
        return Object.fromEntries(this.testResults);
    }
}

class SystemMonitor {
    constructor(debugLogger) {
        this.debugLogger = debugLogger;
        this.isMonitoring = false;
        this.monitorInterval = null;
        this.stats = {
            apiCalls: 0,
            errors: 0,
            startTime: Date.now()
        };
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.debugLogger.log('システム監視開始', 'info');
        
        this.monitorInterval = setInterval(() => {
            this.checkSystemHealth();
        }, 30000); // 30秒間隔
    }

    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        
        this.debugLogger.log('システム監視停止', 'info');
    }

    checkSystemHealth() {
        try {
            const uptime = Date.now() - this.stats.startTime;
            const uptimeMinutes = Math.floor(uptime / 60000);
            
            this.debugLogger.log(`システム稼働時間: ${uptimeMinutes}分, API呼び出し: ${this.stats.apiCalls}回, エラー: ${this.stats.errors}回`, 'info');
            
            // メモリ使用量チェック（利用可能な場合のみ）
            try {
                if (performance.memory) {
                    const memoryUsagePercent = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
                    if (memoryUsagePercent > 80) {
                        this.debugLogger.log(`メモリ使用率が高くなっています: ${memoryUsagePercent.toFixed(1)}%`, 'warn');
                    }
                }
            } catch (e) {
                // メモリ情報が利用できない場合は無視
            }
        } catch (error) {
            this.debugLogger.log(`システムヘルスチェックエラー: ${error.message}`, 'error');
        }
    }

    recordApiCall() {
        this.stats.apiCalls++;
    }

    recordError() {
        this.stats.errors++;
    }

    getStats() {
        return {
            ...this.stats,
            uptime: Date.now() - this.stats.startTime,
            errorRate: this.stats.apiCalls > 0 ? (this.stats.errors / this.stats.apiCalls * 100).toFixed(2) : 0
        };
    }
}

class DebugUI {
    constructor(debugLogger, connectionTester, systemMonitor) {
        this.debugLogger = debugLogger;
        this.connectionTester = connectionTester;
        this.systemMonitor = systemMonitor;
        this.isDebugVisible = false;
        
        // DOM準備完了後に初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.updateStatusIndicators();
    }

    updateStatusIndicators() {
        // Amazon PA-API状態
        const amazonStatus = document.getElementById('amazonApiStatus');
        if (amazonStatus) {
            try {
                const hasConfig = typeof window.AMAZON_PA_API_CONFIG !== 'undefined' && 
                                window.AMAZON_PA_API_CONFIG.accessKey && 
                                window.AMAZON_PA_API_CONFIG.secretKey;
                
                if (hasConfig) {
                    amazonStatus.innerHTML = '✅ 設定済み';
                    amazonStatus.className = 'text-green-300';
                } else {
                    amazonStatus.innerHTML = '❌ 未設定';
                    amazonStatus.className = 'text-red-300';
                }
            } catch (e) {
                amazonStatus.innerHTML = '❌ エラー';
                amazonStatus.className = 'text-red-300';
            }
        }

        // セキュリティ状態
        const securityStatus = document.getElementById('securityStatus');
        if (securityStatus) {
            try {
                const isProtected = typeof window.SECURITY_CONFIG !== 'undefined' && 
                                  window.SECURITY_CONFIG.enableContentProtection;
                
                securityStatus.innerHTML = isProtected ? '✅ 保護中' : '⚠️ 無効';
                securityStatus.className = isProtected ? 'text-green-300' : 'text-yellow-300';
            } catch (e) {
                securityStatus.innerHTML = '⚠️ 不明';
                securityStatus.className = 'text-yellow-300';
            }
        }
    }

    updateGeminiStatus(status, className = 'text-yellow-300') {
        const geminiStatus = document.getElementById('geminiApiStatus');
        if (geminiStatus) {
            geminiStatus.innerHTML = status;
            geminiStatus.className = className;
        }
    }

    updateProductStatus(status, className = 'text-yellow-300') {
        const productStatus = document.getElementById('productStatus');
        if (productStatus) {
            productStatus.innerHTML = status;
            productStatus.className = className;
        }
    }

    toggleDebugLog() {
        const debugLog = document.getElementById('debugLog');
        if (debugLog) {
            this.isDebugVisible = !this.isDebugVisible;
            debugLog.classList.toggle('hidden', !this.isDebugVisible);
            
            const toggleBtn = document.getElementById('toggleDebugBtn');
            if (toggleBtn) {
                toggleBtn.textContent = this.isDebugVisible ? '📋 ログ非表示' : '📋 ログ表示';
            }
            
            this.debugLogger.log(`デバッグログ表示: ${this.isDebugVisible ? 'ON' : 'OFF'}`, 'info');
        }
    }

    showConnectionTestResults(results) {
        let message = '接続テスト結果:\n\n';
        
        if (results.gemini) {
            message += `🤖 Gemini API: ${results.gemini.success ? '✅ 成功' : '❌ 失敗'}\n`;
            if (results.gemini.error) {
                message += `   エラー: ${results.gemini.error}\n`;
            }
        }
        
        if (results.amazon) {
            message += `🛒 Amazon PA-API: ${results.amazon.success ? '✅ 設定済み' : '❌ 未設定'}\n`;
        }
        
        // より優雅なダイアログ表示も考えられるが、シンプルにalertを使用
        alert(message);
    }

    exportConfiguration() {
        try {
            const config = {
                timestamp: new Date().toISOString(),
                version: window.APP_CONFIG?.version || '不明',
                amazonPAAPI: {
                    configured: typeof window.AMAZON_PA_API_CONFIG !== 'undefined',
                    hasAccessKey: !!(window.AMAZON_PA_API_CONFIG?.accessKey),
                    hasSecretKey: !!(window.AMAZON_PA_API_CONFIG?.secretKey),
                    associateTag: window.AMAZON_PA_API_CONFIG?.associateTag || '未設定',
                    region: window.AMAZON_PA_API_CONFIG?.region || '未設定'
                },
                geminiAPI: {
                    configured: !!(window.currentGeminiApiKey),
                    keyPreview: window.currentGeminiApiKey ? 
                                window.currentGeminiApiKey.substring(0, 10) + '...' : '未設定'
                },
                system: this.debugLogger.getSystemInfo(),
                stats: this.systemMonitor.getStats(),
                logs: this.debugLogger.logs.slice(-10) // 最新10件のログのみ
            };
            
            return JSON.stringify(config, null, 2);
        } catch (error) {
            this.debugLogger.log(`設定エクスポートエラー: ${error.message}`, 'error');
            return JSON.stringify({ error: '設定エクスポートに失敗しました: ' + error.message }, null, 2);
        }
    }
}

// 安全なグローバルインスタンス作成
function initializeDebugSystem() {
    try {
        // デバッグログ作成
        window.debugLogger = new DebugLogger();
        
        // 接続テスト作成
        window.connectionTester = new ConnectionTester(window.debugLogger);
        
        // システム監視作成
        window.systemMonitor = new SystemMonitor(window.debugLogger);
        
        // デバッグUI作成
        window.debugUI = new DebugUI(window.debugLogger, window.connectionTester, window.systemMonitor);
        
        // システム監視開始
        window.systemMonitor.startMonitoring();
        
        // 初期化完了ログ
        window.debugLogger.log('デバッグシステム完全初期化完了', 'success');
        
    } catch (error) {
        console.error('デバッグシステム初期化エラー:', error);
    }
}

// DOM準備完了後に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDebugSystem);
} else {
    initializeDebugSystem();
}

// パフォーマンス監視
window.addEventListener('load', () => {
    if (window.debugLogger) {
        window.debugLogger.log('ページ読み込み完了', 'success');
        try {
            window.debugLogger.log(`読み込み時間: ${performance.now().toFixed(2)}ms`, 'info');
        } catch (e) {
            window.debugLogger.log('読み込み時間測定不可', 'warn');
        }
    }
});

// エラー監視
window.addEventListener('error', (event) => {
    if (window.debugLogger) {
        window.debugLogger.log(`JavaScript エラー: ${event.error?.message || event.message}`, 'error', {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
    }
    if (window.systemMonitor) {
        window.systemMonitor.recordError();
    }
});

// 未処理のPromise拒否を監視
window.addEventListener('unhandledrejection', (event) => {
    if (window.debugLogger) {
        window.debugLogger.log(`未処理のPromise拒否: ${event.reason}`, 'error');
    }
    if (window.systemMonitor) {
        window.systemMonitor.recordError();
    }
});

console.log('🔧 デバッグシステム準備完了（修正版）');