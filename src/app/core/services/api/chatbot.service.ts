import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponse } from "../../../models/models/api-response.model";
import { LinkSettingsService } from "./link-settings.service";
import { AiChatResponse } from "../../../models/models/chatbot/product-recommendation.model";
import { ChatMessage } from "../../../models/models/chatbot/chat-message.model";
import { AiChatRequest } from "../../../models/models/chatbot/ai-chat-request.model";
import { TokenStorageService } from "../ui/token-storage.service";


const MESSAGES_KEY = 'messages';
const CONVERSATION_ID = 'conversation';
@Injectable({ providedIn: 'root' })
export class ChatbotService {

    private messages: ChatMessage[] = [
        { sender: 'ai', text: 'Bạn đang tìm sản phẩm cho nhu cầu nào hôm nay?', time: 'Vừa xong' },
        { sender: 'ai', text: 'Ví dụ: "Tôi muốn mua một chiếc laptop giá từ 15 triệu đến 25 triệu, dùng để lập trình C# và chơi game Elden Ring."', time: 'Vừa xong' },
        // { sender: 'user', text: 'Mình cần một chiếc laptop để học tập và làm việc.', time: 'Vừa xong' },
        // { sender: 'ai', text: 'Tuyệt! Bạn ưu tiên hiệu năng, thời lượng pin hay thiết kế gọn nhẹ? Ngân sách dự kiến của bạn là bao nhiêu?', time: 'Vừa xong' }
    ];

    private conversationId: string | null = null;

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService,
        private tks: TokenStorageService
    ) { }

    sendMessageAsyns(message: AiChatRequest) {
        return this.linkSettingsService
            .getResLinkSetting('Chatbot', 'SendMessage')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Chatbot');
                    }

                    return this.transferHttp.post(apiUrl, message, undefined, this.tks.getGuestId() || undefined);
                }),
                map((res: ApiResponse<AiChatResponse>) => res)
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

    setConversationId(conversationId: string): void {
        this.conversationId = conversationId;
        sessionStorage.setItem(CONVERSATION_ID, conversationId);
    }

    getConversationId(): string | null {
        if (this.conversationId) {
            return this.conversationId;
        }
        const storedId = sessionStorage.getItem(CONVERSATION_ID);
        if (storedId) {
            this.conversationId = storedId;
            return storedId;
        }
        return null;
    }
}