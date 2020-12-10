import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';

qz.api.setSha256Type(data => sha256(data));
qz.api.setPromiseType(resolver => new Promise(resolver));

// qz.security.setCertificatePromise(function(resolve, reject) {
//   $.ajax("https://softwarehym.com/assets/qztry/digital-certificate.txt").then(resolve, reject);
// });

// qz.security.setSignaturePromise(function(toSign) {
//   return function(resolve, reject) {
//       $.ajax("https://softwarehym.com/assets/qztry/sign-message.php?request="+toSign).then(resolve, reject);
//   };
// });

@Injectable()
export class QzTrayService {
  constructor() { }

  errorHandler(error: any): Observable<any> {
    return Observable.throw(error);
  }

  connectPrinter() {

  }
  // Get list of printers connected
  getPrinters(): Observable<string[]> {
    return Observable
      .fromPromise(qz.websocket.connect().then(() => qz.printers.find()))
      .map((printers: string[]) => printers)
      .catch(this.errorHandler);
  }

  // Get the SPECIFIC connected printer
  getPrinter(printerName: string): Observable<string> {
    return Observable
      .fromPromise(qz.websocket.connect().then(() => qz.printers.find(printerName)))
      .map((printer: string) => printer)
      .catch(this.errorHandler);
  }

  // Print data to chosen printer 
  printData(printer: string, data: any, copias: any): Observable<any> {
    // Create a default config for the found printer
    qz.websocket.disconnect();
    const config = qz.configs.create(printer, { copies: copias, margins: { top: 0, right: 0, bottom: 0.25, left: 0 } });
    return Observable.fromPromise(qz.websocket.connect().then(() => qz.print(config, data)))
      .map((anything: any) => anything)
      .catch(this.errorHandler);
  }

  // Disconnect QZ Tray from the browser
  removePrinter(): void {
    qz.websocket.disconnect();
  }

  getMac(): Observable<any> {

    return Observable.fromPromise(qz.websocket.connect().then(() => qz.websocket.getNetworkInfo()
    )).map((anything: any) => anything)
      .catch(this.errorHandler);
  }
}