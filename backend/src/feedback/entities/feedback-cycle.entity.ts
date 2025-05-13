import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Feedback } from './feedback.entity';
import { FeedbackRequest } from './feedback-request.entity';

export enum CycleStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CycleType {
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
  THREE_SIXTY = '360',
}

@Entity('feedback_cycles')
export class FeedbackCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CycleType,
    default: CycleType.QUARTERLY,
  })
  type: CycleType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: CycleStatus,
    default: CycleStatus.PLANNED,
  })
  status: CycleStatus;

  @Column({ type: 'json', nullable: true })
  feedbackTemplates: any;

  @OneToMany(() => Feedback, (feedback) => feedback.cycleId)
  feedback: Feedback[];

  @OneToMany(() => FeedbackRequest, (request) => request.cycle)
  requests: FeedbackRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}