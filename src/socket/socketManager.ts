import EventEmitter from 'emittery';
import io from 'socket.io-client';
import { Client } from '../client';
import {
  applicationId,
  appVersionCode,
  appVersionName,
  architecture,
  deviceName,
  language,
  os,
  userAgent,
} from '../config';

export class SocketManager<EventData = Record<string, any>> extends EventEmitter<EventData> {
  readonly socket;
  clientId: string | undefined;

  constructor(readonly client: Client, url: string) {
    super();
    this.socket = io(url, {
      secure: true,
      autoConnect: false,
      reconnectionAttempts: 0,
      transports: ['websocket'],
    });
  }

  get registered(): boolean {
    return this.socket.connected && this.clientId !== undefined;
  }

  /**
   * Sends a packet to the websocket server
   * @returns response data
   */
  async send(event: string, ...args: any[]): Promise<any> {
    return new Promise((resolve) => this.socket.emit(event, ...args, resolve));
  }

  async connect(): Promise<void> {
    if (this.registered) return;
    this.disconnect();
    this.socket.connect();

    return new Promise((resolve, reject) => {
      this.socket.once('connect', () => {
        this.socket.removeListener('connect_error', reject);
        resolve();
      });
      this.socket.once('connect_error', (error: Error) => {
        this.socket.removeListener('connect', resolve);
        reject(error);
      });
    });
  }

  disconnect(): void {
    this.clientId = undefined;
    this.socket.disconnect();
  }

  /**
   *
   * @returns new client id
   */
  async register(): Promise<string> {
    const result: string = await this.send('register', {
      version: appVersionCode,
      versionName: appVersionName,
      applicationId,
      connState: 'wifi',
      type: 'client',
      sessionToken: this.client.sessionToken,
      installationId: this.client.installationId,
      deviceName,
      os,
      architecture,
      language,
      userAgent,
    });
    if (result === 'error') throw new Error('socket server error at registration');
    return (this.clientId = result);
  }
}
