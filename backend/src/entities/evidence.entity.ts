import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Complaint } from './complaint.entity';
import { AdminApproval } from './admin-approval.entity';

export enum EvidenceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('evidences')
export class Evidence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileType: string;

  @Column()
  description: string;

  @Column({ default: EvidenceStatus.PENDING })
  status: EvidenceStatus;

  @ManyToOne(() => Complaint, (complaint) => complaint.evidences)
  @JoinColumn()
  complaint: Complaint;

  @CreateDateColumn()
  uploadedAt: Date;

  @OneToMany(() => AdminApproval, (approval) => approval.evidence, {
    cascade: true,
  })
  approvals: AdminApproval[];
}
