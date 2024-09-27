import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-staticfooter',
  templateUrl: './staticfooter.component.html',
  styleUrls: ['./staticfooter.component.scss']
})
export class StaticfooterComponent implements OnInit {
  @Output() changeActiveTab: EventEmitter<any> = new EventEmitter();

  @Input() tabLists:any;
  public isVisited = false;
  constructor() { }

  ngOnInit(): void {
  }

  checkVisited(){
    this.isVisited = !this.isVisited;
  }

  changeTab(tab:any){
    this.changeActiveTab.emit(tab);
  }
}
