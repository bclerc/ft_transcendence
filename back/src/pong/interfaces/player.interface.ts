import { Socket } from "socket.io";
import { BasicUserI } from "src/user/interface/basicUser.interface";
import { PointI } from "./point.interface";
import { UserI } from "./user.interface";

export interface PlayerI {
    user?: BasicUserI;
    socket?: Socket;
    paddle: PointI;
    points: number;
}