import { User } from "@prisma/client";
import { BasicUserI } from "src/user/interface/basicUser.interface";

export interface RequestEvent {
  user: BasicUserI;
  target: BasicUserI;
  success: boolean;
  message?: string;
}