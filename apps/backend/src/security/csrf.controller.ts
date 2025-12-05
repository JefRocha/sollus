import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller('csrf')
export class CsrfController {
  @Get()
  getToken(@Req() req: Request, @Res() res: Response) {
    const existing = req.cookies?.['XSRF-TOKEN'];
    const token = existing || crypto.randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'none',
      path: '/',
    });
    return { csrfToken: token };
  }
}
