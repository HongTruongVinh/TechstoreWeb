import { Injectable, inject } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { LoginComponent } from '../../../components/dialog/login/login.component';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';

@Injectable({ providedIn: 'root' })
export class AuthDialogService {
    private dialog = inject(Dialog);
    private loginDialogRef?: DialogRef<LoginDialogResult, LoginComponent>;

    openLogin() {
        if (this.loginDialogRef) return this.loginDialogRef;

        const ref = this.dialog.open<LoginDialogResult, any, LoginComponent>(
            LoginComponent,
            {
                id: 'login-modal',
            }
        );

        this.loginDialogRef = ref;

        ref.closed.subscribe(() => {
            this.loginDialogRef = undefined;
        });

        return ref;
    }
}