import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Files {
  @PrimaryGeneratedColumn()
  id: string;

  @Index()
  @Column({ nullable: true })
  string: string;
}
