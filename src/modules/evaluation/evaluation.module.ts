import { Module } from '@nestjs/common';
import { LoggerModule } from '../../common/logger/logger.module';
import { PoliciesModule } from '../policies/policies.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [PreferencesModule, PoliciesModule, LoggerModule],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
