import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('cookie-parser', () => jest.fn());

describe('Bootstrap', () => {
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      get: jest.fn(),
      use: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app and configure it correctly', async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue(3000),
    };

    mockApp.get.mockReturnValue(mockConfigService);

    const { bootstrap } = await import('./main');
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AuthModule);

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe),
    );

    expect(mockApp.use).toHaveBeenCalledWith(cookieParser());

    expect(mockApp.get).toHaveBeenCalledWith(ConfigService);
    expect(mockConfigService.get).toHaveBeenCalledWith('PORT');

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });
});
