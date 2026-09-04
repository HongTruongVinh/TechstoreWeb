import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponse } from "../../../models/models/api-response.model";
import { LinkSettingsService } from "./link-settings.service";
import { ProductRecommendationResponse } from "../../../models/models/chatbot/product-recommendation.model";
import { ChatMessage } from "../../../models/models/chatbot/chat-message.model";
import { AiChatRequest } from "../../../models/models/chatbot/ai-chat-request.model";


const MESSAGES_KEY = 'messages';
@Injectable({ providedIn: 'root' })
export class ChatbotService {

    private messages: ChatMessage[] = [
        { sender: 'ai', text: 'Bạn đang tìm sản phẩm cho nhu cầu nào hôm nay?', time: 'Vừa xong' },
        { sender: 'ai', text: 'Ví dụ: "Tôi muốn mua một chiếc laptop giá từ 15 triệu đến 25 triệu, dùng để lập trình C# và chơi game Elden Ring."', time: 'Vừa xong' },
        // { sender: 'user', text: 'Mình cần một chiếc laptop để học tập và làm việc.', time: 'Vừa xong' },
        // { sender: 'ai', text: 'Tuyệt! Bạn ưu tiên hiệu năng, thời lượng pin hay thiết kế gọn nhẹ? Ngân sách dự kiến của bạn là bao nhiêu?', time: 'Vừa xong' }
    ];

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    sendMessageAsyns(message: AiChatRequest) {
        return this.linkSettingsService
            .getResLinkSetting('Chatbot', 'SendMessage')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Chatbot');
                    }

                    return this.transferHttp.post(apiUrl, message);
                }),
                map((res: ApiResponse<ProductRecommendationResponse>) => res)
            );
    }

    pushMessage(message: ChatMessage): void {
        // this.messages.push(message);
        const messages = this.getMessages() || [];
        messages.push(message);
        sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }

    getMessages(): ChatMessage[] {
        // return this.messages;
        const messageJson = sessionStorage.getItem(MESSAGES_KEY);
        if (messageJson) {
            try {
                return JSON.parse(messageJson) as ChatMessage[];
            }
            catch (e) {
                console.error('Lỗi khi parse cart items từ sessionStorage:', e);
                return [];
            }
        }
        return this.messages;
    }

    clearMessages(): void {
        sessionStorage.removeItem(MESSAGES_KEY);
    }
}