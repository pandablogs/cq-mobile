import { Component, OnInit } from '@angular/core';

import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  isChecked: boolean = false;
  activeTab: string= "All";

  tabLists = [
    {
      tabName:'All'
    },
    {
      tabName:'Breakdown'
    },
    {
      tabName:'Calendar'
    },
    {
      tabName:'Inspection'
    },
    {
      tabName:'Schedules'
    },
    {
      tabName:'Draws'
    },
    {
      tabName:'Insurance'
    },
    {
      tabName:'Map'
    }
  ]

  scrollLeft() {
    const scrollContainer:any = document.querySelector('#mainContainer') as HTMLElement;
    scrollContainer.scrollBy({ left: -100, behavior: 'smooth' }); // Scroll left by 100px
  }
  
  scrollRight() {
    const scrollContainer:any = document.querySelector('#mainContainer') as HTMLElement;
    scrollContainer.scrollBy({ left: 100, behavior: 'smooth' }); // Scroll right by 100px
  }

  constructor() { }
  ngOnInit(): void {

  }

  ngAfterInit(){
    

  }
  doCheck() {
    let html = document.getElementsByTagName('html')[0];
    this.isChecked = !this.isChecked;
    if (this.isChecked == true) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }

  changeActiveTab(tab:any,event:any){
    this.activeTab = tab;
    const element : any = event.target as HTMLElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

}
