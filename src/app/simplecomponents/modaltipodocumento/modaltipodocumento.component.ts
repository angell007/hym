import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoDocumentoModel } from '../../Modelos/TipoDocumentoModel';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { GeneralService } from '../../shared/services/general/general.service';
import { TipodocumentoService } from '../../shared/services/tiposdocumento/tipodocumento.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';

@Component({
  selector: 'app-modaltipodocumento',
  templateUrl: './modaltipodocumento.component.html',
  styleUrls: ['./modaltipodocumento.component.scss', '../../../style.scss']
})
export class ModaltipodocumentoComponent implements OnInit {

  @Input() AbrirModalEvent:Observable<any>;

  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalTipoDocumento') ModalTipoDocumento:any;

  private suscripcion: any;
  public Paises:Array<any> = [];
  private Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar este tipo de documento';

  public TipoDocumentoModel:TipoDocumentoModel = new TipoDocumentoModel();

  constructor(private _swalService:SwalService, 
              private _tipoDocumentoService:TipodocumentoService,
              private _toastService:ToastService,
              private _generalService:GeneralService,
              private _validacionService:ValidacionService) 
  {
    this.GetPaises();
  }

  ngOnInit() {
    this.suscripcion = this.AbrirModalEvent.subscribe((data:string) => {
      
      if (data != "0") {
        this.MensajeGuardar = 'Se dispone a actualizar este tipo de documento';
        this.Editar = true;
        let p = {id_tipo_documento:data};
        this._tipoDocumentoService.getTipoDocumento(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.TipoDocumentoModel = d.query_data;
            this.ModalTipoDocumento.show();  
          }else{

            this._swalService.ShowMessage(data);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar este  tipo de documento';
        this.Editar = false;
        this.ModalTipoDocumento.show();
      }
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
    this.CerrarModal();
  }

  async GetPaises(){
  
      this.Paises = await this._generalService.getPaises();  
  
  }

  GuardarTipoDocumento(){
    if(!this.ValidateBeforeSubmit()){
      return;
    }
    
    let modelo = this._generalService.normalize(JSON.stringify(this.TipoDocumentoModel));
    let datos = new FormData();
    datos.append("modelo", modelo);

    if (this.Editar) {
      this._tipoDocumentoService.editTipoDocumento(datos)
      .catch(error => { 
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.ActualizarTabla.emit();
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
          this.CerrarModal();
        }else{
          this._swalService.ShowMessage(data);
        }
      });
    }else{
      this._tipoDocumentoService.saveTipoDocumento(datos)
      .catch(error => { 
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.ActualizarTabla.emit();
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
          this.CerrarModal();
        }else{
          this._swalService.ShowMessage(data);
        }
      });
    }
  }

  ValidateBeforeSubmit(){
    if (!this._validacionService.validateString(this.TipoDocumentoModel.Nombre, 'Nombre tipo documento')) {
      return false;
    }else if (!this._validacionService.validateString(this.TipoDocumentoModel.Codigo, 'Codigo')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.TipoDocumentoModel.Id_Pais, 'Pais')) {
      return false;
    }

    return true;
  }


  CerrarModal(){
    this.TipoDocumentoModel = new TipoDocumentoModel();
    this.ModalTipoDocumento.hide();
  };

  handleError(error: Response) {
    return Observable.throw(error);
  }

}
