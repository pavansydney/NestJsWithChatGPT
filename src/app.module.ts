import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ChatgptController } from './chatgpt/chatgpt.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    HttpModule,
  ],
  controllers: [AppController, ChatgptController],
  providers: [AppService, ChatgptService],
})
export class AppModule {}
