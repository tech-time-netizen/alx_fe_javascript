let quotes = [];

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

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function removeDuplicates() {
  const seen = new Set();
  quotes = quotes.filter((q) => {
    const id = `${q.text}__${q.category}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// Populate both category dropdowns
function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];

  // For random quote selector
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // For filter dropdown
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last filter
  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter && (lastFilter === "all" || categories.includes(lastFilter))) {
    categoryFilter.value = lastFilter;
  }
}

// Show random quote from selected category
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
}

// Show quotes matching selected filter
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  const filteredQuotesDiv = document.getElementById("filteredQuotes");

  localStorage.setItem("lastCategoryFilter", selected);

  let filtered =
    selected === "all" ? quotes : quotes.filter((q) => q.category === selected);

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

// Add new quote
function createAddQuoteForm(e) {
  e.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    removeDuplicates();
    saveQuotes();
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    populateCategories();
    filterQuotes();
    alert("Quote Added");
  }
}

// Export
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

// Import
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

// Event listeners
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

// Init everything
loadQuotes();
populateCategories();
filterQuotes();
