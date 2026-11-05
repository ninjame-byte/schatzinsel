// Kartenmotiv: dschungel. Enthält ausschließlich die Darstellung dieser Themenwelt.
// Wird von karte.js nach dem gemeinsamen Kartenhintergrund ausgeführt.
window.SchatzkartenWelten = window.SchatzkartenWelten || {};
window.SchatzkartenWelten.dschungel = function zeichneDschungel({ svg, el }) {
  // Animationen werden beim Kartenwechsel ordnungsgemaess beendet.
  const animationTimers = [];
  const later = (fn, delay) => {
    const timer = setTimeout(fn, delay);
    animationTimers.push(timer);
    return timer;
  };
  for (let i = 0; i < 6; i++) {
    svg.appendChild(
      el("path", {
        d: `M${2 + i * 16},3 Q${6 + i * 16},1.5 ${10 + i * 16},3 T${18 + i * 16},3`,
        fill: "none",
        stroke: "#6a8a9a",
        "stroke-width": "0.35",
        opacity: "0.6",
      }),
    );
    svg.appendChild(
      el("path", {
        d: `M${2 + i * 16},97 Q${6 + i * 16},95.5 ${10 + i * 16},97 T${18 + i * 16},97`,
        fill: "none",
        stroke: "#6a8a9a",
        "stroke-width": "0.35",
        opacity: "0.6",
      }),
    );
  }
  function drawBerge(cx, cy, scale, count) {
    const g = el("g", { transform: `translate(${cx}, ${cy}) scale(${scale})` });
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 4;
      g.appendChild(
        el("path", {
          d: `M${x - 4},3 L${x},-3 L${x + 4},3 Z`,
          fill: "#9a7a4a",
          stroke: "#5a3a18",
          "stroke-width": "0.2",
        }),
      );
      g.appendChild(
        el("path", {
          d: `M${x - 1.2},-0.8 L${x},-3 L${x + 1.2},-0.8 Z`,
          fill: "#f0e6d0",
          opacity: "0.9",
        }),
      );
    }
    svg.appendChild(g);
  }
  drawBerge(18, 88, 1.1, 4);
  drawBerge(84, 18, 0.9, 3);
  function drawPalme(cx, cy, scale) {
    const g = el("g", { transform: `translate(${cx}, ${cy}) scale(${scale})` });
    g.appendChild(
      el("path", {
        d: "M-0.5,0 Q0,-3 0.3,-6",
        fill: "none",
        stroke: "#6a4a1a",
        "stroke-width": "0.7",
        "stroke-linecap": "round",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M0.3,-6 Q-3,-7 -4,-5 Q-2,-5.5 0.3,-6",
        fill: "#3a8a3a",
        stroke: "#2a6a2a",
        "stroke-width": "0.15",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M0.3,-6 Q3,-7 4,-5 Q2,-5.5 0.3,-6",
        fill: "#3a8a3a",
        stroke: "#2a6a2a",
        "stroke-width": "0.15",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M0.3,-6 Q-2,-9 -4,-8 Q-2,-7.5 0.3,-6",
        fill: "#4a9a4a",
        stroke: "#2a6a2a",
        "stroke-width": "0.15",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M0.3,-6 Q2,-9 4,-8 Q2,-7.5 0.3,-6",
        fill: "#4a9a4a",
        stroke: "#2a6a2a",
        "stroke-width": "0.15",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M0.3,-6 Q0,-9.5 0,-10 Q-0.5,-8 0.3,-6",
        fill: "#4a9a4a",
        stroke: "#2a6a2a",
        "stroke-width": "0.15",
      }),
    );
    svg.appendChild(g);
  }
  const palmen = [
    { x: 10, y: 65, s: 1.2 },
    { x: 90, y: 42, s: 1.1 },
    { x: 50, y: 14, s: 1.0 },
    { x: 74, y: 30, s: 0.9 },
    { x: 20, y: 40, s: 1.0 },
    { x: 66, y: 78, s: 1.1 },
    { x: 34, y: 72, s: 0.9 },
    { x: 88, y: 88, s: 1.0 },
  ];
  const affen = palmen.map((p, index) => {
    const g = el("g", {
      transform: `translate(${p.x + 1.7}, ${p.y - 3.2}) scale(0.01)`,
      opacity: "0",
      "pointer-events": "none",
    });
    g.appendChild(
      el("circle", {
        cx: -1.15,
        cy: -0.15,
        r: 1.05,
        fill: "#8b542e",
        stroke: "#56331f",
        "stroke-width": ".22",
      }),
    );
    g.appendChild(
      el("circle", {
        cx: 1.15,
        cy: -0.15,
        r: 1.05,
        fill: "#8b542e",
        stroke: "#56331f",
        "stroke-width": ".22",
      }),
    );
    g.appendChild(
      el("circle", {
        cx: 0,
        cy: 0,
        r: 1.55,
        fill: "#a96b3b",
        stroke: "#56331f",
        "stroke-width": ".25",
      }),
    );
    g.appendChild(el("ellipse", { cx: 0, cy: 0.55, rx: 1.02, ry: 0.78, fill: "#e5c18a" }));
    g.appendChild(el("circle", { cx: -0.48, cy: -0.18, r: 0.18, fill: "#24170f" }));
    g.appendChild(el("circle", { cx: 0.48, cy: -0.18, r: 0.18, fill: "#24170f" }));
    g.appendChild(
      el("path", {
        d: "M-.35,.72 Q0,.98 .38,.68",
        fill: "none",
        stroke: "#56331f",
        "stroke-width": ".18",
        "stroke-linecap": "round",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M-1.35,-.72 Q0,-1.72 1.35,-.72 L1.18,-.25 Q0,-.72 -1.18,-.25 Z",
        fill: "#252b2c",
        stroke: "#171a1a",
        "stroke-width": ".16",
      }),
    );
    g.appendChild(el("circle", { cx: 0, cy: -1.0, r: 0.18, fill: "#f0d18a" }));
    svg.appendChild(g);
    return { group: g, palm: p };
  });
  palmen.forEach((p) => drawPalme(p.x, p.y, p.s));

  let sichtbarerAffe = null;
  const affeZeigen = () => {
    if (sichtbarerAffe) {
      sichtbarerAffe.group.setAttribute("opacity", "0");
      sichtbarerAffe.group.setAttribute(
        "transform",
        `translate(${sichtbarerAffe.palm.x + 1.7}, ${sichtbarerAffe.palm.y - 3.2}) scale(0.01)`,
      );
    }
    const kandidat = affen[Math.floor(Math.random() * affen.length)];
    sichtbarerAffe = kandidat;
    const groesse = 0.48 * kandidat.palm.s;
    kandidat.group.setAttribute("opacity", "1");
    kandidat.group.setAttribute(
      "transform",
      `translate(${kandidat.palm.x + 1.7}, ${kandidat.palm.y - 3.2}) scale(${groesse})`,
    );
    later(() => {
      if (sichtbarerAffe === kandidat) {
        kandidat.group.setAttribute(
          "transform",
          `translate(${kandidat.palm.x + 2.6}, ${kandidat.palm.y - 3.2}) scale(${groesse})`,
        );
      }
    }, 650);
    later(() => {
      if (sichtbarerAffe === kandidat) {
        kandidat.group.setAttribute("opacity", "0");
        kandidat.group.setAttribute(
          "transform",
          `translate(${kandidat.palm.x + 1.7}, ${kandidat.palm.y - 3.2}) scale(0.01)`,
        );
        sichtbarerAffe = null;
      }
    }, 2300);
  };
  later(affeZeigen, 3200 + Math.random() * 2500);
  const piratenaffeTimer = setInterval(affeZeigen, 8500 + Math.random() * 3500);
  [
    [5, 75, 1.2],
    [8, 80, 1],
    [92, 60, 1.1],
    [95, 70, 0.9],
    [45, 20, 1],
    [55, 25, 0.9],
    [80, 68, 1.1],
    [28, 60, 0.9],
  ].forEach((p) => {
    const g = el("g", { transform: `translate(${p[0]}, ${p[1]}) scale(${p[2]})` });
    g.appendChild(el("circle", { cx: 0, cy: 0, r: 1.4, fill: "#4a8a3a", opacity: "0.85" }));
    g.appendChild(
      el("circle", { cx: 1.2, cy: 0.3, r: 1.1, fill: "#3a7a2a", opacity: "0.85" }),
    );
    g.appendChild(
      el("circle", { cx: -1.1, cy: 0.4, r: 1.0, fill: "#3a7a2a", opacity: "0.85" }),
    );
    svg.appendChild(g);
  });
  return () => {
    clearInterval(piratenaffeTimer);
    animationTimers.forEach(clearTimeout);
  };
};
