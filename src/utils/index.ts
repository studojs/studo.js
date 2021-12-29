export * from './collection';
export * from './encoder';

/**
 * Splits a string joined by `|` to an array
 * @param rawStr 'ID1|ID2|ID3'
 * @returns ['ID1', 'ID2', 'ID3']
 */
export function parseRawIds(rawStr: string): string[] {
  return rawStr ? rawStr.split('|') : [];
}
