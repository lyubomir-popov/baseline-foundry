declare module "@lyubomir-popov/baseline-nudge-generator" {
  export interface FontMetrics {
    ascent: number;
    descent: number;
    lineGap: number;
    unitsPerEm: number;
  }

  export function generateFromConfig(configPath: string, outputDir?: string): Promise<unknown>;
  export function readFontMetrics(fontPath: string): Promise<FontMetrics>;

  export class BaselineNudgeGenerator {
    constructor(fontMetrics?: FontMetrics | null);
    calculateNudgeRem(fontSizeRem: number, lineHeightBaselineUnits: number, baselineUnitRem: number): number;
  }
}