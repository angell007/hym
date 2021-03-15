import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { GeneralService } from '../../shared/services/general/general.service';
import { DepartamentoService } from '../../shared/services/departamento/departamento.service';
import { CajaService } from '../../shared/services/caja/caja.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { PaisService } from '../../shared/services/paises/pais.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { element } from 'protractor';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
// import { ValidateCajeroService } from '../../validate-cajero.service';

@Component({
  selector: 'app-tablerocajeroprincipal',
  templateUrl: './tablerocajeroprincipal.component.html',
  styleUrls: ['./tablerocajeroprincipal.component.scss']
})
export class TablerocajeroprincipalComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal: any;

  myDateRangePickerOptions: IMyDrpOptions = {
    width: '250px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  public Paises: Array<any> = [];
  public Monedas: Array<any> = [];
  public FechaActual: string = '';
  public MostrarTotales: Array<any> = [];
  public Departamentos: Array<any> = [];
  public DepartamentoSeleccionado: string = 'Departamento';
  public DepartamentoId: string = '';
  public Funcionario: any = JSON.parse(localStorage['User']);
  public TotalesDepartamento: any = {};
  public TotalesMunicipio: Array<any> = [];
  public TotalesOficina: Array<any> = [];
  public FechaSeleccionada: any = '2019-02-09';
  public Fecha_inicio: any = '';
  public Fecha_fin: any = '';
  public CajerosAbiertos: number = 0;
  public CajerosTotales: number = 0;
  public Totales: Array<any> = [];
  public model: any;
  public TotalesByCaja: any;

  constructor(
    public globales: Globales,
    private http: HttpClient,
    private _generalService: GeneralService,
    private _departamentoService: DepartamentoService,
    private _cajaService: CajaService,
    private _monedaService: MonedaService,
    private _paisService: PaisService,
    private _toastService: ToastService,
    // private _validateCajeroService: ValidateCajeroService
  ) {

    this.model = {
      beginDate: { year: this._generalService.AnioActual, month: this._generalService.MesActualDosDigitos, day: this._generalService.DiaActual },
      endDate: { year: this._generalService.AnioActual, month: this._generalService.MesActual, day: this._generalService.DiaActual }
    };
    this.GetDepartamentos();
    this.GetMonedas();
    this.InicializarFecha();
    this.ConteoCajeros();
  }

  ngOnInit() { }

  InicializarFecha() {
    let d = new Date();
    this.FechaActual = d.toISOString().split("T")[0];
    this.Fecha_inicio = d.toISOString().split("T")[0];
    this.Fecha_fin = d.toISOString().split("T")[0];
  }

  AsignarPaises() {
    this._paisService.getAllPaises().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Paises = data.query_data;
      } else {

        this.Paises = data.query_data;
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      } else {

        this.Monedas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetDepartamentos() {
    this._departamentoService.getDepartamentos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Departamentos = data.query_data;
      } else {
        this.Departamentos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  ConteoCajeros() {

    let ruta = '';
    let p = {};


    p = { fecha: this.Fecha_fin, id: this.Funcionario.Identificacion_Funcionario, };
    this._cajaService.getCajasAbiertasGeneral(p).subscribe((data: any) => {

      if (data.success) {
        this.CajerosAbiertos = data.conteo.Activos;
        this.CajerosTotales = data.conteo.Totales;
      }
      else {

        this.CajerosAbiertos = data.conteo.Activos;
        this.CajerosTotales = data.conteo.Totales;
      }
    });


    p = { id_funcionario: this.Funcionario.Identificacion_Funcionario, Fecha_fin: this.Fecha_fin, Fecha_inicio: this.Fecha_inicio };
    this._cajaService.getCajasAbiertasFuncionarioCustom(p).subscribe((data: any) => {
      this.Totales = data['FullMontos'];
      this.TotalesByCaja = data['amountTotalByOficina'];

    });
  }

  AsignarDepartamentoSeleccionado(value) {

    if (value == '') {
      this.DepartamentoSeleccionado = 'Departamento';
      this.DepartamentoId = '';
      this.TotalesMunicipio = [];
      this.MostrarTotales = [];
      return;
    }

    this.DepartamentoId = value;
    let d = this.Departamentos.filter(x => x.Id_Departamento == value);
    this.DepartamentoSeleccionado = d[0].Nombre;
    // this.ConsultarTotalesDepartamento();
  }

  ExtraerTotales() {
    let totales_monedas = this.TotalesDepartamento;

    this.Monedas.forEach(m => {
      let n = m.Nombre;
      let t = parseFloat(totales_monedas[n].Ingresos) - parseFloat(totales_monedas[n].Egresos);
      let totalObj = { Codigo: m.Codigo, Total: t };
      this.MostrarTotales.push(totalObj);
    });
  }

  filtrarByDate() {
    this.ConteoCajeros()
  }


  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.Fecha_fin = event.formatted;
    } else {
      this.Fecha_fin = '';
    }

    // this.ConsultarTotalesDepartamento();
  }

  onDataChange() {
    this.ConteoCajeros();
    // this.ConsultarTotalesDepartamento();
  }


  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  printCambio(id) {
    this.http.get(this.globales.rutaNueva + 'print-cambio', { params: { id: id, modulo: 'cambio' }, responseType: 'blob' }).subscribe((data: any) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  reduce(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Ingreso_Total) - parseFloat(element.Egreso_Total)
    })
    return suma;
  }

  public suma: any = [];

  reduceAll(a, ii) {
    // if (this.suma[ii] == '' || this.suma[ii] == undefined) {
    //   this.suma[ii] = 0;
    // }

    // a.forEach((element) => {
    //   this.suma[ii] += parseFloat(element.Ingreso_Total) - parseFloat(element.Egreso_Total)
    // })

    // return this.suma[ii];

    // Object.values(a).forEach((ex) => {
    //   let total = 0;
    //   ex['data'].forEach((xx) => {
    //     total += this.reduce(xx['Movimientos'])
    //   });
    //   this.suma[ii] = total;
    // });
  }
}
