import { Client } from '../src';

const sessionToken = 'f80065dcbb1fdf4b09147e8a6ff7645948c2fa533564f283f3d854659106a34c';
const client = new Client(sessionToken);

(async () => {
  await client.connect();

  client.on('channelUpdate', (channel) => {
    if (channel.name.includes('Feature')) channel.subscribe();
  });

  const tab = await client.once('tabUpdate');
  console.log(tab.title);
  await tab.subscribe();

  const topic = await client.once('topicUpdate');
  console.log(topic.header);
  // await topic.vote('DOWN');
  client.disconnect();
  // await topic.subscribe();

  // client.on('messageUpdate', (msg) => {
  //   console.log('- ', msg.text);
  // });
})();
