import { IMessage } from './';

export interface IChatRoom {
  id: number;
  roomName: string;
  messages: Array<IMessage>;
  createdUserId: string;
}
