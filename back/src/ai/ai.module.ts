import { Module } from '@nestjs/common';
import { AiClassificationService } from './application/ai-classification.service';
import { OpenAiClassifier } from './infrastructure/open-ai.classifier';

@Module({
  providers: [AiClassificationService, OpenAiClassifier],
  exports: [AiClassificationService, OpenAiClassifier],
})
export class AiModule {}
