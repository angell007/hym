import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentoService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getTiposDocumentos():Observable<any>{
    return this.client.get(this.globales.ruta+'php/documentos/get_lista_documentos_nacionales.php');
  }

}
