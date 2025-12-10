export interface Classifier {
  classifyTopic(
    content: string,
  ): Promise<{ topic: string; isRegulatory: boolean }>;
}
