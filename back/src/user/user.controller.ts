import { Body, Controller, Request, Get, Param, Post, Put, Patch, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { newUserDto } from './dto/newUser.dto';
import { FriendRequest, User, UserState } from '@prisma/client';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { updateUserDto } from './dto/updateUser.dto';
import { FriendRequestAction, FriendRequestDto, newFriendRequestDto } from './dto/friendRequest.dto';
import { BasicUserI } from './interface/basicUser.interface';
import { FriendsService } from 'src/friends/friends.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ValidationPipe } from './validation.pipe';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly friendsService: FriendsService,
    private readonly CloudinaryService: CloudinaryService,
    private readonly eventEmitter: EventEmitter2) { }

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
  *  "avatar_url": "https://cdn.intra.42.fr/users/ http://localhost:3000/api/v1/user/avataranorminet.jpg",
  *  "intra_id": 1,
  *  "displayname": "Norminet",
  *  "description": null,
  *   "elo": 12,
  *  "staff": true,
  *  "createdAt": "2022-08-02T18:31:06.050Z"
  * }
  * 
  */

  @Post("good")
  @UseGuards(Jwt2faAuthGuard)
  async good(@Request() req: any) {
    return {message: "User found", state: 'success', user: req.user };
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
      return this.userService.getBasicUser(Number(id));
  }
  @Get('/profile/:id')
  @UseGuards(Jwt2faAuthGuard)
  async getProfile(@Request() req, @Param('id') id: number): Promise<any> {
      return this.userService.getProfileUser(Number(id));
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

  /**
   * @api {put} /user/ Modifier un utilisateur
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
  async updateUser(@Request() req: any, @Body(new ValidationPipe()) data: updateUserDto) {
    return await this.userService.updateUser(req.user.id, data);
  }


  /**
   * @api {post} /user/avatar Modifier l'avatar
   * @apiName postUser
   * @apiGroup User
   * @apiHeaderExample {json} Header:
   * {
   *       "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiBody {file} image l'avatar
   */

  @Post('avatar')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(Jwt2faAuthGuard)
  async uploadFile(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    try {
      let apiResponse = await this.CloudinaryService.uploadImage(file);
      await this.userService.updateUser(req.user.id, { avatar_url: (await apiResponse).secure_url });

      return { message: 'New avatar set', state: 'success' };
    } catch (error) {
      return { message: 'Error while uploading image, please verify you image', state: 'error' };
    }
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
    return await this.friendsService.getFriends(req.user.id);
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
    return await this.friendsService.getFriendRequests(req.user.id);
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
    const request = await this.friendsService.getFriendsRequestsById(id);

    if (request) {
      if (request.toId == req.user.id) {
        await this.friendsService.acceptFriend(id);
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
    this.friendsService.declineFriend(id);
  }

  /**
   * @api {post} /user/friends/request/ Demander en amis
   * @apiName RequestFriend
   * @apiGroup Friends
   * 
   * @apiHeaderExample {json} Header:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} toId Id de l'utilisateur
   * 
   */

  @Post('friends/request')
  @UseGuards(Jwt2faAuthGuard)
  async newRequest(@Request() req: any, @Body() data: newFriendRequestDto) {
    if (req.user.id == data.toId)
      return { message: "You can't add yourself as a friend", state: 'error' };
    if (await this.friendsService.haveFriend(req.user.id, data.toId))
      return { message: "You are already friends", state: 'error' };
    if (await this.friendsService.haveFriendRequest(req.user.id, data.toId))
      return { message: "You already have a friend request", state: 'error' };
    if (await this.userService.isBlocked(req.user.id, data.toId))
      return { message: "Request failed", state: 'error'}
      return await this.friendsService.addFriend(req.user.id, data.toId);
  }

  @Get('friends/remove/:id')
  @UseGuards(Jwt2faAuthGuard)
  async removeFriend(@Request() req: any, @Param('id') id: number) {
    return await this.friendsService.removeFriend(req.user.id, id);
  }

  @Post('friends')
  @UseGuards(Jwt2faAuthGuard)
  async getFriendsByIds(@Request() req: any, @Body() data: FriendRequestDto) {
    const request = await this.friendsService.getFriendsRequestsById(data.requestId);

    if (request) {
      if (request.toId == req.user.id) {
        if (data.action == FriendRequestAction.ACCEPT) {
          await this.friendsService.acceptFriend(request.id);
          return { message: "Friend request accepted", state: 'success' };
        }
        if (data.action == FriendRequestAction.DECLINE) {
          await this.friendsService.declineFriend(request.id);
          return { message: "Friend request declined", state: 'success' };
        }
      }
      else
        return { message: "You are not the receiver of this friend request" };
    }
  }


  /**
   * @api {post} /user/block/:id Bloquer un utilisateur
   * @apiName blockuser
   * @apiGroup Blocker
   * 
   * @apiHeaderExample {json} Header:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id de l'utilisateur à bloquer
   * 
   */


  @Post('block/:id')
  @UseGuards(Jwt2faAuthGuard)
  async block(@Request() req: any, @Param('id') target: number) {
    if (req.user.id == target)
      return { message: "You can't block yourself", state: 'error' };
    if (await this.friendsService.haveFriend(req.user.id, target))
      this.friendsService.removeFriend(req.user.id, target);
    await this.friendsService.haveFriendRequest(req.user.id, target, true);
    return await this.userService.blockUser(req.user.id, target);
  }

  /**
   * @api {post} /user/unblock/:id Débloquer un utilisateur
   * @apiName blockuser
   * @apiGroup Blocker
   * 
   * @apiHeaderExample {json} Header:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiParam {Number} id Id de l'utilisateur à débloquer
   */

  @Post('unblock/:id')
  @UseGuards(Jwt2faAuthGuard)
  async unblock(@Request() req: any, @Param('id') target: number) {
    return await this.userService.unblockUser(req.user.id, target);
  }
   

}
  

