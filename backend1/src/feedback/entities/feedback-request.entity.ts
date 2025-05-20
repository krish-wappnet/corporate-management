import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FeedbackCycle } from './feedback-cycle.entity';
import { FeedbackType } from './feedback.entity';

export enum RequestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

@Entity('feedback_requests')
export class FeedbackRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FeedbackType,
    default: FeedbackType.PEER,
  })
  type: FeedbackType;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column()
  requesterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column()
  recipientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'subject_id' })
  subject: User;

  @Column()
  subjectId: string;

  @ManyToOne(() => FeedbackCycle, (cycle) => cycle.requests)
  @JoinColumn({ name: 'cycle_id' })
  cycle: FeedbackCycle;

  @Column({ nullable: true })
  cycleId: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}