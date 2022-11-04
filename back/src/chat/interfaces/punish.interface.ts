import { PenaltyType } from "@prisma/client";

export interface PusnishI {
  type: PenaltyType;
  perm: boolean;
  time: number;
  targetId: number;
  roomId: number;
}