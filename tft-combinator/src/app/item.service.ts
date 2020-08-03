import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Item } from './item';
import ITEMS from '../assets/json/items.json';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  constructor() { }

  getItems(): Item[] {

    return ITEMS;
  }

  getItem(id: number): Observable<Item> {
    return of(ITEMS.find(item => item.id === id));
  }
}
