// Gestisce il tema chiaro/scuro e il saluto in base all'orario.
// Viene caricato nell'<head>, così il tema giusto è applicato
// prima che la pagina compaia (niente lampo bianco di notte).
(function () {
  const CHIAVE_TEMA = "lista-spesa-tema";

  // In modalità automatica il tema scuro va dalle 19:00 alle 7:00
  const ORA_INIZIO_SCURO = 19;
  const ORA_FINE_SCURO = 7;

  const SCELTE = ["auto", "chiaro", "scuro"];
  const ETICHETTE = {
    auto: { icona: "🕒", testo: "Auto", descrizione: "automatico in base all'orario" },
    chiaro: { icona: "☀️", testo: "Chiaro", descrizione: "sempre chiaro" },
    scuro: { icona: "🌙", testo: "Scuro", descrizione: "sempre scuro" },
  };

  const radice = document.documentElement;
  let scelta = leggiScelta();

  function leggiScelta() {
    try {
      const salvata = localStorage.getItem(CHIAVE_TEMA);
      return SCELTE.includes(salvata) ? salvata : "auto";
    } catch (errore) {
      return "auto";
    }
  }

  function salvaScelta() {
    try {
      localStorage.setItem(CHIAVE_TEMA, scelta);
    } catch (errore) {
      // Salvataggio bloccato: la scelta vale solo fino al prossimo ricaricamento
    }
  }

  function temaDaOrario() {
    const ora = new Date().getHours();
    return ora >= ORA_INIZIO_SCURO || ora < ORA_FINE_SCURO ? "scuro" : "chiaro";
  }

  function salutoDaOrario() {
    const ora = new Date().getHours();
    if (ora >= 5 && ora < 13) return "Buongiorno ☕";
    if (ora >= 13 && ora < 18) return "Buon pomeriggio 🌤️";
    return "Buonasera 🌙";
  }

  function applica() {
    radice.dataset.tema = scelta === "auto" ? temaDaOrario() : scelta;

    // Colora anche la barra del browser sul telefono
    const metaColore = document.querySelector('meta[name="theme-color"]');
    if (metaColore) {
      const sfondo = getComputedStyle(radice).getPropertyValue("--colore-barra").trim();
      if (sfondo) metaColore.setAttribute("content", sfondo);
    }

    const saluto = document.getElementById("saluto");
    if (saluto) saluto.textContent = salutoDaOrario();

    const pulsante = document.getElementById("cambia-tema");
    if (pulsante) {
      const etichetta = ETICHETTE[scelta];
      pulsante.querySelector(".pulsante-tema-icona").textContent = etichetta.icona;
      pulsante.querySelector(".pulsante-tema-testo").textContent = etichetta.testo;
      const descrizione = "Tema: " + etichetta.descrizione + ". Clicca per cambiarlo";
      pulsante.setAttribute("aria-label", descrizione);
      pulsante.title = descrizione;
    }
  }

  applica();

  document.addEventListener("DOMContentLoaded", function () {
    applica();

    document.getElementById("cambia-tema").addEventListener("click", function () {
      scelta = SCELTE[(SCELTE.indexOf(scelta) + 1) % SCELTE.length];
      salvaScelta();
      applica();
    });
  });

  // Controlla l'orario ogni minuto, e quando si torna sulla pagina
  // (sul telefono i timer si fermano quando la pagina è in background)
  setInterval(applica, 60 * 1000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) applica();
  });
})();
