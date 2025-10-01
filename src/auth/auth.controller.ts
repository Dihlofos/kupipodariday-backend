import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Req() req: Request & { user: User }) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
