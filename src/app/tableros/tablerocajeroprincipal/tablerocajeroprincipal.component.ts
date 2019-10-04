import { Component, OnInit, ViewChild } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../../shared/funcionario/funcionario.model';
import { IMyDrpOptions } from 'mydaterangepicker';
import { GeneralService } from '../../shared/services/general/general.service';
import { DepartamentoService } from '../../shared/services/departamento/departamento.service';
import { CajaService } from '../../shared/services/caja/caja.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { PaisService } from '../../shared/services/paises/pais.service';
import { ToastService } from '../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-tablerocajeroprincipal',
  templateUrl: './tablerocajeroprincipal.component.html',
  styleUrls: ['./tablerocajeroprincipal.component.scss']
})
export class TablerocajeroprincipalComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal:any;

  myDateRangePickerOptions: IMyDrpOptions = {
    width: '250px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  public Paises:Array<any> = [];
  public Monedas:Array<any> = [];  
  public FechaActual:string = '';
  public MostrarTotales:Array<any> = [];
  public Departamentos:Array<any> = [];
  public DepartamentoSeleccionado:string = 'Departamento';
  public DepartamentoId:string = '';
  public Funcionario:any = JSON.parse(localStorage['User']);
  public TotalesDepartamento:any = {}; 
  public TotalesMunicipio:Array<any> = []; 
  public TotalesOficina:Array<any> = []; 
  public FechaSeleccionada:any = '2019-02-09';
  public Fecha_Consulta:any = '';
  public CajerosAbiertos:number = 0;
  public CajerosTotales:number = 0;
  public Totales:Array<any> = [];
  public model: any;

  constructor(private _generalService:GeneralService,
              private _departamentoService:DepartamentoService,
              private _cajaService:CajaService,
              private _monedaService:MonedaService,
              private _paisService:PaisService,
              private _toastService:ToastService) { 
    
    this.model = {beginDate: {year: this._generalService.AnioActual, month: this._generalService.MesActualDosDigitos, day: this._generalService.DiaActual},
    endDate: {year: this._generalService.AnioActual, month: this._generalService.MesActual, day: this._generalService.DiaActual}};    
    this.GetDepartamentos();
    this.GetMonedas();
    this.InicializarFecha();
    this.ConteoCajeros();
  }

  ngOnInit() {
    this.ConsultarTotalesDepartamento();
  }

  InicializarFecha(){
    // let d = new Date();
    // this.FechaActual = d.toISOString().split("T")[0];
    // this.Fecha_Consulta = d.toISOString().split("T")[0];
    this.Fecha_Consulta = this._generalService.AnioActual+'-'+this._generalService.MesActualDosDigitos+'-'+this._generalService.DiaActualDosDigitos+' - '+this._generalService.AnioActual+'-'+this._generalService.MesActualDosDigitos+'-'+this._generalService.DiaActualDosDigitos;
  }

  AsignarPaises(){
    this._paisService.getAllPaises().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Paises = data.query_data;
      }else{

        this.Paises = data.query_data;
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetMonedas(){
    this._monedaService.getMonedas().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      }else{

        this.Monedas = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetDepartamentos(){
    this._departamentoService.getDepartamentos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Departamentos = data.query_data;
      }else{
        this.Departamentos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  ConteoCajeros(){

    let ruta = '';
    let p = {};

    if (this.Funcionario.Id_Perfil == 1 || this.Funcionario.Id_Perfil == 5 || this.Funcionario.Id_Perfil == 6) {
      //ruta = this.globales.ruta+'php/cajas/cajas_abiertas_general.php';
      p = {fecha:this.Fecha_Consulta};
      this._cajaService.getCajasAbiertasGeneral(p).subscribe((data:any) => {
        if (data.success) {
          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        }else{
  
          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        }
      });
    
    }else if(this.Funcionario.Id_Perfil == 2){
      //ruta = this.globales.ruta+'php/cajas/cajas_abiertas.php';
      p = {id_funcionario:this.Funcionario.Identificacion_Funcionario, fecha:this.Fecha_Consulta};
      this._cajaService.getCajasAbiertasFuncionario(p).subscribe((data:any) => {
        if (data.success) {
          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        }else{
  
          this.CajerosAbiertos = data.conteo.Activos;
          this.CajerosTotales = data.conteo.Totales;
        }
      });
    }
  }

  ConsultarTotalesDepartamento(){

    if (this.Fecha_Consulta == '') {
      // this.ShowSwal('error', 'Error', 'Ha ocurrido un error con la fecha en en el sistema, contacte con el administrador del sistema!');
      this.Totales = [];
      return;
    }else{
      let ruta = '';
      let p = {};

      if (this.Funcionario.Id_Perfil == 1 || this.Funcionario.Id_Perfil == 5 || this.Funcionario.Id_Perfil == 6) {
        //ruta = this.globales.ruta+'php/cajas/cajas_abiertas_general.php';
        p = {id_departamento:this.DepartamentoId, fechas:this.Fecha_Consulta};
        this._cajaService.getTotalesCajasGeneral(p).subscribe((data:any) => {
          if (data.codigo == 'success') {
            console.log(data);
            
            // this.TotalesMunicipio = data.totales.municipios; 
            // this.TotalesDepartamento = data.totales.departamento;
            
            // this.MostrarTotales = [];
            // this.ExtraerTotales();
            this.Totales = data.query_data;
          }else{
            this.Totales = [];  
            // this.MostrarTotales = [];
            // this.TotalesMunicipio = []; 
            // this.TotalesDepartamento = [];
          }
        });
      
      }else if(this.Funcionario.Id_Perfil == 2){
        //ruta = this.globales.ruta+'php/cajas/cajas_abiertas.php';
        p = {id_funcionario:this.Funcionario.Identificacion_Funcionario, id_departamento:this.DepartamentoId, fechas:this.Fecha_Consulta};
        this._cajaService.getTotalesCajasFuncionario(p).subscribe((data:any) => {
          if (data.codigo == 'success') {
            console.log(data);
            
            // this.TotalesMunicipio = data.totales.municipios; 
            // this.TotalesDepartamento = data.totales.departamento;
            
            // this.MostrarTotales = [];
            // this.ExtraerTotales();
            this.Totales = data.query_data;
          }else{  
            this.Totales = [];  
            // this.MostrarTotales = [];
            // this.TotalesMunicipio = []; 
            // this.TotalesDepartamento = [];
          }
        });
      }
    }
  }

  AsignarDepartamentoSeleccionado(value){

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

  ExtraerTotales(){
    let totales_monedas = this.TotalesDepartamento;

    this.Monedas.forEach(m => {
      let n = m.Nombre;
      let t = parseFloat(totales_monedas[n].Ingresos) - parseFloat(totales_monedas[n].Egresos);
      let totalObj = { Codigo:m.Codigo, Total:t};
      this.MostrarTotales.push(totalObj);
    });
  }

  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.Fecha_Consulta = event.formatted;
    } else {
      this.Fecha_Consulta = '';
    }
    
    this.ConsultarTotalesDepartamento();
  }

  onDataChange(){
    this.ConteoCajeros();
    this.ConsultarTotalesDepartamento();
  }

  Test(){
    console.log(this.Fecha_Consulta);    
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
