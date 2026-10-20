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
    document.querySelectorAll(".ctx-c").forEach(x => { x.textContent = "Class " + c; });
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
    server: "The server hit an error. Try again in a minute.",
    unknown_quiz: "That quiz isn't on the portal any more. Go back to the quiz list and try again.",
    form_missing: "Couldn't open this quiz's Google Form. It may have been deleted or moved to the bin.",
    unknown_action: "The portal's server needs updating. Ask the admin to deploy the latest Apps Script version.",
    not_admin: "Only admins can do this. Admins are users with access to all subjects.",
    bad_email: "That doesn't look like an email address. Check it and try again.",
    need_subject: "Choose at least one subject, or make this user an admin.",
    user_exists: "This email is already on the list. Use Edit on their row instead.",
    unknown_user: "That user isn't on the list any more. Refresh the page.",
    self_lockout: "You can't remove your own admin access or turn off your own sign-in. Ask another admin to do it.",
    self_remove: "You can't remove yourself. Ask another admin to do it.",
    test_name: "Give the test a name, e.g. October monthly test.",
    bad_date: "Choose the date of the test.",
    bad_out_of: "Enter what the test is out of, e.g. 50.",
    bad_mark: "One of the marks is more than the test is out of, or isn't a number. Check the boxes marked in red.",
    unknown_test: "That test isn't on the portal any more. It may have been deleted. Refresh the page.",
    busy: "Someone else is saving at the same moment. Wait a few seconds and save again."
  };
  function fail(code, extra) { const e = new Error(MESSAGES[code] || extra || "Something went wrong."); e.code = code; return e; }

  function here() { return location.pathname.split("/").pop() + location.search; }
  function goLogin() { location.href = "index.html?next=" + encodeURIComponent(here()); }

  async function api(action, params) {
    if (DEMO) {
      const d = await window.PortalDemo.handle(action, params || {});
      if (d && d.error) throw fail(d.error, d.message);
      return d;
    }
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

  // ---------- subject shared by every page (the "Biology · Class 11" button in the header) ----------
  function getSubject(user) {
    const list = (user && user.subjects) || [];
    const s = prefsGet("subject", "");
    if (list.includes(s)) return s;
    const counts = (user && user.quizCounts) || {};
    return list.find(x => counts[x] > 0) || list[0] || "";
  }
  function setSubject(s) { prefsSet("subject", s); }

  // [key, page, label, phone icon]
  const NAV = [
    ["home", "index.html", "Home", "⌂"],
    ["quizzes", "quizzes.html", "Quizzes", "▤"],
    ["attendance", "attendance.html", "Attendance", "☑"],
    ["tests", "tests.html", "Tests", "✎"],
    ["results", "analytics.html", "Results", "▥"],
    ["admin", "overview.html", "Admin", "◫"]
  ];

  // active: home | quizzes | attendance | tests | results | admin
  // opts.context: show the subject and class button (pages that work on one subject and class).
  // Changing the subject reloads the page; changing the class fires "portal:class".
  function header(active, user, opts) {
    opts = opts || {};
    const cur = k => active === k ? 'aria-current="page"' : "";
    const subj = user ? getSubject(user) : "";
    const counts = (user && user.quizCounts) || {};
    const initial = user ? String(user.name || user.email || "?").trim().charAt(0).toUpperCase() : "";
    const el = document.createElement("header");
    el.className = "top";
    el.innerHTML =
      `<div class="top-in">
        <a class="brand" href="index.html">${logoHtml("logo")}<span><b>${esc(CFG.CENTRE_NAME || "Teacher Portal")}</b><small>Teacher Portal</small></span></a>
        ${user ? `<nav class="nav" aria-label="Main">${NAV.filter(n => n[0] !== "home" && (n[0] !== "admin" || user.isAdmin))
          .map(n => `<a href="${n[1]}" ${cur(n[0])}>${n[2]}</a>`).join("")}</nav>` : ""}
        ${user && opts.context && subj ? `<button type="button" class="ctxbtn" id="ctx-btn" aria-expanded="false" aria-controls="ctx-pop" title="Change subject or class">
          <span class="ctx-s">${esc(subj)}</span><span class="ctx-c">Class ${esc(getClass())}</span><span class="chev" aria-hidden="true">▾</span></button>` : ""}
        ${user ? `<button type="button" class="avatar" id="me-btn" aria-expanded="false" aria-controls="me-pop" aria-label="Your account and settings">${user.picture
          ? `<img src="${esc(user.picture)}" alt="" referrerpolicy="no-referrer">` : esc(initial)}</button>`
          : `<button class="linkbtn" type="button" data-theme-btn>${themeLabel(getTheme())}</button>`}
        ${user && opts.context && subj ? `<div class="pop" id="ctx-pop" hidden>
          <div class="field"><span class="label">Subject</span><div class="chips">${user.subjects.map(s =>
            `<button type="button" class="chip" data-subj="${esc(s)}" aria-pressed="${s === subj}">${esc(s)}${counts[s] ? ` <span class="meta">${counts[s]}</span>` : ""}</button>`).join("")}</div></div>
          <div class="field"><span class="label">Class</span><div class="chips">${CLASSES.map(c =>
            `<button type="button" class="chip" data-class-btn="${esc(c)}" aria-pressed="${c === getClass()}">Class ${esc(c)}</button>`).join("")}</div></div>
        </div>` : ""}
        ${user ? `<div class="pop" id="me-pop" hidden>
          <div class="me-who"><b>${esc(user.name || user.email)}</b><span class="meta">${esc(user.email || "")}</span>${user.isAdmin ? `<span class="pill good">Admin</span>` : ""}</div>
          <div class="menu">
            <a class="phone-only" href="analytics.html" ${cur("results")}>▥ Results</a>
            ${user.isAdmin ? `<a class="phone-only" href="overview.html" ${cur("admin")}>◫ Admin: overview and users</a>` : ""}
            <button type="button" data-theme-btn>${themeLabel(getTheme())}</button>
            <button type="button" id="signout">Sign out</button>
          </div>
        </div>` : ""}
      </div>`;
    document.body.prepend(el);
    if (user) {
      // Bottom bar on phones: the four everyday pages, then More (Results, Admin, theme, sign out)
      const bn = document.createElement("nav");
      bn.className = "bottomnav"; bn.setAttribute("aria-label", "Main");
      bn.innerHTML = NAV.slice(0, 4).map(n => `<a href="${n[1]}" ${cur(n[0])}><span aria-hidden="true">${n[2] === "Home" ? "⌂" : n[3]}</span>${n[2]}</a>`).join("") +
        `<button type="button" id="more-btn" aria-expanded="false" aria-controls="me-pop" ${active === "results" || active === "admin" ? 'aria-current="page"' : ""}><span aria-hidden="true">⋯</span>More</button>`;
      document.body.appendChild(bn);
      document.body.classList.add("has-bottomnav");
    }

    // Pop-up menus: one open at a time; tap outside or press Escape to close
    const pops = [["ctx-btn", "ctx-pop"], ["me-btn", "me-pop"], ["more-btn", "me-pop"]];
    function closeAll() {
      pops.forEach(([b, p]) => { const bb = document.getElementById(b), pp = document.getElementById(p); if (bb) bb.setAttribute("aria-expanded", "false"); if (pp) pp.hidden = true; });
    }
    pops.forEach(([b, p]) => {
      const bb = document.getElementById(b), pp = document.getElementById(p);
      if (!bb || !pp) return;
      bb.onclick = e => {
        e.stopPropagation();
        const open = pp.hidden;
        closeAll();
        if (open) { pp.hidden = false; bb.setAttribute("aria-expanded", "true"); pp.classList.toggle("from-bottom", b === "more-btn"); }
      };
      pp.onclick = e => e.stopPropagation();
    });
    document.addEventListener("click", closeAll);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

    el.querySelectorAll("[data-theme-btn]").forEach(b => b.onclick = cycleTheme);
    el.querySelectorAll("[data-class-btn]").forEach(b => b.onclick = () => { setClass(b.dataset.classBtn); closeAll(); });
    el.querySelectorAll("[data-subj]").forEach(b => b.onclick = () => {
      closeAll();
      if (b.dataset.subj === getSubject(user)) return;
      setSubject(b.dataset.subj);
      location.reload();
    });
    const so = el.querySelector("#signout");
    if (so) so.onclick = signOut;
    if (DEMO) {
      const d = document.createElement("div");
      d.className = "demo-bar";
      d.textContent = "Demo mode: showing sample data. Add your Client ID and web app URL in config.js to connect the real portal.";
      el.after(d);
    }
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

  window.Portal = { getSubject, setSubject, getClass, setClass, CLASSES, downloadCsv, logoHtml, CFG, DEMO, TOKEN, ME, ls, token, payload, api, me, signOut, header, esc, natural, toast, copy, prefs, goLogin };
})();