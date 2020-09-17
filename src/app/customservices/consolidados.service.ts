import { Injectable, ViewChild } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class ConsolidadosService {
  public MonedasSistema: any = [];
  public user = JSON.parse(localStorage['User']);
  public Modulos: Array<string> = ['Cambios', 'Transferencias', 'Giros', 'Traslados', 'Corresponsal', 'Servicios'];
  public SumatoriaTotales: any = [];
  public TotalesIngresosMonedas: any = [];
  public TotalesEgresosMonedas: any = [];
  public Totales: any = [];
  public Saldos: any = [];

  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient) {

    this.getValoresIniciales();

  }

  async getValoresIniciales() {

    await this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_Nuevo.php', { params: { id: this.user.Identificacion_Funcionario } }).pipe(
      tap(x => console.log('consultando', x)))
      .toPromise().then((data: any) => {
        this.MonedasSistema = data.monedas;
        let t = data.totales_ingresos_egresos;

        for (const k in t) {
          let arr = t[k];
          this.Totales[k] = arr;
        }

        this.MonedasSistema.forEach((m) => {
          this.Modulos.forEach((mod) => {
            let obj = this.Totales[mod];
            let monObj = obj.filter(x => x.Moneda_Id == m.Id_Moneda);
            if (this.SumatoriaTotales[m.Nombre]) {
              this.SumatoriaTotales[m.Nombre].Ingreso_Total += parseFloat(monObj[0].Ingreso_Total);
              this.SumatoriaTotales[m.Nombre].Egreso_Total += parseFloat(monObj[1].Egreso_Total);
              this.Saldos[m.Nombre] = parseFloat((this.SumatoriaTotales[m.Nombre].Ingreso_Total - this.SumatoriaTotales[m.Nombre].Egreso_Total).toFixed(2))
            } else {
              this.SumatoriaTotales[m.Nombre] = { Ingreso_Total: 0, Egreso_Total: 0 };
              this.SumatoriaTotales[m.Nombre].Ingreso_Total += parseFloat(monObj[0].Ingreso_Total);
              this.SumatoriaTotales[m.Nombre].Egreso_Total += parseFloat(monObj[1].Egreso_Total);

              console.log('Desde consolidado services ', this.SumatoriaTotales);
            }
          });
        });
      });

  }

}
