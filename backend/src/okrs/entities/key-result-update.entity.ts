import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { KeyResult } from './key-result.entity';

@Entity('key_result_updates')
export class KeyResultUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => KeyResult, (keyResult) => keyResult.updates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'key_result_id' })
  keyResult: KeyResult;

  @Column()
  keyResultId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;
}