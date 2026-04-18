import { Controller, Post, Body, Request, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('cambiar-password')
  cambiarPassword(
    @Request() req,
    @Body() body: { passwordActual: string; passwordNueva: string },
  ) {
    return this.authService.cambiarPassword(req.user.sub, body.passwordActual, body.passwordNueva);
  }
}
