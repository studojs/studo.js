import { Client } from '../src/client';
import { mockRawChannel, mockRawTab, mockServerCommand } from './mockData';

it('should update the tab cache', async () => {
  const client = new Client('');

  await client.chat.emit(
    'UpdateChannels',
    mockServerCommand({ channels: [mockRawChannel({ id: '1' })] })
  );

  await client.chat.emit(
    'UpdateTabs',
    mockServerCommand({ tabs: [mockRawTab({ channelId: '1' })] })
  );

  expect(client.cache.tabs.size).toBe(1);
  expect(client.cache.channels.get('1')?.tabs.size).toBe(1);
});
