import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UnprocessableEntityException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Partial<jest.Mocked<UsersRepository>>;

  beforeEach(async () => {
    usersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a new user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    (usersRepository.findOne as jest.Mock).mockRejectedValueOnce(new Error());
    (usersRepository.create as jest.Mock).mockResolvedValueOnce(createUserDto);

    const result = await usersService.create(createUserDto);

    expect(usersRepository.findOne).toHaveBeenCalledWith({
      email: createUserDto.email,
    });
    expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createUserDto);
  });

  it('should throw an error if email already exists', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    (usersRepository.findOne as jest.Mock).mockResolvedValueOnce(createUserDto);

    await expect(usersService.create(createUserDto)).rejects.toThrow(
      UnprocessableEntityException,
    );
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      email: createUserDto.email,
    });
    expect(usersRepository.create).not.toHaveBeenCalled();
  });

  it('should return the user when credentials are valid', async () => {
    const user = { email: 'test@example.com', password: 'hashedpassword' };
    (usersRepository.findOne as jest.Mock).mockResolvedValueOnce(user);
    jest.spyOn(bcryptjs, 'compare').mockResolvedValueOnce(true as never);

    const result = await usersService.verifyUser(user.email, 'password123');

    expect(usersRepository.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(bcryptjs.compare).toHaveBeenCalledWith('password123', user.password);
    expect(result).toEqual(user);
  });
});
