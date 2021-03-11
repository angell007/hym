import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-detalle-ajuste',
  templateUrl: './modal-detalle-ajuste.component.html',
  styleUrls: ['./modal-detalle-ajuste.component.scss']
})
export class ModalDetalleAjusteComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();
  private openSubscription: Subscription;
  @ViewChild('ModalDetalle') ModalDetalle: any;

  dataDetalle = {
    Codigo_Movimiento: '',
    Detalle: '',
    Estado: '',
    Valor_Pagado: '',
    Tipo_Movimiento: '',
    Fecha: '',
  }

  constructor() { }

  ngOnInit() {

    this.openSubscription = this.AbrirModal.subscribe((data: any) => {

      this.dataDetalle = data;

      console.log([
        data
      ]);

      this.ModalDetalle.show();

    });
  }

  public CerrarModal() {
    this.ModalDetalle.hide();
  }

}
