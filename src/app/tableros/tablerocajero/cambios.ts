import { HttpClient } from "@angular/common/http";
import { Globales } from '../../shared/globales/globales';
import { ViewChild, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MonedaService } from "../../shared/services/monedas/moneda.service";
import { tap } from 'rxjs/operators';

export class Cambios {
    public ServicioComision = [];
    ValorComisionServicio: any;
    public globales;
    public Total_Servicio: number = 0;
    public searchComisionServicio: Subject<string> = new Subject<string>();
    public searchComisionService$ = this.searchComisionServicio.asObservable();
    public Servicios: any[];
    public ListaServiciosExternos: any = [];
    public Servicio2 = false;
    public Servicio1 = true;
    public corresponsalView: Subject<any> = new Subject<any>();
    public Cargando: boolean = true;
    public MonedasCambio: any = [];
    private _monedaService: MonedaService;
    public SessionDataModel: any;
    public funcionario_data: any;
    public IdCaja: any;
    public IdOficina: any;


    //Paginación
    public maxSize = 5;
    public pageSize = 10;
    public TotalItems: number;
    public page = 1;
    public Cambios: any = [];
    public InformacionPaginacion: any = {
        desde: 0,
        hasta: 0,
        total: 0
    }

    public Filtros: any = {
        codigo: '',
        funcionario: '',
        tipo: ''
    };

    public CambioModel: any = {
        Id_Cambio: '',
        Tipo: '',
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
        Id_Oficina: this.IdOficina == '' ? '0' : this.IdOficina,
        Moneda_Origen: '',
        Moneda_Destino: '',
        Tasa: '',
        Valor_Origen: '',
        Valor_Destino: '',
        TotalPago: '',
        Vueltos: '0',
        Recibido: '',
        Identificacion_Funcionario: ""
    };

    Cambios2 = false;
    Cambios1 = true;
    ruta: string;

    @ViewChild('alertSwal') alertSwal: any;

    ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
        this.alertSwal.type = tipo;
        this.alertSwal.title = titulo;
        this.alertSwal.text = msg;
        this.alertSwal.show();
    }

    constructor(SessionDataModel: any, private http: HttpClient) {

        this.SessionDataModel = SessionDataModel;
        this.funcionario_data = this.SessionDataModel.funcionarioData;
        this.IdCaja = this.SessionDataModel.idCaja;
        this.IdOficina = this.SessionDataModel.idOficina;
        this.CambioModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario
    }

    CargarCambiosDiarios() {

        this.Cambios = [];


        this.http.get('https://grupo-hym.com/customback/php/cambio/lista_cambios_nuevo.php', { params: { funcionario: this.funcionario_data.Identificacion_Funcionario } }).pipe(tap(x => { console.log('Obteniendo inicio', x); }))
            .subscribe((data: any) => {
                if (data.codigo == 'success') {
                    this.Cambios = data.query_data;
                    // this.TotalItems = data.numReg; 
                    this.SetInformacionPaginacion();
                    this.TotalItems = data.numReg;
                }
                this.Cargando = false;
            });
    }


    CargarDatosCambios() {
        this.CargarCambiosDiarios();
        this.MonedasCambio = [];
        this._monedaService.getMonedasExtranjeras().subscribe((data: any) => {
            if (data.codigo == 'success') {
                this.MonedasCambio = data.query_data;
            } else {
                this.MonedasCambio = [];
                this.ShowSwal('success', 'Pago Exitoso', 'Se ha realizado el pago del giro correctamente');
            }
        });
    }

    public filtroCustom: string;

    SetFiltros(paginacion: boolean) {
        let params: any = {};

        params.tam = this.pageSize;
        params.funcionario = this.funcionario_data.Identificacion_Funcionario


        if (paginacion === true) {
            params.pag = this.page;
        } else {
            this.page = 1; // Volver a la página 1 al filtrar
            params.pag = this.page;
        }

        if (this.Filtros.codigo.trim() != "") {
            // console.log(this.Filtros.codigo);
            params.codigo = this.Filtros.codigo;
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

        this.http.get(this.globales.ruta + 'php/cambio/get_filtre_cambios.php?', { params: p }).pipe(
            tap(x => { console.log(x); })
        ).subscribe((data: any) => {
            if (data.codigo == 'success') {
                this.Cambios = data.query_data
                this.Cargando = false;
                this.SetInformacionPaginacion();
            }
            this.TotalItems = data.numReg;
        });
    }

    SetInformacionPaginacion() {
        var calculoHasta = (this.page * this.pageSize);
        var desde = calculoHasta - this.pageSize + 1;
        var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

        this.InformacionPaginacion['desde'] = desde;
        this.InformacionPaginacion['hasta'] = hasta;
        this.InformacionPaginacion['total'] = this.TotalItems;
    }


    ResetValues() {
        this.Filtros = {
            codigo: '',
            funcionario: '',
            tipo: '',
        };
    }
}