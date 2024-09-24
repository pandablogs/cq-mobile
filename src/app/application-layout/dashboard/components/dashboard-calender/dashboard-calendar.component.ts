import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, Routes, RouterModule } from "@angular/router";
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CRMApiService } from 'src/app/services/staff/crm.api.service';
import { StorageApiService } from 'src/app/services/storage.api.service';
import { StaffDashboardAPIService } from 'src/app/services/staff/staff.dashboard.api.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, parseISO, format } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { encodeString } from "src/app/utils/utility";

const colors: any = {
  closings: {
    primary: '#fb6340',
    secondary: '#fb6340',
  },
  appraisal: {
    primary: 'rgb(30, 144, 255)',
    secondary: 'rgb(30, 144, 255)',
  },
  budget_verification: {
    primary: '#11faa4',
    secondary: '#11faa4'
  },
  draws: {
    primary: 'rgb(191, 66, 245)',
    secondary: 'rgb(191, 66, 245)'
  },
  yellow: {
    primary: '#ffff00',
    secondary: '#ffff5c',
  },
  rubyRed: {
    primary: '#C70039',
    secondary: '#DC92A7'
  }

};


@Component({
  selector: 'app-dashboard-calendar',
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.scss']
})
export class DashboardCalendarComponent implements OnInit {

  @ViewChild('addNoteModal', { static: true }) addNoteModal: ElementRef<any>;

  @ViewChild('addAttendance', { static: true }) modalContent: ElementRef<any>;

  @ViewChild('previewDetails', { static: true }) previewDetails: ElementRef<any>;

  @ViewChild('deleteAlert', { static: true }) deleteAlert: ElementRef<any>;
  lead_details: any = {}

  deleteText: string = undefined;

  details: any = null;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  weekStartsOn: 0 = 0;

  dayStartHour = 9;

  dayEndHour = 19;

  query;
  officerList: Array<any> = [];


  d = new Date();
  dateString = new Date(this.d.getTime() - (this.d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
  attendance_date = this.dateString;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  default = [
    {
      start: startOfDay(new Date(510019200)),
      title: 'A 3 day event',
      color: colors.red,
    },
    {
      start: startOfDay(new Date(510019200)),
      title: 'An event with no end date',
      color: colors.yellow,
    },
  ];

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  private refreshs() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  events: CalendarEvent[] = [];
  attendanceEvents: Array<any> = [];
  Events: any = ''
  selectedDateRecords: Array<any> = [];
  activeDayIsOpen: boolean = false;

  dateRange: any = { startDate: moment().startOf('month').format("YYYY-MM-DD") + "T00:00:00.000Z", endDate: moment().endOf('month').format("YYYY-MM-DD") + "T00:00:00.000Z" };

  total_events: number = 0;
  total_appraisal: number = 0;
  total_budget_verification: number = 0
  total_closings: number = 0


  constructor(private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private staffDashboardAPIService: StaffDashboardAPIService,
    private crmApi: CRMApiService,
    private storageApi: StorageApiService) { }

  // Day Click Event
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.viewDate = date;
    const from_moment = moment(this.viewDate).format("YYYY-MM-DD");
    const dateClicked = from_moment + "T00:00:00.000Z";
    this.selectedDateRecords = [];
    if (events.length > 0) {
      this.selectedDateRecords = events
      this.modalService.open(this.previewDetails, { size: 'lg', centered: true, backdrop: 'static', keyboard: false }).result
        .then((result) => {
        }, (reason) => {
          this.getAllRecords();
        });
    } else {
      this.toastr.info(`No Appointments Available on ${moment(this.viewDate).format("MM-DD-YYYY")}`);
    }
  }

  // Handle Event
  handleEvent(action: string, event: CalendarEvent): void {
    let type;
    this.Events.forEach((value) => {
      if (value._id === event.id) {
        if (value.first_name) {
          type = 'prospect'
        } else {
          type = 'area'
        }
      }
    })
  }

  // Delete Event
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }


  // View Day Change
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    const date = new Date(this.viewDate);
    let startDate = moment(date).startOf('month').format("YYYY-MM-DD") + "T00:00:00.000Z";
    let endDate = moment(date).endOf('month').format("YYYY-MM-DD") + "T00:00:00.000Z";

