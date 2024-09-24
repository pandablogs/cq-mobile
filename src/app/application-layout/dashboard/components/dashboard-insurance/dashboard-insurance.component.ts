import { Component, OnInit, HostListener } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StaffDashboardAPIService } from 'src/app/services/staff/staff.dashboard.api.service';
import * as moment from 'moment';
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
  


  constructor(private loader: NgxUiLoaderService,
    private staffDashboardAPIService: StaffDashboardAPIService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getDashboardData();
  }

  ngAfterViewInit() {
  }

   // Get Dashboard Data
   getDashboardData() {

    // API body
    const body = {

        "today": moment().format("YYYY-MM-DD") + "T00:00:00.000Z",
        "seven_day_date": this.getDates('7 days'),
        "fifteen_day_date": this.getDates('15 days'),
        "thirty_day_date": this.getDates('30 days')
    }

    this.loader.start();
    this.staffDashboardAPIService.getDashboardAnalyticsForInsurance(body) // API call to get dashboard Data 
      .then((response) => {
    
        this.expiration_data.forEach(ele=>{
          if(ele.id=="overdue"){
              ele.days.property = response?.property_expiration_stats?.total_loans_overdue
              ele.days.flood = response?.flood_expiration_stats?.total_loans_overdue
          }else if(ele.id=='7_days'){
              ele.days.property = response?.property_expiration_stats?.total_loans_seven_days
              ele.days.flood = response?.flood_expiration_stats?.total_loans_seven_days
          }else if(ele.id=='15_days'){
              ele.days.property = response?.property_expiration_stats?.total_loans_fifteen_days
              ele.days.flood = response?.flood_expiration_stats?.total_loans_fifteen_days
          }else if(ele.id=='30_days'){
              ele.days.property = response?.property_expiration_stats?.total_loans_thirty_days
              ele.days.flood = response?.flood_expiration_stats?.total_loans_thirty_days
          }
   })
  
  
   response?.property_stats.map(item=>{
      if(item._id=='Pending Payment'){
          this.property_overview.pending_payment = item?.count
      }else if(item._id=="Uninsured"){
        this.property_overview.uninsured = item?.count
      }else if(item._id=="Insured"){
        this.property_overview.insured = item?.count
      }else if(item._id=='Force Placed'){
        this.property_overview.force_placed = item?.count
      }else if(item._id=='Payment Plan'){
        this.property_overview.payment_plan = item?.count
      }
    })

      
    response?.flood_stats.map(item=>{
      if(item._id=='Pending Payment'){
          this.flood_overview.pending_payment = item?.count
      }else if(item._id=="Uninsured"){
        this.flood_overview.uninsured = item?.count
      }else if(item._id=="Insured"){
        this.flood_overview.insured = item?.count
      }else if(item._id=='Force Placed'){
        this.flood_overview.force_placed = item?.count
      }else if(item._id=='Payment Plan'){
        this.flood_overview.payment_plan = item?.count
      }
    })

    this.overviews = [{
      title : 'Property Insurance Overview',
      stats :  this.property_overview
    },{
      title : 'Flood Insurance Overview',
      stats :   this.flood_overview
    }]
    
        this.loader.stop();

      })
      .catch((error) => {
        this.toastr.error(error, "Something went wrong");
        this.loader.stop();
      })
  }

  getDates(remaining_days){
    let currentDate = moment();
    let resultDate = "";
    switch (remaining_days) {
      case "overdue":
        resultDate = currentDate.format("YYYY-MM-DD")+"T00:00:00.000Z";  
        break;
      case "7 days":
        let seven_day = moment().add(7,'day');
        resultDate = seven_day.format("YYYY-MM-DD")+"T00:00:00.000Z";  
        break;
      case "15 days":
        let fifteen_day = moment().add(15,'day');
        resultDate = fifteen_day.format("YYYY-MM-DD")+"T00:00:00.000Z";  
        break;
      case "30 days":
        let thirty_day = moment().add(30,'day');
        resultDate = thirty_day.format("YYYY-MM-DD")+"T00:00:00.000Z";  
        break;
      default:
        break;
    }
    return resultDate;
  }


}
