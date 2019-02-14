import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoTerceroModel } from '../../Modelos/GrupoTerceroModel';
import { GrupoterceroService } from '../../shared/services/grupotercero.service';
import { Funcionario } from '../../shared/funcionario/funcionario.model';

@Component({
  selector: 'app-gruposterceros',
  templateUrl: './gruposterceros.component.html',
  styleUrls: ['./gruposterceros.component.scss']
})
export class GrupostercerosComponent implements OnInit {

  @ViewChild('ModalGrupo') ModalGrupo:any;
  @ViewChild('alertSwal') alertSwal:any;

  public Funcionario:any = JSON.parse(localStorage['User']);
  public Grupos:Array<any> = [];
  public GruposPadre:Array<any> = [];

  public GrupoTerceroModel:GrupoTerceroModel = new GrupoTerceroModel();

  constructor(private grupoTerceroService:GrupoterceroService) {    
    this.GrupoTerceroModel.Id_Funcionario = this.Funcionario.Identificacion_Funcionario;
    this.GetGrupos();
   }

  ngOnInit() {
  }

  GetGrupos():void{
    this.grupoTerceroService.getGruposTercero().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;  
      }else{
        this.Grupos = [];  
      }      
    });
  }

  GetGruposPadre():void{
    this.grupoTerceroService.getGruposPadre().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.GruposPadre = data.query_data;  
      }else{
        this.Grupos = [];  
      }      
    });
  }

  GuardarGrupo(){
    console.log(this.GrupoTerceroModel);
    
    let data = new FormData();
    let info = JSON.stringify(this.GrupoTerceroModel);
    data.append("modelo", info);
    this.grupoTerceroService.saveGrupoTercero(data).subscribe((data:any) => {
      this.CerrarModalGrupo();
      this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      this.GetGrupos();
    });
  }

  CerrarModalGrupo(){
    this.LimpiarModeloGrupo();
    this.ModalGrupo.hide();
  }

  LimpiarModeloGrupo(){
    this.GrupoTerceroModel = new GrupoTerceroModel();
    this.GrupoTerceroModel.Id_Funcionario = this.Funcionario.Identificacion_Funcionario;
  }

  AbrirModalGrupo(){
    this.GetGruposPadre();
    this.ModalGrupo.show();
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
