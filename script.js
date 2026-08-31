/*
 * Amazon Recommends — teaching demo
 * -----------------------------------
 * Simulates a simplified content-based recommendation engine:
 *   1. Each product is described by a small set of tags (its "features").
 *   2. When you select a product, every other product is scored by how many
 *      tags it shares with the selected one (Jaccard similarity).
 *   3. The highest-scoring products are shown as recommendations.
 *
 * Real recommendation engines blend this with collaborative filtering
 * (what other customers bought together) and re-rank using your personal
 * browsing and purchase history — see the README for more.
 */

const products = [
  { id: 1, name: 'Wireless Earbuds',        emoji: '🎧', category: 'Electronics', tags: ['electronics', 'audio', 'wireless', 'portable'] },
  { id: 2, name: 'Noise-Cancelling Headphones', emoji: '🎶', category: 'Electronics', tags: ['electronics', 'audio', 'wireless', 'travel'] },
  { id: 3, name: 'Bluetooth Speaker',        emoji: '🔊', category: 'Electronics', tags: ['electronics', 'audio', 'wireless', 'home'] },
  { id: 4, name: 'Desk Lamp',                emoji: '💡', category: 'Home',        tags: ['home', 'electronics', 'office'] },
  { id: 5, name: 'Running Shoes',            emoji: '👟', category: 'Fitness',     tags: ['fitness', 'footwear', 'outdoor'] },
  { id: 6, name: 'Yoga Mat',                 emoji: '🧘', category: 'Fitness',     tags: ['fitness', 'home', 'wellness'] },
  { id: 7, name: 'Steel Water Bottle',       emoji: '🥤', category: 'Fitness',     tags: ['fitness', 'outdoor', 'home'] },
  { id: 8, name: 'Cookbook: 30-Min Meals',   emoji: '📖', category: 'Books',       tags: ['books', 'kitchen', 'home'] },
  { id: 9, name: 'Kitchen Knife Set',        emoji: '🔪', category: 'Kitchen',     tags: ['kitchen', 'home'] },
  { id: 10, name: 'Novel: The Quiet Path',   emoji: '📚', category: 'Books',       tags: ['books', 'fiction', 'wellness'] },
];

const catalogEl = document.getElementById('catalog');
const recsSection = document.getElementById('recsSection');
const recsTitle = document.getElementById('recsTitle');
const recList = document.getElementById('recList');

// Render the full catalog as clickable cards.
function renderCatalog(selectedId) {
  catalogEl.innerHTML = '';
  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card' + (p.id === selectedId ? ' selected' : '');
    card.innerHTML = `
      <div class="product-emoji">${p.emoji}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-cat">${p.category}</div>
      <div class="product-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    `;
    card.addEventListener('click', () => selectProduct(p.id));
    catalogEl.appendChild(card);
  });
}

// Jaccard similarity: shared tags divided by total unique tags across both.
// A simple, interpretable stand-in for the feature-similarity math real
// recommendation engines run at much larger scale.
function similarity(tagsA, tagsB) {
  const setA = new Set(tagsA);
  const setB = new Set(tagsB);
  const intersection = [...setA].filter((t) => setB.has(t));
  const union = new Set([...setA, ...setB]);
  return { score: intersection.length / union.size, shared: intersection };
}

function selectProduct(id) {
  renderCatalog(id);
  const viewed = products.find((p) => p.id === id);

  const scored = products
    .filter((p) => p.id !== id)
    .map((p) => ({ product: p, ...similarity(viewed.tags, p.tags) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  recsTitle.textContent = `Because you viewed "${viewed.name}"`;
  recList.innerHTML = '';
  scored.forEach(({ product, score, shared }) => {
    const pct = Math.round(score * 100);
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      <div class="rec-emoji">${product.emoji}</div>
      <div class="rec-name">${product.name}</div>
      <div class="rec-meter"><div class="rec-meter-fill" style="width:${pct}%"></div></div>
      <div class="rec-score">${pct}% match</div>
      <div class="rec-tags">${shared.map(t => `<span class="tag">${t}</span>`).join('') || '<span class="tag">no overlap</span>'}</div>
    `;
    recList.appendChild(card);
  });

  recsSection.style.display = 'block';
  recsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

renderCatalog(null);
