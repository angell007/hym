import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { OficinaService } from '../../shared/services/oficinas/oficina.service';
import { OficinaModel } from '../../Modelos/OficinaModel';
import { DepartamentoService } from '../../shared/services/departamento/departamento.service';
import { MunicipioService } from '../../shared/services/municipio/municipio.service';

@Component({
  selector: 'app-modaloficina',
  templateUrl: './modaloficina.component.html',
  styleUrls: ['./modaloficina.component.scss', '../../../style.scss']
})
export class ModaloficinaComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalOficina') ModalOficina:any;

  public Departamentos:Array<any> = [];
  public Municipios:Array<any> = [];
  public openSubscription:any;
  private Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar esta oficina';

  public OficinaModel:OficinaModel = new OficinaModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _toastService:ToastService,
              private _oficinaService:OficinaService,
              private _departamentoService:DepartamentoService,
              private _municipioService:MunicipioService) 
  {
    this.GetDepartamentos();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar esta oficina';
        let p = {id_oficina:data};
        
        this._oficinaService.getOficina(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.OficinaModel = d.query_data;
            this.GetMunicipiosDepartamento(this.OficinaModel.Id_Departamento, true);
            this.ModalOficina.show();  
          }else{
            
            this._swalService.ShowMessage(d);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar esta oficina';
        this.Editar = false;
        this.ModalOficina.show();
      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetDepartamentos(){
    this._departamentoService.getDepartamentos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Departamentos = data.query_data;
      }else{

        this.Departamentos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetMunicipiosDepartamento(idDepartamento:string, cargaEdicion:boolean = false){
    if (!cargaEdicion) {
      this.OficinaModel.Id_Municipio = '';
      this.Municipios = [];  
    }    
    
    let p = {id_departamento:idDepartamento};
    this._municipioService.getMunicipiosDepartamento(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Municipios = data.query_data;
      }else{

        this.Municipios = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarOficina(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }
    
    this.OficinaModel = this._generalService.limpiarString(this.OficinaModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.OficinaModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._oficinaService.editOficina(datos)
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
      this._oficinaService.saveOficina(datos)
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
    
    if (!this._validacionService.validateString(this.OficinaModel.Nombre, 'Nombre Oficina')) {
      return false;
    }else if (!this._validacionService.validateString(this.OficinaModel.Id_Municipio, 'Municipio')) {
      return false;
    }else if (!this._validacionService.validateString(this.OficinaModel.Limite_Transferencia, 'Limite Transferencias')) {
      return false;
    }else if (!this._validacionService.validateString(this.OficinaModel.Nombre_Establecimiento, 'Nombre Establecimiento')) {
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
    this.ModalOficina.hide();
  }

  LimpiarModelo(){
    this.OficinaModel = new OficinaModel();
  }


}
