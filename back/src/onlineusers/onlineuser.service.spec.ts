import { Test, TestingModule } from '@nestjs/testing';
import { OnlineUserService} from './onlineuser.service';

describe('OnlineUserService', () => {
  let service: OnlineUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineUserService],
    }).compile();

    service = module.get<OnlineUserService>(OnlineUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
