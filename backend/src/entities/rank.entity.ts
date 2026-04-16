import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ranks')
export class Rank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  minPoints: number;

  @Column()
  maxPoints: number;

  @Column()
  color: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  canApproveEvidence: boolean;

  @Column({ default: false })
  canDeleteComplaints: boolean;

  @Column({ default: false })
  canEditOtherComplaints: boolean;
}
