import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: Partial<jest.Mocked<UsersService>>;
  let configService: Partial<jest.Mocked<ConfigService>>;

  beforeEach(async () => {
    usersService = {
      getUser: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UsersService, useValue: usersService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return a user when validation is successful', async () => {
      const userId = 'user123';
      const tokenPayload = { userId };
      const mockUser = { _id: userId, email: 'test@example.com' };

      (usersService.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await jwtStrategy.validate(tokenPayload);

      expect(usersService.getUser).toHaveBeenCalledWith({ _id: userId });
      expect(result).toEqual(mockUser);
    });
  });
});
