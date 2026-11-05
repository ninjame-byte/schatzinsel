// Gemeinsame Karten-Engine für das Spiel und kartentest.html.
// Aufgaben und Spielzustand werden hier bewusst NICHT gelesen oder gespeichert.
const KARTEN_WELTEN = {
        dschungel: {
          name: "Dschungel",
          icon: "🐒",
          farben: { bg1: "#1a1008", bg2: "#0e0904" },
          pergament:
            "radial-gradient(ellipse at 30% 20%, rgba(170,125,60,.22), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(130,90,40,.24), transparent 55%), radial-gradient(circle at 50% 50%, #f2ddb0 0%, #e6cc96 48%, #cfab66 100%)",
          truheIcon: "🎁",
          finaleIcon: "💎",
        },
        unterwasser: {
          name: "Unterwasser",
          icon: "🐠",
          farben: { bg1: "#041a2a", bg2: "#020c14" },
          pergament:
            "radial-gradient(ellipse at 30% 20%, rgba(80,140,180,.25), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(40,100,150,.28), transparent 55%), radial-gradient(circle at 50% 50%, #c8e8f0 0%, #9ed0e0 48%, #6aa8c0 100%)",
          truheIcon: "🐚",
          finaleIcon: "🐚",
        },
        weltraum: {
          name: "Weltraum",
          icon: "🚀",
          farben: { bg1: "#140a2a", bg2: "#080414" },
          pergament:
            "radial-gradient(ellipse at 30% 20%, rgba(150,100,220,.22), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(100,60,180,.25), transparent 55%), radial-gradient(circle at 50% 50%, #e0d0f0 0%, #b8a0d8 48%, #8060a8 100%)",
          truheIcon: "🛸",
          finaleIcon: "🌟",
        },
      };

const KARTEN_POSITIONEN = [
        { x: 15, y: 82 },
        { x: 32, y: 86 },
        { x: 50, y: 82 },
        { x: 68, y: 85 },
        { x: 81, y: 75 },
        { x: 76, y: 63 },
        { x: 60, y: 60 },
        { x: 43, y: 64 },
        { x: 26, y: 61 },
        { x: 19, y: 47 },
        { x: 38, y: 39 },
        { x: 62, y: 29 },
      ];

window.SchatzkartenWelten = window.SchatzkartenWelten || {};

