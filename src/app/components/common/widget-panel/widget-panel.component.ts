import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from "sweetalert2";
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { AiChatComponent } from '../../dialog/ai-chat/ai-chat.component';
import { SystemConfigService } from '../../../core/services/api/system-config.service';

@Component({
  selector: 'app-widget-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-panel.component.html',
  styleUrl: './widget-panel.component.scss'
})
export class WidgetPanelComponent {
  isVisibleScrollTop = false;
  phoneNumber = '0393574180';

  private aiChatDialogRef?: DialogRef<unknown, AiChatComponent>;
  private dialog = inject(Dialog);
  systemConfigService = inject(SystemConfigService);

  constructor(
  ) { }

  ngOnInit(): void {

  }

  openMesage() {
    Swal.fire({
      title: 'Chú ý',
      text: `Website này được lập ra với mục đích học tập và thử nghiệm, sẽ không có đơn hàng thật nào được gửi đến bạn. Bạn có thể đăng nhập bằng SĐT "0345678900", mật khẩu "Abcd1234", dùng mã Voucher "D99" để thử nghiệm chức năng thanh toán bằng mã QR với giá được giảm 99.99%.`,
      icon: 'warning',
      confirmButtonColor: '#dfe777ff',
      confirmButtonText: 'OK',
      showCancelButton: false,
    })
  }

  openAiChat() {
    if (this.aiChatDialogRef) {
          return; // dialog đang mở, không mở thêm
        }
    
        this.aiChatDialogRef = this.dialog.open(
          AiChatComponent,
          {
            id: 'ai-chat-modal',
          }
        );
    
        this.aiChatDialogRef.closed.subscribe(result => {
          this.aiChatDialogRef = undefined; // reset dialog ref khi đóng
        });
  }

  openMessenger() {
    window.open(
      'https://m.me/your_facebook_page',
      '_blank'
    );
  }

  openZalo() {
    window.open(`https://zalo.me/${this.phoneNumber}`, '_blank');
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isVisibleScrollTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
