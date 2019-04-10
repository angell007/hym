import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { CorresponsalDiarioModel } from '../../Modelos/CorresponsalDiarioModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { CorresponsalbancarioService } from '../../shared/services/corresponsalesbancarios/corresponsalbancario.service';

@Component({
  selector: 'app-modalcorresponsaldiario',
  templateUrl: './modalcorresponsaldiario.component.html',
  styleUrls: ['./modalcorresponsaldiario.component.scss', '../../../style.scss']
})
export class ModalcorresponsaldiarioComponent implements OnInit, OnDestroy {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalCorresponsalDiario') ModalCorresponsalDiario:any;

  public TiposDocumento:Array<any> = [];
  public CorresponsalesBancarios:Array<any> = [];
  public openSubscription:any;
  public Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar este movimiento';
  public accion:string = 'crear';
  public NombreCorresponsalBancario:string = '';
 
  public CorresponsalModel:CorresponsalDiarioModel = new CorresponsalDiarioModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _toastService:ToastService,
              private _corresponsalService:CorresponsalbancarioService) 
  {
    this.GetCorresponsalesBancarios();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      console.log(data);

      if (data.id_corresponsal_diario == '0' && data.id_corresponsal_bancario != '0') {
        console.log(this.CorresponsalesBancarios);
        let nombre = this.CorresponsalesBancarios.find(x => x.Id_Corresponsal_Bancario == data.id_corresponsal_bancario);
        console.log(nombre);
        
        this.NombreCorresponsalBancario = nombre.Nombre;
        this.accion = 'cargar';
        this.CorresponsalModel.Id_Corresponsal_Bancario = data.id_corresponsal_bancario;
        this.MensajeGuardar = 'Se dispone a guardar este movimiento';
        this.Editar = false;
        this.ModalCorresponsalDiario.show();

      }else if (data.id_corresponsal_diario == '0' && data.id_corresponsal_bancario == '0'){
        this.accion = 'crear';
        this.MensajeGuardar = 'Se dispone a guardar este movimiento';
        this.Editar = false;
        this.ModalCorresponsalDiario.show();

      }else if (data.id_corresponsal_diario != '0' && data.id_corresponsal_bancario == '0'){
        this.accion = 'editar';
        //this.CorresponsalModel.Id_Corresponsal_Diario = data.id_corresponsal_diario;
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este movimiento';
        let p = {id_movimiento:data};
        
        // this._corresponsalService.getDestinatario(p).subscribe((d:any) => {
        //   if (d.codigo == 'success') {
        //     this.CorresponsalModel = d.query_data;
        //     this.ModalCorresponsalDiario.show();  
        //   }else{
            
        //     this._swalService.ShowMessage(d);
        //   }
          
        // });

      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetCorresponsalesBancarios(){
    this._corresponsalService.getCorresponsales().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CorresponsalesBancarios = data.query_data;
      }else{

        this.CorresponsalesBancarios = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarCorresponsalDiario(){

    this.CorresponsalModel.Identificacion_Funcionario = this._generalService.Funcionario.Identificacion_Funcionario;
    this.CorresponsalModel.Id_Oficina = this._generalService.Oficina;
    this.CorresponsalModel.Id_Caja = this._generalService.Caja;   
    this.CorresponsalModel.Fecha = this._generalService.FechaActual;

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    //console.log(this.CorresponsalModel);
    this.CorresponsalModel = this._generalService.limpiarString(this.CorresponsalModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.CorresponsalModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._corresponsalService.editCorresponsalDiario(datos)
      .catch(error => { 
        //console.log('An error occurred:', error);
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          this.Editar = false;
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }else{
          this._swalService.ShowMessage(data);
        }
      });
    }else{
      this._corresponsalService.saveCorresponsalDiario(datos)
      .catch(error => { 
        //console.log('An error occurred:', error);
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }else{
          this._swalService.ShowMessage(data);
        }
      });
    }    
  }

  ValidateBeforeSubmit():boolean{
    
    if (!this._validacionService.validateNumber(this.CorresponsalModel.Id_Corresponsal_Bancario, 'Corresponsal Bancario')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.CorresponsalModel.Id_Tipo_Movimiento_Corresponsal, 'Tipo Movimiento')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.CorresponsalModel.Identificacion_Funcionario, 'Identificacion Funcionario')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.CorresponsalModel.Id_Oficina, 'Oficina')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.CorresponsalModel.Id_Caja, 'Caja')) {
      return false;
    }else{
      return true;
    }
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  CerrarModal(){
    this.LimpiarModelo();
    this.ModalCorresponsalDiario.hide();
  }

  LimpiarModelo(){
    this.CorresponsalModel = new CorresponsalDiarioModel();
    this.NombreCorresponsalBancario = '';
    this.accion = 'crear';
  }

  TestValue(value:string){
    console.log(value);    
  }

  TestV(){
    console.log(this.CorresponsalModel);
  }

}
