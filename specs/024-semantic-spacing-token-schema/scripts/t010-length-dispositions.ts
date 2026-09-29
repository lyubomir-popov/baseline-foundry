export type LengthDisposition =
  | {
      kind: "role";
      role: string;
      owner: "Spec 024 CP1 taxonomy owner";
      reason: string;
    }
  | {
      kind: "boundary" | "exception";
      owner: string;
      reason: string;
    };

export type LengthContext = {
  path: string;
  property: string;
  value: string;
  literal: string;
  syntaxKind:
    | "length"
    | "percentage"
    | "flex-fraction"
    | "unitless-zero"
    | "derived-multiplier";
  selector: string | null;
  candidateRoles: readonly string[];
  boundaries: readonly string[];
};

export type AliasUseDisposition =
  | {
      kind: "role";
      roles: readonly string[];
      owner: "Spec 024 CP1 taxonomy owner";
      reason: string;
    }
  | {
      kind: "boundary" | "exception";
      owner: string;
      reason: string;
    };

export type AliasUseContext = Omit<LengthContext, "literal" | "syntaxKind"> & {
  reference: string;
};

const isZero = (literal: string) =>
  /^[+-]?0+(?:\.0+)?(?:[a-z]+)?$/i.test(literal);

const isNegative = (literal: string) => /^-/.test(literal.trim());

const isPageOrGrid = ({
  path,
  property,
}: Pick<LengthContext, "path" | "property">) =>
  path.includes("/_work_in_progress/grid/") ||
  path.endsWith("/ApplicationLayout/styles.css") ||
  path.endsWith("/ContentLayout/styles.css") ||
  path.endsWith("/ViewLayout/styles.css") ||
  path === "packages/styles/main/src/grid.css" ||
  /^(?:grid|grid-.+)$/.test(property);

const isTypography = ({ property }: Pick<LengthContext, "property">) =>
  /font|line-height|letter-spacing|text-(?:decoration|underline)|tab-size|--space-(?:before|after)/.test(
    property,
  );

const isPaint = ({ property }: Pick<LengthContext, "property">) =>
  /border|outline|shadow|radius|stroke|decoration|caret|clip/.test(property);

const isIntrinsicSize = ({ property }: Pick<LengthContext, "property">) =>
  /^(?:--.*(?:size|width|height)|(?:min-|max-)?(?:width|height|inline-size|block-size)|flex-basis|background-size|object-position)$/.test(
    property,
  );

const isPositionOrOptical = ({ property }: Pick<LengthContext, "property">) =>
  /^(?:top|right|bottom|left|inset(?:-.+)?|translate|transform|background-position|vertical-align)$/.test(
    property,
  );

const isMetricFormula = ({
  property,
  value,
}: Pick<LengthContext, "property" | "value">) =>
  /(?:seat|natural-baseline|target-baseline|nudge|closure|line-floored)/.test(
    `${property} ${value}`,
  ) ||
  (property === "margin-inline-end" &&
    /calc\(\s*-1\s*\*\s*var\(--button-gap\)\s*\)/.test(value));

const isSpacingProperty = ({ property }: Pick<LengthContext, "property">) =>
  /(?:padding|margin|gap|space|inset)/.test(property);

const axisFor = ({
  property,
}: Pick<LengthContext, "property">): "block" | "inline" | null => {
  if (/(?:block|vertical|top|bottom)/.test(property)) return "block";
  if (/(?:inline|horizontal|left|right)/.test(property)) return "inline";
  return null;
};

const spacingFamilyFor = ({ property }: Pick<LengthContext, "property">) => {
  if (/(?:padding|inset)/.test(property)) return ".inset.";
  if (/(?:gap|margin|space)/.test(property)) return ".gap.";
  return null;
};

const packageOwner = (path: string) => {
  const packagePath = path.split("/").slice(0, 3).join("/");
  return `${packagePath} component owner`;
};

const colorInputPath =
  "packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css";

