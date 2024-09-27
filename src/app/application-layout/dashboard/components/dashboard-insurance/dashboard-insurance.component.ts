import { Component, OnInit, HostListener } from '@angular/core';
import moment from 'moment'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-insurance',
  templateUrl: './dashboard-insurance.component.html',
  styleUrls: ['./dashboard-insurance.component.scss']
})
export class DashboardInsuranceComponent implements OnInit {

  // Data variables
  activeTab: string = 'All';
  overviews : any = [] 
  property_overview : any = {
    "total_uninsured" : 0,
    "force_placed" : 0,
    "pending_payment" : 0,
    "insured" : 0,
    "uninsured" : 0,
    "payment_plan" : 0,
  }
  flood_overview : any = {
    "total_uninsured" : 0,
    "force_placed" : 0,
    "pending_payment" : 0,
    "insured" : 0,
    "uninsured" : 0,
    "payment_plan" : 0,
  }

  expiration_data : any =[{
      id: "overdue",
     title : 'Overdue Insurance',
     days : {
      property : 0,
      flood : 0
     }
    },
    {
      id: "7_days",
      title : 'Expiration in 7 days',
      days : {
       property : 0,
       flood : 0
      }
     },  {
      id: "15_days",
      title : 'Expiration in 15 days',
      days : {
       property : 0,
       flood : 0
      }
     }, {
      id: "30_days",
      title : 'Expiration in 30 days',
      days : {
       property : 0,
       flood : 0
      }
  }]
  


  constructor(
    private toastr: ToastrService
    ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }



}
