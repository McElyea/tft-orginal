import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  basicItems: Item[] = [];
  collectedItems: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(): void {
    let allItems = this.itemService.getItems();
    for(let i = 1; i<= 9; i++){
      this.basicItems.push(allItems.find(item => item.id === i));
    }      
      
  }

  onSelect(item: Item): void { 
      this.collectedItems.push(item);  
  }

  removeCollectedItem(item: Item): void {
    let index = this.collectedItems.indexOf(item);
    this.collectedItems.splice(index,1); 
  }

}