import "./styles.css";
import { queries } from "@testing-library/dom";

const loadButton = document.getElementById("load-button");
const helpButton = document.getElementById("help-button");
const executeButton = document.getElementById("execute-button");
const resetHighlightButton = document.getElementById("reset-highlight-button");

const htmlInput = document.getElementById("html-input");
const queryInput = document.getElementById("query-input");
const output = document.getElementById("output");

const error = document.getElementById("error");
const errorText = document.getElementById("error-text");

const popup = document.getElementById("popup");
const backdrop = document.getElementById("backdrop");
const close = document.getElementById("close");

let prev = [];

loadButton.addEventListener("click", () => {
  htmlInput.value = `<label for="username">Username</label>
<input id="username" />
<button>Print Username</button>
<button>Print Username</button>`;
  htmlInput.dispatchEvent(new Event("input"));

  queryInput.value = `queries.getByLabelText(container, "Username")`;
});

helpButton.addEventListener("click", openPopup);
backdrop.addEventListener("click", closePopup);
close.addEventListener("click", closePopup);

executeButton.addEventListener("click", () => execute(queryInput.value));
resetHighlightButton.addEventListener("click", resetHighlight);

htmlInput.addEventListener("input", e => {
  output.innerHTML = e.target.value;
});

queryInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    execute(e.target.value);
  }
});

function execute(query) {
  resetError();
  resetHighlight();
  // queries and container are special here because we
  // use the function's lexical scope to make sure eval(api) works
  // eslint-disable-next-line
  const execQuery = new Function(
    "queries",
    "container",
    "api",
    `return eval(api);`
  );
  Promise.resolve()
    .then(() => execQuery(queries, output, query))
    .then(elements => {
      if (!Array.isArray(elements)) elements = [elements];
      elements.forEach(e => e.classList.add("highlight"));
      prev = elements;
    })
    .catch(e => {
      console.log(e);
      setError(e);
    });
}

function resetHighlight() {
  prev.forEach(e => e.classList.remove("highlight"));
  prev = [];
}

function resetError() {
  errorText.innerText = null;
  error.classList.add("invisible");
}

function setError(exception) {
  errorText.innerText = exception;
  error.classList.remove("invisible");
}

function escapeListener(e) {
  if (e.key === "Escape") {
    closePopup();
  }
}

function closePopup() {
  popup.classList.toggle("invisible");
  document.removeEventListener("keyup", escapeListener);
}

function openPopup() {
  popup.classList.toggle("invisible");
  document.addEventListener("keyup", escapeListener);
}
