import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { GeneralService } from '../../shared/services/general/general.service';
import { Globales } from '../../shared/globales/globales';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { CajeroService } from "../../shared/services/cajeros/cajero.service";
import { MonedaService } from "../../shared/services/monedas/moneda.service";


export class Traslados {
    public ServicioComision = [];
    public SessionDataModel: any;
    ValorComisionServicio: any;
    private generalService: GeneralService;
    public funcionario_data: any = "";
    public IdCaja: any = "";
    public IdOficina: any = "";
    public globales: Globales;
    public Total_Servicio: number = 0;
    public searchComisionServicio: Subject<string> = new Subject<string>();
    public searchComisionService$ = this.searchComisionServicio.asObservable();
    public Servicios: any[];
    public ListaServiciosExternos: any = [];
    public Servicio2 = false;
    public Servicio1 = true;
    public corresponsalView: Subject<any> = new Subject<any>();
    public MonedaSeleccionadaTraslado: string = '';

    public CajerosTraslados: any = [];
    public MonedasTraslados: any = [];
    public TrasladosEnviados: any = [];
    public TrasladoRecibidos: any = [];

    public Traslado1 = true;
    public Traslado2 = false;
    private cajeroService: CajeroService;
    private _monedaService: MonedaService;
    private http: HttpClient

    TrasladosRecibidos = [];

    Traslados = [];
    idTraslado: any;
    Traslado: any = {};

    public TrasladoModel: any = {
        Id_Traslado_Caja: '',
        Funcionario_Destino: '',
        Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
        Id_Caja: this.IdCaja,
        Valor: '',
        Detalle: '',
        Id_Moneda: '',
        Estado: 'Activo',
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
        Aprobado: 'No'
    };


    constructor(SessionDataModel: any) {
        this.SessionDataModel = SessionDataModel;
        this.funcionario_data = this.SessionDataModel.funcionarioData;
        this.IdCaja = this.SessionDataModel.idCaja;
        this.IdOficina = this.SessionDataModel.idOficina;
        this.TrasladoModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario

    }

