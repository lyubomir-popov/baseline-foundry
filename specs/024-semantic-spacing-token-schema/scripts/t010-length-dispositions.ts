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

const isZero = (literal: string) =>
  /^[+-]?0+(?:\.0+)?(?:[a-z]+)?$/i.test(literal);

const isPageOrGrid = ({ path, property }: LengthContext) =>
  path.includes("/_work_in_progress/grid/") ||
  path.endsWith("/ApplicationLayout/styles.css") ||
  path.endsWith("/ContentLayout/styles.css") ||
  path.endsWith("/ViewLayout/styles.css") ||
  path === "packages/styles/main/src/grid.css" ||
  /^(?:grid|grid-.+)$/.test(property);

const isTypography = ({ property }: LengthContext) =>
  /font|line-height|letter-spacing|text-(?:decoration|underline)|tab-size|--space-(?:before|after)/.test(
    property,
  );

const isPaint = ({ property }: LengthContext) =>
  /border|outline|shadow|radius|stroke|decoration|caret|clip/.test(property);

const isIntrinsicSize = ({ property }: LengthContext) =>
  /^(?:--.*(?:size|width|height)|(?:min-|max-)?(?:width|height|inline-size|block-size)|flex-basis|background-size|object-position)$/.test(
    property,
  );

const isPositionOrOptical = ({ property }: LengthContext) =>
  /^(?:top|right|bottom|left|inset(?:-.+)?|translate|transform|background-position|vertical-align)$/.test(
    property,
  );

const isMetricFormula = ({ property, value }: LengthContext) =>
  /(?:seat|natural-baseline|target-baseline|nudge|closure|line-floored)/.test(
    `${property} ${value}`,
  ) ||
  (property === "margin-inline-end" &&
    /calc\(\s*-1\s*\*\s*var\(--button-gap\)\s*\)/.test(value));

const isSpacingProperty = ({ property }: LengthContext) =>
  /(?:padding|margin|gap|space|inset)/.test(property);

const axisFor = ({ property }: LengthContext): "block" | "inline" | null => {
  if (/(?:block|vertical|top|bottom)/.test(property)) return "block";
  if (/(?:inline|horizontal|left|right)/.test(property)) return "inline";
  return null;
};

const spacingFamilyFor = ({ property }: LengthContext) => {
  if (/(?:padding|inset)/.test(property)) return ".inset.";
  if (/(?:gap|margin|space)/.test(property)) return ".gap.";
  return null;
};

const packageOwner = (path: string) => {
  const packagePath = path.split("/").slice(0, 3).join("/");
  return `${packagePath} component owner`;
};

export const getT010LengthDisposition = (
  context: LengthContext,
): LengthDisposition => {
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

  if (isZero(context)) {
    return {
      kind: "boundary",
      owner: packageOwner(context.path),
      reason:
        "Typed zero is a neutral edge or calculation guard; it does not create a spacing magnitude.",
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
    if (matchingRoles.length === 1) {
      return {
        kind: "role",
        role: matchingRoles[0],
        owner: "Spec 024 CP1 taxonomy owner",
        reason:
          "The frozen part assignment and this declaration's relationship family/axis identify one candidate role.",
      };
    }
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
        matchingRoles.length > 1
          ? `The current shorthand or shared stylesheet spans multiple candidate roles (${matchingRoles.join(", ")}); decompose it during the component recut.`
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
