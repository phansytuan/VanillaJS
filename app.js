/* ================================================================
   app.js — BookShelf Learning Project
   ================================================================

   WHAT YOU'LL LEARN (each section is labeled):
     1.  Variables & Data Types
     2.  Objects & Arrays
     3.  Functions (regular + arrow)
     4.  DOM Manipulation
     5.  Events & Event Listeners
     6.  Conditionals (if/else, ternary)
     7.  Loops (for, forEach, filter, map)
     8.  Local Storage (persist data across page reloads)
     9.  Async / Await & Fetch API
     10. Putting it all together

   TIP: Open your browser's DevTools console (F12 or Cmd+Option+I)
    to see console.log() output as you interact with the app.
================================================================ */


/* ================================================================
   CONCEPT 1 — VARIABLES & DATA TYPES
   ----------------------------------------------------------------
   `const`  = value never Reassigned (use by default)
   `let`    = value can Change
   `var`    = old-style, avoid it in modern code

   Data types: string, number, boolean, null, undefined, object, array
================================================================ */

const APP_NAME = "BookShelf";           // string — constant, never changes
const MAX_RATING = 5;                 // number — constant
let currentFilter = "all";              // string — this WILL change when user clicks filters

// console.log lets you  inspect values while developing:
console.log(`%c${APP_NAME} loaded ✓`, "color: #f5a623; font-weight: bold;");


/* ================================================================
   CONCEPT 2 — OBJECTS & ARRAYS
   ----------------------------------------------------------------
   OBJECT  = a bundle of related data  { key: value }
   ARRAY   = an ordered list           [ item1, item2, ... ]

   Our "books" array holds book OBJECTS. Each book object has
    properties like title, author, status, etc.
================================================================ */

// This is what ONE book object looks like:
//
//  {
//    id:      "1716000000000",    ← unique ID (we use Date.now() to generate it)
//    title:   "The Hobbit",
//    author:  "J.R.R. Tolkien",
//    pages:   310,
//    status:  "done",             ← "wishlist" | "reading" | "done"
//    rating:  5,
//    notes:   "Absolute classic",
//    addedAt: "2024-05-01T10:00:00.000Z"
//  }

// We start with an empty array; loadBooks() will fill it from localStorage
let books = [];


/* ================================================================
   CONCEPT 3 — FUNCTIONS
   ----------------------------------------------------------------
   Functions are reusable blocks of code.

   2 common styles:
     function declaration:    function doThing() { ... }
     arrow function:          const doThing = () => { ... }

   Arrow functions are shorter & very common in modern JS.
================================================================ */

// ── Utility: generate a unique ID using the current timestamp ──
// Arrow function — takes no arguments, returns a string
const generateId = () => String(Date.now());

