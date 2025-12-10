import OpenAI from 'openai';
import { Classifier } from '../domain/interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAiClassifier implements Classifier {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async classifyTopic(
    prompt: string,
  ): Promise<{ topic: string; isRegulatory: boolean }> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const text = response.choices[0].message?.content;
    try {
      return JSON.parse(text) as { topic: string; isRegulatory: boolean };
    } catch {
      return { topic: 'Unknown', isRegulatory: false };
    }
  }
}
