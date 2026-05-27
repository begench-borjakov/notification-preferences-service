import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateGlobalPolicyDto } from './dto/create-global-policy.dto';
import { toGlobalPolicyRto } from './mappers/global-policy-rto.mapper';
import { PoliciesService } from './policies.service';
import { GlobalPolicyRto } from './rto/global-policy.rto';

@Controller('global-policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  async findGlobalPolicies(): Promise<GlobalPolicyRto[]> {
    const policies = await this.policiesService.findGlobalPolicies();

    return policies.map(toGlobalPolicyRto);
  }

  @Post()
  async saveGlobalPolicy(
    @Body() dto: CreateGlobalPolicyDto,
  ): Promise<GlobalPolicyRto> {
    const policy = await this.policiesService.saveGlobalPolicy(dto);

    return toGlobalPolicyRto(policy);
  }
}
