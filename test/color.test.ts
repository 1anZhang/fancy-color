import { fancyColor } from '../src';

test('fancyColor initialization', () => {
  expect(typeof fancyColor !== undefined).toBeTruthy();
  expect(typeof fancyColor('#fad') !== undefined).toBeTruthy();
});

test('color #fad can convert to any type', () => {
  expect(fancyColor(fancyColor('#fad')).toHexString()).toBe('#ffaadd');
  expect(fancyColor('#fad').toHexString()).toBe('#ffaadd');
  expect(fancyColor('#fad').toHexString(true)).toBe('#fad');
  expect(fancyColor('#fad').toRgbString()).toBe('rgb(255, 170, 221)');
  expect(fancyColor('#fad').toRgbaString()).toBe('rgba(255, 170, 221, 1)');
  expect(fancyColor('#fad').toHslString()).toBe('hsl(324, 100%, 83.3%)');
  expect(fancyColor('#fad').toHslaString()).toBe('hsla(324, 100%, 83.3%, 1)');
  expect(fancyColor('#fad').rgb).toEqual({ r: 255, g: 170, b: 221 });
  expect(fancyColor('#fad').rgba).toEqual({ r: 255, g: 170, b: 221, a: 1 });
  expect(fancyColor('#fad').hsl).toEqual({ h: 324, s: 100, l: 83.33 });
  expect(fancyColor('#fad').hsla).toEqual({ h: 324, s: 100, l: 83.33, a: 1 });
  expect(fancyColor('#fad').hsv).toEqual({ h: 324, s: 33.33, v: 100 });
});

test('test tinyColor input', () => {
  expect(fancyColor('#ffaadd').toHexString()).toBe('#ffaadd');
  expect(fancyColor('#fad').toHexString()).toBe('#ffaadd');
  expect(fancyColor('rgb(255, 170, 221)').toHexString()).toBe('#ffaadd');
  expect(fancyColor('rgba(255, 170, 221, 1)').toHexString()).toBe('#ffaadd');
  expect(fancyColor('hsl(324, 100%, 83.3%)').toHexString()).toBe('#ffaadd');
  expect(fancyColor('hsla(324, 100%, 83.3%, 1)').toHexString()).toBe('#ffaadd');
  expect(fancyColor({ r: 255, g: 170, b: 221 }).toHexString()).toBe('#ffaadd');
  expect(fancyColor({ r: 255, g: 170, b: 221, a: 1 }).toHexString()).toBe('#ffaadd');
  expect(fancyColor({ h: 324, s: 100, l: 83.3 }).toHexString()).toBe('#ffaadd');
  expect(fancyColor({ h: 324, s: 100, l: 83.3, a: 1 }).toHexString()).toBe('#ffaadd');
  expect(fancyColor({ h: 324, s: 33.33, v: 100 }).toHexString()).toBe('#ffaadd');
});

test('test hsl color precision', () => {
  expect(fancyColor('#fad').toHslString(0)).toBe('hsl(324, 100%, 83%)');
  expect(fancyColor('#fad').toHslaString(0)).toBe('hsla(324, 100%, 83%, 1)');
  expect(fancyColor('#daf').toHslString(3)).toBe('hsl(276, 100%, 83.333%)');
  expect(fancyColor('#afd').toHslaString(3)).toBe('hsla(156, 100%, 83.333%, 1)');
});

test('test transparent color', () => {
  expect(fancyColor('rgba(255, 170, 221, 0.8)').toHexString()).toBe('#ffaadd');
  expect(fancyColor('rgba(255, 170, 221, 0.8)').toRgbString()).toBe('rgb(255, 170, 221)');
  expect(fancyColor('rgba(255, 170, 221, 0.8)').toRgbaString()).toBe('rgba(255, 170, 221, 0.8)');
  expect(fancyColor('rgba(255, 170, 221, 0.8)').toHslString()).toBe('hsl(324, 100%, 83.3%)');
  expect(fancyColor('rgba(255, 170, 221, 0.8)').toHslaString()).toBe('hsla(324, 100%, 83.3%, 0.8)');
  expect(fancyColor('rgba(255, 170, 221, 0.8)').rgb).toEqual({ r: 255, g: 170, b: 221 });
  expect(fancyColor('rgba(255, 170, 221, 0.8)').rgba).toEqual({ r: 255, g: 170, b: 221, a: 0.8 });
});

test('test color mix', () => {
  expect(
    fancyColor('#fad')
      .mix('#ddd', 40)
      .toHexString()
  ).toBe('#f1bedd');
  expect(
    fancyColor('#fad')
      .shade(40)
      .toHexString()
  ).toBe('#996684');
  expect(
    fancyColor('#fad')
      .tint(40)
      .toHexString()
  ).toBe('#ffddf1');
  expect(fancyColor.mix('#fad', '#ddd', 40).toHexString()).toBe('#f1bedd');
  expect(fancyColor.shade('#fad', 40).toHexString()).toBe('#996684');
  expect(fancyColor.tint('#fad', 40).toHexString()).toBe('#ffddf1');
});

test('test get color method', () => {
  const gradeList = ['#ffeef8', '#ffddf1', '#ffccea', '#ffbbe3', '#ffaadd', '#cc88b0', '#996684', '#664458', '#33222c'];
  const c = fancyColor('#fad');

  expect(c.getActiveColor()).toBe('#f2a1d1');
  expect(c.getHoverColor()).toBe('#ffbbe3');
  expect(c.getBrightness()).toBe(201);
  expect(c.getLuminance(2)).toBe(0.55);
  expect(c.getColorGradeList().map(i => i.toHexString())).toEqual(gradeList);
});

