import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CboController } from './cbo.controller';
import { CboService } from './cbo.service';
import { Cbo } from './cbo.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cbo])],
    controllers: [CboController],
    providers: [CboService],
    exports: [CboService]
})
export class CboModule { }
