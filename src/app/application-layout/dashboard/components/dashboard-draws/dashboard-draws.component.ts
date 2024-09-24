import { Component, OnInit, HostListener } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { StorageApiService } from 'src/app/services/storage.api.service';
import { StaffDashboardAPIService } from 'src/app/services/staff/staff.dashboard.api.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-draws',
  templateUrl: './dashboard-draws.component.html',
  styleUrls: ['./dashboard-draws.component.scss']
})
export class DashboardDrawsComponent implements OnInit {

  // Data variables
  total_loans: number = 0;
  scheduled: number = 0;
  requested: number = 0;
  under_inspection: number = 0;
  sent_for_approval: number = 0;
  approved: number = 0;
  funded: number = 0;
  total_loans_array: any = []
  lenderloans: any = []

  // Data from API comes in Array 
  current_week: Array<any> = [];
  upcoming_week: Array<any> = [];
  trailing_month: Array<any> = [];
  following_week: Array<any> = [];
  activeTab: string = 'All';
  todays_data: Array<any> = [];

  today;

  constructor(private loader: NgxUiLoaderService,
    private router: Router,
    private staffDashboardAPIService: StaffDashboardAPIService,
    private storageApi: StorageApiService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.today = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    this.getDashboardData();
  }

  ngAfterViewInit() {
  }


  // Get Dashboard Data
  getDashboardData() {
    this.total_loans = 0;
    this.scheduled = 0;
    this.requested = 0;
    this.under_inspection = 0;
    this.sent_for_approval = 0;
    this.approved = 0;
    this.funded = 0;
    this.current_week = [];
    this.upcoming_week = [];
    this.trailing_month = [];
    this.following_week = [];
    this.todays_data = [];

    // API body
    const body = {
      current_week: this.getCurrentWeekRange(),
      upcoming_week: this.getUpcomingWeekRange(),
      following_week: this.getFollowingWeekRange(),
      // trailing_month: this.getTrailingMonthRange(),
      today: this.today,
      role: this.storageApi.getLoggedInRole()
    }

    this.loader.start();
    this.staffDashboardAPIService.getDashboardAnalyticsForDraws(body) // API call to get dashboard Data 
      .then((response) => {
        // this.total_loans = response?.count?.total_loans || 0;
        this.under_inspection = response?.count?.find(x => x._id === "Under Inspection")?.count || 0;
        this.sent_for_approval = response?.count?.find(x => x._id === "Sent For Approval")?.count || 0;
        this.approved = response?.count?.find(x => x._id === "Approved")?.count || 0;
        this.funded = response?.count?.find(x => x._id === "Funded")?.count || 0;
        this.scheduled = response?.count?.find(x => x._id === "Scheduled")?.count || 0;
        this.requested = response?.count?.find(x => x._id === "Requested")?.count || 0;

        this.current_week = response?.current_week || [];
        this.upcoming_week = response?.upcoming_week || [];
        this.trailing_month = response?.trailing_month || [];
        this.following_week = response?.following_week || [];
        this.todays_data = response?.today || [];
        this.loader.stop();
      })
      .catch((error) => {
        this.toastr.error(error, "Something went wrong");
        this.loader.stop();
      })
  }

  // Get current week range 
  getCurrentWeekRange() {
    var weekStart = moment().startOf('isoWeek');
    var weekEnd = weekStart.clone().add(4, 'day');
    return { from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }
  }

  // Get upcoming week range
  getUpcomingWeekRange() {
    var weekStart = moment().startOf('isoWeek').add(7, 'day');
    var weekEnd = weekStart.clone().add(4, 'day');
    return { from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }

  }

  // Get following week range
  getFollowingWeekRange() {
    var weekStart = moment().startOf('isoWeek').add(14, 'day');
    var weekEnd = weekStart.clone().add(4, 'day');
    return { from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }

  }

  // Get trailing month range
  getTrailingMonthRange() {
    var monthStart = moment().startOf('month').subtract(1, 'month');
    var monthEnd = monthStart.clone().endOf('month');
    return { from: monthStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: monthEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }
  }

  // Get Date Method
  getDate(date: any) {
    return moment(date).utc().format("MM/DD/YYYY");
  }

  // Calculate currency from decimals
  calculateCurrency(val) {
    val = Math.abs(val)
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(val);
  }

  // Calculate currency from decimals
  calculateDecimal(val) {
    val = Math.abs(val)
    const formatter = new Intl.NumberFormat('en-US');

    return formatter.format(val);
  }

  // Function to navigate different loan types
  goApplicationLists(type) {
    if (type == 'total_loans') {
      this.router.navigate([`/application-pipeline/lists`]);
    } else {
      this.router.navigate([`/application-pipeline/lists`], { queryParams: { filter: type } });
    }

  }


}
