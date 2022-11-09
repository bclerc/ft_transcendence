import { IsBoolean, IsEmail, IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength } from "class-validator";




/**
 *  User modification constraints
 *  @propert displayname Min 3 characters, max 10 characters, only letters
 *  @propert email Valid email
 *  @propert avatar_url Valid URL
 */

export class updateUserDto {

  @IsEmail()
  readonly email?: string;
  
  @MinLength(3)
  @MaxLength(10)
  @IsString()
  @Matches('^[a-zA-Z\\s]+$', undefined, { each: true })
  readonly displayname?: string;;
  
  @IsUrl()
  readonly avatar_url?: string;
  
  @IsBoolean()
  readonly twoFactorEnabled?: boolean;
  
}