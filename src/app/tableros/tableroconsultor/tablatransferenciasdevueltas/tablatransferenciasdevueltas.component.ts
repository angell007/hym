import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tablatransferenciasdevueltas',
  templateUrl: './tablatransferenciasdevueltas.component.html',
  styleUrls: ['./tablatransferenciasdevueltas.component.scss', '../../../../style.scss']
})
export class TablatransferenciasdevueltasComponent implements OnInit {

  // @Input() MonedaConsulta:string = '1';
  // @Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario:string = '';

  @ViewChild('alertSwal') alertSwal:any;

  public TransferenciasListar:any = [];
  public Cargando:boolean = false;

  public Filtros:any = {
    fecha: '',
    codigo:'',
    consultor: '',
    valor:'',
    cedula:'',
    cta_destino:'',
    nombre_destinatario:''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems:number;
  public page = 1;
  public InformacionPaginacion:any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  constructor(private http:HttpClient, public globales:Globales) { }

  ngOnInit() {
    this.ConsultaFiltrada();
  }

  SetFiltros(paginacion:boolean) {
    let params:any = {};
    
    params.tam = this.pageSize;
    //params.id_moneda = this.MonedaConsulta;
    params.id_funcionario = this.Id_Funcionario;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.fecha.trim() != "") {
      params.fecha = this.Filtros.fecha;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.consultor.trim() != "") {
      params.consultor = this.Filtros.consultor;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    if (this.Filtros.cedula.trim() != "") {
      params.cedula = this.Filtros.cedula;
    }

    if (this.Filtros.cta_destino.trim() != "") {
      params.cta_destino = this.Filtros.cta_destino;
    }

    if (this.Filtros.nombre_destinatario.trim() != "") {
      params.nombre_destinatario = this.Filtros.nombre_destinatario;
    }

    return params;
  }

  ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_devueltas_consultores.php', {params: p}).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TransferenciasListar = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.TransferenciasListar = [];
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      fecha: '',
      codigo:'',
      cajero: '',
      valor:'',
      cedula:'',
      cta_destino:'',
      nombre_destinatario:''
    };
  }

  SetInformacionPaginacion(){
    var calculoHasta = (this.page*this.pageSize);
    var desde = calculoHasta-this.pageSize+1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
