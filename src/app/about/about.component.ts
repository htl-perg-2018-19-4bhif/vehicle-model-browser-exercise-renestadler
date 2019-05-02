import { Component, OnInit } from '@angular/core';
import { LoremIpsum } from 'lorem-ipsum';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public loremIpsum = "";

  constructor() {
    const lorem = new LoremIpsum();
    lorem.format = 'html';
    this.loremIpsum = lorem.generateParagraphs(5);
  }

  ngOnInit() {
  }

}
