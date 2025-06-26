import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  argbFromHex,
  DynamicScheme,
  Hct,
  Variant,
} from "../../utils/material-color-utilities/typescript/index";
import variants from "./variant";
import { genCSS } from "./generator";
import "./styles.css";

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
  setSourceColor: (sourceColor: number) => void;
  setVariant: (variant: Variant) => void;
  setContrast: (contrast: number) => void;
  changeTheme: (options: { CsourceColor?: number; Cvariant?: Variant; Ccontrast?: number }) => void;
}

type ThemeContextType = ThemeState & ThemeActions;

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [sourceColor, setSourceColor] = useState<number>(argbFromHex("#D0BCFF"));
  const [variant, setVariant] = useState<Variant>(Variant.TONAL_SPOT);
  const [contrast, setContrast] = useState<number>(0);

  const schemes = useMemo(() => schemesGen(sourceColor, contrast), [sourceColor, contrast]);

  const styles = useMemo(() => {
    if (schemes[variant]) {
      return genCSS(schemes[variant].light, schemes[variant].dark);
    }
    return "";
  }, [schemes, variant]);

  const changeTheme = useCallback(
    ({
      CsourceColor,
      Cvariant,
      Ccontrast,
    }: {
      CsourceColor?: number;
      Cvariant?: Variant;
      Ccontrast?: number;
    }) => {
      setSourceColor((prev) => CsourceColor ?? prev);
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

  return (
    <ThemeContext.Provider value={contextValue}>
      <style dangerouslySetInnerHTML={{ __html: `@layer theme { ${styles} }` }} />
      {children}
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
