import { Client } from '../src/client';
import { mockRawChannel, mockServerCommand } from './mockData';

it('should update the channel cache', async () => {
  const client = new Client('');

  await client.chat.emit(
    'UpdateChannels',
    mockServerCommand({
      channels: [mockRawChannel(), mockRawChannel({ id: '2', uniId: 'test' })],
    })
  );

  expect(client.cache.channels.size).toBe(2);
  expect(client.cache.channels.get('2')?.uniId).toBe('test');
});
