import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  allItems: Item[] = [];
  basicItems: Item[] = [];
  collectedItems: Item[] = [];
  craftableItems: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(): void {
    this.allItems = this.itemService.getItems();
    for(let i = 1; i<= 9; i++){
      this.basicItems.push(this.allItems.find(item => item.id === i));
    }      
      
  }

  addCollectedItem(item: Item): void { 
      this.collectedItems.push(item);
      this.updateCraftableItems();  
  }

  removeCollectedItem(item: Item): void {
    let index = this.collectedItems.indexOf(item);
    if(item.id > 9){      
      let itemFirstDigit = Math.floor(item.id / 10);
      let itemSecondDigit = item.id % 10;      
      let newItem1 = this.basicItems[itemFirstDigit-1];
      let newItem2 = this.basicItems[itemSecondDigit - 1];
      this.collectedItems.push(newItem1);
      this.collectedItems.push(newItem2);
    }
    this.collectedItems.splice(index,1); 
    this.updateCraftableItems(); 
  }

  updateCraftableItems(): void {
    let collectedItemIds: number[] = [];
    for(let i = 0; i < this.collectedItems.length; i++){
      collectedItemIds.push(this.collectedItems[i].id);
    }
    
    this.craftableItems = [];
    let max: number = collectedItemIds.length; 
    if(max >= 2){ 
      for(let i = 0; i < max; i++){
        for(let j = i+1; j < max; j++){
          let firstId = collectedItemIds[i];
          let secondId = collectedItemIds[j];
          if(firstId > 9 || secondId > 9){
            continue;
          }
          if(firstId > secondId)
          {
            let tempId = secondId;
            secondId = firstId;
            firstId = tempId;   
          }
          let newItemId = firstId * 10 + secondId;
          if(!this.craftableItems.find(item => item.id === newItemId)){
            let newItem = this.allItems.find(item => item.id === newItemId);
            this.craftableItems.push(newItem);
          }
        }
      }      
    }
    
  }

  addSelectedCraftedItem(item: Item): void {
    this.collectedItems.push(item);    
    let itemFirstDigit = Math.floor(item.id / 10);
    let itemSecondDigit = item.id % 10;      
    let newItem1 = this.basicItems[itemFirstDigit-1];
    let newItem2 = this.basicItems[itemSecondDigit - 1];
    this.removeCollectedItem(newItem1);
    this.removeCollectedItem(newItem2);
  }
}