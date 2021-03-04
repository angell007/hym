import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { DestinatarioService } from '../../../shared/services/destinatarios/destinatario.service';

@Component({
  selector: 'app-tabladestinatarios',
  templateUrl: './tabladestinatarios.component.html',
  styleUrls: ['./tabladestinatarios.component.scss', '../../../../style.scss']
})
export class TabladestinatariosComponent implements OnInit {

  public Destinatarios: Array<any> = [];
  public Paises: any = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;
  public TipoDestinatario = 'Transferencia';
  public AbrirModalCrear: Subject<any> = new Subject<any>();
  public AbrirModalPagos: Subject<any> = new Subject<any>();

  public Filtros: any = {
    identificacion: '',
    nombre: '',
    pais: '',
    estado: '',
    tipo: ''
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
    private destinatarioService: DestinatarioService) {
    this.RutaGifCargando = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetPaises();
  }

  ngOnInit() {
  }

  GetPaises() {
    setTimeout(() => {
      this.generalService.getPaises().then(data => {

        this.Paises = data
      });


    }, 1000);
  }

  AbrirModal(Destinatario: any, accion: string) {

    if (Destinatario.Tipo == 'Pagos') {

      this.AbrirModalPagos.next(Destinatario.Id);
    } else {

      let objModal = { id_destinatario: Destinatario.Id, accion: accion };
      this.AbrirModalCrear.next(objModal);
    }

  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.identificacion.trim() != "") {
      params.identificacion = this.Filtros.identificacion;
    }

    if (this.Filtros.nombre.trim() != "") {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.pais.trim() != "") {
      params.pais = this.Filtros.pais;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }
    if (this.Filtros.tipo.trim() != "") {
      params.tipo = this.Filtros.tipo;
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
    this.destinatarioService.getListaDestinatariosCustom(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Destinatarios = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.Destinatarios = [];
        this.swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });



  }

  ResetValues() {
    this.Filtros = {
      identificacion: '',
      nombre: '',
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

  CambiarEstadoDestinatario(destinatario) {
    let datos = new FormData();
    datos.append("id_destinatario", destinatario.Id);
    datos.append("tipo", destinatario.Tipo);
    this.destinatarioService.cambiarEstadoDestinatarioCustom(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ConsultaFiltrada();
      }

      this.swalService.ShowMessage(data);
    });
  }




}
