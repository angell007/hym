import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { BancoService } from '../../../shared/services/bancos/banco.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { Globales } from '../../../shared/globales/globales';

@Component({
  selector: 'app-tablabancos',
  templateUrl: './tablabancos.component.html',
  styleUrls: ['./tablabancos.component.scss', '../../../../style.scss']
})
export class TablabancosComponent implements OnInit {

  public Bancos: Array<any> = [];
  public Paises: any = [];
  public Monedas: any = [];
  public Cargando: boolean = false;
  public RutaImagenes: string;

  public AbrirModalCrear: Subject<any> = new Subject<any>();

  public Filtros: any = {
    nombre: '',
    apodo: '',
    identificador: '',
    pais: '',
    estado: ''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  constructor(private generalService: GeneralService,
    private swalService: SwalService,
    private bancoService: BancoService,
    public globales: Globales) {
    this.RutaImagenes = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    setTimeout(() => {
      this.AsignarPaises();
    }, 800);

  }

  ngOnInit() {
  }

  async AsignarPaises() {
    this.Paises = await this.globales.Paises;
  }

  AbrirModal(idBanco: string) {
    this.AbrirModalCrear.next(idBanco);
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;
    //params.id_moneda = this.MonedaConsulta;
    //params.id_funcionario = this.generalService.Funcionario.Id_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.nombre.trim() != "") {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.apodo.trim() != "") {
      params.apodo = this.Filtros.apodo;
    }

    if (this.Filtros.identificador.trim() != "") {
      params.identificador = this.Filtros.identificador;
    }

    if (this.Filtros.pais.trim() != "") {
      params.pais = this.Filtros.pais;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this.bancoService.getListaBancos(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Bancos = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.Bancos = [];
        this.swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues() {
    this.Filtros = {
      nombre: '',
      apodo: '',
      identificador: '',
      pais: '',
      estado: ''
    };
  }

  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }



  CambiarEstadoBanco(idBanco: string) {
    let datos = new FormData();
    datos.append("id_banco", idBanco);
    this.bancoService.cambiarEstadoBanco(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ConsultaFiltrada();
      }

      this.swalService.ShowMessage(data);
    });
  }

}
