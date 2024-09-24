import { Component, OnInit, HostListener } from "@angular/core";
import moment from "moment";
// import { ToastrService } from "ngx-toastr";
// import { NgxUiLoaderService } from "ngx-ui-loader";
// import { StaffDashboardAPIService } from "src/app/services/staff/staff.dashboard.api.service";
// import { StorageApiService } from "src/app/services/storage.api.service";

@Component({
  selector: "app-liquidity",
  templateUrl: "./liquidity.component.html",
  styleUrls: ["./liquidity.component.scss"],
})
export class LiquidityComponent implements OnInit {
  activeTabToday: string = "Total";
  activeTabWeek: string = "Total";
  activeTabNext: string = "Total";
  activeTabFollowingWeek: string = "Total";
  activeTrailMonth: string = "Total";
  activeTrailWeek: string = "Total";

  today: any;
  active_stats: any = [];
  status_stats: any = [];
  today_stats_all: any = null;
  today_stats_lender: any = [];
  today_stats_white_label: any = [];
  current_week_stats_all: any = null;
  current_week_stats_lender: any = [];
  current_week_stats_white_label: any = [];
  following_week_stats_all: any = null;
  following_week_stats_lender: any = [];
  following_week_stats_white_label: any = [];
  upcoming_week_stats_all: any = null;
  upcoming_week_stats_lender: any = [];
  upcoming_week_stats_white_label: any = [];
  trailing_month_stats_all: any = null;
  trailing_month_stats_lender: any = [];
  trailing_month_stats_white_label: any = [];
  trailing_week_stats_all: any = null;
  trailing_week_stats_lender: any = [];
  trailing_week_stats_white_label: any = [];
  lead: number = 0;
  pending_committed: number = 0;
  initial_underwriting: number = 0;
  committed: number = 0;

  constructor(
    // private staffDashboardAPIService: StaffDashboardAPIService,
    // private storageApi: StorageApiService,
    // private loader: NgxUiLoaderService,
    // private toastr: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.today = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
  }

  // Chage Active Tab
  changeActiveTab(tabName: any, section?:any) {
    switch (section) {
      case "today":
        this.activeTabToday = tabName;
        break;

      case "week":
        this.activeTabWeek = tabName;
        break;
      case "next":
        this.activeTabNext = tabName;
        break;

      case "following":
        this.activeTabFollowingWeek = tabName;
        break;

      case "trailingMonth":
        this.activeTrailMonth = tabName;
        break;
      case "trailingWeek":
        this.activeTrailWeek = tabName;
        break;
      default:
        break;
    }
  }

  // Get current week range
  getCurrentWeekRange() {
    var weekStart = moment().startOf("isoWeek");
    var weekEnd = weekStart.clone().add(4, "day");
    return {
      from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z",
      to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z",
    };
  }

  // Get upcoming week range
  getUpcomingWeekRange() {
    var weekStart = moment().startOf("isoWeek").add(7, "day");
    var weekEnd = weekStart.clone().add(4, "day");
    return {
      from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z",
      to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z",
    };
  }

  // Get following week range
  getFollowingWeekRange() {
    var weekStart = moment().startOf("isoWeek").add(14, "day");
    var weekEnd = weekStart.clone().add(4, "day");
    return {
      from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z",
      to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z",
    };
  }

  // Get trailing month range
  getTrailingMonthRange() {
    var monthStart = moment().startOf("month").subtract(1, "month");
    var monthEnd = monthStart.clone().endOf("month");
    return {
      from: monthStart.format("YYYY-MM-DD") + "T00:00:00.000Z",
      to: monthEnd.format("YYYY-MM-DD") + "T00:00:00.000Z",
    };
  }

  // Get trailing week range
  getTrailingWeekRange() {
    var weekStart = moment().startOf("week").subtract(1, "week");
    var weekEnd = weekStart.clone().endOf("week");
    return {
      from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z",
      to: weekEnd.format("YYYY-MM-DD") + "T23:59:59.999Z",
    };
  }

  // Get Date Method
  getDate(date: any) {
    return moment(date).utc().format("MM/DD/YYYY");
  }


  // Calculate currency from decimals
  calculateDecimal(val:any) : any {
    val = Math.abs(val);
    const formatter = new Intl.NumberFormat("en-US");

    if (!isNaN(Number(formatter.format(val)))) {
      return formatter.format(val);
    }
  }

  // Calculate currency from decimals
  calculateCurrency(val:any) : any {
    val = Math.abs(val);
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(val);
  }
}
