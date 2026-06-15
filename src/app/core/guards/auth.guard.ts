import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../services/ui/token-storage.service';

// Auth Services
import { AuthenticationService } from '../services/api/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private tokenStorageService: TokenStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.tokenStorageService.getUser()) {
            return true;
        }

        //this.router.navigate([''], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['']);
        return false;
    }
}
