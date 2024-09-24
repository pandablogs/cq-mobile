import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  navItems:any = [
    {
      title:'Dashboard',
      route:'/dashboard'
    },
    {
      title:'Pipeline',
      route:'/pipeline'
    },
    {
      title:'CRM',
      childRoots:[
        {
          title:'Dashboard',
          route : '/crm/dashboard'
        },
        {
          title:'Leads',
          route:'/crm/leads'
        },
        {
          title:'Calender',
          route:'/crm/calender'
        },
        {
          title:'Reports',
          route:'/crm/reports'
        },{
          title:'Quick Quotes',
          route:'/crm/quotes'
        }
      ]
    },
    {
      title:'Portfolio',
      route:'/crm/portfolio'
    },
    {
      title:'Resources',
      childRoots:[
        {
          title:'Loan Outreach',
          route : '#'
        },
        {
          title:'Tickets',
          route:'#'
        },
        {
          title:'Broadcast',
          route:'#'
        },
        {
          title:'Inspection Schedule',
          route:'#'
        },{
          title:'Demands',
          route:'#'
        },
        {
          title:'Users',
          subChildRoots: [
            {
              title:'Borrowers',
              route:'#'
            },
            {
              title:'Staff',
              route:'#'
            }
          ]
        },
        {
          title:"What's New",
          route:'#'
        }
      ]
    }
  ]
  
  constructor() { }
  

  ngOnInit(): void {
    
  }
  
  menuclose() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('menu-open');
  }
}
