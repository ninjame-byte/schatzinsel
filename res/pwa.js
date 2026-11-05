// PWA: nur im sicheren Kontext (HTTPS oder localhost) registrierbar.
(() => {
  "use strict";
  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch((error) => {
        console.warn("Offline-Modus konnte nicht aktiviert werden:", error);
      });
    });
  }
  const installButton = document.getElementById("pwaInstall");
  if (!installButton) return;
  let installEvent = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event;
    installButton.hidden = false;
  });
  installButton.addEventListener("click", async () => {
    if (!installEvent) return;
    installButton.hidden = true;
    const promptEvent = installEvent;
    installEvent = null;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (error) { console.warn("Installation nicht möglich:", error); }
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    installButton.hidden = true;
  });
})();
