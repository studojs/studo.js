import {
  ClientCommand,
  ClientCommands,
  DecodedServerCommand,
  ServerCommands,
} from '../chat/command';
import { Client } from '../client';
import { decode, encode } from '../utils/encoder';
import { SocketManager } from './socketManager';

interface DebugEvents {
  command: {
    name: keyof ServerCommands;
    content: ServerCommands[keyof ServerCommands];
  };
  send: {
    name: keyof ClientCommands;
    content: ClientCommands[keyof ClientCommands];
  };
}

export class ChatSocket extends SocketManager<ServerCommands & DebugEvents> {
  constructor(client: Client) {
    super(client, 'https://chat.studo.co');

    this.socket.on('command', async (msg: string) => {
      const { commands }: { commands: DecodedServerCommand[] } = await decode(msg);
      for (const cmd of commands) {
        const content = JSON.parse(cmd.content);
        this.emit('command', { name: cmd.className, content });
        this.emit(cmd.className, content);
      }
    });
  }

  async sendCommand<Name extends keyof ClientCommands>(
    name: Name,
    content: ClientCommands[Name]
  ): Promise<any> {
    this.emit('send', { name, content });

    const encodedContent = await encode({
      ...content,
      lastClientActionId: 0,
      commandId: Date.now().toString(),
      waitForAck: false,
    } as ClientCommand);
    return await this.send('command', { className: name, content: encodedContent });
  }
}
