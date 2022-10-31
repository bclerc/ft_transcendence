import { IsEmail, IsString, maxLength, minLength } from "class-validator";

export class newUserDto {
  readonly email: string;
  readonly displayname: string;
  readonly description?: string;
  readonly password: string;
}
