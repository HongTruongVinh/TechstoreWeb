import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiStateService {

    navbarVisible$ = new BehaviorSubject(true);
    mobileMenuVisible$ = new BehaviorSubject(true);
    widgetPanelVisible$ = new BehaviorSubject(true);

    hideNavbar() {
        this.navbarVisible$.next(false);
    }
    showNavbar() {
        this.navbarVisible$.next(true);
    }

    hideMobileMenu() {
        this.mobileMenuVisible$.next(false);
    }
    showMobileMenu() {
        this.mobileMenuVisible$.next(true);
    }

    hideWidgetPanel() {
        this.widgetPanelVisible$.next(false);
    }
    showWidgetPanel() {
        this.widgetPanelVisible$.next(true);
    }
}