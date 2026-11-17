const form = document.getElementById("form-articolo");
const input = document.getElementById("input-articolo");
const lista = document.getElementById("lista");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const testo = input.value.trim();
  if (testo === "") {
    return;
  }

  aggiungiArticolo(testo);
  input.value = "";
  input.focus();
});

function aggiungiArticolo(testo) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = testo;

  const pulsanteElimina = document.createElement("button");
  pulsanteElimina.textContent = "Elimina";
  pulsanteElimina.className = "elimina";
  pulsanteElimina.addEventListener("click", function () {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(pulsanteElimina);
  lista.appendChild(li);
}
