import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
export declare class StaffGuard extends JwtAuthGuard {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
