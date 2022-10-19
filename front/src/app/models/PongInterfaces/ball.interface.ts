import { PointI } from "./point.interface";

export interface BallI extends PointI {
    radius: number,
    speed: number,
    width: number,
    height: number
}