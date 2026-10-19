/* Demo mode: sample quizzes and made-up student scores, used only while config.js is not filled in. */
(function () {
  const QUIZZES = [{"id":"demo-bio-1","cls":"11","subject":"Biology","chapter":"Ch 1 The Living World","topic":"1.1 Diversity in the Living World","set":"A","link":"https://forms.gle/demo1","results":"","questions":["The number of species that are known and described ranges between:","Standardising the naming of living organisms so that an organism is known by the same name all over the world is called:","Scientific names of plants are based on principles and criteria given in the:","The binomial system of naming organisms was given by:","In the scientific name of mango, Mangifera indica, the word 'indica' represents the:","Which of the following is the correctly written scientific name of mango?","In the name Mangifera indica Linn., the abbreviation 'Linn.' indicates that:","'Dogs', 'Mammals', 'Wheat' and 'Plants' are convenient categories used to study organisms. The scientific term for such categories is:","The earliest classifications made by human beings were based on:","The word 'systematics' is derived from the Latin word 'systema', which means:"]},{"id":"demo-bio-2","cls":"11","subject":"Biology","chapter":"Ch 1 The Living World","topic":"1.1 Diversity in the Living World","set":"B","link":"https://forms.gle/demo2","results":"","questions":["Biodiversity refers to:","Animal taxonomists name animals according to the:","Describing an organism correctly so that we know to which organism a name is attached is called:","In a biological name, the first word represents the:","When handwritten, the two words of a biological name are:","Which of the following is NOT a rule of binomial nomenclature?","Classification is the process of grouping things into convenient categories based on:","Which processes are basic to taxonomy?","Linnaeus used which title for his publication?","Systematics takes into account:"]},{"id":"demo-bio-3","cls":"11","subject":"Biology","chapter":"Ch 1 The Living World","topic":"1.1 Diversity in the Living World","set":"C","link":"https://forms.gle/demo3","results":"","questions":["Scientific names are needed mainly because:","Scientific names ensure that:","In binomial nomenclature, each name has:","Biological names are generally in:","When we say 'mammals', we think of animals with:","Classifying all living organisms into different taxa based on their characteristics is called:","Which of the following is NOT listed as a basis of modern taxonomic studies?","The scope of systematics was later enlarged to include:","Which statement about taxa is correct?","The branch of study concerned with the relationships among different kinds of organisms is:"]},{"id":"demo-bio-4","cls":"11","subject":"Biology","chapter":"Ch 1 The Living World","topic":"1.2 Taxonomic Categories","set":"A","link":"https://forms.gle/demo4","results":"","questions":["All taxonomic categories together constitute the:","The lowest taxonomic category for all organisms is:","Which is the correct ascending sequence of taxonomic categories?","Lion, leopard and tiger are all species of the genus:","Potato and brinjal are different species but belong to the same genus:","The genera Solanum, Petunia and Datura are placed in the family:","Cat and dog are placed in which families, respectively?","Order Primata, comprising monkey, gorilla and gibbon, is placed in the class:","As we go higher from species to kingdom, the number of common characteristics:","Fishes, amphibians, reptiles, birds and mammals are included in phylum Chordata based on the presence of:"]},{"id":"demo-bio-5","cls":"11","subject":"Biology","chapter":"Ch 1 The Living World","topic":"1.2 Taxonomic Categories","set":"B","link":"https://forms.gle/demo5","results":"","questions":["Each category, referred to as a unit of classification, represents a rank and is commonly termed a:","In plants, classes with a few similar characters are assigned to a higher category called:","A genus is best described as:","Plant families are characterised on the basis of:","The plant families Convolvulaceae and Solanaceae are included in the order:","An order is an assemblage of:","The genus Felis includes:","The scientific name of the housefly is:","Wheat belongs to the class:","The highest taxonomic category is:"]},{"id":"demo-bio-6","cls":"11","subject":"Biology","chapter":"Ch 1 The Living World","topic":"1.2 Taxonomic Categories","set":"C","link":"https://forms.gle/demo6","results":"","questions":["Insects are recognised as a group because they share the common feature of:","According to the textbook, taxonomic groups or categories are:","In the scientific name Homo sapiens, the genus is:","Panthera pardus is the scientific name of the:","Mango and wheat belong to different classes but are placed in the same division:","The category 'Class' includes related:","Classes such as fishes, amphibians, reptiles, birds and mammals together constitute the phylum:","Mango (Mangifera indica) belongs to the family:","The housefly belongs to the phylum:","Which statement about the taxonomic hierarchy is correct?"]},{"id":"demo-bio2-1","cls":"11","subject":"Biology","chapter":"Ch 2 Biological Classification","topic":"2.1 Kingdom Monera","set":"A","link":"https://forms.gle/demo20","results":"","questions":["Sample question 1 (2.1 Kingdom Monera)","Sample question 2 (2.1 Kingdom Monera)","Sample question 3 (2.1 Kingdom Monera)","Sample question 4 (2.1 Kingdom Monera)","Sample question 5 (2.1 Kingdom Monera)","Sample question 6 (2.1 Kingdom Monera)","Sample question 7 (2.1 Kingdom Monera)","Sample question 8 (2.1 Kingdom Monera)","Sample question 9 (2.1 Kingdom Monera)","Sample question 10 (2.1 Kingdom Monera)"]},{"id":"demo-bio2-2","cls":"11","subject":"Biology","chapter":"Ch 2 Biological Classification","topic":"2.1 Kingdom Monera","set":"B","link":"https://forms.gle/demo21","results":"","questions":["Sample question 1 (2.1 Kingdom Monera)","Sample question 2 (2.1 Kingdom Monera)","Sample question 3 (2.1 Kingdom Monera)","Sample question 4 (2.1 Kingdom Monera)","Sample question 5 (2.1 Kingdom Monera)","Sample question 6 (2.1 Kingdom Monera)","Sample question 7 (2.1 Kingdom Monera)","Sample question 8 (2.1 Kingdom Monera)","Sample question 9 (2.1 Kingdom Monera)","Sample question 10 (2.1 Kingdom Monera)"]},{"id":"demo-bio2-3","cls":"11","subject":"Biology","chapter":"Ch 2 Biological Classification","topic":"2.2 Kingdom Protista","set":"A","link":"https://forms.gle/demo22","results":"","questions":["Sample question 1 (2.2 Kingdom Protista)","Sample question 2 (2.2 Kingdom Protista)","Sample question 3 (2.2 Kingdom Protista)","Sample question 4 (2.2 Kingdom Protista)","Sample question 5 (2.2 Kingdom Protista)","Sample question 6 (2.2 Kingdom Protista)","Sample question 7 (2.2 Kingdom Protista)","Sample question 8 (2.2 Kingdom Protista)","Sample question 9 (2.2 Kingdom Protista)","Sample question 10 (2.2 Kingdom Protista)"]}];
  const STUDENTS = [
    ["Riya Fernandes","11th",0.86],["Aarav Naik","11th",0.62],["Sana Shaikh","11th",0.74],
    ["Kevin D'Souza","11th",0.38],["Pooja Gaonkar","11th",0.55],["Nikhil Kamat","11th",0.91],
    ["Anjali Prabhu","11th",0.47],["Rohan Sawant","11th",0.69],["Fatima Khan","11th",0.33],
    ["Joel Rodrigues","11th",0.78],["Shreya Parab","11th",0.58],["Aditya Kerkar","11th",0.44]
  ];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const RESP = [];
  const start = Date.now() - 60 * 864e5;
  QUIZZES.forEach((q, qi) => {
    const diff = q.questions.map(() => rnd() * 0.5 - 0.2);
    STUDENTS.forEach((s, si) => {
      if (rnd() < 0.15) return;
      const when = new Date(start + qi * 6 * 864e5 + rnd() * 864e5).toISOString();
      const ans = diff.map(d => (rnd() < Math.min(0.97, Math.max(0.05, s[2] + [0.18, -0.12, 0.04][si % 3] * (qi / QUIZZES.length - 0.5) - d + 0.1)) ? "Y" : "N")).join("");
      const score = ans.split("Y").length - 1;
      RESP.push([when, q.id, s[0], "11", score, ans.length, ans, "D" + String(si + 1).padStart(2, "0")]);
    });
  });
  const SENT = { "demo-bio-1": { at: new Date(Date.now() - 6 * 864e5).toISOString(), by: "Mrs. Fernandes" }, "demo-bio-4": { at: new Date(Date.now() - 2 * 864e5).toISOString(), by: "Mrs. Fernandes" } };
  // Students tab for the demo: the 12 above, plus two who haven't taken a quiz yet
  const ROSTER = STUDENTS.map((s, i) => ({ id: "D" + String(i + 1).padStart(2, "0"), name: s[0], cls: "11", school: ["MES", "KV1", "SD"][i % 3], phone: "" }))
    .concat([{ id: "D13", name: "Meera Kamat", cls: "11", school: "MES", phone: "" }, { id: "D14", name: "Kiran Desai", cls: "11", school: "KV1", phone: "" }]);
  // Two typed names from an older quiz that don't match anyone exactly
  RESP.push([new Date(start + 864e5).toISOString(), QUIZZES[0].id, "riya f", "11th", 7, 10, "YYNYYNYYNY", ""]);
  RESP.push([new Date(start + 2 * 864e5).toISOString(), QUIZZES[1].id, "Adi Kerkar", "11th", 4, 10, "NYNNYNYNNY", ""]);
  // Six past Biology classes for the demo register
  const ATT = { "Biology|11": {} };
  for (let i = 6; i >= 1; i--) {
    const d = new Date(Date.now() - i * 3.5 * 864e5).toISOString().slice(0, 10), m = {};
    ROSTER.forEach((s, j) => { m[s.id] = (j * 7 + i * 3) % 10 < (j === 8 ? 5 : 9) ? "P" : "A"; });
    ATT["Biology|11"][d] = m;
  }
  function attTotals() { const t = {}; Object.values(ATT["Biology|11"]).forEach(m => Object.keys(m).forEach(id => { t[id] = t[id] || { p: 0, t: 0 }; t[id].t++; if (m[id] === "P") t[id].p++; })); return t; }
  // Whole-centre sample data for the Overview page (all classes and subjects), built once
  let OV = null;
  function overview() {
    if (OV) return OV;
    let sd = 99; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const first = ["Aarush","Bhavya","Chirag","Diya","Esha","Farhan","Gauri","Harsh","Isha","Jay","Kavya","Laksh","Mira","Neel","Ojas","Prisha","Rhea","Siddh","Tanvi","Uday","Vani","Yash"];
    const last = ["Naik","Prabhu","Kamat","Sawant","Gaonkar","Shet","Parab","Desai","Rodrigues","Fernandes","Kerkar"];
    const plan = { "9": [["Maths","Science","Hindi"], 6], "10": [["Maths","Science"], 7], "12": [["Physics","Chemistry","Biology"], 5], "12m": [["Physics","Chemistry","Maths"], 4] };
    const students = ROSTER.map((s, i) => ({ id: s.id, name: s.name, cls: "11", school: s.school, subjects: i % 3 === 0 ? ["Physics","Chemistry","Maths","Biology"] : ["Physics","Chemistry","Biology"], ab: STUDENTS[i] ? STUDENTS[i][2] : 0.6, at: 0.7 + r() * 0.3 }));
    let n = 100;
    Object.keys(plan).forEach(k => { const [subs, count] = plan[k]; for (let i = 0; i < count; i++) students.push({ id: "D" + (n++), name: first[(n * 7) % first.length] + " " + last[(n * 3) % last.length], cls: k.replace("m", ""), school: ["MES","KV1","SD","GHS"][n % 4], subjects: subs, ab: 0.3 + r() * 0.6, at: 0.55 + r() * 0.45 }); });
    const quizzes = QUIZZES.map(q => ({ id: q.id, cls: q.cls, subject: q.subject, chapter: q.chapter, topic: q.topic, set: q.set }));
    const combos = {};
    students.forEach(s => s.subjects.forEach(sub => { combos[s.cls + "|" + sub] = true; }));
    Object.keys(combos).forEach(c => { const [cl, sub] = c.split("|"); if (sub === "Biology" && cl === "11") return; for (let i = 0; i < 4; i++) quizzes.push({ id: "ov-" + cl + sub + i, cls: cl, subject: sub, chapter: "Ch " + (i + 1), topic: sub + " topic " + (i + 1), set: "A" }); });
    const start = Date.now() - 56 * 864e5, responses = RESP.filter(x => x[7]).map(x => [x[0], x[1], x[4], x[5], x[7]]);
    quizzes.forEach((q, qi) => { if (q.id.indexOf("ov-") !== 0) return; const i = Number(q.id.slice(-1));
      students.filter(s => s.cls === q.cls && s.subjects.includes(q.subject)).forEach(s => { if (r() < 0.2) return;
        const sc = Math.max(0, Math.min(10, Math.round((s.ab + (r() - 0.5) * 0.3) * 10)));
        responses.push([new Date(start + (i * 14 + r() * 10) * 864e5).toISOString(), q.id, sc, 10, s.id]); }); });
    const attendance = [];
    Object.keys(combos).forEach(c => { const [cl, sub] = c.split("|");
      for (let w = 0; w < 8; w++) for (const d of [1, 4]) { const dt = new Date(start + (w * 7 + d) * 864e5); if (dt > new Date()) continue;
        const iso = dt.toISOString().slice(0, 10);
        students.filter(s => s.cls === cl && s.subjects.includes(sub)).forEach(s => attendance.push([iso, cl, sub, s.id, r() < s.at ? "P" : "A"])); } });
    const sent = quizzes.filter((q, i) => i % 3 === 0).map((q, i) => [new Date(Date.now() - (i % 9) * 864e5).toISOString(), q.id, ["Mrs. Fernandes","Mr. Naik","Ms. Kamat"][i % 3]]);
    OV = { ok: true, quizzes, students: students.map(s => ({ id: s.id, name: s.name, cls: s.cls, school: s.school, subjects: s.subjects })), responses, attendance, sent, lastSync: new Date(Date.now() - 12 * 60000).toISOString() };
    return OV;
  }
  const ME = { email: "demo.teacher@gmail.com", name: "Demo Teacher", picture: "", isAdmin: true, subjects: ["Physics","Chemistry","Maths","Biology","Science","Psychology","Hindi"] };
  function handle(action, p) {
    return new Promise(res => setTimeout(() => {
      if (action === "me") {
        const counts = {}; ME.subjects.forEach(s => counts[s] = QUIZZES.filter(q => q.subject === s).length);
        return res({ ok: true, me: Object.assign({ quizCounts: counts }, ME) });
      }
      const list = QUIZZES.filter(q => q.subject === p.subject);
      if (action === "quizzes") return res({ ok: true, quizzes: list.map(q => Object.assign({}, q, { questions: undefined, lastSent: SENT[q.id] || null })) });
      if (action === "markSent") { SENT[p.quizId] = { at: new Date().toISOString(), by: ME.name }; return res({ ok: true, lastSent: SENT[p.quizId] }); }
      if (action === "analytics" || action === "refresh") {
        const ids = new Set(list.map(q => q.id));
        return res({ ok: true, quizzes: list, students: p.subject === "Biology" ? ROSTER : [], attendance: p.subject === "Biology" ? attTotals() : {}, responses: RESP.filter(r => ids.has(r[1])), lastSync: new Date(Date.now() - (action === "refresh" ? 0 : 6 * 60000)).toISOString(), refresh: action === "refresh" ? "done" : "" });
      }
      if (action === "attendance" || action === "saveAttendance") {
        const studs = p.subject === "Biology" && p.cls === "11" ? ROSTER.map(s => ({ id: s.id, name: s.name, school: s.school })).sort((a, b) => a.name.localeCompare(b.name)) : [];
        const k = p.subject + "|" + p.cls;
        if (action === "saveAttendance") { if (p.date > new Date().toISOString().slice(0, 10)) return res({ error: "future_date" }); ATT[k] = ATT[k] || {}; ATT[k][p.date] = Object.assign({}, p.marks); }
        const reg = ATT[k] || {}, totals = {}, sessions = [];
        Object.keys(reg).sort().reverse().forEach(d => {
          let pr = 0, ab = 0;
          Object.keys(reg[d]).forEach(id => { const t = totals[id] = totals[id] || { p: 0, t: 0 }; t.t++; if (reg[d][id] === "P") { t.p++; pr++; } else ab++; });
          sessions.push({ date: d, present: pr, absent: ab });
        });
        return res({ ok: true, students: studs, marks: Object.assign({}, reg[p.date] || {}), sessions, totals, saved: action === "saveAttendance" ? Object.keys(p.marks).length : undefined });
      }
      if (action === "overview") return res(overview());
      if (action === "answerKey") {
        // Demo only: a made-up sample key. Real answer keys come from the Google Forms via Apps Script and are never stored on the website.
        const q = QUIZZES.find(x => x.id === p.quizId);
        if (!q) return res({ error: "unknown_quiz" });
        return res({ ok: true, quiz: { id: q.id, cls: q.cls, subject: q.subject, chapter: q.chapter, topic: q.topic, set: q.set, link: q.link }, questions: [
          { q: "Sample question (demo): The basic structural and functional unit of life is the:", options: ["tissue", "cell", "organ", "organelle"], answer: 1, explain: "Real quizzes show the explanation saved in the Google Form here." },
          { q: "Sample question (demo): Which of these is a eukaryote?", options: ["Bacterium", "Cyanobacterium", "Yeast", "Mycoplasma"], answer: 2, explain: "Yeast is a fungus, and fungi are eukaryotes." },
          { q: "Sample question (demo): Photosynthesis takes place in the:", options: ["mitochondria", "nucleus", "ribosome", "chloroplast"], answer: 3, explain: "Chloroplasts contain chlorophyll." }
        ] });
      }
      if (action === "fixName") { RESP.forEach(r => { if (!r[7] && r[2].trim().toLowerCase() === String(p.typed).trim().toLowerCase()) r[7] = p.studentId; }); return res({ ok: true }); }
      res({ error: "unknown_action" });
    }, 250));
  }
  window.PortalDemo = { handle };
})();