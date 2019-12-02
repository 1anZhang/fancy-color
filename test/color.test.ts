import fancyColor from '../src';

test('color #fadfad to be #fadfad', () => {
  expect(fancyColor('#fadfad').toHexString()).toBe('#fadfad');
});

test('color rgb(250, 223, 173) to be #fadfad', () => {
  expect(fancyColor('rgb(250, 223, 173)').toHexString()).toBe('#fadfad');
});

test('color hsl(39, 88.5%, 82.9%) to be #fadfad', () => {
  expect(fancyColor('hsl(39, 88.5%, 82.9%)').toHexString()).toBe('#fadfad');
});

test('color #fadfad to be hsl(39, 88.5%, 82.9%)', () => {
  expect(fancyColor('#fadfad').toHslString(1)).toBe('hsl(39, 88.5%, 82.9%)');
});
