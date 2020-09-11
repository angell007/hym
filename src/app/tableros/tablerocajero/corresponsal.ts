import { NgForm } from "@angular/forms";
import { GeneralService } from '../../shared/services/general/general.service';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";

export class Corresponsal {

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
    public ListaServiciosExternos: any = [];
    public Servicio2 = false;
    public Servicio1 = true;
    public corresponsalView: Subject<any> = new Subject<any>();
    public ActualizarTablaCorresponsal: Subject<any> = new Subject<any>();
    private http: HttpClient
    Corresponsal1 = true;
    Corresponsal2 = false;
    public SessionDataModel: any;
    public Corresponsal: boolean = false;

    public CorresponsalModel: any = {
        Id_Corresponsal_Diario: '',
        Id_Corresponsal_Bancario: '',
        Detalle: '',
        Valor: '',
        Fecha: '',
        Hora: '',
        Id_Moneda: '2',
        Identificacion_Funcionario:"",
    };

    constructor(SessionDataModel: any) {
        this.SessionDataModel = SessionDataModel;
        this.funcionario_data = this.SessionDataModel.funcionarioData;
        this.IdCaja = this.SessionDataModel.idCaja;
        this.IdOficina = this.SessionDataModel.idOficina;
        this.CorresponsalModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario

    }

    GuardarCorresponsal(formulario: NgForm) {
        let info = this.generalService.normalize(JSON.stringify(this.CorresponsalModel));
        let datos = new FormData();
        datos.append("modulo", 'Corresponsal_Diario');
        datos.append("datos", info);
        this.http.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario.php', datos).subscribe((data: any) => {
            this.LimpiarModeloCorresponsal('creacion');
        });
    }

    ConsultarCorresponsalDiario() {
        let id_corresponsal_bancario = this.CorresponsalModel.Id_Corresponsal_Bancario;
        let id_funcionario = this.CorresponsalModel.Identificacion_Funcionario;

        if (id_corresponsal_bancario == '') {
            this.LimpiarModeloCorresponsalParcial();
            return;
        }

        if (id_funcionario == '') {
            console.log("No hay funcionario asignado para corresponsal bancario!");
            return;
        }

        let parametros = { funcionario: id_funcionario, id_corresponsal_bancario: id_corresponsal_bancario };

        this.http.get(this.globales.ruta + 'php/corresponsaldiario/lista_corresponsales.php', { params: parametros }).subscribe((data: any) => {
            if (data.length == 0) {
                this.LimpiarModeloCorresponsalParcial();
            } else {
                this.CorresponsalModel = data;
            }

        });
    }

    LimpiarModeloCorresponsalParcial() {
        this.CorresponsalModel.Valor = '';
        this.CorresponsalModel.Detalle = '';
        this.CorresponsalModel.Id_Corresponsal_Diario = '';
        this.CorresponsalModel.Fecha = '';
        this.CorresponsalModel.Hora = '';
    }

    LimpiarModeloCorresponsal(tipo: string) {

        if (tipo == 'creacion') {
            this.CorresponsalModel = {
                Id_Corresponsal_Diario: '',
                Id_Corresponsal_Bancario: '',
                Detalle: '',
                Valor: '',
                Fecha: '',
                Hora: '',
                Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
            };
        }

        if (tipo == 'edicion') {
            this.CorresponsalModel = {
                Id_Corresponsal_Diario: '',
                Id_Corresponsal_Bancario: '',
                Detalle: '',
                Valor: '',
                Fecha: '',
                Hora: '',
                Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
            };
        }
    }

    public UpdateTablaCorresponsal($event) {
        this.ActualizarTablaCorresponsal.next();
    }

    CargarDatosCorresponsal() {
        this.ActualizarTablaCorresponsal.next();
    }
}