// ── Utility: format a date string into something readable ──
// Arrow function with one parameter
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ── Utility: turn a numeric rating into star emojis ──
// Uses a loop internally — see CONCEPT 7
function buildStars(rating) {
  // CONCEPT 6 (conditionals): if rating is 0, show nothing
  if (rating === 0) return "";

  let stars = "";
  for (let i = 1; i <= MAX_RATING; i++) {
    // CONCEPT 6 (ternary): shorter way to write if/ else  // condition ? valueIfTrue : valueIfFalse
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

// ── Utility: map a status string to a human-readable label ──
const statusLabel = (status) => {
  // CONCEPT 6: object used as a lookup table (clean alternative to if/ else chains)
  const labels = {
    wishlist: "📋 Wishlist",
    reading:  "📖 Reading",
    done:     "✅ Finished",
  };
  return labels[status] || status;  // fallback to raw value if not found
};


/* ================================================================
   CONCEPT 4 — DOM MANIPULATION
   ----------------------------------------------------------------
   The DOM (Document Object Model) is the browser's live
    representation of your HTML.

   document.getElementById("someId")  — find one element by id
   document.querySelectorAll(".cls")  — find many elements by CSS selector
   element.textContent = "hello"      — change text inside an element.
   element.innerHTML  = "<b>hi</b>"   — set HTML (be careful with user input!)
   element.classList.add("active")    — add a CSS class
   element.hidden = true              — show/ hide an element
================================================================ */

// Grab references to DOM elements we'll use throughout the app. // We do this once at the top so we don't search the DOM repeatedly.

// Form inputs
const inputTitle  = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages  = document.getElementById("input-pages");
const inputStatus = document.getElementById("input-status");
const inputRating = document.getElementById("input-rating");
const inputNotes  = document.getElementById("input-notes");
const btnAdd      = document.getElementById("btn-add");
const errorMsg    = document.getElementById("error-msg");

// Book list area
const bookGrid    = document.getElementById("book-grid");
const emptyState  = document.getElementById("empty-state");

// Stats counters in the header
const countTotal   = document.getElementById("count-total");
const countReading = document.getElementById("count-reading");
const countDone    = document.getElementById("count-done");
const countWishlist= document.getElementById("count-wishlist");

// Quote box
const quoteText   = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const btnFetch    = document.getElementById("btn-fetch-quote");

// Concept console (the little log panel in the corner)
const consoleBody   = document.getElementById("console-body");
const conceptConsole= document.getElementById("concept-console");
const btnConsoleClose = document.getElementById("console-close");
const btnConsoleToggle= document.getElementById("console-toggle");
const starPicker    = document.getElementById("star-picker");


/* ================================================================
   CONCEPT 5 — EVENTS & EVENT LISTENERS
   ----------------------------------------------------------------
   An event is something that happens: a click, a keypress, etc.
    addEventListener(eventType, callbackFunction) tells the browser
    "when THIS event happens on THIS element, run THIS function".

   Common events: "click", "input", "change", "submit", "keydown"
================================================================ */

// When the "Add Book" button is clicked, run addBook()
btnAdd.addEventListener("click", addBook);

// When the "Fetch Quote" button is clicked, run fetchQuote()
btnFetch.addEventListener("click", fetchQuote);

// Allow pressing Enter in the title field to add the book
inputTitle.addEventListener("keydown", (event) => {
  // CONCEPT 6: check which key was pressed
  if (event.key === "Enter") addBook();
});

// Filter buttons — querySelectorAll returns a NodeList (array-like)
const filterBtns = document.querySelectorAll(".filter-btn");

// CONCEPT 7 (loop): attach click listener to EACH filter button
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update which filter is active
    currentFilter = btn.dataset.filter;   // data-filter attribute from HTML

    // Remove "active" class from all buttons, add it to the clicked one
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Re-render the book list with the new filter
    renderBooks();

    logConcept("Events", `Filter changed → "${currentFilter}"`);
  });
});

// Toggle the concept console panel
btnConsoleToggle.addEventListener("click", () => {
  conceptConsole.classList.toggle("hidden");
});

btnConsoleClose.addEventListener("click", () => {
  conceptConsole.classList.add("hidden");
});


/* ================================================================
   STAR PICKER — builds interactive star rating UI
   Uses a loop to create elements dynamically
================================================================ */

function buildStarPicker() {
  // CONCEPT 7 (loop): create 5-star spans
  for (let i = 1; i <= MAX_RATING; i++) {
    const star = document.createElement("span");   // create a new <span> element
    star.classList.add("star");
    star.textContent = "⭐";
    star.dataset.value = i;                        // store the star's number as data

    // CONCEPT 5: add click event to each star
    star.addEventListener("click", () => {
      inputRating.value = i;                       // update hidden input value

      // CONCEPT 7: update visual state of all stars
      document.querySelectorAll(".star").forEach((s) => {
        // CONCEPT 6 (ternary): if this star's index ≤ chosen rating → active
        s.classList.toggle("active", Number(s.dataset.value) <= i);
      });

      logConcept("Events", `Star clicked → rating set to ${i}`);
    });

    starPicker.appendChild(star);   // add the star element to the DOM
  }
}


/* ================================================================
   CONCEPT 6 — CONDITIONALS
   ----------------------------------------------------------------
   `if / else if / else`  — run code when a condition is true
   ternary operator:  condition ? ifTrue : ifFalse
   logical &  &&   — both sides must be true
   logical OR   ||   — at least one side must be true
================================================================ */

