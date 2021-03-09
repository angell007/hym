import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Globales } from '../shared/globales/globales';
// import { ReciboRecaudoDetalleModel } from '../Modelos/VerModels/ReciboRecaudoDetalleModel';
// import { RecaudoService } from '../shared/services/Recaudo/Recaudo.service';

@Component({
  selector: 'app-modal-detalle-recaudo',
  templateUrl: './modal-detalle-recaudo.component.html',
  styleUrls: ['./modal-detalle-recaudo.component.scss']
})

export class ModalDetalleRecaudoComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();

  @ViewChild('ModalVerRecibo') ModalVerRecibo: any;

  private _abrirSubscription: any;


  public Recaudo = {
    Codigo: '',
    id: '',
    remitente: '',
    created_at: '',
    Recibido: ''
  };

  public DestinatariosRecaudo: any;
  public infoCompany: any = [];


  constructor(private client: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this._abrirSubscription = this.AbrirModal.subscribe((data) => {
      this.Recaudo = data;
      this.GetDestinatariosRecaudo();
      this.GetInfoCompany();
      this.ModalVerRecibo.show();
    });
  }

  ngOnDestroy() {
    if (this._abrirSubscription != null) {
      this._abrirSubscription.unsubscribe();
    }
  }

  private GetDestinatariosRecaudo() {

    this.client.post(this.globales.rutaNueva + 'getrecaudo-destinatarios', { id: this.Recaudo.id }).subscribe((data) => {
      this.DestinatariosRecaudo = data['destinatarios']
    });

    // getDestinatariosTransferencia(idTransferencia: string): Observable<any> {
    // let p = { id_transferencia: idTransferencia };
    // return this.client.get(this._rutaBase + 'get_destinatarios_transferencia.php', { params: p });
    // }

    // this._Service.getDestinatariosRecaudo(this.Recaudo.Id_Recaudo).subscribe(data => {
    //   if (data.codigo == 'success') {
    //     this.DestinatariosRecaudo = data.query_data;
    //   } else {
    //     this.DestinatariosRecaudo = [];
    //   }
    // });
  }

  private GetInfoCompany() {
    // this._RecaudoService.GetInfoCompany().subscribe(data => {
    //   if (data.codigo == 'success') {
    //     this.infoCompany = data.query_data[0];
    //   } else {
    //     this.infoCompany = [];
    //   }
    // });
  }

  CerrarModal() {
    this.LimpiarModelo();
    this.ModalVerRecibo.hide();
  }

  LimpiarModelo() {

  }
}
