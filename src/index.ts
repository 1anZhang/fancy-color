import Color, { IRgbColor } from './color';

function fancyColor(color: IRgbColor | string) {
  return new Color(color);
}

export default fancyColor;
