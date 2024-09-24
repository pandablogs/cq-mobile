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
import { encodeString, findObjectDifferences } from "src/app/utils/utility";
import { environment } from 'src/environments/environment';
import { StaffLoansAPIService } from 'src/app/services/staff/staff.loans.api.service';
import { StaffBudgetVerificationEvaluationsAPIService } from 'src/app/services/staff/evaluations/staff.budget-verification.evaluations.api.service';
import { DrawsApiService } from 'src/app/services/draws/draws.api.service';
import { InspectorScheduleApiService } from 'src/app/services/inspector-schedule.api.service';

const colors: any = {
  maintenance: {
    primary: 'rgb(250, 246, 27)',
    secondary: 'rgb(250, 246, 27)',
    text_color: '#000'
  },
  contractor: {
    primary: '#2dce89',
    secondary: '#2dce89',
    text_color: '#fff'
  },
  thirdparty: {
    primary: 'rgb(27, 112, 250)',
    secondary: 'rgb(27, 112, 250)',
    text_color: '#fff'
  },
  budget_verification: {
    primary: '#fb6340',
    secondary: '#fb6340',
    text_color: '#fff'
  },
  draws: {
    primary: 'rgb(191, 66, 245)',
    secondary: 'rgb(191, 66, 245)',
    text_color: '#fff'
  },
  yellow: {
    primary: '#ffff00',
    secondary: '#ffff5c',
    text_color: '#000'
  },
  rubyRed: {
    primary: '#C70039',
    secondary: '#DC92A7',
    text_color: '#fff'
  }
};


@Component({
  selector: 'app-inspection-calendar',
  templateUrl: './inspection-calendar.component.html',
  styleUrls: ['./inspection-calendar.component.scss']
})
export class DashboardInspectionComponent implements OnInit {

  @ViewChild('addNoteModal', { static: true }) addNoteModal: ElementRef<any>;

  @ViewChild('addAttendance', { static: true }) modalContent: ElementRef<any>;

  @ViewChild('previewDetails', { static: true }) previewDetails: ElementRef<any>;

  @ViewChild('deleteAlert', { static: true }) deleteAlert: ElementRef<any>;

  @ViewChild('openViewModal', { static: true }) openViewModal: ElementRef<any>;

  @ViewChild('inspectionTimeChangeAlert', { static: true }) inspectionTimeChangeAlert: ElementRef<any>;


  lead_details: any = {}

  deleteText: string = undefined;

  details: any = null;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  weekStartsOn: 0 = 0;

  dayStartHour = 6;

  dayEndHour = 22;

  query;
  officerList: Array<any> = [];
  vendorList: Array<any> = [];


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
  budgetVerificationEvents: any;
  propertyMaintenanceEvents: Array<any> = [];
  propertyContractorRequestedEvents: Array<any> = [];
  thirdpartyContractorRequestedEvents: Array<any> = [];
  selectedDateRecords: Array<any> = [];
  activeDayIsOpen: boolean = false;

  dateRange: any = { startDate: moment().startOf('month').format("YYYY-MM-DD") + "T00:00:00.000Z", endDate: moment().endOf('month').format("YYYY-MM-DD") + "T00:00:00.000Z" };

  total_property_maintenance: number = 0;
  total_property_contractor: number = 0
  total_thirdParty: number = 0
  total_budget_verification: number = 0
  total_draw: number = 0;
  total_inspection: number = 0;
  total_events: number = 0

  tenantList: any = []
  categoryList: any = []
  displayOptionList: any = []
  displayStaffList: Array<any> = [];
  job_description: any = []


  total_contractor_events: number = 0;

  is_prod: boolean = environment.production;

  display_overview: boolean = false;

  constructor(private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private staffDashboardAPIService: StaffDashboardAPIService,
    private storageApi: StorageApiService,
    private staffLoanAPIService: StaffLoansAPIService,
    private budgetVerificationApi: StaffBudgetVerificationEvaluationsAPIService,
    private drawsApi: DrawsApiService,
    private inspectionApi: InspectorScheduleApiService,) { }


