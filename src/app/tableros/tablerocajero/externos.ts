import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { GeneralService } from '../../shared/services/general/general.service';
import { Globales } from '../../shared/globales/globales';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PermisoService } from "../../shared/services/permisos/permiso.service";
import { AccionTableroCajero } from '../../shared/Enums/AccionTableroCajero';

export class Externos {
    public ServicioComision = [];
    ValorComisionServicio: any;
    private generalService: GeneralService;
    public SessionDataModel: any;
    public funcionario_data: any;
    public IdCaja: any;
    public IdOficina: any;
    public globales: Globales;
    public Total_Servicio: number = 0;
    public searchComisionServicio: Subject<string> = new Subject<string>();
    public searchComisionService$ = this.searchComisionServicio.asObservable();
    public Servicios: any[];
    private permisoService: PermisoService;
    public ListaServiciosExternos: any = [];
    public Servicio2 = false;
    public Servicio1 = true;
    public corresponsalView: Subject<any> = new Subject<any>();



    public ServicioExternoModel: any = {
        Id_Servicio: '',
        Servicio_Externo: '',
        Comision: '',
        Valor: '',
        Detalle: '',
        Id_Moneda: '2',
        Estado: 'Activo',
        Identificacion_Funcionario: "",
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
    };

    private http: HttpClient


    constructor(SessionDataModel: any) {
        this.SessionDataModel = SessionDataModel;
        this.funcionario_data = this.SessionDataModel.funcionarioData;
        this.IdCaja = this.SessionDataModel.idCaja;
        this.IdOficina = this.SessionDataModel.idOficina;
        this.ServicioExternoModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario

    }

    @ViewChild('alertSwal') alertSwal: any;
    @ViewChild('ModalServicioEditar') ModalServicioEditar: any;


    ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
        this.alertSwal.type = tipo;
        this.alertSwal.title = titulo;
        this.alertSwal.text = msg;
        this.alertSwal.show();
    }


    calcularComisionServicioExterno(value) {
        this.ServicioComision.forEach(element => {
            if ((parseFloat(element.Valor_Minimo) <= parseFloat(value)) && (parseFloat(value) < parseFloat(element.Valor_Maximo))) {
                this.ValorComisionServicio = element.Comision;
            }
        });
    }

    GuardarServicio(formulario: NgForm, modal, tipo: string = 'creacion') {

        let info = this.generalService.normalize(JSON.stringify(this.ServicioExternoModel));
        let datos = new FormData();
        datos.append("modulo", 'Servicio');
        datos.append('id_oficina', this.IdOficina);
        datos.append("datos", info);
        this.http.post(this.globales.ruta + 'php/serviciosexternos/guardar_servicio.php', datos).subscribe((data: any) => {
            this.LimpiarModeloServicios(tipo);
            this.ShowSwal('success', 'Registro Existoso', tipo == "creacion" ? 'Se ha registrado exitosamente el servicio!' : 'Se ha editado exitosamente el servicio!');
            modal.hide();
            this.volverServicio();
            this.CargarServiciosDiarios();
        });
    }

    AnulaServicio(id, estado) {
        let datos = new FormData();
        datos.append("modulo", 'Servicio');
        datos.append("id", id);
        datos.append("estado", estado);
        this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
            //this.actualizarVista();
        });
    }

    esconderAnular(valor) {
        switch (valor) {
            case "Activo": {
                return true;
            }
            case "Inactivo": {
                return false;
            }
        }
    }

    editarServicio(id) {
        this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { id: id, modulo: "Servicio" } }).subscribe((data: any) => {
            this.ServicioExternoModel = data;
            this.Total_Servicio = parseInt(this.ServicioExternoModel.Valor) + parseInt(this.ServicioExternoModel.Comision);
            this.ModalServicioEditar.show();
        });
    }

    public CerrarModalServicioEditar() {
        this.ModalServicioEditar.hide();
        this.LimpiarModeloServicios('edicion');
    }

    AsignarComisionServicioExterno() {

        let valorAsignado = this.ServicioExternoModel.Valor;
        console.log(this.ServicioExternoModel);


        if (valorAsignado == '' || valorAsignado == undefined || valorAsignado == '0') {
            this.ShowSwal('warning', 'Alerta', 'El valor no puede estar vacio ni ser 0!');
            this.ServicioExternoModel.Valor = '';
            this.ServicioExternoModel.Comision = '';
            return;
        }

        this.http.get(this.globales.ruta + 'php/serviciosexternos/comision_servicios.php', {
            params: { valor: valorAsignado }
        }).subscribe((data: any) => {
            this.ServicioExternoModel.Comision = data;
        });
    }

    AsignarComisionServicioExterno2() {

        let valorAsignado = this.ServicioExternoModel.Valor;
        console.log(valorAsignado);

        if (valorAsignado == '' || valorAsignado == undefined || valorAsignado == '0') {
            this.ShowSwal('warning', 'Alerta', 'El valor no puede estar vacio ni ser 0!');
            this.ServicioExternoModel.Valor = '';
            this.ServicioExternoModel.Comision = '';
            this.Total_Servicio = 0;
            return;
        } else {
            this.searchComisionServicio.next(valorAsignado);
        }
    }

    LimpiarModeloServicios(tipo: string) {

        this.ServicioExternoModel = {
            Id_Servicio: '',
            Servicio_Externo: '',
            Comision: '',
            Valor: '',
            Detalle: '',
            Estado: 'Activo',
            Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
            Id_Caja: this.generalService.SessionDataModel.idCaja
        };

        this.Total_Servicio = 0;
    }

    CargarServiciosDiarios() {
        this.Servicios = [];
        this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios.php', { params: { id_funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.Servicios = data.query_data;
        });
    }

    public AprobarCambioComision() {
        let comision = this.ServicioExternoModel.Comision;
        if (comision != '') {
            let p = { accion: "servicio_externo", value: comision };
            this.permisoService._openSubject.next(p);
        } else {
            this.ShowSwal('warning', 'Alerta', 'La comisión no puede ser 0 ni estar vacia!');
        }
    }

    CargarDatosServicios() {
        this.CargarServiciosDiarios();
        this.ListaServiciosExternos = [];
        this.ListaServiciosExternos = this.globales.ServiciosExternos;
    }
    volverServicio() {
        this.Servicio1 = true;
        this.Servicio2 = false;
        this.corresponsalView.next(AccionTableroCajero.Cerrar);
        this.LimpiarModeloServicios('creacion');
    }
}