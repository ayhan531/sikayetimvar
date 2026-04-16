import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto, LoginUserDto, UpdateProfileDto } from './dto/user.dto';
import { JwtGuard } from '../auth/jwt.guard';

type AuthenticatedRequest = Request & { user: { userId: number } };

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
};

@Controller('/api/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: unknown; token: string }> {
    try {
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const user = await this.usersService.createUser(
        createUserDto.email,
        createUserDto.password,
        createUserDto.firstName,
        createUserDto.lastName,
      );

      const token = this.authService.generateToken(user.id);

      return {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          rank: user.rank,
          isAdmin: user.isAdmin,
        },
        token,
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ message: string; user: unknown; token: string }> {
    try {
      const user = await this.usersService.findByEmail(loginUserDto.email);
      if (!user) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await this.usersService.validatePassword(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = this.authService.generateToken(user.id);

      return {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          rank: user.rank,
          points: user.points,
          isAdmin: user.isAdmin,
        },
        token,
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@Req() req: AuthenticatedRequest): Promise<unknown> {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      points: user.points,
      rank: user.rank,
      isAdmin: user.isAdmin,
      phone: user.phone,
      city: user.city,
      bio: user.bio,
      profileImage: user.profileImage,
      profileCompleted: user.profileCompleted,
      approvedCount: user.approvedCount,
      createdAt: user.createdAt,
    };
  }

  @Patch('profile')
  @UseGuards(JwtGuard)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{
    message: string;
    pointsAwarded: number;
    user: unknown;
  }> {
    try {
      const result = await this.usersService.updateProfile(
        req.user.userId,
        updateProfileDto,
      );

      return {
        message: 'Profile updated successfully',
        pointsAwarded: result.pointsAwarded,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          rank: result.user.rank,
          points: result.user.points,
          isAdmin: result.user.isAdmin,
          phone: result.user.phone,
          city: result.user.city,
          bio: result.user.bio,
          profileImage: result.user.profileImage,
          profileCompleted: result.user.profileCompleted,
        },
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<unknown> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      points: user.points,
      rank: user.rank,
      isAdmin: user.isAdmin,
      phone: user.phone,
      city: user.city,
      bio: user.bio,
      profileImage: user.profileImage,
      profileCompleted: user.profileCompleted,
      approvedCount: user.approvedCount,
      createdAt: user.createdAt,
    };
  }

  @Patch(':id/rank')
  @UseGuards(JwtGuard)
  async updateUserRank(
    @Param('id') id: number,
    @Body() body: { rank: string },
  ): Promise<{ message: string; user: unknown }> {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      const updatedUser = await this.usersService.updateUserRank(id, body.rank);
      
      return {
        message: 'User rank updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          rank: updatedUser.rank,
          points: updatedUser.points,
          isAdmin: updatedUser.isAdmin,
        },
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() body: { firstName?: string; lastName?: string; isAdmin?: boolean },
  ): Promise<{ message: string; user: unknown }> {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      const updatedUser = await this.usersService.updateUser(id, body);
      
      return {
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          rank: updatedUser.rank,
          points: updatedUser.points,
          isAdmin: updatedUser.isAdmin,
        },
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }
}
