import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from "sweetalert2";

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

  constructor(
    ){}

  openMesage() {
    Swal.fire({
      title: 'Chú ý',
      text: `Website này được lập ra với mục đích học tập và thử nghiệm, sẽ không có đơn hàng thật nào được gửi đến bạn. Bạn có thể đăng nhập bằng SĐT "0345600000", mật khẩu "Abcd1234", dùng mã Voucher "D99" để thử nghiệm chức năng thanh toán bằng mã QR với giá được giảm 99.99%.`,
      icon: 'warning',
      confirmButtonColor: '#dfe777ff',
      confirmButtonText: 'OK',
      showCancelButton: false,
    })
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
