import {Observable} from 'rxjs';
import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class StorageService {
  private localStorage: Storage = localStorage;

  constructor(
    private _zone: NgZone
  ) {
  }

  /**
   * Set given key on browser localStorage
   * @param key
   * @param data
   * @returns {Observable<any>}
   */
  public set(key, data): Observable<any> {
    return new Observable((observer) => {
      this.localStorage.setItem(key, JSON.stringify(data));
      this._zone.run(() => {
        observer.next(true);
        observer.complete();
      });
    });
  }

  /**
   * Get given key from browser localStorage
   * @param key
   * @returns {Observable<any>}
   */
  public get(key): Observable<any> {
    return this._zone.run(() => {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(
            JSON.parse(this.localStorage.getItem(key))
          );
          observer.complete();
        }, 0);
      });
    });
  }

  /**
   * Remove given key from browser localStorage
   * @param key
   * @returns {Observable<any>}
   */
  public remove(key): Observable<any> {
    return new Observable((observer) => {
      this.localStorage.removeItem(key);
      this._zone.run(() => {
        observer.next();
        observer.complete();
      });
    });
  }
}