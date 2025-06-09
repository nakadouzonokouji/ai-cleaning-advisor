/**
 * セキュリティ機能管理
 * 開発者モードで一時的に無効化可能
 */

// 開発者モード管理
window.devMode = {
    enabled: false,
    toggle: function() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            console.log('🔧 開発者モード有効化 - F12・右クリック使用可能');
            document.body.classList.add('dev-mode');
        } else {
            console.log('🔐 開発者モード無効化 - セキュリティ機能有効');
            document.body.classList.remove('dev-mode');
        }
        return this.enabled;
    }
};

// セキュリティ機能初期化
function initSecurity() {
    console.log('💡 デバッグ用: window.devMode.toggle() でF12・右クリック切り替え');
    
    // 右クリック防止
    document.addEventListener('contextmenu', function(e) {
        if (!window.devMode.enabled) {
            e.preventDefault();
            showSecurityAlert('右クリックは無効化されています（開発者: devMode.toggle()）');
            return false;
        }
    });
    
    // F12・開発者ツールキー防止
    document.addEventListener('keydown', function(e) {
        if (!window.devMode.enabled) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                showSecurityAlert('F12・開発者ツールは無効化中（開発者: devMode.toggle()）');
                return false;
            }
        }
    });
    
    // テキスト選択防止（入力フィールド除く）
    document.addEventListener('selectstart', function(e) {
        if (!window.devMode.enabled && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });
    
    console.log('🔐 セキュリティ保護有効（開発者モードで無効化可能）');
}

// セキュリティアラート表示
function showSecurityAlert(message) {
    if (!window.devMode.enabled) {
        console.warn('🚫 ' + message);
    }
}

// 初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurity);
} else {
    initSecurity();
}