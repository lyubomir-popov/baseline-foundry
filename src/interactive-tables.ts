export type TableSortDirection = "none" | "ascending" | "descending";

export interface TableSortContext {
  columnIndex: number;
  direction: Exclude<TableSortDirection, "none">;
  table: HTMLTableElement;
}

export type TableSortCompare = (valueA: string, valueB: string, context: TableSortContext) => number;

export interface SortableTableInitOptions {
  root?: ParentNode;
  compare?: TableSortCompare;
  locale?: string | string[];
}

export interface ExpandingTableInitOptions {
  root?: ParentNode;
  expandedLabel?: string;
  collapsedLabel?: string;
}

export interface MobileCardTableInitOptions {
  root?: ParentNode;
}

export interface InteractiveTablesInitOptions extends SortableTableInitOptions {
  expandedLabel?: string;
  collapsedLabel?: string;
}

const SORT_BUTTON_SELECTOR = ".bf-table.is-sortable th[aria-sort] > .bf-table-sort-button";
const EXPAND_BUTTON_SELECTOR = ".bf-table.is-expanding .bf-table-expand-toggle[aria-controls]";
const MOBILE_CARD_TABLE_SELECTOR = ".bf-table.is-mobile-card";
const SORT_DIRECTIONS: readonly TableSortDirection[] = ["none", "ascending", "descending"];

function closestButton(target: EventTarget | null, selector: string): HTMLButtonElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLButtonElement>(selector);
}

function nextSortDirection(value: string | null): TableSortDirection {
  const currentIndex = SORT_DIRECTIONS.indexOf(value as TableSortDirection);
  return SORT_DIRECTIONS[(currentIndex + 1 + SORT_DIRECTIONS.length) % SORT_DIRECTIONS.length];
}

function sortableHeader(button: HTMLButtonElement): HTMLTableCellElement | null {
  const header = button.closest<HTMLTableCellElement>("th[aria-sort]");
  return header?.closest("table")?.classList.contains("is-sortable") ? header : null;
}

function directRows(body: HTMLTableSectionElement): HTMLTableRowElement[] {
  return Array.from(body.children).filter((child): child is HTMLTableRowElement => child instanceof HTMLTableRowElement);
}

function defaultCompare(locale?: string | string[]): TableSortCompare {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
  return (valueA, valueB) => collator.compare(valueA, valueB);
}

function cellValue(row: HTMLTableRowElement, columnIndex: number): string {
  const cell = row.cells.item(columnIndex);
  if (!cell) {
    return "";
  }

  return Array.from(cell.childNodes)
    .filter(node => !(node instanceof Element && node.classList.contains("bf-table-card-label")))
    .map(node => node.textContent ?? "")
    .join(" ")
    .trim();
}

