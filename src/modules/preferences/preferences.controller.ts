import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { toUserPreferencesRto } from './mappers/user-preferences-rto.mapper';
import { PreferencesService } from './preferences.service';
import { UserPreferencesRto } from './rto/user-preferences.rto';

@Controller('users/:id/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  async getUserPreferences(@Param('id') userId: string): Promise<UserPreferencesRto> {
    const overview = await this.preferencesService.getUserPreferences(userId);

    return toUserPreferencesRto(overview);
  }

  @Post()
  async updateUserPreferences(
    @Param('id') userId: string,
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesRto> {
    const overview = await this.preferencesService.updateUserPreferences(userId, dto);

    return toUserPreferencesRto(overview);
  }
}
