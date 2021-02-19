import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';
import { TransferenciaService } from '../../shared/services/transferencia/transferencia.service';
import { GeneralService } from '../../shared/services/general/general.service';

@Component({
  selector: 'app-modalpagostransferenciaver',
  templateUrl: './modalpagostransferenciaver.component.html',
  styleUrls: ['./modalpagostransferenciaver.component.scss', '../../../style.scss']
})
export class ModalpagostransferenciaverComponent implements OnInit, OnDestroy {

  @Input() AbrirModal:Observable<any> = new Observable();
  private openSubscription:ISubscription;

  public AbrirModalDevolver:Subject<any> = new Subject();

  @ViewChild('ModalPagosTransferencia') ModalPagosTransferencia:any;

  public TransferenciaModel:any = {};
  public TransferenciasRealizadas:Array<any> = [];
  public Id_Apertura:string = '';

  constructor(private _transferenciaService:TransferenciaService,
              private _generalService:GeneralService) 
  { }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      // console.log(data);
      this.TransferenciaModel = data.model;
      this.Id_Apertura = data.id_apertura;
      this.ModalPagosTransferencia.show();

      setTimeout(() => {
        this.GetPagosTransferencia();
      }, 300);
    });
  }

  ngOnDestroy(): void {
    if (this.openSubscription != null) {
      this.openSubscription.unsubscribe();
    }
  }

  public CerrarModal(){
    this.ModalPagosTransferencia.hide();
  }

  public GetPagosTransferencia(){
    let p = {id_transferencia:this.TransferenciaModel.Id_Transferencia_Destinatario, id_funcionario:this._generalService.Funcionario.Identificacion_Funcionario};
    this._transferenciaService.GetPagosTransferencias(p).subscribe((transferencias:any) => {
      // console.log(transferencias);
      if (transferencias.codigo == 'success') {
        this.TransferenciasRealizadas = transferencias.query_data;
      }else{
        this.TransferenciasRealizadas = [];
      }
    });
  }



}
