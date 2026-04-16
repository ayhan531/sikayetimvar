import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Evidence } from './evidence.entity';
import { ComplaintLike } from './complaint-like.entity';
import { ComplaintComment } from './complaint-comment.entity';

export enum ComplaintStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  OPEN = 'open',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: '' })
  companyName: string;

  @Column({ default: ComplaintStatus.OPEN })
  status: ComplaintStatus;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @ManyToOne(() => User, (user) => user.complaints)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Category, (category) => category.complaints)
  @JoinColumn()
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Evidence, (evidence) => evidence.complaint, {
    cascade: true,
  })
  evidences: Evidence[];

  @OneToMany(() => ComplaintLike, (like) => like.complaint, {
    cascade: true,
  })
  likes: ComplaintLike[];

  @OneToMany(() => ComplaintComment, (comment) => comment.complaint, {
    cascade: true,
  })
  comments: ComplaintComment[];
}
