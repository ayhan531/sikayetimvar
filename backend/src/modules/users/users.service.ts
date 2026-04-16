import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities';

export const POINT_RULES = {
  COMPLAINT_CREATE: 5,
  SAME_COMPANY_REPORT: 4,
  PROFILE_COMPLETION: 15,
  LIKE_GIVEN: 1,
  COMMENT_GIVEN: 2,
  LIKE_RECEIVED: 1,
} as const;

export type ProfileUpdatePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  bio?: string;
  profileImage?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    return this.usersRepository.save(user);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async addPoints(userId: number, points: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.points += points;
    user.approvedCount += 1;
    this.updateRank(user);
    return this.usersRepository.save(user);
  }

  async addActivityPoints(userId: number, points: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.points += points;
    this.updateRank(user);
    return this.usersRepository.save(user);
  }

  private isProfileComplete(user: User): boolean {
    return Boolean(
      user.firstName?.trim() &&
      user.lastName?.trim() &&
      user.phone?.trim() &&
      user.city?.trim() &&
      user.bio?.trim(),
    );
  }

  async updateProfile(
    userId: number,
    payload: ProfileUpdatePayload,
  ): Promise<{ user: User; pointsAwarded: number }> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.firstName = payload.firstName?.trim() || user.firstName;
    user.lastName = payload.lastName?.trim() || user.lastName;
    user.phone = payload.phone?.trim() || user.phone;
    user.city = payload.city?.trim() || user.city;
    user.bio = payload.bio?.trim() || user.bio;
    user.profileImage = payload.profileImage?.trim() || user.profileImage;

    let pointsAwarded = 0;
    if (!user.profileCompleted && this.isProfileComplete(user)) {
      user.profileCompleted = true;
      user.points += POINT_RULES.PROFILE_COMPLETION;
      pointsAwarded = POINT_RULES.PROFILE_COMPLETION;
      this.updateRank(user);
    }

    const savedUser = await this.usersRepository.save(user);
    return { user: savedUser, pointsAwarded };
  }

  private updateRank(user: User): void {
    if (user.points < 11) {
      user.rank = 'Recruit';
    } else if (user.points < 51) {
      user.rank = 'Officer';
    } else if (user.points < 151) {
      user.rank = 'Manager';
    } else {
      user.rank = 'Director';
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'points',
        'rank',
        'approvedCount',
        'profileCompleted',
        'createdAt',
      ],
    });
  }

  async updateUserRank(userId: number, rank: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.rank = rank;
    return this.usersRepository.save(user);
  }

  async updateUser(
    userId: number,
    data: { firstName?: string; lastName?: string; isAdmin?: boolean },
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    if (typeof data.isAdmin === 'boolean') user.isAdmin = data.isAdmin;
    return this.usersRepository.save(user);
  }
}
