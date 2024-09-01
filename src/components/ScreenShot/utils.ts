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
