import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CajaRecaudoModel } from '../../Modelos/CajaRecaudomodel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { CajarecaudoService } from '../../shared/services/cajarecaudos/cajarecaudo.service';
import { MunicipioService } from '../../shared/services/municipio/municipio.service';
import { DepartamentoService } from '../../shared/services/departamento/departamento.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-modalcajarecaudo',
  templateUrl: './modalcajarecaudo.component.html',
  styleUrls: ['./modalcajarecaudo.component.scss', '../../../style.scss']
})
export class ModalcajarecaudoComponent implements OnInit, OnDestroy {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalCajaRecaudo') ModalCajaRecaudo:any;

  public openSubscription:any;
  public Departamentos:any = [];
  public Municipios:any = [];
  private Editar:boolean = false;
  public VerPassWord = false;
  public PasswordType = 'password';
  public MensajeGuardar:string = 'Se dispone a guardar esta caja recaudo';

  //Banco Model
  public CajaRecaudoModel:CajaRecaudoModel =  new CajaRecaudoModel();

  constructor(private generalService: GeneralService,
              private swalService:SwalService,
              private _toastyService:ToastService,
              private _cajaRecaudoService:CajarecaudoService,
              private _municipioService:MunicipioService,
              private _departamentoService:DepartamentoService,
              private validacionService:ValidacionService) 
  {
    this.GetDepartamentos();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.MensajeGuardar = 'Se dispone a actualizar esta caja recaudo';
        this.Editar = true;
        let p = {id_caja_recaudo:data};
        this._cajaRecaudoService.getCajaRecaudo(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.CajaRecaudoModel = d.query_data;
            this.GetMunicipiosDepartamento();
            this.ModalCajaRecaudo.show();  
          }else{

            this.swalService.ShowMessage(data);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar esta caja recaudo';
        this.Editar = false;
        this.ModalCajaRecaudo.show();
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
        this.swalService.ShowMessage(data);
      }
    });
  }

  GetMunicipiosDepartamento(){
    if (this.CajaRecaudoModel.Id_Departamento == '') {
      this.CajaRecaudoModel.Id_Municipio = '';
      this.Municipios = [];
    }else{

      let p = {id_departamento:this.CajaRecaudoModel.Id_Departamento};
      this._municipioService.getMunicipiosDepartamento(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.Municipios = data.query_data;
        }else{
          this.Municipios = [];
          this.swalService.ShowMessage(data);
        }
      });
    }    
  }

  GuardarCajaRecaudo(){   
    if (!this.ValidateBeforeSubmit()) {
      return;
    }
    
    let info = this.generalService.normalize(JSON.stringify(this.CajaRecaudoModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._cajaRecaudoService.editCajaRecaudo(datos)
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
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastyService.ShowToast(toastObj);
        }else{

          this.swalService.ShowMessage(data); 
        }
      });
    }else{
      this._cajaRecaudoService.saveCajaRecaudo(datos)
      .catch(error => { 
        console.log('An error occurred:', error);
        this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastyService.ShowToast(toastObj);
        }else{

          this.swalService.ShowMessage(data);
        }
      });
    }    
  }

  ValidateBeforeSubmit(){
    if (!this.validacionService.validateString(this.CajaRecaudoModel.Nombre, 'Nombre Caja Recaudo')) {
      return false;
    }else if (!this.validacionService.validateString(this.CajaRecaudoModel.Id_Departamento, 'Departamento')) {
      return false;
    }else if (!this.validacionService.validateString(this.CajaRecaudoModel.Id_Municipio, 'Municipio')) {
      return false;
    }else if (!this.validacionService.validateString(this.CajaRecaudoModel.Username, 'Nombre de usuario')) {
      return false;
    }else if (!this.validacionService.validateString(this.CajaRecaudoModel.Password, 'Constraseña')) {
      return false;
    }

    return true;
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
    this.ModalCajaRecaudo.hide();
  }

  LimpiarModelo(){
    this.CajaRecaudoModel = new CajaRecaudoModel();
  }

  CambiarInputType(){
    this.VerPassWord = !this.VerPassWord;

    if (this.VerPassWord) {      
      this.PasswordType = 'text';
    }else{
      this.PasswordType = 'password';
    }
  }

}
