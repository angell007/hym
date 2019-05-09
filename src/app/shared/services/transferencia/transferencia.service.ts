import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TransferenciaService {

  private _rutaBase:string = this.globales.ruta+'php/transferencias/';

  constructor(private client:HttpClient, private globales:Globales) { }

  getAllTransferencias():Observable<any>{
    return this.client.get(this._rutaBase+'lista_transferencias_general.php');
  } 

  getDetalleTransferencia(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'detalle_transferencia.php', {params:p});
  }

  getDestinatariosTransferencia(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'get_destinatarios_transferencia.php', {params:p});
  }

  getRecibosTransferenciasFuncionario(idFuncionario:string):Observable<any>{
    let p = {id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'get_recibos_transferencias_funcionario.php', {params:p});
  }

  getRecibosTransferenciasFuncionario2(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_recibos_transferencias_funcionario.php', {params:p});
  }

  verificarEstadoReciboTransferencia(idTransferencia:string){
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'verificar_estado_recibo_transferencia.php', {params:p});
  }

  anularReciboTransferencias(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'anular_transferencia_nuevo.php', data);
  }

}
