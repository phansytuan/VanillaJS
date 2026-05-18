/* ================================================================
   app.js — BookShelf | Vanilla JS Learning Project
   ================================================================
   CONCEPTS COVERED (each section is labelled):
     1. Variables & Data Types
     2. Objects & Arrays
     3. Functions
     4. DOM Manipulation
     5. Events & Event Listeners
     6. Conditionals
     7. Loops
     8. Local Storage
     9. Async / Await & Fetch API

   TIP: Open DevTools (F12) → Console to see console.log() output
   as you interact with the app.
================================================================ */


/* ================================================================
   1 — VARIABLES & DATA TYPES
   ----------------------------------------------------------------
   const  — value never reassigned (prefer this by default)
   let    — value can change
   var    — old-style, avoid in modern code

   Types: string, number, boolean, null, undefined, object, array
================================================================ */

const APP_NAME   = "BookShelf"; // string constant
const MAX_RATING = 5;           // number constant
let   currentFilter = "all";    // changes when the user clicks a filter

console.log(`%c${APP_NAME} loaded ✓`, "color: #f5a623; font-weight: bold;");


/* ================================================================
   2 — OBJECTS & ARRAYS
   ----------------------------------------------------------------
   Object — a bundle of related data:  { key: value }
   Array  — an ordered list:           [ item1, item2 ]

   A single book object looks like:
   {
     id:      "1716000000000",
     title:   "The Hobbit",
     author:  "J.R.R. Tolkien",
     pages:   310,
     status:  "done",           // "wishlist" | "reading" | "done"
     rating:  5,
     notes:   "Absolute classic",
     addedAt: "2024-05-01T10:00:00.000Z"
   }
================================================================ */

// Start with an empty array; loadBooks() fills it from localStorage.
let books = [];


/* ================================================================
   4 — DOM MANIPULATION
   ----------------------------------------------------------------
   document.getElementById("id")     — find one element by id
   document.querySelectorAll(".cls") — find elements by CSS selector
   element.textContent = "hello"     — change text
   element.innerHTML   = "<b>hi</b>" — set HTML (careful with user input)
   element.classList.add("active")   — add a CSS class
   element.hidden = true             — show / hide an element

   We grab all references once here so we don't search the DOM
   repeatedly throughout the code.
================================================================ */

// Form inputs
const inputTitle  = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages  = document.getElementById("input-pages");
const inputStatus = document.getElementById("input-status");
const inputRating = document.getElementById("input-rating");
const inputNotes  = document.getElementById("input-notes");
const btnAdd      = document.getElementById("btn-add");
const errorMsg    = document.getElementById("error-msg");
const starPicker  = document.getElementById("star-picker");

// Book list
const bookGrid   = document.getElementById("book-grid");
const emptyState = document.getElementById("empty-state");

// Header stats
const countTotal    = document.getElementById("count-total");
const countReading  = document.getElementById("count-reading");
const countDone     = document.getElementById("count-done");
const countWishlist = document.getElementById("count-wishlist");

// Quote section
const quoteText   = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const btnFetch    = document.getElementById("btn-fetch-quote");

// Concept console panel
const conceptConsole   = document.getElementById("concept-console");
const consoleBody      = document.getElementById("console-body");
const btnConsoleClose  = document.getElementById("console-close");
const btnConsoleToggle = document.getElementById("console-toggle");


/* ================================================================
   3 — FUNCTIONS
   ----------------------------------------------------------------
   Functions are reusable blocks of code.

   Declaration:   function doThing() { ... }
   Arrow:         const doThing = () => { ... }

   Arrow functions are shorter and common in modern JS.
================================================================ */

// Generate a unique ID from the current timestamp.
const generateId = () => String(Date.now());

// Format an ISO date string into a readable label.
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Turn a numeric rating into filled/empty star characters.
function buildStars(rating) {
  if (rating === 0) return "";
  let stars = "";
  for (let i = 1; i <= MAX_RATING; i++) {
    stars += i <= rating ? "⭐" : "☆"; // ternary: condition ? ifTrue : ifFalse
  }
  return stars;
}

// Map a status key to a human-readable label with emoji.
const statusLabel = (status) => {
  const labels = {
    wishlist: "📋 Wishlist",
    reading:  "📖 Reading",
    done:     "✅ Finished",
  };
  return labels[status] || status; // fall back to the raw value
};

// Escape HTML special characters to prevent XSS from user input.
function escapeHtml(str) {
  return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
}


/* ================================================================
   6 — CONDITIONALS
   ----------------------------------------------------------------
   if / else if / else — run code when a condition is true
   ternary:  condition ? ifTrue : ifFalse
   &&  both sides must be true
   ||  at least one side must be true
================================================================ */

