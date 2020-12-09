import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, style } from '@angular/core';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { BancoService } from '../../shared/services/bancos/banco.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-modalbanco',
  templateUrl: './modalbanco.component.html',
  styleUrls: ['./modalbanco.component.scss', '../../../style.scss']
})
export class ModalbancoComponent implements OnInit, OnDestroy {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalBanco') ModalBanco:any;

  public openSubscription:any;
  public Paises:any = [];
  public Monedas:any = [];
  public Colombia:boolean = false;
  public Venezuela:boolean = false;
  private Editar:boolean = false;

  //Banco Model
  public BancoModel:any = {
    Nombre: '',
    Id_Moneda: '',
    Id_Pais: '',
    Identificador: '',
    Apodo: '',
    Detalle: '',
    Estado: 'Activo',

    //opciones bancos de colombia
    Comision_Consignacion_Nacional: '',
    Comision_Cuatro_Mil: '',
    Comision_Consignacion_Local: '',
    Maximo_Consignacion_Local: '',

    //opciones bancos de venezuela
    Comision_Otros_Bancos: '',
    Comision_Mayor_Valor: '',
    Mayor_Valor: '',
    Maximo_Transferencia_Otros_Bancos: ''
  };

  constructor(private generalService: GeneralService,
              private swalService:SwalService,
              private bancoService:BancoService,
              private monedaService:MonedaService,
              public globales:Globales) 
  {
    setTimeout(() => {
      this.AsignarPaises();  
    }, 800);    
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.Editar = true;
        let p = {id_banco:data};
        this.bancoService.getBanco(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.BancoModel = d.query_data;
            this.CargarMonedasPais();
            this.ModalBanco.show();  
          }else{

            this.swalService.ShowMessage(data);
          }
          
        });
      }else{
        this.Editar = false;
        this.ModalBanco.show();
      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  AsignarPaises(){      
    this.Paises = this.globales.Paises;
  }

  GuardarBanco(){
    // console.log(this.BancoModel);
    this.FillEmptyValues(this.BancoModel);
    
    let info = this.generalService.normalize(JSON.stringify(this.BancoModel));
    let datos = new FormData();
    datos.append("modulo",'Banco');
    datos.append("modelo",info);
    if (this.Editar) {
      this.bancoService.editBanco(datos)
      .catch(error => { 
        // console.log('An error occurred:', error);
        this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          this.Colombia = false;
          this.Venezuela = false;
          this.Editar = false;
        }
        
        this.swalService.ShowMessage(data);
      });
    }else{
      this.bancoService.saveBanco(datos)
      .catch(error => { 
        // console.log('An error occurred:', error);
        this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          this.Colombia = false;
          this.Venezuela = false;
        }
        
        this.swalService.ShowMessage(data);
      });
    }    
  }

  FillEmptyValues(obj:any, value:string = '0'){
    for (const key in obj) {
      if (obj[key] == '') {
        obj[key] = value;        
      }
    }
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  SeleccionarPais(Pais){
    //1 para colombia
    //2 para venezuela

    switch(Pais){
      case "1":{
        this.Colombia = true;
        this.Venezuela = false;
        break;
      }
      case "2":{
        this.Colombia = false;
        this.Venezuela = true;
        break;
      }
      default:{
        this.Colombia = false;
        this.Venezuela = false;
      }
    }
    
  }

  CargarMonedasPais(){
    if (this.BancoModel.Id_Pais == '') {
      this.Monedas = [];
      //this.swalService.ShowMessage(['warning', 'Alerta', 'No se encontraron moneddas asociadas al pais seleccionado!']);
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debe escoger un país para cargar las monedas disponibles!']);
      return;
    }

    this.SeleccionarPais(this.BancoModel.Id_Pais);

    let p = {id_pais:this.BancoModel.Id_Pais};
    this.monedaService.getMonedasPais(p).subscribe((data:any) => {
      if (data.codigo == 'success') {

        this.Monedas = data.query_data;        
      }else{

        this.swalService.ShowMessage(data);  
        this.Monedas = [];
        this.BancoModel.Id_Moneda = '';
      }
      
    });
  }

  CerrarModal(){
    this.LimpiarModelo();
    this.ModalBanco.hide();
  }

  LimpiarModelo(){
    this.BancoModel = {
      Nombre: '',
      Id_Moneda: '',
      Id_Pais: '',
      Identificador: '',
      Apodo: '',
      Detalle: '',
      Estado: 'Activo',

      //opciones bancos de colombia
      Comision_Consignacion_Nacional: '',
      Comision_Cuatro_Mil: '',
      Comision_Consignacion_Local: '',
      Maximo_Consignacion_Local: '',

      //opciones bancos de venezuela
      Comision_Otros_Bancos: '',
      Comision_Mayor_Valor: '',
      Mayor_Valor: '',
      Maximo_Transferencia_Otros_Bancos: ''
    };
  }

}
