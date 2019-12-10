import {
  decodeColorString,
  decNumberToHexString,
  hslToRgb,
  rgbToHsl,
  rgbToHsv,
  hsvToRgb,
  checkRgbColor,
  checkHslColor,
  checkHsvColor,
  isNotNull,
  randomRgb,
  rounded,
} from './utils';

export interface IColor {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  h?: number;
  s?: number;
  l?: number;
  v?: number;
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

export interface IHsvColor {
  h: number;
  s: number;
  v: number;
}

class Color {
  private _r: number = 0;
  private _g: number = 0;
  private _b: number = 0;
  private _a: number = 1;

  constructor(color: Color | IColor | string) {
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
      if (isNotNull(color.r) && isNotNull(color.g) && isNotNull(color.b)) {
        const tempRgbColor: IRgbColor = {
          r: color.r || 0,
          g: color.g || 0,
          b: color.b || 0,
        };
        const isRightColor = checkRgbColor(tempRgbColor);
        if (isRightColor) {
          this._r = tempRgbColor.r;
          this._g = tempRgbColor.g;
          this._b = tempRgbColor.b;
        } else {
          throw new Error(`rgb color input error: ${JSON.stringify(color)}, please check the input`);
        }
      }

      if (isNotNull(color.h) && isNotNull(color.s) && isNotNull(color.l)) {
        const hsl: IHslColor = {
          h: color.h || 0,
          s: color.s || 0,
          l: color.l || 0,
        };
        const isRightColor = checkHslColor(hsl);
        if (isRightColor) {
          const rgb = hslToRgb(hsl);
          this._r = rgb.r;
          this._g = rgb.g;
          this._b = rgb.b;
        } else {
          throw new Error(`hsl color input error: ${JSON.stringify(color)}, please check the input`);
        }
      }

      if (isNotNull(color.h) && isNotNull(color.s) && isNotNull(color.v)) {
        const hsv: IHsvColor = {
          h: color.h || 0,
          s: color.s || 0,
          v: color.v || 0,
        };
        const isRightColor = checkHsvColor(hsv);
        if (isRightColor) {
          const rgb = hsvToRgb(hsv);
          this._r = rgb.r;
          this._g = rgb.g;
          this._b = rgb.b;
        } else {
          throw new Error(`hsv color input error: ${JSON.stringify(color)}, please check the input`);
        }
      }

      if (color.a) {
        this._a = color.a;
      }
    }
    return this;
  }

  // convert color to string