function validateForm() {
  const title  = inputTitle.value.trim();
  const author = inputAuthor.value.trim();

  if (title === "") {
    showError("Please enter a book title.");
    return false;
  }

  if (author === "") {
    showError("Please enter the author's name.");
    return false;
  }

  hideError();
  return true;
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function hideError() {
  errorMsg.hidden = true;
}


/* ================================================================
   7 — LOOPS
   ----------------------------------------------------------------
   for loop          — classic index-based iteration
   array.forEach()   — run a function once per item
   array.filter()    — return new array of matching items
   array.map()       — return new array of transformed items
   array.find()      — return first matching item
   array.findIndex() — return index of first matching item
================================================================ */

function renderBooks() {
  // .filter() returns a NEW array — it does not change the original.
  const filteredBooks = books.filter((book) => {
    if (currentFilter === "all") return true;
    return book.status === currentFilter;
  });

  bookGrid.innerHTML = "";

  if (filteredBooks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  filteredBooks.forEach((book) => {
    bookGrid.appendChild(createBookCard(book));
  });

  logConcept("Loops / Filter", `Showing ${filteredBooks.length} of ${books.length} books`);
}

function createBookCard(book) {
  const card = document.createElement("div");
  card.classList.add("book-card");
  card.dataset.status = book.status;

  // Template literal — backtick string that spans lines and embeds ${expressions}
  card.innerHTML = `
    <div class="card-top">
      <div>
        <p class="book-title">${escapeHtml(book.title)}</p>
        <p class="book-author">by ${escapeHtml(book.author)}</p>
      </div>
      <div class="card-actions">
        <button class="btn-icon" data-action="delete" data-id="${book.id}" title="Delete">🗑</button>
      </div>
    </div>
    <div class="card-meta">
      <span class="status-badge ${book.status}">${statusLabel(book.status)}</span>
      ${book.pages ? `<span class="pages-badge">${book.pages} pages</span>` : ""}
    </div>
    ${book.rating > 0 ? `<p class="card-stars">${buildStars(book.rating)}</p>` : ""}
    ${book.notes ? `<p class="card-notes">"${escapeHtml(book.notes)}"</p>` : ""}
    <p class="card-date">Added ${formatDate(book.addedAt)}</p>
  `;

  card.querySelector('[data-action="delete"]')
      .addEventListener("click", () => deleteBook(book.id));

  return card;
}

function updateStats() {
  countTotal.textContent    = books.length;
  countReading.textContent  = books.filter((b) => b.status === "reading").length;
  countDone.textContent     = books.filter((b) => b.status === "done").length;
  countWishlist.textContent = books.filter((b) => b.status === "wishlist").length;
}

function buildStarPicker() {
  for (let i = 1; i <= MAX_RATING; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.textContent = "⭐";
    star.dataset.value = i;

    star.addEventListener("click", () => {
      inputRating.value = i;
      document.querySelectorAll(".star").forEach((s) => {
        s.classList.toggle("active", Number(s.dataset.value) <= i);
      });
      logConcept("Events", `Star clicked → rating set to ${i}`);
    });

    starPicker.appendChild(star);
  }
}


/* ================================================================
   BOOK ACTIONS — add, delete, reset form
================================================================ */

function addBook() {
  if (!validateForm()) return;

  const newBook = {
    id:      generateId(),
    title:   inputTitle.value.trim(),
    author:  inputAuthor.value.trim(),
    pages:   inputPages.value ? Number(inputPages.value) : null,
    status:  inputStatus.value,
    rating:  Number(inputRating.value),
    notes:   inputNotes.value.trim(),
    addedAt: new Date().toISOString(),
  };

  books.push(newBook); // .push() adds an item to the end of an array
  saveBooks();
  renderBooks();
  updateStats();
  resetForm();

  logConcept("Array / Object", `Book added → books.length = ${books.length}`);
  console.log("New book object:", newBook);
}

function deleteBook(id) {
  // .findIndex() returns the array position of the match, or -1.
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return;

  const removed = books[index];
  books.splice(index, 1); // splice(start, deleteCount) removes in place
  saveBooks();
  renderBooks();
  updateStats();

  logConcept("Array splice", `Deleted "${removed.title}" — books.length = ${books.length}`);
  console.log("Deleted book:", removed);
}

function resetForm() {
  inputTitle.value  = "";
  inputAuthor.value = "";
  inputPages.value  = "";
  inputStatus.value = "wishlist";
  inputRating.value = "0";
  inputNotes.value  = "";
  document.querySelectorAll(".star").forEach((s) => s.classList.remove("active"));
}


/* ================================================================
   8 — LOCAL STORAGE
   ----------------------------------------------------------------
   localStorage persists data across page reloads.
   It only stores strings, so we convert with:
     JSON.stringify(value)  → object/array to string
     JSON.parse(string)     → string to object/array

   Methods:
     localStorage.setItem("key", value)  — save
     localStorage.getItem("key")         — load (null if missing)
     localStorage.removeItem("key")      — delete one key
     localStorage.clear()                — wipe everything

   Inspect in DevTools → Application → Local Storage.
================================================================ */

const STORAGE_KEY = "bookshelf_books";

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  logConcept("LocalStorage", `Saved ${books.length} books`);
}

function loadBooks() {
  const json = localStorage.getItem(STORAGE_KEY);

  if (json === null) {
    books = [];
    logConcept("LocalStorage", "No saved data — starting fresh");
    return;
  }

  books = JSON.parse(json);
  logConcept("LocalStorage", `Loaded ${books.length} books`);
  console.log("Books loaded from localStorage:", books);
}


/* ================================================================
   9 — ASYNC / AWAIT & FETCH API
   ----------------------------------------------------------------
   Some work takes time (e.g. downloading data). JS handles this
   without freezing the page using asynchronous code.

   async function  — marks a function that may use await
   await           — pause until a Promise resolves

   fetch(url) downloads data and returns a Promise:
     const response = await fetch(url);      // get the response
     const data     = await response.json(); // parse the body

   Wrap in try / catch / finally to handle errors cleanly.
================================================================ */

const QUOTE_API = "https://api.quotable.kuro.dev/random?tags=literature|education|wisdom";

async function fetchQuote() {
  btnFetch.textContent    = "Loading...";
  btnFetch.disabled       = true;
  quoteText.textContent   = "";
  quoteAuthor.textContent = "";

  try {
    logConcept("Fetch API", `GET ${QUOTE_API}`);

    const response = await fetch(QUOTE_API);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    quoteText.textContent   = `"${data.content}"`;
    quoteAuthor.textContent = `— ${data.author}`;

    logConcept("Async/Await", `Quote received from ${data.author}`);
    console.log("Full API response:", data);

  } catch (error) {
    quoteText.textContent = "Couldn't fetch a quote. Try again!";
    console.error("Fetch error:", error);
    logConcept("Error", error.message);

  } finally {
    // finally runs whether the request succeeded or failed.
    btnFetch.textContent = "Fetch Quote";
    btnFetch.disabled    = false;
  }
}


/* ================================================================
   5 — EVENTS & EVENT LISTENERS
   ----------------------------------------------------------------
   addEventListener(type, callback) tells the browser: "when this
   event fires on this element, run this function."

   Common types: "click", "input", "change", "keydown"
================================================================ */

btnAdd.addEventListener("click", addBook);
btnFetch.addEventListener("click", fetchQuote);

// Press Enter in the title field to add a book.
inputTitle.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addBook();
});

