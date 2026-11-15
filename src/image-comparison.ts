/** Mount-only initialization and live accessible metadata for image comparisons. */
export interface ImageComparisonMetadata {
  accessibleName?: string;
  firstLabel?: string;
  secondLabel?: string;
}

export interface ImageComparisonOptions extends ImageComparisonMetadata {
  initialValue?: number;
}

export interface ImageComparisonChangeDetail {
  value: number;
  phase: "input" | "change" | "cancel";
  source: "pointer" | "native";
}

export interface ImageComparisonController {
  getValue(): number;
  /** Silent, authoritative update. A changed value interrupts an active gesture. */
  setValue(value: number): void;
  /** Refresh metadata and computed direction after an idle consumer style change. */
  update(metadata: ImageComparisonMetadata): void;
  destroy(): void;
}

interface Gesture {
  id: number;
  start: number;
  x: number;
  y: number;
  moving: boolean;
  vertical: boolean;
}

const controllers = new WeakMap<HTMLElement, ImageComparisonController>();
const positionProperty = "--bf-image-comparison-position";
const pointerClass = "is-pointer-focus";
const normalize = (value: number): number | undefined => typeof value === "number" && Number.isFinite(value)
  ? Math.round(Math.max(0, Math.min(100, value))) : undefined;
const text = (value: unknown): string | undefined => typeof value === "string" && value.trim() ? value.trim() : undefined;

/**
 * Enhance stable comparison slots and a named native 0–100/step-1 range.
 * Invalid structures throw before installing handlers or changing markup.
 * Replace slot contents freely; destroy before replacing the stage or range.
 * Nested image-comparison hosts are outside this minimal composition contract.
 */
