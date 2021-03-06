import { Injectable } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { ValidateCajeroService } from '../validate-cajero.service';

@Injectable()

export class ConsolidadosService {

	public MonedasSistema: any = [];
	public user = JSON.parse(localStorage['User']);
	public Modulos: Array<string> = ['Cambios', 'Transferencias', 'Giros', 'Traslados', 'Corresponsal', 'Servicios'];
	public SumatoriaTotales: any = [];
	public TotalesIngresosMonedas: any = [];
	public TotalesEgresosMonedas: any = [];
	public TotalesCustom: any = [];
	public Totales: any = [];
	public Saldos: any = [];
	public temporalData: any = [];
	public ValoresMonedasApertura = []
	public TotalRestaIngresosEgresos = [];
	public subject = new Subject;
	public observer$ = this.subject.asObservable();
	public nuevaData = true;
	public saldosAnteriores: any;


	constructor(public globales: Globales, private http: HttpClient, private _vService: ValidateCajeroService
	) {
		if (this._vService.isValid) {
			console.log('observable');
			TimerObservable.create(0, 10000)
				.subscribe(() => {
					this.GetData();
				});
		}
	}


	reduce(a) {
		let suma = 0;
		a.forEach((element) => {
			suma += parseFloat(element.Ingreso_Total) - parseFloat(element.Egreso_Total)
		})
		return suma;
	}

	mifuncion(a1: Array<any>, a2: Array<any>) {
		return JSON.stringify(a1) === JSON.stringify(a2);
	}

	async GetData() {

		this.SumatoriaTotales = []
		this.TotalRestaIngresosEgresos = []

		let p: any = { id: this.user.Identificacion_Funcionario };
		this.http.get(`${this.globales.rutaNueva}cierre-caja`, { params: p }).subscribe((data: any) => {

			this.temporalData = data
			this.nuevaData = false;
			this.Modulos = data;

			// data.forEach(element => {
			// 	if (element.Movimientos) {
			// 		this.TotalRestaIngresosEgresos.push({ saldo: this.reduce(element.Movimientos), cod: element.Codigo, id: element.Id })
			// 	}
			// 	if (!element.Movimientos) {
			// 		this.saldosAnteriores = element
			// 	}
			// });

			this.TotalRestaIngresosEgresos.forEach((TIE: any) => {
				this.saldosAnteriores.forEach((SA: any) => {
					if (TIE.id == SA.Id_Moneda) {
						TIE.saldo += Number(SA.Valor_Moneda_Apertura);
					}
				});
			});

		});
	}

	async getValoresIniciales() {

		// await this.http.get(`${this.globales.ruta}/php/cierreCaja/Cierre_Caja_Nuevo.php`, { params: { id: this.user.Identificacion_Funcionario } }).pipe()
		// 	.toPromise().then((data: any) => {
		// 		this.MonedasSistema = data.monedas;
		// 		let t = data.totales_ingresos_egresos;

		// 		for (const k in t) {
		// 			let arr = t[k];
		// 			this.Totales[k] = arr;
		// 		}

		// 		this.MonedasSistema.forEach((m) => {
		// 			this.Modulos.forEach((mod) => {
		// 				let obj = this.Totales[mod];
		// 				let monObj = obj.filter(x => x.Moneda_Id == m.Id_Moneda);
		// 				if (this.SumatoriaTotales[m.Nombre]) {
		// 					this.SumatoriaTotales[m.Nombre].Ingreso_Total += parseFloat(monObj[0].Ingreso_Total);
		// 					this.SumatoriaTotales[m.Nombre].Egreso_Total += parseFloat(monObj[1].Egreso_Total);
		// 					this.Saldos[m.Nombre] = parseFloat((this.SumatoriaTotales[m.Nombre].Ingreso_Total - this.SumatoriaTotales[m.Nombre].Egreso_Total).toFixed(2))
		// 				} else {
		// 					this.SumatoriaTotales[m.Nombre] = { Ingreso_Total: 0, Egreso_Total: 0 };
		// 					this.SumatoriaTotales[m.Nombre].Ingreso_Total += parseFloat(monObj[0].Ingreso_Total);
		// 					this.SumatoriaTotales[m.Nombre].Egreso_Total += parseFloat(monObj[1].Egreso_Total);
		// 				}
		// 			});
		// 		});
		// 	});

	}

	async getValoresApertura() {
		// await this.http.get(this.globales.ruta + 'php/diario/get_valores_diario.php', { params: { id: this.user.Identificacion_Funcionario } }).toPromise().then(async (data: any) => {
		// 	data.valores_diario.forEach((valores, i) => {
		// 		this.ValoresMonedasApertura.push(valores);
		// 	});
		// });
	}

}
