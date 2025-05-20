import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PerformanceReview } from './performance-review.entity';

@Entity('review_comments')
export class ReviewComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => PerformanceReview, (review) => review.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_id' })
  review: PerformanceReview;

  @Column()
  reviewId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;
}