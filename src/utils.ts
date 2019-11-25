import { IRgbColor, IHslColor, IRgbaColor, IHslaColor } from './color';

const rgbReg: RegExp = /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/;
const rgbaReg: RegExp = /^rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*,\s*(0?\.\d+)\s*\)$/;
const hslReg: RegExp = /^hsl\(\s*(\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\s*\)$/;
const hslaReg: RegExp = /^hsla\(\s*(\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\s*,\s*(0?\.\d+)\s*\)$/;
const hex3Reg: RegExp = /^#[a-fA-F0-9]{3}$/;
const hex6Reg: RegExp = /^#[a-fA-F0-9]{6}$/;

function decodeColorString(c: string): IRgbColor {
  let tempRgbColor: IRgbColor = {
    r: 0,
    g: 0,
    b: 0
  };
  let tempRgbaColor: IRgbaColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
  if (hex3Reg.test(c)) {
    tempRgbColor.r = hexStringToDecNumber(c.slice(1, 2).repeat(2));
    tempRgbColor.g = hexStringToDecNumber(c.slice(2, 3).repeat(2));
    tempRgbColor.b = hexStringToDecNumber(c.slice(3, 4).repeat(2));
    const isRightColor = checkRgbColor(tempRgbColor);
    if (isRightColor) {
      return tempRgbColor;
    } else {
      throw new TypeError(`无法识别的hex颜色: ${c}, 请输入正确的颜色`);
    }
  } else if (hex6Reg.test(c)) {
    tempRgbColor.r = hexStringToDecNumber(c.slice(1, 3));
    tempRgbColor.g = hexStringToDecNumber(c.slice(3, 5));
    tempRgbColor.b = hexStringToDecNumber(c.slice(5, 7));
    const isRightColor = checkRgbColor(tempRgbColor);
    if (isRightColor) {
      return tempRgbColor;
    } else {
      throw new TypeError(`无法识别的hex颜色: ${c}, 请输入正确的颜色`);
    }
  } else if (rgbReg.test(c)) {
    let colorResult: RegExpExecArray | null = rgbReg.exec(c);
    tempRgbColor.r = colorResult ? parseInt(colorResult[1]) : -1;
    tempRgbColor.g = colorResult ? parseInt(colorResult[2]) : -1;
    tempRgbColor.b = colorResult ? parseInt(colorResult[3]) : -1;
    const isRightColor = checkRgbColor(tempRgbColor);
    if (isRightColor) {
      return tempRgbColor;
    } else {
      throw new TypeError(`无法识别的rgb颜色: ${c}, 请输入正确的颜色`);
    }
  } else if (rgbaReg.test(c)) {
    let colorResult: RegExpExecArray | null = rgbaReg.exec(c);
    tempRgbaColor.r = colorResult ? parseInt(colorResult[1]) : -1;
    tempRgbaColor.g = colorResult ? parseInt(colorResult[2]) : -1;
    tempRgbaColor.b = colorResult ? parseInt(colorResult[3]) : -1;
    tempRgbaColor.a = colorResult ? parseFloat(colorResult[4]) : -1;
    const isRightColor = checkRgbaColor(tempRgbaColor);
    if (isRightColor) {
      return tempRgbaColor;
    } else {
      throw new TypeError(`无法识别的rgba颜色: ${c}, 请输入正确的颜色`);
    }
  } else if (hslReg.test(c)) {
    let colorResult: RegExpExecArray | null = hslReg.exec(c);
    let hslColor: IHslColor = {
      h:colorResult ? parseInt(colorResult[1]) : -1,
      s:colorResult ? parseInt(colorResult[2]) : -1,
      l:colorResult ? parseInt(colorResult[3]) : -1,
    }
    const isRightColor = checkHslColor(hslColor);
    if (isRightColor) {
      tempRgbColor = hslToRgb(hslColor);
      return tempRgbColor;
    } else {
      throw new TypeError(`无法识别的hsl颜色: ${c}, 请输入正确的颜色`);
    }
  } else if (hslaReg.test(c)) {
    let colorResult: RegExpExecArray | null = hslaReg.exec(c);
    let hslaColor: IHslaColor = {
      h:colorResult ? parseInt(colorResult[1]) : -1,
      s:colorResult ? parseInt(colorResult[2]) : -1,
      l:colorResult ? parseInt(colorResult[3]) : -1,
      a:colorResult ? parseFloat(colorResult[4]) : -1
    }
    const isRightColor = checkHslaColor(hslaColor);
    if (isRightColor) {
      tempRgbaColor = {...hslToRgb(hslaColor), a: hslaColor.a};
      return tempRgbaColor;
    } else {
      throw new TypeError(`无法识别的rgb颜色: ${c}, 请输入正确的颜色`);
    }
  } else {
    throw new TypeError(`暂不支持的颜色类型: ${c}`);
  }
}

function checkRgbColor(color: IRgbColor): boolean {
  return isRightColorRange(color.r) && isRightColorRange(color.g) && isRightColorRange(color.b);
}

function checkRgbaColor(color: IRgbaColor): boolean {
  return isRightColorRange(color.r) && isRightColorRange(color.g) && isRightColorRange(color.b) && isRightAlphaRange(color.a);
}

function checkHslColor(color: IHslColor): boolean {
  return isRighthHueRange(color.h) && isRightPercentRange(color.s) && isRightPercentRange(color.l);
}

function checkHslaColor(color: IHslaColor): boolean {
  return isRighthHueRange(color.h) && isRightPercentRange(color.s) && isRightPercentRange(color.l) && isRightAlphaRange(color.a);
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

function hslToRgb(color: IHslColor): IRgbColor {
  // todo hsl color convert to rgb color
  color = color;
  return {
    r: 1,
    g: 1,
    b: 1
  };
}


export { decodeColorString, hexStringToDecNumber, decNumberToHexString };
