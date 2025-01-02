import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let usersService: Partial<jest.Mocked<UsersService>>;

  beforeEach(async () => {
    usersService = {
      verifyUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 'user123', email };

      (usersService.verifyUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await localStrategy.validate(email, password);

      expect(usersService.verifyUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      (usersService.verifyUser as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.verifyUser).toHaveBeenCalledWith(email, password);
    });
  });
});
