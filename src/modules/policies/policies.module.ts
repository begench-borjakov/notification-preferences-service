import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { PoliciesController } from './policies.controller';
import { PoliciesRepository } from './policies.repository';
import { PoliciesService } from './policies.service';

@Module({
  imports: [PrismaModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, PoliciesRepository],
  exports: [PoliciesService],
})
export class PoliciesModule {}
