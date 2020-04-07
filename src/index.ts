import Color, { IColor } from './color';

function fancyColor(color: Color | IColor | string) {
  return new Color(color);
}

fancyColor.mix = Color.mix;
fancyColor.shade = Color.shade;
fancyColor.tint = Color.tint;
fancyColor.equal = Color.equal;
fancyColor.random = Color.random;
fancyColor.readability = Color.readability;

export {fancyColor};
