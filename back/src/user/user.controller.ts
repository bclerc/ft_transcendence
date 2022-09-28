import { Body, Controller, Request, Get, Param, Post, ForbiddenException, Put, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { newUserDto } from './dto/newUser.dto';
import { User } from '@prisma/client';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { updateUserDto } from './dto/updateUser.dto';
import { StaffGuard } from 'src/auth/guards/staff.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async findOne(@Request() req, @Param('id') id: number): Promise<User>{
    if (req.user.id != id && !req.user.staff)
      throw new ForbiddenException();
    return this.userService.findOne(id);
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
   * {
   *    "statusCode": 400,
   *    "message": "Email déjà utilisé"
   * }
   */

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

  @UseGuards(Jwt2faAuthGuard)
  async updateUser(@Request() req: any, @Param('id') id: number, @Body() data: updateUserDto): Promise<User> {
    if (req.user.id != id && !req.user.staff)
      throw new ForbiddenException();
    return ;
  }
}

