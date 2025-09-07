// Minimal MD5 for fp (keep parity with pageHook)
function md5(str) {
  function add(x, y) { return (x + y) & 0xffffffff; }
  function rol(x, c) { return (x << c) | (x >>> (32 - c)); }
  function cmn(q, a, b, x, s, t) { return add(rol(add(add(a, q), add(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function md51(s) {
    const n = ((s.length + 8) >> 6) + 1;
    const blks = new Array(n * 16).fill(0);
    for (let i = 0; i < s.length; i++) blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
    blks[s.length >> 2] |= 0x80 << ((s.length % 4) * 8);
    blks[n * 16 - 2] = s.length * 8;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < blks.length; i += 16) {
      const oa = a, ob = b, oc = c, od = d;
      a = ff(a, b, c, d, blks[i], 7, -680876936);
      d = ff(d, a, b, c, blks[i+1], 12, -389564586);
      c = ff(c, d, a, b, blks[i+2], 17, 606105819);
      b = ff(b, c, d, a, blks[i+3], 22, -1044525330);
      a = ff(a, b, c, d, blks[i+4], 7, -176418897);
      d = ff(d, a, b, c, blks[i+5], 12, 1200080426);
      c = ff(c, d, a, b, blks[i+6], 17, -1473231341);
      b = ff(b, c, d, a, blks[i+7], 22, -45705983);
      a = ff(a, b, c, d, blks[i+8], 7, 1770035416);
      d = ff(d, a, b, c, blks[i+9], 12, -1958414417);
      c = ff(c, d, a, b, blks[i+10], 17, -42063);
      b = ff(b, c, d, a, blks[i+11], 22, -1990404162);
      a = ff(a, b, c, d, blks[i+12], 7, 1804603682);
      d = ff(d, a, b, c, blks[i+13], 12, -40341101);
      c = ff(c, d, a, b, blks[i+14], 17, -1502002290);
      b = ff(b, c, d, a, blks[i+15], 22, 1236535329);
      a = gg(a, b, c, d, blks[i+1], 5, -165796510);
      d = gg(d, a, b, c, blks[i+6], 9, -1069501632);
      c = gg(c, d, a, b, blks[i+11], 14, 643717713);
      b = gg(b, c, d, a, blks[i], 20, -373897302);
      a = gg(a, b, c, d, blks[i+5], 5, -701558691);
      d = gg(d, a, b, c, blks[i+10], 9, 38016083);
      c = gg(c, d, a, b, blks[i+15], 14, -660478335);
      b = gg(b, c, d, a, blks[i+4], 20, -405537848);
      a = gg(a, b, c, d, blks[i+9], 5, 568446438);
      d = gg(d, a, b, c, blks[i+14], 9, -1019803690);
      c = gg(c, d, a, b, blks[i+3], 14, -187363961);
      b = gg(b, c, d, a, blks[i+8], 20, 1163531501);
      a = gg(a, b, c, d, blks[i+13], 5, -1444681467);
      d = gg(d, a, b, c, blks[i+2], 9, -51403784);
      c = gg(c, d, a, b, blks[i+7], 14, 1735328473);
      b = gg(b, c, d, a, blks[i+12], 20, -1926607734);
      a = hh(a, b, c, d, blks[i+5], 4, -378558);
      d = hh(d, a, b, c, blks[i+8], 11, -2022574463);
      c = hh(c, d, a, b, blks[i+11], 16, 1839030562);
      b = hh(b, c, d, a, blks[i+14], 23, -35309556);
      a = hh(a, b, c, d, blks[i+1], 4, -1530992060);
      d = hh(d, a, b, c, blks[i+4], 11, 1272893353);
      c = hh(c, d, a, b, blks[i+7], 16, -155497632);
      b = hh(b, c, d, a, blks[i+10], 23, -1094730640);
      a = hh(a, b, c, d, blks[i+13], 4, 68127917);
      d = hh(d, a, b, c, blks[i], 11, -358537222);
      c = hh(c, d, a, b, blks[i+3], 16, -722521979);
      b = hh(b, c, d, a, blks[i+6], 23, 76029189);
      a = ii(a, b, c, d, blks[i], 6, -198630844);
      d = ii(d, a, b, c, blks[i+7], 10, 1126891415);
      c = ii(c, d, a, b, blks[i+14], 15, -1416354905);
      b = ii(b, c, d, a, blks[i+5], 21, -57434055);
      a = ii(a, b, c, d, blks[i+12], 6, 1700485571);
      d = ii(d, a, b, c, blks[i+3], 10, -1894986606);
      c = ii(c, d, a, b, blks[i+10], 15, -1051523);
      b = ii(b, c, d, a, blks[i+1], 21, -2054922799);
      a = ii(a, b, c, d, blks[i+8], 6, 1873313359);
      d = ii(d, a, b, c, blks[i+15], 10, -30611744);
      c = ii(c, d, a, b, blks[i+6], 15, -1560198380);
      b = ii(b, c, d, a, blks[i+13], 21, 1309151649);
      a = add(a, oa); b = add(b, ob); c = add(c, oc); d = add(d, od);
    }
    function rhex(n){ let s = '', j; for (j=0; j<4; j++) s += ('0'+(((n >> (j*8)) & 255).toString(16))).slice(-2); return s; }
    return rhex(a)+rhex(b)+rhex(c)+rhex(d);
  }
  return md51(str);
}

async function getCfClearanceForTab(senderTab) {
  try {
    const url = 'https://wplace.live/';
    const cookie = await chrome.cookies.get({ url, name: 'cf_clearance' });
    return cookie && cookie.value ? cookie.value : null;
  } catch (_) { return null; }
}

async function computePawtectInPage(tabId, tValue, fp) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: async (t, fpVal) => {
        try {
          const backend = 'https://backend.wplace.live';
          const mod = await import('/_app/immutable/chunks/BBb1ALhY.js');
          const wasm = await mod._();
          try {
            const me = await fetch(`${backend}/me`, { credentials: 'include' }).then(r => r.ok ? r.json() : null);
            if (me?.id && typeof mod.i === 'function') mod.i(me.id);
          } catch {}
          if (typeof mod.r === 'function') mod.r(`${backend}/s0/pixel/1/1`);
          const enc = new TextEncoder();
          const dec = new TextDecoder();
          const rx = Math.floor(Math.random()*1000);
          const ry = Math.floor(Math.random()*1000);
          const bodyObj = { colors:[0], coords:[rx,ry], fp: String(fpVal||''), t: String(t||'') };
          const rawBody = JSON.stringify(bodyObj);
          const bytes = enc.encode(rawBody);
          const inPtr = wasm.__wbindgen_malloc(bytes.length, 1);
          new Uint8Array(wasm.memory.buffer, inPtr, bytes.length).set(bytes);
          const out = wasm.get_pawtected_endpoint_payload(inPtr, bytes.length);
          let token;
          if (Array.isArray(out)) {
            const [outPtr, outLen] = out; token = dec.decode(new Uint8Array(wasm.memory.buffer, outPtr, outLen));
            try { wasm.__wbindgen_free(outPtr, outLen, 1); } catch {}
          } else if (typeof out === 'string') {
            token = out;
          } else if (out && typeof out.ptr === 'number' && typeof out.len === 'number') {
            token = dec.decode(new Uint8Array(wasm.memory.buffer, out.ptr, out.len));
            try { wasm.__wbindgen_free(out.ptr, out.len, 1); } catch {}
          }
          return token || null;
        } catch (_) {
          return null;
        }
      },
      args: [tValue, fp]
    });
    const first = results && results[0] && results[0].result;
    return first || null;
  } catch (_) {
    return null;
  }
}

