import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Complaint,
  ComplaintComment,
  ComplaintLike,
  Evidence,
  UserPointEvent,
} from '../../entities';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Complaint,
      Evidence,
      ComplaintLike,
      ComplaintComment,
      UserPointEvent,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
