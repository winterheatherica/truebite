import { pipeline } from '@xenova/transformers';

class SentimentAnalysis {
    private model: any;
    
    constructor() {
        this.model = null;
    }

    async initialize() {
        this.model = await pipeline('sentiment-analysis');
    }

    async analyze(text: string) {
        if (!this.model) {
            throw new Error('Model not initialized');
        }
        return await this.model(text);
    }
}

export async function analyzeSentiment(text: string) {
    const sentimentAnalysis = new SentimentAnalysis();
    return sentimentAnalysis.initialize().then(() => sentimentAnalysis.analyze(text));
}