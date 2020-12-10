import { Component, OnInit, Input, Output, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ServiciosexternosService } from '../../shared/services/serviciosexternos/serviciosexternos.service';
import { ServicioExternoModel } from '../../Modelos/ServicioExternoModel';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';

@Component({
  selector: 'app-modalservicioexterno',
  templateUrl: './modalservicioexterno.component.html',
  styleUrls: ['./modalservicioexterno.component.scss', '../../../style.scss']
})
export class ModalservicioexternoComponent implements OnInit, OnDestroy {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalServicioExterno') ModalServicioExterno: any;

  public openSubscription: any;
  private Editar: boolean = false;

  //Banco Model
  public ServicioExternoModel: ServicioExternoModel = new ServicioExternoModel();

  constructor(private generalService: GeneralService,
    private swalService: SwalService,
    private servicioService: ServiciosexternosService,
    private validacionService: ValidacionService) {
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: string) => {

      if (data != "0") {
        this.Editar = true;
        let p = { id_servicio_externo: data };

        this.servicioService.getServicio(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.ServicioExternoModel = d.query_data;
            this.ModalServicioExterno.show();
          } else {

            this.swalService.ShowMessage(d);
          }

        });
      } else {
        this.Editar = false;
        this.ModalServicioExterno.show();
      }
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GuardarServicioExterno() {
    // console.log(this.ServicioExternoModel);

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    this.FillEmptyValues(this.ServicioExternoModel);

    let info = this.generalService.normalize(JSON.stringify(this.ServicioExternoModel));
    let datos = new FormData();
    datos.append("modulo", 'Servicio Externo');
    datos.append("modelo", info);
    if (this.Editar) {
      this.servicioService.editServicio(datos)
        .catch(error => {
          // console.log('An error occurred:', error);
          this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            this.Editar = false;
          }

          this.swalService.ShowMessage(data);
        });
    } else {
      this.servicioService.saveServicio(datos)
        .catch(error => {
          // console.log('An error occurred:', error);
          this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
          }

          this.swalService.ShowMessage(data);
        });
    }
  }

  ValidateBeforeSubmit(): boolean {
    if (!this.validacionService.validateString(this.ServicioExternoModel.Nombre, 'Nombre Servicio')) {
      return false;
    } else if (!this.validacionService.validateNumber(this.ServicioExternoModel.Comision, 'Comision')) {
      return false;
    } else {
      return true;
    }
  }

  FillEmptyValues(obj: any, value: string = '0') {
    for (const key in obj) {
      if (obj[key] == '') {
        obj[key] = value;
      }
    }
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  CerrarModal() {
    this.LimpiarModelo();
    this.ModalServicioExterno.hide();
  }

  LimpiarModelo() {
    this.ServicioExternoModel = new ServicioExternoModel();
  }

}
