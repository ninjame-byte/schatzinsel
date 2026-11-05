// Fehleranzeige und zentrale Spiellogik
window.addEventListener("error", function (e) {
        var box = document.getElementById("errorBox");
        box.style.display = "block";
        box.textContent = "FEHLER: " + e.message + " (Zeile " + e.lineno + ")";
      });

const REISEN = {
  dschungel: { ...KARTEN_WELTEN.dschungel, pool: AUFGABEN_DSCHUNGEL },
  unterwasser: { ...KARTEN_WELTEN.unterwasser, pool: AUFGABEN_UNTERWASSER },
  weltraum: { ...KARTEN_WELTEN.weltraum, pool: AUFGABEN_WELTRAUM }
};
      const REIHENFOLGE = ["dschungel", "unterwasser", "weltraum"];
      const STATIONEN = 12;

            let state = {
        stufe: "klein",
        reise: "dschungel",
        station: 0,
        sterne: 0,
        teamSterne: 0,
        aktuelleAufgabe: null,
        letzteId: null,
        verwendeteAufgaben: [],
        verwendeteAufgabentexte: [],
      };

      let verfuegbareStimmen = [];
      let gewaehlteStimme = null;
      function ladeStimmen() {
        if (!("speechSynthesis" in window)) return;
        verfuegbareStimmen = window.speechSynthesis.getVoices();
        if (verfuegbareStimmen.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            verfuegbareStimmen = window.speechSynthesis.getVoices();
            waehleBesteStimme();
          };
        } else {
          waehleBesteStimme();
        }
      }
      function waehleBesteStimme() {
        const deutsche = verfuegbareStimmen.filter(
          (v) => v.lang && v.lang.toLowerCase().startsWith("de"),
        );
        if (deutsche.length === 0) {
          gewaehlteStimme = null;
          return;
        }
        const prioritaeten = [
          /de-DE.*(natural|neural|premium|enhanced)/i,
          /(google|microsoft).*(deutsch|german|de-de)/i,
          /(natural|neural|premium|enhanced)/i,
          /katja/i,
          /hedda/i,
          /anna/i,
          /petra/i,
          /markus/i,
          /stefan/i,
        ];
        for (const p of prioritaeten) {
          const treffer = deutsche.find((v) => p.test(v.name));
          if (treffer) {
            gewaehlteStimme = treffer;
            return;
          }
        }
        gewaehlteStimme = deutsche[0];
      }
      if ("speechSynthesis" in window) {
        ladeStimmen();
        window.speechSynthesis.onvoiceschanged = () => {
          verfuegbareStimmen = window.speechSynthesis.getVoices();
          if (!gewaehlteStimme) waehleBesteStimme();
        };
      }
      function vorlesen() {
        if (!state.aktuelleAufgabe) return;
        if (!("speechSynthesis" in window)) {
          alert("Vorlesen wird von diesem Browser nicht unterstützt.");
          return;
        }
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(state.aktuelleAufgabe.sprechtext);
        if (!gewaehlteStimme) waehleBesteStimme();
        if (gewaehlteStimme) u.voice = gewaehlteStimme;
        u.lang = "de-DE";
        u.rate = 0.86;
        u.pitch = 1.0;
        u.volume = 1.0;
        window.speechSynthesis.speak(u);
      }
      function stimmeWechseln() {
        const deutsche = verfuegbareStimmen.filter(
          (v) => v.lang && v.lang.toLowerCase().startsWith("de"),
        );
        if (deutsche.length === 0) {
          alert("Keine deutsche Stimme gefunden.");
          return;
        }
        const idx = deutsche.indexOf(gewaehlteStimme);
        const naechste = deutsche[(idx + 1) % deutsche.length];
        gewaehlteStimme = naechste;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance("Diese Stimme ist jetzt aktiv.");
        u.voice = naechste;
        u.lang = "de-DE";
        u.rate = 0.92;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
      }

      function zeige(id) {
        document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
        document.getElementById(id).classList.add("active");
      }
      function startGame(stufe) {
        const basis = {
          stufe, reise: "dschungel", station: 0, sterne: 0, teamSterne: 0,
          aktuelleAufgabe: null, letzteId: null,
          verwendeteAufgaben: [], verwendeteAufgabentexte: []
        };
        try {
          const saved = localStorage.getItem("schatzinsel_" + stufe) || localStorage.getItem("schatzinsel");
          if (saved) {
            const s = JSON.parse(saved);
            if (s.stufe === stufe && s.reise) state = { ...basis, ...s };
            else state = basis;
          } else state = basis;
          const globalUsed = JSON.parse(localStorage.getItem("schatzinsel_aufgaben_v2") || '{"ids":[],"texte":[]}');
          state.verwendeteAufgaben = [...new Set([...(state.verwendeteAufgaben || []), ...(globalUsed.ids || [])])];
          state.verwendeteAufgabentexte = [...new Set([...(state.verwendeteAufgabentexte || []), ...(globalUsed.texte || [])])];
        } catch (e) { state = basis; }
        renderMap();
        zeige("screen-map");
      }
      // Inline onclick handlers in the age-selection buttons call this global entry point.
      window.startGame = startGame;

      function goMap() {
        clearInterval(timerIntervall);
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        closeOverlay();
        renderMap();
        zeige("screen-map");
      }
      function goMainMenu() {
        clearInterval(timerIntervall);
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        closeOverlay();
        zeige("screen-start");
      }

      // Spielzustand an die eigenständige Karten-Engine übergeben.
      function renderMap() {
        Schatzkarte.render({
          reise: state.reise,
          stufe: state.stufe,
          station: state.station,
          sterne: state.sterne,
          teamSterne: state.teamSterne,
          onChestClick: oeffneTruheOverlay
        });
        speichern();
      }

      function speichern() {
        localStorage.setItem("schatzinsel_" + state.stufe, JSON.stringify(state));
        localStorage.setItem("schatzinsel", JSON.stringify(state));
        localStorage.setItem("schatzinsel_aufgaben_v2", JSON.stringify({
          ids: state.verwendeteAufgaben || [],
          texte: state.verwendeteAufgabentexte || []
        }));
      }

      function oeffneTruheOverlay(index) {
        if (index !== state.station) return;
        const r = REISEN[state.reise] || REISEN.dschungel;
        document.getElementById("truheBig").innerHTML =
          `<span class="chest-art chest-art-big"><i class="chest-lid"></i><i class="chest-body"></i><i class="chest-band"></i><i class="chest-lock">✦</i></span><span class="chest-theme-mark">${r.truheIcon}</span>`;
        document.getElementById("truheBig").classList.remove("opening");
        document.getElementById("overlayHint").textContent = "Tippe die Truhe an!";
        document.getElementById("overlayHint").style.display = "block";
        document.getElementById("truheOverlay").classList.add("active");
      }
      function closeOverlay() {
        document.getElementById("truheOverlay").classList.remove("active");
      }
      function oeffneTruhe() {
        const big = document.getElementById("truheBig");
        if (big.classList.contains("opening")) return;
        big.classList.add("opening");
        document.getElementById("overlayHint").style.display = "none";
        setTimeout(neueAufgabe, 550);
      }
      function neueAufgabe() {
        // Jede Aufgabe wird pro Spielstand nur einmal gezogen – auch nach Neuladen.
        const pool = (REISEN[state.reise] || REISEN.dschungel).pool.filter(
          (a) => a.stufe === state.stufe,
        );
        if (!Array.isArray(state.verwendeteAufgaben)) state.verwendeteAufgaben = [];
        if (!Array.isArray(state.verwendeteAufgabentexte)) state.verwendeteAufgabentexte = [];
        try {
          const globalUsed = JSON.parse(localStorage.getItem("schatzinsel_aufgaben_v2") || '{"ids":[],"texte":[]}');
          state.verwendeteAufgaben = [...new Set([...state.verwendeteAufgaben, ...(globalUsed.ids || [])])];
          state.verwendeteAufgabentexte = [...new Set([...state.verwendeteAufgabentexte, ...(globalUsed.texte || [])])];
        } catch (e) {}
        const kandidaten = pool.filter((a) =>
          !state.verwendeteAufgaben.includes(a.id) &&
          !state.verwendeteAufgabentexte.includes(a.sprechtext.trim().toLocaleLowerCase("de-DE"))
        );
        if (kandidaten.length === 0) {
          closeOverlay();
          alert("Alle Aufgaben dieser Altersgruppe wurden bereits gespielt. Starte eine neue Reise, um andere Aufgaben zu bekommen.");
          return;
        }
        const aufgabe = kandidaten[Math.floor(Math.random() * kandidaten.length)];
        state.verwendeteAufgaben.push(aufgabe.id);
        state.verwendeteAufgabentexte.push(aufgabe.sprechtext.trim().toLocaleLowerCase("de-DE"));
        speichern();
        state.aktuelleAufgabe = aufgabe;
        state.letzteId = aufgabe.id;
        closeOverlay();
        zeigeAufgabe(aufgabe);
      }

      let timerIntervall = null;
      let restSekunden = 0;
      function starteTimer(a) {
        clearInterval(timerIntervall);
        restSekunden = 600;
        const el = document.getElementById("taskTimer");
        el.classList.remove("urgent");
        el.textContent = "⏱️ 10:00 Minuten – ihr habt Zeit!";
        timerIntervall = setInterval(() => {
          restSekunden--;
          if (restSekunden <= 15) el.classList.add("urgent");
          if (restSekunden > 0) {
            const min = Math.floor(restSekunden / 60);
            const sek = String(restSekunden % 60).padStart(2, "0");
            el.textContent = `⏱️ Noch ${min}:${sek} Minuten`;
          } else {
            clearInterval(timerIntervall);
            el.textContent = "⏰ Die Zeit ist um!";
            zeigeFehlschlag("Die Zeit ist leider um. Wir versuchen es mit einer neuen Aufgabe!");
          }
        }, 1000);
      }

      function zeigeTipp(automatisch = false) {
        const a = state.aktuelleAufgabe;
        if (!a) return;
        const box = document.getElementById("taskHelp");
        box.style.display = "block";
        const loesung =
          a.tipp ? a.tipp + " " + (a.antwort || "Mehrere Lösungen sind möglich.") :
          (a.antwort || "Schau dich gemeinsam mit deinem Team um. Es gibt oft mehrere gute Lösungen!");
        box.textContent = (automatisch ? "⏰ Zeit um! " : "💡 ") + loesung;
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(loesung);
          if (!gewaehlteStimme) waehleBesteStimme();
          if (gewaehlteStimme) u.voice = gewaehlteStimme;
          u.lang = "de-DE";
          u.rate = 0.86;
          window.speechSynthesis.speak(u);
        }
      }
      function zeigeFehlschlag(text) {
        const box = document.getElementById("taskHelp");
        box.style.display = "block";
        box.innerHTML = '<div class="sad-pirate" style="font-size:76px;text-align:center">🐒🏴‍☠️</div><div style="text-align:center;font-weight:800;margin:8px 0">' + text + '</div><div style="text-align:center"><button class="btn btn-done" onclick="nochMal()">🔁 Nochmal – neue Aufgabe</button></div>';
        document.getElementById("taskTimer").classList.remove("urgent");
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      }
      function nichtGeschafft() {
        clearInterval(timerIntervall);
        zeigeFehlschlag("Nicht schlimm! Der Piratenaffe versucht es mit euch noch einmal.");
      }
      function zeigeAufgabe(a) {
        document.getElementById("taskIcon").textContent = a.icon;
        document.getElementById("taskText").textContent = a.sprechtext;
        document.getElementById("taskHelp").style.display = "none";
        document.getElementById("taskHelp").textContent = "";
        zeige("screen-task");
        starteTimer(a);
        setTimeout(vorlesen, 350);
      }
      function nochMal() {
        clearInterval(timerIntervall);
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        document.getElementById("taskHelp").style.display = "none";
        document.getElementById("taskHelp").textContent = "";
        neueAufgabe();
      }
      function erledigt() {
        clearInterval(timerIntervall);
        const a = state.aktuelleAufgabe;
        if (!a) return;
        state.sterne = Math.min(state.sterne + 1, STATIONEN);
        if (a.teamStern) state.teamSterne++;
        state.station = Math.min(state.station + 1, STATIONEN);
        const txt = document.getElementById("rewardText");
        const sub = document.getElementById("rewardSub");
        txt.textContent = "";
        sub.textContent = "";
        if (a.teamStern) {
          txt.textContent = "Super gemacht! ⭐ + 🤝⭐";
          sub.textContent = "Du bekommst einen Stern UND einen Team-Stern!";
        } else {
          txt.textContent = "Super gemacht! ⭐";
          sub.textContent = "Dein Stern wandert auf die Schatzkarte!";
        }
        speichern();
        zeige("screen-reward");
        konfetti();
        if (state.station >= STATIONEN) {
          setTimeout(() => {
            const r = REISEN[state.reise] || REISEN.dschungel;
            document.getElementById("finaleIcon").textContent = r.finaleIcon;
            document.getElementById("finaleTitle").textContent = r.name + " geschafft!";
            zeige("screen-finale");
          }, 1800);
        }
      }
      function konfetti() {
        const app = document.getElementById("app");
        for (let i = 0; i < 14; i++) {
          const c = document.createElement("div");
          c.className = "confetti";
          c.textContent = ["⭐", "✨", "🤝", "🎉", "💫"][Math.floor(Math.random() * 5)];
          c.style.left = 10 + Math.random() * 80 + "%";
          c.style.top = "-40px";
          c.style.animationDelay = Math.random() * 0.4 + "s";
          app.appendChild(c);
          setTimeout(() => c.remove(), 2200);
        }
      }
      function neueReise() {
        clearInterval(timerIntervall);
        const idx = REIHENFOLGE.indexOf(state.reise);
        state.reise = idx < REIHENFOLGE.length - 1 ? REIHENFOLGE[idx + 1] : REIHENFOLGE[0];
        state.station = 0;
        state.sterne = 0;
        state.teamSterne = 0;
        state.aktuelleAufgabe = null;
        state.letzteId = null;
        // Verwendete IDs bleiben erhalten: Aufgaben wiederholen sich auch auf der nächsten Reise nicht.
        speichern();
        renderMap();
        zeige("screen-map");
      }

      // Pädagogischer Prüfbogen: dokumentiert die fachliche Prüfung, ersetzt sie aber nicht.
      const REVIEW_CRITERIA = [
        "Altersangemessen: passt zu typischen Fähigkeiten der gewählten Altersgruppe; Überforderung wird vermieden.",
        "Verständlich: kurze, eindeutige Sprache; bei Bedarf leicht vormachbar oder mit Bild/Geste unterstützbar.",
        "Ein klares Ziel: die Aufgabe prüft bzw. fördert nicht mehrere schwer erkennbare Anforderungen gleichzeitig.",
        "Lösung passend: Tipp und Antwort helfen, ohne nur eine unnötig enge Musterlösung vorzuschreiben.",
        "Sicher: keine verschluckbaren Kleinteile, gefährlichen Höhen, riskanten Bewegungen oder ungeeigneten Materialien.",
        "Inklusiv: alternative Teilnahme ist möglich; motorische, sprachliche und sensorische Unterschiede werden berücksichtigt.",
        "Spielerisch und wertschätzend: kein Leistungsdruck, Bloßstellen, Zwang oder Ausscheiden.",
        "Bei Teamaufgaben: jedes Kind kann sinnvoll beteiligt sein; Abwechseln und Kooperation sind realistisch umsetzbar."
      ];
      let reviewTasks = [];
      let reviewIndex = 0;
      let reviewFilter = "alle";
      let reviewData = {};
      function buildReviewTasks() {
        const pools = [
          ["Dschungel", AUFGABEN_DSCHUNGEL],
          ["Unterwasser", AUFGABEN_UNTERWASSER],
          ["Weltraum", AUFGABEN_WELTRAUM]
        ];
        return pools.flatMap(([welt, pool]) => pool.map(a => ({...a, welt, reviewKey: welt + "::" + a.id})));
      }
      function openReview() {
        reviewTasks = buildReviewTasks();
        try { reviewData = JSON.parse(localStorage.getItem("schatzinsel_paedagogik_pruefung_v1") || "{}"); }
        catch(e) { reviewData = {}; }
        reviewFilter = "alle";
        document.getElementById("reviewFilter").value = "alle";
        const meta = reviewData.__meta || {};
        document.getElementById("reviewerName").value = meta.name || "";
        document.getElementById("reviewInstitution").value = meta.institution || "";
        document.getElementById("reviewDate").value = meta.date || "";
        reviewIndex = 0;
        renderReview();
        zeige("screen-review");
      }
      function closeReview() { zeige("screen-start"); }
      function filteredReviewTasks() {
        return reviewTasks.filter(a => {
          const team = !!a.teamStern;
          if (reviewFilter === "alle") return true;
          if (reviewFilter === "klein") return a.stufe === "klein" && !team;
          if (reviewFilter === "mittel") return a.stufe === "mittel" && !team;
          if (reviewFilter === "gross") return a.stufe === "gross" && !team;
          if (reviewFilter === "team-klein") return a.stufe === "klein" && team;
          if (reviewFilter === "team-mittel") return a.stufe === "mittel" && team;
          if (reviewFilter === "team-gross") return a.stufe === "gross" && team;
          return true;
        });
      }
      function changeReviewFilter() {
        saveReviewEntry();
        reviewFilter = document.getElementById("reviewFilter").value;
        reviewIndex = 0;
        renderReview();
      }
      function renderReview() {
        const list = filteredReviewTasks();
        if (!list.length) return;
        reviewIndex = Math.max(0, Math.min(reviewIndex, list.length - 1));
        const a = list[reviewIndex];
        const entry = reviewData[a.reviewKey] || {status:"offen", notes:"", checks:[]};
        document.getElementById("reviewProgress").textContent = `Aufgabe ${reviewIndex+1} von ${list.length} · ${reviewTasks.length} insgesamt`;
        document.getElementById("reviewTaskTitle").textContent = `${a.icon || "🧩"} ${a.id} – ${a.welt}`;
        document.getElementById("reviewTaskMeta").textContent = `${a.stufe === "klein" ? "2–3 Jahre" : a.stufe === "mittel" ? "3–4 Jahre" : "4–5 Jahre"} · ${a.teamStern ? "Teamaufgabe" : "Einzelaufgabe"} · Kategorie: ${a.kategorie || "nicht angegeben"}`;
        document.getElementById("reviewTaskText").textContent = a.sprechtext || "Keine Aufgabenstellung hinterlegt.";
        document.getElementById("reviewTaskHint").textContent = a.tipp || "Kein Tipp hinterlegt – bitte ergänzen oder bewusst als nicht erforderlich markieren.";
        document.getElementById("reviewTaskAnswer").textContent = a.antwort || "Keine Antwort hinterlegt – bitte ergänzen.";
        document.getElementById("reviewStatus").value = entry.status || "offen";
        document.getElementById("reviewNotes").value = entry.notes || "";
        document.getElementById("reviewCriteria").innerHTML = "";
        REVIEW_CRITERIA.forEach((label, i) => {
          const id = "reviewCriterion" + i;
          const wrap = document.createElement("label"); wrap.className = "review-check";
          const cb = document.createElement("input"); cb.type = "checkbox"; cb.id = id; cb.checked = (entry.checks || []).includes(i);
          cb.addEventListener("change", () => {
            const current = reviewData[a.reviewKey] || {status:"offen",notes:"",checks:[]};
            current.checks = REVIEW_CRITERIA.map((_,n) => document.getElementById("reviewCriterion"+n).checked ? n : -1).filter(n => n >= 0);
            reviewData[a.reviewKey] = current; persistReview(); updateReviewSummary();
          });
          const span = document.createElement("span"); span.textContent = label;
          wrap.append(cb,span); document.getElementById("reviewCriteria").appendChild(wrap);
        });
        updateReviewSummary();
      }
      function saveReviewEntry() {
        const list = filteredReviewTasks(); const a = list[reviewIndex]; if (!a) return;
        const old = reviewData[a.reviewKey] || {checks:[]};
        reviewData[a.reviewKey] = {...old, status:document.getElementById("reviewStatus").value, notes:document.getElementById("reviewNotes").value};
        persistReview(); updateReviewSummary();
      }
      function saveReviewMeta() {
        reviewData.__meta = {
          name: document.getElementById("reviewerName").value,
          institution: document.getElementById("reviewInstitution").value,
          date: document.getElementById("reviewDate").value
        };
        persistReview();
      }
      function persistReview() { try { localStorage.setItem("schatzinsel_paedagogik_pruefung_v1", JSON.stringify(reviewData)); } catch(e) { alert("Die Prüfergebnisse konnten nicht gespeichert werden. Bitte exportieren Sie regelmäßig."); } }
      function moveReview(step) { saveReviewEntry(); const list = filteredReviewTasks(); reviewIndex = Math.max(0, Math.min(list.length-1, reviewIndex+step)); renderReview(); }
      function updateReviewSummary() {
        const total = reviewTasks.length;
        const done = Object.values(reviewData).filter(x => x.status === "geprueft").length;
        const revise = Object.values(reviewData).filter(x => x.status === "ueberarbeiten").length;
        const query = Object.values(reviewData).filter(x => x.status === "rueckfrage").length;
        const el = document.getElementById("reviewSummary");
        if (el) el.textContent = `Gesamt: ${total} Aufgaben · Geprüft: ${done} · Überarbeiten: ${revise} · Rückfrage/Praxistest: ${query} · Offen: ${Math.max(0,total-done-revise-query)}`;
      }
      function downloadReview() {
        saveReviewEntry();
        const payload = {titel:"Schatzinsel – Pädagogischer Prüfbogen", hinweis:"Arbeitsunterlage zur fachlichen Prüfung; keine automatische oder offizielle Freigabe.", exportiertAm:new Date().toISOString(), pruefendeFachkraft:reviewData.__meta || {}, aufgaben:reviewTasks.map(a => ({welt:a.welt,id:a.id,altersgruppe:a.stufe === "klein" ? "2–3 Jahre" : a.stufe === "mittel" ? "3–4 Jahre" : "4–5 Jahre",typ:a.teamStern ? "Teamaufgabe" : "Einzelaufgabe",kategorie:a.kategorie,aufgabe:a.sprechtext,tipp:a.tipp || "",antwort:a.antwort || "",pruefung:reviewData[a.reviewKey] || {status:"offen",checks:[],notes:""}}))};
        const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json;charset=utf-8"});
        const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href=url; link.download="schatzinsel_paedagogischer_pruefbogen.json"; link.click(); URL.revokeObjectURL(url);
      }
      function printReview() {
        saveReviewEntry();
        const rows = reviewTasks.map(a => { const e=reviewData[a.reviewKey]||{status:"offen",notes:"",checks:[]}; return `<tr><td>${a.welt}</td><td>${a.id}</td><td>${a.stufe === "klein" ? "2–3 Jahre" : a.stufe === "mittel" ? "3–4 Jahre" : "4–5 Jahre"}</td><td>${a.teamStern ? "Team" : "Einzel"}</td><td>${a.sprechtext}</td><td>${a.tipp||"–"}</td><td>${a.antwort||"–"}</td><td>${e.status}</td><td>${(e.checks||[]).length}/8</td><td>${e.notes||""}</td></tr>`; }).join("");
        const w=window.open("","_blank"); if(!w){alert("Bitte Pop-ups für den Druck erlauben.");return;} w.document.write(`<!doctype html><html lang="de"><meta charset="utf-8"><title>Schatzinsel Prüfbogen</title><style>body{font:12px Arial;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:5px;text-align:left;vertical-align:top}th{background:#eee}h1{font-size:20px}</style><h1>Schatzinsel – Pädagogischer Prüfbogen</h1><p>Arbeitsunterlage für die Prüfung durch eine pädagogische Fachkraft. Keine automatische Freigabe.</p><p>Prüfende Fachkraft: ${(reviewData.__meta||{}).name||"–"} · Einrichtung: ${(reviewData.__meta||{}).institution||"–"} · Datum: ${(reviewData.__meta||{}).date||"–"}</p><table><thead><tr><th>Welt</th><th>ID</th><th>Alter</th><th>Typ</th><th>Aufgabe</th><th>Tipp</th><th>Antwort</th><th>Status</th><th>Kriterien</th><th>Notizen</th></tr></thead><tbody>${rows}</tbody></table></html>`); w.document.close(); w.focus(); w.print();
      }

      function resetGame() {
        if (confirm("Möchtest du wirklich neu starten? Der Fortschritt wird gelöscht.")) {
          state = {
            stufe: state.stufe,
            reise: state.reise,
            station: 0,
            sterne: 0,
            teamSterne: 0,
            aktuelleAufgabe: null,
            letzteId: null,
            verwendeteAufgaben: [],
            verwendeteAufgabentexte: [],
          };
          try {
            const globalUsed = JSON.parse(localStorage.getItem("schatzinsel_aufgaben_v2") || '{"ids":[],"texte":[]}');
            state.verwendeteAufgaben = globalUsed.ids || [];
            state.verwendeteAufgabentexte = globalUsed.texte || [];
          } catch (e) {}
          speichern();
          renderMap();
          zeige("screen-map");
        }
      }
