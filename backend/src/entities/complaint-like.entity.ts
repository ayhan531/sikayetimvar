import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Complaint } from './complaint.entity';
import { User } from './user.entity';

@Entity('complaint_likes')
@Unique(['complaint', 'user'])
export class ComplaintLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Complaint, (complaint) => complaint.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  complaint: Complaint;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
