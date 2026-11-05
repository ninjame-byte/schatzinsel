// v3: Spielbarer Kartentest mit echten Aufgaben, ohne lokalen Speicherzugriff.
// Verwendet exakt dieselbe Schatzkarte wie das Hauptspiel.
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const themeOrder = ["dschungel", "unterwasser", "weltraum"];
  const themeButtons = [...document.querySelectorAll("[data-theme]")];
  const age = $("testAge");
  const progress = $("testProgress");
  const team = $("testTeam");
  const chests = $("testChests");
  const grid = $("testGrid");
  const layer = $("testPlayLayer");
  const card = layer.querySelector(".test-play-card");
  const taskView = $("testTaskView");
  const rewardView = $("testRewardView");
  const finalView = $("testFinalView");
  const state = {
    theme: "dschungel",
    station: 0,
    teamStars: 0,
    currentTask: null,
    usedIds: new Set(),
    usedTexts: new Set(),
    previousFocus: null
  };

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function speak() {
    if (!state.currentTask) return;
    if (!("speechSynthesis" in window)) {
      $("testStatus").textContent = "Die Sprachausgabe wird von diesem Browser nicht unterstützt.";
      return;
    }
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(state.currentTask.sprechtext);
    utterance.lang = "de-DE";
    utterance.rate = 0.86;
    const germanVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("de"));
    if (germanVoice) utterance.voice = germanVoice;
    window.speechSynthesis.speak(utterance);
  }

  function drawGrid() {
    const svg = $("testGridLayer");
    svg.replaceChildren();
    const ns = "http://www.w3.org/2000/svg";
    for (let n = 0; n <= 100; n += 10) {
      for (const coords of [
        { x1: n, y1: 0, x2: n, y2: 100 },
        { x1: 0, y1: n, x2: 100, y2: n }
      ]) {
        const line = document.createElementNS(ns, "line");
        for (const [key, value] of Object.entries(coords)) line.setAttribute(key, value);
        line.setAttribute("stroke", "#23434c");
        line.setAttribute("stroke-width", ".25");
        line.setAttribute("opacity", ".65");
        svg.appendChild(line);
      }
    }
  }

  function redraw() {
    const world = Schatzkarte.welten[state.theme];
    Schatzkarte.render({
      reise: state.theme,
      stufe: age.value,
      station: state.station,
      sterne: state.station,
      teamSterne: state.teamStars,
      onChestClick: openChest
    });
    progress.value = state.station;
    team.value = state.teamStars;
    $("testProgressLabel").textContent = `${state.station} / 12`;
    $("testPreviewName").textContent = world.name;
    $("testStatus").textContent = state.station === 12
      ? `${world.name} abgeschlossen · 12 Sterne und ${state.teamStars} Teamsterne. Starte eine neue Runde!`
      : `${world.name}karte · Station ${state.station + 1} von 12 · Truhe öffnen und Aufgabe lösen`;
    $("testOpenChest").disabled = state.station >= 12;
    $("truhenLayer").classList.toggle("hidden-chests", !chests.checked);
    $("testGridLayer").classList.toggle("visible", grid.checked);
    themeButtons.forEach((button) => {
      const selected = button.dataset.theme === state.theme;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function resetRound() {
    stopSpeech();
    state.station = 0;
    state.teamStars = 0;
    state.currentTask = null;
    state.usedIds.clear();
    state.usedTexts.clear();
    closeDialog();
    redraw();
  }

  function setTheme(theme) {
    if (!Object.prototype.hasOwnProperty.call(Schatzkarte.welten, theme)) return;
    if (state.theme === theme) return;
    state.theme = theme;
    resetRound();
  }

  function getPool() {
    switch (state.theme) {
      case "unterwasser": return AUFGABEN_UNTERWASSER;
      case "weltraum": return AUFGABEN_WELTRAUM;
      default: return AUFGABEN_DSCHUNGEL;
    }
  }

  function pickTask() {
    const candidates = getPool().filter((task) => {
      const normalized = String(task.sprechtext || "").trim().toLocaleLowerCase("de-DE");
      return task.stufe === age.value && !state.usedIds.has(task.id) && !state.usedTexts.has(normalized);
    });
    if (!candidates.length) {
      $("testStatus").textContent = "Für diese Altersgruppe sind keine weiteren neuen Aufgaben verfügbar. Bitte die Testrunde zurücksetzen.";
      return false;
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    state.usedIds.add(chosen.id);
    state.usedTexts.add(String(chosen.sprechtext).trim().toLocaleLowerCase("de-DE"));
    state.currentTask = chosen;
    return true;
  }

  function setView(name) {
    taskView.hidden = name !== "task";
    rewardView.hidden = name !== "reward";
    finalView.hidden = name !== "final";
    const heading = name === "task" ? "testPlayTitle" : name === "reward" ? "testRewardTitle" : "testFinalTitle";
    card.setAttribute("aria-labelledby", heading);
  }

  function showDialog(name) {
    const wasClosed = layer.hidden;
    if (wasClosed) state.previousFocus = document.activeElement;
    setView(name);
    layer.hidden = false;
    if (name === "task") $("testPlayClose").focus();
    else if (name === "reward") $("testRewardContinue").focus();
    else $("testFinalRestart").focus();
  }

  function closeDialog() {
    stopSpeech();
    if (layer.hidden) return;
    layer.hidden = true;
    if (state.previousFocus && state.previousFocus.isConnected && typeof state.previousFocus.focus === "function") {
      state.previousFocus.focus();
    } else {
      $("testOpenChest").focus();
    }
    state.previousFocus = null;
  }

  function fillTask() {
    const task = state.currentTask;
    if (!task) return;
    $("testPlayMeta").textContent = `${Schatzkarte.welten[state.theme].name} · Station ${state.station + 1} von 12 · ${task.teamStern ? "Teamaufgabe" : "Einzelaufgabe"}`;
    $("testPlayIcon").textContent = task.icon || "🔎";
    $("testPlayTitle").textContent = task.teamStern ? "Gemeinsame Aufgabe" : "Deine Aufgabe";
    $("testPlayText").textContent = task.sprechtext;
    $("testPlayHint").hidden = true;
    $("testPlayHint").replaceChildren();
  }

  function openChest(index = state.station) {
    if (index !== state.station || state.station >= 12) return;
    if (!state.currentTask && !pickTask()) return;
    fillTask();
    showDialog("task");
  }

  function anotherTask() {
    stopSpeech();
    if (!pickTask()) return;
    fillTask();
    showDialog("task");
  }

  function showHint() {
    const task = state.currentTask;
    if (!task) return;
    const box = $("testPlayHint");
    box.replaceChildren();
    for (const [name, value] of [["Tipp", task.tipp], ["Lösung / Beobachtung", task.antwort]]) {
      const paragraph = document.createElement("p");
      const bold = document.createElement("strong");
      bold.textContent = `${name}: `;
      paragraph.append(bold, document.createTextNode(value || "Keine Angabe."));
      box.appendChild(paragraph);
    }
    box.hidden = false;
  }

  function completeTask() {
    const task = state.currentTask;
    if (!task || state.station >= 12) return;
    stopSpeech();
    state.station += 1;
    if (task.teamStern) state.teamStars += 1;
    state.currentTask = null;
    $("testPlayMeta").textContent = `${Schatzkarte.welten[state.theme].name} · ${state.station} von 12 Sternen`;
    $("testRewardTitle").textContent = state.station === 12 ? "Alle zwölf Sterne gesammelt!" : "Super gemacht!";
    $("testRewardText").textContent = task.teamStern
      ? "Du erhältst einen Stern und einen Teamstern."
      : "Du erhältst einen Stern. Die nächste Truhe ist jetzt offen.";
    $("testRewardContinue").textContent = state.station === 12 ? "💎 Zum Schatz" : "➡️ Zur Schatzkarte";
    redraw();
    showDialog("reward");
  }

  function showFinal() {
    const world = Schatzkarte.welten[state.theme];
    $("testPlayMeta").textContent = "Alle 12 Stationen geschafft";
    $("testFinalIcon").textContent = world.finaleIcon || "💎";
    $("testFinalTitle").textContent = `${world.name} geschafft!`;
    $("testFinalText").textContent = `Ihr habt zwölf Sterne und ${state.teamStars} Teamsterne gesammelt. Der Schatz ist gefunden!`;
    showDialog("final");
  }

  function simulateStation(value) {
    stopSpeech();
    state.station = Math.max(0, Math.min(12, Number(value) || 0));
    state.currentTask = null;
    closeDialog();
    redraw();
  }

  // Vorschau- und Simulationsregler bleiben im spielbaren Modus erhalten.
  themeButtons.forEach((button) => button.addEventListener("click", () => setTheme(button.dataset.theme)));
  age.addEventListener("change", resetRound);
  progress.addEventListener("input", () => simulateStation(progress.value));
  team.addEventListener("input", () => {
    state.teamStars = Math.max(0, Math.min(12, Number(team.value) || 0));
    redraw();
  });
  chests.addEventListener("change", redraw);
  grid.addEventListener("change", redraw);
  $("testPrev").addEventListener("click", () => simulateStation(state.station - 1));
  $("testNext").addEventListener("click", () => simulateStation(state.station + 1));
  $("testReset").addEventListener("click", resetRound);
  $("testRedraw").addEventListener("click", redraw);
  $("testOpenChest").addEventListener("click", () => openChest());
  $("testPlayClose").addEventListener("click", closeDialog);
  $("testPlaySpeak").addEventListener("click", speak);
  $("testPlayShowHint").addEventListener("click", showHint);
  $("testPlayAgain").addEventListener("click", anotherTask);
  $("testPlayComplete").addEventListener("click", completeTask);
  $("testRewardContinue").addEventListener("click", () => {
    if (state.station === 12) showFinal();
    else closeDialog();
  });
  $("testFinalRestart").addEventListener("click", resetRound);
  $("testFinalNext").addEventListener("click", () => {
    state.theme = themeOrder[(themeOrder.indexOf(state.theme) + 1) % themeOrder.length];
    resetRound();
  });
  // Dialog bleibt für Tastatur und Screenreader bedienbar.
  document.addEventListener("keydown", (event) => {
    if (layer.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); closeDialog(); return; }
    if (event.key !== "Tab") return;
    const focusables = [...card.querySelectorAll("button:not([disabled])")].filter((item) => item.getClientRects().length);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener("pagehide", () => { stopSpeech(); Schatzkarte.dispose(); });
  drawGrid();
  redraw();
})();
