import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CsrfGuard } from './csrf.guard';
import { CsrfController } from './csrf.controller';

@Module({
  controllers: [CsrfController],
  providers: [{ provide: APP_GUARD, useClass: CsrfGuard }],
})
export class SecurityModule {}
