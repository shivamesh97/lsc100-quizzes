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

  // ---------- theme: follows the device unless the teacher picks Light or Dark ----------
  const THEMES = ["auto", "light", "dark"];
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  }
  function getTheme() { const t = ls.get("tp_theme"); return THEMES.includes(t) ? t : "auto"; }
  applyTheme(getTheme());
  function themeLabel(t) { return { auto: "Theme: Auto", light: "Theme: Light", dark: "Theme: Dark" }[t]; }
  function cycleTheme() {
    const next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
    ls.set("tp_theme", next === "auto" ? null : next);
    applyTheme(next);
    document.querySelectorAll("[data-theme-btn]").forEach(b => { b.textContent = themeLabel(next); b.title = "Theme: " + next + " (click to change)"; });
  }

  // ---------- class switch shared by every page ----------
  const CLASSES = (CFG.CLASSES && CFG.CLASSES.length ? CFG.CLASSES : ["9", "10", "11", "12"]).map(String);
  const DEFAULT_CLASS = CLASSES.includes("11") ? "11" : CLASSES[0];
  function getClass() { const c = String(prefsGet("class", DEFAULT_CLASS)); return CLASSES.includes(c) ? c : DEFAULT_CLASS; }
  function setClass(c) {
    prefsSet("class", c);
    document.querySelectorAll("[data-class-btn]").forEach(b => b.setAttribute("aria-pressed", b.dataset.classBtn === c));
    document.dispatchEvent(new CustomEvent("portal:class", { detail: c }));
  }
  function prefsGet(k, d) { try { const v = JSON.parse(ls.get("tp_pref_" + k)); return v == null ? d : v; } catch (e) { return d; } }
  function prefsSet(k, v) { ls.set("tp_pref_" + k, JSON.stringify(v)); }

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

  // Logo: set LOGO in config.js (e.g. "assets/logo.png"); without it, a simple ring mark is drawn.
  function logoHtml(cls) {
    return CFG.LOGO ? `<img class="${cls}" src="${esc(CFG.LOGO)}" alt="">` : `<span class="ring" aria-hidden="true"></span>`;
  }
  if (CFG.LOGO) {
    const icon = document.createElement("link");
    icon.rel = "icon"; icon.href = CFG.LOGO;
    document.head.appendChild(icon);
  }

  // opts.classSwitch: show the Class 11 / Class 12 switch (pages that filter by class)
  function header(active, user, opts) {
    opts = opts || {};
    const cls = getClass();
    const el = document.createElement("header");
    el.className = "top";
    el.innerHTML =
      `<div class="top-in">
        <a class="brand" href="index.html">${logoHtml("logo")}<span><b>${esc(CFG.CENTRE_NAME || "Teacher Portal")}</b><small>Teacher Portal</small></span></a>
        ${user ? `<nav class="nav" aria-label="Main">
          <a href="index.html" ${active === "subjects" ? 'aria-current="page"' : ""}>Subjects</a>
          <a href="attendance.html" ${active === "attendance" ? 'aria-current="page"' : ""}>Attendance</a>
          <a href="analytics.html" ${active === "analytics" ? 'aria-current="page"' : ""}>Analytics</a>
          ${user.isAdmin ? `<a href="overview.html" ${active === "overview" ? 'aria-current="page"' : ""}>Overview</a>` : ""}
        </nav>` : ""}
        ${user && opts.classSwitch ? `<div class="classsw" role="group" aria-label="Class"><span class="classsw-label">Class</span>${CLASSES.map(c =>
          `<button type="button" data-class-btn="${esc(c)}" aria-pressed="${c === cls}" aria-label="Class ${esc(c)}">${esc(c)}</button>`).join("")}</div>` : ""}
        <div class="who">
          ${user && user.picture ? `<img src="${esc(user.picture)}" alt="" referrerpolicy="no-referrer">` : ""}
          ${user ? `<span>${esc(user.name || user.email)}</span>` : ""}
          <button class="linkbtn" type="button" data-theme-btn title="Theme: ${getTheme()} (click to change)">${themeLabel(getTheme())}</button>
          ${user ? `<button class="linkbtn top-only" id="signout" type="button">Sign out</button>` : ""}
        </div>
      </div>`;
    document.body.prepend(el);
    if (user) {
      // Bottom bar on phones
      const bn = document.createElement("nav");
      bn.className = "bottomnav"; bn.setAttribute("aria-label", "Main");
      bn.innerHTML = `
        <a href="index.html" ${active === "subjects" ? 'aria-current="page"' : ""}><span aria-hidden="true">▤</span>Subjects</a>
        <a href="attendance.html" ${active === "attendance" ? 'aria-current="page"' : ""}><span aria-hidden="true">☑</span>Attendance</a>
        <a href="analytics.html" ${active === "analytics" ? 'aria-current="page"' : ""}><span aria-hidden="true">▥</span>Analytics</a>
        ${user.isAdmin ? `<a href="overview.html" ${active === "overview" ? 'aria-current="page"' : ""}><span aria-hidden="true">◫</span>Overview</a>` : ""}
        <button type="button" id="signout2"><span aria-hidden="true">⇥</span>Sign out</button>`;
      document.body.appendChild(bn);
      document.body.classList.add("has-bottomnav");
      bn.querySelector("#signout2").onclick = signOut;
    }
    el.querySelectorAll("[data-theme-btn]").forEach(b => b.onclick = cycleTheme);
    el.querySelectorAll("[data-class-btn]").forEach(b => b.onclick = () => setClass(b.dataset.classBtn));
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

  const prefs = { get: prefsGet, set: prefsSet };

  // Download rows as a CSV file that opens in Excel
  function downloadCsv(filename, rows) {
    const cell = v => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const text = "\ufeff" + rows.map(r => r.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = filename.replace(/[^\w.\- ]+/g, "_");
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  window.Portal = { getClass, setClass, CLASSES, downloadCsv, logoHtml, CFG, DEMO, TOKEN, ME, ls, token, payload, api, me, signOut, header, esc, natural, toast, copy, prefs, goLogin };
})();