import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { RemitentegiroService } from '../../shared/services/remitentesgiros/remitentegiro.service';
import { TipodocumentoService } from '../../shared/services/tiposdocumento/tipodocumento.service';
import { RemitenteGiroModel } from '../../Modelos/RemitenteGiroModel';

@Component({
  selector: 'app-modalremitentegiro',
  templateUrl: './modalremitentegiro.component.html',
  styleUrls: ['./modalremitentegiro.component.scss', '../../../style.scss']
})
export class ModalremitentegiroComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalRemitenteGiro') ModalRemitenteGiro:any;

  public TiposDocumento:Array<any> = [];
  public openSubscription:any;
  public Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar este remitente';

  public RemitenteModel:RemitenteGiroModel = new RemitenteGiroModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _toastService:ToastService,
              private _remitenteService:RemitentegiroService,
              private _tipoDocumentoService:TipodocumentoService) 
  {
    this.GetTiposDocumento();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este remitente';
        let p = {id_remitente:data};
        
        this._remitenteService.getRemitente(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.RemitenteModel = d.query_data;
            this.ModalRemitenteGiro.show();  
          }else{
            
            this._swalService.ShowMessage(d);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar este remitente';
        this.Editar = false;
        this.ModalRemitenteGiro.show();
      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetTiposDocumento(){
    this._tipoDocumentoService.getTiposDocumentosNacionales().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TiposDocumento = data.query_data;
      }else{

        this.TiposDocumento = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  VerificarIdentificacion(){
    if (this.RemitenteModel.Documento_Remitente != '') {
      let p = {id:this.RemitenteModel.Documento_Remitente};
      this._remitenteService.checkIdentificacionRemitente(p).subscribe((data:any) => {
        if (data.codigo != 'success') {
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj); 
          this.RemitenteModel.Documento_Remitente = '';
        }
      });
    }
  }

  GuardarRemitenteGiro(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    //console.log(this.RemitenteModel);
    
    this.RemitenteModel = this._generalService.limpiarString(this.RemitenteModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.RemitenteModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._remitenteService.editRemitente(datos)
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
      this._remitenteService.saveRemitente(datos)
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
    
    if (!this._validacionService.validateString(this.RemitenteModel.Documento_Remitente, 'Documento remitente')) {
      return false;
    }else if (!this._validacionService.validateString(this.RemitenteModel.Nombre_Remitente, 'Nombre Remitente')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.RemitenteModel.Id_Tipo_Documento, 'Tipo Documento')) {
      return false;
    }else if (!this._validacionService.validateString(this.RemitenteModel.Telefono_Remitente, 'Telefono Remitente')) {
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
    this.ModalRemitenteGiro.hide();
  }

  LimpiarModelo(){
    this.RemitenteModel = new RemitenteGiroModel();
  }

}
