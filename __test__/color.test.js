const fancyColor = require('../dist/index');

test('color #fadfad to be #fadfad', () => {
  expect(fancyColor('#fadfad').toHexString()).toBe('#fadfad');
});
