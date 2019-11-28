import { Component, OnInit, Input } from '@angular/core';
import { Item } from "../item";

@Component({
  selector: 'app-items-collected',
  templateUrl: './items-collected.component.html',
  styleUrls: ['./items-collected.component.css']
})
export class ItemsCollectedComponent implements OnInit {
  @Input() item: Item;
  
  constructor() { }

  ngOnInit() {
  }

}
