import { Component, OnInit, HostListener, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-breakdown",
  templateUrl: "./breakdown.component.html",
  styleUrls: ["./breakdown.component.scss"],
})
export class BreakDownComponent implements OnInit {

  @Input() white_label_stats:any = [];

  user_role:string ="";
  constructor(){

  }


  ngOnInit(): void {

  }

    // Calculate currency from decimals
    calculateDecimal(val : any) {
      val = Math.abs(val)
      const formatter = new Intl.NumberFormat('en-US');
  
      return formatter.format(val);
    }

     // Calculate currency from decimals
  calculateCurrency(val : any) {
    val = Math.abs(val)
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(val);
  }
}
