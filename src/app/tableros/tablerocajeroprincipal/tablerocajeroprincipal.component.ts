import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { GeneralService } from '../../shared/services/general/general.service';
import { DepartamentoService } from '../../shared/services/departamento/departamento.service';
import { CajaService } from '../../shared/services/caja/caja.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { PaisService } from '../../shared/services/paises/pais.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { element } from 'protractor';

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
<<<<<<< HEAD
  public Fecha_inicio: any = '';
  public Fecha_fin: any = '';
=======
  public Fecha_Consulta: any = '';
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  public CajerosAbiertos: number = 0;
  public CajerosTotales: number = 0;
  public Totales: Array<any> = [];
  public model: any;

  constructor(private _generalService: GeneralService,
    private _departamentoService: DepartamentoService,
    private _cajaService: CajaService,
    private _monedaService: MonedaService,
    private _paisService: PaisService,
    private _toastService: ToastService) {

    this.model = {
      beginDate: { year: this._generalService.AnioActual, month: this._generalService.MesActualDosDigitos, day: this._generalService.DiaActual },
      endDate: { year: this._generalService.AnioActual, month: this._generalService.MesActual, day: this._generalService.DiaActual }
    };
    this.GetDepartamentos();
    this.GetMonedas();
    this.InicializarFecha();
    this.ConteoCajeros();
  }

  ngOnInit() {
    this.ConsultarTotalesDepartamento();
  }

  InicializarFecha() {
    let d = new Date();
    this.FechaActual = d.toISOString().split("T")[0];
<<<<<<< HEAD
    this.Fecha_inicio = d.toISOString().split("T")[0];
    this.Fecha_fin = d.toISOString().split("T")[0];
=======
    this.Fecha_Consulta = d.toISOString().split("T")[0];
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
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

    if (this.Funcionario.Id_Perfil == 1 || this.Funcionario.Id_Perfil == 5 || this.Funcionario.Id_Perfil == 6) {
      //ruta = this.globales.ruta+'php/cajas/cajas_abiertas_general.php';
<<<<<<< HEAD
      p = { fecha: this.Fecha_fin };
=======
      p = { fecha: this.Fecha_Consulta };
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      this._cajaService.getCajasAbiertasGeneral(p).subscribe((data: any) => {

        // console.log(data);

        if (data.success) {
          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        } else {

          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        }
      });

    } else if (this.Funcionario.Id_Perfil == 2) {
      //ruta = this.globales.ruta+'php/cajas/cajas_abiertas.php';
<<<<<<< HEAD
      p = { id_funcionario: this.Funcionario.Identificacion_Funcionario, fecha: this.Fecha_fin };
=======
      p = { id_funcionario: this.Funcionario.Identificacion_Funcionario, fecha: this.Fecha_Consulta };
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      this._cajaService.getCajasAbiertasFuncionario(p).subscribe((data: any) => {

        // console.log(data);


        if (data.success) {
          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        } else {

          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        }
      });
    }
  }

  ConsultarTotalesDepartamento() {

<<<<<<< HEAD
    if (this.Fecha_fin == '') {
=======
    if (this.Fecha_Consulta == '') {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      // this.ShowSwal('error', 'Error', 'Ha ocurrido un error con la fecha en en el sistema, contacte con el administrador del sistema!');
      this.Totales = [];
      return;
    } else {
      let ruta = '';
      let p = {};

      if (this.Funcionario.Id_Perfil == 1 || this.Funcionario.Id_Perfil == 5 || this.Funcionario.Id_Perfil == 6 || this.Funcionario.Id_Perfil == 2) {
<<<<<<< HEAD
        p = { id_departamento: this.DepartamentoId, fecha_inicio: this.Fecha_inicio, fecha_fin : this.Fecha_fin};
        this._cajaService.getTotalesCajasGeneral(p).subscribe((data: any) => {

          // console.log(data);
          
=======
        //ruta = this.globales.ruta+'php/cajas/cajas_abiertas_general.php';
        p = { id_departamento: this.DepartamentoId, fechas: this.Fecha_Consulta };
        this._cajaService.getTotalesCajasGeneral(p).subscribe((data: any) => {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
          if (data.codigo == 'success') {


            if (this.Funcionario.Id_Perfil == 2) {
              let nue = [];
              data.query_data.map((elemnt: any, i: number) => {
                return elemnt['Oficinas'].map((oficina) => {
                  if (oficina.Nombre == 'Oficina 1') {
                    nue.push(elemnt)
                  }
                })
              })
              // console.log(nue);
              this.Totales = nue;
            } else {
              // console.log(data.query_data);
              this.Totales = data.query_data
            }


          } else {
            this.Totales = [];
          }
        });

      } else if (this.Funcionario.Id_Perfil == 2) {
        //ruta = this.globales.ruta+'php/cajas/cajas_abiertas.php';
<<<<<<< HEAD
        p = { id_funcionario: this.Funcionario.Identificacion_Funcionario, id_departamento: this.DepartamentoId,  fecha_inicio: this.Fecha_inicio, fecha_fin : this.Fecha_fin };
=======
        p = { id_funcionario: this.Funcionario.Identificacion_Funcionario, id_departamento: this.DepartamentoId, fechas: this.Fecha_Consulta };
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
        this._cajaService.getTotalesCajasFuncionario(p).subscribe((data: any) => {
          if (data.codigo == 'success') {

            // this.TotalesMunicipio = data.totales.municipios; 
            // this.TotalesDepartamento = data.totales.departamento;

            // this.MostrarTotales = [];
            // this.ExtraerTotales();
            this.Totales = data.query_data;
          } else {
            this.Totales = [];
            // this.MostrarTotales = [];
            // this.TotalesMunicipio = []; 
            // this.TotalesDepartamento = [];
          }
        });
      }
    }
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
    this.ConsultarTotalesDepartamento();
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

  dateRangeChanged(event) {
    if (event.formatted != "") {
<<<<<<< HEAD
      this.Fecha_fin = event.formatted;
    } else {
      this.Fecha_fin = '';
=======
      this.Fecha_Consulta = event.formatted;
    } else {
      this.Fecha_Consulta = '';
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    }

    this.ConsultarTotalesDepartamento();
  }

  onDataChange() {
    this.ConteoCajeros();
    this.ConsultarTotalesDepartamento();
  }

  Test() {
<<<<<<< HEAD
    // console.log(this.Fecha_fin);
=======
    // console.log(this.Fecha_Consulta);
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  }

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
