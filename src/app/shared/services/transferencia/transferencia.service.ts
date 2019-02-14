import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TransferenciaService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getAllTransferencias():Observable<any>{
    return this.client.get(this.globales.ruta+'php/transferencias/lista_transferencias_general.php');
  } 

  getDetalleTransferencia(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this.globales.ruta+'php/transferencias/detalle_transferencia.php', {params:p});
  }

}
