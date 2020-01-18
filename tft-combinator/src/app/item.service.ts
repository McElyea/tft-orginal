import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Item } from './item'; 
import { MessageService } from './message.service'; 
import ITEMS  from '../assets/json/items.json';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  constructor(private messageService: MessageService) { }

  getItems(): Item[] { 
    this.messageService.add('ItemService: fetched items'); 

    return ITEMS;
  }

  getItem(id: number): Observable<Item> { 
    this.messageService.add(`ItemService: fetched item id=${id}`); 
    return of(ITEMS.find(item => item.id === id));
  }
}
