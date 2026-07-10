import * as signalR from '@microsoft/signalr';
import { LinkSettingsService } from '../api/link-settings.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentSignalrService {
    private baseHost = environment.baseHost;
    private hubConnection?: signalR.HubConnection;

    // SOURCE
    private paymentSuccessSource =
        new Subject<any>();

    private paymentFailedSource =
        new Subject<any>();

    // OBSERVABLE
    paymentSuccess$: Observable<any> = this.paymentSuccessSource.asObservable();
    paymentFailed$: Observable<any> = this.paymentFailedSource.asObservable();

    constructor(
        private lss: LinkSettingsService
    ) { }

    async startConnection(orderId: string) {
        this.lss.getResLinkSetting('Payment', 'PaymentHub').subscribe(async (apiUrl) => {
            if (!apiUrl) {
                throw new Error('Không tìm thấy URL API cho SignalR Hub');
            }

            if (!apiUrl.startsWith('http')) {
                apiUrl = this.baseHost + apiUrl;
            }

            // apiUrl = 'https://localhost:5001/payments/hub';
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(apiUrl)
                .withAutomaticReconnect()
                .build();

            console.log('waiting for payment updates:', orderId);

            await this.hubConnection.start();

            await this.hubConnection.invoke(
                'JoinPaymentGroup',
                orderId
            );

            this.hubConnection.on(
                'PaymentSuccess',
                (data) => {

                    console.log('Payment success:', data);

                    this.paymentSuccessSource.next(data);
                });

            this.hubConnection.on(
                'PaymentFailed',
                (data) => {

                    console.log('Payment failed:', data);

                    this.paymentFailedSource.next(data);
                });
        });
    }

    async stopConnection() {

        if (this.hubConnection) {
            await this.hubConnection.stop();
        }
    }
}