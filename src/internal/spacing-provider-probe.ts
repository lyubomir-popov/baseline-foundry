const spacingProviderProbeOption = Symbol("BF spacing provider probe");

interface SpacingProviderProbeRequest {
  spacingArtifactPath: string;
}

export function createSpacingProviderProbeOption(spacingArtifactPath: string): Record<PropertyKey, unknown> {
  return {
    [spacingProviderProbeOption]: { spacingArtifactPath } satisfies SpacingProviderProbeRequest
  };
}

export function readSpacingProviderProbeOption(options: object): SpacingProviderProbeRequest | undefined {
  const request = (options as Record<PropertyKey, unknown>)[spacingProviderProbeOption];
  if (!request || typeof request !== "object" || !("spacingArtifactPath" in request) || typeof request.spacingArtifactPath !== "string") {
    return undefined;
  }
  return request as SpacingProviderProbeRequest;
}