function validateForm() {
  const title  = inputTitle.value.trim();
  const author = inputAuthor.value.trim();

  if (title === "") {
    showError("Please enter a book title.");
    return false;   // ← returning false signals "validation failed"
  }

  if (author === "") {
    showError("Please enter the author's name.");
    return false;
  }

  // All checks passed!
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
   ADD BOOK — the main "write" action
   Combines: objects, arrays, DOM, events, localStorage
================================================================ */

function addBook() {
  // Step 1: Validate input
  if (!validateForm()) return;  // stop if validation fails

  // Step 2: Read values from the form
  const title  = inputTitle.value.trim();
  const author = inputAuthor.value.trim();
  const pages = inputPages.value ? Number(inputPages.value) : null;
  const status = inputStatus.value;
  const rating = Number(inputRating.value);
  const notes  = inputNotes.value.trim();

  // Step 3: Create a new  book OBJECT
  const newBook = {
    id:      generateId(),
    title:   title,
    author:  author,
    pages:   pages,
    status:  status,
    rating:  rating,
    notes:   notes,
    addedAt: new Date().toISOString(),   // ISO date string
  };

  // CONCEPT 2: add the new object to our array using .push()
  books.push(newBook);

  // CONCEPT 8: save to localStorage so data survives page refreshes
  saveBooks();

  // Step 4: update UI
  renderBooks();
  updateStats();
  resetForm();

  logConcept("Array / Object", `Book added → books.length = ${books.length}`);
  console.log("New book object:", newBook);   // inspect it in DevTools!
}


/* ================================================================
   CONCEPT 7 — LOOPS
   ----------------------------------------------------------------
   for loop        — classic, great for index-based Iteration
   array.forEach()  — run a function once Per array item
   array.filter()   — returns new array with items matching a Test
   array.map()      — returns new array transformed by a Function
   array.find()     — returns First item matching a test
   array.findIndex() — returns Index of first matching item
================================================================ */

function renderBooks() {
  // Step 1: FILTER the books array based on currentFilter  // .filter() returns a NEW array — it doesn't modify the original
  const filteredBooks = books.filter((book) => {
    if (currentFilter === "all") return true;    // show everything
    return book.status === currentFilter;        // only Matching status
  });

  // Step 2: Clear the grid before re-rendering
  bookGrid.innerHTML = "";

  // Step 3: show/ hide empty state  // CONCEPT 6: conditional
  if (filteredBooks.length === 0) {
    emptyState.hidden = false;
    return;   // nothing to render, exit early
  }

  emptyState.hidden = true;

  // Step 4: Loop over filteredBooks & create a card for each
  filteredBooks.forEach((book) => {
    const card = createBookCard(book);  // returns an HTML element
    bookGrid.appendChild(card);         // add it to the DOM
  });

  logConcept("Loops / Filter", `Showing ${filteredBooks.length} of ${books.length} books`);
}


// Creates & returns a single book card DOM element
function createBookCard(book) {
  // CONCEPT 4: create a new element & set its HTML
  const card = document.createElement("div");
  card.classList.add("book-card");
  card.dataset.status = book.status;  // used by CSS for the colored stripe

  // Build the inner HTML string using a TEMPLATE LITERAL (backtick string)
  // Template literals can span multiple lines & embed expressions: ${...}
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

  // Attach delete button event inside this card
  const deleteBtn = card.querySelector('[data-action="delete"]');
  deleteBtn.addEventListener("click", () => deleteBook(book.id));

  return card;
}

// Safety helper: prevents XSS by  escaping user-typed HTML characters
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


/* ================================================================
   DELETE BOOK
   Uses array.findIndex() & array.splice() to remove an item
================================================================ */

function deleteBook(id) {
  // CONCEPT 7: .findIndex() returns the position of the matching item, or -1
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) return;  // not found — shouldn't happen, but safe to check

  const removed = books[index];

  // .splice(startIndex, deleteCount) removes items from an array IN PLACE
  books.splice(index, 1);

  saveBooks();
  renderBooks();
  updateStats();

  logConcept("Array splice", `Deleted "${removed.title}" — books.length = ${books.length}`);
  console.log("Deleted book:", removed);
}


