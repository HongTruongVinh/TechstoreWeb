import * as signalR from '@microsoft/signalr';
import { apiEndpoints } from '../../constants/api-endpoints'
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentSignalrService {
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
    ) { }

    async startConnection(orderId: string) {

        const hubUrl = `${environment.baseHost}${apiEndpoints.payment.paymentHub}`;

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        console.log('Waiting for payment updates:', orderId);

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
            }
        );

        this.hubConnection.on(
            'PaymentFailed',
            (data) => {
                console.log('Payment failed:', data);

                this.paymentFailedSource.next(data);
            }
        );
    }

    async stopConnection() {

        if (this.hubConnection) {
            await this.hubConnection.stop();
        }
    }
}