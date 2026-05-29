import { Module } from '@nestjs/common';
import { LoggerModule } from '../../common/logger/logger.module';
import { PrismaModule } from '../../database/prisma.module';
import { PreferencesController } from './preferences.controller';
import { PreferencesRepository } from './preferences.repository';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [PreferencesController],
  providers: [PreferencesService, PreferencesRepository],
  exports: [PreferencesService],
})
export class PreferencesModule {}
