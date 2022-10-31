import { Body, Controller, Request, Get, Param, Post, ForbiddenException, Put, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { newUserDto } from './dto/newUser.dto';
import { FriendRequest, User } from '@prisma/client';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { updateUserDto } from './dto/updateUser.dto';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { get, request } from 'http';
import { FriendRequestAction, FriendRequestDto, newFriendRequestDto } from './dto/friendRequest.dto';
import { BasicUserI } from './interface/basicUser.interface';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
  * @api {get} /user/ Récupérer la liste des utilisateurs
  * @apiName GetUsers
  * @apiGroup User
  * @apiHeaderExample {json} Header:
  *  {
  *       "Authorization": "Bearer ACCESS_TOKEN"
  *  }
  * @apiSuccessExample {json} Exemple de réponse en cas de succès:
  *{
  *  "id": 1,
  *  "email": "norminet@student.42.fr",
  *  "intra_name": "Norminet",
  *  "avatar_url": "https://cdn.intra.42.fr/users/norminet.jpg",
  *  "intra_id": 1,
  *  "displayname": "Norminet",
  *  "description": null,
  *   "elo": 12,
  *  "staff": true,
  *  "createdAt": "2022-08-02T18:31:06.050Z"
  * }
  * 
  */

  @Get()
  @UseGuards(Jwt2faAuthGuard)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get("me")
  @UseGuards(Jwt2faAuthGuard)
  async getLoggedUser(@Request() req: any) {
    return await this.userService.findOne(req.user.id);
  }

  /**
  * @api {get} /user/:id Récupérer un utilisateur par son id
  * @apiName GetUser
  * @apiGroup User
  * @apiParam {Number} id Id de l'utilisateur
  * 
  * @apiSuccessExample {json} Réponse en cas de succès:
  *{
  *  "id": 1,
  *  "email": "norminet@student.42.fr",
  *  "intra_name": "Norminet",
  *  "avatar_url": "https://cdn.intra.42.fr/users/norminet.jpg",
  *  "intra_id": 1,
  *  "displayname": "Norminet",
  *  "description": null,
  *  "staff": true,
  *  "createdAt": "2022-08-02T18:31:06.050Z"
  * }
  * 
  */
  @Get(':id')
  @UseGuards(Jwt2faAuthGuard)
  async findOne(@Request() req, @Param('id') id: number): Promise<BasicUserI> {
      return this.userService.getBasicUser(id);
  }

  /**
   * @api {post} /user/ Creer un nouvel utilisateur
   * @apiName PostUser
   * @apiGroup User
   * @apiHeaderExample {json} Header:
   * {
   *       "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiExample {json} Exemple de requête:
   * {
   *  "email": "norminet@student.42.fr",
   *  "displayname": "Norminet",
   *  "description": "Miaou!",
   *  "password": "password",
   * }
   * 
   * @apiBody {String} email Adresse email de l'utilisateur
   * @apiBody {String} displayname Pseudonyme de l'utilisateur
   * @apiBody {String} [description] Description de l'utilisateur
   * @apiBody {String} password Mot de passe de l'utilisateur
   * 
   * @apiSuccessExample {json} Example de réponse en cas de succès:
   *{
   *  "id": 1,
   *  "email": "norminet@student.42.fr",
   *  "intra_name": "Norminet",
   *  "avatar_url": "https://cdn.intra.42.fr/users/norminet.jpg",
   *  "intra_id": 1,
   *  "displayname": "Norminet",
   *  "description": null,
   *  "staff": true,
   *  "createdAt": "2022-08-02T18:31:06.050Z"
   * }
   * @apiErrorExample {json} Example de réponse en cas d'erreur
   * c
   */

  @Get('search/:name')
  @UseGuards(Jwt2faAuthGuard)
  async findUserByName(@Param('name') name: string): Promise<User[]> {
    return await this.userService.findByName(name);
  }

  @Post()
  async newUser(@Body() data: newUserDto): Promise<User> {
    return await this.userService.newUser(data);
  }

  /**
   * @api {put} /user/:id Modifier un utilisateur
   * @apiName PutUser
   * @apiGroup User
   * @apiHeaderExample {json} Header:
   * {
   *       "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id de l'utilisateur
   * @apiExample {json} Changer le pseudonyme:
   * {
   *  "displayname": "Norminette",
   * }
   * @apiExample {json} Changer la description:
   * {
   *    "description": "Miaou!",
   * }
   * @apiExample {json} Changer le mot de passe:  
   * {
   *    "password": "new password",
   * }
   * @apiBody {String} [email] Adresse email de l'utilisateur
   * @apiBody {String} [displayname] Pseudonyme de l'utilisateur
   * @apiBody {String} [description] Description de l'utilisateur
   * @apiBody {String} [password] Mot de passe de l'utilisateur
   * @apiBody {String} [avatar_url] URL de l'avatar de l'utilisateur
   * 
   * @apiSuccessExample {json} Example de réponse en cas de succès:
   * {
   *   "statusCode": 200,
   *   "message": "User updated"
   * }
   * 
   * @apiErrorExample {json} Example de réponse en cas d'erreur
   * {
   *   "statusCode": 400,
   *   "message": "email déjà utilisé" 
   * }
   */

  @Put()
  @UseGuards(Jwt2faAuthGuard)
  async updateUser(@Request() req: any, @Body() data: updateUserDto) {
    return await this.userService.updateUser(req.user.id, data);
  }

  /**
   * @api {get} /user/friends Récupérer la liste des amis d'un utilisateur
   * @apiName GetFriends
   * @apiGroup Friends
   * @apiHeaderExample {json} Header:
   * {
   *       "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * 
   * @apiSuccessExample {json} Réponse en cas de succès:
   * Promise<User[]>
   * 
   */

  @Get('friends/get')
  @UseGuards(Jwt2faAuthGuard)
  async getFriends(@Request() req: any): Promise<User[]> {
    return await this.userService.getFriends(req.user.id);
  }

  /**
   * @api {get} /user/friends/panding Récupérer la liste des demandes d'amis d'un utilisateur
   * @apiName GetPandingFriends
   * @apiGroup Friends
   * @apiHeaderExample {json} Header:
   * {
   *      "Authorization": "Bearer ACCESS_TOKEN" 
   * }
   * 
   * @apiSuccessExample {json} Réponse en cas de succès:
   * Promise<User[]>
   */


  @Get('friends/panding')
  @UseGuards(Jwt2faAuthGuard)
  async getFriendsPanding(@Request() req: any): Promise<FriendRequest[]> {
    // console.log(req.user.id);
    return await this.userService.getFriendRequests(req.user.id);
  }

  /**
   * @api {post} /user/friends/accept/:id Accepter une demande d'amis
   * @apiName AcceptFriend
   * @apiGroup Friends
   * @apiHeaderExample {json} Header:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id de la demande d'amis
   * 
   */

  @Get('friends/accept/:id')
  @UseGuards(Jwt2faAuthGuard)
  async acceptFriend(@Request() req: any, @Param('id') id: any) {
    const request = await this.userService.getFriendsRequestsById(id);

    if (request) {
      if (request.toId == req.user.id) {
        await this.userService.acceptFriend(id);
        return { message: "Friend request accepted", state: 'success' };
      }
      else
        return { message: "You are not the receiver of this friend request" };
    }
  }

  /**
   * @api {post} /user/friends/decline/:id Refuser une demande d'amis
   * 
   * @apiName DeclineFriend
   * @apiGroup Friends
   * @apiHeaderExample {json} Header:
   * {
   *    "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id de la demande d'amis
   *  
   */

  @Post('friends/decline/:id')
  @UseGuards(Jwt2faAuthGuard)
  async declineFriend(@Request() req: any, @Param('id') id: number) {
    this.userService.declineFriend(id);
  }

  /**
   * @api {post} /user/friends/request/:id Demander en amis
   * @apiName RequestFriend
   * @apiGroup Friends
   * 
   * @apiHeaderExample {json} Header:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id de l'utilisateur
   * 
   */

  @Post('friends/request/:id')
  @UseGuards(Jwt2faAuthGuard)
  async requestFriend(@Request() req: any, @Param('id') id: number) {
    if (req.user.id == id)
      throw new ForbiddenException();
    return await this.userService.addFriend(req.user.id, id);
  }

  @Post('friends/request')
  @UseGuards(Jwt2faAuthGuard)
  async newRequest(@Request() req: any, @Body() data:  newFriendRequestDto) {
    // console.log(data);
    
    if (req.user.id == data.toId)
      throw new ForbiddenException();
    if (await this.userService.haveFriend(req.user.id, data.toId))
      return { message: "You are already friends", state: 'error' };
    // Here is BLOCKED
    return await this.userService.addFriend(req.user.id, data.toId);
  }

  @Get('friends/remove/:id')
  @UseGuards(Jwt2faAuthGuard)
  async removeFriend(@Request() req: any, @Param('id') id: number) {
    return await this.userService.removeFriend(req.user.id, id);
  }

  @Post('friends')
  @UseGuards(Jwt2faAuthGuard)
  async getFriendsByIds(@Request() req: any, @Body() data: FriendRequestDto) {
    const request = await this.userService.getFriendsRequestsById(data.requestId);

    if (request) {
      if (request.toId == req.user.id) {
        if (data.action == FriendRequestAction.ACCEPT) {
          await this.userService.acceptFriend(request.id);
          return { message: "Friend request accepted", state: 'success' };
        }
        if (data.action == FriendRequestAction.DECLINE) {
          this.userService.declineFriend(request.id);
          return { message: "Friend request declined", state: 'success' };
      }
      }
      else
        return { message: "You are not the receiver of this friend request" };
    }
  }
}

