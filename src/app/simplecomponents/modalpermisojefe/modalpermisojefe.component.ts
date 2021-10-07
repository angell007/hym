import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { PermisoService } from '../../shared/services/permisos/permiso.service';

@Component({
  selector: 'app-modalpermisojefe',
  templateUrl: './modalpermisojefe.component.html',
  styleUrls: ['./modalpermisojefe.component.scss']
})
export class ModalpermisojefeComponent implements OnInit, OnDestroy {

  @Input() AbrirModalEvent: Observable<any>;

  @Output() RespuestaCodigo: EventEmitter<boolean> = new EventEmitter();
  @Output() MostrarSwal: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalPermiso') ModalPermiso: any;

  private suscripcion: any;
  private openModalSubscription: any;
  public Codigo: string = "";

  public SwalDataObj: any = {
    type: 'warning',
    title: 'Alerta',
    msg: 'Default'
  };

  private accion: string = '';

  private response = { valor: '', aux_value: '', verificado: false, accion: '' };

  constructor(private generalService: GeneralService,
    private swalService: SwalService,
    private permisoService: PermisoService) {
  }

  ngOnInit() {
    // this.suscripcion = this.AbrirModalEvent.subscribe((data) => 
    // {
    //   this.ModalPermiso.show(); 
    // });
    this.openModalSubscription = this.permisoService.openModalPermiso.subscribe(d => {

      console.log(d);

      this.accion = d.accion;
      this.response.accion = d.accion;
      if (d.accion == 'transferencia_cajero') {
        this.response.valor = d.value;
      } else if (d.accion == 'servicio_externo') {
        this.response.valor = d.value;
      }
      this.ModalPermiso.show();
    });
  }

  ngOnDestroy() {
    this.openModalSubscription.unsubscribe();
    this.CerrarModal();
  }

  VerificarCodigo() {
    this.generalService.verifyMajorCode(this.Codigo).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CerrarModal();
        this.permisoService.permisoAceptado = data.query_data;
        if (this.accion == 'transferencia_cajero') {
          this.response.verificado = data.query_data;
          this.permisoService._subject.next(this.response);
        } else if (this.accion == 'servicio_externo') {
          this.response.verificado = data.query_data;
          this.permisoService._subject.next(this.response);
        } else {
          this.permisoService._subject.next(data.query_data);
        }
      } else {

        this.swalService.ShowMessage(data);
      }
    });
  }

  CerrarModal() {
    console.log(this.accion);
    this.Codigo = "";
    this.ModalPermiso.hide();

    if (this.accion == 'transferencia_cajero') {
    } else if (this.accion == 'servicio_externo') {
      this.response.verificado = false;
      this.permisoService._subject.next(this.response);
      console.log(this.response);
    } else {
      this.permisoService._subject.next(this.response);
    }
  }

  SetDatosMensaje(data: any) {
    this.SwalDataObj.type = data.codigo;
    this.SwalDataObj.title = data.titulo;
    this.SwalDataObj.msg = data.mensaje;
  }

}
