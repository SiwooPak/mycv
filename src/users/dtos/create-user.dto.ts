import { ApiProperty } from "@nestjs/swagger";
import {IsEmail,IsString} from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: 'test@test.com', description:"User's email"})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'test', description:"User's password"})
    @IsString()
    password: string;
}