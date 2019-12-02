import { decodeColorString, decNumberToHexString, hslToRgb, rgbToHsl } from './utils';

export interface IColor {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  h?: number;
  s?: number;
  l?: number;
}
export interface IRgbColor {
  r: number;
  g: number;
  b: number;
}

export interface IRgbaColor extends IRgbColor {
  a: number;
}

export interface IHslColor {
  h: number;
  s: number;
  l: number;
}

export interface IHslaColor extends IHslColor {
  a: number;
}

class Color {
  private _r: number = 0;
  private _g: number = 0;
  private _b: number = 0;
  private _a: number = 1;

  constructor(color: IColor | string) {
    if (color instanceof Color) {
      return color;
    }
    if (typeof color === 'string') {
      const decodedColor = decodeColorString(color);
      this._r = decodedColor.r;
      this._g = decodedColor.g;
      this._b = decodedColor.b;
      this._a = decodedColor.a;
    }
    if (typeof color === 'object') {
      if (color.r && color.g && color.b) {
        this._r = color.r;
        this._g = color.g;
        this._b = color.b;
      }

      if (color.h && color.s && color.l) {
        const hsl: IHslColor = {
          h: color.h,
          s: color.s,
          l: color.l
        }
        const rgb = hslToRgb(hsl);
        this._r = rgb.r;
        this._g = rgb.g;
        this._b = rgb.b;
      }

      if (color.a) {
        this._a = color.a;
      }
    }
  }

  toHexString(allow3Char = false) {
    let r = decNumberToHexString(this._r);
    let g = decNumberToHexString(this._g);
    let b = decNumberToHexString(this._b);
    // if hex color can be convert to 3 char
    const canCompress = r[0] === r[1] && g[0] === g[1] && b[0] === b[1];
    if (allow3Char && canCompress) {
      r = r[0];
      g = g[0];
      b = b[0];
    }
    return `#${r}${g}${b}`;
  }

  toRgbString() {
    return `rgb(${this._r}, ${this._g}, ${this._b}`;
  }

  toRgbaString() {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
  }

  toHslString(precision = 0) {
    const rgb: IRgbColor = {
      r: this._r,
      g: this._g,
      b: this._b
    }
    const hsl = rgbToHsl(rgb, precision);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  toHslaString(precision = 0) {
    const rgb: IRgbColor = {
      r: this._r,
      g: this._g,
      b: this._b
    }
    const hsl = rgbToHsl(rgb, precision);
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${this._a})`;
  }
}

export default Color;
