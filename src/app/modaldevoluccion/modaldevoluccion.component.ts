import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modaldevoluccion',
  templateUrl: './modaldevoluccion.component.html',
  styleUrls: ['./modaldevoluccion.component.scss']
})
export class ModaldevoluccionComponent implements OnInit {
  @ViewChild('ModalDevolucion') ModalDevolucion: any;
  @Input() AbrirModal: Observable<any> = new Observable();
  public openSubscription: any;

  constructor() { }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: string) => {

      // console.log('data', data);
      // if (data != "0") {
      // this.Editar = true;
      // this.MensajeGuardar = 'Se dispone a actualizar este egreso';
      // let p = { id_egreso: data };

      // this._EgresoService.getEgreso(p).subscribe((d: any) => {
      //   if (d.codigo == 'success') {
      //     this.EgresoModel = d.query_data;
      this.ModalDevolucion.show();
      //   } else {

      //     this.ShowSwal('warning', 'Alerta', 'ingresando a egresos');
      //   }

      // });
      // } else {
      // this.MensajeGuardar = 'Se dispone a guardar este egreso';
      // this.Editar = false;
      // this.GetMonedas();
      // this.ModalEgreso.show();
      // }
    });
  }

}
