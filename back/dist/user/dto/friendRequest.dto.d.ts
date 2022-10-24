export declare enum FriendRequestAction {
    ACCEPT = 0,
    DECLINE = 1
}
export declare class FriendRequestDto {
    readonly requestId: number;
    readonly action: FriendRequestAction;
}
export declare class newFriendRequestDto {
    readonly toId: number;
}
