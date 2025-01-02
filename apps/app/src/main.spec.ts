import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('Bootstrap', () => {
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      get: jest.fn(),
      listen: jest.fn(),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app and listen on the specified port', async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue(3000),
    };
    mockApp.get.mockReturnValue(mockConfigService);

    const { bootstrap } = await import('./main');
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockApp.get).toHaveBeenCalledWith(ConfigService);
    expect(mockConfigService.get).toHaveBeenCalledWith('PORT');
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });
});
