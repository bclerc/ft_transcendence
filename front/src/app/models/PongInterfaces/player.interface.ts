import { Socket } from "ngx-socket-io";
import { PointI } from "./point.interface";
import { UserI } from "./user.interface";

export interface PlayerI {
    user?: UserI;
    socket?: Socket;
    paddle: PointI;
    points: number;
}