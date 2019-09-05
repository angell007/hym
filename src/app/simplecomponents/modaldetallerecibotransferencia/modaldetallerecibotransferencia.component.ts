import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferenciaService } from '../../shared/services/transferencia/transferencia.service';
import { ReciboTransferenciaDetalleModel } from '../../Modelos/VerModels/ReciboTransferenciaDetalleModel';

@Component({
  selector: 'app-modaldetallerecibotransferencia',
  templateUrl: './modaldetallerecibotransferencia.component.html',
  styleUrls: ['./modaldetallerecibotransferencia.component.scss', '../../../style.scss']
})
export class ModaldetallerecibotransferenciaComponent implements OnInit, OnDestroy {

  @Input() AbrirModal:Observable<any> = new Observable();

  @ViewChild('ModalVerRecibo') ModalVerRecibo:any;

  private _abrirSubscription:any;

  public Transferencia:ReciboTransferenciaDetalleModel = new ReciboTransferenciaDetalleModel();
  public DestinatariosTransferencia:Array<any> = [];

  constructor(private _transferenciaService:TransferenciaService) { }

  ngOnInit() {
    this._abrirSubscription = this.AbrirModal.subscribe(data => {
      console.log(data);
      
      this.Transferencia = data;
      this.GetDestinatariosTransferencia();
      this.ModalVerRecibo.show();
      console.log(data);
      console.log(this.Transferencia);
      
    });
  }

  ngOnDestroy(){
    if (this._abrirSubscription != null) {
      this._abrirSubscription.unsubscribe();
    }
  }

  private GetDestinatariosTransferencia(){
    this._transferenciaService.getDestinatariosTransferencia(this.Transferencia.Id_Transferencia).subscribe(data => {
      if (data.codigo == 'success') {
        this.DestinatariosTransferencia = data.query_data;
      }else{
        this.DestinatariosTransferencia = [];
      }
    });
  }

  CerrarModal(){
    this.LimpiarModelo();
    this.ModalVerRecibo.hide();
  }

  LimpiarModelo(){
    this.Transferencia = new ReciboTransferenciaDetalleModel();
  }

}
