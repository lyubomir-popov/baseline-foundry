export interface PasswordRevealInitOptions {
  root?: ParentNode;
  showLabel?: string;
  hideLabel?: string;
}

export interface NotificationDismissInitOptions {
  root?: ParentNode;
}

export interface InteractiveFeedbackInitOptions extends PasswordRevealInitOptions {
  root?: ParentNode;
}

const PASSWORD_REVEAL_SELECTOR = ".bf-password-reveal[aria-controls]";
const PASSWORD_REVEAL_LABEL_SELECTOR = ".bf-password-reveal-label";
const NOTIFICATION_CLOSE_SELECTOR = ".bf-notification-close[aria-controls]";

function closestButton(target: EventTarget | null, selector: string): HTMLButtonElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLButtonElement>(selector);
}

function controlledElement<T extends HTMLElement>(control: HTMLElement, expectedSelector: string): T | null {
  const controlledId = control.getAttribute("aria-controls");
  if (!controlledId) {
    return null;
  }

  const ownerDocument = control.ownerDocument;
  const element = ownerDocument.getElementById(controlledId);
  return element?.matches(expectedSelector) ? element as T : null;
}

function passwordLabel(toggle: HTMLButtonElement, fallback: string, state: "show" | "hide"): string {
  const attribute = state === "show" ? "data-bf-show-label" : "data-bf-hide-label";
  return toggle.getAttribute(attribute)?.trim() || fallback;
}

function syncPasswordReveal(
  toggle: HTMLButtonElement,
  input: HTMLInputElement,
  showLabel: string,
  hideLabel: string
): void {
  const isRevealed = input.type === "text";
  const label = passwordLabel(toggle, isRevealed ? hideLabel : showLabel, isRevealed ? "hide" : "show");
  toggle.setAttribute("aria-pressed", String(isRevealed));

  const visibleLabel = toggle.querySelector<HTMLElement>(PASSWORD_REVEAL_LABEL_SELECTOR);
  if (visibleLabel) {
    visibleLabel.textContent = label;
  }
}

export function initPasswordReveals(options: PasswordRevealInitOptions = {}): () => void {
  const root = options.root ?? document;
  const showLabel = options.showLabel ?? "Show password";
  const hideLabel = options.hideLabel ?? "Hide password";

  for (const toggle of Array.from(root.querySelectorAll<HTMLButtonElement>(PASSWORD_REVEAL_SELECTOR))) {
    const input = controlledElement<HTMLInputElement>(toggle, "input[type='password'], input[type='text']");
    if (input) {
      syncPasswordReveal(toggle, input, showLabel, hideLabel);
    }
  }

  const onClick = (event: Event): void => {
    const toggle = closestButton(event.target, PASSWORD_REVEAL_SELECTOR);
    if (!toggle || !root.contains(toggle)) {
      return;
    }

    const input = controlledElement<HTMLInputElement>(toggle, "input[type='password'], input[type='text']");
    if (!input) {
      return;
    }

    event.preventDefault();
    input.type = input.type === "password" ? "text" : "password";
    syncPasswordReveal(toggle, input, showLabel, hideLabel);
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}

export function initNotificationDismissals(options: NotificationDismissInitOptions = {}): () => void {
  const root = options.root ?? document;

  const onClick = (event: Event): void => {
    const closeButton = closestButton(event.target, NOTIFICATION_CLOSE_SELECTOR);
    if (!closeButton || !root.contains(closeButton)) {
      return;
    }

    const notification = controlledElement<HTMLElement>(closeButton, ".bf-notification");
    if (!notification) {
      return;
    }

    event.preventDefault();
    if (closeButton.ownerDocument.activeElement === closeButton) {
      const visibleNotifications = Array.from(
        root.querySelectorAll<HTMLElement>(".bf-notification:not([hidden])"),
      );
      const notificationIndex = visibleNotifications.indexOf(notification);
      const focusTarget =
        visibleNotifications[notificationIndex + 1] ??
        visibleNotifications[notificationIndex - 1] ??
        notification.parentElement;

      if (focusTarget && focusTarget !== notification) {
        if (!focusTarget.hasAttribute("tabindex")) {
          focusTarget.tabIndex = -1;
          focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
        }
        focusTarget.focus({ preventScroll: true });
      }
    }
    notification.hidden = true;
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}

export function initInteractiveFeedback(options: InteractiveFeedbackInitOptions = {}): () => void {
  const disposePasswordReveals = initPasswordReveals(options);
  const disposeNotificationDismissals = initNotificationDismissals(options);

  return () => {
    disposeNotificationDismissals();
    disposePasswordReveals();
  };
}