/* ================================================================
   UPDATE STATS — count books by status using .filter()
================================================================ */

function updateStats() {
  // CONCEPT 7: .filter().length is a handy way to count matching items
  const totalCount    = books.length;
  const readingCount  = books.filter((b) => b.status === "reading").length;
  const doneCount     = books.filter((b) => b.status === "done").length;
  const wishlistCount = books.filter((b) => b.status === "wishlist").length;

  // CONCEPT 4: update DOM text content
  countTotal.textContent    = totalCount;
  countReading.textContent  = readingCount;
  countDone.textContent     = doneCount;
  countWishlist.textContent = wishlistCount;

  logConcept("Array.filter", `Stats → total:${totalCount} reading:${readingCount} done:${doneCount} wishlist:${wishlistCount}`);
}


/* ================================================================
   RESET FORM — clear inputs after adding a book
================================================================ */

function resetForm() {
  inputTitle.value  = "";
  inputAuthor.value = "";
  inputPages.value  = "";
  inputStatus.value = "wishlist";
  inputRating.value = "0";
  inputNotes.value  = "";

  // Clear star picker visual state
  document.querySelectorAll(".star").forEach((s) => s.classList.remove("active"));
}


/* ================================================================
   CONCEPT 8 — LOCAL STORAGE
   ----------------------------------------------------------------
   localStorage is a key-value store in the browser that persists
   data even after the page is closed.

   localStorage only stores STRINGS, so we use:
     JSON.stringify(value)  → convert object/array → string
     JSON.parse(string)     → convert string → object/array

   Key methods:
     localStorage.setItem("key", value)   — save
     localStorage.getItem("key")          — retrieve (returns null if missing)
     localStorage.removeItem("key")       — delete
     localStorage.clear()                 — wipe everything
================================================================ */

const STORAGE_KEY = "bookshelf_books";  // the key we'll use in localStorage

function saveBooks() {
  // Convert our books array to a JSON string & save it
  const json = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, json);

  logConcept("LocalStorage", `Saved ${books.length} books → "${STORAGE_KEY}"`);
  // You can inspect this in DevTools → Application → Local Storage!
}

function loadBooks() {
  // Retrieve the stored JSON string
  const json = localStorage.getItem(STORAGE_KEY);

  // CONCEPT 6: if nothing was stored yet, json will be null
  if (json === null) {
    books = [];         // start with an empty array
    logConcept("LocalStorage", "No saved data found — starting fresh");
    return;
  }

  // Parse the JSON string back into a JavaScript array of objects
  books = JSON.parse(json);
  logConcept("LocalStorage", `Loaded ${books.length} books from storage`);
  console.log("Books loaded from localStorage:", books);
}


/* ================================================================
   CONCEPT 9 — ASYNC / AWAIT & FETCH API
   ----------------------------------------------------------------
   Some operations take time (like downloading data from a server).
   JavaScript handles this without "freezing" the page using
   ASYNCHRONOUS code.

   `async function myFn()` — marks a function as async
   `await somePromise`     — pauses until the promise resolves

   `fetch(url)` — built-in browser function that downloads data
   from a URL. It returns a Promise (a value that arrives later).

   The typical pattern:
     1. fetch(url)            → Promise<Response>
     2. await response.json() → Promise<data object>

   Wrap in try/ catch to handle errors gracefully.
================================================================ */

// We'll use a free public quotes API
const QUOTE_API = "https://api.quotable.kuro.dev/random?tags=literature|education|wisdom";

