import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unfound-pages',
  templateUrl: './unfound-pages.component.html',
  styleUrls: ['./unfound-pages.component.css']
})
export class UnfoundPagesComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

}
