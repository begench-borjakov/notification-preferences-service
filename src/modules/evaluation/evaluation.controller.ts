import { Body, Controller, Post } from '@nestjs/common';
import { EvaluateNotificationDto } from './dto/evaluate-notification.dto';
import { EvaluationService } from './evaluation.service';
import { toEvaluationResultRto } from './mappers/evaluation-result-rto.mapper';
import { EvaluationResultRto } from './rto/evaluation-result.rto';

@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async evaluate(@Body() dto: EvaluateNotificationDto): Promise<EvaluationResultRto> {
    const result = await this.evaluationService.evaluate({
      userId: dto.userId,
      notificationType: dto.notificationType,
      channel: dto.channel,
      region: dto.region,
      datetime: new Date(dto.datetime),
    });

    return toEvaluationResultRto(result);
  }
}
