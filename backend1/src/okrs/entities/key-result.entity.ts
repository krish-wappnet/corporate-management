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
import { Okr } from './okr.entity';
import { KeyResultUpdate } from './key-result-update.entity';

export enum KeyResultType {
  BINARY = 'binary',
  PERCENTAGE = 'percentage',
  NUMBER = 'number',
  CURRENCY = 'currency',
}

@Entity('key_results')
export class KeyResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: KeyResultType,
    default: KeyResultType.PERCENTAGE,
  })
  type: KeyResultType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  startValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @ManyToOne(() => Okr, (okr) => okr.keyResults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'okr_id' })
  okr: Okr;

  @Column()
  okrId: string;

  @OneToMany(() => KeyResultUpdate, (update) => update.keyResult, {
    cascade: true,
  })
  updates: KeyResultUpdate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}