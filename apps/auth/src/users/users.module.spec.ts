import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from '@app/common';

describe('UsersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    const usersModule = module.get<UsersModule>(UsersModule);
    expect(usersModule).toBeDefined();
  });

  it('should include UsersController', () => {
    const usersController = module.get<UsersController>(UsersController);
    expect(usersController).toBeDefined();
  });

  it('should include UsersService', () => {
    const usersService = module.get<UsersService>(UsersService);
    expect(usersService).toBeDefined();
  });

  it('should include UsersRepository', () => {
    const usersRepository = module.get<UsersRepository>(UsersRepository);
    expect(usersRepository).toBeDefined();
  });

  it('should include DatabaseModule', () => {
    const databaseModule = module.get<DatabaseModule>(DatabaseModule);
    expect(databaseModule).toBeDefined();
  });

  it('should export UsersService', () => {
    const exportedUsersService = module.get<UsersService>(UsersService);
    expect(exportedUsersService).toBeDefined();
  });
});
