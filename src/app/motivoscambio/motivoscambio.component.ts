import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Globales } from '../shared/globales/globales';
import { SwalService } from '../shared/services/swal/swal.service';


@Component({
  selector: 'app-motivoscambio',
  templateUrl: './motivoscambio.component.html',
  styleUrls: ['./motivoscambio.component.scss']
})
export class MotivoscambioComponent implements OnInit {

  @ViewChild('modalMotivoCambio') modalMotivoCambio: any;
  @ViewChild('saveSwal') saveSwal: any;

  public motivos: any = [];
  public pageSize: number = 0;
  public page: number = 0;
  public TotalItems: number = 0;


  public motivoModel = {
    nombre: ""
  }

  constructor(
    private globales: Globales,
    private http: HttpClient,
    private swalService: SwalService
  ) { }

  ngOnInit() {
    this.getMotivos()
  }

  getMotivos() {
    this.http.get(this.globales.rutaNueva + 'motivos-devolucion').subscribe((data: any) => {
      this.motivos = data;
    })
  }

  AbrirModal() {
    this.modalMotivoCambio.show();
  }

  Ocultar() {
    this.modalMotivoCambio.hide();
  }

  GuardarMotivo() {
    if (this.motivoModel.nombre == "") {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debes ingresar un Nombre']);
      return false;
    }

    const datos = new FormData();
    datos.append("data", JSON.stringify(this.motivoModel));
    this.http.post(this.globales.rutaNueva + 'motivos-devolucion', datos).subscribe((data: any) => {
      // console.log(data);
      this.getMotivos()
      this.Ocultar();
    })
  }

  deletemotivo(id) {
    const datos = new FormData();
    datos.append("id", JSON.stringify(id));
    this.http.post(this.globales.rutaNueva + `motivos-devolucion/${id}`, datos).subscribe((data: any) => {
      // console.log(data);
      this.getMotivos()
    })
  }


}