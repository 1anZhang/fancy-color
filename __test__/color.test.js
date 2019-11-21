const fancyColor = require('../dist/index');

test('color #fadfad to be #fadfad', () => {
  expect(new fancyColor('#fadfad').toHexString()).toBe('#fadfad');
});
