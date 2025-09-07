
(function injectPageHook() {
	try {
		const s = document.createElement('script');
		s.src = chrome.runtime.getURL('scripts/pageHook.js');
		s.async = false;
		(document.documentElement || document.head).appendChild(s);
		s.parentNode && s.parentNode.removeChild(s);
	} catch (e) {}
})();

window.addEventListener('message', function(ev) {
        if (!ev || !ev.data) return;
        const msg = ev.data;
        // Token from page pixel hook
        if (msg && msg.__wplace && msg.type === 'token_found' && msg.token) {
                try {
                        chrome.runtime.sendMessage({
                                type: 'wplace_token_found',
                                token: msg.token,
                                xpaw: msg.xpaw,
                                fp: msg.fp,
                                worldX: msg.worldX,
                                worldY: msg.worldY,
                        });
                } catch (e) {}
        }
        // Pawtect token from injected compute helper
        try {
                if (msg && msg.type === 'WPLACER_PAWTECT_TOKEN' && typeof msg.token === 'string') {
                        // Forward if we ever need it in background (not used directly here)
                        chrome.runtime.sendMessage({ type: 'wplace_pawtect_only', xpaw: msg.token });
                }
        } catch (e) {}
});

(function syncToggle() {
    // Only run autopaint logic in the top window. If access to top throws (cross-origin), assume top to avoid disabling.
    let isTop = true;
    try { isTop = (window.top === window); } catch (e) { isTop = true; }
    if (!isTop) return;
	let wplaceEnabled = true;
	function syncEnabledToPage() {
		try { window.postMessage({ __wplace: true, type: 'toggle', enabled: !!wplaceEnabled }, '*'); } catch (e) {}
	}

	let autopaintEnabled = false;
	let autopaintTimer = null;
	let blockCheckTimer = null;
	function stopAutopaint() {
		if (autopaintTimer) {
			try { clearInterval(autopaintTimer); } catch(e) {}
			autopaintTimer = null;
		}
		if (blockCheckTimer) {
			try { clearInterval(blockCheckTimer); } catch(e) {}
			blockCheckTimer = null;
		}
	}

	async function isAutopaintBlocked() {
		try {
			const r = await fetch('http://localhost:3000/api/autopaint-state', { method: 'GET' });
			if (!r.ok) return false;
			const j = await r.json();
			return !!(j && j.blocked);
		} catch (_) {
			try {
				const r = await fetch('http://127.0.0.1:3000/api/autopaint-state', { method: 'GET' });
				if (!r.ok) return false;
				const j = await r.json();
				return !!(j && j.blocked);
			} catch {}
		}
		return false;
	}
	function startAutopaint() {
		stopAutopaint();
		if (!autopaintEnabled) return;
		(async () => {
			const blocked = await isAutopaintBlocked();
			if (blocked) {
				// Poll until unblocked, then start
				try { console.log('wplace: autopaint blocked by server, waiting...'); } catch{}
				blockCheckTimer = setInterval(async () => {
					try {
						if (!autopaintEnabled) { stopAutopaint(); return; }
						const b = await isAutopaintBlocked();
						if (!b) { startAutopaint(); }
					} catch {}
				}, 1000);
				return;
			}
			try {
				try { console.log('wplace: autopaint enabled (every 10s)'); } catch(_) {}
				autopaintTimer = setInterval(() => {
					try { console.log('wplace: autopaint reload tick'); } catch(_) {}
					try { location.reload(); } catch (e) {}
				}, 10000); // 10s
			} catch (e) {}
		})();
	}
	try {
		chrome.storage.local.get(['wplace_enabled', 'wplace_autopaint_enabled'], function(result) {
			if (result && typeof result.wplace_enabled === 'boolean') {
				wplaceEnabled = result.wplace_enabled;
			}
			autopaintEnabled = !!(result && result.wplace_autopaint_enabled);
			syncEnabledToPage();
			startAutopaint();
		});
		chrome.storage.onChanged.addListener(function(changes, area) {
			if (area === 'local' && changes && Object.prototype.hasOwnProperty.call(changes, 'wplace_enabled')) {
				wplaceEnabled = !!changes.wplace_enabled.newValue;
				syncEnabledToPage();
			}
			if (area === 'local' && changes && Object.prototype.hasOwnProperty.call(changes, 'wplace_autopaint_enabled')) {
				autopaintEnabled = !!changes.wplace_autopaint_enabled.newValue;
				startAutopaint();
			}
		});
	} catch (e) {}
})();


// Also capture Turnstile tokens on load and send to background
try {
        window.addEventListener('message', function(ev) {
                try {
                        if (ev && ev.origin === 'https://challenges.cloudflare.com' && ev.data) {
                                const data = ev.data;
                                const token = data && (data.token || data.response || data['cf-turnstile-response']);
                                if (token && typeof token === 'string') {
                                        chrome.runtime.sendMessage({ type: 'wplace_turnstile', token: String(token) });
                                }
                        }
                } catch (e) {}
        }, true);
} catch (e) {}


