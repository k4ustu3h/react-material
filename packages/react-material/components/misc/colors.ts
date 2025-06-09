import {
  MaterialDynamicColors
} from "../../utils/material-color-utilities/index";

export const materialColors = new MaterialDynamicColors();

export const colors = [...materialColors.allColors];

export const pairs = [
  [materialColors.primary(), materialColors.onPrimary()],
  [materialColors.primaryContainer(), materialColors.onPrimaryContainer()],
  [materialColors.secondary(), materialColors.onSecondary()],
  [materialColors.secondaryContainer(), materialColors.onSecondaryContainer()],
  [materialColors.tertiary(), materialColors.onTertiary()],
  [materialColors.tertiaryContainer(), materialColors.onTertiaryContainer()],
  [materialColors.background(), materialColors.onBackground()],
  [materialColors.surface(), materialColors.onSurface()],
  [materialColors.inverseSurface(), materialColors.inverseOnSurface()],
  [materialColors.surfaceVariant(), materialColors.onSurfaceVariant()],
  [materialColors.error(), materialColors.onError()],
  [materialColors.errorContainer(), materialColors.onErrorContainer()],
];
