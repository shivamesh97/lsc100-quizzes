/* Score calculations and charts shared by the Analytics and Report pages. */
(function () {
  const { esc, natural } = window.Portal;

  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  const pct = x => Math.round(x * 100);
  const day = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const mean = l => l.length ? l.reduce((a, r) => a + r.score / r.out, 0) / l.length : 0;
  const studentKey = (name, klass) => norm(name) + "|" + norm(klass);

  /**
   * Turns the raw analytics reply into first attempts and per-student summaries.
   * filter: { cls, chapter }  (cls is the quiz's class, e.g. "11")
   */
  function compute(data, filter) {
    filter = filter || {};
    const quizById = {};
    data.quizzes.forEach(q => { quizById[q.id] = q; });
    const rows = data.responses
      .map(r => ({ t: new Date(r[0]), q: quizById[r[1]], name: r[2], klass: r[3], score: Number(r[4]) || 0, out: Number(r[5]) || 0, ans: String(r[6] || "") }))
      .filter(r => r.q && r.out > 0 && norm(r.name))
      .filter(r => (!filter.cls || r.q.cls === filter.cls) && (!filter.chapter || r.q.chapter === filter.chapter))
      .sort((a, b) => a.t - b.t);

    // Only each student's first attempt at each quiz counts
    const seen = new Set(), attempts = {}, first = [];
    rows.forEach(r => {
      r.key = studentKey(r.name, r.klass);
      const k = r.key + "|" + r.q.id;
      attempts[k] = (attempts[k] || 0) + 1;
      if (!seen.has(k)) { seen.add(k); first.push(r); }
    });

    const map = {};
    first.forEach(r => {
      const s = map[r.key] = map[r.key] || { key: r.key, name: r.name, klass: r.klass, list: [] };
      if (/[A-Z]/.test(r.name) && !/[A-Z]/.test(s.name)) s.name = r.name;
      s.list.push(r);
    });
    const students = Object.values(map).map(s => {
      s.avg = mean(s.list);
      s.retakes = s.list.reduce((a, r) => a + (attempts[r.key + "|" + r.q.id] - 1), 0);
      s.trend = trendOf(s.list);
      s.last = s.list[s.list.length - 1].t;
      return s;
    });
    return { quizById, first, attempts, students };
  }

  // Change between a student's last 3 quizzes and the 3 before (needs at least 4 quizzes)
  function trendOf(list) {
    if (list.length < 4) return null;
    return mean(list.slice(-3)) - mean(list.slice(-6, -3));
  }

  // Average per topic for one list of attempts, best and worst first
  function topicAverages(list) {
    const by = {};
    list.forEach(r => { const k = r.q.chapter + " › " + r.q.topic; (by[k] = by[k] || []).push(r); });
    return Object.keys(by).map(k => ({ k, avg: mean(by[k]), n: by[k].length })).sort((a, b) => a.avg - b.avg || natural(a.k, b.k));
  }

  function status(a) {
    if (a < 0.4) return { cls: "bad", text: "⚠ Needs help" };
    if (a < 0.6) return { cls: "warn", text: "◐ Watch" };
    return { cls: "good", text: "✓ On track" };
  }
  function statusPill(a) { const s = status(a); return `<span class="pill ${s.cls}">${s.text}</span>`; }

  function trendText(t) {
    if (t == null) return "Not enough quizzes yet";
    const p = Math.round(t * 100);
    if (Math.abs(p) < 5) return "Steady";
    return p > 0 ? "Improving (+" + p + ")" : "Dropping (" + p + ")";
  }
  function trendCell(t, title) {
    title = title || "Last 3 quizzes vs the 3 before";
    if (t == null) return `<span class="meta" title="Needs at least 4 quizzes">—</span>`;
    const p = Math.round(t * 100);
    if (Math.abs(p) < 5) return `<span class="meta" title="${esc(title)}">→ ${p > 0 ? "+" : ""}${p}</span>`;
    return p > 0 ? `<span class="pill good" title="${esc(title)}">▲ +${p}</span>` : `<span class="pill bad" title="${esc(title)}">▼ ${p}</span>`;
  }

  // Weeks start on Monday
  const pad = n => String(n).padStart(2, "0");
  function periodKey(d, mode) {
    if (mode === "month") return d.getFullYear() + "-" + pad(d.getMonth() + 1);
    const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
    return m.getFullYear() + "-" + pad(m.getMonth() + 1) + "-" + pad(m.getDate());
  }
  function periodLabel(k, mode) {
    const p = k.split("-").map(Number);
    if (mode === "month") return new Date(p[0], p[1] - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    return "Wk of " + new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  // Scores over time for one student: a dot for each quiz, a line for the running average
  function studentChart(list) {
    const W = 640, H = 200, L = 40, R = 12, T = 12, B = 28;
    const ts = list.map(r => +r.t), t0 = Math.min(...ts), t1 = Math.max(...ts);
    const x = t => t1 === t0 ? (L + W - R) / 2 : L + (t - t0) / (t1 - t0) * (W - L - R);
    const y = v => T + (1 - v) * (H - T - B);
    let sum = 0;
    const run = list.map((r, i) => { sum += r.score / r.out; return { t: +r.t, v: sum / (i + 1) }; });
    const grid = [0, 0.5, 1].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="g"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v * 100}%</text>`).join("");
    const ends = list.length === 1 ? [list[0]] : [list[0], list[list.length - 1]];
    const xl = ends.map((r, i) => `<text x="${x(+r.t)}" y="${H - 8}" text-anchor="${ends.length === 1 ? "middle" : i === 0 ? "start" : "end"}">${esc(day(r.t))}</text>`).join("");
    const line = run.length > 1 ? `<polyline class="avg" points="${run.map(p => x(p.t).toFixed(1) + "," + y(p.v).toFixed(1)).join(" ")}"/>` : "";
    const dots = list.map(r => `<circle class="dot" cx="${x(+r.t).toFixed(1)}" cy="${y(r.score / r.out).toFixed(1)}" r="5"><title>${esc(r.q.topic)} · Set ${esc(r.q.set)} · ${esc(day(r.t))} · ${r.score}/${r.out}</title></circle>`).join("");
    return `<div class="legend"><span><i class="k-dot"></i>Each quiz</span><span><i class="k-line"></i>Running average</span></div>
      <svg class="schart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Scores over time">${grid}${xl}${line}${dots}</svg>`;
  }

  window.Stats = { norm, pct, day, mean, studentKey, compute, trendOf, topicAverages, status, statusPill, trendText, trendCell, periodKey, periodLabel, studentChart };
})();
