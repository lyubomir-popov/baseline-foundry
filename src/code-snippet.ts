export interface CodeSnippetInitOptions {
  root?: ParentNode;
  copiedLabel?: string;
  copiedDurationMs?: number;
}

const COPY_SELECTOR = ".vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet-block.is-icon";

function getCopyBlock(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLElement>(COPY_SELECTOR);
}

async function copySnippetText(copyBlock: HTMLElement): Promise<boolean> {
  const text = copyBlock.textContent?.trim() ?? "";
  if (!text) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy command path.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "-9999px";
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

function markCopied(copyBlock: HTMLElement, copiedLabel: string, copiedDurationMs: number): void {
  const originalTitle = copyBlock.getAttribute("title");
  const existingTimer = Number.parseInt(copyBlock.dataset.bfCopiedTimer ?? "", 10);
  if (Number.isFinite(existingTimer)) {
    window.clearTimeout(existingTimer);
  }

  copyBlock.classList.add("is-copied");
  copyBlock.setAttribute("title", copiedLabel);

  const timer = window.setTimeout(() => {
    copyBlock.classList.remove("is-copied");
    if (originalTitle) {
      copyBlock.setAttribute("title", originalTitle);
    } else {
      copyBlock.removeAttribute("title");
    }
    delete copyBlock.dataset.bfCopiedTimer;
  }, copiedDurationMs);

  copyBlock.dataset.bfCopiedTimer = String(timer);
}

export function initCodeSnippets(options: CodeSnippetInitOptions = {}): () => void {
  const root = options.root ?? document;
  const copiedLabel = options.copiedLabel ?? "Copied";
  const copiedDurationMs = options.copiedDurationMs ?? 2000;

  const handleCopy = async (event: Event): Promise<void> => {
    const copyBlock = getCopyBlock(event.target);
    if (!copyBlock) {
      return;
    }

    const copied = await copySnippetText(copyBlock);
    if (copied) {
      markCopied(copyBlock, copiedLabel, copiedDurationMs);
    }
  };

  const onClick = (event: Event): void => {
    void handleCopy(event);
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const copyBlock = getCopyBlock(event.target);
    if (!copyBlock) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void handleCopy(event);
    }
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
  };
}