export function setupImageComparison(element: HTMLElement, options: ImageComparisonOptions = {}): ImageComparisonController {
  const existing = controllers.get(element);
  if (existing) return existing;
  if (!element?.matches(".bf-image-comparison")) throw new Error("Image comparison requires a .bf-image-comparison host.");
  if (element.querySelector(".bf-image-comparison") || element.parentElement?.closest(".bf-image-comparison")) {
    throw new Error("Nested image comparisons are not supported.");
  }
  const owned = <T extends Element>(selector: string): T[] => Array.from(element.querySelectorAll<T>(selector))
    .filter(candidate => candidate.closest(".bf-image-comparison") === element);
  const stages = owned<HTMLElement>(".bf-image-comparison-stage");
  const ranges = owned<HTMLInputElement>(".bf-image-comparison-value");
  const first = owned<HTMLElement>(".bf-image-comparison-layer.is-first");
  const second = owned<HTMLElement>(".bf-image-comparison-layer.is-second");
  const seams = owned<HTMLElement>(".bf-image-comparison-seam");
  const grips = owned<HTMLElement>(".bf-image-comparison-grip");
  const stage = stages[0], input = ranges[0], seam = seams[0], grip = grips[0];
  if (stages.length !== 1 || ranges.length !== 1 || first.length !== 1 || second.length !== 1 || seams.length !== 1 || grips.length !== 1 ||
      first[0] === second[0] || ![input, first[0], second[0], seam, grip].every(child => stage.contains(child)) ||
      input.tagName !== "INPUT" || input.type !== "range" || input.min !== "0" || input.max !== "100" || input.step !== "1") {
    throw new Error("Image comparison requires one stage, two layers, seam, grip and native range with min=0 max=100 step=1.");
  }
  const doc = element.ownerDocument;
  const win = doc.defaultView;
  if (!win) throw new Error("Image comparison requires a live document.");
  const authorLabelName = (): boolean => Boolean(
    input.getAttribute("aria-labelledby")?.split(/\s+/).some(id => text(doc.getElementById(id)?.textContent)) ||
    Array.from(input.labels ?? []).some(label => text(label.textContent)));
  const nativeName = (): boolean => Boolean(text(input.getAttribute("aria-label")) || authorLabelName());
  if (!nativeName() && !text(options.accessibleName)) throw new Error("Image comparison requires a named native range.");

  const snapshots = {
    position: element.style.getPropertyValue(positionProperty), priority: element.style.getPropertyPriority(positionProperty),
    pointer: element.classList.contains(pointerClass), rtl: element.classList.contains("is-rtl"), value: input.value,
    name: input.getAttribute("aria-label"), valueText: input.getAttribute("aria-valuetext"),
    seamHidden: seam.getAttribute("aria-hidden"), gripHidden: grip.getAttribute("aria-hidden")
  };
  let value = normalize(options.initialValue as number) ?? 50;
  let firstLabel = text(options.firstLabel) ?? "First";
  let secondLabel = text(options.secondLabel) ?? "Second";
  let fallbackName = text(options.accessibleName);
  let runtimeName: string | undefined;
  let destroyed = false;
  let gesture: Gesture | null = null;
  const enabled = (): boolean => !input.matches(":disabled") && !input.closest("[inert]");
  const syncDirection = (): void => { element.classList.toggle("is-rtl", win.getComputedStyle(stage).direction === "rtl"); };
  const render = (): void => {
    syncDirection();
    input.value = String(value);
    element.style.setProperty(positionProperty, `${value}%`);
    input.setAttribute("aria-valuetext", `${value}% ${firstLabel}, ${100 - value}% ${secondLabel}`);
  };
  const apply = (next: number): boolean => {
    const changed = value !== next;
    value = next;
    render();
    return changed;
  };
  const notify = (phase: ImageComparisonChangeDetail["phase"], source: ImageComparisonChangeDetail["source"]): void => {
    element.dispatchEvent(new win.CustomEvent<ImageComparisonChangeDetail>("bf-image-comparison-change", {
      bubbles: true, detail: { value, phase, source }
    }));
  };
  const stopGesture = (): Gesture | null => {
    const previous = gesture;
    if (!previous) return null;
    // Clear ownership before release: a synchronous lost-capture event is inert.
    gesture = null;
    win.removeEventListener("keydown", onEscape);
    if (stage.hasPointerCapture(previous.id)) stage.releasePointerCapture(previous.id);
    return previous;
  };
  const cancel = (): void => {
    const previous = stopGesture();
    if (!previous || destroyed) return;
    apply(previous.start);
    notify("cancel", "pointer");
  };
  const owns = (current: Gesture): boolean => !destroyed && gesture === current;
  const focusPointer = (current: Gesture): boolean => {
    element.classList.add(pointerClass);
    input.focus({ preventScroll: true });
    return owns(current);
  };
  const fromPointer = (event: PointerEvent, current: Gesture): boolean => {
    syncDirection();
    const rect = stage.getBoundingClientRect();
    if (rect.width > 0) {
      const physical = (event.clientX - rect.left) / rect.width;
      const logical = win.getComputedStyle(stage).direction === "rtl" ? 1 - physical : physical;
      if (apply(normalize(logical * 100)!)) notify("input", "pointer");
    }
    // Notification listeners may destroy or authoritatively replace this gesture.
    return owns(current);
  };
  function onEscape(event: KeyboardEvent): void {
    if (event.key === "Escape") cancel();
  }
  const onPointerDown = (event: PointerEvent): void => {
    if (destroyed || gesture || !enabled() || !event.isPrimary || event.button !== 0) return;
    // Content rerenders must not let a newly inserted nested host steal capture.
    if ((event.target as Element | null)?.closest(".bf-image-comparison") !== element) return;
    const current: Gesture = { id: event.pointerId, start: value, x: event.clientX, y: event.clientY, moving: event.pointerType !== "touch", vertical: false };
    gesture = current;
    try { stage.setPointerCapture(current.id); }
    catch { gesture = null; return; }
    win.addEventListener("keydown", onEscape);
    event.preventDefault();
    if (current.moving && focusPointer(current)) fromPointer(event, current);
  };
  const onPointerMove = (event: PointerEvent): void => {
    const current = gesture;
    if (!current || current.id !== event.pointerId) return;
    if (!enabled()) { cancel(); return; }
    if (!current.moving) {
      const dx = Math.abs(event.clientX - current.x), dy = Math.abs(event.clientY - current.y);
      if (current.vertical || (dy > dx && dy > 6)) { current.vertical = true; return; }
      if (dx < 6) return;
      current.moving = true;
      if (!focusPointer(current)) return;
    }
    fromPointer(event, current);
  };
  const onPointerUp = (event: PointerEvent): void => {
    const current = gesture;
    if (!current || current.id !== event.pointerId) return;
    if (!enabled() || !stage.hasPointerCapture(current.id)) { cancel(); return; }
    if (!current.vertical) {
      if (!focusPointer(current) || !fromPointer(event, current)) return;
      stopGesture();
      if (!destroyed) notify("change", "pointer");
    } else stopGesture();
  };
  const onPointerCancel = (event: PointerEvent): void => {
    if (gesture?.id === event.pointerId) cancel();
  };
  const onNative = (event: Event): void => {
    if (destroyed || !enabled()) return;
    stopGesture();
    const changed = apply(normalize(Number(input.value)) ?? value);
    if (event.type === "change" || changed) notify(event.type === "change" ? "change" : "input", "native");
  };
  const onPointerModality = (): void => {
    if (doc.activeElement === input) element.classList.add(pointerClass);
  };
  const onKeyboardModality = (): void => { element.classList.remove(pointerClass); };
  const restoreAttribute = (target: Element, name: string, original: string | null): void => {
    if (original === null) target.removeAttribute(name);
    else target.setAttribute(name, original);
  };
  const update = (metadata: ImageComparisonMetadata): void => {
    if (destroyed) return;
    firstLabel = text(metadata.firstLabel) ?? firstLabel;
    secondLabel = text(metadata.secondLabel) ?? secondLabel;
    const suppliedName = text(metadata.accessibleName);
    fallbackName = suppliedName ?? fallbackName;
    // A label association alone may be empty or broken. Preserve nonempty
    // author labels, withdrawing only our own fallback when one gains a name.
    // Retain the configured fallback across update({}) for empty-label recovery.
    const currentName = input.getAttribute("aria-label");
    if (authorLabelName()) {
      if (runtimeName !== undefined && currentName === runtimeName) restoreAttribute(input, "aria-label", snapshots.name);
      runtimeName = undefined;
    } else if (fallbackName && (suppliedName || !text(currentName) || currentName === runtimeName)) {
      input.setAttribute("aria-label", fallbackName);
      runtimeName = fallbackName;
    }
    render();
  };
  const controller: ImageComparisonController = {
    getValue: () => value,
    setValue(next) {
      if (destroyed) return;
      const normalized = normalize(next);
      if (normalized === undefined || normalized === value) return;
      stopGesture();
      apply(normalized);
    },
    update,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopGesture();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerCancel);
      stage.removeEventListener("lostpointercapture", onPointerCancel);
      input.removeEventListener("input", onNative);
      input.removeEventListener("change", onNative);
      input.removeEventListener("blur", onKeyboardModality);
      element.removeEventListener("keydown", onKeyboardModality, true);
      element.removeEventListener("pointerdown", onPointerModality, true);
      element.classList.toggle(pointerClass, snapshots.pointer);
      element.classList.toggle("is-rtl", snapshots.rtl);
      if (snapshots.position) element.style.setProperty(positionProperty, snapshots.position, snapshots.priority);
      else element.style.removeProperty(positionProperty);
      input.value = snapshots.value;
      restoreAttribute(input, "aria-label", snapshots.name);
      restoreAttribute(input, "aria-valuetext", snapshots.valueText);
      restoreAttribute(seam, "aria-hidden", snapshots.seamHidden);
      restoreAttribute(grip, "aria-hidden", snapshots.gripHidden);
      controllers.delete(element);
    }
  };
  seam.setAttribute("aria-hidden", "true");
  grip.setAttribute("aria-hidden", "true");
  update(options);
  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerCancel);
  stage.addEventListener("lostpointercapture", onPointerCancel);
  input.addEventListener("input", onNative);
  input.addEventListener("change", onNative);
  input.addEventListener("blur", onKeyboardModality);
  element.addEventListener("keydown", onKeyboardModality, true);
  element.addEventListener("pointerdown", onPointerModality, true);
  controllers.set(element, controller);
  return controller;
}
