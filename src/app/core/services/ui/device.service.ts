import { Injectable, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    isMobile = signal(false);
    isTablet = signal(false);

    constructor(private bp: BreakpointObserver) {

        this.bp.observe('(max-width:768px)')
            .subscribe(r => this.isMobile.set(r.matches));

        this.bp.observe('(min-width:769px) and (max-width:1024px)')
            .subscribe(r => this.isTablet.set(r.matches));

    }
}
