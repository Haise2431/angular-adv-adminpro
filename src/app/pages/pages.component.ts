import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

declare function customInitFuncitones() : any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  

  constructor() { }

  ngOnInit(): void {
    //customInitFuncitones();

  }

}
