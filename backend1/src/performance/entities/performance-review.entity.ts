import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReviewComment } from './review-comment.entity';

export enum ReviewStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ACKNOWLEDGED = 'acknowledged',
  FINALIZED = 'finalized',
}

export enum ReviewType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  CUSTOM = 'custom',
}

@Entity('performance_reviews')
export class PerformanceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ReviewType,
    default: ReviewType.QUARTERLY,
  })
  type: ReviewType;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.DRAFT,
  })
  status: ReviewStatus;

  @Column({ type: 'json', nullable: true })
  ratings: Record<string, number>;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overallRating: number;

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @Column({ type: 'text', nullable: true })
  areasForImprovement: string;

  @Column({ type: 'text', nullable: true })
  goalsForNextPeriod: string;

  @Column({ type: 'text', nullable: true })
  additionalComments: string;

  @ManyToOne(() => User, (user) => user.performanceReviews)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @Column()
  employeeId: string;

  @ManyToOne(() => User, (user) => user.reviewsGiven)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column()
  reviewerId: string;

  @OneToMany(() => ReviewComment, (comment) => comment.review, {
    cascade: true,
  })
  comments: ReviewComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}