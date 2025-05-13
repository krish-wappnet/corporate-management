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

export enum FeedbackType {
  PEER = 'peer',
  MANAGER = 'manager',
  SELF = 'self',
  UPWARD = 'upward',
  THREE_SIXTY = '360',
}

export enum FeedbackStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ACKNOWLEDGED = 'acknowledged',
}

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FeedbackType,
    default: FeedbackType.PEER,
  })
  type: FeedbackType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  ratings: Record<string, number>;

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ type: 'text', nullable: true })
  improvements: string;

  @Column({
    type: 'enum',
    enum: FeedbackStatus,
    default: FeedbackStatus.DRAFT,
  })
  status: FeedbackStatus;

  @Column({ nullable: true })
  cycleId: string;

  @ManyToOne(() => User, (user) => user.givenFeedback)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @Column()
  fromUserId: string;

  @ManyToOne(() => User, (user) => user.receivedFeedback)
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @Column()
  toUserId: string;

  @Column({ nullable: true })
  requestId: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}