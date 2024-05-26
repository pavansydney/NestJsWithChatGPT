import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class ChatgptService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCompletion(prompt: string): Promise<AxiosResponse<any>> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    };

    let attempts = 0;
    const maxAttempts = 5;
    const delayMs = 2000;

    while (attempts < maxAttempts) {
      try {
        return await this.httpService.post(this.apiUrl, data, { headers }).toPromise();
      } catch (error) {
        if (error.response && error.response.status === 429) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
          }
          await this.delay(delayMs);
        } else {
          throw error;
        }
      }
    }
  }
}
