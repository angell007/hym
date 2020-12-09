import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { GeneralService } from '../../shared/services/general/general.service';
import { Globales } from '../../shared/globales/globales';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PermisoService } from "../../shared/services/permisos/permiso.service";
import { Observable } from 'rxjs/Observable';

export class Giros {
    public ServicioComision = [];
    ValorComisionServicio: any;
    private generalService: GeneralService;
    public funcionario_data: any ;
    public IdCaja: any ;
    public IdOficina: any ;
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
    GirosAprobados = [];
    public openModalGiro: Subject<any> = new Subject<any>();
    public permisoSubscription: any;
    public Remitentes: any = [];
    public CargandoGiros: boolean = false;
    public SessionDataModel: any;

    Giro1 = true;
    Giro2 = false;

    

    //MODELO PARA GIROS
    public GiroModel: any = {

        //REMITENTE
        Departamento_Remitente: '',
        Municipio_Remitente: '',
        Documento_Remitente: '',
        Nombre_Remitente: '',
        Telefono_Remitente: '',

        //DESTINATARIO
        Departamento_Destinatario: '',
        Municipio_Destinatario: '',
        Documento_Destinatario: '',
        Nombre_Destinatario: '',
        Telefono_Destinatario: '',

        //DATOS GIRO
        Valor_Recibido: '',
        Comision: '',
        Valor_Total: '',
        Valor_Entrega: '',
        Detalle: '',
        Giro_Libre: false,
        Identificacion_Funcionario:"",
        Id_Oficina: this.IdOficina == '' ? '0' : this.IdOficina,
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
        Id_Moneda: '2'
    };

    //VARIABLES GIRO VIEJAS
    GirosBuscar = [];
    public Aparecer = false;
    public EditarRemitenteGiro: boolean = false;
    public EditarDestinatarioGiro: boolean = false;
    public CrearRemitenteGiro: boolean = false;
    public CrearDestinatarioGiro: boolean = false;

    DatosRemitenteEditarGiro: any = {};
    // DatosDestinatario: any = {};
    DatosDestinatarioEditarGiro: any = {};
    informacionGiro: any = {};
    ValorTotalGiro: any;
    // //FIN VARIABLES VIEJAS

    public Remitente_Giro: any = '';
    public Destinatario_Giro: any = '';
    public DepartamentosGiros: any = [];
    public Municipios_Remitente = [];
    public DeshabilitarComisionGiro: boolean = true;
    public CedulaBusquedaGiro: string = '';

    Giros = [];
    Departamentos = [];
    Municipios_Destinatario = [];
    GiroComision = [];
    ValorEnviar: any;
    Departamento_Remitente: any;
    Departamento_Destinatario: any;
    FuncionariosCaja = [];
    Funcionario: any;


    Giro: any = {};
    idGiro: any;
    Remitente: any = {};
    Destinatario: any = {};

    @ViewChild('ModalGiroEditar') ModalGiroEditar: any;
    @ViewChild('confirmacionGiro') confirmacionGiro: any;
    @ViewChild('confirmacionSwal') confirmacionSwal: any;

    public maxSize = 5;
    public pageSize = 10;
    public TotalItems: number;
    public page = 1;
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

    private http: HttpClient
    constructor(SessionDataModel: any) {
        this.SessionDataModel = SessionDataModel;
        this.funcionario_data = this.SessionDataModel.funcionarioData;
        this.IdCaja = this.SessionDataModel.idCaja;
        this.IdOficina = this.SessionDataModel.idOficina;
        this.GiroModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario

    }

