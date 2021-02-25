import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwalService } from '../../shared/services/swal/swal.service';

@Component({
  selector: 'app-funcionarioinformativecard',
  templateUrl: './funcionarioinformativecard.component.html',
  styleUrls: ['./funcionarioinformativecard.component.scss']
})

export class FuncionarioinformativecardComponent implements OnInit {

  @Input() Funcionario: any = {};
  @Input() Fecha: string = '';
  @Output('Actualizar') Actualizar:EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('alerSwal') alerSwal:any;
  public Funcionarios_Activos: Array<any> = [];
  public SesionAbierta: boolean = false;
  public user: any = '';


  constructor(public globales: Globales, private client: HttpClient, public router: Router, private _swalService: SwalService) { }

  ngOnInit() {
    this.SesionAbierta = this.Funcionario.Hora_Cierre == '00:00:00' ? true : false;
    this.user = JSON.parse(localStorage.User);
  }

  AbrirCierreFuncionario(funcionario: any) {

    let user = funcionario;
    if (this.Fecha == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'La fecha para la consulta del cierre esta vacia, contacte con el administrador del sistema!']);
    } else {
      this.router.navigate(['/consolidado', user]);
    }
  }

  Abrir(id) {

    const params = new FormData();
    params.append('id', id)
    this.client.post(this.globales.rutaNueva + 'cierre-caja/funcionario', params).subscribe((data: any) => {
      console.log(data);

      if(data == 'Caja abierta Correctamente'){

        this._swalService.ShowMessage(['success', 'Operación exitosa', 'Caja abierta Correctamente!']);
      }else{
        
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error inesperado!']);
      }
      this.Actualizar.emit();
    });
  }

  Cerrar(id) {

    console.log('Cerrando');
  }

}
