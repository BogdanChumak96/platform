import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: Partial<jest.Mocked<ConfigService>>;
  let jwtService: Partial<jest.Mocked<JwtService>>;

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should set the authentication cookie', async () => {
      const mockUser = {
        _id: 'user123',
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const token = 'mockJwtToken';
      const jwtExpiration = 3600;

      (configService.get as jest.Mock).mockReturnValueOnce(jwtExpiration);
      (jwtService.sign as jest.Mock).mockReturnValueOnce(token);

      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + jwtExpiration);

      await authService.login(mockUser, mockResponse);

      expect(jwtService.sign).toHaveBeenCalledWith({ userId: mockUser._id });
      expect(configService.get).toHaveBeenCalledWith('JWT_EXPIRATION');
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authentication',
        token,
        {
          expires: expires,
          httpOnly: true,
        },
      );
    });
  });
});
