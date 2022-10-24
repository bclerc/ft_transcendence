import { isInt, IsInt } from 'class-validator';

export enum FriendRequestAction {
  ACCEPT,
  DECLINE
}

export class FriendRequestDto {
  @IsInt()
  readonly requestId: number;

  readonly action: FriendRequestAction;
}

export class newFriendRequestDto {
  @IsInt()
  readonly toId: number;
}