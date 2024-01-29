import { Injectable, Logger } from "@nestjs/common";
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
    private openai: OpenAI;
    private conversationHistory: {
        role: "user" | "assistant" | "system";
        content: string;
    }[] = [];

    constructor() {
        // Verifica la configuración de la variable de entorno OPENAI_API_KEY
        if (!process.env.OPENAI_API_KEY) {
            Logger.error('La variable de entorno OPENAI_API_KEY no está configurada.');
        } else {
            Logger.log('Valor de OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
        }

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async chatWithGPT(content: string) {
        this.conversationHistory.push({
            role: 'user',
            content: content,
        });

        const chatCompletion = await this.openai.chat.completions.create({
            messages: [
                { role: "system", content: "you are a helpful assistant" },
                ...this.conversationHistory.map(message => ({
                    role: message.role,
                    content: message.content
                }))
            ],
            model: 'gpt-3.5-turbo', // 'turb' changed to 'turbo'
        });

        this.conversationHistory.push({
            role: 'assistant',
            content: chatCompletion.choices[0].message.content,
        });

        return chatCompletion.choices[0].message.content;
    }
}
