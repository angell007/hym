import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DestinatarioGiroModel } from '../../Modelos/DestinatarioGiroModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { DestinatariogiroService } from '../../shared/services/destinatariosgiros/destinatariogiro.service';
import { TipodocumentoService } from '../../shared/services/tiposdocumento/tipodocumento.service';

@Component({
  selector: 'app-modaldestinatariogiro',
  templateUrl: './modaldestinatariogiro.component.html',
  styleUrls: ['./modaldestinatariogiro.component.scss', '../../../style.scss']
})
export class ModaldestinatariogiroComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalDestinatarioGiro') ModalDestinatarioGiro:any;

  public TiposDocumento:Array<any> = [];
  public openSubscription:any;
  private Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar este destinatario';

  public DestinatarioModel:DestinatarioGiroModel = new DestinatarioGiroModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _toastService:ToastService,
              private _DestinatarioService:DestinatariogiroService,
              private _tipoDocumentoService:TipodocumentoService) 
  {
    this.GetTiposDocumento();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este destinatario';
        let p = {id_moneda:data};
        
        this._DestinatarioService.getDestinatario(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.DestinatarioModel = d.query_data;
            this.ModalDestinatarioGiro.show();  
          }else{
            
            this._swalService.ShowMessage(d);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar este destinatario';
        this.Editar = false;
        this.ModalDestinatarioGiro.show();
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
    if (this.DestinatarioModel.Documento_Destinatario != '') {
      let p = {id:this.DestinatarioModel.Documento_Destinatario};
      this._DestinatarioService.checkIdentificacioDestinatario(p).subscribe((data:any) => {
        if (data.codigo != 'success') {
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj); 
          this.DestinatarioModel.Documento_Destinatario = '';
        }
      });
    }
  }

  GuardarDestinatarioGiro(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    //console.log(this.DestinatarioModel);
    
    this.DestinatarioModel = this._generalService.limpiarString(this.DestinatarioModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.DestinatarioModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._DestinatarioService.editDestinatario(datos)
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
      this._DestinatarioService.saveDestinatario(datos)
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
    
    if (!this._validacionService.validateString(this.DestinatarioModel.Documento_Destinatario, 'Documento Destinatario')) {
      return false;
    }else if (!this._validacionService.validateString(this.DestinatarioModel.Nombre_Destinatario, 'Nombre Destinatario')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.DestinatarioModel.Id_Tipo_Documento, 'Tipo Documento')) {
      return false;
    }else if (!this._validacionService.validateString(this.DestinatarioModel.Telefono_Destinatario, 'Telefono Destinatario')) {
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
    this.ModalDestinatarioGiro.hide();
  }

  LimpiarModelo(){
    this.DestinatarioModel = new DestinatarioGiroModel();
  }

}
