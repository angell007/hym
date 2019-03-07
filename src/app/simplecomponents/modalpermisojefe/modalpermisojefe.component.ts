import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';

@Component({
  selector: 'app-modalpermisojefe',
  templateUrl: './modalpermisojefe.component.html',
  styleUrls: ['./modalpermisojefe.component.scss']
})
export class ModalpermisojefeComponent implements OnInit, OnDestroy {

  @Input() AbrirModalEvent:Observable<any>;

  @Output() RespuestaCodigo:EventEmitter<boolean> = new EventEmitter();
  @Output() MostrarSwal:EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalPermiso') ModalPermiso:any;  

  private suscripcion: any;
  public Codigo:string = "";

  public SwalDataObj:any = {
    type: 'warning',
    title: 'Alerta',
    msg: 'Default'
  };

  constructor(private generalService:GeneralService) {
  }

  ngOnInit(){
    this.suscripcion = this.AbrirModalEvent.subscribe((data) => 
    {
      this.ModalPermiso.show(); 
    });
  }
  
  ngOnDestroy() {
    this.suscripcion.unsubscribe();
    this.CerrarModal();
  }

  VerificarCodigo(){
    this.generalService.verifyMajorCode(this.Codigo).subscribe((data:any) => 
    {
      if (data.codigo == 'success') {
        this.CerrarModal();
        this.RespuestaCodigo.emit(!data.query_data);
      }else{

        this.SetDatosMensaje(data);
        this.MostrarSwal.emit(this.SwalDataObj);
      }
    });
  }

  CerrarModal(){
    this.Codigo = "";
    this.ModalPermiso.hide();
  }

  SetDatosMensaje(data:any){
    this.SwalDataObj.type = data.codigo;
    this.SwalDataObj.title = data.titulo;
    this.SwalDataObj.msg = data.mensaje;
  }

}
