import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
  * @api {get} /chat/room/ Récupérer la liste des salons
  * @apiDescription Récupère la liste des salons de l'utilisateur
  * @apiName chat
  * @apiGroup Chat
  * @apiHeaderExample {json} Autorisations requises:
  * {
  *       "Authorization": "Bearer ACCESS_TOKEN"
  * }
  * @apiSuccess {String} access_token Token de connexion.
  *                      Le token de connexion permet d'accéder à toutes les ressources protégées
  *                      et d'identifier l'utilisateur connecté.
  * @apiSuccessExample {json} Exemple de réponse en cas de succès:
  * {
  *   {
  *     "id": 1,
  *     "name": "bclerc's room",
  *     "description": null,
  *     "ownerId": 10,
  *     "createdAt": "2022-10-09T19:07:10.044Z",
  *     "updatedAt": "2022-10-09T19:07:10.045Z"
  *   }
  * }
  */

  @Get("room")
  @UseGuards(Jwt2faAuthGuard)
  async getRooms(@Request() req) {
    return await this.chatService.getRoomsFromUser(req.user.id);
  }
  
  /**
   * @api {post} /chat/room/ Créer un salon
   * @apiDescription Créer un salon
   * @apiName chat
   * @apiGroup Chat
   * @apiHeaderExample {json} Autorisations requises:
   * {
   *      "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * 
   **/


  /**
   * @api {post} /chat/room/join/:id Rejoindre un salon
   * @apiDescription Rejoindre un salon
   * @apiName chat
   * @apiGroup Chat
   * @apiHeaderExample {json} Autorisations requises:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id du salon
   **/

  @Post("room/join/:id")
  @UseGuards(Jwt2faAuthGuard)
  async joinRoom(@Request() req, @Param('id') id: number): Promise<ChatRoom> {
    return await this.chatService.addUsersToRoom(id, req.user.id);
  }

  /**
   * @api {post} /chat/room/leave/:id Quitter un salon
   * @apiDescription Quitter un salon
   * @apiName chat
   * @apiGroup Chat
   * @apiHeaderExample {json} Autorisations requises:
   * {
   *    "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id du salon
   **/

  @Post("room/leave/:id")
  @UseGuards(Jwt2faAuthGuard)
  async leaveRoom(@Request() req, @Param('id') id: number): Promise<ChatRoom> {
    return await this.chatService.removeUsersFromRoom(id, req.user.id);
  }

}
