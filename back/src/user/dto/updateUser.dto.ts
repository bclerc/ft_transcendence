import { IsBoolean, IsEmail, IsString, IsUrl, Max, Min } from "class-validator";

export class updateUserDto {

  @IsEmail()
  readonly email?: string;
  
  @IsString()
  @Min(4)
  @Max(12)
  readonly displayname?: string;;
  
  @IsString()
  @Min(5)
  @Max(255)
  readonly description?: string;
  
  @IsUrl()
  readonly avatar_url?: string;
  
  @IsBoolean()
  readonly twoFactorEnabled?: boolean;
  
  
}