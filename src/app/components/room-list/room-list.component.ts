import { Component, Input } from '@angular/core';
import { IChatRoom } from 'src/app/models';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent {
  @Input() rooms: Array<IChatRoom> = [];
}
