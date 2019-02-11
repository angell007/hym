import { Component, OnInit, ViewChild } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../../shared/funcionario/funcionario.model';
import { IMyDrpOptions } from 'mydaterangepicker';

@Component({
  selector: 'app-tablerocajeroprincipal',
  templateUrl: './tablerocajeroprincipal.component.html',
  styleUrls: ['./tablerocajeroprincipal.component.scss']
})
export class TablerocajeroprincipalComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal:any;

  myDateRangePickerOptions: IMyDrpOptions = {
    width: '150px',
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

  constructor(public globales:Globales, private client:HttpClient) { 
    
    this.AsignarDepartamentos();
    this.AsignarMonedas();
    this.InicializarFecha();
    this.ConteoCajeros();
  }

  ngOnInit() {
  }

  InicializarFecha(){
    let d = new Date();
    this.FechaActual = d.toISOString().split("T")[0];
    this.Fecha_Consulta = d.toISOString().split("T")[0];
  }

  AsignarPaises(){      
    this.Paises = this.globales.Paises;
  }

  AsignarMonedas(){      
    this.Monedas = this.globales.Monedas;
  }

  AsignarDepartamentos(){      
    this.Departamentos = this.globales.Departamentos;
  }

  ConteoCajeros(){

    let ruta = '';
    let p = {};

    if (this.Funcionario.Id_Perfil == 1 || this.Funcionario.Id_Perfil == 5 || this.Funcionario.Id_Perfil == 6) {
      ruta = this.globales.ruta+'php/cajas/cajas_abiertas_general.php';
      p = {fecha:this.Fecha_Consulta};
    
    }else if(this.Funcionario.Id_Perfil == 2){
      ruta = this.globales.ruta+'php/cajas/cajas_abiertas.php';
      p = {id_funcionario:this.Funcionario.Identificacion_Funcionario, fecha:this.Fecha_Consulta};
    }
    
    this.client.get(ruta, {params:p}).subscribe((data:any) => {
      if (data.success) {
        this.CajerosAbiertos = data.conteo.Activos;
        this.CajerosTotales = data.conteo.Totales;
      }else{

        this.CajerosAbiertos = data.conteo.Activos;
        this.CajerosTotales = data.conteo.Totales;
      }
    });
  }

  ConsultarTotalesDepartamento(){

    if (this.DepartamentoId == '') {
      //this.ShowSwal('warning', 'Alerta', 'Debe escoger le departamento para realizar una busqueda de totales!');
      return;
    }

    if (this.Fecha_Consulta == '') {
      this.ShowSwal('error', 'Error', 'Ha ocurrido un error con la fecha en en el sistema, contacte con el administrador del sistema!');
      return;
    }

    let ruta = '';
    let p = {};

    if (this.Funcionario.Id_Perfil == 1 || this.Funcionario.Id_Perfil == 5 || this.Funcionario.Id_Perfil == 6) {
      ruta = this.globales.ruta+'php/cajas/totales_cajas_general.php';
      p = {id_departamento:this.DepartamentoId, fecha:this.Fecha_Consulta};
    
    }else if(this.Funcionario.Id_Perfil == 2){
      ruta = this.globales.ruta+'php/cajas/totales_cajas.php';
      p = {id_funcionario:this.Funcionario.Identificacion_Funcionario, id_departamento:this.DepartamentoId, fecha:this.Fecha_Consulta};
    }

    this.client.get(ruta, {params:p}).subscribe((data:any) => {
      
      if (data.codigo == 'success') {
        console.log(data);
        
        this.TotalesMunicipio = data.totales.municipios; 
        this.TotalesDepartamento = data.totales.departamento;
        
        this.MostrarTotales = [];
        this.ExtraerTotales();
      }else{

        this.MostrarTotales = [];
        this.TotalesMunicipio = []; 
        this.TotalesDepartamento = [];
      }
    });
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
