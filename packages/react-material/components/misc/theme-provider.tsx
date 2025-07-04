import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import {
  argbFromHex,
  DynamicScheme,
  Hct,
  sourceColorFromImage,
  Variant,
} from "../../utils/material-color-utilities/typescript/index";
import variants from "./variant";
import { genCSS } from "./generator";
import "./styles.css";
import { SnackbarProvider } from "../informatives/snackbar-context";

export const schemesGen = (sourceColor: number, contrast: number) => {
  const commonArgs = {
    sourceColorHct: Hct.fromInt(sourceColor),
    contrastLevel: contrast,
    specVersion: "2025",
  } as const;
  const result = {} as Record<Variant, { light: DynamicScheme; dark: DynamicScheme }>;
  for (const { id } of variants) {
    result[id] = {
      light: new DynamicScheme({ ...commonArgs, variant: id, isDark: false }),
      dark: new DynamicScheme({ ...commonArgs, variant: id, isDark: true }),
    };
  }
  return result;
};

interface ThemeState {
  sourceColor: number;
  variant: Variant;
  contrast: number;
  schemes: ReturnType<typeof schemesGen>;
  styles: string;
}

interface ThemeActions {
  changeTheme: (options: {
    sourceColor?: number;
    sourceImage?: string;
    variant?: Variant;
    contrast?: number;
  }) => void;
}

type ThemeContextType = ThemeState & ThemeActions;

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<
  React.PropsWithChildren<{
    sourceColor?: number;
    sourceImage?: string;
    variant?: Variant;
    contrast?: number;
    root?: boolean;
    maxSnackbars?: number;
  }>
> = ({
  children,
  sourceColor: initialSourceColor,
  sourceImage: initialSourceImage,
  variant: initialVariant,
  contrast: initialContrast,
  root = false,
  maxSnackbars,
}) => {
  const [sourceColor, setSourceColor] = useState<number>(
    initialSourceColor || argbFromHex("#D0BCFF")
  );
  const [sourceImage, setSourceImage] = useState<string | undefined>(initialSourceImage);
  const [variant, setVariant] = useState<Variant>(initialVariant || Variant.TONAL_SPOT);
  const [contrast, setContrast] = useState<number>(initialContrast || 0);

  const schemes = useMemo(() => schemesGen(sourceColor, contrast), [sourceColor, contrast]);

  const styles = useMemo(() => {
    if (schemes[variant]) {
      return genCSS(schemes[variant].light, schemes[variant].dark);
    }
    return "";
  }, [schemes, variant]);

  useEffect(() => {
    if (sourceImage) {
      const img = new Image();
      img.src = sourceImage;
      img.onload = () => {
        sourceColorFromImage(img).then((color) => {
          if (color) {
            setSourceColor(color);
          }
        });
      };
    }
  }, [sourceImage]);

  const changeTheme = useCallback(
    ({
      sourceColor: CsourceColor,
      sourceImage: CsourceImage,
      variant: Cvariant,
      contrast: Ccontrast,
    }: {
      sourceColor?: number;
      sourceImage?: string;
      variant?: Variant;
      contrast?: number;
    }) => {
      setSourceColor((prev) => CsourceColor ?? prev);
      setSourceImage((prev) => CsourceImage ?? prev);
      setVariant((prev) => Cvariant ?? prev);
      setContrast((prev) => Ccontrast ?? prev);
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      sourceColor,
      variant,
      contrast,
      schemes,
      styles,
      setSourceColor,
      setVariant,
      setContrast,
      changeTheme,
    }),
    [sourceColor, variant, contrast, schemes, styles, changeTheme]
  );

  const content = (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: root
            ? `@layer theme { :root, ::backdrop { ${styles} } }`
            : `@layer theme { .m3-theme-${sourceColor} { ${styles} } }`,
        }}
      />
      <div className={`m3-theme-${sourceColor}`}>{children}</div>
    </>
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {root ? <SnackbarProvider maxSnackbars={maxSnackbars}>{content}</SnackbarProvider> : content}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
