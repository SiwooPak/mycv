import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

/*
    currentUser 타입을 명시하지 않아 @ts-ignore로 임시로 처리한걸
    밑의 코딩으로 타입을 명시 
*/
declare global {
    namespace Express {
        interface Request {
            currentUser?:User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private usersService: UsersService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session || {};

        if(userId) {
            const user = await this.usersService.findOne(userId);
            req.currentUser = user;
        }
        
        next();
    }
}