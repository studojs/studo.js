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

/**
 * @param length size in bytes
 * @returns hex string
 */
export function getRandomValues(length: number): string {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return buf.reduce((acc, num) => acc + num.toString(16).padStart(2, '0'), '');
}
