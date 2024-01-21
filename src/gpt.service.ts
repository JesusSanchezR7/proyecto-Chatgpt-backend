import { Injectable } from "@nestjs/common";
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
    private openai: OpenAI;
    private conversationHistory: {
        role: "function" | "user" | "system" | "assistant";
        content: string;
    }[] = [];

    constructor() {
        this.openai = new OpenAI({
            apiKey: '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',
        });
    }

    async chatWithGPT(content: string) {
        this.conversationHistory.push({
            role: 'user',
            content: content,
        });

        const chatCompletation = await this.openai.chat.completions.create({
            messages: [
                { role: "system", content: "soy tu asistente" },
                //...this.conversationHistory
            ],
            model: 'gpt-3.5-turbo',
        });

        this.conversationHistory.push({
            role: 'assistant',
            content: chatCompletation.choices[0].message.content,
        });

        return chatCompletation.choices[0].message.content;
    }
}
