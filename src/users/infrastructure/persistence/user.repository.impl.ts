import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/domain/entities/user.entity';
import { UserRepository } from '@users/domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}