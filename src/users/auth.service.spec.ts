import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a gake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('인증서비스가 제대로 주입되었는가?', async () => {
    expect(service).toBeDefined();
  });

  it('유저의 비밀번호가 암호화가 제대로 되어 있는가?', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('기존에 있는 이메일로 가입시 에러 발생한다.', async () => {
    await service.signup('abc', 'asdf');
    await expect(service.signup('abc', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('로그인시 존재하지 않는 이메일이면 에러가 발생한다.', async () => {
    await service.signup('test1234@test.com', 'test');
    await expect(service.signin('test123@test.com', 'test')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('로그인시 패스워드가 틀리면 에러가 발생한다', async () => {
    await service.signup('asdf@asdf.com', '1234');

    await expect(service.signin('asdf@asdf.com', '12345')).rejects.toThrow(
      BadRequestException,
    );
  });
});
