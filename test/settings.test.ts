import { Client } from '../src/client';
import { mockServerCommand } from './mockData';

it('should update points', async () => {
  const client = new Client('');
  await client.chat.emit(
    'UpdateSetting',
    mockServerCommand({
      id: 'karma',
      value: '100',
    })
  );

  expect(client.points).toBe(100);
});
