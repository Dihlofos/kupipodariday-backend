import { IsOptional, IsUrl, Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column({ default: '' })
  @Length(0, 1500)
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlist)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}
