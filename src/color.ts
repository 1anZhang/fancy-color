import {
  decodeColorString,
  decNumberToHexString,
  hslToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
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

export interface IHsvaColor extends IHsvColor {
  a: number;
}

export interface ICmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

class Color {
  private _r: number = 0;
  private _g: number = 0;
  private _b: number = 0;
  private _a: number = 1;

  /**
   * 颜色构造函数
   * 一、支持字符串类型
   * 1. #fad
   * 2. rgb(255, 170, 221)
   * 3. rgba(255, 170, 221, 1)
   * 4. hsl(324, 100%, 83.3%)
   * 5. hsla(324, 100%, 83.3%, 1)
   * 二、支持对象类型
   * 1. { r: 255, g: 170, b: 221 }
   * 2. { r: 255, g: 170, b: 221, a: 1 }
   * 3. { h: 324, s: 100, l: 83.3 }
   * 4. { h: 324, s: 100, l: 83.3, a: 1 }
   * 5. { h: 324, s: 33.33, v: 100 }
   * 5. { h: 324, s: 33.33, v: 100, a: 1 }
   * 三、支持传入Color实例
   * @param color
   */
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
    return;
  }
  /**
   * 返回hex字符串
   * @param allow3Char 是否允许压缩
   * @returns {string}
   */
  toHexString(allow3Char = false): string {
    let r = decNumberToHexString(this._r);
    let g = decNumberToHexString(this._g);
    let b = decNumberToHexString(this._b);

    const canCompress = r[0] === r[1] && g[0] === g[1] && b[0] === b[1];
    if (allow3Char && canCompress) {
      r = r[0];
      g = g[0];
      b = b[0];
    }
    return `#${r}${g}${b}`;
  }

  /**
   * 返回rgb字符串
   * @returns {string}
   */
  toRgbString(): string {
    return `rgb(${this._r}, ${this._g}, ${this._b})`;
  }

  /**
   * 返回rgba字符串
   * @returns {string}
   */
  toRgbaString(): string {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
  }

  /**
   * 返回hsl字符串
   * @param precision 精度，默认保留小数点后一位
   * @returns {string}
   */
  toHslString(precision = 1): string {
    const rgb: IRgbColor = {
      r: this._r,
      g: this._g,
      b: this._b,
    };
    const hsl = rgbToHsl(rgb, precision);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  /**
   * 返回hsla字符串
   * @param precision 精度，默认保留小数点后一位
   * @returns {string}
   */
  toHslaString(precision = 1): string {
    const rgb: IRgbColor = {
      r: this._r,
      g: this._g,
      b: this._b,
    };
    const hsl = rgbToHsl(rgb, precision);
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${this._a})`;
  }

  /**
   * 设置颜色的透明度
   * @param value 范围0-1
   * @returns {this} 返回Color实例
   */
  setAlpha(value: number): Color {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._a = value;
    return this;
  }

  /**
   * 给当前颜色混合白色
   * @param percentage 范围0-100
   * @returns {Color}
   */
  tint(percentage: number): Color {
    return Color.tint(this.rgb, percentage);
  }

  /**
   * 给当前颜色混合黑色
   * @param percentage 范围0-100
   * @returns {Color}
   */
  shade(percentage: number): Color {
    return Color.shade(this.rgb, percentage);
  }

  /**
   * 当前颜色和目标颜色混合
   * @param targetColor
   * @param percentage
   * @returns {Color}
   */
  mix(targetColor: IRgbColor | string, percentage: number): Color {
    return Color.mix(this.rgb, targetColor, percentage);
  }

  /**
   * 增加饱和度，范围1-100
   * @param amount
   * @returns {Color}
   */
  saturate(amount = 10): Color {
    if (amount < 0 || amount > 100) {
      throw new RangeError('the value of saturate must be between 1 ann 100');
    }
    let hsl = this.hsl;
    hsl.s += amount;
    hsl.s = hsl.s > 100 ? 100 : hsl.s;
    return new Color(hsl);
  }

  /**
   * 减少饱和度，范围1-100
   * @param amount
   * @returns {Color}
   */
  desaturate(amount = 10): Color {
    if (amount < 0 || amount > 100) {
      throw new RangeError('the value of desaturate must be between 1 ann 100');
    }
    let hsl = this.hsl;
    hsl.s -= amount;
    hsl.s = hsl.s < 0 ? 0 : hsl.s;
    return new Color(hsl);
  }

  /**
   * 增加亮度，范围1-100
   * @param amount
   * @returns {Color}
   */
  lighten(amount = 10): Color {
    if (amount < 0 || amount > 100) {
      throw new RangeError('the value of lighten must be between 1 ann 100');
    }
    let hsl = this.hsl;
    hsl.l += amount;
    hsl.l = hsl.l > 100 ? 100 : hsl.l;
    return new Color(hsl);
  }

  /**
   * 减少饱和度，范围1-100
   * @param amount
   * @returns {Color}
   */
  darken(amount = 10): Color {
    if (amount < 0 || amount > 100) {
      throw new RangeError('the value of darken must be between 1 ann 100');
    }
    let hsl = this.hsl;
    hsl.l -= amount;
    hsl.l = hsl.l < 0 ? 0 : hsl.l;
    return new Color(hsl);
  }

  /**
   * 修改hue值
   * @param amount
   * @returns {Color}
   */
  spin(amount = 36): Color {
    const hsl = this.hsl;
    const hue = (hsl.h + amount + 360) % 360;
    hsl.h = hue;
    return new Color(hsl);
  }

  /**
   * 获取当前颜色的灰度模式
   * 就是把颜色饱和度降为0
   * @returns {Color}
   */
  getGreyscale(): Color {
    return this.desaturate(100);
  }

  /**
   * 得到当前颜色的补偿色
   * 就是在色环上旋转180度得到的颜色
   * @returns {Color}
   */
  getComplementary(): Color {
    return this.spin(180);
  }

  /**
   * 色轮数组
   * 就是在色环上和当前颜色组成一个等边三角形
   * @returns {Color[]}
   */
  gertTriadic(): Color[] {
    const hsl = this.hsl;
    const h = hsl.h;
    return [
      new Color(hsl),
      new Color({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 240) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  /**
   * 色轮数组
   * 就是在色环上和当前颜色组成一个正方形
   * @returns {Color[]}
   */
  getTetrad(): Color[] {
    const hsl = this.hsl;
    const h = hsl.h;
    return [
      new Color(hsl),
      new Color({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 270) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  /**
   * 色轮数组
   * 就是在色环上和当前颜色组成一个等腰三角形
   * @returns {Color[]}
   */
  getSplitComplement(): Color[] {
    const hsl = this.hsl;
    const h = hsl.h;
    return [
      new Color(hsl),
      new Color({ h: (h + 150) % 360, s: hsl.s, l: hsl.l }),
      new Color({ h: (h + 210) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  /**
   * 色轮数组
   * 就是在色环上找当前颜色响铃的颜色组成数组
   * @returns {Color[]}
   */
  getAnalogous(results = 6, slices = 30): Color[] {
    const hsl = this.hsl;
    const part = 360 / slices;
    const ret = [new Color(hsl)];

    for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results; ) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new Color(hsl));
    }
    return ret;
  }

  /**
   * 色轮数组
   * 返回当前颜色的monochromatic数组
   * @returns {Color[]}
   */
  getMonochromatic(results = 6): Color[] {
    const hsv = this.hsv;
    let h = hsv.h,
      s = hsv.s,
      v = hsv.v;
    const ret = [];
    const modification = (1 / results) * 100;

    while (results--) {
      ret.push(new Color({ h: h, s: s, v: v }));
      v = (v + modification) % 100;
    }
    return ret;
  }

  /**
   * 返回RGB颜色对象
   * @returns {IRgbColor}
   */
  get rgb(): IRgbColor {
    return {
      r: this._r,
      g: this._g,
      b: this._b,
    };
  }

  /**
   * 返回RGBA颜色对象
   * @returns {IRgbaColor}
   */
  get rgba(): IRgbaColor {
    return {
      r: this._r,
      g: this._g,
      b: this._b,
      a: this._a,
    };
  }

  /**
   * 返回HSL颜色对象
   * @returns {IHslColor}
   */
  get hsl(): IHslColor {
    const hsl = rgbToHsl(this.rgb);
    return hsl;
  }

  /**
   * 返回HSLA颜色对象
   * @returns {IHslaColor}
   */
  get hsla(): IHslaColor {
    const hsl = rgbToHsl(this.rgb);
    return { ...hsl, a: this._a };
  }

  /**
   * 返回HSV颜色对象
   * @returns {IHsvColor}
   */
  get hsv(): IHsvColor {
    const hsv = rgbToHsv(this.rgb);
    return hsv;
  }

  /**
   * 返回HSVA颜色对象
   * @returns {IHsvColor}
   */
  get hsva(): IHsvaColor {
    const hsv = rgbToHsv(this.rgb);
    return { ...hsv, a: this._a };
  }

  /**
   * 返回CMYK颜色对象
   * @returns {ICmykColor}
   */
  get cmyk(): ICmykColor {
    const cmyk = rgbToCmyk(this.rgb);
    return cmyk;
  }

  /**
   * 返回颜色透明度
   * @returns {number}
   */
  get alpha(): number {
    return this._a;
  }

  /**
   * 获取颜色的亮度
   * @param l 精度
   * @returns {number}
   */
  getBrightness(l = 0): number {
    return rounded((this._r * 299 + this._g * 587 + this._b * 114) / 1000, l);
  }

  /**
   * 获取颜色的亮度
   * @param l 精度
   * @returns {number}
   */
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

  /**
   * 获取Hover的颜色，tint 20%
   * @returns {string}
   */
  getHoverColor(): string {
    return this.tint(20).toHexString();
  }

  /**
   * 获取Active的颜色，shade 5%
   * @returns {string}
   */
  getActiveColor(): string {
    return this.shade(5).toHexString();
  }

  /**
   * 获取一个颜色灰度列表
   * @returns {Color[]}
   */
  getColorGradeList(): Color[] {
    return [
      this.tint(80),
      this.tint(60),
      this.tint(40),
      this.tint(20),
      this,
      this.shade(20),
      this.shade(40),
      this.shade(60),
      this.shade(80),
    ];
  }

  /**
   * 判断是否是暗色
   * @returns {boolean}
   */
  isDark(): boolean {
    return this.getBrightness() < 128;
  }

  /**
   * 判断是否是亮色
   * @returns {boolean}
   */
  isLight(): boolean {
    return !this.isDark();
  }

  /**
   * 判断字体色在背景色下是否已读
   * @param color1 字体色
   * @param color2 背景色
   * @returns {number}
   */
  static readability(color1: IColor | string, color2: IColor | string): number {
    const c1 = new Color(color1);
    const c2 = new Color(color2);
    return rounded(
      (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05),
      2
    );
  }

  /**
   * 判断两个颜色是否相等
   * @param color1 颜色1
   * @param color2 颜色2
   * @returns {boolean}
   */
  static equal(color1: IColor | string, color2: IColor | string): boolean {
    return new Color(color1).toHexString() === new Color(color2).toHexString();
  }

  /**
   * 随机产生一个颜色
   * @returns {Color}
   */
  static random(): Color {
    return new Color({
      r: randomRgb(),
      g: randomRgb(),
      b: randomRgb(),
    });
  }

  /**
   * 给颜色添加白色
   * @param color 颜色
   * @param percentage 百分比
   * @returns {Color}
   */
  static tint(color: IRgbColor | string, percentage: number): Color {
    let c: IRgbColor;
    if (typeof color === 'string') {
      c = new Color(color).rgb;
    } else {
      c = color;
    }
    return Color.mix(c, new Color('#fff').rgb, percentage);
  }

  /**
   * 给颜色添加黑色
   * @param color 颜色
   * @param percentage 百分比
   * @returns {Color}
   */
  static shade(color: IRgbColor | string, percentage: number): Color {
    let c: IRgbColor;
    if (typeof color === 'string') {
      c = new Color(color).rgb;
    } else {
      c = color;
    }
    return Color.mix(c, new Color('#000').rgb, percentage);
  }

  /**
   * 按百分比混合两种颜色
   * @param originColor 原始颜色
   * @param targetColor 目标颜色
   * @param percentage 百分比
   * @returns {Color}
   */
  static mix(originColor: IRgbColor | string, targetColor: IRgbColor | string, percentage: number): Color {
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
    r = Math.round(r) + oc.r;
    g = Math.round(g) + oc.g;
    b = Math.round(b) + oc.b;
    return new Color({ r, g, b });
  }
}

export default Color;
