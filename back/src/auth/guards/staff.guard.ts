import { CanActivate, ExecutionContext, Type, mixin, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import { JwtAuthGuard } from './jwt-auth.guard';

export class StaffGuard extends JwtAuthGuard {
      constructor() {
        super();
      }
      async canActivate(context: ExecutionContext) {
        await super.canActivate(context);
        const request = context.switchToHttp().getRequest();
        if (!request.user.staff) {
            throw new ForbiddenException();
        }
        return true;
    }
}
