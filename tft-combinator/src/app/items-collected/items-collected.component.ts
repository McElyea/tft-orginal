import { Component, OnInit, Input } from '@angular/core';
import { Item } from "../item";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ItemService }  from '../item.service';
@Component({
  selector: 'app-items-collected',
  templateUrl: './items-collected.component.html',
  styleUrls: ['./items-collected.component.css']
})
export class ItemsCollectedComponent implements OnInit {
  @Input() item: Item;
  
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getItem();
  }
  goBack(): void {
    this.location.back();
  }
  getItem(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.itemService.getItem(id)
      .subscribe(item => this.item = item);
  } 
} 
