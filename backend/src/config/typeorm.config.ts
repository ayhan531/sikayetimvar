import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  User,
  Rank,
  Category,
  Complaint,
  Evidence,
  AdminApproval,
  ComplaintLike,
  ComplaintComment,
  UserPointEvent,
} from '../entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306') || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'sikayetimvar',
  entities: [
    User,
    Rank,
    Category,
    Complaint,
    Evidence,
    AdminApproval,
    ComplaintLike,
    ComplaintComment,
    UserPointEvent,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};
