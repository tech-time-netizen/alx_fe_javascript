let quotes = [];
let selectedCategory = "all";

// Load from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
    removeDuplicates();
  } else {
    quotes = [
      { text: "Believe in yourself.", category: "Motivation" },
      {
        text: "Life is short. Smile while you still have teeth.",
        category: "Humor",
      },
      { text: "Success is not for the lazy.", category: "Motivation" },
      {
        text: "The only way to do great work is to love what you do.",
        category: "Inspiration",
      },
      {
        text: "Life is what happens when you're busy making other plans.",
        category: "Life",
      },
      {
        text: "Do not watch the clock. Do what it does. Keep going.",
        category: "Motivation",
      },
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Remove duplicates based on text + category
function removeDuplicates() {
  const seen = new Set();
  quotes = quotes.filter((q) => {
    const id = `${q.text}__${q.category}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// Populate category dropdowns
function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];

  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const last = localStorage.getItem("lastCategoryFilter");
  if (last && (last === "all" || categories.includes(last))) {
    categoryFilter.value = last;
    selectedCategory = last;
  }
}

// Show a random quote based on selected category
function showRandomQuote() {
  const selected = document.getElementById("categorySelect").value;
  const filtered = quotes.filter((q) => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes in this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").textContent = `"${quote.text}"`;
  sessionStorage.setItem("lastQuote", quote.text);
}

// Filter quotes in list view
function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  const filteredQuotesDiv = document.getElementById("filteredQuotes");
  let filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  filteredQuotesDiv.innerHTML = "";

  if (filtered.length === 0) {
    filteredQuotesDiv.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach((q) => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" (${q.category})`;
    filteredQuotesDiv.appendChild(p);
  });
}

// Add a new quote
function createAddQuoteForm(e) {
  e.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    removeDuplicates();
    saveQuotes();
    sendQuoteToServer(newQuote); //POST to mock server
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    populateCategories();
    filterQuotes();
    alert("Quote Added");
  }
}

// Export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        removeDuplicates();
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Failed to import JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ---- SYNC WITH SERVER ----

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));

    resolveConflicts(serverQuotes);
  } catch (err) {
    console.error("Failed to sync with server:", err);
  }
}

function resolveConflicts(serverQuotes) {
  let added = 0;
  const localSet = new Set(quotes.map((q) => `${q.text}__${q.category}`));

  serverQuotes.forEach((sq) => {
    const id = `${sq.text}__${sq.category}`;
    if (!localSet.has(id)) {
      quotes.push(sq);
      added++;
    }
  });

  if (added > 0) {
    removeDuplicates();
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert(`${added} new quote(s) synced from server.`);
  }
}

//POST new quote to mock API
function sendQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quote),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Quote sent to server (simulated):", data);
    })
    .catch((err) => {
      console.error("Failed to send quote to server:", err);
    });
}

// --- Event Listeners ---
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document
  .getElementById("quoteForm")
  .addEventListener("submit", createAddQuoteForm);
document
  .getElementById("exportBtn")
  .addEventListener("click", exportToJsonFile);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
document
  .getElementById("categoryFilter")
  .addEventListener("change", filterQuotes);

// --- Initialize ---
loadQuotes();
populateCategories();
filterQuotes();
setInterval(fetchQuotesFromServer, 15000); // fetch every 15s
