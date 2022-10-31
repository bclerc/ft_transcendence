import { BasicUserI } from "src/user/interface/basicUser.interface";
import { ChatRoom, ChatRoomI } from "./chatRoom.interface";

export class AdminUpdateEvent {
    isPromote: boolean;
    user: BasicUserI;
    promoter: BasicUserI;
    room: ChatRoom;
}

export class RoomUpdateEvent {
    room: ChatRoomI;
}

export class MessageUpdateEvent {
    room: ChatRoomI;
}

export class NewRoomEvent {
  room: ChatRoomI;
}

export class UserJoinEvent {
  room: ChatRoomI;
  user: BasicUserI;
  success: boolean;
  message?: string;
}

export class UserLeaveEvent {
  room: ChatRoomI;
  user: BasicUserI;
}

export class UserKickEvent {
  room: ChatRoomI;
  user: BasicUserI;
  kicker: BasicUserI;
}