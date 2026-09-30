import { BaselineNudgeGenerator, type FontMetrics } from "@lyubomir-popov/baseline-nudge-generator";
import type { BodyLineRhythmRole, TypographyToken } from "./types.js";

export const BODY_LINE_RHYTHM_ROLES = ["body", "h1", "h2", "h3", "h4", "h5", "h6"] as const;

export type BodyLineRhythmRoleInput = Pick<TypographyToken, "fontSize" | "lineHeight" | "fontFamily" | "nudgeTop">;

export interface BodyLineRhythmResult {
  roles: Record<string, BodyLineRhythmRole>;
  failures: string[];
}

const GRID_EPSILON = 1e-9;
const REM_TOLERANCE = 0.00001;
const MAX_DRIFT_REM = 0.0625;

function parseRem(value: string): number {
  return Number.parseFloat(value.replace("rem", ""));
}

function roundRem(value: number): number {
  return Math.round(value * 100000) / 100000;
}

function toRem(value: number): string {
  return `${roundRem(value)}rem`;
}

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step - GRID_EPSILON) * step;
}

function distanceFromStep(value: number, step: number): number {
  return Math.abs(value - Math.round(value / step) * step);
}

/** Spec 026 phase inset and body-line closure per in-scope role, measured from the grid line the nudge targets. */
export function computeBodyLineRhythm(
  metricsByFamily: Record<string, FontMetrics>,
  baselineUnit: number,
  roles: Record<string, BodyLineRhythmRoleInput>
): BodyLineRhythmResult {
  const records: Record<string, BodyLineRhythmRole> = {};
  const failures: string[] = [];
  const body = roles.body;

  if (!body) {
    return { roles: records, failures: ['A "body" role is required for the rhythm step.'] };
  }

  const step = parseRem(body.lineHeight);
  if (distanceFromStep(step / baselineUnit, 1) > GRID_EPSILON) {
    failures.push(`Rhythm step ${body.lineHeight} is not a whole multiple of the ${baselineUnit}rem baseline unit.`);
  }

  for (const roleName of BODY_LINE_RHYTHM_ROLES) {
    const token = roles[roleName];
    if (!token) continue;

    const family = token.fontFamily ?? "sans";
    const metrics = metricsByFamily[family];
    if (!metrics) {
      failures.push(`${roleName}: no build-time font metrics for family "${family}".`);
      continue;
    }

    const fontSize = parseRem(token.fontSize);
    const lineHeight = parseRem(token.lineHeight);
    const nudge = parseRem(token.nudgeTop);
    const scale = fontSize / metrics.unitsPerEm;
    const contentArea = (metrics.ascent + Math.abs(metrics.descent) + metrics.lineGap) * scale;
    const baseline = (lineHeight - contentArea) / 2 + metrics.ascent * scale + (metrics.lineGap * scale) / 2;
    const generatorNudge = new BaselineNudgeGenerator(metrics).calculateNudgeRem(fontSize, lineHeight / baselineUnit, baselineUnit);
    // The generator seats the nudge on ceil(b / bU); rounding b + nudge could pick the line below when drift exceeds bU / 2.
    const firstBaseline = roundUp(baseline, baselineUnit);
    const phase = roundRem(roundUp(firstBaseline, step) - firstBaseline);
    const occupied = nudge + phase + lineHeight;
    const closure = roundRem(roundUp(occupied, step) - occupied);

    const checks: Array<[boolean, string]> = [
      [Math.abs(generatorNudge - nudge) <= REM_TOLERANCE, `recomputed generator nudge ${generatorNudge}rem differs from nudgeTop ${token.nudgeTop}`],
      [Math.abs(baseline + nudge - firstBaseline) < MAX_DRIFT_REM, `nudged baseline ${roundRem(baseline + nudge)}rem is not within ${MAX_DRIFT_REM}rem of grid line ${firstBaseline}rem`],
      [phase >= 0 && phase < step, `phase ${phase}rem is outside [0, ${step}rem)`],
      [closure >= 0 && closure < step, `closure ${closure}rem is outside [0, ${step}rem)`],
      [distanceFromStep(firstBaseline + phase, step) <= REM_TOLERANCE, `first baseline plus phase is off the ${step}rem step`],
      [distanceFromStep(occupied + closure, step) <= REM_TOLERANCE, `occupied block plus closure is off the ${step}rem step`]
    ];
    const failed = checks.filter(([passed]) => !passed).map(([, message]) => `${roleName}: ${message}.`);

    if (failed.length) {
      failures.push(...failed);
      continue;
    }

    records[roleName] = {
      rhythmStep: toRem(step),
      firstBaseline: toRem(firstBaseline),
      phaseStart: toRem(phase),
      closureEnd: toRem(closure)
    };
  }

  return { roles: records, failures };
}
