export const FOCUS_RETURN_ATTRIBUTE = "data-bf-focus-return";

function getElementByIdWithinRoot(root: ParentNode, id: string): HTMLElement | null {
  if (root instanceof HTMLElement && root.id === id) {
    return root;
  }

  return Array.from(root.querySelectorAll<HTMLElement>("[id]")).find(element => element.id === id) ?? null;
}

export function resolveFocusReturnTarget(trigger: HTMLElement, root: ParentNode): HTMLElement {
  const targetId = trigger.getAttribute(FOCUS_RETURN_ATTRIBUTE)?.trim();
  if (!targetId) {
    return trigger;
  }

  return getElementByIdWithinRoot(root, targetId) ?? trigger;
}

export function resolveFocusReturnOverride(control: HTMLElement, root: ParentNode): HTMLElement | null {
  const targetId = control.getAttribute(FOCUS_RETURN_ATTRIBUTE)?.trim();
  if (!targetId) {
    return null;
  }

  return getElementByIdWithinRoot(root, targetId);
}
