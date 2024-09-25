import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import moment from 'moment';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';





@Component({
  selector: 'app-dashboard-calendar',
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.scss']
})
export class DashboardCalendarComponent implements OnInit {

  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {
    
  }


  openDialog(content:any): void {
    const dialogRef = this.dialog.open(content, {
      data: {},
      maxWidth : 'auto',
      enterAnimationDuration : '0.2s',
      exitAnimationDuration : '0.2s'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  selected:any;

  getDate(val:any){
    return moment(val).format('MMM DD,YYYY');
  }

}
