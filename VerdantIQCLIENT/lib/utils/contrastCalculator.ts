/**
 * WCAG Contrast Ratio and Color Parsing Engine
 * Implements WCAG 2.1 relative luminance and contrast ratio algorithms.
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ContrastEvaluation {
  ratio: number;
  ratioFormatted: string;
  passesAA_Normal: boolean; // >= 4.5
  passesAA_Large: boolean;  // >= 3.0
  passesAAA_Normal: boolean; // >= 7.0
  passesAAA_Large: boolean;  // >= 4.5
  passesUI_Boundary: boolean; // >= 3.0 (WCAG 1.4.11)
  wcagLevel: 'AAA' | 'AA' | 'Fail';
}

/**
 * Parses HEX, RGB, RGBA, and HSL color strings into RGBA.
 */
export function parseColor(colorStr: string): RGBA | null {
  if (!colorStr || typeof colorStr !== 'string') return null;
  const str = colorStr.trim().toLowerCase();

  // Named CSS colors common in Tailwind/tokens
  const namedColors: Record<string, RGBA> = {
    white: { r: 255, g: 255, b: 255, a: 1 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    transparent: { r: 0, g: 0, b: 0, a: 0 },
  };
  if (namedColors[str]) return namedColors[str];

  // Hex (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 4) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16) / 255,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    }
  }

  // rgb(r, g, b) or rgba(r, g, b, a) or modern rgb(r g b / a)
  const rgbMatch = str.match(/rgba?\s*\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  return null;
}

/**
 * Composites a semi-transparent foreground color onto an opaque background color.
 */
export function compositeColor(fg: RGBA, bg: RGBA): RGBA {
  const alpha = fg.a;
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
    a: 1,
  };
}

/**
 * Converts an 8-bit sRGB channel (0-255) to relative linear luminance channel.
 * Implements WCAG 2.1 algorithm:
 * if c <= 0.04045 then c / 12.92 else ((c + 0.055) / 1.055) ^ 2.4
 */
export function sRGBtoLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculates WCAG relative luminance: L = 0.2126R + 0.7152G + 0.0722B
 */
export function getRelativeLuminance(rgba: RGBA): number {
  const r = sRGBtoLinear(rgba.r);
  const g = sRGBtoLinear(rgba.g);
  const b = sRGBtoLinear(rgba.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG contrast ratio between two colors:
 * Contrast = (Lighter + 0.05) / (Darker + 0.05)
 */
export function calculateContrastRatio(foreground: string | RGBA, background: string | RGBA): number {
  let fg = typeof foreground === 'string' ? parseColor(foreground) : foreground;
  let bg = typeof background === 'string' ? parseColor(background) : background;

  if (!fg || !bg) return 1;

  // Composite semi-transparent foreground over opaque background
  if (fg.a < 1) {
    fg = compositeColor(fg, bg);
  }

  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Evaluates contrast ratio against WCAG AA and AAA thresholds.
 */
export function evaluateContrast(fgColor: string | RGBA, bgColor: string | RGBA): ContrastEvaluation {
  const ratio = calculateContrastRatio(fgColor, bgColor);
  const passesAA_Normal = ratio >= 4.5;
  const passesAA_Large = ratio >= 3.0;
  const passesAAA_Normal = ratio >= 7.0;
  const passesAAA_Large = ratio >= 4.5;
  const passesUI_Boundary = ratio >= 3.0;

  let wcagLevel: 'AAA' | 'AA' | 'Fail' = 'Fail';
  if (passesAAA_Normal) wcagLevel = 'AAA';
  else if (passesAA_Normal) wcagLevel = 'AA';

  return {
    ratio,
    ratioFormatted: `${ratio.toFixed(2)}:1`,
    passesAA_Normal,
    passesAA_Large,
    passesAAA_Normal,
    passesAAA_Large,
    passesUI_Boundary,
    wcagLevel,
  };
}