// querySelectorAll returns a NodeList — we loop over it with forEach.
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter; // read the data-filter HTML attribute
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderBooks();
    logConcept("Events", `Filter changed → "${currentFilter}"`);
  });
});

btnConsoleToggle.addEventListener("click", () => conceptConsole.classList.toggle("hidden"));
btnConsoleClose.addEventListener("click",  () => conceptConsole.classList.add("hidden"));


/* ================================================================
   CONCEPT CONSOLE — logs activity to the UI panel
================================================================ */

function logConcept(concept, detail) {
  const entry = document.createElement("div");
  entry.classList.add("log-entry");
  entry.innerHTML = `<span class="log-tag">[${concept}]</span><span class="log-value">${detail}</span>`;
  consoleBody.prepend(entry);

  // Trim old entries past 30.
  const entries = consoleBody.querySelectorAll(".log-entry");
  if (entries.length > 30) entries[entries.length - 1].remove();
}


/* ================================================================
   SEED DATA — pre-fills the library on first visit
================================================================ */

function seedDemoBooks() {
  const demos = [
    {
      id:      "demo1",
      title:   "The Pragmatic Programmer",
      author:  "David Thomas & Andrew Hunt",
      pages:   352,
      status:  "done",
      rating:  5,
      notes:   "A must-read for every developer.",
      addedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id:      "demo2",
      title:   "You Don't Know JS",
      author:  "Kyle Simpson",
      pages:   278,
      status:  "reading",
      rating:  4,
      notes:   "Deep dive into JavaScript internals.",
      addedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id:      "demo3",
      title:   "Clean Code",
      author:  "Robert C. Martin",
      pages:   431,
      status:  "wishlist",
      rating:  0,
      notes:   "",
      addedAt: new Date().toISOString(),
    },
  ];

  demos.forEach((book) => books.push(book));
  saveBooks();
  renderBooks();
  updateStats();
  logConcept("Seed Data", `Added ${demos.length} demo books`);
}


/* ================================================================
   INIT — entry point, called once when the page loads
================================================================ */

function init() {
  console.log(`%c== ${APP_NAME} init() ==`, "color: #f5a623;");

  buildStarPicker();
  loadBooks();
  renderBooks();
  updateStats();
  conceptConsole.classList.add("hidden");

  if (books.length === 0) seedDemoBooks();

  logConcept("Init", `${APP_NAME} ready — ${books.length} books loaded`);
}

init();


/*
  DEBUGGING TIPS
  --------------
  Open DevTools (F12) → Console and try:

    books             → the full array of book objects
    books[0]          → inspect one book
    books.length      → how many books are stored
    currentFilter     → the active filter value
    localStorage      → all stored keys

  Add  debugger;  anywhere in this file to pause JS and step
  through code line-by-line in the Sources panel.
*/