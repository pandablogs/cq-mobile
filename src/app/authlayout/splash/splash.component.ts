import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  constructor(
    private route:Router
  ) { }

  ngOnInit(): void {
    // setTimeout( () => {
    //   setTimeout( () => {
    //     this.route.navigate(['/landing'])
    //   }, 4000)
    // }, 2000)
  }

}
