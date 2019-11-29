import fancyColor from '../src';

test('color #fadfad to be #fadfad', () => {
  expect(fancyColor('#fadfad').toHexString()).toBe('#fadfad');
});

test('color rgb(250, 223, 173) to be #fadfad', () => {
    expect(fancyColor('rgb(250, 223, 173)').toHexString()).toBe('#fadfad');
  });