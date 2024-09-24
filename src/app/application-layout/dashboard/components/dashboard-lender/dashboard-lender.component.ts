import { Component, OnInit, HostListener } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { StorageApiService } from 'src/app/services/storage.api.service';
import { StaffDashboardAPIService } from 'src/app/services/staff/staff.dashboard.api.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-lender',
  templateUrl: './dashboard-lender.component.html',
  styleUrls: ['./dashboard-lender.component.scss']
})
export class DashboardLenderComponent implements OnInit {

  isMobileResolution: boolean;
  date: Date = new Date();
  time = new Date();
  hrs: any = new Date().getHours();
  timeInterval;
  greet: string = "";
  first_name: string = "";

  total_loans: any = [];
  lead: number = 0;
  pre_lead: number = 0;
  initial_underwriting_loans: number = 0;
  pending_committed_loans: number = 0;
  committed_loans: number = 0;
  loans: any = [];
  total_active_loans: number = 0
  total_commited_loans: number = 0
  current_week: any = {};
  upcoming_week: any = {};
  trailing_month: any = {};
  following_week: any = {};
  activeTab: string = 'All'
  lenderloans: any = []
  filteredLoanData: any = []

  constructor(private loader: NgxUiLoaderService,
    private router: Router,
    private staffDashboardAPIService: StaffDashboardAPIService,
    private storageApi: StorageApiService,
    private toastr: ToastrService) {
    if (window.innerWidth < 600) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  @HostListener("window:resize", ["$event"])
  isMobile(event) {
    if (window.innerWidth < 600) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit(): void {
    this.first_name = this.storageApi.getLoggedInFirstName();
    this.timeInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.getDashboardData();
    if (this.hrs < 12) {
      this.greet = 'Good Morning';
    } else if (this.hrs >= 12 && this.hrs < 17) {
      this.greet = 'Good Afternoon';
    } else if (this.hrs >= 17 && this.hrs <= 24) {
      this.greet = 'Good Evening';
    }
  }

  ngAfterViewInit() {
    this.onloadJS()
  }

  // Get Dashboard Data
  getDashboardData() {

    this.total_loans = 0;
    this.lead = 0;
    this.pre_lead = 0;
    this.initial_underwriting_loans = 0;
    this.pending_committed_loans = 0;
    this.committed_loans = 0;
    this.current_week = {};
    this.upcoming_week = {};
    this.trailing_month = {};
    this.following_week = {};

    const body = {
      current_week: this.getCurrentWeekRange(),
      upcoming_week: this.getUpcomingWeekRange(),
      following_week: this.getFollowingWeekRange(),
      trailing_month: this.getTrailingMonthRange(),
      role: this.storageApi.getLoggedInRole()
    }

    this.loader.start();
    this.staffDashboardAPIService.getDashboardAnalyticsLender(body)
      .then((response) => {
        this.total_loans = response?.count || [];
        var loanData = [];
        var ObjectLoanStatus = {};
        this.total_loans.forEach(ele => {
          if (ele.stats) {
            ele.stats.forEach(ele2 => {
              ObjectLoanStatus[ele2.label] = {}
            })
          }
        })

        Object.keys(ObjectLoanStatus).map((ele: any) => {

          var obj = {
            status_title: ele,
            lenders: [{
              name: 'Quick Lending, LLC',
              total_loans: 0
            }, {
              name: 'Texas Real Estate Fund I, LP',
              total_loans: 0
            }]
          }
          this.total_loans.forEach(ele2 => {
            if (ele2.name) {
              var obj_lenders = {
                name: ele2.name,
                total_loans: 0
              }
              if (ele2.stats.length) {
                ele2.stats.forEach(ele3 => {
                  if (ele3.label == ele) {
                    obj_lenders.total_loans = ele3.count;
                    let indexOf = obj.lenders.findIndex(x => x.name == obj_lenders.name)
                    if (indexOf >= 0) {
                      obj.lenders[indexOf].total_loans = obj_lenders.total_loans
                    }
                  }
                })
              }
            }
          })
          loanData.push(obj)
        });

        // return false
        this.lenderloans = []

        var statusOrder = ['Initial Underwriting', 'Pending Committed', 'Committed', 'Active'];
        statusOrder.forEach(item => {
          this.lenderloans.push(loanData.find(x => x.status_title == item))
        });

        this.current_week = response?.current_week || {};
        this.upcoming_week = response?.upcoming_week || {};
        this.trailing_month = response?.trailing_month || {};
        this.following_week = response?.following_week || {};

        this.loader.stopAll();
      })
      .catch((error) => {
        this.toastr.error(error, "Something went wrong");
        this.loader.stop();
      })

  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  // Get Current Week Range Function
  getCurrentWeekRange() {
    var weekStart = moment().startOf('isoWeek');
    var weekEnd = weekStart.clone().add(4, 'day');
    return { from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }
  }

  // Get Upcoming Week Range Function
  getUpcomingWeekRange() {
    var weekStart = moment().startOf('isoWeek').add(7, 'day');
    var weekEnd = weekStart.clone().add(4, 'day');
    return { from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }

  }

  // Get Following Week Range Function
  getFollowingWeekRange() {
    var weekStart = moment().startOf('isoWeek').add(14, 'day');
    var weekEnd = weekStart.clone().add(4, 'day');
    return { from: weekStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: weekEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }

  }

  // Get Trailing Month Range Function
  getTrailingMonthRange() {
    var monthStart = moment().startOf('month').subtract(1, 'month');
    var monthEnd = monthStart.clone().endOf('month');
    return { from: monthStart.format("YYYY-MM-DD") + "T00:00:00.000Z", to: monthEnd.format("YYYY-MM-DD") + "T00:00:00.000Z" }
  }

  // Get Date Function
  getDate(date: any) {
    return moment(date).utc().format("MM/DD/YYYY");
  }

  // Get Month With Year Function
  getMonthWithYear(date: any) {
    return moment(date).utc().format("MMMM, YYYY");
  }

  // Calculate Currency
  calculateCurrency(val) {
    val = Math.abs(val)
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(val);
  }

  // Calculate Decimal
  calculateDecimal(val) {
    val = Math.abs(val)
    const formatter = new Intl.NumberFormat('en-US');

    return formatter.format(val);
  }


  goApplicationLists(type) {

    this.router.navigate([`/application-pipeline/lists`], { queryParams: { filter: type } });


  }

  // Segment Load Function
  onloadJS() {
    const setSegmentedTab = (el) => {
      let highlight = el
        .closest(".segmented")
        .querySelector(".segmented-highlight");
      let parent = el.parentElement;
      highlight.style.setProperty("--width", Math.floor(el.offsetWidth) + "px");
      highlight.style.setProperty("--translateX", el.offsetLeft + "px");

      parent.querySelectorAll("button").forEach((button) => {
        button.classList.remove("active");
      });
      el.classList.add("active");
    };

    let activeSegment = document.querySelectorAll(".segmented .active");
    activeSegment.forEach((element) => {
      setSegmentedTab(element);
    });

    let segmentButton = document.querySelectorAll(".segmented button");
    segmentButton.forEach((button) => {
      button.addEventListener("click", (element) => {
        setSegmentedTab(element.currentTarget);
      });
    });

    let dropdownMenu = document.querySelectorAll(".dropdown-menu");
    dropdownMenu.forEach((menu) => {
      menu.addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("active");
      });
    });

    document.addEventListener("click", (element: any) => {
      if (
        !element.target.classList.contains("dropdown-menu") &&
        !element.target.closest(".dropdown-menu") &&
        !element.target.closest(".dd-menu")
      ) {
        document.querySelectorAll(".dd-menu").forEach((menu) => {
          menu.classList.remove("active");
        });
      }
    });

  }

  // Changing Active Tab
  changeActiveTab(tabName: any) {
    this.activeTab = tabName
  }
}