function postToServer(payloadObj) {
  const payload = JSON.stringify(payloadObj);
  const headers = { 'Content-Type': 'application/json' };
  try { fetch('http://localhost:3000/api/token', { method: 'POST', headers, body: payload, mode: 'no-cors' }).catch(() => {}); } catch (_) {}
  try { fetch('http://127.0.0.1:3000/api/token', { method: 'POST', headers, body: payload, mode: 'no-cors' }).catch(() => {}); } catch (_) {}
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Legacy path: token captured via pixel hook
  if (msg && msg.type === 'wplace_token_found' && msg.token) {
    const toStore = { wplace_token: msg.token };
    if (msg.xpaw) toStore.wplace_xpaw_token = msg.xpaw;
    if (msg.worldX) toStore.wplace_world_x = String(msg.worldX);
    if (msg.worldY) toStore.wplace_world_y = String(msg.worldY);
    chrome.storage.local.set(toStore, async () => {
      // Enrich with cf_clearance if available
      const cf = await getCfClearanceForTab(sender && sender.tab);
      const payloadObj = {
        token: String(msg.token),
        xpaw: msg.xpaw || null,
        fp: msg.fp || null,
        worldX: msg.worldX || null,
        worldY: msg.worldY || null,
        cf_clearance: cf || null,
      };
      postToServer(payloadObj);
      sendResponse({ ok: true });
    });
    return true;
  }

  // New path: Turnstile token captured on page load (no painting needed)
  if (msg && msg.type === 'wplace_turnstile' && msg.token) {
    (async () => {
      const tabId = sender && sender.tab && sender.tab.id;
      if (!tabId) { sendResponse({ ok: false }); return; }
      // Generate md5-based fp
      const fpSeed = Date.now().toString() + Math.random().toString(16).slice(2);
      const fp = md5(fpSeed);
      // Try to compute pawtect token in page MAIN world
      const xpaw = await computePawtectInPage(tabId, String(msg.token), fp);
      // Try to read cf_clearance
      const cf = await getCfClearanceForTab(sender && sender.tab);
      // Persist xpaw for UI convenience
      const toStore = { wplace_token: String(msg.token) };
      if (xpaw) toStore.wplace_xpaw_token = xpaw;
      chrome.storage.local.set(toStore, () => {});
      // POST to server
      postToServer({ token: String(msg.token), xpaw: xpaw || null, fp, worldX: null, worldY: null, cf_clearance: cf || null });
      sendResponse({ ok: true });
    })();
    return true;
  }

  // Autopaint: reload the full tab from background so it works from iframes
  if (msg && msg.type === 'wplace_autopaint_reload') {
    try {
      const tabId = sender && sender.tab && sender.tab.id;
      if (tabId) chrome.tabs.reload(tabId);
    } catch (_) {}
    sendResponse({ ok: true });
    return true;
  }
});


