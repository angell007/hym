import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

@Injectable()
export class CompraService {

  constructor(private client:HttpClient, private globales:Globales) { }

  guardarCompra(compraData:FormData){
    return this.client.post(this.globales.ruta+'php/compras/guardar_compra_nuevo.php', compraData);
  }

  getCompra(idCompra:string){
    let p = {id_compra:idCompra};
    return this.client.get(this.globales.ruta+'php/compras/get_compra.php', {params:p});
  }

  getListaCompra(p:any){
    return this.client.get(this.globales.ruta+'php/compras/get_lista_compras.php', {params:p});
  }

  getComprasPendientes(idMoneda:string){
    let p = {id_moneda:idMoneda}
    return this.client.get(this.globales.ruta+'php/compras/compras_pendientes.php', {params:p});
  }

  getComprasRealizadas(idMoneda:string, idCompra:string){
    let p = {id_moneda:idMoneda, id_compra:idCompra}
    return this.client.get(this.globales.ruta+'php/compras/lista_compras_realizadas.php', {params:p});
  }

  anularCompra(data:FormData){
    return this.client.post(this.globales.ruta+'php/compras/anular_compra_realizada.php', data);
  }

}
