import Color, { IColor } from './color';

function fancyColor(color: Color | IColor | string) {
  // fancyColor.prototype = Color;
  return new Color(color);
}

fancyColor.mix = Color.mix;
fancyColor.shade = Color.shade;
fancyColor.tint = Color.tint;

export default fancyColor;
