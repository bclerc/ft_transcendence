export class updateUserDto {
  readonly email?: string;
  readonly displayname?;
  readonly description?: string;
  readonly avatar_url?: string;
  readonly twoFactorEnabled?: boolean;
  readonly staff?: boolean;
  
}