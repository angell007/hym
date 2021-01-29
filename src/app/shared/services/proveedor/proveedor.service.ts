import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

@Injectable()
export class ProveedorService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getProveedores(){
    return this.client.get(this.globales.ruta+'php/terceros/get_terceros.php');
  }

  getP(){
    return this.client.get(this.globales.ruta+'php/terceros/get_terceros.php');
  }

  getP2(){
    return this.client.get(this.globales.ruta+'php/terceros/get_terceros_custom.php');
  }

}
