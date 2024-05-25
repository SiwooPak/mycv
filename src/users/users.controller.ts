import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor'; 
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // 회원가입
  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password); 
    session.userId = user.id;
    console.log(user.id);
    
    return user;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  // 로그인
  @Post('signin')
  async signinUsers(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  // 로그아웃
  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // 회원조회
  @Get(':id')
  async findUser(@Param('id') id: string) {
    // console.log('handler is running!');
    // 유저 정보 조회
    const user = await this.usersService.findOne(parseInt(id));
    // 해당 유저 정보가 없을 시
    if (!user) throw new NotFoundException('Not found user!');
    return user;
  }

  // 전체회원조회
  @Get()
  async findAllUsers(@Query('email') email: string) {
    // 해당 이메일을 가진 회원 정보 조회
    const users = await this.usersService.find(email);
    // 회원 정보가 없을 시
    if (users.length === 0) throw new BadRequestException('Not found users!');
    return users;
  }

  // 회원정보수정
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    // 해당 유저 정보가 있는지 확인
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('Not found user!');
    // 요청에서 업데이트 된 내용이 없을시
    if (Object.keys(body).length === 0)
      throw new BadRequestException('no update data!');
    return this.usersService.update(parseInt(id), body);
  }

  // 회원탈퇴
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('Not found or removed user');
    return this.usersService.remove(parseInt(id));
  }
}
