import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  allItems: { [key: number]: Item } = {};
  collectedItemIds: number[] = [];
  potentialCompositeItemIds: number[] = [];
  itemCombinationIds: number[][] = [];

  // These are used by the HTML
  allComponentItems: Item[] = [];
  collectedItems: Item[] = [];
  potentialCompositeItems: Item[] = [];
  itemCombinations: Item [][] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.loadAllItems();
    this.loadAllComponentItems();
  }

  loadAllItems(): void {
    const items = this.itemService.getItems();
    for (const item of items){
      this.allItems[item.id] = item;
    }
  }

  loadAllComponentItems(): void {
    this.allComponentItems = [];
    for (let i = 1; i <= 9; i++) {
      this.allComponentItems.push(this.allItems[i]);
    }
  }

  addComponentItem(item: Item): void {
    this.pushItemToCollectedItems(item);
    this.updateCraftableItems();
  }

  addCompositeItem(item: Item): void {
    this.pushItemToCollectedItems(item);
    const itemFirstDigit = Math.floor(item.id / 10);
    const itemSecondDigit = item.id % 10;
    const newItem1 = this.getItemById(itemFirstDigit);
    const newItem2 = this.getItemById(itemSecondDigit);
    this.removeCollectedItem(newItem1);
    this.removeCollectedItem(newItem2);
  }

  removeCollectedItem(item: Item): void {
    if (item.id > 9) {
      const itemFirstDigit = Math.floor(item.id / 10);
      const itemSecondDigit = item.id % 10;
      const newItem1 = this.getItemById(itemFirstDigit);
      const newItem2 = this.getItemById(itemSecondDigit);
      this.pushItemToCollectedItems(newItem1);
      this.pushItemToCollectedItems(newItem2);
    }
    const index = this.collectedItems.indexOf(item);
    this.collectedItems.splice(index, 1);
    const index2 = this.collectedItemIds.indexOf(item.id);
    this.collectedItemIds.splice(index2, 1);
    this.updateCraftableItems();
  }

  pushItemToCollectedItems(item: Item){
    this.collectedItems.push(item);
    this.collectedItemIds.push(item.id);
  }

  updateCraftableItems(): void {
    this.updateCurrentPotentialCompositeItems();
    this.updateCombinations();
  }

  updateCurrentPotentialCompositeItems() {
    const collectedComponentItemIds = this.getComponentItemIdsFromCollectedItemIds(this.collectedItemIds);
    this.potentialCompositeItemIds = this.getUniqueCompositeIdsFromComponentIds(collectedComponentItemIds);
    this.potentialCompositeItems = this.getCompositeItemsFromIds(this.potentialCompositeItemIds);
  }

  getCompositeItemsFromIds(itemIds: number[]): Item[]{
    const returnItems: Item[] = [];
    for (const itemId of itemIds){
      returnItems.push(this.getItemById(itemId));
    }
    return returnItems;
  }

  getItemIdsFromItems(items: Item[]): number[]{
    return items.map((x) => x.id);
  }

  getComponentItemsFromIds(itemIds: number[]): Item[]{
    const returnItems = [];
    for (const itemId of itemIds){
      returnItems.push(this.getItemById(itemId));
    }
    return returnItems;
  }
  getUniqueCompositeIdsFromComponentIds(itemIds: number[]): number[] {
    const uniqueCraftableItemIds: number[] = [];
    const max = itemIds.length;
    if (max >= 2) {
      for (let i = 0; i < max; i++) {
        for (let j = i + 1; j < max; j++) {
          let firstId = itemIds[i];
          let secondId = itemIds[j];
          if (firstId > 9 || secondId > 9){
            continue;
          }
          if (firstId > secondId){
            const tempId = secondId;
            secondId = firstId;
            firstId = tempId;
          }
          const newItemId = this.allItems[(firstId * 10 + secondId)].id;
          if (!uniqueCraftableItemIds.includes(newItemId)) {
            uniqueCraftableItemIds.push(newItemId);
          }
        }
      }
    }
    return uniqueCraftableItemIds;
  }

  getItemById(itemId: number): Item{
    return this.allItems[itemId];
  }

  getComponentItemIdsFromCollectedItemIds(collectedItems: number[]): number[] {
    return collectedItems.filter(this.isComponentItemId);
  }

  isComponentItemId(itemId: number, index: any, array: any){
    return(itemId <= 9);
  }

  isCompositeItemId(itemId: number, index: any, array: any){
    return(itemId > 9);
  }

  updateCombinations(): void {
    this.itemCombinations = [];
    if (this.collectedItems.length < 2) {
      return;
    }
    const collectedComponentItemIds = this.collectedItemIds.filter(this.isComponentItemId);

    this.updateCurrentPotentialCompositeItems();
    if (collectedComponentItemIds.length < 2) {
      return;
    }

    this.iterateCombinations(collectedComponentItemIds, []);
    this.makeCombinationsUnique();
    this.updateItemCombinations();
  }

  makeCombinationsUnique() {
    this.itemCombinationIds = [ ...this.itemCombinationIds];
    for (const itemCombinationIds of this.itemCombinationIds){
      const currentItemList = [];
      for (const itemIds of itemCombinationIds){
        currentItemList.push(this.getItemById(itemIds));
      }
      this.itemCombinations.push(currentItemList);
    }
  }

  updateItemCombinations(): void{
    for (const itemCombinationIds of this.itemCombinationIds){
      const currentItemList = [];
      for (const itemIds of itemCombinationIds){
        currentItemList.push(this.getItemById(itemIds));
      }
      this.itemCombinations.push(currentItemList);
    }
  }

  iterateCombinations(collectedComponentItemIds: number[], head: number[]): void {
    const componentIds = cloneArray(collectedComponentItemIds);
    const uniqueCompositeIds = this.getUniqueCompositeIdsFromComponentIds(componentIds);
    for (const currentCompositeItemId of uniqueCompositeIds){
      const remainingComponentItemIds = this.removeComponentsSpentByCompositeItemCreation(componentIds, currentCompositeItemId);
      const possibleItemCombinationIds: number[] = [];
      head.push(currentCompositeItemId);
      possibleItemCombinationIds.push(currentCompositeItemId);
      for (const rcii of remainingComponentItemIds) {
          const newComponentItemToBePushed = this.getItemById(rcii);
          possibleItemCombinationIds.push(newComponentItemToBePushed.id);
        }
      const itemIdsToBePushed = [];
      if (head.length > 0) { itemIdsToBePushed.push(head); }
      for (const rcii of remainingComponentItemIds) {
           itemIdsToBePushed.push(rcii);
        }
      this.itemCombinationIds.push(itemIdsToBePushed);

    }
  }

  removeComponentsSpentByCompositeItemCreation(collectedComponentItemIds: number[], itemId: number): number[]{
    let transformedComponentItemIds = cloneArray(collectedComponentItemIds);
    const itemTensDecimalPlace = Math.floor(itemId / 10);
    const itemOnesDecimalPlace = itemId % 10;
    transformedComponentItemIds = transformedComponentItemIds.splice(itemTensDecimalPlace, 1);
    transformedComponentItemIds = transformedComponentItemIds.splice(itemOnesDecimalPlace, 1);
    return transformedComponentItemIds;
  }

}

function cloneArray(list: any[]) {
  return [...list];
}
