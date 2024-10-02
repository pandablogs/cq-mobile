import { Component } from '@angular/core';

@Component({
  selector: 'app-pipeline',
  standalone: false,
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
})
export class PipelineComponent {
  activeTab: string = 'All';
  activeFilter:string = 'status';
  internal_status_list = [
    { name: 'All', count: 1021 },
    { name: 'Lead', count: 4 },
    { name: 'Initial Underwriting', count: 17 },
    { name: 'Underwriting Hold', count: 5 },
    { name: 'Pending Committed', count: 3 },
    { name: 'Committed', count: 14 },
    { name: 'Committed Hold', count: 4 },
    { name: 'Draw Request', count: 0 },
    { name: 'Draw Pending', count: 0 },
    { name: 'Active', count: 317 },
    { name: 'Pay Off Requested', count: 0 },
    { name: 'Pay Off Sent / Pending Closing', count: 0 },
    { name: 'Paid Off', count: 229 },
    { name: 'Archived', count: 393 },
    { name: 'Foreclosed', count: 0 },
    { name: 'Pre-Lead', count: 11 },
    { name: 'REO', count: 22 },
    { name: 'Non-Direct/Broker', count: 2 },
  ];

  whiteLabelList = [
    { label: "Quick Lending, LLC", value: "quick_lending_llc" },
    { label: "Legacy Preferred Lending, LLC", value: "legacy_preferred_lending_llc" },
    { label: "Spark Lending, LLC", value: "spark_lending_llc" },
    { label: "Texas Real Estate Fund I, LP", value: "texas_real_estate_fund_i_lp" }
];


  loanTypeFilter(tab: string, event: any) {
    this.activeTab = tab;
    const element: any = event.target as HTMLElement;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  scrollLeft() {
    const scrollContainer: any = document.querySelector(
      '.type-filters'
    ) as HTMLElement;
    scrollContainer.scrollBy({ left: -100, behavior: 'smooth' }); // Scroll left by 100px
  }

  scrollRight() {
    const scrollContainer: any = document.querySelector(
      '.type-filters'
    ) as HTMLElement;
    scrollContainer.scrollBy({ left: 100, behavior: 'smooth' }); // Scroll right by 100px
  }

  toggleDrawer() {
    const drawer = document.getElementById('filter-side-drawer') as HTMLElement;
    drawer.classList.toggle('open');
  }

  changeFilterCreiteria(tab:any){
    this.activeFilter = tab;
  }
}
