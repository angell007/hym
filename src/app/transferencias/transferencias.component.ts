import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { TransferenciaService } from '../shared/services/transferencia/transferencia.service';
import { SwalService } from '../shared/services/swal/swal.service';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css', '../../style.scss']
})
export class TransferenciasComponent implements OnInit {

  @ViewChild('ModalVerTransferencia') ModalVerTransferencia:any;

  public fecha = new Date();
  public transferencias = [];
  public DetalleTransferencia = {
    Fecha:'',
    Recibo:'',
    Tipo:'',
    Codigo_Moneda_Origen:'',
    Codigo_Moneda_Destino:'',
    Valor_Origen:'',
    Valor_Destino:'',
    Estado:''
  };
  
  public Cargando:boolean = false;
  
  public Filtros:any = {
    fecha: '',
    recibo:'',
    cajero:'',
    tipo:'',
    estado:''
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

  public DatosPago:any = {};
  public DatosDevolucion:any = {Fecha:'',Motivo_Devolucion:''};
  public Destinatarios:Array<any> = [];
  public CuentasPagadas:Array<any> = [];

  public ShowDatosPago:boolean = false;
  public ShowDestinatarios:boolean = false;
  public ShowDatosDevolucion:boolean = false;

  constructor(private http: HttpClient, private globales: Globales, private tService:TransferenciaService, private _swalService:SwalService) {
   }

  ngOnInit() {
    this.ConsultaFiltrada();
  }

  GetTransferencias(){
    this.tService.getAllTransferencias().subscribe((data:any)=> {
      this.transferencias = data;
    });
  }

  GetDetalleTransferencia(id){
    this.tService.getDetalleTransferencia(id).subscribe((data:any)=> {
      console.log(data);
      
      if (data.transferencia != '') {
        this.DetalleTransferencia = data.transferencia;
       
        this.Destinatarios = data.transferencia.Destinatarios;

        if (data.transferencia.Pagos != '') {
          this.DatosPago = data.transferencia.Pagos; 
          //this.CuentasPagadas =  data.transferencia.Pagos.Cuentas_Pagadas;
          
          this.ShowDatosPago = true;
        }else{

          this.DatosPago = {};
          this.CuentasPagadas = [];
          this.ShowDatosPago = false;
        }

        if (data.transferencia.Datos_Devolucion != '') {
          this.DatosDevolucion = data.transferencia.Datos_Devolucion;  
          this.ShowDatosDevolucion = true;
        }else{

          this.DatosDevolucion = {Fecha:'',Motivo_Devolucion:''};
          this.ShowDatosDevolucion = false;
        }        
        console.log(this.ShowDatosPago);
        console.log(this.ShowDatosDevolucion);
        
        this.ModalVerTransferencia.show();
      }else{

        this.Destinatarios = [];
        this.DatosPago = {};
        this.CuentasPagadas = [];
        this.ShowDatosPago = false;
        this.DatosDevolucion = {Fecha:'',Motivo_Devolucion:''};
        this.ShowDatosDevolucion = false;
      }
      
    });
  }

  private _esconderColapsables(){
    $("#collapseOne").removeClass("show");
    $("#collapseTwo").removeClass("show");
  }

  public CerrarModalDetalle(){
    this._esconderColapsables();
    this.ModalVerTransferencia.hide();
  }

  SetFiltros(paginacion:boolean) {
    let params:any = {};
    
    params.tam = this.pageSize;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.fecha.trim() != "") {
      params.fecha = this.Filtros.fecha;
    }

    if (this.Filtros.recibo.trim() != "") {
      params.recibo = this.Filtros.recibo;
    }

    if (this.Filtros.cajero.trim() != "") {
      params.cajero = this.Filtros.cajero;
    }

    if (this.Filtros.tipo.trim() != "") {
      params.tipo = this.Filtros.tipo;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }
  
  public ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this.tService.GetAllTransferenciasFiltro(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.transferencias = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.transferencias = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  public ResetValues(){
    this.Filtros = {
      tipo_cuenta: '',
      nro_cuenta:'',
      banco:'',
      titular:'',
      moneda:'',
      pais_bancos:'',
      estado:''
    };
  }

  public SetInformacionPaginacion(){
    var calculoHasta = (this.page*this.pageSize);
    var desde = calculoHasta-this.pageSize+1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
}
