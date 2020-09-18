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
  ValoresMonedasApertura: any;
  TotalRestaIngresosEgresos: any;

  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient) {


    this.getValoresIniciales().then(() => {
      this.AsignarMonedasApertura().then(() => {
        this.getValoresApertura().then(() => {
          this.MonedasSistema.forEach((moneda, i) => {
            let objMoneda = this.SumatoriaTotales[moneda.Nombre];
            let monto_inicial_moneda = this.ValoresMonedasApertura[i].Valor_Moneda_Apertura;
            this.TotalesIngresosMonedas.push(objMoneda.Ingreso_Total.toFixed(2));
            this.TotalesEgresosMonedas.push(objMoneda.Egreso_Total.toFixed(2));
            let suma_inicial_ingreso = parseFloat(objMoneda.Ingreso_Total) + parseFloat(monto_inicial_moneda);

            console.log(['Monedas de apertura ', this.MonedasSistema, 'TotalRestaIngresosEgresos', this.TotalRestaIngresosEgresos[moneda.Nombre]]);

            // this.TotalRestaIngresosEgresos[moneda.Nombre] = moneda.Nombre
            // this.TotalRestaIngresosEgresos.push([moneda.Nombre, (suma_inicial_ingreso - objMoneda.Egreso_Total).toFixed()]);

          })
        })
      })
    }).catch((err) => {
      console.log('Error  ', err);
    })
  }

  async getValoresIniciales() {

    console.log('getValoresIniciales  ');

    await this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_Nuevo.php', { params: { id: this.user.Identificacion_Funcionario } }).pipe()
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
            }
          });
        });
      });

  }

  async getValoresApertura() {
    await this.http.get(this.globales.ruta + 'php/diario/get_valores_diario.php', { params: { id: this.user.Identificacion_Funcionario } }).toPromise().then(async (data: any) => {
      data.valores_diario.forEach((valores, i) => {
        this.ValoresMonedasApertura.push(valores);
      });
    });
  }

  async AsignarMonedasApertura() {
    if (this.MonedasSistema.length > 0) {
      this.ValoresMonedasApertura = [];
      await this.MonedasSistema.forEach(moneda => {
        let monObj = { Id_Moneda: moneda.Id_Moneda, Valor_Moneda_Apertura: '', NombreMoneda: moneda.Nombre, Codigo: moneda.Codigo };
        this.ValoresMonedasApertura.push(monObj);
      });
    }
  }
}
