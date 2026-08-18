import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IdempotencyService {

    private readonly orderKey = 'order-idempotency-key';

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

    clearOrderKey(): void {
        sessionStorage.removeItem(this.orderKey);
    }

    clearAllKeys(): void {
        this.clearOrderKey();
    }
}