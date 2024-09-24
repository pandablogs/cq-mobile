import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swiper, { Navigation, Pagination , Autoplay } from 'swiper';

Swiper.use([Navigation, Pagination , Autoplay]);
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  @ViewChild('swiperRef') swiperRef!: ElementRef;

  constructor(private route:Router) { }

  ngOnInit(): void {
    setTimeout( () => {

        this.route.navigate(['/signin'])
    }, 4000)
  }

  ngAfterViewInit(): void {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true
    });
  }

}
