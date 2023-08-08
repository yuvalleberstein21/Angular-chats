import { IChatRoom } from './../models/room.interface';
import { Injectable } from '@angular/core';
import { IMessage } from '../models';
import { Observable, map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})

//* Get rooms, Add room, Get room messages, Send message, delete room by userID // *
export class ChatService {
  constructor(private _db: AngularFirestore) {}

  public getRooms(): Observable<IChatRoom[]> {
    return this._db
      .collection('rooms')
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          return snaps.map((snap) => {
            const id = snap.payload.doc.id;
            const data: IChatRoom = <IChatRoom>snap.payload.doc.data();
            return <IChatRoom>(<unknown>{
              ...data,
              id,
            });
          });
        })
      );
  }

  public getRoomMessages(roomID: string): Observable<Array<IMessage>> {
    return this._db
      .collection('rooms')
      .doc(roomID)
      .collection('messages')
      .snapshotChanges()
      .pipe(
        map((messages) => {
          return messages.map((message) => {
            const data: IMessage = <IMessage>message.payload.doc.data();

            return {
              ...data,
              id: message.payload.doc.id,
            };
          });
        })
      );
  }

  public addRoom(roomName: string, userId: string): void {
    this._db.collection('rooms').add({
      roomName,
      createdUserId: userId,
    });
  }

  public sendMessage(userId: string, body: string, roomId: string): void {
    this._db.collection('rooms').doc(roomId).collection('messages').add({
      userId,
      body,
      timestamp: new Date().getTime(),
    });
  }
}
