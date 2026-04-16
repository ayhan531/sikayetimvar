export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
  rank: string;
  approvedCount: number;
  createdAt: Date;
}

export class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  bio?: string;
  profileImage?: string;
}
