# studo.js<br>

[![npm](https://img.shields.io/npm/v/studo.js)](https://www.npmjs.com/package/studo.js)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL-blue.svg)](https://opensource.org/licenses/GPL-3.0)

Client to interact with the [studo app](https://play.google.com/store/apps/details?id=com.moshbit.studo)'s rest/socket.io API.

Primarily focuses on the chat for now and was made by reverse engineering the apk and network packets.

## Features

- **SMS**: login, logout
- **Channels**: subscribe, actions
- **Tabs**: subscribe, scroll, search
- **Topics**: subscribe, scroll, actions, create/edit, vote
- **Messages**: actions, create/edit, vote

## Installation

```bash
npm install studo.js
```

## Usage

Obtain the session token through https://studojs.netlify.app or [adb](docs/app.md).

```javascript
import { Client } from 'studo.js';

// Setup client and connect
const client = new Client('<token>');
await client.connect();

// Automatically receives all channels at the start
client.on('channelUpdate', (channel) => {
  if (channel.name.includes('Feature')) channel.subscribe();
});

// Wait for the first (discussion) tab after subscribing to the channel
const tab = await client.once('tabUpdate');
await tab.subscribe();

// Wait for the first topic in this tab
const topic = await client.once('topicUpdate');
// Contains topic type, author name, points and time
console.log(topic.header);
// A substring of the actual message (ends with … if too long)
console.log(topic.text);
await topic.vote('UP');

client.disconnect();
```
