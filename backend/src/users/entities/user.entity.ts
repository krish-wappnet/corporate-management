import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';
import { Kpi } from '../../kpis/entities/kpi.entity';
import { Okr } from '../../okrs/entities/okr.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { PerformanceReview } from '../../performance/entities/performance-review.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.EMPLOYEE],
  })
  roles: Role[];

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  department: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'manager_id' })
  manager: User | null;

  @OneToMany(() => Kpi, (kpi) => kpi.user)
  kpis: Kpi[];

  @OneToMany(() => Okr, (okr) => okr.user)
  okrs: Okr[];

  @OneToMany(() => Feedback, (feedback) => feedback.fromUser)
  givenFeedback: Feedback[];

  @OneToMany(() => Feedback, (feedback) => feedback.toUser)
  receivedFeedback: Feedback[];

  @OneToMany(() => PerformanceReview, (review) => review.employee)
  performanceReviews: PerformanceReview[];

  @OneToMany(() => PerformanceReview, (review) => review.reviewer)
  reviewsGiven: PerformanceReview[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'user_reports',
    joinColumn: { name: 'manager_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'id' },
  })
  directReports: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}