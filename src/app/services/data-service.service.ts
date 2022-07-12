import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  CHUCK_NORRIS_JOKES_URL = 'https://api.chucknorris.io/jokes/random';
  NOTIFICATION_URL = 'http://localhost:3000/notification';

  constructor(private http: HttpClient) {}

  getRandomJokes(): any {
    return this.http.get(this.CHUCK_NORRIS_JOKES_URL);
  }

  sendNotificationDetails(params: any): any {
    return this.http.post(this.NOTIFICATION_URL, { notification: params });
  }
}
