import { HttpException, HttpStatus } from "@nestjs/common";
import { ChatPenalty, PenaltyTimeType, PenaltyType } from "@prisma/client";
import { OnlineUserService } from "src/onlineusers/onlineuser.service";

export class RoomPunishException extends HttpException {
    
  constructor(penalty: ChatPenalty,  onlineUserService: OnlineUserService) {
    let msg: String = new String();
    msg += "Vous avez été ";
    msg += (penalty.type == PenaltyType.BAN ? " banni " : "rendu muet ");
    msg += " de ce salon";
    msg += (penalty.timetype == PenaltyTimeType.PERM ? " de façon permanente" : " Jusqu'au " + penalty.endTime.toLocaleString('fr-FR'));

    super(msg, HttpStatus.FORBIDDEN,);
  }
}
