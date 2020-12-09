import { HttpClient } from "@angular/common/http";
import { Globales } from '../../shared/globales/globales';

export class Egresos {
    //Danilo CargarDatosEgresos
    public ListaServiciosExternos: any = [];
    public Servicios: any[];
    public globales: Globales;
    private http: HttpClient
    public funcionario_data: {
        Identificacion_Funcionario: ''
    }

    constructor(SessionDataModel: any) {
        // this.SessionDataModel = SessionDataModel;
        // this.funcionario_data = this.SessionDataModel.funcionarioData;
        // this.IdCaja = this.SessionDataModel.idCaja;
        // this.IdOficina = this.SessionDataModel.idOficina;
        // this.CambioModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario

    }

    //Danilo CargarEgresos
    CargarEgresosDiarios() {
        this.Servicios = [];
        this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios.php', { params: { id_funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.Servicios = data.query_data;
        });
    }
    CargarDatosEgresos() {
        this.CargarEgresosDiarios();
        this.ListaServiciosExternos = [];
        this.ListaServiciosExternos = this.globales.ServiciosExternos;
    }
}