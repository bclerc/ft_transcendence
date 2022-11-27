import { Test, TestingModule } from '@nestjs/testing';
import { WschatService } from './wschat.service';

describe('WschatService', () => {
  let service: WschatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WschatService],
    }).compile();

    service = module.get<WschatService>(WschatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
