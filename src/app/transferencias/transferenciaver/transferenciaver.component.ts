import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transferenciaver',
  templateUrl: './transferenciaver.component.html',
  styleUrls: ['./transferenciaver.component.scss']
})
export class TransferenciaverComponent implements OnInit {
  Transferencia:any = {};

  constructor(private route: ActivatedRoute,private http : HttpClient, private globales: Globales) { }

  ngOnInit() {

    let id = this.route.snapshot.params["id"];

    this.http.get(this.globales.ruta+'/php/transferencias/recibo.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Transferencia= data;
    });

  }

}
