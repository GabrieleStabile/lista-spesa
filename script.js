const form = document.getElementById("form-articolo");
const input = document.getElementById("input-articolo");
const lista = document.getElementById("lista");
const contatore = document.getElementById("contatore");
const progresso = document.getElementById("progresso");
const vuoto = document.getElementById("vuoto");
const piede = document.getElementById("piede");
const rimuoviPresi = document.getElementById("rimuovi-presi");

// Nome con cui la lista viene salvata nel browser (localStorage)
const CHIAVE_SALVATAGGIO = "lista-spesa";

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const testo = input.value.trim();
  if (testo === "") {
    segnalaErrore();
    return;
  }

  aggiungiArticolo(testo);
  input.value = "";
  input.focus();
});

input.addEventListener("animationend", function () {
  input.classList.remove("errore");
});

rimuoviPresi.addEventListener("click", function () {
  lista.querySelectorAll(".articolo.preso").forEach(function (li) {
    li.remove();
  });
  aggiornaRiepilogo();
});

function aggiungiArticolo(testo, preso = false) {
  const li = document.createElement("li");
  li.className = preso ? "articolo preso" : "articolo";

  // Il testo è un pulsante, così si può barrare anche da tastiera
  const pulsanteTesto = document.createElement("button");
  pulsanteTesto.type = "button";
  pulsanteTesto.className = "articolo-testo";
  pulsanteTesto.setAttribute("aria-pressed", String(preso));

  const spunta = document.createElement("span");
  spunta.className = "spunta";
  spunta.setAttribute("aria-hidden", "true");

  const nome = document.createElement("span");
  nome.className = "nome";
  nome.textContent = testo;

  pulsanteTesto.append(spunta, nome);
  pulsanteTesto.addEventListener("click", function () {
    const preso = li.classList.toggle("preso");
    pulsanteTesto.setAttribute("aria-pressed", String(preso));
    aggiornaRiepilogo();
  });

  const pulsanteElimina = document.createElement("button");
  pulsanteElimina.type = "button";
  pulsanteElimina.className = "pulsante-elimina";
  pulsanteElimina.textContent = "×";
  pulsanteElimina.setAttribute("aria-label", "Elimina " + testo);
  pulsanteElimina.addEventListener("click", function () {
    li.remove();
    aggiornaRiepilogo();
  });

  li.append(pulsanteTesto, pulsanteElimina);
  lista.appendChild(li);
  aggiornaRiepilogo();
}

function aggiornaRiepilogo() {
  const totale = lista.children.length;
  const presi = lista.querySelectorAll(".articolo.preso").length;
  const mancanti = totale - presi;

  if (totale === 0) {
    contatore.textContent = "Nessun articolo";
  } else if (mancanti === 0) {
    contatore.textContent = "Hai preso tutto! 🎉";
  } else {
    contatore.textContent =
      mancanti + (mancanti === 1 ? " articolo" : " articoli") +
      " da prendere su " + totale;
  }

  progresso.style.width = totale === 0 ? "0" : (presi / totale) * 100 + "%";
  vuoto.hidden = totale > 0;
  piede.hidden = totale === 0;
  rimuoviPresi.disabled = presi === 0;

  salvaLista();
}

function salvaLista() {
  const articoli = Array.from(lista.children).map(function (li) {
    return {
      testo: li.querySelector(".nome").textContent,
      preso: li.classList.contains("preso"),
    };
  });

  try {
    localStorage.setItem(CHIAVE_SALVATAGGIO, JSON.stringify(articoli));
  } catch (errore) {
    // Il browser può bloccare il salvataggio (es. navigazione privata):
    // la lista funziona lo stesso, solo non viene ricordata.
  }
}

function caricaLista() {
  let articoli = [];

  try {
    articoli = JSON.parse(localStorage.getItem(CHIAVE_SALVATAGGIO)) || [];
  } catch (errore) {
    articoli = [];
  }

  if (!Array.isArray(articoli)) {
    return;
  }

  articoli.forEach(function (articolo) {
    if (articolo && typeof articolo.testo === "string") {
      aggiungiArticolo(articolo.testo, articolo.preso === true);
    }
  });
}

function segnalaErrore() {
  input.classList.remove("errore");
  void input.offsetWidth; // fa ripartire l'animazione
  input.classList.add("errore");
  input.focus();
}

caricaLista();
aggiornaRiepilogo();
