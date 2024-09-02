/**
 * Chunks an array into smaller arrays of a given size.
 * @param arr
 * @param size
 */
export function chunk(arr: any[], size: number): Array<any[]> {
  return arr.reduce<Array<number[]>>((result, element, index) => {
    const groupIndex = Math.floor(index / size);
    if (!result[groupIndex]) {
      result[groupIndex] = [];
    }
    result[groupIndex].push(element);
    return result;
  }, []);
}

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
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}
