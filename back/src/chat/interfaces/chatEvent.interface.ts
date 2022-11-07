import { BasicUserI } from "src/user/interface/basicUser.interface";
import { ChatRoom, ChatRoomI } from "./chatRoom.interface";

export class AdminUpdateEvent {
    isPromote: boolean;
    user: BasicUserI;
    promoter: BasicUserI;
    room: ChatRoom;
}

export class RoomUpdateEvent {
    user: BasicUserI;
    room: ChatRoomI;
    success?: boolean;
    message?: string;
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

export class UserPunishEvent {
  room: ChatRoomI;
  user: BasicUserI;
  punisher: BasicUserI;
  type: string;
  success: boolean;
  message?: string;
}

export class PardonEvent {
  room: ChatRoomI;
  user: BasicUserI;
  pardoner: BasicUserI;
  success: boolean;
  message?: string;
}

export class UserCanChatEvent {
  room: ChatRoomI;
  user: BasicUserI;
  message: string;
}

export class BlockedUserEvent {
  user: BasicUserI;
  blocker: BasicUserI;
  block: boolean;
  success: boolean;
}
