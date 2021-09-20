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

  expect(client.channels.size).toBe(2);
  expect(client.channels.get('2')?.uniId).toBe('test');
});
