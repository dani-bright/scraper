import { Injectable } from '@nestjs/common';
import { OpenAiClassifier } from '../infrastructure/open-ai.classifier';
import { CHARACTER_LIMIT } from 'src/shared/constants';

@Injectable()
export class AiClassificationService {
  constructor(private readonly classifier: OpenAiClassifier) {}

  async classifyRegulation(
    content: string,
  ): Promise<{ topic: string; isRegulatory: boolean }> {
    let cleanedContent = content.trim();
    cleanedContent =
      content.length > CHARACTER_LIMIT
        ? content.slice(0, CHARACTER_LIMIT)
        : content;

    const prompt = `
You receive an article text. Determine the main topic and if it is a regulatory/legal topic.
Return JSON with keys: "topic" (main topic) and "isRegulatory" (true/false).

Article:
"""${cleanedContent}"""
`;

    return this.classifier.classifyTopic(prompt);
  }
}
