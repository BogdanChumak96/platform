import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/models/user.schema';
import { Response } from 'express';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<jest.Mocked<AuthService>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should call AuthService.login and send the user in response', async () => {
      const mockUser: UserDocument = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedpassword',
      } as unknown as UserDocument;

      const mockResponse = {
        send: jest.fn(),
      } as unknown as Response;

      await authController.login(mockUser, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockUser, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });
  });
});
