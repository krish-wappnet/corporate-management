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
import { KpiUpdate } from './kpi-update.entity';

export enum KpiStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum KpiType {
  QUANTITATIVE = 'quantitative',
  QUALITATIVE = 'qualitative',
}

@Entity('kpis')
export class Kpi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: KpiType,
    default: KpiType.QUANTITATIVE,
  })
  type: KpiType;

  @Column({ type: 'json', nullable: true })
  metrics: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  targetValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: KpiStatus,
    default: KpiStatus.DRAFT,
  })
  status: KpiStatus;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.kpis)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => KpiUpdate, (update) => update.kpi)
  updates: KpiUpdate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}