import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-serviciosexternos',
  templateUrl: './serviciosexternos.component.html',
  styleUrls: ['./serviciosexternos.component.css']
})
export class ServiciosexternosComponent implements OnInit {


  public serviciosexternos : any[];



  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion : any[];
  public Nombre : any[];
  public Comision : any[];
  public Adjunto : any[];



  @ViewChild('ModalServicio') ModalServicio:any;
  @ViewChild('ModalEditarServicio') ModalEditarServicio:any;
  @ViewChild('FormServicio') FormServicio:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/serviciosexternos/lista.php').subscribe((data:any)=>{
      this.serviciosexternos= data;
    });
  }

  
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormServicio.reset();
      //this.OcultarFormulario(this.ModalServicio);
      //this.OcultarFormulario(this.ModalEditarServicio);
    }
  }

  



  ActualizarVista()
  {
    this.http.get(this.ruta+'php/serviciosexternos/lista.php').subscribe((data:any)=>{
      this.serviciosexternos= data;
    });
  }


  GuardarServicio(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    


    datos.append("modulo",'Servicio_Externo');
    datos.append("datos",info);

    //this.OcultarFormulario(modal);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
    this.ActualizarVista();
    formulario.reset();
    });    
  }

  

/*
  EditarCaja(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Caja_Recaudos', id:id}
    }).subscribe((data:any)=>{
  
  console.log(id);
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Username = data.Username;
      this.Password = data.Password;
      this.Tipo = data.Tipo;
      this.Departamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      modal.show();
    });
  }

*/




  EliminarServicio(id){
    console.log(id);  
    let datos=new FormData();
    datos.append("modulo", 'Servicio_Externo');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    })


    
  }









  

}