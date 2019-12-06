import { IRgbColor, IHslColor, IRgbaColor, IHslaColor } from './color';

const rgbReg: RegExp = /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/;
const rgbaReg: RegExp = /^rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*,\s*(0?\.?\d+)\s*\)$/;
const hslReg: RegExp = /^hsl\(\s*(\d{1,3}),\s*(\d{1,3}\.?\d*)%?,\s*(\d{1,3}\.?\d*?)%?\s*\)$/;
const hslaReg: RegExp = /^hsla\(\s*(\d{1,3}),\s*(\d{1,3}\.?\d*?)%?,\s*(\d{1,3}\.?\d*?)%?\s*,\s*(0?\.?\d+)\s*\)$/;
const hex3Reg: RegExp = /^#[a-fA-F0-9]{3}$/;
const hex6Reg: RegExp = /^#[a-fA-F0-9]{6}$/;

function decodeColorString(c: string): IRgbaColor {
  let tempRgbaColor: IRgbaColor = {
    r: -1,
    g: -1,
    b: -1,
    a: 1,
  };
  let tempHslaColor: IHslaColor = {
    h: -1,
    s: -1,
    l: -1,
    a: 1,
  };
  if (hex3Reg.test(c)) {
    tempRgbaColor.r = hexStringToDecNumber(c.slice(1, 2).repeat(2));
    tempRgbaColor.g = hexStringToDecNumber(c.slice(2, 3).repeat(2));
    tempRgbaColor.b = hexStringToDecNumber(c.slice(3, 4).repeat(2));
    return tempRgbaColor;
  } else if (hex6Reg.test(c)) {
    tempRgbaColor.r = hexStringToDecNumber(c.slice(1, 3));
    tempRgbaColor.g = hexStringToDecNumber(c.slice(3, 5));
    tempRgbaColor.b = hexStringToDecNumber(c.slice(5, 7));
    return tempRgbaColor;
  } else if (rgbReg.test(c)) {
    let colorResult: RegExpExecArray | null = rgbReg.exec(c);
    if (colorResult !== null) {
      tempRgbaColor.r = parseInt(colorResult[1]);
      tempRgbaColor.g = parseInt(colorResult[2]);
      tempRgbaColor.b = parseInt(colorResult[3]);
    }
    const isRightColor = checkRgbColor(tempRgbaColor);
    if (isRightColor) {
      return tempRgbaColor;
    } else {
      throw new Error(`rgb() color input error: ${c}, please check the input`);
    }
  } else if (rgbaReg.test(c)) {
    let colorResult: RegExpExecArray | null = rgbaReg.exec(c);
    if (colorResult !== null) {
      tempRgbaColor.r = parseInt(colorResult[1]);
      tempRgbaColor.g = parseInt(colorResult[2]);
      tempRgbaColor.b = parseInt(colorResult[3]);
      tempRgbaColor.a = parseFloat(colorResult[4]);
    }
    const isRightColor = checkRgbaColor(tempRgbaColor);
    if (isRightColor) {
      return tempRgbaColor;
    } else {
      throw new Error(`rgba() color input error: ${c}, please check the input`);
    }
  } else if (hslReg.test(c)) {
    let colorResult: RegExpExecArray | null = hslReg.exec(c);
    if (colorResult !== null) {
      tempHslaColor = {
        h: parseInt(colorResult[1]),
        s: parseFloat(colorResult[2]),
        l: parseFloat(colorResult[3]),
        a: 1,
      };
    }
    const isRightColor = checkHslColor(tempHslaColor);
    if (isRightColor) {
      tempRgbaColor = { ...hslToRgb(tempHslaColor), a: tempHslaColor.a };
      return tempRgbaColor;
    } else {
      throw new Error(`hsl() color input error: ${c}, please check the input`);
    }
  } else if (hslaReg.test(c)) {
    let colorResult: RegExpExecArray | null = hslaReg.exec(c);
    if (colorResult !== null) {
      tempHslaColor = {
        h: parseInt(colorResult[1]),
        s: parseFloat(colorResult[2]),
        l: parseFloat(colorResult[3]),
        a: parseFloat(colorResult[4]),
      };
    }
    const isRightColor = checkHslaColor(tempHslaColor);
    if (isRightColor) {
      tempRgbaColor = { ...hslToRgb(tempHslaColor), a: tempHslaColor.a };
      return tempRgbaColor;
    } else {
      throw new Error(`hsla() color input error: ${c}, please check the input`);
    }
  } else {
    throw new Error(`unsupported color type: ${c}`);
  }
}

function checkRgbColor(color: IRgbColor): boolean {
  return isRightColorRange(color.r) && isRightColorRange(color.g) && isRightColorRange(color.b);
}

function checkRgbaColor(color: IRgbaColor): boolean {
  return (
    isRightColorRange(color.r) && isRightColorRange(color.g) && isRightColorRange(color.b) && isRightAlphaRange(color.a)
  );
}

function checkHslColor(color: IHslColor): boolean {
  return isRighthHueRange(color.h) && isRightPercentRange(color.s) && isRightPercentRange(color.l);
}

function checkHslaColor(color: IHslaColor): boolean {
  return (
    isRighthHueRange(color.h) &&
    isRightPercentRange(color.s) &&
    isRightPercentRange(color.l) &&
    isRightAlphaRange(color.a)
  );
}

function isRightColorRange(n: number): boolean {
  return n >= 0 && n <= 255;
}

function isRightAlphaRange(n: number): boolean {
  return n >= 0 && n <= 1;
}

function isRighthHueRange(n: number): boolean {
  return n >= 0 && n <= 360;
}

function isRightPercentRange(n: number): boolean {
  return n >= 0 && n <= 100;
}

function hexStringToDecNumber(c: string): number {
  return parseInt(c, 16);
}

function decNumberToHexString(n: number): string {
  const hex = n.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(color: IHslColor): IRgbColor {
  let { h, s, l } = color;
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Number((r * 255).toFixed(0)),
    g: Number((g * 255).toFixed(0)),
    b: Number((b * 255).toFixed(0)),
  };
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function rgbToHsl(color: IRgbColor, precision = 0): IHslColor {
  const r: number = color.r / 255;
  const g: number = color.g / 255;
  const b: number = color.b / 255;
  const max: number = Math.max(r, g, b);
  const min: number = Math.min(r, g, b);
  const average: number = (max + min) / 2;
  let h: number = 0,
    s: number = 0,
    l: number = average;
  if (max === min) {
    h = s = 0;
  } else {
    const d: number = max - min;
    s = l > 0.5 ? d / (2 - 2 * average) : d / (2 * average);
    switch (max) {
      case r:
        h = ((g - b) / d) * 60 + (g < b ? 360 : 0);
        break;
      case g:
        h = ((b - r) / d) * 60 + 120;
        break;
      case b:
        h = ((r - g) / d) * 60 + 240;
        break;
      default:
    }
  }
  h = Math.round(h);
  s = Number((s * 100).toFixed(precision));
  l = Number((l * 100).toFixed(precision));

  return { h, s, l };
}

function isNotNull(p: any): boolean {
  return p != null;
}

export {
  decodeColorString,
  hexStringToDecNumber,
  decNumberToHexString,
  hslToRgb,
  rgbToHsl,
  checkRgbColor,
  checkHslColor,
  isNotNull,
};