    @ViewChild('alertSwal') alertSwal: any;
    @ViewChild('ModalTrasladoEditar') ModalTrasladoEditar: any;


    ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
        this.alertSwal.type = tipo;
        this.alertSwal.title = titulo;
        this.alertSwal.text = msg;
        this.alertSwal.show();
    }


    SetMonedaTraslados(idMoneda) {

        if (idMoneda == '') {
            this.MonedaSeleccionadaTraslado = idMoneda;
            this.TrasladoModel.Valor = '';
            return;
        }

        let monedaObj = this.MonedasTraslados.find(x => x.Id_Moneda == idMoneda);
        if (!this.globales.IsObjEmpty(monedaObj)) {
            this.MonedaSeleccionadaTraslado = monedaObj.Nombre;
        }
    }

    RealizarTraslado(formulario: NgForm, modal) {

        this.TrasladoModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario;
        this.TrasladoModel.Id_Caja = this.generalService.SessionDataModel.idCaja;
        let info = this.generalService.normalize(JSON.stringify(this.TrasladoModel));
        let datos = new FormData();
        datos.append("modulo", 'Traslado_Caja');
        datos.append("datos", info);
        datos.append('id_oficina', this.IdOficina);
        this.http.post(this.globales.ruta + 'php/trasladocaja/guardar_traslado_caja.php', datos).subscribe((data: any) => {
            if (data.codigo == 'success') {

                this.LimpiarModeloTraslados('creacion');
                this.volverTraslado();
                modal.hide();
                this.CargarTrasladosDiarios();
                this.ShowSwal('success', 'Registro exitoso', data);
            } else {
                this.ShowSwal('alert', 'Registro exitoso', data);
            }


        });
    }

    AnularTraslado(id, estado) {
        let datos = new FormData();
        datos.append("modulo", 'Traslado_Caja');
        datos.append("id", id);
        datos.append("estado", estado);
        this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
        });
    }

    esconder(estado, valor) {
        switch (estado) {
            case "Inactivo": {
                return false;
            }
            default: {
                return this.revisionDecision(valor);
            }
        }
    }

    editarTraslado(id) {
        this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Traslado_Caja', id: id } }).subscribe((data: any) => {
            this.idTraslado = id;
            this.Traslado = data;
            this.TrasladoModel = data;

            this.GetCajerosTraslados();
            this._getMonedasTraslado();
            this.ModalTrasladoEditar.show();
        });
    }

    CerrarModalTrasladoEditar() {
        this.ModalTrasladoEditar.hide();
        this.LimpiarModeloTraslados('creacion');
    }

    decisionTraslado(id, valor) {
        let datos = new FormData();
        datos.append("modulo", 'Traslado_Caja');
        datos.append("id", id);
        datos.append("estado", valor);

        this.http.post(this.globales.ruta + 'php/pos/decision_traslado.php', datos).subscribe((data: any) => {
            if (data.codigo == 'success') {
                this.CargarDatosTraslados();
            }
            this.ShowSwal('success', 'Registro exitoso', data);
        });
    }

    revisionDecision(valor) {
        switch (valor) {
            case "Si": {
                return false;
            }
            case "No": {
                return false;
            }
            default: {
                return true;
            }
        }
    }

    revisionDecisionLabel(valor) {
        switch (valor) {
            case "Si": {
                return true;
            }
            case "No": {
                return false;
            }
        }
    }

    LimpiarModeloTraslados(tipo: string) {

        if (tipo == 'creacion') {
            this.TrasladoModel = {
                Id_Traslado_Caja: '',
                Funcionario_Destino: '',
                Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
                Valor: '',
                Detalle: '',
                Id_Moneda: '',
                Estado: 'Pendiente',
                Identificacion_Funcionario: '',
                Aprobado: 'No'
            };

            this.CajerosTraslados = [];
            this.MonedasTraslados = [];
            this.MonedaSeleccionadaTraslado = '';
        }

        if (tipo == 'edicion') {
            this.TrasladoModel = {
                Id_Traslado_Caja: '',
                Funcionario_Destino: '',
                Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
                Valor: '',
                Detalle: '',
                Id_Moneda: '',
                Estado: 'Activo',
                Identificacion_Funcionario: '',
                Aprobado: 'No'
            };
        }
    }

    CargarTrasladosDiarios() {
        this.Traslados = [];
        this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.Traslados = data;
        });
    }

    GetCajerosTraslados() {
        this.cajeroService.getCajerosTraslados(this.funcionario_data.Identificacion_Funcionario).subscribe((data: any) => {
            if (data.codigo == 'success') {
                this.CajerosTraslados = [];
                this.CajerosTraslados = data.query_data;
            } else {
                this.ShowSwal('alert', 'Mensaje', 'No hay más cajeros abiertos en este momento!');
                // let toastObj = { textos: [data.titulo, "No hay más cajeros abiertos en este momento!"], tipo: data.codigo, duracion: 4000 };
                // this._toastService.ShowToast(toastObj);
                this.CajerosTraslados = [];
            }
        });
    }

    CargarDatosTraslados() {

        this.CargarTrasladosDiarios();

        this.TrasladosRecibidos = [];
        this.http.get(this.globales.ruta + 'php/pos/traslado_recibido.php', { params: { id: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.TrasladosRecibidos = data;

        });

        this.GetCajerosTraslados();
        this._getMonedasTraslado();
    }

    volverTraslado() {
        this.Traslado1 = true;
        this.Traslado2 = false;
        this.LimpiarModeloTraslados('creacion');
    }

    private _getMonedasTraslado() {
        this.MonedasTraslados = [];
        this._monedaService.getMonedas().subscribe((data: any) => {
            if (data.codigo == 'success') {
                this.MonedasTraslados = data.query_data;
            } else {
                this.MonedasTraslados = [];
                this.ShowSwal('alert', data.titulo, data.mensaje);
                // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
                // this._toastService.ShowToast(toastObj);
            }
        });
    }

}

