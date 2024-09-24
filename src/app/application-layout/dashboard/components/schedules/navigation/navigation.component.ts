import { ToastrService } from "ngx-toastr";
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  IterableDiffers,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MapManager } from "src/app/utils/map-manager";
import { InspectorScheduleApiService } from "src/app/services/inspector-schedule.api.service";
import * as moment from "moment";
import { environment } from "src/environments/environment";
import { SMSApiService } from "src/app/services/sms.api.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { StaffBudgetVerificationEvaluationsAPIService } from "src/app/services/staff/evaluations/staff.budget-verification.evaluations.api.service";
import { DrawsApiService } from "src/app/services/draws/draws.api.service";
import { findObjectDifferences } from "src/app/utils/utility";
import { StorageApiService } from "src/app/services/storage.api.service";
import { StaffLoansAPIService } from "src/app/services/staff/staff.loans.api.service";

@Component({
  selector: "app-schedules-dashboard-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class DashboardSchedulesNavigationComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild("map") public mapElementRef: ElementRef;
  @ViewChild("startLocation") public startLocationRef: ElementRef;

  ///Google Map Object
  public map: google.maps.Map;

  public optimizedRouteService: google.maps.DirectionsService;
  public optimizedRouteRenderer: google.maps.DirectionsRenderer;

  is_optimized: boolean = false;

  ///AlphaBet for Order
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Markers
  startMarker: google.maps.Marker = null;
  finishMarker: google.maps.Marker = null;
  stopMarkerList: Array<google.maps.Marker> = [];

  location_id: string;
  waypoints_order: any = null;
  overview_polyline: any = null;
  bounds: any = null;

  stopForm: FormGroup;

  finishLocation = 'custom';

  startLocationData = null;
  finishLocationData = null;
  route_name: string;

  stopLocationData: Array<any> = [];

  finishSwitch: boolean = false;

  prospectList: Array<any> = [];

  initialSwitch: boolean = false;

  inspector_id: string = "";
  @Input() inspector_date: any = null;
  inspectorList: Array<any> = [];
  inspectionRecords: Array<any> = [];

  inspector_phone: string = "";

  navigation_url: string = "";

  //edit inspections
  inspection_date;
  inspection_start_time;
  inspection_end_time;

  selected_item: any = null;
  inspection_type: string = "";

  @Input() inspectorsOnDate: Array<any> = [];

  constructor(
    private ngZone: NgZone,
    private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private inspectorScheduleApi: InspectorScheduleApiService,
    private smsApi: SMSApiService,
    private modalService: NgbModal,
    private budgetVerificationApi: StaffBudgetVerificationEvaluationsAPIService,
    private drawsApi: DrawsApiService,
    private storageApi: StorageApiService,
    private staffLoanAPIService: StaffLoansAPIService,
  ) {

  }

  ngOnInit() {
    this.stopForm = this.fb.group({
      inspector_id: "",
      inspector_date: this.inspector_date || null,
      startLocation: "",
      finishLocation: "",
      finishLocationAddress: "",
      total_stops: "",
      total_time: ""
    });
    this.getAllInspectors();
  }

  ///Map SetUp
  ngAfterViewInit() {
    ///Initialize Google Map
    this.map = MapManager.initGoogleMap(this.mapElementRef);

    MapManager.setCurrentLocation(this.map);

    this.optimizedRouteService = new google.maps.DirectionsService();
    this.optimizedRouteRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false, polylineOptions: { strokeColor: '#19174d' } });

    ///Places AutoComplete
    let startLocation = new google.maps.places.Autocomplete(
      this.startLocationRef.nativeElement,
      { types: [] }
    );

    startLocation.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = startLocation.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.startLocationData = {
          address: startLocation.getPlace().formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
          // position: place.geometry.location,
        };

        this.is_optimized = false;
        this.showAllMarkers();
        this.optimizedRouteRenderer.setMap(null);

        if (this.startMarker) {
          this.startMarker.setMap(null);
          this.startMarker = null;
        }
        this.addMarker(this.map, place.geometry.location, 'start');
        // MapManager.centreMapToLocation(this.map, place.geometry.location);
      });
    });

    const finish = <HTMLInputElement>document.getElementById('finishLocationAddress');
    ///Places AutoComplete
    let finishLocation = new google.maps.places.Autocomplete(
      finish,
      { types: [] }
    );

    finishLocation.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = finishLocation.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.finishLocationData = {
          address: finishLocation.getPlace().formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        };

        this.is_optimized = false;
        this.showAllMarkers();
        this.optimizedRouteRenderer.setMap(null);

        if (this.finishMarker) {
          this.finishMarker.setMap(null);
          this.finishMarker = null;
        }

        this.addMarker(this.map, place.geometry.location, 'finish');
        // MapManager.centreMapToLocation(this.map, place.geometry.location);
      });
    });

    // if finish is required
    // this.finishSwitch = true;
  }

  ngAfterViewChecked() {
    if (this.initialSwitch === true) {
      this.inspectionRecords.forEach((val, index) => {
        var position = { lat: val.property_latitude, lng: val.property_longitude };

        this.stopLocationData.push({
          address: val.property_full_address,
          latitude: val.property_latitude,
          longitude: val.property_longitude
        });

        this.addStopMarker(this.map, position);
      });
      // this.optimizeRoutes();
      this.initialSwitch = false;
    }
  }

  getAllInspectors() {
    this.loader.start();
    this.inspectorScheduleApi.getAllInspectors()
      .then((res) => {
        let list = res ? [...res] : [];
        this.inspectorList = this.inspectorsOnDate.length > 0
          ? list.filter(x => this.inspectorsOnDate.includes(x._id))
          : [...list];

        this.loader.stop();
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })
  }

  getInspectorSchedule() {

    this.inspection_type = "";
    this.selected_item = null;

    const body = {
      inspection_date: this?.inspector_date ? moment(this.inspector_date).format("YYYY-MM-DD") + "T00:00:00.000Z" : undefined,
      inspector_id: this.inspector_id
    }

    this.loader.start();
    this.inspectorScheduleApi.getScheduleForInspector(body)
      .then(async (res) => {
        let budgetList = res?.budget_inspection_records ? [...res?.budget_inspection_records] : [];
        let drawList = res?.draws_inspection_records ? [...res?.draws_inspection_records] : [];
        let inspections = res?.inspection_records ? [...res?.inspection_records] : [];

        let final: Array<any> = [];

        for (let i = 0; i < budgetList.length; i++) {
          let val = budgetList[i];

          let address = val?.application?.property_details?.property_full_address || "";
          let lat = val?.application?.property_details?.property_other_info?.lat || 0;
          let lng = val?.application?.property_details?.property_other_info?.lng || 0;

          let nearest_address = '';
          if (lat === 0 && lng === 0) {
            let result = await this.getLatLong(address);
            lat = result?.lat || 0;
            lng = result?.lng || 0;
            nearest_address = result?.address || "";
          }

          let inspector = this.inspectorList.find(x => x._id === val?.budget_verification?.info?.vendor_id);
          let inspector_name = `${inspector?.first_name?.trim() || ""} ${inspector?.last_name?.trim() || ""}`.trim();

          let body = {
            borrower_name: val?.loan_terms?.loan_info?.borrower_full_name || "",
            borrower_email: val?.loan_terms?.loan_info?.borrower_email || "",
            borrower_phone: val?.loan_terms?.loan_info?.borrower_phone_number || "",
            borrower_entity: val?.loan_terms?.loan_info?.borrower_entity || "",
            entity_address: val?.loan_terms?.loan_info?.entity_address || "",
            property_latitude: lat,
            property_longitude: lng,
            property_full_address: address,
            type: val?.budget_verification ? "Budget Verification" : (val?.draws?.title || "Draws"),
            preferred_time: val?.budget_verification?.info?.actual_inspection_time || val?.budget_verification?.info?.preferred_time || "",
            preferred_date: val?.budget_verification?.info?.order_date || null,
            inspection_date: val?.budget_verification?.info?.inspection_date ? moment(val?.budget_verification?.info?.inspection_date).utc().format("MM/DD/YYYY") : null,
            inspection_time: val?.budget_verification?.info?.inspection_start_time && val?.budget_verification?.info?.inspection_end_time ? `${moment(val?.budget_verification?.info?.inspection_start_time).utc().format("hh:mm a")} - ${moment(val?.budget_verification?.info?.inspection_end_time).utc().format("hh:mm a")}` : null,
            inspector_name: inspector_name || val?.budget_verification?.info?.vendor_name || "",
            nearest_address: nearest_address,
            original: { ...val },
            loan_id: val._id,
            inspection_finalized: val?.budget_verification?.info?.inspection_finalized || false
          }

          final.push(body);
        }

        for (let i = 0; i < drawList.length; i++) {
          let val = drawList[i];

          let address = val?.application?.property_details?.property_full_address || "";
          let lat = val?.application?.property_details?.property_other_info?.lat || 0;
          let lng = val?.application?.property_details?.property_other_info?.lng || 0;

          let nearest_address = '';
          if (lat === 0 && lng === 0) {
            let result = await this.getLatLong(address);
            lat = result?.lat || 0;
            lng = result?.lng || 0;
            nearest_address = result?.address || "";
          }

          let body = {

            borrower_name: val?.loan_terms?.loan_info?.borrower_full_name || "",
            borrower_email: val?.loan_terms?.loan_info?.borrower_email || "",
            borrower_phone: val?.loan_terms?.loan_info?.borrower_phone_number || "",
            borrower_entity: val?.loan_terms?.loan_info?.borrower_entity || "",
            entity_address: val?.loan_terms?.loan_info?.entity_address || "",
            property_latitude: lat,
            property_longitude: lng,
            property_full_address: address,
            type: val?.budget_verification ? "Budget Verification" : (val?.draws?.title || "Draws"),
            preferred_time: val?.draws?.inspection?.inspection_time || "",
            inspection_date: val?.draws?.inspection?.inspection_date ? moment(val?.draws?.inspection?.inspection_date).utc().format("MM/DD/YYYY") : null,
            inspection_time: val?.draws?.inspection?.inspection_start_time && val?.draws?.inspection?.inspection_end_time ? `${moment(val?.draws?.inspection?.inspection_start_time).utc().format("hh:mm a")} - ${moment(val?.draws?.inspection?.inspection_end_time).utc().format("hh:mm a")}` : null,
            inspector_name: val?.draws?.inspection?.vendor_name || "",
            nearest_address: nearest_address,
            original: { ...val },
            loan_id: val._id,
            inspection_finalized: val?.draws?.inspection?.inspection_finalized || false
          }

          final.push(body);

        }

        for (let i = 0; i < inspections.length; i++) {
          let val = inspections[i];

          let address = val?.application?.property_details?.property_full_address || "";
          let lat = val?.application?.property_details?.property_other_info?.lat || 0;
          let lng = val?.application?.property_details?.property_other_info?.lng || 0;

          let nearest_address = '';
          if (lat === 0 && lng === 0) {
            let result = await this.getLatLong(address);
            lat = result?.lat || 0;
            lng = result?.lng || 0;
            nearest_address = result?.address || "";
          }

          let body = {
            borrower_name: val?.loan_terms?.loan_info?.borrower_full_name || "",
            borrower_email: val?.loan_terms?.loan_info?.borrower_email || "",
            borrower_phone: val?.loan_terms?.loan_info?.borrower_phone_number || "",
            borrower_entity: val?.loan_terms?.loan_info?.borrower_entity || "",
            entity_address: val?.loan_terms?.loan_info?.entity_address || "",
            property_latitude: lat,
            property_longitude: lng,
            property_full_address: address,
            type: "Inspection",
            inspection_date: val?.inspections?.inspection_date ? moment(val?.inspections?.inspection_date).utc().format("MM/DD/YYYY") : null,
            inspection_time: val?.inspections?.inspection_start_time && val?.inspections?.inspection_end_time ? `${moment(val?.inspections?.inspection_start_time).utc().format("hh:mm a")} - ${moment(val?.inspections?.inspection_end_time).utc().format("hh:mm a")}` : null,
            inspector_name: val?.inspections?.inspector_name || "",
            nearest_address: nearest_address,
            original: { ...val },
            loan_id: val._id,
            inspection_finalized: val?.inspections?.inspection_finalized || false
          }

          final.push(body);

        }

        this.inspectionRecords = [...final];

        if (final.length === 0) {
          this.toastr.info(`There is no inspection schedule available for the selected Inspector on ${moment(this.inspector_date).format("MM/DD/YYYY")}`, "No Inspection Schedule");
        }

        this.initialSwitch = true;
        this.loader.stop();
      })
      .catch((error) => {
        this.loader.stop();
      })

  }

  getLatLong(address) {

    const apiKey = environment.googleMap;

    // Build the API request URL
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', address);
    url.searchParams.append('key', apiKey);

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          const location = data.results[0].geometry.location;
          const formatted_address = data.results[0].formatted_address
          return { lat: location.lat, lng: location.lng, address: formatted_address };
        } else {
          throw new Error(`Geocoding failed: ${data.status}`);
        }
      });
  }

  //? add marker for start and finish location
  addMarker(map: google.maps.Map, position: google.maps.LatLng, type) {
    var markerDrag = new google.maps.Marker({
      position: position,
      draggable: false,
    });

    markerDrag.setMap(map);

    if (type == 'start') {
      this.startMarker = markerDrag;
    }

    if (type == 'finish') {
      this.finishMarker = markerDrag;
    }

    this.centreMapToMarkers();
  }

  //? add marker for stop locations
  addStopMarker(map: google.maps.Map, position) {
    var markerDrag = new google.maps.Marker({
      position: position,
      draggable: false,
    });

    markerDrag.setMap(map);

    this.is_optimized = false;
    this.showAllMarkers();
    this.optimizedRouteRenderer.setMap(null);

    this.stopMarkerList.push(markerDrag);

    this.centreMapToMarkers();
  }

  //? center map to marker clusters
  centreMapToMarkers() {
    //create empty LatLngBounds object
    var bounds = new google.maps.LatLngBounds();

    //extend the bounds to include each marker's position
    if (this.startMarker) {
      bounds.extend(this.startMarker.getPosition());
    }

    if (this.finishMarker) {
      bounds.extend(this.finishMarker.getPosition());
    }

    for (let i = 0; i < this.stopMarkerList.length; i++) {

      //extend the bounds to include each marker's position
      bounds.extend(this.stopMarkerList[i].getPosition());

    }

    //now fit the map to the newly inclusive bounds
    this.map.fitBounds(bounds);
  }

  //? remove existing markers on address change
  removeExistingStopMarkers(index) {

    const marker = this.stopMarkerList[index];
    if (marker != undefined) {
      marker.setMap(null);
      this.is_optimized = false;
      this.stopLocationData.splice(index, 1);
      this.stopMarkerList.splice(index, 1);
      this.showAllMarkers();
      this.optimizedRouteRenderer.setMap(null);
    }

  }

  //? on optimize button click
  optimizeRoutes() {
    const waypoints = [];
    if (this.startLocationData === null) {
      this.toastr.error("Please add a start location.", "Validation Error");
      return false;
    }

    if (this.finishLocationData === null) {
      this.toastr.error("Please add a finish location.", "Validation Error");
      return false;
    }


    this.stopLocationData.forEach((value) => {
      waypoints.push({
        location: { lat: value.latitude, lng: value.longitude },
        stopover: true
      })
    })


    this.loader.start();
    this.calculateOptimizedRoute(this.optimizedRouteService, waypoints).then((response) => {
      this.loader.stop();
      this.hideAllMarkers();
      //? remove overview_path to decrease payload size
      // delete response.routes[0].overview_path;
      this.waypoints_order = response.routes[0].waypoint_order;
      this.overview_polyline = response.routes[0].overview_polyline;
      this.bounds = response.routes[0].bounds;
      this.optimizedRouteRenderer.setDirections(response);
      this.optimizedRouteRenderer.setMap(this.map);
      this.is_optimized = true;

      this.waypoints_order.forEach((element, index) => {
        this.inspectionRecords[element].order = index;
      });

      this.inspectionRecords.sort((a, b) => {
        return a.order - b.order;
      });

    }).catch((status) => {
      this.loader.stop();
      this.toastr.error("Directions request failed due to " + status, "Operation Failed");
    });


  }

  //? calculating route
  calculateOptimizedRoute(directionsService: google.maps.DirectionsService, waypoints: Array<any>): Promise<any> {
    const data = {
      origin: { lat: this.startLocationData.latitude, lng: this.startLocationData.longitude },
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    if (this.finishLocation === 'none' && waypoints.length === 1) {
      data["destination"] = waypoints[0].location;
    } else if (this.finishLocation === 'none' && waypoints.length > 1) {
      const position = waypoints[waypoints.length - 1].location;
      data["destination"] = position;
      waypoints.splice(waypoints.length - 1, 1);
      data["waypoints"] = waypoints;
    } else if (this.finishLocation === 'custom') {
      data["destination"] = { lat: this.finishLocationData.latitude, lng: this.finishLocationData.longitude };
    }

    if (waypoints.length > 0 && this.finishLocation === 'custom') {
      data["waypoints"] = waypoints;
    }


    return new Promise((resolve, reject) => {
      directionsService.route(
        data,
        (response, status) => {
          if (status === "OK") {
            resolve(response)
          } else {
            reject(status);
          }
        }
      );
    })
  }

  //? hide all plotted markers when optimized route is displayed
  hideAllMarkers() {
    if (this.finishMarker) {
      this.finishMarker.setVisible(false);
    }
    if (this.startMarker) {
      this.startMarker.setVisible(false);
    }

    this.stopMarkerList.map((marker) => {
      if (marker) {
        marker.setVisible(false);
      }
    });
  }

  //? show all plotted markers when optimized route is removed
  showAllMarkers() {
    if (this.finishMarker) {
      this.finishMarker.setVisible(true);
    }
    if (this.startMarker) {
      this.startMarker.setVisible(true);
    }

    this.stopMarkerList.map((marker) => {
      if (marker) {
        marker.setVisible(true);
      }
    });
  }

  //? on clear button click
  clearData() {
    this.stopForm.reset();

    this.resetFormOnInitialChange();

    const inspector = <HTMLInputElement>document.getElementById('inspector_id');
    inspector.value = '';

    this.inspector_id = "";
    this.inspector_date = null;

  }

  resetFormOnInitialChange() {
    if (this.finishMarker) {
      this.finishMarker.setMap(null);
      this.finishMarker = null;
    }
    if (this.startMarker) {
      this.startMarker.setMap(null);
      this.startMarker = null;
    }

    const start = <HTMLInputElement>document.getElementById('startLocation');
    start.value = '';

    const finish = <HTMLInputElement>document.getElementById('finishLocationAddress');
    finish.value = '';


    this.stopMarkerList.map((marker) => {
      if (marker) {
        marker.setMap(null);
      }
    });

    this.stopMarkerList = [];
    this.startLocationData = null;
    this.finishLocationData = null;
    this.stopLocationData = [];
    this.finishLocation = 'custom';
    this.is_optimized = false;

    this.optimizedRouteRenderer.setMap(null);

    this.inspectionRecords = [];
  }

  getInspectorID(event) {
    this.inspector_id = event.target.value;

    this.resetFormOnInitialChange();
  }

  getInspectorDate(event) {
    this.inspector_date = event.target.value;

    this.resetFormOnInitialChange();
  }


  createGoogleMapsDirectionURLUsingAddress(addresses) {
    // Base URL for Google Maps directions
    const baseURL = 'https://www.google.com/maps/dir/';

    // Function to format each address for URL compatibility
    function formatAddress(value) {
      return value.address.replace(/ /g, '+').replace(/\//g, '%2F');
    }

    // Map each address to its URL-compatible format and join them
    const route = addresses.map(formatAddress).join('/');

    // Concatenate the base URL with the route
    const fullURL = `${baseURL}${route}`;

    return fullURL;
  }

  createGoogleMapsDirectionURL(locations) {
    // Base URL for Google Maps directions
    const baseURL = 'https://www.google.com/maps/dir/';

    // Function to format an address or latitude/longitude pair for URL compatibility
    function formatLocation(location) {
      return `${location.latitude},${location.longitude}`;
    }

    // Extract origin, waypoints (excluding last), and destination
    const origin = formatLocation(locations[0]);
    const waypoints = locations.map(formatLocation).join('/');
    const destination = formatLocation(locations[locations.length - 1]);


    const fullURL = `${baseURL}${waypoints}`
    return fullURL;
  }

  getDate(val) {
    if (val) {
      return moment(val).utc().format("MM-DD-YYYY");
    }
    return "N/A";
  }

  navigate = () => {

    this.waypoints_order.forEach((element, index) => {
      this.stopLocationData[element].order = index;
    });

    this.stopLocationData.sort((a, b) => {
      return a.order - b.order;
    });

    const addresses = [];

    addresses.push({
      "address": this.startLocationData.address,
      "latitude": this.startLocationData.latitude,
      "longitude": this.startLocationData.longitude
    })

    this.stopLocationData.map(x => {
      addresses.push(x);
    })

    addresses.push({
      "address": this.finishLocationData.address,
      "latitude": this.finishLocationData.latitude,
      "longitude": this.finishLocationData.longitude
    });

    const url = this.createGoogleMapsDirectionURL(addresses);
    // window.open(url, "_blank");
    return url
  };

  openNavigateLink() {
    window.open(this.navigation_url, "_blank");
  }


  sendSMS(content) {

    let inspector = this.inspectorList.find(x => x._id === this.inspector_id);

    this.inspector_phone = inspector?.phone || "";

    let url = this.navigate();

    this.navigation_url = url;

    let sms_body = `Hello Inspector,\n
To access the step-by-step navigation, please click on the link provided below:\n
${this.navigation_url}\n
Thankyou
Team CQ Servicing`;

    //Open Modal
    this.modalService.open(content, { size: "md", centered: true, keyboard: false, backdrop: 'static' }).result
      .then(
        (result) => {

          const body = {
            "body": sms_body,
            "phone": environment.country_code + this.inspector_phone.trim().replace(/\D/g, '')
          }

          this.loader.start();

          this.smsApi.sensSMS(body)
            .then((res) => {
              this.loader.stop();
              this.toastr.success("SMS sent successfully.", "Request Successful");
            })
            .catch(error => {
              this.toastr.error(error, "Something went wrong");
              this.loader.stop();
            })

        }).catch(error => {
          this.loader.stop();

        })

  }

  openEditInspectionModal(content, item) {
    this.inspection_type = item.type;

    this.selected_item = item?.original;

    if (this.selected_item && this.inspection_type === 'Budget Verification') {

      this.inspection_date = this.selected_item?.budget_verification?.info?.inspection_date ? this.selected_item?.budget_verification?.info?.inspection_date.split('T')[0] : undefined;
      this.inspection_start_time = this.selected_item?.budget_verification?.info?.inspection_start_time ? moment.utc(this.selected_item?.budget_verification?.info?.inspection_start_time).format("HH:mm") : undefined;
      this.inspection_end_time = this.selected_item?.budget_verification?.info?.inspection_end_time ? moment.utc(this.selected_item?.budget_verification?.info?.inspection_end_time).format("HH:mm") : undefined;
    }

    if (this.selected_item && this.inspection_type === 'Draws') {
      this.inspection_date = this.selected_item?.draws?.inspection?.inspection_date ? this.selected_item?.draws?.inspection?.inspection_date.split('T')[0] : undefined;
      this.inspection_start_time = this.selected_item?.draws?.inspection?.inspection_start_time ? moment.utc(this.selected_item?.draws?.inspection?.inspection_start_time).format("HH:mm") : undefined;
      this.inspection_end_time = this.selected_item?.draws?.inspection?.inspection_end_time ? moment.utc(this.selected_item?.draws?.inspection?.inspection_end_time).format("HH:mm") : undefined;
    }

    if (this.selected_item && this.inspection_type === 'Inspection') {
      this.inspection_date = this.selected_item?.inspections?.inspection_date ? this.selected_item?.inspections?.inspection_date.split('T')[0] : undefined;
      this.inspection_start_time = this.selected_item?.inspections?.inspection_start_time ? moment.utc(this.selected_item?.inspections?.inspection_start_time).format("HH:mm") : undefined;
      this.inspection_end_time = this.selected_item?.inspections?.inspection_end_time ? moment.utc(this.selected_item?.inspections?.inspection_end_time).format("HH:mm") : undefined;
    }

    this.modalService.open(content, { size: "md", centered: true, keyboard: false, backdrop: 'static' }).result.then(
      (form) => {
        if(this.inspection_type === 'Budget Verification') {
          this.updateBudgetInspectionTime(form);
        }
    
        if(this.inspection_type === 'Draws') {
          this.saveDrawsInspection(form);
        }
    
        if(this.inspection_type === 'Inspection') {
          this.saveNormalInspection(form);
        }
      }, (reason) => {
      }
    );

  }

  updateBudgetInspectionTime(form) {

    let inspection = this.selected_item?.budget_verification?.info;

    let _body = {
      inspection_date: form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + "T00:00:00.000Z" : undefined,
      inspection_start_time: form?.inspection_start_time && form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + `T${form?.inspection_start_time}:00.000Z` : undefined,
      inspection_end_time: form?.inspection_end_time && form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + `T${form?.inspection_end_time}:00.000Z` : undefined,
    };

    let _previousBody = {
      inspection_date: inspection?.inspection_date || undefined,
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
      loan_id: this.selected_item._id,
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
        this.getInspectorSchedule();
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

  saveDrawsInspection(form) {

    var body = {
      loan_id: this.selected_item._id,
      draw_id: this.selected_item.draws._id,
      inspection: {
        vendor_id: this.selected_item.draws?.inspection?.vendor_id,
        vendor_name: this.selected_item.draws?.inspection?.vendor_name,
        inspection_approval_date: this.selected_item.draws?.inspection?.inspection_approval_date,
        status: this.selected_item.draws?.inspection?.status,
        inspection_time: this.selected_item.draws?.inspection?.inspection_time,
        inspection_date: form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + "T00:00:00.000Z" : undefined,
        inspection_start_time: form?.inspection_start_time && form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + `T${form?.inspection_start_time}:00.000Z` : undefined,
        inspection_end_time: form?.inspection_end_time && form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + `T${form?.inspection_end_time}:00.000Z` : undefined,
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
        this.getInspectorSchedule();
        this.toastr.success("Inspection Time updated successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })

  }

  saveNormalInspection(form) {

    const body = {
      "inspector_id": this.selected_item.inspections.inspector_id,
      inspector_name: this.selected_item.inspections.inspector_name,
      inspection_date: form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + "T00:00:00.000Z" : undefined,
      inspection_start_time: form?.inspection_start_time && form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + `T${form?.inspection_start_time}:00.000Z` : undefined,
      inspection_end_time: form?.inspection_end_time && form?.inspection_date ? moment(form.inspection_date).format("YYYY-MM-DD") + `T${form?.inspection_end_time}:00.000Z` : undefined,
      "loan_id": this.selected_item._id,
      "_id": this.selected_item.inspections._id
    }

    this.loader.start();

    this.inspectorScheduleApi.updateInspection(body)
      .then((res) => {
        this.getInspectorSchedule();
        this.toastr.success("Inspection Time updated successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })

  }

  finalizeDateTime(content, item) {
    this.inspection_type = item.type;

    this.selected_item = item?.original;

    this.modalService.open(content, { size: "md", centered: true, keyboard: false, backdrop: 'static' }).result.then(
      (form) => {
        if(this.inspection_type === 'Budget Verification') {
          this.finalizeBudgetInspectionTime();
        }
    
        if(this.inspection_type.includes('Draw')) {
          this.finalizeDrawsInspectionTime();
        }
    
        if(this.inspection_type === 'Inspection') {
          this.finalizeNormalInspectionTime();
        }
      }, (reason) => {
      }
    );
  }

  finalizeBudgetInspectionTime() {

    let body = {
      loan_id: this.selected_item._id,
      inspection_finalized: true
    };

    this.loader.start();
    this.budgetVerificationApi.updateBasicData(body)
      .then(async (res) => {
        // this.loader.stop();
        this.getInspectorSchedule();
        this.toastr.success("Inspection Date/Time finalized successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })
  }

  finalizeDrawsInspectionTime() {

    var body = {
      loan_id: this.selected_item._id,
      draw_id: this.selected_item.draws._id,
      inspection: {
        vendor_id: this.selected_item.draws?.inspection?.vendor_id,
        vendor_name: this.selected_item.draws?.inspection?.vendor_name,
        inspection_approval_date: this.selected_item.draws?.inspection?.inspection_approval_date,
        status: this.selected_item.draws?.inspection?.status,
        inspection_time: this.selected_item.draws?.inspection?.inspection_time,
        inspection_date: this.selected_item.draws?.inspection?.inspection_date,
        inspection_start_time: this.selected_item.draws?.inspection?.inspection_start_time,
        inspection_end_time: this.selected_item.draws?.inspection?.inspection_end_time,
        inspection_finalized: true
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
        this.getInspectorSchedule();
        this.toastr.success("Inspection Date/Time finalized successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })

  }

  finalizeNormalInspectionTime() {

    const body = {
      "inspector_id": this.selected_item.inspections.inspector_id,
      inspector_name: this.selected_item.inspections.inspector_name,
      inspection_date: this.selected_item.inspections?.inspection_date,
      inspection_start_time: this.selected_item.inspections?.inspection_start_time,
      inspection_end_time: this.selected_item.inspections?.inspection_end_time,
      "loan_id": this.selected_item._id,
      "_id": this.selected_item.inspections._id,
      inspection_finalized: true
    }

    this.loader.start();

    this.inspectorScheduleApi.updateInspection(body)
      .then((res) => {
        this.getInspectorSchedule();
        this.toastr.success("Inspection Date/Time finalized successfully.", "Request Successful");
      })
      .catch((error) => {
        this.loader.stop();
        this.toastr.error(error, "Something went wrong");
      })

  }

}
