import { compress, decompress, strFromU8, strToU8 } from 'fflate';
import { base64 } from 'rfc4648';

/**
 * Decodes base64 and gzip data into JSON
 * @see com.moshbit.studo.util.mb.MbEncoder:decopressed
 * @param data compressed string
 * @returns decompressed JSON
 */
export async function decode(data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const compressedBuffer = base64.parse(data);
    decompress(compressedBuffer, { consume: true }, (err, dataBuffer) => {
      if (err) reject(err);
      resolve(JSON.parse(strFromU8(dataBuffer)));
    });
  });
}

/**
 * Encodes JSON to a string using gzip and base64
 * @see com.moshbit.studo.util.mb.MbEncoder:compress
 * @param json JSON to encode
 * @returns compressed string
 */
export async function encode(json: unknown): Promise<string> {
  const jsonBuffer = strToU8(JSON.stringify(json));
  return new Promise((resolve, reject) => {
    compress(jsonBuffer, { consume: true }, (err, compressedData) => {
      if (err) reject(err);
      resolve(base64.stringify(compressedData));
    });
  });
}
