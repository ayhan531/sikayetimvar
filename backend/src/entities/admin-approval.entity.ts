import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Evidence } from './evidence.entity';
import { User } from './user.entity';

@Entity('admin_approvals')
export class AdminApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Evidence, (evidence) => evidence.approvals)
  @JoinColumn()
  evidence: Evidence;

  @ManyToOne(() => User, (user) => user.approvals)
  @JoinColumn()
  admin: User;

  @Column()
  approved: boolean;

  @Column({ nullable: true })
  feedback: string;

  @Column({ default: 1 })
  pointsGained: number;

  @CreateDateColumn()
  approvedAt: Date;
}
