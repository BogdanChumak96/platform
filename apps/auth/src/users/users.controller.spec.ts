import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: Partial<jest.Mocked<UsersService>>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDTO = {
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = { ...createUserDto, id: 'userId' };
      (usersService.create as jest.Mock).mockResolvedValueOnce(createdUser);

      const result = await usersController.createUser(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });
});
