import { decodeColorString, decNumberToHexString } from './utils';

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
  private _r: number;
  private _g: number;
  private _b: number;
  private _a: number;

  constructor(color: IRgbColor | IRgbaColor | string) {
    if (color instanceof Color) {
      return color;
    }
    if (color instanceof Object) {
      this._r = color.r;
      this._g = color.g;
      this._b = color.b;
      // this._a = color.a || 1;
    } else {
      const decodedColor = decodeColorString(color);
      this._r = decodedColor.r;
      this._g = decodedColor.g;
      this._b = decodedColor.b;
      // this._a = decodedColor.a || 1;
    }
  }

  toHexString(allow3Char = false) {
    let r = decNumberToHexString(this._r);
    let g = decNumberToHexString(this._g);
    let b = decNumberToHexString(this._b);
    // if hex color can be convert to 3 char
    if (allow3Char && r[0] === r[1] && g[0] === g[1] && b[0] === b[1]) {
      r = r[0];
      g = g[0];
      b = b[0];
    }
    return `#${r}${g}${b}`;
  }

  toRgbaString() {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a}`;
  }
}

export default Color;