test('test input color error', () => {
  expect(() => {
    fancyColor('#gggggg');
  }).toThrow('unsupported color type: #gggggg');
  expect(() => {
    fancyColor('rgb(322, 1, 22)');
  }).toThrow('rgb() color input error: rgb(322, 1, 22), please check the input');
  expect(() => {
    fancyColor('rgba(109, 1, 22, 20)');
  }).toThrow('rgba() color input error: rgba(109, 1, 22, 20), please check the input');
  expect(() => {
    fancyColor('hsl(109, 1, 232)');
  }).toThrow('hsl() color input error: hsl(109, 1, 232), please check the input');
  expect(() => {
    fancyColor('hsla(109, 1, 22, 20)');
  }).toThrow('hsla() color input error: hsla(109, 1, 22, 20), please check the input');
  expect(() => {
    fancyColor({ r: 255, g: 1270, b: 221 });
  }).toThrow('rgb color input error: {"r":255,"g":1270,"b":221}, please check the input');
  expect(() => {
    fancyColor({ h: 324, s: 100, l: 123.3 });
  }).toThrow('hsl color input error: {"h":324,"s":100,"l":123.3}, please check the input');
});

test('test special conditions', () => {
  expect(fancyColor('#fff').toHexString()).toBe('#ffffff');
  expect(fancyColor('#000').toHexString()).toBe('#000000');
  expect(fancyColor('rgb(0, 0, 0)').toHexString()).toBe('#000000');
  expect(fancyColor('hsl(0, 0%, 0%)').toHexString()).toBe('#000000');
  expect(fancyColor({ r: 0, g: 0, b: 0 }).toHexString()).toBe('#000000');
  expect(fancyColor({ h: 360, s: 0, l: 33 }).toHexString()).toBe('#545454');
  expect(fancyColor({ h: 0, s: 12, l: 33 }).toHexString()).toBe('#5e4a4a');
  expect(fancyColor({ h: 360, s: 0, v: 13 }).toHexString()).toBe('#212121');
  expect(fancyColor({ h: 360, s: 100, v: 0 }).toHexString()).toBe('#000000');
  expect(fancyColor('rgb(66, 66, 66)').toHslString()).toBe('hsl(0, 0%, 25.9%)');
});

test('test color equal', () => {
  expect(fancyColor.equal('rgb(0, 0, 0)', '#000000'));
  expect(fancyColor.equal({ h: 360, s: 0, l: 33 }, '#545454'));
  expect(fancyColor.equal('hsla(324, 100%, 83.3%, 1)', '#fad'));
});

test('test generate random color', () => {
  const hex6Reg: RegExp = /^#[a-fA-F0-9]{6}$/;
  expect(
    fancyColor
      .random()
      .toHexString()
      .match(hex6Reg)
  ).toBeTruthy();
});

test('test color is drak or light', () => {
  expect(fancyColor('#000').isDark()).toBeTruthy();
  expect(fancyColor('#000').isLight()).toBeFalsy();
  expect(fancyColor('#fad').isDark()).toBeFalsy();
  expect(fancyColor('#fad').isLight()).toBeTruthy();
});

test('test color readability', () => {
  expect(fancyColor.readability('#000', '#fff')).toBe(21);
  expect(fancyColor.readability('#000', '#fad')).toBe(12.05);
  expect(fancyColor.readability('#fad', '#fff')).toBe(1.74);
});

test('test color alpha method', () => {
  const c = fancyColor('#fff');
  expect(c.setAlpha(0.2).alpha).toBe(0.2);
  expect(c.setAlpha(-3).alpha).toBe(0);
  expect(c.setAlpha(322).alpha).toBe(1);
});

test('test color operator method', () => {
  const c = fancyColor('#fad');
  expect(c.saturate().toHexString()).toBe('#ffaadd');
  expect(c.saturate(33).toHexString()).toBe('#ffaadd');
  expect(c.desaturate().toHexString()).toBe('#fbaedc');
  expect(c.desaturate(42).toHexString()).toBe('#edbcd9');
  expect(c.lighten().toHexString()).toBe('#ffddf1');
  expect(c.lighten(23).toHexString()).toBe('#ffffff');
  expect(c.darken().toHexString()).toBe('#ff77c9');
  expect(c.darken(12).toHexString()).toBe('#ff6dc5');
  expect(c.spin().toHexString()).toBe('#ffaaaa');
  expect(c.spin(90).toHexString()).toBe('#fff6aa');
  expect(c.greyscale().toHexString()).toBe('#d4d4d4');
  expect(c.complement().toHexString()).toBe('#aaffcc');
});

test('test color combination', () => {
  const c = fancyColor('#fad');
  const d = fancyColor('#f00');
  expect(c.triad().map(i => i.toHexString())).toEqual(['#ffaadd', '#ddffaa', '#aaddff']);
  expect(c.tetrad().map(i => i.toHexString())).toEqual(['#ffaadd', '#fff6aa', '#aaffcc', '#aab2ff']);
  expect(c.splitcomplement().map(i => i.toHexString())).toEqual(['#ffaadd', '#ffddaa', '#aaffff']);
  expect(c.analogous().map(i => i.toHexString())).toEqual([
    '#ffaadd',
    '#ffaaff',
    '#ffaaee',
    '#ffaadd',
    '#ffaacc',
    '#ffaabb',
  ]);
  expect(c.monochromatic().map(i => i.toHexString())).toEqual([
    '#ffaadd',
    '#2a1c25',
    '#55394a',
    '#7f556f',
    '#aa7193',
    '#d48eb8',
  ]);
  expect(d.monochromatic().map(i => i.toHexString())).toEqual([
    '#ff0000',
    '#2a0000',
    '#550000',
    '#7f0000',
    '#aa0000',
    '#d40000',
  ]);
});
