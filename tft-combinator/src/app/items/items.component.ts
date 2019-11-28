import { Component, OnInit } from '@angular/core';

import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  selectedItem: Item;

  items: Item[];
  yourItems: Item[] = [];  

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: Item): void {
    this.selectedItem = item;
    this.yourItems.push(item);
  }

   getItems(): void {
    this.itemService.getItems()
        .subscribe(items => this.items = items);
  }
 

}