  ngOnInit() {
    this.getAllRecords();
    this.getAllBudgetInspectors()
  }


  // Load calendar data
  getAllRecords() {
    const body = {
      requested_date_from: this.dateRange.startDate,
      requested_date_to: this.dateRange.endDate
    };

    this.loader.start();
    this.events = []
    this.staffDashboardAPIService.getAceRealtyCalendarData(body)
      .then((response) => {
        this.propertyMaintenanceEvents = response;
        // const body = {
        //   requested_date_from: this.dateRange.startDate,
        //   requested_date_to: this.dateRange.endDate
        // };
        // return this.staffDashboardAPIService.getAllRequestsByMonth(body)
        return true;
      }).then((requestData) => {
        // this.propertyContractorRequestedEvents = requestData;
        const body = {
          from: this.dateRange.startDate,
          to: this.dateRange.endDate
        };
        return this.staffDashboardAPIService.getDashboardAnalyticsClender(body)
      }).then((requestData) => {
        this.budgetVerificationEvents = requestData;
        return this.staffDashboardAPIService.getThirdPartyRequestsByMonth(body)
      }).then((requestData) => {
        this.thirdpartyContractorRequestedEvents = requestData;
        this.setEventData();
        this.loader.stop();
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error);
      })
  }


  // Set All Event Data
  setEventData() {
    const propertyMaintenancePendingEvent = this.propertyMaintenanceEvents.filter(x => x.status == 'Pending').map(ele => ({
      id: ele._id,
      type: 'Maintenance Request',
      ...ele,
      start: ele?.repair_schedule?.date ? parseISO(ele?.repair_schedule?.date.slice(0, -5)) : undefined,
      color: this.dotColor('maintenance'),
      event: 'Pending'
    }))

    const propertyMaintenanceCompletedEvent = this.propertyMaintenanceEvents.filter(x => x.status == 'Completed').map(ele => ({
      id: ele._id,
      type: 'Maintenance Request',
      ...ele,
      start: ele?.repair_schedule?.date ? parseISO(ele?.repair_schedule?.date.slice(0, -5)) : undefined,
      color: this.dotColor('maintenance'),
      event: 'Completed'
    }))

    const propertyContractorPendingEvent = this.propertyContractorRequestedEvents.filter(x => x.status == 'Pending').map(ele => ({
      id: ele._id,
      type: 'Contractor Request',
      ...ele,
      start: ele?.repair_schedule?.date ? parseISO(ele?.repair_schedule?.date.slice(0, -5)) : undefined,
      color: this.dotColor('contractor'),
      event: 'Pending'
    }))

    const propertyContractorCompletedEvent = this.propertyContractorRequestedEvents.filter(x => x.status == 'Completed').map(ele => ({
      id: ele._id,
      type: 'Contractor Request',
      ...ele,
      start: ele?.repair_schedule?.date ? parseISO(ele?.repair_schedule?.date.slice(0, -5)) : undefined,
      color: this.dotColor('contractor'),
      event: 'Completed'
    }))

    const thirdPartyContractorPendingEvent = this.thirdpartyContractorRequestedEvents.filter(x => x.status == 'Pending').map(ele => ({
      id: ele._id,
      type: 'Third Party Request',
      ...ele,
      start: parseISO(ele?.repair_schedule.date.slice(0, -5)),
      color: this.dotColor('thirdparty'),
      event: 'Pending'
    }))

    const thirdPartyContractorCompletedEvent = this.thirdpartyContractorRequestedEvents.filter(x => x.status == 'Completed').map(ele => ({
      id: ele._id,
      type: 'Third Party Request',
      ...ele,
      start: parseISO(ele?.repair_schedule.date.slice(0, -5)),
      color: this.dotColor('thirdparty'),
      event: 'Completed'
    }))

    const budgetVerificationEvent = this.budgetVerificationEvents?.budget_verification.map(ele => {

      let inspector_name = this.getVendorName(ele?.budget_verification?.info?.vendor_id);
      if (ele?.budget_verification?.info?.inspection_start_time && ele?.budget_verification?.info?.inspection_end_time) {
        return {
          id: ele._id,
          type: 'Budget Verification',
          ...ele,
          // start: new Date(),
          // end: new Date(moment().add(2, 'hours').toDate()),
          start: new Date(moment(ele?.budget_verification?.info?.inspection_start_time.replace("Z", "")).toDate()),
          end: new Date(moment(ele?.budget_verification?.info?.inspection_end_time.replace("Z", "")).toDate()),
          color: this.dotColor('budget_verification'),
          event: 'budget_verification',
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
          title: ele?.application?.property_details?.property_full_address ? `${inspector_name} - ${ele?.application?.property_details?.property_full_address}` : '',
          inspector_name: inspector_name
        }
      } else {

        return {
          id: ele._id,
          type: 'Budget Verification',
          ...ele,
          start: parseISO(ele?.budget_verification?.info?.inspection_date.slice(0, -5)),
          end: parseISO(ele?.budget_verification?.info?.inspection_date.slice(0, -5)),
          color: this.dotColor('budget_verification'),
          event: 'budget_verification',
          // resizable: {
          //   beforeStart: true,
          //   afterEnd: true,
          // },
          // draggable: true,
          title: ele?.application?.property_details?.property_full_address ? `${inspector_name} - ${ele?.application?.property_details?.property_full_address}` : '',
          inspector_name: inspector_name
        }
      }
    }).filter(x => x !== undefined);

    const drawsEvent = this.budgetVerificationEvents?.draws.map(ele => {
      if (ele?.draw?.inspection?.inspection_start_time && ele?.draw?.inspection?.inspection_end_time) {
        return {
          id: ele._id,
          type: 'Draws',
          ...ele,
          // start: parseISO(ele?.draw?.inspection?.inspection_date.slice(0, -5)),
          // end: parseISO(ele?.draw?.inspection?.inspection_date.slice(0, -5)),
          start: new Date(moment(ele?.draw?.inspection?.inspection_start_time.replace("Z", "")).toDate()),
          end: new Date(moment(ele?.draw?.inspection?.inspection_end_time.replace("Z", "")).toDate()),
          color: this.dotColor('draws'),
          event: 'draws',
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
          title: ele?.application?.property_details?.property_full_address ? `${ele?.draw?.inspection?.vendor_name} - ${ele?.application?.property_details?.property_full_address}` : '',
          inspector_name: ele?.draw?.inspection?.vendor_name || ""
        }
      } else {
        return {
          id: ele._id,
          type: 'Draws',
          ...ele,
          start: parseISO(ele?.draw?.inspection?.inspection_date.slice(0, -5)),
          end: parseISO(ele?.draw?.inspection?.inspection_date.slice(0, -5)),
          color: this.dotColor('draws'),
          event: 'draws',
          title: ele?.application?.property_details?.property_full_address ? `${ele?.draw?.inspection?.vendor_name} - ${ele?.application?.property_details?.property_full_address}` : '',
          inspector_name: ele?.draw?.inspection?.vendor_name || ""
        }
      }
    })

    const inspectionEvent = this.budgetVerificationEvents?.inspections.map(ele => {
      if (ele?.inspections?.inspection_start_time && ele?.inspections?.inspection_end_time) {
        return {
          id: ele._id,
          type: 'Inspection',
          ...ele,
          start: new Date(moment(ele?.inspections?.inspection_start_time.replace("Z", "")).toDate()),
          end: new Date(moment(ele?.inspections?.inspection_end_time.replace("Z", "")).toDate()),
          color: this.dotColor('inspection'),
          event: 'inspection',
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
          title: ele?.application?.property_details?.property_full_address ? `${ele?.inspections?.inspector_name} - ${ele?.application?.property_details?.property_full_address}` : '',
          inspector_name: ele?.inspections?.inspector_name || ""
        }
      } else {
        return {
          id: ele._id,
          type: 'Inspection',
          ...ele,
          start: parseISO(ele?.inspections?.inspection_date.slice(0, -5)),
          end: parseISO(ele?.inspections?.inspection_date.slice(0, -5)),
          color: this.dotColor('inspection'),
          event: 'inspection',
          title: ele?.application?.property_details?.property_full_address ? `${ele?.inspections?.inspector_name} - ${ele?.application?.property_details?.property_full_address}` : '',
          inspector_name: ele?.inspections?.inspector_name || ""
        }
      }
    })

    this.propertyContractorRequestedEvents = [
      ...propertyMaintenancePendingEvent,
      ...propertyMaintenanceCompletedEvent,
      ...propertyContractorPendingEvent,
      ...propertyContractorCompletedEvent
    ]
    let total_maintenance_request = [...propertyMaintenancePendingEvent, ...propertyMaintenanceCompletedEvent]
    let total_contractor_request = [...propertyContractorPendingEvent, ...propertyContractorCompletedEvent]
    let total_thirdparty_request = [...thirdPartyContractorPendingEvent, ...thirdPartyContractorCompletedEvent]
    this.total_property_maintenance = Number(total_maintenance_request?.length) || 0
    this.total_property_contractor = Number(total_contractor_request?.length) || 0
    this.total_thirdParty = Number(total_thirdparty_request?.length) || 0
    this.total_budget_verification = Number(budgetVerificationEvent?.length) || 0
    this.total_draw = Number(drawsEvent?.length) || 0;
    this.total_inspection = Number(inspectionEvent?.length) || 0;
    this.total_events = this.total_property_maintenance + this.total_property_contractor + this.total_thirdParty + this.total_budget_verification + this.total_draw + this.total_inspection;

    this.events = [
      ...propertyMaintenancePendingEvent,
      ...propertyMaintenanceCompletedEvent,
      // ...propertyContractorPendingEvent,
      // ...propertyContractorCompletedEvent,
      ...thirdPartyContractorPendingEvent,
      ...thirdPartyContractorCompletedEvent,
      ...budgetVerificationEvent,
      ...drawsEvent,
      ...inspectionEvent];

    this.refreshs();
  }


  // Day Click Event
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.viewDate = date;
    const from_moment = moment(this.viewDate).format("YYYY-MM-DD");
    const dateClicked = from_moment + "T00:00:00.000Z";
    this.selectedDateRecords = [];
    if (events.length > 0) {
      this.selectedDateRecords = events;

      let openPreviewModal = () => {
        this.modalService.open(this.previewDetails, { size: 'lg', centered: true, backdrop: 'static', keyboard: false }).result
          .then((result) => {
          }, (reason) => {
            this.getAllRecords();
          });
      }

      this.modalService.open(this.openViewModal, { size: 'sm', centered: true, backdrop: 'static', keyboard: false }).result
        .then((result) => {
          openPreviewModal();
        }, (reason) => {

        });

    } else {
      this.toastr.info(`No Appointments Available on ${moment(this.viewDate).format("MM-DD-YYYY")}`);
    }
  }

  showOverview() {
    this.display_overview = true;
  }

  openDayView() {
    this.modalService.dismissAll();
    this.view = CalendarView.Day;
  }

  // Handle Event
  handleEvent(action: string, event: CalendarEvent): void {
    let type;
    this.propertyMaintenanceEvents.forEach((value) => {
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

  // Type Color Function
  dotColor(status) {
    switch (status) {
      case "budget_verification":
        return colors.budget_verification
      case "draws":
        return colors.draws
      case "maintenance":
        return colors.maintenance
      case "contractor":
        return colors.contractor
      case "thirdparty":
        return colors.thirdparty
      case "inspection":
        return colors.rubyRed
      default:
        return colors.yellow
    }
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
  // Get date in a corrected format for repair schedule
  getDateRepairSchedule(date, time) {
    return moment.utc(date).format('YYYY-MM-DD') + ' ' + moment(moment(date).format('YYYY-MM-DD') + 'T' + time + ':00').format('h:mm a')
  }

  // Get Budget All Inspectors
  getAllBudgetInspectors() {
    this.staffDashboardAPIService.getAllBudgetInspectors()
      .then((res) => {
        let list = res ? [...res] : [];
        this.vendorList = list ? [...list] : [];
      })
      .catch((error) => {
      })
  }

  //Get Vendor Name details return 
  getVendorName(id) {
    var result = "N/A"
    var vendorData = this.vendorList.find(x => x._id == id)
    if (id && id != "" && vendorData) {
      result = vendorData.first_name + " " + vendorData.last_name
    }
    return (result)
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {

    let item: any = event;

    console.log(item);
    console.log(newStart);
    console.log(newEnd);

    this.modalService.open(this.inspectionTimeChangeAlert, { size: 'sm', centered: true, backdrop: 'static', keyboard: false }).result
      .then((result) => {
        this.events = this.events.map((iEvent) => {
          if (iEvent === event) {
            return {
              ...event,
              start: newStart,
              end: newEnd,
            };
          }
          return iEvent;
        });

        if (item.event === 'budget_verification') {
          this.updateBudgetInspectionTime(item, newStart, newEnd);
        }

        if (item.event === 'draws') {
          this.saveInspection(item, newStart, newEnd);
        }

        if (item.event === 'inspection') {
          this.saveNormalInspection(item, newStart, newEnd);
        }
      }, (reason) => {

      });



  }

  updateBudgetInspectionTime(event, newStart, newEnd) {

    let inspection = event?.budget_verification?.info;

    const start_time = new Date(newStart);
    const end_time = new Date(newEnd);
    const new_start_time = `${start_time.getHours().toString().padStart(2, '0')}:${start_time.getMinutes().toString().padStart(2, '0')}`;
    const new_end_time = `${end_time.getHours().toString().padStart(2, '0')}:${end_time.getMinutes().toString().padStart(2, '0')}`;

    let _body = {
      inspection_start_time: newStart && inspection?.inspection_date ? inspection?.inspection_date.split("T")[0] + `T${new_start_time}:00.000Z` : undefined,
      inspection_end_time: newEnd && inspection?.inspection_date ? inspection?.inspection_date.split("T")[0] + `T${new_end_time}:00.000Z` : undefined,
    };

    let _previousBody = {
      inspection_start_time: inspection?.inspection_start_time || undefined,
      inspection_end_time: inspection?.inspection_end_time || undefined,
    }

    Object.keys(_body).forEach((key) => {
      if (_body[key] === undefined || _body[key] === "") {
        delete _body[key];
      }
    });

    Object.keys(_previousBody).forEach((key) => {
      if (_previousBody[key] === undefined || _previousBody[key] === "") {
        delete _previousBody[key];
      }
    });

    let body = {
      loan_id: event._id,
      ..._body,
    };

    if (JSON.stringify(_previousBody) === JSON.stringify(_body)) {
    } else {
      let history: any = {};
      let result: any = findObjectDifferences(_previousBody, _body);

      Object.keys(result).forEach((key) => {
        if (result[key] === undefined || result[key] === "" || result[key] === 0) {
          delete result[key];
        }
      });

      let formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2, // Minimum number of digits after the decimal
        maximumFractionDigits: 2, // Maximum number of digits after the decimal
      });

      Object.entries(result).forEach(([key, value]) => {
        let item: any = value;

        if (typeof item === 'string' && key === 'inspection_start_time') {
          history["Inspection Start Time"] = { label: 'Inspection Start Time', value: item, type: '' };
        } else if (typeof item === 'string' && key === 'inspection_end_time') {
          history["Inspection End Time"] = { label: "Inspection End Time", value: item, type: '' };
        }

      });
      if (Object.keys(history).length > 0) {
        this.addHistory(history, body.loan_id);
      }
    }

    this.loader.start();
    this.budgetVerificationApi.updateBasicData(body)
      .then(async (res) => {
        // this.loader.stop();
        this.getAllRecords();
        this.toastr.success("Inspection Time updated successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })
  }

  addHistory(history, loan_id) {
    const body = {
      loan_id: loan_id,
      budget_verification_schedule: {
        ...history,
        added_by: this.storageApi.getLoggedInFirstName() + ' ' + this.storageApi.getLoggedInLastName(),
        added_by_id: this.storageApi.getLoggedInID(),
        date_added: moment().toISOString()
      }
    }
    this.staffLoanAPIService.updateLoanHistory(body)
      .then((res) => {
      })
      .catch((error) => {
      })
  }

  getInspectionTime(date) {
    if (date) {
      return moment(date).utc().format("hh:mm a");
    }
    return "N/A";
  }

  saveInspection(event, newStart, newEnd) {

    let draw = event?.draw;

    const start_time = new Date(newStart);
    const end_time = new Date(newEnd);
    const new_start_time = `${start_time.getHours().toString().padStart(2, '0')}:${start_time.getMinutes().toString().padStart(2, '0')}`;
    const new_end_time = `${end_time.getHours().toString().padStart(2, '0')}:${end_time.getMinutes().toString().padStart(2, '0')}`;

    var body = {
      loan_id: event._id,
      draw_id: draw._id,
      inspection: {
        vendor_id: draw?.inspection?.vendor_id,
        vendor_name: draw?.inspection?.vendor_name,
        inspection_date: draw?.inspection?.inspection_date,
        inspection_approval_date: draw?.inspection?.inspection_approval_date,
        status: draw?.inspection?.status,
        inspection_time: draw?.inspection?.inspection_time,
        inspection_start_time: newStart && draw?.inspection?.inspection_date ? draw?.inspection?.inspection_date.split("T")[0] + `T${new_start_time}:00.000Z` : undefined,
        inspection_end_time: newEnd && draw?.inspection?.inspection_date ? draw?.inspection?.inspection_date.split("T")[0] + `T${new_end_time}:00.000Z` : undefined,
      }
    }


    Object.keys(body.inspection).forEach((key) => {
      if (body.inspection[key] === undefined || body.inspection[key] === "") {
        delete body.inspection[key];
      }
    });

    this.loader.start();

    this.drawsApi.updateInspection(body)
      .then((res) => {
        this.getAllRecords();
        this.toastr.success("Inspection Time updated successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })

  }

  saveNormalInspection(event, newStart, newEnd) {

    let inspection = event?.inspections;

    const start_time = new Date(newStart);
    const end_time = new Date(newEnd);
    const new_start_time = `${start_time.getHours().toString().padStart(2, '0')}:${start_time.getMinutes().toString().padStart(2, '0')}`;
    const new_end_time = `${end_time.getHours().toString().padStart(2, '0')}:${end_time.getMinutes().toString().padStart(2, '0')}`;

    const body = {
      "inspector_id": inspection?.inspector_id ? inspection?.inspector_id : undefined,
      inspector_name: inspection?.inspector_name,
      inspection_date: inspection?.inspection_date,
      inspection_start_time: newStart && inspection?.inspection_date ? inspection?.inspection_date.split("T")[0] + `T${new_start_time}:00.000Z` : undefined,
      inspection_end_time: newEnd && inspection?.inspection_date ? inspection?.inspection_date.split("T")[0] + `T${new_end_time}:00.000Z` : undefined,
      "loan_id": event._id,
      "_id": inspection._id
    }

    this.loader.start();

    this.inspectionApi.updateInspection(body)
      .then((res) => {
        this.getAllRecords();
        this.toastr.success("Inspection Time updated successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })

  }

}
