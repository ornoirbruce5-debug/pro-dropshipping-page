/* main.js
  - Dark mode toggle
  - Render products with animation
  - Daily Joke spinner (Kirundi), non-repeating via localStorage
  - Progressive enhancements, no backend
*/

(function(){
  // Dark Mode
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'broskie_theme';
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') document.body.classList.add('dark');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Render Products
  const productGrid = document.getElementById('productGrid');

  function stockClass(stock) {
    if (stock <= 0) return 'stock-out';
    if (stock <= 3) return 'stock-low';
    return 'stock-ok';
  }

  function renderProducts(items = window.PRODUCTS || []) {
    productGrid.innerHTML = '';
    items.forEach((p, idx) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.style.animationDelay = `${idx * 80}ms`;
      el.innerHTML = `
        <img class="card__img" src="${p.image}" alt="${p.name}" />
        <div class="card__body">
          <h3 class="card__title">${p.name}</h3>
          <div class="card__meta">
            <span class="price">${p.price}</span>
            <span class="${stockClass(p.stock)}">Stock: ${p.stock}</span>
            <span>Category: ${p.category}</span>
          </div>
          <p>${p.description}</p>
        </div>
      `;
      productGrid.appendChild(el);
    });
  }

  // Jokes non-repeating
  const JOKES_KEY = 'broskie_jokes_used';
  const jokeText = document.getElementById('jokeText');
  const newJokeBtn = document.getElementById('newJokeBtn');
  const resetJokesBtn = document.getElementById('resetJokesBtn');

  function getUsedSet() {
    try {
      const arr = JSON.parse(localStorage.getItem(JOKES_KEY) || '[]');
      return new Set(arr);
    } catch { return new Set(); }
  }
  function saveUsedSet(set) {
    localStorage.setItem(JOKES_KEY, JSON.stringify(Array.from(set)));
  }
  function getNextJoke() {
    const all = window.JOKES_KIR || [];
    const used = getUsedSet();
    const remaining = all.filter((_, idx) => !used.has(idx));
    if (remaining.length === 0) {
      jokeText.textContent = "Ibinobe vyose birangiye! Kanda 'Subira ku ntangiriro' kugira utangure bushasha.";
      return null;
    }
    const choiceIndex = Math.floor(Math.random() * remaining.length);
    const joke = remaining[choiceIndex];
    // Map index back to original
    const originalIndex = all.indexOf(joke);
    used.add(originalIndex);
    saveUsedSet(used);
    return joke;
  }

  newJokeBtn.addEventListener('click', () => {
    const joke = getNextJoke();
    if (joke) jokeText.textContent = joke;
  });

  resetJokesBtn.addEventListener('click', () => {
    localStorage.removeItem(JOKES_KEY);
    jokeText.textContent = "Subiriye ku ntangiriro. Fyonda 'Hindura' kugira ubone ikinobe gishasha.";
  });

  // Init
  renderProducts();
})();
