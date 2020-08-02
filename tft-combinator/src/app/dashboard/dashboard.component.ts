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
  allComponentItems: Item[] = [];
  collectedItems: Item[] = [];
  potentialCompositeItems: Item[] = [];
  potentialCompositeItemIds: number[] = [];
  itemCombinationIds: number[][] = [];
  itemCombination: Item [][] = [];


  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getAllItems();
    this.getAllComponentItems();
  }

  getAllItems(): void {
    this.allItems = this.itemService.getItems();
  }

  getAllComponentItems(): void {
    this.allComponentItems = [];
    for (let i = 1; i <= 9; i++) {
      this.allComponentItems.push(this.allItems.find(item => item.id === i));
    }
  }

  addCollectedItem(item: Item): void {
    this.collectedItems.push(item);
    this.updateCraftableItems();
  }

  addCraftedItem(item: Item): void {
    this.collectedItems.push(item);
    const itemFirstDigit = Math.floor(item.id / 10);
    const itemSecondDigit = item.id % 10;
    const newItem1 = this.getComponentItemById(itemFirstDigit);
    const newItem2 = this.getComponentItemById(itemSecondDigit);
    this.removeCollectedItem(newItem1);
    this.removeCollectedItem(newItem2);
  }

  removeCollectedItem(item: Item): void {
    const index = this.collectedItems.indexOf(item);
    if (item.id > 9) {
      const itemFirstDigit = Math.floor(item.id / 10);
      const itemSecondDigit = item.id % 10;
      const newItem1 = this.getComponentItemById(itemFirstDigit);
      const newItem2 = this.getComponentItemById(itemSecondDigit);
      this.collectedItems.push(newItem1);
      this.collectedItems.push(newItem2);
    }
    this.collectedItems.splice(index, 1);
    this.updateCraftableItems();
  }

  updateCraftableItems(): void {
    this.potentialCompositeItemIds = this.getUniqueCompositeItemIds(this.collectedItems.map((x) => x.id));
    this.updateCombinations();
  }

  getUniqueCompositeItemIds(itemIds: number[]): number[] {
    const uniqueCraftableItemIds: number[] = [];
    const max = itemIds.length;
    if (max >= 2) {
      for (let i = 0; i < max; i++) {
        for (let j = i + 1; j < max; j++) {
          const firstId = itemIds[i];
          const secondId = itemIds[j];
          if (firstId > 9 || secondId > 9) {
            continue;
          }
          const newItemId = this.getCompositeItemId(firstId, secondId);
          if (!uniqueCraftableItemIds.includes(newItemId)) {
            uniqueCraftableItemIds.push(newItemId);
          }
        }
      }
    }
    return uniqueCraftableItemIds;
  }

  findItemById(itemId: number): Item{
    return this.allItems.find(item => item.id === itemId);
  }

  getComponentItemIdsFromItemList(collectedItemsList: number[]): number[] {
    const collectedComponentItemIds: number[] = [];
    for (const cil of collectedItemsList) {
      const thisItemId = cil;
      if (thisItemId <= 9) {
        collectedComponentItemIds.push(thisItemId);
      }
    }
    return collectedComponentItemIds;
  }

  updateCombinations(): void {
    this.itemCombination = [];
    if (this.collectedItems.length < 2) {
      return;
    }
    const collectedComponentItemIds = this.getComponentItemIdsFromItemList(
      this.collectedItems.map((x) => x.id)
    );

    if (collectedComponentItemIds.length < 2) {
      return;
    }

    this.iterateCombinations(collectedComponentItemIds, []);
  }

  iterateCombinations(collectedComponentItemIds: number[], head: number[]): void {
    const currentCraftableList = this.getComponentItemIdsFromItemList(collectedComponentItemIds);
    const currentCraftableListLength = currentCraftableList.length;

    for (let i = 0; i < currentCraftableListLength; i++) {
      const currentSelectedItemId = currentCraftableList[i];
      const itemFirstDigit = Math.floor(currentSelectedItemId / 10);
      const itemSecondDigit = currentSelectedItemId % 10;

      const remainingComponentItemIds = this.removeComponentsSpentByCompositeItemCreation(
        collectedComponentItemIds, itemFirstDigit, itemSecondDigit
      );
      const possibleItemCombinationIds: number[] = [];
      possibleItemCombinationIds.push(currentSelectedItemId);
      if (remainingComponentItemIds.length >= 2){
        head.push(currentSelectedItemId);
        this.iterateCombinations(remainingComponentItemIds, head);
      }
      else{
        for (const rcii of remainingComponentItemIds) {
          const newComponentItemToBePushed = this.getComponentItemById(rcii);
          possibleItemCombinationIds.push(newComponentItemToBePushed.id);
        }
        this.itemCombinationIds.push(possibleItemCombinationIds);
      }
    }
  }

  removeComponentsSpentByCompositeItemCreation(collectedComponentItemIds: number[], itemFirstDigit: number, itemSecondDigit: number) {
    const tempComponentItemList = cloneArray(collectedComponentItemIds);
    const index1 = tempComponentItemList.indexOf(this.getComponentItemById(itemFirstDigit).id);
    tempComponentItemList.splice(index1, 1);
    const index2 = tempComponentItemList.indexOf(this.getComponentItemById(itemSecondDigit).id);
    tempComponentItemList.splice(index2, 1);
    return tempComponentItemList;
  }

  getComponentItemById(id: number): Item {
    return this.allComponentItems[id - 1];
  }

  getCompositeItemId(firstId: number, secondId: number): number {
    if (firstId > secondId) {
      const tempId = secondId;
      secondId = firstId;
      firstId = tempId;
    }
    return firstId * 10 + secondId;
  }
}
function removeItemFromList(list: any[], itemToRemove: any) {
  const newList = cloneArray(list);
  const id = newList.findIndex(itemToRemove);
  return list.splice(id, 1);
}

function cloneArray(list: any[]) {
  const tempList = [];
  for (const item of list){
    tempList.push(item);
  }
  return tempList;
}