export const getT010AliasUseDisposition = (
  context: AliasUseContext,
): AliasUseDisposition | null => {
  const { path, property, reference, selector } = context;
  if (path === colorInputPath) {
    if (
      property === "margin-block-start" &&
      reference === "--form-group-gap" &&
      selector?.includes("> .color-popover")
    ) {
      return {
        kind: "role",
        roles: ["spacing.gap.element.block"],
        owner: "Spec 024 CP1 taxonomy owner",
        reason:
          "The alias separates the trigger and its popover as adjacent elements on the block axis.",
      };
    }
    if (
      property === "gap" &&
      reference === "--form-field-inline-gap" &&
      selector?.endsWith("> .color-popover")
    ) {
      return {
        kind: "role",
        roles: ["spacing.gap.element.block"],
        owner: "Spec 024 CP1 taxonomy owner",
        reason:
          "The popover is a column flex container, so its generic gap separates children on the block axis.",
      };
    }
    if (
      property === "gap" &&
      reference === "--form-group-gap" &&
      selector?.includes("> .swatch-grid")
    ) {
      return {
        kind: "role",
        roles: ["spacing.gap.element.block", "spacing.gap.element.inline"],
        owner: "Spec 024 CP1 taxonomy owner",
        reason:
          "The grid gap applies between peer swatches on both axes; both memberships are explicit rather than inferred from the property name.",
      };
    }
    if (
      property === "gap" &&
      reference === "--form-field-inline-gap" &&
      selector?.includes(".color-trigger")
    ) {
      return {
        kind: "role",
        roles: ["spacing.gap.mark.inline"],
        owner: "Spec 024 CP1 taxonomy owner",
        reason:
          "The trigger gap separates the colour preview mark from its copy.",
      };
    }
    if (
      property === "gap" &&
      reference === "--form-field-inline-gap" &&
      selector?.includes(".inline > .hex-input-row")
    ) {
      return {
        kind: "role",
        roles: ["spacing.gap.element.inline"],
        owner: "Spec 024 CP1 taxonomy owner",
        reason:
          "The inline row separates the prefix and editable value as peer elements.",
      };
    }
    if (isSpacingProperty(context)) {
      return {
        kind: "exception",
        owner: "@canonical/react-ds-global-form ColorInput owner",
        reason:
          "This ColorInput alias use is not interchangeable with its legacy alias name; the component recut must assign its exact box edge, including the one-sided separator-border case.",
      };
    }
  }

  if (isPageOrGrid(context)) {
    return {
      kind: "boundary",
      owner: "Spec 020b page/grid owner",
      reason:
        "The alias participates in page, application-shell or grid geometry outside the component taxonomy.",
    };
  }
  if (
    isTypography(context) ||
    isPaint(context) ||
    isIntrinsicSize(context) ||
    isPositionOrOptical(context) ||
    isMetricFormula(context)
  ) {
    return {
      kind: "boundary",
      owner: packageOwner(path),
      reason:
        "The alias use is typography, paint, intrinsic size, positioning or metric geometry rather than semantic component whitespace.",
    };
  }
  if (isSpacingProperty(context)) {
    return {
      kind: "exception",
      owner: "Spec 024 CP1 taxonomy owner",
      reason:
        "A legacy alias name and frozen-row membership do not prove the declaration's relationship; this use needs an explicit selector/property assignment during recut.",
    };
  }
  return {
    kind: "boundary",
    owner: packageOwner(path),
    reason:
      "The alias does not feed a spacing property and remains with its component or foundation owner.",
  };
};

export const getT010LengthDisposition = (
  context: LengthContext,
): LengthDisposition | null => {
  if (context.property.startsWith("@")) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Responsive or capability-query threshold; it is not component whitespace.",
    };
  }

  if (isPageOrGrid(context)) {
    return {
      kind: "boundary",
      owner: "Spec 020b page/grid owner",
      reason:
        "Page, application-shell or grid geometry is outside the Spec 024 component taxonomy.",
    };
  }

  if (isTypography(context)) {
    return {
      kind: "boundary",
      owner: "Pragma typography owner",
      reason:
        "Type size, leading, tracking or text decoration is metric/typography geometry, not semantic component spacing.",
    };
  }

  if (isPaint(context)) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Stroke, outline, radius, shadow or other painted geometry remains component-owned.",
    };
  }

  if (isIntrinsicSize(context)) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Intrinsic component, artwork or hit-target size is a fit contract rather than whitespace between or inside roles.",
    };
  }

  if (isPositionOrOptical(context)) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Positioning or optical offset does not participate in the semantic spacing taxonomy.",
    };
  }

  if (isMetricFormula(context)) {
    return {
      kind: "exception",
      owner: "Spec 024 metric-authority decision",
      reason:
        "Baseline seating, phase, closure and rounding constants remain metric-owned pending the CP1/CP2 authority decision.",
    };
  }

  if (context.syntaxKind === "flex-fraction") {
    return {
      kind: "boundary",
      owner: isPageOrGrid(context)
        ? "Spec 020b page/grid owner"
        : packageOwner(context.path),
      reason:
        "A flex fraction is track allocation, not a CSS length or semantic whitespace magnitude.",
    };
  }

  if (context.syntaxKind === "percentage") {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Percentage geometry or paint remains relative to its containing box and is not a DTCG dimension role.",
    };
  }

  if (isZero(context.literal)) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Typed zero is a neutral edge or calculation guard; it does not create a spacing magnitude.",
    };
  }

  if (isNegative(context.literal)) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Negative geometry is an offset, overlap or optical compensation, not a positive semantic spacing magnitude.",
    };
  }

  if (isSpacingProperty(context)) {
    const family = spacingFamilyFor(context);
    const axis = axisFor(context);
    const matchingRoles = [
      ...new Set(
        context.candidateRoles.filter(
          (role) =>
            (!family || role.includes(family)) &&
            (!axis || role.endsWith(`.${axis}`)),
        ),
      ),
    ];
    if (!matchingRoles.length && context.boundaries.length) {
      return {
        kind: "boundary",
        owner: packageOwner(context.path),
        reason: `The frozen part records an explicit boundary: ${context.boundaries.join(" ")}`,
      };
    }
    return {
      kind: "exception",
      owner: "Spec 024 CP1 taxonomy owner",
      reason:
        matchingRoles.length
          ? `Candidate membership alone is not role evidence (${matchingRoles.join(", ")}); classify the declaration through an explicit selector/property alias-chain record or decompose it during the component recut.`
          : "The legacy whitespace has no axis-correct candidate membership; CP1 must select a reviewed magnitude, add an earned role, or affirm a component-owned boundary.",
    };
  }

  return {
    kind: "boundary",
    owner: packageOwner(context.path),
    reason:
      "The length serves component-specific layout or artwork geometry outside padding, margin and gap relationships.",
  };
};
