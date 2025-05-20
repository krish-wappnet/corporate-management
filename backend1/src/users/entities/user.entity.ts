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
import { Department } from '../../departments/entities/department.entity';

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

  @Column({
    name: 'manager_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Stores the manager ID as a string (e.g., "john-doe-123")',
  })
  managerId: string | null;

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

  @OneToMany(() => Department, (department) => department.manager)
  managedDepartments: Department[];

  // Direct reports are now handled through the managerId field in the service layer

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}