export * from './encoder';

/**
 * Splits a string joined by `|` to an array
 * @param rawStr 'ID1|ID2|ID3'
 * @returns ['ID1', 'ID2', 'ID3']
 */
export function parseRawIds<T extends string>(rawStr: string): T[] {
  return rawStr ? (rawStr.split('|') as T[]) : [];
}
