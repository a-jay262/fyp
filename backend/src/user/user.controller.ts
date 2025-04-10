// src/user/user.controller.ts
import { Controller, Post, Body, BadRequestException, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<User> {
    return this.userService.signup(username, email, password);
  }
  @Post('signupvet')
  async signupvet(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<User> {
    return this.userService.signupvet(username, email, password);
  }
  @Post('resend-otp')
  async resendOtp(@Body('email') email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    return this.userService.resendOtp(email);
  }
  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string): Promise<User> {
    return this.userService.verifyOtp(email, otp);
  }


  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string): Promise<User> {
    return this.userService.login(email, password);
  }

  @Put(':id/verify')
  async verifyVet(@Param('id') id: string) {
    try {
      const updatedVet = await this.userService.verifyVetById(id);
      return {
        message: 'Vet verified successfully',
        vet: updatedVet,
      };
    } catch (error) {
      return {
        message: 'Error verifying vet',
        error: error.message,
      };
    }
  }
}