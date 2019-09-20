import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { CuentaBancariaModel } from '../../Modelos/CuentaBancariaModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { BancoService } from '../../shared/services/bancos/banco.service';

@Component({
  selector: 'app-modalcuentabancaria',
  templateUrl: './modalcuentabancaria.component.html',
  styleUrls: ['./modalcuentabancaria.component.scss', '../../../style.scss']
})
export class ModalcuentabancariaComponent implements OnInit, OnDestroy {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalCuentaBancaria') ModalCuentaBancaria:any;

  public BancosPais:Array<any> = [];
  public Paises:any = [];
  public Monedas:any = [];
  public TiposCuenta:any = [];

  public openSubscription:any;
  private Editar:boolean = false;

  public CuentaBancariaModel:CuentaBancariaModel = new CuentaBancariaModel();

  constructor(private generalService: GeneralService,
              private swalService:SwalService,
              private validacionService:ValidacionService,
              private cuentaService:CuentabancariaService,
              private bancoService:BancoService) 
  { 
    this.GetMonedas();
    this.GetPaises();
    this.GetTiposCuenta();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.Editar = true;
        let p = {id_cuenta:data};
        
        this.cuentaService.getCuentaBancaria(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.CuentaBancariaModel = d.query_data;
            this.GetBancosPais();
            this.ModalCuentaBancaria.show();  
          }else{
            
            this.swalService.ShowMessage(d);
          }
          
        });
      }else{
        this.Editar = false;
        this.ModalCuentaBancaria.show();
      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetPaises(){
    setTimeout(() => {
      this.Paises = this.generalService.getPaises();  
    }, 1000);
  }

  GetMonedas(){
    this.generalService.BuscarMonedas().subscribe((response:any) => {
      console.log(response);
      this.Monedas = response.query_data; 
    });
  }

  GetTiposCuenta(){
    setTimeout(() => {
      this.TiposCuenta = this.generalService.getTiposCuenta();  
    }, 1000);
  }

  GuardarCuenta(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    this.FillEmptyValues(this.CuentaBancariaModel);
    this.CuentaBancariaModel = this.generalService.limpiarString(this.CuentaBancariaModel);
    
    let info = this.generalService.normalize(JSON.stringify(this.CuentaBancariaModel));
    let datos = new FormData();
    datos.append("modulo",'Cuenta_Bancaria');
    datos.append("modelo",info);

    if (this.Editar) {
      this.cuentaService.editCuentaBancaria(datos)
      .catch(error => { 
        console.log('An error occurred:', error);
        this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          this.Editar = false;
        }
        
        this.swalService.ShowMessage(data);
      });
    }else{
      this.cuentaService.saveCuentaBancaria(datos)
      .catch(error => { 
        console.log('An error occurred:', error);
        this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
        }
        
        this.swalService.ShowMessage(data);
      });
    }    
  }

  ValidateBeforeSubmit():boolean{
    
    if (!this.validacionService.validateString(this.CuentaBancariaModel.Nombre_Titular, 'Nombre Titular')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Tipo_Cuenta, 'Tipo Cuenta')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Tipo, 'Tipo')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Id_Pais, 'Pais')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Numero_Cuenta, 'Numero Cuenta')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Id_Banco, 'Banco')) {
      return false;
    }else if (!this.validacionService.validateNumber(this.CuentaBancariaModel.Identificacion_Titular, 'Identificacion Titular')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Id_Moneda, 'Moneda')) {
      return false;
    }else if (!this.validacionService.validateNumber(this.CuentaBancariaModel.Monto_Inicial, 'Saldo Inicial')) {
      return false;
    }else if (!this.validacionService.validateString(this.CuentaBancariaModel.Detalle, 'Detalles')) {
      return false;
    }else{
      return true;
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

  CerrarModal(){
    this.LimpiarModelo();
    this.ModalCuentaBancaria.hide();
  }

  LimpiarModelo(){
    this.CuentaBancariaModel = new CuentaBancariaModel();
  }

  GetBancosPais(){
    if (this.CuentaBancariaModel.Id_Pais == '') {
      this.BancosPais = [];
      this.CuentaBancariaModel.Id_Banco = '';
    }else{

      let p = {id_pais:this.CuentaBancariaModel.Id_Pais};
      this.bancoService.getListaBancosByPais(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.BancosPais = data.query_data;
        }else{
          this.BancosPais = [];
          this.swalService.ShowMessage(data);
        }
      });
    }
  }


}
