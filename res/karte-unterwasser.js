// Kartenmotiv: unterwasser. Enthält ausschließlich die Darstellung dieser Themenwelt.
// Wird von karte.js nach dem gemeinsamen Kartenhintergrund ausgeführt.
window.SchatzkartenWelten = window.SchatzkartenWelten || {};
window.SchatzkartenWelten.unterwasser = function zeichneUnterwasser({ svg, el }) {
  for (let i = 0; i < 6; i++) {
    svg.appendChild(
      el("path", {
        d: `M${2 + i * 16},5 Q${6 + i * 16},3.5 ${10 + i * 16},5 T${18 + i * 16},5`,
        fill: "none",
        stroke: "#4a8aa8",
        "stroke-width": "0.4",
        opacity: "0.7",
      }),
    );
    svg.appendChild(
      el("path", {
        d: `M${2 + i * 16},95 Q${6 + i * 16},93.5 ${10 + i * 16},95 T${18 + i * 16},95`,
        fill: "none",
        stroke: "#4a8aa8",
        "stroke-width": "0.4",
        opacity: "0.7",
      }),
    );
  }
  function drawFisch(cx, cy, scale, color) {
    const g = el("g", { transform: `translate(${cx}, ${cy}) scale(${scale})` });
    g.appendChild(
      el("ellipse", { cx: 0, cy: 0, rx: 3, ry: 1.5, fill: color, opacity: "0.7" }),
    );
    g.appendChild(
      el("path", { d: "M-2.5,0 L-4,-1.5 L-4,1.5 Z", fill: color, opacity: "0.7" }),
    );
    g.appendChild(el("circle", { cx: 1.5, cy: -0.3, r: 0.3, fill: "#1a3a4a" }));
    svg.appendChild(g);
  }
  drawFisch(10, 20, 1.2, "#f0a040");
  drawFisch(88, 30, 1.1, "#40c0f0");
  drawFisch(50, 10, 1.0, "#f06060");
  drawFisch(75, 75, 1.1, "#f0d040");
  drawFisch(20, 55, 1.0, "#a060f0");
  function drawSeegras(cx, cy, scale) {
    const g = el("g", { transform: `translate(${cx}, ${cy}) scale(${scale})` });
    g.appendChild(
      el("path", {
        d: "M0,3 Q-1,1 -0.5,-2 Q0.5,-4 0,-7",
        fill: "none",
        stroke: "#2a8a4a",
        "stroke-width": "0.6",
        "stroke-linecap": "round",
      }),
    );
    g.appendChild(
      el("path", {
        d: "M1.5,3 Q2.5,1 1.5,-2 Q0.5,-4 1.5,-6",
        fill: "none",
        stroke: "#3a9a5a",
        "stroke-width": "0.5",
        "stroke-linecap": "round",
      }),
    );
    svg.appendChild(g);
  }
  [
    [8, 88, 1.2],
    [92, 88, 1.1],
    [48, 92, 1],
    [80, 20, 0.9],
    [15, 40, 1.0],
    [60, 75, 1.1],
  ].forEach((p) => drawSeegras(p[0], p[1], p[2]));
  [
    [88, 60],
    [12, 70],
    [70, 15],
  ].forEach((p) => {
    const g = el("g", { transform: `translate(${p[0]}, ${p[1]})` });
    g.appendChild(
      el("path", {
        d: "M-2,0 Q0,-3 2,0 Z",
        fill: "#f0b0c0",
        opacity: "0.8",
        stroke: "#a06070",
        "stroke-width": "0.2",
      }),
    );
    svg.appendChild(g);
  });
};
