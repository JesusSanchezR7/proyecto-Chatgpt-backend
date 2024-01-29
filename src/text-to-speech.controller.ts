import { Controller, Post, Body, Res } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { Response } from 'express';
import { ChatService } from './gpt.service';

@Controller('text-to-speech')
export class TextToSpeechController {
    constructor(
        private readonly textToSpeechService: TextToSpeechService,
        private readonly chatService: ChatService,
    ) {}

    @Post('synthesize')
    async synthesize(@Body('text') text: string, @Res() res: Response) {
        try {
            const gptResponse = await this.chatService.chatWithGPT(text);

            const request = {
                input: { text: gptResponse },
                Voice:{
                    languageCode: 'en-US',
                    name: 'en-US-Wavenet-F',
                    ssmlGander: 'FEMALE',                    
                },
                audioConfig: { audioEncoding: 'mp3'}
            }

            const audioContent = await this.textToSpeechService.synthesizeSpeech(request);
            
            res.setHeader('Content-Type', 'audio/mpeg');
            res.end(audioContent);
        } catch(error) {
            console.error(error);
            res.status(404).send('ocurrio un error');
        }
    } 
}