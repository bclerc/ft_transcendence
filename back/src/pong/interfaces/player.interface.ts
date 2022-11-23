import { Socket } from "socket.io";
import { BasicUserI } from "src/user/interface/basicUser.interface";
import { PointI } from "./point.interface";
import { UserI } from "./user.interface";

export interface dataPlayerI {
    id: number,
    displayname: string,
    intra_name?: string,
}

export interface PlayerI {
    user?: dataPlayerI;
    paddle: PointI;
    points: number;
}