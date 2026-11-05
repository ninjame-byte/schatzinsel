// Kartenmotiv: weltraum. Enthält ausschließlich die Darstellung dieser Themenwelt.
// Wird von karte.js nach dem gemeinsamen Kartenhintergrund ausgeführt.
window.SchatzkartenWelten = window.SchatzkartenWelten || {};
window.SchatzkartenWelten.weltraum = function zeichneWeltraum({ svg, el }) {
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 100,
      y = Math.random() * 100;
    const rr = Math.random() * 0.6 + 0.2;
    svg.appendChild(
      el("circle", {
        cx: x,
        cy: y,
        r: rr,
        fill: "#fff",
        opacity: (Math.random() * 0.7 + 0.3).toString(),
      }),
    );
  }
  function drawPlanet(cx, cy, rr, color, ring) {
    const g = el("g", { transform: `translate(${cx}, ${cy})` });
    g.appendChild(el("circle", { cx: 0, cy: 0, r: rr, fill: color, opacity: "0.85" }));
    if (ring)
      g.appendChild(
        el("ellipse", {
          cx: 0,
          cy: 0,
          rx: rr * 1.7,
          ry: rr * 0.4,
          fill: "none",
          stroke: "#d0b0f0",
          "stroke-width": "0.3",
          opacity: "0.7",
          transform: "rotate(-20)",
        }),
      );
    svg.appendChild(g);
  }
  drawPlanet(88, 20, 4, "#a060d0", true);
  drawPlanet(12, 75, 3, "#60a0d0", false);
  drawPlanet(75, 80, 2.5, "#d07040", false);
  drawPlanet(25, 20, 2, "#d0d060", false);
  const rak = el("g", { transform: "translate(50, 8)" });
  rak.appendChild(
    el("path", {
      d: "M0,-5 L1.5,-1 L1.5,3 L-1.5,3 L-1.5,-1 Z",
      fill: "#d0d0e0",
      stroke: "#606080",
      "stroke-width": "0.2",
    }),
  );
  rak.appendChild(el("circle", { cx: 0, cy: -2, r: 0.7, fill: "#60a0f0" }));
  rak.appendChild(el("path", { d: "M-1.5,3 L-2.5,5 L-1,4 Z", fill: "#f06040" }));
  rak.appendChild(el("path", { d: "M1.5,3 L2.5,5 L1,4 Z", fill: "#f06040" }));
  svg.appendChild(rak);
};
