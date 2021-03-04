import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TrasladoModel } from '../../Modelos/TrasladoModel';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-edit-traslado',
  templateUrl: './edit-traslado.component.html',
  styleUrls: ['./edit-traslado.component.scss']
})
export class EditTrasladoComponent implements OnInit {

  @ViewChild('ModalTraslado') ModalTraslado: any;
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();
  @Input('Enter') Enter: Observable<any>;

  public openSubscription: any;
  public openSubscription2: any;
  public TrasladoModel: TrasladoModel = new TrasladoModel();

  public AbrirModalEdit: Subject<any>;

  constructor(private client: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.openSubscription = this.Enter.subscribe((data) => {
      this.TrasladoModel = Object.assign({}, data)
      this.ModalTraslado.show();
    });
  }

  CerrarModal() {
    this.LimpiarModelo();
    this.ModalTraslado.hide();
  }

  LimpiarModelo() {
    this.TrasladoModel = new TrasladoModel();
  }

  saveTraslado() {
    const data = new FormData();
    data.append('datos', JSON.stringify(this.TrasladoModel))
    this.client.post(this.globales.rutaNueva + 'traslados', data).subscribe((data: Array<any>) => {

      this.transformResponse(data)

    });
  }

  transformResponse(data: Array<any>) {
    if (data['cod'] == 200) {
      this.ActualizarTabla.emit();
      this.CerrarModal();
    }
    if (data['cod'] != 200) {
      console.log(data);
    }
  }
}
