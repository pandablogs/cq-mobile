import { Component, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { StaffDashboardAPIService } from "src/app/services/staff/staff.dashboard.api.service";
import { StorageApiService } from "src/app/services/storage.api.service";

declare var markerClusterer: any; // Declare MarkerClusterer globally

@Component({
  selector: "app-heatmap",
  templateUrl: "./heatmap.component.html",
  styleUrls: ["./heatmap.component.scss"],
})
export class HeatMapComponent implements OnInit {
  @ViewChild('locationModal') locationModal : ElementRef; 
  map: any;
  heatmap: any;
  markerCluster:any;
  heatMapData: any = [];
  showMarks: boolean = false;
  showHeatmap:boolean = true
  markers: any = [];
  currentView: string = "roadmap";
  allLocationData:any = [];
  selectedLocation : any;
  constructor(
    private staffDashboardAPIService: StaffDashboardAPIService,
    private storageApi: StorageApiService,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.getLoanLocations();
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.loadHeatMap();
    // }, 2000);
  }

  getLoanLocations (){
    this.loader.start();
    this.staffDashboardAPIService.getDashboardMapLocations().then((response)=>{
      if(response.length){
        this.allLocationData = response || [];
        this.heatMapData = response.filter(x=> x.lat &&  x?.lng).map((x) => {
         return new google.maps.LatLng(x?.lat , x?.lng );
        });
        console.log( response.filter(x=> x.lat &&  x?.lng));
        
        setTimeout(() => {
          this.loadHeatMap();
        }, 200);
      }
      this.loader.stop();
    }).catch((error)=>{
      this.loader.stop();
      this.toastr.error(error);
    })
  }

  loadHeatMap() {
    var styles: any = [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            lightness: 100,
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
    ];

    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },  // Placeholder until bounds are calculated
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles,
      mapTypeControl: true,
      zoomControl: true,
      streetViewControl: false, // Disable street view control
      fullscreenControl: false, // Disable full-screen control
    });

     // Fit the map to the bounds of these points
     // Create a LatLngBounds object to calculate the best map bounds
     const bounds = new google.maps.LatLngBounds();

     // Extend the bounds to include all the heatmap data points
     this.heatMapData.forEach(location => {
       bounds.extend(location);
     });
     this.map.fitBounds(bounds);

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatMapData,
      map:this.map
    });

    this.heatmap.set("radius", 20); // Adjust radius if needed
    this.heatmap.set("opacity", 0.8); // Adjust opacity if needed
    this.heatmap.setMap(this.map);
    google.maps.event.trigger(this.map, 'resize');
  }

  setMapView(view) {
    this.currentView = view;
    if (view == "roadmap") {
      this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    } else if (view == "satellite") {
      this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    }
  }

  showMarkers() {
    const map = this.map;

    this.showMarks = !this.showMarks;
    this.showHeatmap = !this.showHeatmap;

    if (this.showMarks) {
      this.showHeatmap = false;
      this.heatmap.setMap(null);
      this.heatMapData.forEach((location) => {
        const marker = new google.maps.Marker({
          position: location,
          map: map,
          title: "Marker at " + location.toString(),
          icon: {
            url: 'assets/map-marker.png', // Path to your custom marker image
            scaledSize: new google.maps.Size(50, 50), // Adjust the size (reduce if needed)
            anchor: new google.maps.Point(15, 15), // Adjust anchor to center the marker image
          }
        });

        marker.addListener('click', () => {
          this.openModal(location);  // Call the function to open the modal
        });
      
        this.markers.push(marker);
      });

      this.markerCluster = new markerClusterer.MarkerClusterer({ markers:this.markers, map :this.map});
    } else if(this.showHeatmap){
      this.showMarks = false;
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
      this.markers = [];
      this.markerCluster.clearMarkers();
      this.heatmap.setMap(this.map);
    }
  }

  openModal(location): void {
    this.selectedLocation = this.allLocationData.find((x) => (x.lat == location?.lat() && x.lng == location?.lng()));
    this.modalService.open(this.locationModal, {size:'lg' ,centered: true });  // Open the modal
  }

  navigateButton(item, tab?) {
    this.modalService.dismissAll();
    this.router.navigate([`application-pipeline/detail/${item._id}`])
  }
}
