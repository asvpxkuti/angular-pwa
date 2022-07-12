import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { DataService } from './services/data-service.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isEnabled = this.swPushService.isEnabled;
  readonly VAPID_PUBLIC_KEY =
    'BNpeqhhHsQa0toxZ4QmOOy9aaFbrzI9ctCLOce88pvYRD5QMtUYRa4lI5WNB10mEivyKTppvnDIwffrrVr74hDA';

  title = 'Angular-PWA!';
  subscriptions = new Subscription();
  randomJoke = '';
  constructor(
    private swUpdatesService: SwUpdate,
    private swPushService: SwPush,
    private dataService: DataService
  ) {
    this.checkForUpdateAndReload();
    this.handleNotificationClick();
  }

  ngOnInit(): void {
    this.getRandomJokes();
    this.logMessage();
  }

  subscribeToNotifications(): void {
    this.swPushService
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((event) => {
        console.log(JSON.stringify(event));
        this.dataService.sendNotificationDetails(event).subscribe();
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  handleNotificationClick(): void {
    this.swPushService.notificationClicks.subscribe((event) => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });
  }

  checkForUpdateAndReload(): void {
    this.swUpdatesService.available.subscribe((event) => {
      this.swUpdatesService
        .activateUpdate()
        .then(() => document.location.reload());
    });
  }

  logMessage(): void {
    this.subscriptions.add(
      this.swPushService.messages.subscribe((message) => {
        console.log(`loading message ${JSON.stringify(message)}`);
      })
    );
  }

  getRandomJokes(): void {
    this.dataService.getRandomJokes().subscribe(
      (response) => {
        this.randomJoke = response.value;
      },
      (err) => console.log(err)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
