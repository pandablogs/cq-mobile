import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dashboard-bar-chart',
  templateUrl: './bar-chart.dashboard.component.html',
  styleUrls: ['./bar-chart.dashboard.component.scss']
})
export class BarChartDashboardComponent implements OnInit, OnChanges {

  @Input() barChart: Array<any> = [];

  multi: any[] = [];

  view: any[] = [undefined, 300];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Months';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Closings';
  legendTitle: string = 'Months';

  colorScheme = {
    domain: ['#ff5f53', '#fdc361', '#f2fb94', '#A1DB89', '#8BB2EA', '#df8bea', '#ff00f1', '#00fff2', '#0000f1', '#8000f1', '#80ff00', '#ff0000']
  };

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if (this.barChart.length > 0) {
      this.multi = [...this.barChart];
    } else {
      this.multi = [];
    }
  }


  onSelect(data): void {

  }

  onActivate(data): void {

  }

  onDeactivate(data): void {

  }




}
