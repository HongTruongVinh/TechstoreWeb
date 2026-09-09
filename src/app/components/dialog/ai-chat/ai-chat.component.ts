import { DialogRef } from '@angular/cdk/dialog';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../../core/services/api/chatbot.service';
import { FullImageUrlPipe } from "../../../pipes/full-image-url.pipe";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SystemConfigService } from '../../../core/services/api/system-config.service';
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, FullImageUrlPipe],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements AfterViewChecked, AfterViewInit {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('chatContent') private chatContent?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLTextAreaElement>;
  private dialogRef = inject(DialogRef);
  private shouldScrollToBottom = true;

  draftMessage = '';
  isTyping = false;

  suggestions = ['Tư vấn laptop', 'Tai nghe dưới 2 triệu', 'Điện thoại chơi Liên Quân'];

  chatbotService = inject(ChatbotService);
  router = inject(Router);
  systemConfigService = inject(SystemConfigService);
  tks = inject(TokenStorageService);

  ngAfterViewChecked(): void {
    if (!this.shouldScrollToBottom || !this.chatContent) return;

    this.shouldScrollToBottom = false;
    this.chatContent.nativeElement.scrollTo({
      top: this.chatContent.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  ngAfterViewInit(): void {
    this.adjustInputHeight();
  }

  adjustInputHeight(): void {
    const input = this.messageInput?.nativeElement;
    if (!input) return;

    input.style.height = '44px';
    const maxHeight = 120;
    input.style.height = `${Math.min(input.scrollHeight, maxHeight)}px`;
    input.style.overflowY = input.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  closeChat(): void {
    this.closed.emit();
    this.dialogRef.close();
  }

  notificationMessage(message = this.draftMessage): void {
    const text = message.trim();
    if (!text || this.isTyping) return;

    this.chatbotService.pushMessage({ sender: 'user', text, time: 'Vừa xong' });
    this.draftMessage = '';
    this.adjustInputHeight();
    this.isTyping = true;

    window.setTimeout(() => {
      this.chatbotService.pushMessage({ sender: 'ai', text: 'AI đang được bảo trì, vui lòng quay lại sau.', time: 'Vừa xong' });
      this.isTyping = false;
    }, 700);
  }

  sendMessage(message = this.draftMessage): void {
    const text = message.trim();
    if (!text || this.isTyping) return;

    if (this.systemConfigService.getSystemConfigsFromSession()?.isAiChatbotEnabled) {

      this.shouldScrollToBottom = true;
      this.chatbotService.pushMessage({ sender: 'user', text, time: 'Vừa xong' });
      this.draftMessage = '';
      this.adjustInputHeight();
      this.isTyping = true;

      const aiChatRequest = {
        message: message,
        conversationId: this.chatbotService.getConversationId() || undefined,
      };

      this.chatbotService.sendMessageAsyns(aiChatRequest).subscribe({
        next: (res) => {
          if (res && res.data) {
            var aiMessage: any = { sender: 'ai', text: res.data.content, time: 'Vừa xong' };
            if (res.data.recommendations && res.data.recommendations.length > 0) {
              aiMessage.recommendationProducts = res.data.recommendations;
            }

            if(res.data.guestId != null) {
              this.tks.saveGuestId(res.data.guestId);
            }

            if (res.data.conversationId && this.chatbotService.getConversationId() === null) {
              this.chatbotService.setConversationId(res.data.conversationId);
            }

            this.chatbotService.pushMessage(aiMessage);

          } else {
            this.chatbotService.pushMessage({ sender: 'ai', text: 'Xin lỗi, mình không tìm thấy sản phẩm phù hợp với nhu cầu của bạn.', time: 'Vừa xong' });
          }
          this.shouldScrollToBottom = true;
          this.isTyping = false;
        },
        error: (err) => {
          console.error('Lỗi khi gửi tin nhắn đến API Chatbot:', err);
          this.chatbotService.pushMessage({ sender: 'ai', text: 'Xin lỗi, đã xảy ra lỗi khi kết nối với dịch vụ Chatbot.', time: 'Vừa xong' });
          this.shouldScrollToBottom = true;
          this.isTyping = false;
        }
      });
    }
    else {
      this.notificationMessage(message);
    }
  }

  viewProductDetails(slugWithId: string) {
    this.closeChat();
    this.router.navigate(['', slugWithId]);
  }

  buildProductUrl(slug: string, id: string): string {
    return `${slug}-i.${id}`;
  }
}