    @ViewChild('alertSwal') alertSwal: any;
    ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
        this.alertSwal.type = tipo;
        this.alertSwal.title = titulo;
        this.alertSwal.text = msg;
        this.alertSwal.show();
    }

    handleError(error: Response) {
        return Observable.throw(error);
    }


    LimpiarModeloGiro(tipo: string) {

        if (tipo == 'creacion') {
            this.GiroModel = {

                //REMITENTE
                Departamento_Remitente: '',
                Municipio_Remitente: '',
                Documento_Remitente: '',
                Nombre_Remitente: '',
                Telefono_Remitente: '',

                //DESTINATARIO
                Departamento_Destinatario: '',
                Municipio_Destinatario: '',
                Documento_Destinatario: '',
                Nombre_Destinatario: '',
                Telefono_Destinatario: '',

                //DATOS GIRO
                Valor_Recibido: '',
                Comision: '',
                Valor_Total: '',
                Valor_Entrega: '',
                Detalle: '',
                Giro_Libre: false,
                Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
                Id_Oficina: 5,
                Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
            };

            this.Remitente_Giro = '';
            this.Destinatario_Giro = '';
            this.EditarRemitenteGiro = false;
            this.EditarDestinatarioGiro = false;
            this.CrearRemitenteGiro = false;
            this.CrearDestinatarioGiro = false;
        }

        if (tipo == 'edicion') {
            this.GiroModel = {

                //REMITENTE
                Departamento_Remitente: '',
                Municipio_Remitente: '',
                Documento_Remitente: '',
                Nombre_Remitente: '',
                Telefono_Remitente: '',

                //DESTINATARIO
                Departamento_Destinatario: '',
                Municipio_Destinatario: '',
                Documento_Destinatario: '',
                Nombre_Destinatario: '',
                Telefono_Destinatario: '',

                //DATOS GIRO
                Valor_Recibido: '',
                Comision: '',
                Valor_Total: '',
                Valor_Entrega: '',
                Detalle: '',
                Giro_Libre: false,
                Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
                Id_Oficina: 5,
                Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
            };

            this.Remitente_Giro = '';
            this.Destinatario_Giro = '';
            this.CrearRemitenteGiro = false;
            this.CrearDestinatarioGiro = false;
        }
    }

    PagarGiro(id, modal, value) {
        let datos = new FormData();
        datos.append("id", id);
        datos.append("caja", this.generalService.SessionDataModel.idCaja);
        datos.append("id_funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
        this.http.post(this.globales.ruta + 'php/giros/pagar_giro.php', datos)
            .catch(error => {
                console.error('An error occurred:', error.error);
                this.ShowSwal('warning', 'Alerta', 'Oops Ha ocurrido un error ');
                return this.handleError(error);
            })
            .subscribe((data: any) => {
                this.ShowSwal('success', 'Pago Exitoso', 'Se ha realizado el pago del giro correctamente');
                modal.hide();
                this.FiltrarGiroCedula(value);
                this.ActualizarTablasGiros();
            });
    }

    ConfirmacionGiro(valor) {
        this.confirmacionGiro.title = "¿ esta seguro ?";
        this.confirmacionGiro.text = "Confirme que el valor entregado sea de " + valor;
        this.confirmacionGiro.type = "warning"
        this.confirmacionGiro.show();
    }

    EditarGiro(id) {

        this.http.get(this.globales.ruta + '/php/pos/detalle_giro.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
            this.idGiro = id;
            this.Giro = data.giro;
            this.Remitente = data.remitente;
            this.Destinatario = data.destinatario;
            this.ModalGiroEditar.show();
            this.ValorEnviar = data.giro.ValorEnviar;
            this.valorComision(data.giro.Valor_Total);
            this.Municipios_Departamento(data.remitente.Id_Departamento, 'Remitente');
            this.Municipios_Departamento(data.destinatario.Id_Departamento, 'Destinatario');
            this.Departamento_Remitente = this.Departamentos[data.remitente.Id_Departamento].Nombre;
            this.Departamento_Destinatario = this.Departamentos[data.destinatario.Id_Departamento].Nombre;
            this.DatosRemitenteEditarGiro = data.remitente.DatosRemitenteEditarGiro;
            this.DatosDestinatarioEditarGiro = data.destinatario.DatosDestinatarioEditarGiro;
        });
    }

    resultado = [{
        Id_Transferencia_Remitente: "",
        Nombre: "",
        Telefono: ""
    }];

    AutoCompletarDatosPersonalesGiro(modelo, tipo_persona: string) {
        // console.log(modelo);

        if (typeof (modelo) == 'object') {

            let validacion = this.ValidarRemitenteDestinatario(modelo.Id_Transferencia_Remitente, tipo_persona);
            if (validacion) {
                return;
            };

            if (tipo_persona == 'remitente') {
                //this.EditarDestinatarioGiro = false;
                this.CrearDestinatarioGiro = false;
            } else {
                //this.EditarRemitenteGiro = false;
                this.CrearRemitenteGiro = false;
            }
            this.AsignarValoresPersonaGiro(modelo, tipo_persona);

        } else if (typeof (modelo) == 'string') {

            if (modelo == '') {
                if (tipo_persona == 'remitente') {
                    this.EditarRemitenteGiro = false;
                    this.CrearRemitenteGiro = false;
                } else {
                    this.EditarDestinatarioGiro = false;
                    this.CrearDestinatarioGiro = false;
                }
            } else {
                if (tipo_persona == 'remitente') {
                    this.EditarRemitenteGiro = false;
                    this.CrearRemitenteGiro = true;
                } else {
                    this.EditarDestinatarioGiro = false;
                    this.CrearDestinatarioGiro = true;
                }
            }

            this.VaciarValoresPersonaGiro(tipo_persona, true);
        }
    }

    ValidarRemitenteDestinatario(id_persona, tipo_persona: string) {

        if (tipo_persona == 'remitente') {
            let d = this.GiroModel.Documento_Destinatario;

            if (d == '' || d == undefined) {
                return false;
            }

            if (id_persona == d) {
                this.ShowSwal('warning', 'Alerta', 'El remitente y el destinatario no pueden ser la misma persona');
                this.EditarRemitenteGiro = false;
                this.CrearRemitenteGiro = false;
                this.VaciarValoresPersonaGiro(tipo_persona);
                return true;
            }
        } else if (tipo_persona == 'destinatario') {

            let r = this.GiroModel.Documento_Remitente;

            if (r == '' || r == undefined) {
                return false;
            }

            if (id_persona == r) {
                this.ShowSwal('warning', 'Alerta', 'El remitente y el destinatario no pueden ser la misma persona');
                this.EditarDestinatarioGiro = false;
                this.CrearDestinatarioGiro = false;
                this.VaciarValoresPersonaGiro(tipo_persona);
                return true;
            }
        }

        return false;
    }

    AsignarValoresPersonaGiro(modelo, tipo_persona) {

        if (tipo_persona == 'remitente') {
            this.GiroModel.Documento_Remitente = modelo.Id_Transferencia_Remitente;
            this.GiroModel.Nombre_Remitente = modelo.Nombre;
            this.GiroModel.Telefono_Remitente = modelo.Telefono;
            this.EditarRemitenteGiro = true;
            this.CrearRemitenteGiro = false;

        } else if (tipo_persona == 'destinatario') {

            this.GiroModel.Documento_Destinatario = modelo.Id_Transferencia_Remitente;
            this.GiroModel.Nombre_Destinatario = modelo.Nombre;
            this.GiroModel.Telefono_Destinatario = modelo.Telefono;
            this.EditarDestinatarioGiro = true;
            this.CrearDestinatarioGiro = false;
        }
    }

    VaciarValoresPersonaGiro(tipo_persona, conservarDestRem: boolean = false) {

        if (tipo_persona == 'remitente') {
            this.GiroModel.Documento_Remitente = '';
            this.GiroModel.Nombre_Remitente = '';
            this.GiroModel.Telefono_Remitente = '';
            if (!conservarDestRem)
                this.Remitente_Giro = '';

        } else if (tipo_persona == 'destinatario') {

            this.GiroModel.Documento_Destinatario = '';
            this.GiroModel.Nombre_Destinatario = '';
            this.GiroModel.Telefono_Destinatario = '';
            if (!conservarDestRem)
                this.Destinatario_Giro = '';
        }
    }

    valorComision(value) {

        let recibido = parseFloat(this.GiroModel.Valor_Recibido);

        if (typeof (value) == 'boolean') {
            if (recibido == 0 || recibido == undefined || isNaN(recibido)) {
                this.ShowSwal('warning', 'Alerta', 'Debe introducir el valor a enviar para hacer el cálculo!');
                return;
            }
        }

        if (typeof (value) == 'string') {
            if (value == '' || value == '0') {
                this.GiroModel.Comision = '';
                this.GiroModel.Valor_Recibido = '';
                this.GiroModel.Comision = '';
                this.GiroModel.Valor_Total = '';
                this.GiroModel.Valor_Entrega = '';
                return;
            }
        }

        let maxComision = this.GiroComision[(this.GiroComision.length - 1)].Comision;

        if (recibido > maxComision) {
            this.GiroModel.Comision = maxComision;

            var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);

            switch (checkeado) {
                case true: {
                    this.GiroModel.Valor_Total = recibido + parseFloat(maxComision);
                    this.GiroModel.Valor_Entrega = recibido;
                    break;
                }
                case false: {
                    this.GiroModel.Valor_Total = recibido;
                    this.GiroModel.Valor_Entrega = recibido - parseFloat(maxComision);
                    break;
                }
            }
        } else {

            this.GiroComision.forEach(element => {
                if ((parseFloat(element.Valor_Minimo) <= recibido) && (recibido <= parseFloat(element.Valor_Maximo))) {
                    this.GiroModel.Comision = element.Comision;

                    var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);

                    switch (checkeado) {
                        case true: {
                            this.GiroModel.Valor_Total = recibido + parseFloat(element.Comision);
                            this.GiroModel.Valor_Entrega = recibido;
                            break;
                        }
                        case false: {
                            this.GiroModel.Valor_Total = recibido;
                            this.GiroModel.Valor_Entrega = recibido - parseFloat(element.Comision);
                            break;
                        }
                    }
                }
            });
        }
    }

    RealizarGiro(formulario: NgForm) {

        if (!this.ValidateGiroBeforeSubmit()) {
            return;
        } else {
            this.GiroModel.Id_Oficina = this.IdOficina;
            let info = this.generalService.normalize(JSON.stringify(this.GiroModel));
            let datos = new FormData();
            datos.append("datos", info);
            this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
                this.LimpiarModeloGiro('creacion');
                this.Giro1 = true;
                this.Giro2 = false;
                this.confirmacionSwal.title = "Guardado con exito";
                this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
                this.confirmacionSwal.type = "success"
                this.confirmacionSwal.show();
                this.CargarGirosDiarios();
            });
        }
    }

    RealizarEdicionGiro(formulario: NgForm, modal) {
        let info = this.generalService.normalize(JSON.stringify(formulario.value));
        let datos = new FormData();
        datos.append("datos", info);
        this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
            modal.hide();
            this.confirmacionSwal.title = "Guardado con exito";
            this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
            this.confirmacionSwal.type = "success"
            this.confirmacionSwal.show();
        });
    }

    ValidateGiroBeforeSubmit() {
        if (this.GiroModel.Departamento_Remitente == '' || this.GiroModel.Departamento_Remitente == 0 || this.GiroModel.Departamento_Remitente == undefined) {
            this.ShowSwal('warning', 'Alerta', 'No se ha escogido el departamento del remitente!');
            return false;
        }

        if (this.GiroModel.Municipio_Remitente == '' || this.GiroModel.Municipio_Remitente == 0 || this.GiroModel.Municipio_Remitente == undefined) {
            this.ShowSwal('warning', 'Alerta', 'No se ha escogido el municipio del remitente!');
            return false;
        }

        if (this.GiroModel.Documento_Remitente == '' || this.GiroModel.Documento_Remitente == 0 || this.GiroModel.Documento_Remitente == undefined) {
            this.ShowSwal('warning', 'Alerta', 'No se ha escogido el nro. de documento del remitente!');
            return false;
        }

        if (this.GiroModel.Departamento_Destinatario == '' || this.GiroModel.Departamento_Destinatario == 0 || this.GiroModel.Departamento_Destinatario == undefined) {
            this.ShowSwal('warning', 'Alerta', 'No se ha escogido el departamento del destinatario!');
            return false;
        }

        if (this.GiroModel.Municipio_Destinatario == '' || this.GiroModel.Municipio_Destinatario == 0 || this.GiroModel.Municipio_Destinatario == undefined) {
            this.ShowSwal('warning', 'Alerta', 'No se ha escogido el municipio del destinatario!');
            return false;
        }

        if (this.GiroModel.Documento_Destinatario == '' || this.GiroModel.Documento_Destinatario == 0 || this.GiroModel.Documento_Destinatario == undefined) {
            this.ShowSwal('warning', 'Alerta', 'No se ha escogido el nro. de documento del destinatario!');
            return false;
        }

        if (this.GiroModel.Valor_Recibido == '' || this.GiroModel.Valor_Recibido == 0 || this.GiroModel.Valor_Recibido == undefined) {
            this.ShowSwal('warning', 'Alerta', 'Digite el valor a enviar en el giro!');
            return false;
        }

        return true;
    }


    CargarGirosDiarios() {
        this.Giros = [];
        this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario.php', { params: { modulo: 'Giro', funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.Giros = data;
        });
    }

    CargarGirosAprobados() {
        this.GirosAprobados = [];
        this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.GirosAprobados = data;
        });
    }

    AnularGiro(id) {
        let datos = new FormData();
        datos.append("modulo", 'Giro');
        datos.append("id", id);
        this.http.post(this.globales.ruta + 'php/giros/anular_giro.php', datos).subscribe((data: any) => {
            this.confirmacionSwal.title = "Anulado con Exito";
            this.confirmacionSwal.text = "Se ha anulado correctamente el giro";
            this.confirmacionSwal.type = "success";
            this.confirmacionSwal.show();

            this.FiltrarGiroCedula(this.CedulaBusquedaGiro);
            //this.actualizarVista();
        });
    }

    anulado(estado) {
        switch (estado) {
            case "Anulada": { return false }
            default: { return true }
        }
    }

    CargarDatos(data: any) {
        if (data.tipo == 'remitente') {

            this.Remitente_Giro = data.model;
            this.GiroModel.Documento_Remitente = data.model.Id_Transferencia_Remitente;
            this.GiroModel.Nombre_Remitente = data.model.Nombre;
            this.GiroModel.Telefono_Remitente = data.model.Telefono;

        } else {

            this.Destinatario_Giro = data.model;
            this.GiroModel.Documento_Destinatario = data.model.Id_Transferencia_Remitente;
            this.GiroModel.Nombre_Destinatario = data.model.Nombre;
            this.GiroModel.Telefono_Destinatario = data.model.Telefono;
        }
    }

    EditarPersonaGiro(idRemitente: string, tipoPersona: string, accion: string) {
        let data = {};

        if (tipoPersona == 'remitente') {
            if (typeof (this.Remitente_Giro) == 'string') {
                data = { id_remitente: idRemitente, tipo: tipoPersona, accion: 'crear desde giro' };
            } else if (typeof (this.Remitente_Giro) == 'object') {
                data = { id_remitente: idRemitente, tipo: tipoPersona, accion: accion };
            }
        } else if (tipoPersona == 'destinatario') {
            if (typeof (this.Destinatario_Giro) == 'string') {
                data = { id_remitente: idRemitente, tipo: tipoPersona, accion: 'crear desde giro' };
            } else if (typeof (this.Destinatario_Giro) == 'object') {
                data = { id_remitente: idRemitente, tipo: tipoPersona, accion: accion };
            }
        }



        this.openModalGiro.next(data);
    }

    HabilitarEdicionComisionGiro() {
        if (this.GiroModel.Valor_Recibido == '') {
            this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor recibido primero antes de editar la comisión');
            return;
        }

        if (this.DeshabilitarComisionGiro) {
            if (this.permisoSubscription == undefined) {
                this.permisoSubscription = this.permisoService.permisoJefe.subscribe(d => {
                    this.DeshabilitarComisionGiro = !d;

                    this.permisoSubscription.unsubscribe();
                    this.permisoSubscription = undefined;
                });
            }

            let p = { accion: "giro" };
            this.permisoService._openSubject.next(p);
        } else {
            this.DeshabilitarComisionGiro = true;
        }
    }

    //#endregion

    CargarDatosGiros() {

        this.CargarGirosDiarios();

        this.GirosAprobados = [];
        this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.GirosAprobados = data;
        });

        this.DepartamentosGiros = [];
        this.DepartamentosGiros = this.globales.Departamentos;

        this.Remitentes = [];
        this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia_Remitente' } }).subscribe((data: any) => {
            this.Remitentes = data;
        });

        this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Comision' } }).subscribe((data: any) => {
            this.GiroComision = data;
        });
    }
      
    FiltrarGiroCedula(value) {
        this.Aparecer = false;
        this.CargandoGiros = true;
        if (value == '') {
            this.GirosBuscar = [];
            this.Aparecer = true;
            this.CargandoGiros = false;
        } else {
            this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value, funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
                this.CargandoGiros = false;
                this.GirosBuscar = data;
                if (this.GirosBuscar.length > 0) {
                    this.Aparecer = true;
                }
            });
        }
    }

    public ActualizarTablasGiros() {
        this.CargarGirosDiarios();
        this.CargarGirosAprobados();
    }

    Municipios_Departamento(Departamento, tipo) {
        this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
            switch (tipo) {
                case "Remitente": {
                    this.GiroModel.Municipio_Remitente = '';
                    this.Municipios_Remitente = data;
                    break;
                }
                case "Destinatario": {
                    this.GiroModel.Municipio_Destinatario = '';
                    this.Municipios_Destinatario = data;
                    break;
                }

            }
        });
    }

}