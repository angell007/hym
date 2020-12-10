import { Injectable } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Injectable()
export class ConsolidadosService {
  public MonedasSistema: any = [];
  public user = JSON.parse(localStorage['User']);
  public Modulos: Array<string> = ['Cambios', 'Transferencias', 'Giros', 'Traslados', 'Corresponsal', 'Servicios'];
  public SumatoriaTotales: any = [];
  public TotalesIngresosMonedas: any = [];
  public TotalesEgresosMonedas: any = [];
  public TotalesCustom: any = [];
  public Totales: any = [];
  public Saldos: any = [];
  public ValoresMonedasApertura = []
  public TotalRestaIngresosEgresos = [];
  public subject = new Subject;
  public observer$ = this.subject.asObservable();

  constructor(public globales: Globales, private http: HttpClient) {

    TimerObservable.create(0, 10000)
      .subscribe(() => {
        this.GetData();
      });
  }

<<<<<<< HEAD

  reduce(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Ingreso_Total) - parseFloat(element.Egreso_Total)
    })
    return suma;
  }

  async GetData() {



    this.TotalRestaIngresosEgresos = []
    this.SumatoriaTotales = []

    // this.getValoresIniciales().then(() => {
    //   this.getValoresApertura().then(() => {


    let p: any = { id: this.user.Identificacion_Funcionario };
    this.http.get(`${this.globales.rutaNueva}cierre-caja`, { params: p }).subscribe((data: any) => {
      this.Modulos = data;

      data.forEach(element => {
        this.TotalRestaIngresosEgresos.push({saldo: this.reduce(element.Movimientos), cod : element.Codigo})
      });
    });

=======
  async GetData() {
    this.TotalRestaIngresosEgresos = []
    this.SumatoriaTotales = []

    this.getValoresIniciales().then(() => {
      this.getValoresApertura().then(() => {
        this.MonedasSistema.forEach((moneda, i) => {
          let objMoneda = this.SumatoriaTotales[moneda.Nombre];

          let monto_inicial_moneda = (this.ValoresMonedasApertura[i].Valor_Moneda_Apertura == "") ? 0 : this.ValoresMonedasApertura[i].Valor_Moneda_Apertura;
          this.TotalesIngresosMonedas.push(objMoneda.Ingreso_Total.toFixed(2));
          this.TotalesEgresosMonedas.push(objMoneda.Egreso_Total.toFixed(2));
          let suma_inicial_ingreso = parseFloat(objMoneda.Ingreso_Total) + parseFloat(monto_inicial_moneda);

          this.TotalRestaIngresosEgresos.push([moneda.Codigo, (suma_inicial_ingreso - objMoneda.Egreso_Total).toFixed(), moneda.Nombre, moneda.Id_Moneda]);

        })
      })

      return this.TotalRestaIngresosEgresos;

    }).catch((err) => {
      console.log('Error  ', err);
    })
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  }

  async getValoresIniciales() {

<<<<<<< HEAD
    await this.http.get(`${this.globales.ruta}/php/cierreCaja/Cierre_Caja_Nuevo.php`, { params: { id: this.user.Identificacion_Funcionario } }).pipe()
      .toPromise().then((data: any) => {
=======
    await this.http.get(`${this.globales.rutaNueva}cierre-caja`, { params: { id: this.user.Identificacion_Funcionario } }).pipe()
      .toPromise().then((data: any) => {


>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
        this.MonedasSistema = data.monedas;
        let t = data.totales_ingresos_egresos;

        for (const k in t) {
          let arr = t[k];
          this.Totales[k] = arr;
        }

        this.MonedasSistema.forEach((m) => {
          this.Modulos.forEach((mod) => {
<<<<<<< HEAD
            let obj = this.Totales[mod];

            
=======

            let obj = this.Totales[mod];

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
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

}
