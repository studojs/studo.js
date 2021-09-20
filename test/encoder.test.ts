import { decode, encode } from '../src/utils/encoder';

it('should encode and decode b64 gzip', async () => {
  const source = { hello: 'world' };
  const encoded = await encode(source);
  const decoded = await decode(encoded);
  expect(decoded).toMatchObject(source);
});
