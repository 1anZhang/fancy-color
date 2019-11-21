// import { a } from './utils';

export interface IColor {
  r: number;
  g: number;
  b: number;
}

class fancyColor {
  _r: number;
  _g: number;
  _b: number;
  constructor(color: IColor | string) {
    if (color instanceof Object) {
      this._r = color.r;
      this._g = color.g;
      this._b = color.b;
    } else {
      const decodedColor = this.decodeColorString(color);
      this._r = decodedColor.r;
      this._g = decodedColor.g;
      this._b = decodedColor.b;
    }
  }

  decodeColorString(c: string): IColor {
    let tempR: string = '';
    let tempG: string = '';
    let tempB: string = '';
    const rgbReg: RegExp = /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/;
    if (c.startsWith('#')) {
      if (c.length !== 4 && c.length !== 7) {
        throw new TypeError('unknown color type');
      }
      if (c.length === 4) {
        tempR = c.slice(1, 2).repeat(2);
        tempG = c.slice(2, 3).repeat(2);
        tempB = c.slice(3, 4).repeat(2);
      }
      if (c.length === 7) {
        tempR = c.slice(1, 3);
        tempG = c.slice(3, 5);
        tempB = c.slice(5, 7);
      }
      let colorObj: IColor = {
        r: this.hexToDec(tempR),
        g: this.hexToDec(tempG),
        b: this.hexToDec(tempB),
      };
      return colorObj;
    } else if (rgbReg.test(c)) {
      let colorResult: RegExpExecArray | null = rgbReg.exec(c);
      const colorResult1: string = colorResult ? colorResult[1] : '';
      const colorResult2: string = colorResult ? colorResult[2] : '';
      const colorResult3: string = colorResult ? colorResult[3] : '';
      if (
        0 > parseInt(colorResult1) ||
        parseInt(colorResult1) > 255 ||
        0 > parseInt(colorResult2) ||
        parseInt(colorResult2) > 255 ||
        0 > parseInt(colorResult3) ||
        parseInt(colorResult3) > 255
      ) {
        throw new TypeError('颜色格式错误');
      }
      return {
        r: parseInt(colorResult1),
        g: parseInt(colorResult2),
        b: parseInt(colorResult3),
      };
    } else {
      throw new TypeError('暂不支持的颜色类型');
    }
  }

  hexToDec(c: string): number {
    return parseInt(c, 16);
  }

  decToHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  toHexString(allow3Char: boolean) {
    let r = this.decToHex(this._r);
    let g = this.decToHex(this._g);
    let b = this.decToHex(this._b);
    // if hex color can be convert to 3 char
    if (allow3Char && r[0] === r[1] && g[0] === g[1] && b[0] === b[1]) {
      r = r[0];
      g = g[0];
      b = b[0];
    }
    return `#${r}${g}${b}`;
  }
}

export default fancyColor;
