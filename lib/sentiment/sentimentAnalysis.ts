import { pipeline } from '@xenova/transformers';

class SentimentAnalysis {
    private static pipelinePromise: Promise<any> | null = null;
    private static model: any = null;

    static async initialize() {
        if (this.model) return this.model;
        
        if (!this.pipelinePromise) {
            this.pipelinePromise = pipeline('sentiment-analysis');
        }
        
        this.model = await this.pipelinePromise;
        return this.model;
    }

    static async analyze(text: string) {
        const model = await this.initialize();
        return await model(text);
    }
}

export async function analyzeSentiment(text: string) {
    return SentimentAnalysis.analyze(text);
}