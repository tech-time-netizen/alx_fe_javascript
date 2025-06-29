let quotes = [
    {
        text: "Believe in yourself.",
        category: "Motivation"
    },
  {
        text: "Life is short. Smile while you still have teeth.",
        category: "Humor",
  },
    {
        text: "Success is not for the lazy.",
        category: "Motivation"
    },
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

// List unique categories on the dropdown
function updateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const categorySelect = document.getElementById("categorySelect");
    categorySelect.innerHTML = "";

    categories.forEach(category => {
        const option = document.createElement("option");
        categorySelect.appendChild(option);
        option.value = category;
        option.textContent = category;
    });
}
// updateCategories()


// Show a randon quote
function showRandomQuote() {
    const selected = document.getElementById("categorySelect").value;
    const options = quotes.filter(q => q.category === selected);
    if (options.length === 0) {
        document.getElementById("quoteDisplay").textContent = "No quotes in the category";
        return;
    }
    const quote = options[Math.floor(Math.random() * options.length)];
    document.getElementById("quoteDisplay").textContent = `"${quote.text}";`;

}
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Adding a new quote
function createAddQuoteForm(e) {
    e.preventDefault();
    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (text && category) {
        quotes.push({ text, category });
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategory").value = "";
        updateCategories();
        alert("Quote Added")
    }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("quoteForm").addEventListener("submit", createAddQuoteForm);
updateCategories()