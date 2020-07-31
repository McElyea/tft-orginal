import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allItems: Item[] = [];
  basicItems: Item[] = [];
  collectedItems: Item[] = [];
  craftableItems: Item[] = [];
  itemCombinations: Item[][] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(): number {
    this.allItems = this.itemService.getItems();
    for (let i = 1; i <= 9; i++) {
      this.basicItems.push(this.allItems.find(item => item.id === i));
    }
    return this.basicItems.length;
  }

  addCollectedItem(item: Item): void {
    this.collectedItems.push(item);
    this.updateCraftableItems();
  }

  addCraftedItem(item: Item): void {
    this.collectedItems.push(item);
    let itemFirstDigit = Math.floor(item.id / 10);
    let itemSecondDigit = item.id % 10;
    let newItem1 = this.getBasicItemById(itemFirstDigit);
    let newItem2 = this.getBasicItemById(itemSecondDigit);
    this.removeCollectedItem(newItem1);
    this.removeCollectedItem(newItem2);
  }

  removeCollectedItem(item: Item): void {
    let index = this.collectedItems.indexOf(item);
    if (item.id > 9) {
      let itemFirstDigit = Math.floor(item.id / 10);
      let itemSecondDigit = item.id % 10;
      let newItem1 = this.getBasicItemById(itemFirstDigit);
      let newItem2 = this.getBasicItemById(itemSecondDigit);
      this.collectedItems.push(newItem1);
      this.collectedItems.push(newItem2);
    }
    this.collectedItems.splice(index, 1);
    this.updateCraftableItems();
  }

  updateCraftableItems(): void {

    this.craftableItems = this.getUniqueCraftableItems(this.collectedItems);
    this.updateCombinations();
  }

  getUniqueCraftableItems(items: Item[]): Item[] {
    let uniqueCraftableItems: Item[] = [];
    let itemIds: number[] = [];
    for (let i = 0; i < items.length; i++) {
      itemIds.push(items[i].id);
    }

    let max: number = itemIds.length;
    if (max >= 2) {
      for (let i = 0; i < max; i++) {
        for (let j = i + 1; j < max; j++) {
          let firstId = itemIds[i];
          let secondId = itemIds[j];
          if (firstId > 9 || secondId > 9) {
            continue;
          }
          let newItemId = this.getCraftedItemId(firstId, secondId)
          if (!uniqueCraftableItems.find(item => item.id === newItemId)) {            
            uniqueCraftableItems.push(this.findItemById(newItemId));
          }
        }
      }
    }
    return uniqueCraftableItems;
  }
  findItemById(itemId: number): Item{
    return this.allItems.find(item => item.id === itemId);
  }
  updateCombinations(): void {
    this.itemCombinations = this.updateListCombinations(this.collectedItems, []);
  }

  updateListCombinations(collectedItemsList: Item[], head: Item[]): Item[][] {    
    if (collectedItemsList.length < 2) {
      return [];
    }
    let collectedBasicItems: number[] = [];
    let collectedCraftedItems: number[] = [];
    for (let i = 0; i < collectedItemsList.length; i++) {
      let thisItemId = collectedItemsList[i].id;
      if (thisItemId > 9) {
        collectedCraftedItems.push(thisItemId);
      }
      else {
        collectedBasicItems.push(thisItemId);
      }
    }

    if (collectedBasicItems.length < 2) {
      return [];
    }

    let remainingCombinations: Item[][] = this.iterateCombinations(collectedBasicItems, this.craftableItems, head);
    for(let i = 0; i < remainingCombinations.length;i++){
      if(remainingCombinations[i].length > 3){
        let newCombos = this.updateListCombinations(remainingCombinations[i], head);
        let craftedItems = head;
        for(let j= 0; j< newCombos.length;j++){
          if(newCombos[j].length > 3){

          }
        }
      }
      else{

      }
    
    }
    return remainingCombinations;     
  }

  private iterateCombinations(collectedBasicItems: number[], craftableItems: Item[], head: Item[]): Item[][] {
    let currentCraftableList = cloneArray(craftableItems);
    let currentCraftableListLength = currentCraftableList.length;
    let combinations: Item[][] = [];
    for (let i = 0; i < currentCraftableListLength; i++) {
      let newItem = currentCraftableList[i];
      let itemFirstDigit = Math.floor(newItem.id / 10);
      let itemSecondDigit = newItem.id % 10;
      let filteredBasicItemList = this.removeCraftingItems(collectedBasicItems, itemFirstDigit, itemSecondDigit);
      let newItemlist: Item[] = [];
      newItemlist.push(newItem);
      
      for (let j = 0; j < filteredBasicItemList.length; j++) {         
        let newBasicItemToBePushed = this.getBasicItemById(filteredBasicItemList[j]);
        newItemlist.push(newBasicItemToBePushed);
        head.push(newItem);
      }
      combinations.push(newItemlist);
    }
    return combinations;
  } 
 
  removeCraftingItems(collectedBasicItems: number[], itemFirstDigit: number, itemSecondDigit: number) { 
    let tempBasicItemList = cloneArray(collectedBasicItems);
    let index1 = tempBasicItemList.indexOf(this.getBasicItemById(itemFirstDigit).id);
    tempBasicItemList.splice(index1, 1);
    let index2 = tempBasicItemList.indexOf(this.getBasicItemById(itemSecondDigit).id);
    tempBasicItemList.splice(index2, 1);
    return tempBasicItemList;
  } 

 
  getBasicItemById(id: number): Item { 
    return this.basicItems[id - 1];
  }

  getCraftedItemId(firstId: number, secondId: number): number {     
    if (firstId > secondId) {
      let tempId = secondId;
      secondId = firstId;
      firstId = tempId;
    }
    let newItemId = firstId * 10 + secondId;
    return newItemId;
  }

}
function removeItemFromList(list: any[], itemToRemove: any) {
  let newList = cloneArray(list);
  let id = newList.findIndex(itemToRemove);
  return list.splice(id,1);
}

function cloneArray(list: any[]) {
  let tempList = [];
  for (let x = 0; x < list.length; x++) {
    tempList.push(list[x]);
  }
  return tempList;
}
