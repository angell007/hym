import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globales } from './shared/globales/globales';

@Injectable()
export class ExportService {

  constructor(private _http: HttpClient, private globales: Globales) { }


  exportCompras(p) {

    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    this._http.get(this.globales.rutaNueva + 'informe-compras', { params: p, headers, responseType: 'blob' as 'json' }).subscribe((data: any) => {

      let blob = new Blob([data], { type: "application/xlsx" });

      let link = document.createElement("a");

      const filename = 'InformeCompras'

      link.href = window.URL.createObjectURL(blob);

      link.download = `${filename}.xlsx`;
      link.click();

    })
  }
}
