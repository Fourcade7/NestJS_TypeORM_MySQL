import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor( @InjectRepository(User) private readonly userRepository: Repository<User>, ) {}

  // CREATE
  async create(dto:CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // READ ONE
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
    return user;
  }

  // UPDATE
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...dto,
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return this.userRepository.save(user);
  }

  // DELETE
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User o‘chirildi' };
  }
}


/*

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREATE USER
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // FIND ALL USERS
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'surname', 'email', 'createdAt'], // password yashirilgan
    });
  }

  // FIND ONE USER
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'surname', 'email', 'createdAt'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // UPDATE USER
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...dto,
    });
    if (!user) throw new NotFoundException('User not found');

    // Agar password yangilanayotgan bo‘lsa, hash qil
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepository.save(user);
  }

  // UPDATE
  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  // DELETE USER
  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}


*/ 