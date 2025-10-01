import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hash = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hash,
      });

      return newUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError as {
          message: string;
          code: string;
        };

        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username существует',
          );
        }
      }
    }
  }

  getCurrentUser(userId: number) {
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: number) {
    const userToUpdate = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        password: true,
      },
      where: {
        id: userId,
      },
    });

    if (!userToUpdate) {
      throw new BadRequestException('Пользователь не найден');
    }

    for (const key in updateUserDto) {
      if (key === 'password') {
        const hash = await bcrypt.hash(userToUpdate.password, 10);
        console.log('hash', hash);
        userToUpdate.password = hash;
      } else if (updateUserDto[key]) {
        userToUpdate[key] = updateUserDto[key];
      }
    }

    try {
      const user = await this.userRepository.save(userToUpdate);

      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError as {
          message: string;
          code: string;
        };

        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username существует',
          );
        }
      }
    }
  }

  async getCurrentUserWishes(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishes: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return user.wishes;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        username: true,
        about: true,
      },
      where: {
        username,
      },
    });
    return user;
  }

  async getWishesByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
        offers: true,
      },
    });
    if (!user)
      throw new BadRequestException('Пользователь с таким username не найден');
    return user.wishes;
  }

  async findManyUsers(query: string) {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }
}
