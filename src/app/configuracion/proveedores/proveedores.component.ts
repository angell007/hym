import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  public proveedores : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Direccion : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public Detalle : any[];
  public Confiable : any[];
  public Regimen : any[];
  public IdDepartamento : any[];
  public IdMunicipio : any[];
  public RazonSocial : any[];

  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'http://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { } 

  ngOnInit() {
    this.http.get(this.ruta+'php/proveedores/lista_proveedores.php').subscribe((data:any)=>{
        this.proveedores= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarProveedor(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();  
    console.log(info);          
    datos.append("modulo",'Proveedor');
    datos.append("datos",info);
    modal.hide();
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.proveedores= data;
    });
  }

  EliminarProveedor(id){
    let datos=new FormData();
    datos.append("modulo", 'Proveedor');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.proveedores=data; 
      this.deleteSwal.show();
    })     
  }

  EditarProveedor(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Proveedor', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = data.Id_Proveedor;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.Detalle = data.Detalle;
      this.Confiable = data.Confiable;
      this.Regimen = data.Regimen;
      this.IdDepartamento = data.Id_Departamento;
      this.IdMunicipio = data.Id_Municipio;
      this.RazonSocial = data.Razon_Social;
      modal.show();
    });
  }

}
