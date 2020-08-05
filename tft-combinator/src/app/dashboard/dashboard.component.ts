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
    const itemIndex = this.collectedItems.indexOf(item);
    this.collectedItems.splice(itemIndex, 1);
    const itemIdIndex = this.collectedItemIds.indexOf(item.id);
    this.collectedItemIds.splice(itemIdIndex, 1);
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
    this.potentialCompositeItemIds = this.getUniqueCompositeIdsFromItemIds(this.collectedItemIds);
    this.potentialCompositeItems = this.getCompositeItemsFromIds(this.potentialCompositeItemIds);
  }

  getCompositeItemsFromIds(itemIds: number[]): Item[]{
    const returnItems: Item[] = [];
    for (const itemId of itemIds){
      returnItems.push(this.getItemById(itemId));
    }
    return returnItems;
  }

  getComponentItemsFromIds(itemIds: number[]): Item[]{
    const returnItems = [];
    for (const itemId of itemIds){
      returnItems.push(this.getItemById(itemId));
    }
    return returnItems;
  }
  getUniqueCompositeIdsFromItemIds(itemIds: number[]): number[] {
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

  updateCombinations(): void {
    this.itemCombinations = [];
    this.itemCombinationIds = [];
    if (this.collectedItems.length < 2) {
      return;
    }
    this.updateCurrentPotentialCompositeItems();
    this.iterateCombinations(this.collectedItemIds.filter(isComponentItem), []);
    // this.makeCombinationsUnique();
    // this.updateItemCombinations();
  }

  makeCombinationsUnique() {

    const workingCombinations: number[][] = [];
    for (const itemComboIds of this.itemCombinationIds){
      const componentItems = itemComboIds.filter(isComponentItem);
      const numberOfComponents = componentItems.length || 0;
      if (numberOfComponents === 0
        || numberOfComponents === 1 && itemComboIds.length > 2
        || numberOfComponents < 2 ){
        const itemIds = cloneArray(itemComboIds);
        itemIds.sort((a, b) => b - a);
        if (!workingCombinations.includes(itemIds)){
          workingCombinations.push(itemIds);
        }
      }
    }
    this.itemCombinationIds = workingCombinations;
  }

  updateItemCombinations(): void{
    this.itemCombinations = [];
    const combos: number[][] = cloneArray(this.itemCombinationIds);
    const icIdsLength = combos.length;
    if (icIdsLength === 0) { return ; }
    for (let i = 0; i < icIdsLength; i++){
      const itemCombo = combos[i];
      const itemComboLength = itemCombo.length;
      const items: Item[] = [];
      for (let j = 0; j < itemComboLength; j++){
        const itemId: number = itemCombo[j];
        items.push(this.getItemById(itemId));
      }
      this.itemCombinations.push(items);
    }
  }

  iterateCombinations(collectedComponentItemIds: number[], head: number[]): void {
    const componentIds = cloneArray(collectedComponentItemIds);
    const uniqueCompositeIds = this.getUniqueCompositeIdsFromItemIds(componentIds);
    for (const currentCompositeItemId of uniqueCompositeIds){
      const remainingComponentItemIds = this.removeComponentsSpentByCompositeItemCreation(componentIds, currentCompositeItemId);
      const itemIdsToBePushed = [];
      const remainderComponents = [];
      const componentItems = collectedComponentItemIds.filter(isComponentItem);
      const numberOfComponents = componentItems.length || 0;
      if (numberOfComponents === 0
        || numberOfComponents === 1 && collectedComponentItemIds.length > 2
        || numberOfComponents < 2 ){
        const itemIds = cloneArray(collectedComponentItemIds);
        itemIds.sort((a, b) => b - a);

      }
      itemIdsToBePushed.push(currentCompositeItemId);
      for (const rcii of remainingComponentItemIds) {
        itemIdsToBePushed.push(rcii);
        if (remainingComponentItemIds.length >= 2){
          head.push(currentCompositeItemId);
          remainderComponents.push(rcii);
        }
      }
      this.itemCombinationIds.push(itemIdsToBePushed);
      for (const itemIds of head){
        itemIdsToBePushed.push(itemIds);
      }
      if (remainderComponents.length > 2){
        this.iterateCombinations(remainderComponents, head);
      }

    }
  }

  removeComponentsSpentByCompositeItemCreation(collectedComponentItemIds: number[], itemId: number): number[]{
    const transformedComponentItemIds = cloneArray(collectedComponentItemIds);
    const itemTensDecimalPlace = Math.floor(itemId / 10);
    const itemOnesDecimalPlace = itemId % 10;
    const itemInitemTensIndex = transformedComponentItemIds.indexOf(itemTensDecimalPlace);
    transformedComponentItemIds.splice(itemInitemTensIndex, 1);
    const itemInitemOnesIndex = transformedComponentItemIds.indexOf(itemOnesDecimalPlace);
    transformedComponentItemIds.splice(itemInitemOnesIndex, 1);
    return transformedComponentItemIds;
  }

}

function cloneArray(arr: any[]) {
  const returnArray = [];
  for (const item of arr){
    returnArray.push(item);
  }
  return returnArray;
}

function isComponentItem(element: number, index, array){
  return element < 10;
}

function isEven(n: number): boolean{
  return n % 2 === 0;
}
