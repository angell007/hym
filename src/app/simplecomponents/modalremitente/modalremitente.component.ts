import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { RemitenteModel } from '../../Modelos/RemitenteModel';
import { Observable } from 'rxjs';
import { SwalService } from '../../shared/services/swal/swal.service';
import { RemitenteService } from '../../shared/services/remitentes/remitente.service';

@Component({
  selector: 'app-modalremitente',
  templateUrl: './modalremitente.component.html',
  styleUrls: ['./modalremitente.component.scss']
})
export class ModalremitenteComponent implements OnInit, OnDestroy {

  @Input() AbrirModalEvent:Observable<any>;

  @Output() CargarDatosRemitente:EventEmitter<object> = new EventEmitter();

  @ViewChild('ModalRemitente') ModalRemitente:any;

  private suscripcion: any;
  private tipo_persona:string = '';

  public RemitenteModel:RemitenteModel = new RemitenteModel();

  constructor(private swalService:SwalService, private remitenteService:RemitenteService) { }

  ngOnInit() {
    this.suscripcion = this.AbrirModalEvent.subscribe((data:any) => {
      this.tipo_persona = data.tipo;
      this.GetRemitenteData(data.remitente);
      console.log(this.tipo_persona);
      console.log(data);
      
      this.ModalRemitente.show(); 
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
    this.CerrarModal();
  }

  GetRemitenteData(idRemitente:string){
    this.remitenteService.getRemitente(idRemitente).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.RemitenteModel = data.query_data;

      }else{

        this.swalService.ShowMessage(data);
        this.RemitenteModel = new RemitenteModel();
      }
    });
  }

  GuardarRemitente(){
    if(!this.ValidateModelBeforeSubmit()){
      return;
    }

    let modelo = JSON.stringify(this.RemitenteModel);
    let datos = new FormData();
    datos.append("modelo", modelo);
    this.remitenteService.editRemitente(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        let data = {tipo:this.tipo_persona, model:this.RemitenteModel};
        this.CargarDatosRemitente.emit(data);
        this.CerrarModal();
      }
      
      this.swalService.ShowMessage(data);
    });
  }

  ValidateModelBeforeSubmit(){
    if (this.RemitenteModel.Id_Transferencia_Remitente == '') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'El número de documento no puede estar vacio']);
      return false;
    }

    if (this.RemitenteModel.Nombre == '') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'El nombre no puede estar vacio']);
      return false;
    }

    if (this.RemitenteModel.Telefono == '') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'El telefono no puede estar vacio']);
      return false;
    }

    return true;
  }

  CerrarModal(){
    this.RemitenteModel = new RemitenteModel();
    this.ModalRemitente.hide();
  };

}
