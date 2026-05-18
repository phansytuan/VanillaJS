# 📚 BookShelf — Vanilla JS Learning Project

A beginner-friendly book tracker app that teaches **core JavaScript fundamentals** through real, working code. No frameworks. No build tools. Just HTML, CSS, and JavaScript.

---

## 🗂 Folder Structure

```
js-book-tracker/
├── index.html   ← Page structure & content
├── style.css    ← All visual styling
├── app.js       ← All JavaScript logic (heavily commented)
└── README.md    ← This file
```

---

## 🚀 How to Run

**Option A — Double-click** `index.html` to open it in your browser.

**Option B — Live Server** (recommended):
1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Right-click `index.html` → *Open with Live Server*

---

## 📖 What Each File Teaches

### `app.js` — JavaScript Concepts (read top to bottom)

| Section | Concept | What you'll see |
|---|---|---|
| Lines 40–55 | **Variables & Data Types** | `const`, `let`, strings, numbers |
| Lines 60–85 | **Objects & Arrays** | Book object structure, books array |
| Lines 90–130 | **Functions** | Regular & arrow functions |
| Lines 140–185 | **DOM Manipulation** | `getElementById`, `innerHTML`, `classList` |
| Lines 190–240 | **Events** | `addEventListener`, click, keydown |
| Lines 265–295 | **Conditionals** | `if/else`, ternary `? :` |
| Lines 300–355 | **Loops** | `forEach`, `filter`, `findIndex` |
| Lines 360–400 | **Local Storage** | `setItem`, `getItem`, `JSON.stringify` |
| Lines 405–460 | **Async/Await & Fetch** | `fetch()`, `await`, `try/catch` |

---

## 🛠 App Features

- ✅ Add books with title, author, pages, status, star rating & notes
- 📋 Filter by: All / Reading / Finished / Wishlist
- ⭐ Interactive star rating picker
- 🗑 Delete books
- 💾 Data saved automatically (survives page refresh!)
- ✨ Fetch real reading quotes from a public API
- 🖥 Live "Concept Log" panel showing JS concepts firing in real-time

---

## 🔍 Debugging Exercises

Open DevTools (`F12`) → Console tab and try:

```js
books              // see the array of book objects
books[0]           // inspect the first book
books.length       // count books
currentFilter      // see active filter
localStorage       // inspect all stored data
```

Try adding `debugger;` anywhere in `app.js` to pause JS execution and step through code line by line!

---

## 🎯 Challenges to Try Next

1. **Add a "Currently reading" progress bar** — add a `pagesRead` field
2. **Sort books** by date added, title, or rating (hint: `array.sort()`)
3. **Edit a book** — clicking a card opens the form pre-filled
4. **Search bar** — filter by typing a title or author
5. **Export to JSON** — let users download their book list

---

## 🧠 Key JS Concepts Cheatsheet

```js
// Variables
const name = "Alice";       // can't reassign
let count = 0;              // can reassign

// Object
const book = { title: "Dune", author: "Herbert" };

// Array
const books = [book1, book2];
books.push(newBook);               // add
books.filter(b => b.status === "done");  // filter
books.find(b => b.id === "123");   // find one

// DOM
const el = document.getElementById("myId");
el.textContent = "Hello!";
el.classList.add("active");

// Events
btn.addEventListener("click", () => { /* ... */ });

// Async / Fetch
async function getData() {
  const res  = await fetch("https://api.example.com/data");
  const data = await res.json();
  console.log(data);
}

// localStorage
localStorage.setItem("key", JSON.stringify(myArray));
const saved = JSON.parse(localStorage.getItem("key"));
```
