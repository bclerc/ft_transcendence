import { IsArray, IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { BasicUserI } from "src/user/interface/basicUser.interface";

export class CreateChatDto {

    @MaxLength(15)
    @MinLength(3)
    @IsString()
    name: string;

    @MaxLength(120)
    @IsString()
    description?: string;

    @IsArray()
    @IsNotEmpty()
    users: BasicUserI[];

    @IsBoolean()
    public: boolean;

    password?: string;
  }
