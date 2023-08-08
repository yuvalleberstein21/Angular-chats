import { Injectable } from '@angular/core';
import { IChatRoom } from '../models';
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
}
