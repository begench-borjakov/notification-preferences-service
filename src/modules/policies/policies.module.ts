import { Module } from '@nestjs/common';
import { LoggerModule } from '../../common/logger/logger.module';
import { PrismaModule } from '../../database/prisma.module';
import { PoliciesController } from './policies.controller';
import { PoliciesRepository } from './policies.repository';
import { PoliciesService } from './policies.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, PoliciesRepository],
  exports: [PoliciesService],
})
export class PoliciesModule {}
