import EventEmitter from 'emittery';
import io, { Socket } from 'socket.io-client';
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
  readonly socket: typeof Socket;
  clientId: string | undefined;

  constructor(public client: Client, url: string) {
    super();
    this.socket = io(url, {
      secure: true,
      autoConnect: false,
      reconnectionAttempts: 0,
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.register();
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

    let resolveHandler: () => void;
    let rejectHandler: () => void;

    return new Promise<void>((resolve, reject) => {
      resolveHandler = resolve;
      rejectHandler = reject;

      this.socket.once('connect', resolveHandler);
      this.socket.once('connect_error', rejectHandler);
    }).finally(() => {
      // Prevent memory leak
      this.socket.off('connect', resolveHandler);
      this.socket.off('connect_error', rejectHandler);
    });
  }

  disconnect(): void {
    this.clientId = undefined;
    this.socket.disconnect();
  }

  async register(): Promise<void> {
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
    this.clientId = result;
  }
}
