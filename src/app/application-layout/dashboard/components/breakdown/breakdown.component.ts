import { Component, OnInit, HostListener, Input, Output, EventEmitter } from "@angular/core";
import { StorageApiService } from "src/app/services/storage.api.service";

@Component({
  selector: "app-breakdown",
  templateUrl: "./breakdown.component.html",
  styleUrls: ["./breakdown.component.scss"],
})
export class BreakDownComponent implements OnInit {

  @Input() white_label_stats:any = [];

  user_role:string ="";
  constructor(private storageApi: StorageApiService){

  }


  ngOnInit(): void {
    this.user_role = this.storageApi.getLoggedInRole();

  }
  checkIfVendor() {
    if (this.user_role.toLowerCase().includes('vendor')) {
      return false;
    }
    return true;
  }

    // Calculate currency from decimals
    calculateDecimal(val) {
      val = Math.abs(val)
      const formatter = new Intl.NumberFormat('en-US');
  
      return formatter.format(val);
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
}
