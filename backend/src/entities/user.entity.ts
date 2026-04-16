import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Complaint } from './complaint.entity';
import { AdminApproval } from './admin-approval.entity';
import { ComplaintLike } from './complaint-like.entity';
import { ComplaintComment } from './complaint-comment.entity';
import { UserPointEvent } from './user-point-event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 'Recruit' })
  rank: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: false })
  profileCompleted: boolean;

  @Column({ default: 0 })
  approvedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @OneToMany(() => AdminApproval, (approval) => approval.admin)
  approvals: AdminApproval[];

  @OneToMany(() => ComplaintLike, (like) => like.user)
  likes: ComplaintLike[];

  @OneToMany(() => ComplaintComment, (comment) => comment.user)
  comments: ComplaintComment[];

  @OneToMany(() => UserPointEvent, (pointEvent) => pointEvent.user)
  pointEvents: UserPointEvent[];
}
