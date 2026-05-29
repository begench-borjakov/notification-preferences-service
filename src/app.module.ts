import { Module } from '@nestjs/common';
import { AppConfigModule } from './common/config/config.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { PreferencesModule } from './modules/preferences/preferences.module';

@Module({
  imports: [AppConfigModule, PreferencesModule, PoliciesModule, EvaluationModule],
})
export class AppModule {}
