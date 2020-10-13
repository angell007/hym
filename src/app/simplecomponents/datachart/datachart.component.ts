import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-datachart',
  templateUrl: './datachart.component.html',
  styleUrls: ['./datachart.component.scss']
})
export class DatachartComponent implements OnInit, OnChanges {

  @Input() ChartLabels:string[] = [];
  @Input() ChartData:number[] = [];
  @Input() ChartType:string = '';

  public doughnutColors:any[] = [
    { backgroundColor: ["#86c7f3", "#ffe199"] },
    { borderColor: ["#AEEBF2", "#FEFFC9"] }];

  constructor() { }

  ngOnInit() {
    // console.log(this.ChartData);
    // console.log(this.ChartLabels);
    // console.log(this.ChartType);
    
  }

  ngOnChanges(changes:SimpleChanges){
  }

}
