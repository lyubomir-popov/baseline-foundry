type ListTreeCssOptions = {
  bodyTypeStyles: string;
};

export function listTreeCss(options: ListTreeCssOptions): string {
  const { bodyTypeStyles } = options;

  return `:where(.bf-theme) :where(.bf-list-tree) {
  list-style: none;
  margin: 0;
  padding-left: 0;
}

:where(.bf-theme) :where(.bf-list-tree) :where(.bf-list-tree) {
  display: none;
  margin: 0;
  padding-left: 0;
}

:where(.bf-theme) :where(.bf-list-tree) :where(.bf-list-tree[aria-hidden='false']) {
  display: block;
}

:where(.bf-theme) :where(.bf-list-tree-item) {
  margin: 0;
  padding-left: 0;
  position: relative;
}

:where(.bf-theme) :where(a.bf-list-tree-link) {
${bodyTypeStyles}  color: var(--bf-color-text-default);
  cursor: pointer;
  display: block;
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
  padding-block: var(--bf-control-block-padding-compact);
  padding-inline: var(--bf-component-inline-inset-continuation) var(--bf-component-inline-inset-action);
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-list-tree-link:hover) {
  color: var(--bf-color-link-default);
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-list-tree-link.is-active) {
  color: var(--bf-color-link-default);
}

:where(.bf-theme) :where(.bf-list-tree-link):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-list-tree-link):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-list-tree-toggle) {
${bodyTypeStyles}  align-items: center;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: var(--bf-disclosure-gap);
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
  padding-block: var(--bf-control-block-padding-compact);
  padding-inline: 0 calc(var(--bf-baseline) * 0.5);
  text-align: left;
  width: 100%;
}

:where(.bf-theme) :where(.bf-list-tree-toggle):hover {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-list-tree-toggle):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-list-tree-toggle):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-list-tree-toggle)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  flex: 0 0 1rem;
  inline-size: 1rem;
  transform: translateY(var(--bf-disclosure-icon-optical-offset-block)) rotate(-90deg);
}

:where(.bf-theme) :where(.bf-list-tree-toggle[aria-expanded='true'])::before {
  transform: translateY(var(--bf-disclosure-icon-optical-offset-block)) rotate(0deg);
}
`;
}