  toHexString(allow3Char = false): string {
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

  toRgbString(): string {
    return `rgb(${this._r}, ${this._g}, ${this._b})`;
  }

  toRgbaString(): string {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
  }

  toHslString(precision = 1): string {
    const rgb: IRgbColor = {
      r: this._r,
      g: this._g,
      b: this._b,
    };
    const hsl = rgbToHsl(rgb, precision);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  toHslaString(precision = 1): string {
    const rgb: IRgbColor = {
      r: this._r,
      g: this._g,
      b: this._b,
    };
    const hsl = rgbToHsl(rgb, precision);
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${this._a})`;
  }

  // change color

  setAlpha(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._a = value;
    return this;
  }

  tint(percentage: number) {
    return Color.tint(this.rgb, percentage);
  }

  shade(percentage: number) {
    return Color.shade(this.rgb, percentage);
  }

  mix(targetColor: IRgbColor | string, percentage: number) {
    return Color.mix(this.rgb, targetColor, percentage);
  }

  saturate(amount = 10): Color {
    let hsl = this.hsl;
    hsl.s += amount;
    hsl.s = hsl.s > 100 ? 100 : hsl.s;
    return new Color(hsl);
  }

  desaturate(amount = 10): Color {
    let hsl = this.hsl;
    hsl.s -= amount;
    hsl.s = hsl.s < 0 ? 0 : hsl.s;
    return new Color(hsl);
  }

  lighten(amount = 10) {
    let hsl = this.hsl;
    hsl.l += amount;
    hsl.l = hsl.l > 100 ? 100 : hsl.l;
    return new Color(hsl);
  }

  darken(amount = 10) {
    let hsl = this.hsl;
    hsl.l -= amount;
    hsl.l = hsl.l < 0 ? 0 : hsl.l;
    return new Color(hsl);
  }

  spin(amount = 36) {
    const hsl = this.hsl;
    const hue = (hsl.h + amount + 360) % 360;
    hsl.h = hue;
    return new Color(hsl);
  }

  greyscale(): Color {
    return this.desaturate(100);
  }

  // Combination Functions
  // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

  complement() {
    return this.spin(180);
  }

  triad() {
    const hsl = this.hsl;
    const h = hsl.h;
    return [
      new Color(hsl),
      new Color({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 240) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  tetrad() {
    const hsl = this.hsl;
    const h = hsl.h;
    return [
      new Color(hsl),
      new Color({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 270) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  splitcomplement() {
    const hsl = this.hsl;
    const h = hsl.h;
    return [
      new Color(hsl),
      new Color({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  analogous(results = 6, slices = 30) {
    const hsl = this.hsl;
    const part = 360 / slices;
    const ret = [new Color(hsl)];

    for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results; ) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new Color(hsl));
    }
    return ret;
  }

  monochromatic(results = 6) {
    const hsv = this.hsv;
    let h = hsv.h,
      s = hsv.s,
      v = hsv.v;
    const ret = [];
    const modification = 1 / results;

    while (results--) {
      ret.push(new Color({ h: h, s: s, v: v }));
      v = (v + modification) % 1;
    }

    return ret;
  }

  // get color data

  get rgb(): IRgbColor {
    return {
      r: this._r,
      g: this._g,
      b: this._b,
    };
  }

  get rgba(): IRgbaColor {
    return {
      r: this._r,
      g: this._g,
      b: this._b,
      a: this._a,
    };
  }

  get hsl(): IHslColor {
    const hsl = rgbToHsl(this.rgb);
    return hsl;
  }

  get hsla(): IHslaColor {
    const hsl = rgbToHsl(this.rgb);
    return { ...hsl, a: this._a };
  }

  get hsv(): IHsvColor {
    const hsv = rgbToHsv(this.rgb);
    return hsv;
  }

  get alpha(): number {
    return this._a;
  }

  getBrightness(l = 0): number {
    return rounded((this._r * 299 + this._g * 587 + this._b * 114) / 1000, l);
  }

  getLuminance(l = 6): number {
    let RsRGB: number = this._r / 255;
    let GsRGB: number = this._g / 255;
    let BsRGB: number = this._b / 255;
    let r: number;
    let g: number;
    let b: number;

    if (RsRGB <= 0.03928) {
      r = RsRGB / 12.92;
    } else {
      r = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
      g = GsRGB / 12.92;
    } else {
      g = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
      b = BsRGB / 12.92;
    } else {
      b = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return rounded(0.2126 * r + 0.7152 * g + 0.0722 * b, l);
  }

  getHoverColor(): string {
    return this.tint(80).toHexString();
  }

  getActiveColor(): string {
    return this.shade(5).toHexString();
  }

  getColorGradeList(): Array<Color> {
    return [
      this.tint(20),
      this.tint(40),
      this.tint(60),
      this.tint(80),
      this,
      this.shade(20),
      this.shade(40),
      this.shade(60),
      this.shade(80),
    ];
  }

  isDark(): boolean {
    return this.getBrightness() < 128;
  }

  isLight(): boolean {
    return !this.isDark();
  }

  // static method

  static readability(color1: IColor | string, color2: IColor | string) {
    const c1 = new Color(color1);
    const c2 = new Color(color2);
    return rounded(
      (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05),
      2
    );
  }

  static equal(color1: IColor | string, color2: IColor | string) {
    return new Color(color1).toHexString() === new Color(color2).toHexString();
  }

  static random(): Color {
    return new Color({
      r: randomRgb(),
      g: randomRgb(),
      b: randomRgb(),
    });
  }

  static tint(color: IRgbColor | string, percentage: number) {
    let c: IRgbColor;
    if (typeof color === 'string') {
      c = new Color(color).rgb;
    } else {
      c = color;
    }
    return Color.mix(new Color('#fff').rgb, c, percentage);
  }

  static shade(color: IRgbColor | string, percentage: number) {
    let c: IRgbColor;
    if (typeof color === 'string') {
      c = new Color(color).rgb;
    } else {
      c = color;
    }
    return Color.mix(c, new Color('#000').rgb, percentage);
  }

  static mix(originColor: IRgbColor | string, targetColor: IRgbColor | string, percentage: number) {
    let oc: IRgbColor;
    let tc: IRgbColor;
    if (typeof originColor === 'string') {
      oc = new Color(originColor).rgb;
    } else {
      oc = originColor;
    }
    if (typeof targetColor === 'string') {
      tc = new Color(targetColor).rgb;
    } else {
      tc = targetColor;
    }
    let r = (tc.r - oc.r) * (percentage / 100);
    let g = (tc.g - oc.g) * (percentage / 100);
    let b = (tc.b - oc.b) * (percentage / 100);
    r = Math.floor(r) + oc.r;
    g = Math.floor(g) + oc.g;
    b = Math.floor(b) + oc.b;
    return new Color({ r, g, b });
  }
}

export default Color;
