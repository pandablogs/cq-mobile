import { Component, OnInit, HostListener } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-schedules-dashboard',
  templateUrl: './schedules.dashboard.component.html',
  styleUrls: ['./schedules.dashboard.component.scss']
})

export class DashboardSchedulesComponent implements OnInit {


  activeView: string = "Calendar";

  viewDate: Date = new Date();
  inspector_date: any = null;

  inspectorsOnDate: Array<any> = [];

  constructor() {

  }


  ngOnInit(): void {

  }

  // NgDestroy function to remove the time interval
  ngOnDestroy() {

  }

  // Chage Active Tab
  changeActiveTab(tabName: any) {
    this.activeView = tabName
  }

  getCalendarSelectedDate(event) {
    console.log(event);
    let finalList: Array<any> = [];

    this.inspector_date = moment(event.date).format("YYYY-MM-DD");
    let inspections = [...event.inspections];

    inspections.map(x => {

      if (x.event === 'budget_verification') {
        finalList.push(x.budget_verification.info.vendor_id);
      }

      if (x.event === 'draws') {
        finalList.push(x.draw.inspection.vendor_id);
      }

      if (x.event === 'inspection') {
        finalList.push(x.inspections.inspector_id);
      }

    });

    console.log(finalList);

    const distinctValues = [...new Set(finalList)].filter(item => item !== null);

    this.inspectorsOnDate = distinctValues ? [...distinctValues] : [];

    this.activeView = "Navigation";
  }

}
