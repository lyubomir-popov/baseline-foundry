export interface AlignmentGridInitOptions {
  root?: ParentNode;
}

const GRID_SELECTOR = ".bf-alignment-grid";
const BUTTON_SELECTOR = ".bf-alignment-grid-button";
const COLUMN_COUNT = 3;

function queryAllWithinRoot<T extends Element>(root: ParentNode, selector: string): T[] {
  const elements = Array.from(root.querySelectorAll<T>(selector));
  if (root instanceof Element && root.matches(selector)) {
    elements.unshift(root as T);
  }
  return elements;
}

function gridButtons(grid: HTMLElement): HTMLButtonElement[] {
  return Array.from(grid.querySelectorAll<HTMLButtonElement>(BUTTON_SELECTOR));
}

function selectButton(grid: HTMLElement, button: HTMLButtonElement): void {
  for (const sibling of grid.querySelectorAll<HTMLButtonElement>(BUTTON_SELECTOR)) {
    const selected = sibling === button;
    sibling.setAttribute("aria-pressed", String(selected));
    sibling.tabIndex = selected ? 0 : -1;
  }
}

function normalizeGrid(grid: HTMLElement): void {
  const buttons = gridButtons(grid);
  const selected = buttons.find(button => button.getAttribute("aria-pressed") === "true") ?? buttons[0];
  if (selected) selectButton(grid, selected);
}

function horizontalStep(grid: HTMLElement, key: string): number {
  const direction = getComputedStyle(grid).direction;
  const forward = direction === "rtl" ? -1 : 1;
  return key === "ArrowRight" ? forward : -forward;
}

export function initAlignmentGrids(options: AlignmentGridInitOptions = {}): () => void {
  const root = options.root ?? document;
  for (const grid of queryAllWithinRoot<HTMLElement>(root, GRID_SELECTOR)) normalizeGrid(grid);

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>(BUTTON_SELECTOR);
    const grid = button?.closest<HTMLElement>(GRID_SELECTOR);
    if (!button || !grid) return;
    selectButton(grid, button);
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>(BUTTON_SELECTOR);
    const grid = button?.closest<HTMLElement>(GRID_SELECTOR);
    if (!button || !grid) return;

    const buttons = gridButtons(grid);
    const index = buttons.indexOf(button);
    if (index < 0 || buttons.length === 0) return;

    let nextIndex = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      nextIndex = (index + horizontalStep(grid, event.key) + buttons.length) % buttons.length;
    } else if (event.key === "ArrowDown") {
      nextIndex = (index + COLUMN_COUNT) % buttons.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - COLUMN_COUNT + buttons.length) % buttons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = buttons.length - 1;
    }

    if (nextIndex < 0) return;
    event.preventDefault();
    const nextButton = buttons[nextIndex];
    selectButton(grid, nextButton);
    nextButton.focus();
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
  };
}
