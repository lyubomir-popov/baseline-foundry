const tierLabels = {
  editorial: "Editorial",
  documentation: "Documentation",
  app: "App",
  os: "OS"
};

const tier = document.body.dataset.tierReference;
const label = tierLabels[tier] ?? tierLabels.editorial;
const root = document.querySelector("[data-tier-reference-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Tier reference root is missing.");
}

root.innerHTML = `
  <main class="bf-page bf-stack is-section" data-baseline-check="box" data-baseline-label="${label} tier reference" data-overflow-check>
    <header class="bf-stack is-dense">
      <p class="bf-h5" data-baseline-check="flow">Built-in tier reference</p>
      <h1 data-baseline-check="flow">${label}</h1>
      <p data-baseline-check="flow">The shared specimen keeps markup constant so the selected tier alone owns density, typography, controls, and baseline compensation.</p>
    </header>

    <section class="bf-stack is-section-shallow" aria-labelledby="tier-type-title">
      <header class="bf-stack is-dense">
        <h2 id="tier-type-title" data-baseline-check="flow">Typography and content rhythm</h2>
        <p data-baseline-check="flow">Canonical roles and public stack modifiers provide the same composition contract in every built-in tier.</p>
      </header>
      <div class="bf-grid">
        <article class="bf-span-2 bf-card bf-stack is-dense"><h3 class="bf-h5" data-baseline-check="flow">Heading role</h3><p data-baseline-check="flow">Body copy retains its measured nudge and container-owned gap.</p></article>
        <article class="bf-span-2 bf-card bf-stack is-dense"><h3 class="bf-h5" data-baseline-check="flow">Dense group</h3><p data-baseline-check="flow">The active spacing token changes without changing the markup.</p></article>
      </div>
    </section>

    <section class="bf-stack is-section-shallow" aria-labelledby="tier-controls-title">
      <header class="bf-stack is-dense"><h2 id="tier-controls-title" data-baseline-check="flow">Occupied controls</h2><p data-baseline-check="flow">Actions fit the input’s occupied block instead of imposing a second target height.</p></header>
      <label class="bf-form-label" for="tier-reference-search">Search the reference</label>
      <div class="bf-search-box" data-baseline-check="box"><input class="bf-search-box-input bf-input" id="tier-reference-search" type="search" value="${label}"><button class="bf-search-box-reset" type="button">Reset</button><button class="bf-search-box-button" type="button">Search</button></div>
    </section>
  </main>`;

await import("./component-demo.js");