// `async` means this function can use `await` inside it
async function fetchQuote() {
  // Update button text to show loading state
  btnFetch.textContent = "Loading...";
  btnFetch.disabled = true;
  quoteText.textContent = "";
  quoteAuthor.textContent = "";

  // try/ catch handles errors (network issues, API down, etc.)
  try {
    logConcept("Fetch API", `GET ${QUOTE_API}`);

    // Step 1: Send the HTTP request — await pauses until we get a response
    const response = await fetch(QUOTE_API);

    // CONCEPT 6: check if the request succeeded (status 200–299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Step 2: Parse the JSON body — await pauses until it's parsed
    const data = await response.json();

    // Step 3: Update the UI with the fetched data
    quoteText.textContent   = `"${data.content}"`;
    quoteAuthor.textContent = `— ${data.author}`;

    logConcept("Async/Await", `Quote received from ${data.author}`);
    console.log("Full API response:", data);   // inspect in DevTools!

  } catch (error) {
    // If anything goes wrong above, we land here
    quoteText.textContent = "Couldn't fetch a quote. Try again!";
    console.error("Fetch error:", error);
    logConcept("Error", error.message);

  } finally {
    // `finally` runs whether success or error — good for cleanup
    btnFetch.textContent = "Fetch Quote";
    btnFetch.disabled = false;
  }
}


/* ================================================================
   CONCEPT CONSOLE LOGGER
   ----------------------------------------------------------------
   This logs JS learning notes to the little UI panel in the corner,
    so you can see concepts fire in real time without opening DevTools.
================================================================ */

function logConcept(concept, detail) {
  const entry = document.createElement("div");
  entry.classList.add("log-entry");
  entry.innerHTML = `<span class="log-tag">[${concept}]</span><span class="log-value">${detail}</span>`;

  // Add newest entries at the top
  consoleBody.prepend(entry);

  // Trim old entries to keep it tidy (max 30)
  const entries = consoleBody.querySelectorAll(".log-entry");
  if (entries.length > 30) entries[entries.length - 1].remove();
}


/* ================================================================
   CONCEPT 10 — PUTTING IT ALL TOGETHER
   ----------------------------------------------------------------
   init() is the entry point. It runs when the page loads,
    sets up the UI, & loads any saved data.
================================================================ */

function init() {
  console.log(`%c== ${APP_NAME} init() called ==`, "color: #f5a623;");

  // Build the interactive star picker
  buildStarPicker();

  // CONCEPT 8: load books from localStorage
  loadBooks();

  // CONCEPT 4: render books to the DOM
  renderBooks();

  // Update header stats
  updateStats();

  // Start the concept console hidden
  conceptConsole.classList.add("hidden");

  // Seed with demo books if the library is empty (helpful for first-time visitors)
  if (books.length === 0) {
    seedDemoBooks();
  }

  logConcept("Init", `${APP_NAME} ready — ${books.length} books loaded`);
}

// ── Demo Books — so the app isn't empty on first load ──────────
function seedDemoBooks() {
  const demos = [
    {
      id: "demo1",
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      pages: 352,
      status: "done",
      rating: 5,
      notes: "A must-read for every developer.",
      addedAt: new Date(Date.now() - 7 * 86400000).toISOString(),  // 7 days ago
    },
    {
      id: "demo2",
      title: "You Don't Know JS",
      author: "Kyle Simpson",
      pages: 278,
      status: "reading",
      rating: 4,
      notes: "Deep dive into JavaScript internals.",
      addedAt: new Date(Date.now() - 3 * 86400000).toISOString(),  // 3 days ago
    },
    {
      id: "demo3",
      title: "Clean Code",
      author: "Robert C. Martin",
      pages: 431,
      status: "wishlist",
      rating: 0,
      notes: "",
      addedAt: new Date().toISOString(),
    },
  ];

  // CONCEPT 7: use .forEach to add each demo book
  demos.forEach((book) => books.push(book));

  saveBooks();
  renderBooks();
  updateStats();

  logConcept("Seed Data", `Added ${demos.length} demo books`);
}

/* ================================================================
   START THE APP
   We call init() which kicks everything off.
================================================================ */
init();


/* ================================================================
   BONUS: DEBUGGING TIPS
   ----------------------------------------------------------------
   Open DevTools (F12) & try these in the Console tab:

   > books                  — see the current books array
   > books[0]               — see the first book object
   > books.length           — how many books are stored
   > localStorage           — inspect all stored keys
   > currentFilter          — see the active filter value

   You can also add `debugger;` anywhere in this file to pause
    execution & step through code line-by-line in DevTools.
================================================================ */
