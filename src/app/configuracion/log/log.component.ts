import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../../shared/services/general/general.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  Cargando = false;
  Logs:any = [];
  maxSize = 10;
  pageSize = 10;
  page = 1;
  TotalItems = 0;
  InformacionPaginacion:any={
    desde:'',
    hasta:'',
    total:''

  }
  constructor(public http:HttpClient , public generales:GeneralService) { }

  ngOnInit() {
    this.ConsultaFiltrada();
  }
  
  public ConsultaFiltrada(){
    this.Cargando = true;
      this.http.get(this.generales.RutaPrincipal+`/php/logs_modulo/get_logs.php?pag=${this.page}&tam=${this.pageSize}`).
      subscribe((res:any)=>{
        this.Logs = res.query_data;
        this.TotalItems = res.numReg
        this.SetInformacionPaginacion();
        this.Cargando = false;
      })
  }
  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.maxSize);
    var desde = calculoHasta - this.maxSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
}
