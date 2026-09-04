import { ProductRecommendation } from "./product-recommendation.model";

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  time: string;

  recommendationProducts?: ProductRecommendation[];
}


export type MessageSender = 'ai' | 'user';