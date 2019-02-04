import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

@Component({
  selector: 'app-tablatransferencias',
  templateUrl: './tablatransferencias.component.html',
  styleUrls: ['./tablatransferencias.component.scss']
})
export class TablatransferenciasComponent implements OnInit {

  @Input() MonedaConsulta:string = '1';

  public TransferenciasListar:any = [];

  constructor(private http:HttpClient, public globales:Globales) { }

  ngOnInit() {
    this.ConsultarTransferencias();
    
    /*if (this.Transferencias.length > 0) {
      this.TransferenciasListar = this.Transferencias;
    }*/
  }

  ConsultarTransferencias(){

    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', {params: {id_moneda:this.MonedaConsulta}}).subscribe((data: any) => {

      this.TransferenciasListar = data.todas;
    });
  }
}
