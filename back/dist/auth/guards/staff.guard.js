"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
class StaffGuard extends jwt_auth_guard_1.JwtAuthGuard {
    constructor() {
        super();
    }
    async canActivate(context) {
        await super.canActivate(context);
        const request = context.switchToHttp().getRequest();
        if (!request.user.staff) {
            throw new common_1.ForbiddenException();
        }
        return true;
    }
}
exports.StaffGuard = StaffGuard;
//# sourceMappingURL=staff.guard.js.map