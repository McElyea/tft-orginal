import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  allItems: Item[] = [];
  allComponentItems: Item[] = [];
  collectedItems: Item[] = [];
  collectedItemIds: number[] = [];
  potentialCompositeItems: Item[] = [];
  potentialCompositeItemIds: number[] = [];
  itemCombinationIds: number[][] = [];
  itemCombinations: Item [][] = [];


  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.loadAllItems();
    this.loadAllComponentItems();
  }

  loadAllItems(): void {
    this.allItems = this.itemService.getItems();
  }

  loadAllComponentItems(): void {
    this.allComponentItems = [];
    for (let i = 1; i <= 9; i++) {
      this.allComponentItems.push(this.allItems.find(item => item.id === i));
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
      this.pushItemToCollectedItems(newItem1);
      this.pushItemToCollectedItems(newItem2);
    }
    this.collectedItems.splice(index, 1);
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
    const collectedComponentItemIds = this.getComponentItemIdsFromItemIds(this.collectedItemIds);
    this.potentialCompositeItemIds = this.getUniqueCompositeItemIds(collectedComponentItemIds);
    this.potentialCompositeItems = this.getCompositeItemsFromIds(this.potentialCompositeItemIds);
  }

  getCompositeItemsFromIds(itemIds: number[]): Item[]{
    const returnItems: Item[] = [];
    for (const itemId of itemIds){
      returnItems.push(this.getCompositeItemById(itemId));
    }
    return returnItems;
  }

  getUniqueCompositeItemIds(itemIds: number[]): number[] {
    const productCompositeItemIds = itemIds.reduce( (acc, v, i) => acc.concat(itemIds.slice(i + 1).map( w => v * 10 + w )), []);
    return productCompositeItemIds.filter((n, i) => productCompositeItemIds.indexOf(n) === i);
  }

  findItemById(itemId: number): Item{
    return this.allItems.find(item => item.id === itemId);
  }

  getComponentItemIdsFromItemIds(collectedItems: number[]): number[] {
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
    const collectedComponentItemIds = this.getComponentItemIdsFromItemIds(
      this.getItemIdsFromItems(this.collectedItems)
    );
    this.updateCurrentPotentialCompositeItems();
    if (collectedComponentItemIds.length < 2) {
      return;
    }

    this.iterateCombinations(collectedComponentItemIds, []);
  }

  getItemIdsFromItems(items: Item[]): number[]{
    return items.map((x) => x.id);
  }

  getComponentItemsFromIds(itemIds: number[]): Item[]{
    const returnItems = [];
    for (const itemId of itemIds){
      returnItems.push(this.getComponentItemById(itemId));
    }
    return returnItems;
  }

  iterateCombinations(collectedComponentItemIds: number[], head: number[]): void {

    for (const currentCompositeItemId of this.collectedItemIds.filter(this.isCompositeItemId)){
      const remainingComponentItemIds =
        this.removeComponentsSpentByCompositeItemCreation(collectedComponentItemIds, currentCompositeItemId);
      const possibleItemCombinationIds: number[] = [];
      possibleItemCombinationIds.push(currentCompositeItemId);
      if (remainingComponentItemIds.length >= 2){
        head.push(currentCompositeItemId);
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

  removeComponentsSpentByCompositeItemCreation(collectedComponentItemIds: number[], itemId: number) {
    const tempComponentItems = cloneArray(collectedComponentItemIds);
    const itemTensDecimalPlace = Math.floor(itemId / 10);
    const itemOnesDecimalPlace = itemId % 10;
    tempComponentItems.splice(itemTensDecimalPlace, 1);
    tempComponentItems.splice(itemOnesDecimalPlace, 1);
    return tempComponentItems;
  }

  getComponentItemById(id: number): Item {
    return this.allComponentItems[id - 1];
  }

  getCompositeItemById(id: number): Item {
    return this.findItemById(id);
  }

  getCompositeItemId(firstId: number, secondId: number): number {
    if (firstId > secondId) {
      const tempId = secondId;
      secondId = firstId;
      firstId = tempId;
    }
    return (firstId * 10 + secondId);
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