export function initSortableTables(options: SortableTableInitOptions = {}): () => void {
  const root = options.root ?? document;
  const compare = options.compare ?? defaultCompare(options.locale);
  const originalOrder = new WeakMap<HTMLTableSectionElement, HTMLTableRowElement[]>();

  for (const table of Array.from(root.querySelectorAll<HTMLTableElement>(".bf-table.is-sortable"))) {
    for (const body of Array.from(table.tBodies)) {
      originalOrder.set(body, directRows(body));
    }
  }

  const onClick = (event: Event): void => {
    const button = closestButton(event.target, SORT_BUTTON_SELECTOR);
    if (!button || !root.contains(button)) {
      return;
    }

    const header = sortableHeader(button);
    const table = header?.closest<HTMLTableElement>("table.bf-table.is-sortable");
    if (!header || !table) {
      return;
    }

    const columnIndex = header.cellIndex;
    const direction = nextSortDirection(header.getAttribute("aria-sort"));
    for (const sortable of Array.from(table.querySelectorAll<HTMLTableCellElement>("th[aria-sort]"))) {
      sortable.setAttribute("aria-sort", "none");
    }
    header.setAttribute("aria-sort", direction);

    for (const body of Array.from(table.tBodies)) {
      const initialRows = originalOrder.get(body) ?? directRows(body);
      originalOrder.set(body, initialRows);
      const initialIndex = new Map(initialRows.map((row, index) => [row, index]));
      const rows = direction === "none" ? [...initialRows] : directRows(body).map((row, index) => ({ row, index }));

      if (direction !== "none") {
        const context: TableSortContext = { columnIndex, direction, table };
        const multiplier = direction === "ascending" ? 1 : -1;
        rows.sort((entryA, entryB) => {
          if (!("row" in entryA) || !("row" in entryB)) {
            return 0;
          }
          const result = compare(cellValue(entryA.row, columnIndex), cellValue(entryB.row, columnIndex), context);
          return result === 0 ? entryA.index - entryB.index : result * multiplier;
        });
      }

      for (const entry of rows) {
        const row = entry instanceof HTMLTableRowElement ? entry : entry.row;
        body.append(row);
      }

      if (direction === "none") {
        for (const row of directRows(body)) {
          if (!initialIndex.has(row)) {
            body.append(row);
          }
        }
      }
    }
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}

function controlledExpansionRow(button: HTMLButtonElement): HTMLTableRowElement | null {
  const id = button.getAttribute("aria-controls");
  const table = button.closest<HTMLTableElement>("table.bf-table.is-expanding");
  if (!id || !table) {
    return null;
  }

  const row = button.ownerDocument.getElementById(id);
  return row instanceof HTMLTableRowElement && row.classList.contains("bf-table-expanding-row") && row.closest("table") === table
    ? row
    : null;
}

function expansionLabel(button: HTMLButtonElement): HTMLElement | null {
  return button.querySelector<HTMLElement>(".bf-table-expand-toggle-label");
}

function syncExpansion(
  button: HTMLButtonElement,
  row: HTMLTableRowElement,
  expanded: boolean,
  defaultExpandedLabel: string,
  defaultCollapsedLabel: string
): void {
  button.setAttribute("aria-expanded", String(expanded));
  row.hidden = !expanded;
  row.setAttribute("aria-hidden", String(!expanded));

  const label = expansionLabel(button);
  if (label) {
    label.textContent = expanded
      ? button.getAttribute("data-bf-expanded-label")?.trim() || defaultExpandedLabel
      : button.getAttribute("data-bf-collapsed-label")?.trim() || defaultCollapsedLabel;
  }
}

export function initExpandingTables(options: ExpandingTableInitOptions = {}): () => void {
  const root = options.root ?? document;
  const expandedLabel = options.expandedLabel ?? "Hide details";
  const collapsedLabel = options.collapsedLabel ?? "Show details";

  for (const button of Array.from(root.querySelectorAll<HTMLButtonElement>(EXPAND_BUTTON_SELECTOR))) {
    const row = controlledExpansionRow(button);
    if (row) {
      syncExpansion(button, row, button.getAttribute("aria-expanded") === "true", expandedLabel, collapsedLabel);
    }
  }

  const onClick = (event: Event): void => {
    const button = closestButton(event.target, EXPAND_BUTTON_SELECTOR);
    if (!button || !root.contains(button)) {
      return;
    }

    const row = controlledExpansionRow(button);
    if (!row) {
      return;
    }

    event.preventDefault();
    syncExpansion(button, row, button.getAttribute("aria-expanded") !== "true", expandedLabel, collapsedLabel);
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}

export function initMobileCardTables(options: MobileCardTableInitOptions = {}): () => void {
  const root = options.root ?? document;
  const generatedLabels: HTMLElement[] = [];

  for (const table of Array.from(root.querySelectorAll<HTMLTableElement>(MOBILE_CARD_TABLE_SELECTOR))) {
    const headingRow = table.tHead?.rows.item(table.tHead.rows.length - 1);
    if (!headingRow) {
      continue;
    }

    const headings = Array.from(headingRow.cells, heading => heading.textContent?.trim() ?? "");
    for (const body of Array.from(table.tBodies)) {
      for (const row of directRows(body)) {
        for (const cell of Array.from(row.cells)) {
          let label = cell.querySelector<HTMLElement>(":scope > .bf-table-card-label");
          if (!label) {
            label = cell.ownerDocument.createElement("span");
            label.className = "bf-table-card-label";
            label.setAttribute("aria-hidden", "true");
            cell.prepend(label);
            generatedLabels.push(label);
          }
          label.textContent = headings[cell.cellIndex] ?? "";
        }
      }
    }
  }

  return () => {
    for (const label of generatedLabels) {
      label.remove();
    }
  };
}

export function initInteractiveTables(options: InteractiveTablesInitOptions = {}): () => void {
  const disposeSorting = initSortableTables(options);
  const disposeExpanding = initExpandingTables(options);
  const disposeMobileCards = initMobileCardTables(options);

  return () => {
    disposeMobileCards();
    disposeExpanding();
    disposeSorting();
  };
}
