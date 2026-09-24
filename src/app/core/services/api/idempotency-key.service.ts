import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IdempotencyService {

    private readonly orderKey = 'order-idempotency-key';
    private readonly refreshTokenKey = 'refresh-token-idempotency-key';

    getOrderKey(): string {

        let key = sessionStorage.getItem(this.orderKey);

        if (!key) {
            key = crypto.randomUUID();

            sessionStorage.setItem(
                this.orderKey,
                key
            );
        }

        return key;
    }

    getRefreshTokenKey(): string {

        let key = sessionStorage.getItem(this.refreshTokenKey);

        if (!key) {
            key = crypto.randomUUID();

            sessionStorage.setItem(
                this.refreshTokenKey,
                key
            );
        }

        return key;
    }

    clearOrderKey(): void {
        sessionStorage.removeItem(this.orderKey);
    }

    clearRefreshTokenKey(): void {
        sessionStorage.removeItem(this.refreshTokenKey);
    }

    clearAllKeys(): void {
        this.clearOrderKey();
    }
}