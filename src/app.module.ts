import { Module } from '@nestjs/common';
import { AppConfigModule } from './common/config/config.module';
import { PreferencesModule } from './modules/preferences/preferences.module';

@Module({
  imports: [AppConfigModule, PreferencesModule],
})
export class AppModule {}
