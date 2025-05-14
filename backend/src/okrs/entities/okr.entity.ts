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
import { User } from '../../users/entities/user.entity';
import { KeyResult } from './key-result.entity';
import { Department } from '../../departments/entities/department.entity';

export enum OkrStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OkrType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
  COMPANY = 'company',
}

export enum OkrFrequency {
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  CUSTOM = 'custom',
}

@Entity('okrs')
export class Okr {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: OkrType,
    default: OkrType.INDIVIDUAL,
  })
  type: OkrType;

  @Column({
    type: 'enum',
    enum: OkrFrequency,
    default: OkrFrequency.QUARTERLY,
  })
  frequency: OkrFrequency;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: OkrStatus,
    default: OkrStatus.DRAFT,
  })
  status: OkrStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column({ name: 'department_id', nullable: true })
  departmentId: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'parent_okr_id', nullable: true })
  parentOkrId: string;

  @ManyToOne(() => Okr, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_okr_id' })
  parentOkr: Okr;

  @OneToMany(() => Okr, (okr) => okr.parentOkr)
  childOkrs: Okr[];

  @ManyToOne(() => User, (user) => user.okrs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => KeyResult, (keyResult) => keyResult.okr, {
    cascade: true,
  })
  keyResults: KeyResult[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}