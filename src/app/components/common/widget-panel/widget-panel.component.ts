import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

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
