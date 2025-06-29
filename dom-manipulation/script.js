// Array to store all quotes
let quotes = [];

/**
 * Loads quotes from localStorage if available.
 * If not, initializes with default quotes and saves them.
 */
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    // If quotes exist in localStorage, parse and use them
    quotes = JSON.parse(stored);
  } else {
    // Default quotes if none are stored
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
    saveQuotes(); // Save default quotes to localStorage
  }
}

/**
 * Saves the current quotes array to localStorage.
 */
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/**
 * Updates the category dropdown with unique categories from the quotes array.
 * Ensures no duplicate categories are shown.
 */
function updateCategories() {
  // Get unique categories using Set
  const categories = [...new Set(quotes.map((q) => q.category))];
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = ""; // Clear existing options

  // Add each unique category as an option in the dropdown
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

/**
 * Displays a random quote from the selected category.
 * If no quotes exist in the category, shows a message.
 * Also saves the last viewed quote in sessionStorage.
 */
function showRandomQuote() {
  const selected = document.getElementById("categorySelect").value;
  // Filter quotes by selected category
  const options = quotes.filter((q) => q.category === selected);
  if (options.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes in this category.";
    return;
  }
  // Pick a random quote from the filtered list
  const quote = options[Math.floor(Math.random() * options.length)];
  document.getElementById("quoteDisplay").textContent = `"${quote.text}"`;

  // Save last viewed quote in sessionStorage (optional)
  sessionStorage.setItem("lastQuote", quote.text);
}

/**
 * Handles the form submission for adding a new quote.
 * Adds the quote to the array, saves it, updates categories, and clears the form.
 */
function createAddQuoteForm(e) {
  e.preventDefault(); // Prevent form from submitting normally
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category }); // Add new quote
    saveQuotes(); // Save to localStorage
    document.getElementById("quoteText").value = ""; // Clear input
    document.getElementById("quoteCategory").value = ""; // Clear input
    updateCategories(); // Update dropdown
    alert("Quote Added"); // Notify user
  }
}

/**
 * Exports the current quotes array to a downloadable JSON file.
 */
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // Pretty print JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url); // Clean up
}


//  Imports quotes from a selected JSON file
// Merges imported quotes with existing ones and updates everything
// Alerts me or the suer if the file is invalid or import fails.

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes); // Add imported quotes
        saveQuotes(); // Save to localStorage
        updateCategories(); // Update dropdown
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format."); // Not an array
      }
    } catch (err) {
      alert("Failed to import JSON file."); // JSON parsing error
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Now all my event listeners

// Show a random quote when "newQuote" button is clicked
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Handle form submission for adding a new quote
document
  .getElementById("quoteForm")
  .addEventListener("submit", createAddQuoteForm);

// Export quotes when "exportBtn" is clicked
document
  .getElementById("exportBtn")
  .addEventListener("click", exportToJsonFile);

// Import quotes when a file is selected in "importFile" input
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);

//Initialize on page load 

loadQuotes(); // Load quotes finally
