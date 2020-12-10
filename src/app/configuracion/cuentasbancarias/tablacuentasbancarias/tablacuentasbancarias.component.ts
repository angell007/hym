import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { BancoService } from '../../../shared/services/bancos/banco.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tablacuentasbancarias',
  templateUrl: './tablacuentasbancarias.component.html',
  styleUrls: ['./tablacuentasbancarias.component.scss', '../../../../style.scss']
})
export class TablacuentasbancariasComponent implements OnInit {

<<<<<<< HEAD
  public Cuentas: Array<any> = [];
  public BancosPais: Array<any> = [];
  public Paises: any = [];
  public Monedas: any = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;

  public AbrirModalCrear: Subject<any> = new Subject<any>();

  public Filtros: any = {
    tipo_cuenta: '',
    nro_cuenta: '',
    banco: '',
    titular: '',
    moneda: '',
    pais_bancos: '',
    estado: ''
=======
  public Cuentas:Array<any> = [];
  public BancosPais:Array<any> = [];
  public Paises:any = [];
  public Monedas:any = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalCrear:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    tipo_cuenta: '',
    nro_cuenta:'',
    banco:'',
    titular:'',
    moneda:'',
    pais_bancos:'',
    estado:''
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
<<<<<<< HEAD
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
=======
  public TotalItems:number;
  public page = 1;
  public InformacionPaginacion:any = {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    desde: 0,
    hasta: 0,
    total: 0
  }

  constructor(private generalService: GeneralService,
<<<<<<< HEAD
    private swalService: SwalService,
    private cuentaService: CuentabancariaService,
    private bancoService: BancoService,
    private _router: Router) {
    this.RutaGifCargando = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
=======
              private swalService:SwalService,
              private cuentaService:CuentabancariaService,
              private bancoService:BancoService,
              private _router:Router) 
  {
    this.RutaGifCargando = generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.ConsultaFiltrada();
    this.GetPaises();
    this.GetMonedas();
  }

  ngOnInit() {
<<<<<<< HEAD
  }

  async GetPaises() {
    // setTimeout(() => {
    this.Paises = await this.generalService.getPaises();
    // }, 1000);
  }

  GetMonedas() {
    setTimeout(() => {
      this.Monedas = this.generalService.getMonedas();
    }, 1000);
  }

  GetBancosPais() {
=======
  }  

  GetPaises(){
    setTimeout(() => {
      this.Paises = this.generalService.getPaises();  
    }, 1000);
  }

  GetMonedas(){
    setTimeout(() => {
      this.Monedas = this.generalService.getMonedas();  
    }, 1000);
  }

  GetBancosPais(){
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    if (this.Filtros.pais_bancos == '') {
      this.BancosPais = [];
      this.Filtros.banco = '';
      this.ConsultaFiltrada();
<<<<<<< HEAD
    } else {

      let p = { id_pais: this.Filtros.pais_bancos };
      this.bancoService.getListaBancosByPais(p).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.BancosPais = data.query_data;
        } else {
=======
    }else{

      let p = {id_pais:this.Filtros.pais_bancos};
      this.bancoService.getListaBancosByPais(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.BancosPais = data.query_data;
        }else{
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
          this.BancosPais = [];
          this.swalService.ShowMessage(data);
        }
      });
    }
  }

<<<<<<< HEAD
  AbrirModal(idCuenta: string) {
    this.AbrirModalCrear.next(idCuenta);
  }

  public VerMovimientos(idCuenta: string) {
    this._router.navigate(["/detallemovimientoscuentagerencial", idCuenta]);
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
=======
  AbrirModal(idCuenta:string){
    this.AbrirModalCrear.next(idCuenta);
  }
  
  public VerMovimientos(idCuenta:string){    
    this._router.navigate(["/detallemovimientoscuentagerencial", idCuenta]);
  }

  SetFiltros(paginacion:boolean) {
    let params:any = {};
    
    params.tam = this.pageSize;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.tipo_cuenta.trim() != "") {
      params.tipo_cuenta = this.Filtros.tipo_cuenta;
    }

    if (this.Filtros.nro_cuenta.trim() != "") {
      params.nro_cuenta = this.Filtros.nro_cuenta;
    }

    if (this.Filtros.banco.trim() != "") {
      params.banco = this.Filtros.banco;
    }

    if (this.Filtros.titular.trim() != "") {
      params.titular = this.Filtros.titular;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }

<<<<<<< HEAD
  ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this.cuentaService.getListaCuentasBancarias(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Cuentas = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.Cuentas = [];
        this.swalService.ShowMessage(data);
      }

=======
  ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this.cuentaService.getListaCuentasBancarias(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Cuentas = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Cuentas = [];
        this.swalService.ShowMessage(data);
      }
      
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

<<<<<<< HEAD
  ResetValues() {
    this.Filtros = {
      tipo_cuenta: '',
      nro_cuenta: '',
      banco: '',
      titular: '',
      moneda: '',
      pais_bancos: '',
      estado: ''
    };
  }

  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
=======
  ResetValues(){
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

  SetInformacionPaginacion(){
    var calculoHasta = (this.page*this.pageSize);
    var desde = calculoHasta-this.pageSize+1;
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

<<<<<<< HEAD
  CambiarEstadoCuenta(idCuenta: string) {
    let datos = new FormData();
    datos.append("id_cuenta_bancaria", idCuenta);
    this.cuentaService.cambiarEstadoCuenta(datos).subscribe((data: any) => {

      if (data.codigo == 'success') {
        this.ConsultaFiltrada();
      }

=======
  CambiarEstadoCuenta(idCuenta:string){
    let datos = new FormData();
    datos.append("id_cuenta_bancaria", idCuenta);
    this.cuentaService.cambiarEstadoCuenta(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();
      }
      
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      this.swalService.ShowMessage(data);
    });
  }

}
