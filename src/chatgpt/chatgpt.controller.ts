import { Query, Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service'
import { AxiosResponse } from 'axios';

@Controller('chatgpt')
export class ChatgptController {
    constructor(private readonly chatgptService: ChatgptService) {

    }
    @Get('completion')
    async getCompletion(@Query('prompt') prompt: string): Promise<AxiosResponse<any>> {
        try {
            return await this.chatgptService.getCompletion(prompt);
        } catch (error) {
            if (error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS) {
                throw new HttpException('Too Many Requests - Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
            }
            throw error;
        }
    }
}
