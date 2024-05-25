import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // 회원 가입
  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  // 회원정보(반환타입: 객체)
  async findOne(id: number) {
    if(!id) return null;
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  // 해당 이메일을 가진 회원들 조회
  async find(email: string) {
    const user = await this.repo.findBy({ email });
    
    return user;
  }

  // 회원 정보 수정
  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  // 회원 탈퇴
  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    return this.repo.remove(user);
  }
}
