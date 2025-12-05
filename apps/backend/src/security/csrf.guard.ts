import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const method = String(req.method || 'GET').toUpperCase();
    const needsCsrf = /^(POST|PUT|PATCH|DELETE)$/.test(method);
    if (!needsCsrf) return true;
    const url = String(req.originalUrl || req.url || '');
    if (/^\/api\/csrf(\b|\/)?.*/.test(url)) return true;
    if (/^\/api\/auth\/(login|refresh)(\b|\/)?.*/.test(url)) return true;
    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = req.cookies?.['XSRF-TOKEN'];
    if (
      !headerToken ||
      !cookieToken ||
      String(headerToken) !== String(cookieToken)
    ) {
      throw new ForbiddenException('CSRF token invalid');
    }
    return true;
  }
}
