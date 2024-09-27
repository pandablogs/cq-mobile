import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import moment from 'moment';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';





@Component({
  selector: 'app-dashboard-calendar',
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.scss']
})
export class DashboardCalendarComponent implements OnInit {

  constructor(public dialog: MatBottomSheet) {}
  ngOnInit(): void {
    
  }


  openDialog(content:any): void {
    this.dialog.open(content, {});
  }

  selected:any;

  getDate(val:any){
    return moment(val).format('MMM DD,YYYY');
  }

}
