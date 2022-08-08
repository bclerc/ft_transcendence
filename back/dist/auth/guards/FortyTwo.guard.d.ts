import { CanActivate, ExecutionContext } from '@nestjs/common';
declare const FortyTwoGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FortyTwoGuard extends FortyTwoGuard_base {
    canActivate(context: ExecutionContext): Promise<any>;
}
export declare class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<any>;
}
export {};