const Schatzkarte = (() => {
  let cleanupMotiv = null;

  function render({
    reise = "dschungel",
    stufe = "klein",
    station = 0,
    sterne = station,
    teamSterne = 0,
    onChestClick = null
  } = {}) {
    if (typeof cleanupMotiv === "function") {
      cleanupMotiv();
      cleanupMotiv = null;
    }

    const r = KARTEN_WELTEN[reise] || KARTEN_WELTEN.dschungel;
    const motiv = window.SchatzkartenWelten[reise];
    if (typeof motiv !== "function") {
      throw new Error(`Kartenmotiv "${reise}" wurde nicht geladen.`);
    }
    station = Math.max(0, Math.min(KARTEN_POSITIONEN.length, Number(station) || 0));

    document.getElementById("app").style.background = r.farben.bg1;
    document.getElementById("pergamentInner").style.background = r.pergament;
    document.getElementById("reisePill").textContent = r.icon + " " + r.name + (stufe === "klein" ? " · 2–3 J." : stufe === "mittel" ? " · 3–4 J." : " · 4–5 J.");
    document.getElementById("starCount").textContent = sterne;
    const count2 = document.getElementById("starCount2");
    if (count2) count2.textContent = sterne;
    document.getElementById("teamCount").textContent = teamSterne;

    const svg = document.getElementById("mapSvg");
    svg.replaceChildren();
    const NS = "http://www.w3.org/2000/svg";
    function el(tag, attrs) {
      const element = document.createElementNS(NS, tag);
      for (const key in attrs) element.setAttribute(key, attrs[key]);
      return element;
    }

    // Gemeinsame Hintergrundelemente (Oase, Relief und Kartengrenzen).
    const oasis = el("g", { transform: "translate(72 49) scale(.88)" });
            oasis.appendChild(el("ellipse", { cx: 0, cy: 5, rx: 7, ry: 3.2, fill: "#54b9c7", stroke: "#287b91", "stroke-width": ".45" }));
            oasis.appendChild(el("path", { d: "M-5 -5 Q-3 -9 0 -6 Q3 -10 6 -5 L5 0 L-5 0 Z", fill: "#9b8052", stroke: "#705331", "stroke-width": ".45" }));
            oasis.appendChild(el("path", { d: "M-2 -4 L-2 2 M0 -5 L0 2 M2 -4 L2 1 M4 -3 L4 1", stroke: "#8ce7ef", "stroke-width": ".55", "stroke-linecap": "round", opacity: ".95" }));
            oasis.appendChild(el("path", { d: "M-8 4 Q-10 0 -7 -3 M7 4 Q10 0 8 -3 M-6 2 Q-8 -1 -5 -4", fill: "none", stroke: "#39824c", "stroke-width": ".75", "stroke-linecap": "round" }));
            oasis.appendChild(el("path", { d: "M-4 5 Q0 3 4 5", fill: "none", stroke: "#d8f5ef", "stroke-width": ".45", opacity: ".9" }));
            svg.appendChild(oasis);

            svg.appendChild(
              el("path", {
                d: "M 8 25 Q 13 16 26 18 Q 33 10 43 17 Q 54 9 64 18 Q 77 14 84 27 Q 94 34 88 45 Q 94 56 83 64 Q 82 76 69 79 Q 59 89 47 81 Q 34 89 26 78 Q 12 75 15 62 Q 5 52 12 42 Q 4 34 8 25 Z",
                fill: "#71845a",
                opacity: ".18",
                stroke: "#5d5737",
                "stroke-width": ".85",
                "stroke-linejoin": "round",
              }),
            );
            svg.appendChild(
              el("path", {
                d: "M 12 27 Q 18 19 28 22 Q 36 14 44 21 Q 55 14 64 22 Q 76 18 81 29 Q 89 36 84 45 Q 90 54 79 62 Q 78 73 67 75 Q 58 84 47 77 Q 35 84 28 75 Q 17 72 19 61 Q 10 52 16 42 Q 9 34 12 27 Z",
                fill: "none",
                stroke: "#f0d59a",
                "stroke-width": ".75",
                "stroke-dasharray": "1.1 1.2",
                opacity: ".9",
              }),
            );
            for (const [cx, cy, rx, ry] of [
              [24, 31, 5, 2],
              [73, 38, 6, 2.5],
              [31, 67, 7, 2],
              [63, 70, 5, 2],
            ]) {
              svg.appendChild(
                el("ellipse", {
                  cx,
                  cy,
                  rx,
                  ry,
                  fill: "none",
                  stroke: "#786c45",
                  "stroke-width": ".35",
                  opacity: ".55",
                  transform: `rotate(-18 ${cx} ${cy})`,
                }),
              );
            }

    // Das Motiv liegt zwischen Hintergrund und Vordergrunddekor.
    cleanupMotiv = motiv({svg, el}) || null;

    // Kompass, Kartenbanner, Zielkreuz, Route und die zwölf Truhen.
    const comp = el("g", { transform: "translate(13, 15) scale(0.68)" });
            comp.appendChild(
              el("circle", {
                cx: 0,
                cy: 0,
                r: 5.5,
                fill: "none",
                stroke: "#5a3a18",
                "stroke-width": "0.4",
                opacity: "0.75",
              }),
            );
            comp.appendChild(
              el("circle", {
                cx: 0,
                cy: 0,
                r: 3.8,
                fill: "none",
                stroke: "#5a3a18",
                "stroke-width": "0.2",
                opacity: "0.6",
              }),
            );
            comp.appendChild(
              el("path", {
                d: "M0,-5.5 L1,-1 L5.5,0 L1,1 L0,5.5 L-1,1 L-5.5,0 L-1,-1 Z",
                fill: "#5a3a18",
                opacity: "0.8",
              }),
            );
            comp.appendChild(
              el("path", {
                d: "M0,-3.8 L0.6,-0.6 L3.8,0 L0.6,0.6 L0,3.8 L-0.6,0.6 L-3.8,0 L-0.6,-0.6 Z",
                fill: "#f2ddb0",
              }),
            );
            ["N", "S", "O", "W"].forEach((dir, i) => {
              const pos = [
                [0, -6.6],
                [0, 7.4],
                [7.4, 0],
                [-7.4, 0],
              ][i];
              const t = el("text", {
                x: pos[0],
                y: pos[1] + 1,
                "text-anchor": "middle",
                "font-size": "1.6",
                "font-weight": "bold",
                fill: "#5a3a18",
              });
              t.textContent = dir;
              comp.appendChild(t);
            });
            svg.appendChild(comp);

            const bannerW = 38,
              bannerX = 50 - bannerW / 2,
              bannerY = 4;
            svg.appendChild(
              el("path", {
                d: `M${bannerX} ${bannerY} L${bannerX + bannerW} ${bannerY} L${bannerX + bannerW - 2} ${bannerY + 5} L${bannerX + bannerW / 2} ${bannerY + 7} L${bannerX + 2} ${bannerY + 5} Z`,
                fill: "#8a6030",
                stroke: "#5a3a18",
                "stroke-width": "0.3",
              }),
            );
            const titel = el("text", {
              x: 50,
              y: bannerY + 4,
              "text-anchor": "middle",
              "font-size": "2.4",
              "font-weight": "bold",
              fill: "#ffe9b0",
              "letter-spacing": "0.3",
            });
            titel.textContent = "SCHATZKARTE";
            svg.appendChild(titel);

            const ziel = KARTEN_POSITIONEN[KARTEN_POSITIONEN.length - 1];
            const xMark = el("text", {
              x: ziel.x + 7,
              y: ziel.y - 3,
              "font-size": "4.5",
              "text-anchor": "middle",
              "font-weight": "bold",
              fill: "#a02010",
              opacity: "0.85",
            });
            xMark.textContent = "✕";
            svg.appendChild(xMark);

            const routeD = KARTEN_POSITIONEN.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            svg.appendChild(
              el("path", {
                d: routeD,
                fill: "none",
                stroke: "#746c5a",
                "stroke-width": "0.35",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-dasharray": "1.1 2.4",
                opacity: ".78",
              }),
            );

            const layer = document.getElementById("truhenLayer");
            layer.style.zIndex = "20";
            layer.style.pointerEvents = "auto";
            layer.innerHTML = "";
            KARTEN_POSITIONEN.forEach((pos, i) => {
              const el2 = document.createElement("button");
              el2.type = "button";
              el2.className = "truhe-node";
              el2.style.left = pos.x + "%";
              el2.style.top = pos.y + "%";
              el2.style.padding = "0";
              el2.style.pointerEvents = "auto";
              el2.style.touchAction = "manipulation";
              const num = document.createElement("div");
              num.className = "station-num";
              num.textContent = i + 1;
              if (i < station) {
                el2.classList.add("done");
              } else if (i === station) {
                el2.classList.add("current");
                el2.setAttribute("aria-label", `Schatztruhe ${i + 1} öffnen`);
                el2.setAttribute("title", typeof onChestClick === "function" ? "Schatztruhe öffnen" : "Aktuelle Station (Vorschau)");
              } else {
                el2.classList.add("locked");
                el2.setAttribute("aria-label", `Schatztruhe ${i + 1}, noch gesperrt`);
              }
              el2.innerHTML = `<span class="chest-art"><i class="chest-lid"></i><i class="chest-body"></i><i class="chest-band"></i><i class="chest-lock">${i < station ? "★" : i === station ? "✦" : "•"}</i></span>`;
              el2.appendChild(num);
              if (i === station && typeof onChestClick === "function") {
                el2.addEventListener("click", function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                  onChestClick(i);
                });
              }
              layer.appendChild(el2);
            });
  }

  function dispose() {
    if (typeof cleanupMotiv === "function") cleanupMotiv();
    cleanupMotiv = null;
  }

  return { render, dispose, positionen: KARTEN_POSITIONEN, welten: KARTEN_WELTEN };
})();
window.Schatzkarte = Schatzkarte;
