export function gridCss(): string {
  const spanRule = (span: number, indent = ""): string =>
    `${indent}:where(.bf-theme, .vr-theme) :where(.bf-grid) > :where(.bf-span-${span}) { grid-column: auto / span ${span}; }`;

  const legacySpanRule = (span: number, indent = ""): string =>
    `${indent}:where(.bf-theme, .vr-theme) :where(.vr-grid-row) > :where(.vr-col-${span}) { grid-column: auto / span ${span}; }`;

  const baseSpans = [1, 2, 4].map(span => spanRule(span)).join("\n");
  const mediumSpans = [1, 2, 4, 8].map(span => spanRule(span, "  ")).join("\n");
  const largeSpans = [1, 2, 4, 8, 16].map(span => spanRule(span, "  ")).join("\n");
  const legacyBaseSpans = [1, 2, 3, 4].map(span => legacySpanRule(span)).join("\n");
  const legacyMediumSpans = [1, 2, 3, 4, 5, 6, 7, 8].map(span => legacySpanRule(span, "  ")).join("\n");
  const legacyLargeSpans = [1, 2, 3, 4, 5, 6, 7, 8].map(span => legacySpanRule(span, "  ")).join("\n");

  return `:where(.bf-theme, .vr-theme) {
  --bf-grid-gap-inline: 1rem;
  --bf-grid-gap-block: 1rem;
  --bf-page-margin: 1rem;
}

@media (width >= 38.75rem) {
  :where(.bf-theme, .vr-theme) {
    --bf-grid-gap-inline: 1.5rem;
    --bf-grid-gap-block: 1.5rem;
    --bf-page-margin: 1.5rem;
  }
}

@media (width >= 64.75rem) {
  :where(.bf-theme, .vr-theme) {
    --bf-page-margin: 2rem;
  }
}

:where(.bf-theme, .vr-theme) :where(.bf-page, .bf-grid-scope, .bf-section, .bf-strip, .bf-fixed-width, .u-fixed-width, .p-panel__content, .p-accordion__panel, .l-main, .l-aside) {
  container-type: inline-size;
}

:where(.bf-theme, .vr-theme) :where(.bf-fixed-width, .u-fixed-width) {
  margin-inline: auto;
  max-inline-size: var(--bf-content-max-width);
  padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__content, .p-accordion__panel) :where(.u-fixed-width) {
  padding-inline: 0;
}

:where(.bf-theme, .vr-theme) :where(.bf-grid, .vr-grid-row) {
  --bf-grid-columns: 4;
  display: grid;
  gap: var(--bf-grid-gap-block) var(--bf-grid-gap-inline);
  grid-template-columns: repeat(var(--bf-grid-columns), minmax(0, 1fr));
}

:where(.bf-theme, .vr-theme) :where(.bf-grid, .vr-grid-row) > * {
  grid-column: auto / span var(--bf-grid-columns);
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.bf-span-full) {
  grid-column: 1 / -1 !important;
}

${baseSpans}
${legacyBaseSpans}

@container (width >= 38.75rem) {
  :where(.bf-theme, .vr-theme) :where(.bf-grid, .vr-grid-row) {
    --bf-grid-columns: 8;
  }

${mediumSpans}
${legacyMediumSpans}
}

@container (width >= 105.0625rem) {
  :where(.bf-theme, .vr-theme) :where(.bf-grid, .vr-grid-row) {
    --bf-grid-columns: 16;
  }

${largeSpans}
${legacyLargeSpans}
}
`;
}
