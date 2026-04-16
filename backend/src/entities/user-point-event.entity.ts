import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_point_events')
@Unique(['user', 'actionType', 'referenceKey'])
export class UserPointEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.pointEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column()
  actionType: string;

  @Column()
  referenceKey: string;

  @Column({ default: 0 })
  points: number;

  @CreateDateColumn()
  createdAt: Date;
}
