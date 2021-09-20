# studo.js<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![CI](https://github.com/studojs/studo.js/actions/workflows/ci.yml/badge.svg)

Client to interact with the [studo app](https://play.google.com/store/apps/details?id=com.moshbit.studo)'s rest/socket.io API.

Was made by reverse engineering the apk and network packets.

- Works in **Node.js** and **browsers**
- **SMS**: login, logout
- **Channels**: subscribe, actions
- **Tabs**: subscribe, scroll, search
- **Topics**: subscribe, scroll, actions, create/edit, vote
- **Messages**: actions, create/edit, vote

## Install

```bash
npm install studo.js
```

## Usage

Obtain token through https://studojs.netlify.app or [adb](docs/app.md).

```javascript
import { Client } from 'studo.js';

(async () => {
  const client = new Client('<token>');
  await client.connect();

  client.on('channelUpdate', (channel) => {
    if (channel.name.includes('Feature')) channel.subscribe();
  });

  const tab = await client.once('tabUpdate');
  await tab.subscribe();

  const topic = await client.once('topicUpdate');
  console.log(topic.header);
  console.log(topic.text);
  await topic.vote('UP');

  client.disconnect();
})();
```
