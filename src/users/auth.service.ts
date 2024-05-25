import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt); 


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    // 회원가입 인증부분
    async signup(email: string, password: string){
        // 동일 이메일 확인
        const users = await this.usersService.find(email);
        
        const isUser = users.filter( (user) => user.email === email).length;
        if(isUser) throw new BadRequestException('Duplicated email!')
        // 비밀번호 암호화
        // 1. generate a salt
        const salt = randomBytes(8).toString("hex");
        // 2. hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // 3. join the hashed result and the salt together
        const result = salt + '.' + hash.toString("hex");
        // create an new user and save it.
        const user = await this.usersService.create(email, result);
        // return the user
        return user;
    }

    async signin(email: string, password:string){
        const [user] = await this.usersService.find(email);
        this.signup
        if(!user) throw new NotFoundException("Not found user!");
        // 데이터베이스의 저장된 비밀번호 분리
        const [salt, storedHash] = user.password.split('.');
        // 요청에서 보내진 비밀번호 암호화
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // DB에 저장된 비밀번호 해시값과 요청에서 보내진 비밀번호의 해시값 비교     
        if(storedHash !== hash.toString("hex")) throw new BadRequestException("Wrong password!");
        
        return user;
    }
}