    this.dateRange = { startDate, endDate };
    this.getAllRecords();
  }

  ngOnInit() {
    this.getAllRecords();
    this.getAllOfficers();

  }

  // Get All Records
  getAllRecords() {
    const body = {
      from: this.dateRange.startDate,
      to: this.dateRange.endDate
    };

    this.loader.start();
    this.staffDashboardAPIService.getDashboardAnalyticsClender(body)
      .then((response) => {
        this.loader.stop();
        this.Events = response;

        this.setRecords();
        // this.toastr.success("Records Fetched Successfully.");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error);
      })
  }

  // Set Records
  setRecords() {

    this.total_events = Number(this.Events?.closings.length) + Number(this.Events?.appraisal.length) + Number(this.Events?.budget_verification.length) || 0;
    this.total_closings = this.Events?.closings.length || 0
    this.total_appraisal = this.Events?.appraisal.length || 0
    this.total_budget_verification = this.Events?.budget_verification.length || 0

    const closingsEvent = this.Events?.closings.map(ele => ({
      id: ele._id,
      type: 'Closings',
      ...ele,
      start: parseISO(ele?.loan_terms.loan_info.final_closing_date.slice(0, -5)),
      end: parseISO(ele?.loan_terms.loan_info.final_closing_date.slice(0, -5)),
      color: this.dotColor('closings'),
      event: 'closings'
    }))


    const appraisalEvent = this.Events?.appraisal.map(ele => ({
      id: ele._id,
      type: 'Appraisal',
      ...ele,
      start: parseISO(ele?.appraisal?.due_date.slice(0, -5)),
      end: parseISO(ele?.appraisal?.due_date.slice(0, -5)),
      color: this.dotColor('appraisal'),
      event: 'appraisal'
    }))

    const budgetVerificationEvent = this.Events?.budget_verification.map(ele => ({
      id: ele._id,
      type: 'Budget Verification',
      ...ele,
      start: parseISO(ele?.budget_verification?.info?.inspection_date.slice(0, -5)),
      end: parseISO(ele?.budget_verification?.info?.inspection_date.slice(0, -5)),
      color: this.dotColor('budget_verification'),
      event: 'budget_verification'
    }))

    const drawsEvent = this.Events?.draws.map(ele => ({
      id: ele._id,
      type: 'Draws',
      ...ele,
      start: parseISO(ele?.draw?.inspection?.inspection_date.slice(0, -5)),
      end: parseISO(ele?.draw?.inspection?.inspection_date.slice(0, -5)),
      color: this.dotColor('draws'),
      event: 'draws'
    }))

    const inspectionEvent = this.Events?.inspections.map(ele => ({
      id: ele._id,
      type: 'Inspection',
      ...ele,
      start: parseISO(ele?.inspections?.inspection_date.slice(0, -5)),
      end: parseISO(ele?.inspections?.inspection_date.slice(0, -5)),
      color: this.dotColor('inspection'),
      event: 'inspection'
    }))

    this.events = [...closingsEvent, ...appraisalEvent, ...budgetVerificationEvent, ...drawsEvent, ...inspectionEvent]

    this.refreshs();
  }

  // Type Color Function
  dotColor(status) {
    switch (status) {
      case "closings":
        return colors.closings
      case "appraisal":
        return colors.appraisal
      case "budget_verification":
        return colors.budget_verification
      case "draws":
        return colors.draws
      case "inspection":
        return colors.rubyRed
      default:
        return colors.yellow
    }
  }

  getInspectionTime(date) {
    if (date) {
      return moment(date).utc().format("hh:mm a");
    }
    return "N/A";
  }

  // Get All Officers From CRM
  getAllOfficers() {
    this.loader.start();
    this.crmApi.getAllOfficers()
      .then((res) => {
        this.officerList = res ? [...res] : [];
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })
  }

  // Calculate Number Decimal
  calculateDecimal(val) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });

    return formatter.format(val);
  }

  // Change Date Format
  getDate(value: any) {
    if (value) {
      return moment(value.replace("Z", '')).format("MM/DD/YYYY");
    }
    return "N/A";
  }

  // To Navigate To Application Lists
  navigateButton(item, tab?) {
    this.modalService.dismissAll()
    if (item?.type == 'Draws') {
      const paramsbody = encodeString(JSON.stringify({ role: 'staff', application_id: item._id, tab_type: tab || '' }))
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          `/master-login/${this.storageApi.getLoggedInID()}/${paramsbody}`,
        ]))
      window.open(url, "_blank")
    }
    else {
      this.router.navigate([`application-pipeline/detail/${item._id}`])
    }
  }
}
