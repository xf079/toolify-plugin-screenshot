
/**
 * Converts an RGB color to a hex string.
 * @param r
 * @param g
 * @param b
 */
export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.padStart(2, '0');
  };
  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
