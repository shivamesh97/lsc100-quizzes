/* Shared code for every page: settings, Google sign-in token, API calls, header. */
(function () {
  const CFG = window.PORTAL_CONFIG || {};
  const placeholder = v => !v || /PASTE_/.test(v);
  const DEMO = placeholder(CFG.API_URL) || placeholder(CFG.GOOGLE_CLIENT_ID);
  const TOKEN = "tp_token", ME = "tp_me";

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };

  function payload(t) {
    try {
      const p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(p))));
    } catch (e) { return null; }
  }
  function token() {
    const t = ls.get(TOKEN);
    if (!t) return null;
    const p = payload(t);
    if (!p || p.exp * 1000 < Date.now() + 60000) { ls.set(TOKEN, null); return null; }
    return t;
  }

  const MESSAGES = {
    not_allowed: "This Google account isn't on the teacher list. Ask the centre to add your email to the Teachers sheet, then sign in again.",
    subject_not_allowed: "You don't have access to this subject. Ask the centre to add it to your row in the Teachers sheet.",
    network: "Couldn't reach the server. Check your internet connection and try again.",
    bad_reply: "The server sent an unexpected reply. Check that the Apps Script web app is deployed with access set to Anyone.",
    server: "The server hit an error. Try again in a minute."
  };
  function fail(code, extra) { const e = new Error(MESSAGES[code] || extra || "Something went wrong."); e.code = code; return e; }

  function here() { return location.pathname.split("/").pop() + location.search; }
  function goLogin() { location.href = "index.html?next=" + encodeURIComponent(here()); }

  async function api(action, params) {
    if (DEMO) return window.PortalDemo.handle(action, params || {});
    const t = token();
    if (!t) { goLogin(); throw fail("signin", "Please sign in."); }
    let res;
    try {
      res = await fetch(CFG.API_URL, { method: "POST", body: JSON.stringify(Object.assign({ action, idToken: t }, params || {})) });
    } catch (e) { throw fail("network"); }
    let data;
    try { data = await res.json(); } catch (e) { throw fail("bad_reply"); }
    if (data.error === "not_signed_in") { ls.set(TOKEN, null); ls.set(ME, null); goLogin(); throw fail("signin", "Please sign in again."); }
    if (data.error) throw fail(data.error, data.message);
    return data;
  }

  async function me(force) {
    if (!force) {
      const cached = ls.get(ME);
      if (cached && (DEMO || token())) { try { return JSON.parse(cached); } catch (e) {} }
    }
    if (!DEMO && !token()) { goLogin(); throw fail("signin", "Please sign in."); }
    const data = await api("me");
    ls.set(ME, JSON.stringify(data.me));
    return data.me;
  }

  function signOut() {
    ls.set(TOKEN, null); ls.set(ME, null);
    try { window.google && google.accounts.id.disableAutoSelect(); } catch (e) {}
    location.href = "index.html";
  }

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const natural = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });

  // Logo: set LOGO in config.js (e.g. "assets/logo.jpg"); without it, a simple ring mark is drawn.
  function logoHtml(cls) {
    return CFG.LOGO ? `<img class="${cls}" src="${esc(CFG.LOGO)}" alt="">` : `<span class="ring" aria-hidden="true"></span>`;
  }
  if (CFG.LOGO) {
    const icon = document.createElement("link");
    icon.rel = "icon"; icon.href = CFG.LOGO;
    document.head.appendChild(icon);
  }

  function header(active, user) {
    const el = document.createElement("header");
    el.className = "top";
    el.innerHTML =
      `<div class="top-in">
        <a class="brand" href="index.html">${logoHtml("logo")}<span><b>${esc(CFG.CENTRE_NAME || "Teacher Portal")}</b><small>Teacher Portal</small></span></a>
        ${user ? `<nav class="nav" aria-label="Main">
          <a href="index.html" ${active === "subjects" ? 'aria-current="page"' : ""}>Subjects</a>
          <a href="analytics.html" ${active === "analytics" ? 'aria-current="page"' : ""}>Analytics</a>
        </nav>
        <div class="who">${user.picture ? `<img src="${esc(user.picture)}" alt="" referrerpolicy="no-referrer">` : ""}<span>${esc(user.name || user.email)}</span><button class="linkbtn" id="signout">Sign out</button></div>` : ""}
      </div>`;
    document.body.prepend(el);
    if (DEMO) {
      const d = document.createElement("div");
      d.className = "demo-bar";
      d.textContent = "Demo mode: showing sample data. Add your Client ID and web app URL in config.js to connect the real portal.";
      el.after(d);
    }
    const so = el.querySelector("#signout");
    if (so) so.onclick = signOut;
  }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (x) {}
      ta.remove(); return ok;
    }
  }

  const prefs = {
    get(k, d) { try { const v = JSON.parse(ls.get("tp_pref_" + k)); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { ls.set("tp_pref_" + k, JSON.stringify(v)); }
  };

  window.Portal = { logoHtml, CFG, DEMO, TOKEN, ME, ls, token, payload, api, me, signOut, header, esc, natural, toast, copy, prefs, goLogin };
})();