import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the all items with all 54 composite and component items', () => {
    expect(component.allItems.length).toEqual(54);
  });

  it('should load the component items with 9 items', () => {
    expect(component.allComponentItems.length).toEqual(9);
  });

  it('should return the bf sword', () => {
    const componentItem = component.getComponentItemById(1);
    expect(componentItem.id).toEqual(1);
    expect(componentItem.name).toEqual('B.F. Sword');
  });

  it('should return composite item id', () => {
    const compositeItemId = component.getCompositeItemId(1, 5);
    expect(compositeItemId).toEqual(15);
  });

  it('should return composite item id even out of order', () => {
    const compositeItemId = component.getCompositeItemId(5, 1);
    expect(compositeItemId).toEqual(15);
  });

  it('should return composite item', () => {
    const compositeItemId = component.getCompositeItemId(5, 1);
    const compositeItem = component.findItemById(compositeItemId);
    expect(compositeItem.id).toEqual(15);
    expect(compositeItem.name).toEqual('Guardian Angel');
  });

  it('should add the component item tear of the goddess to collected items', () => {
    expect(component.collectedItems.length).toEqual(0);
    const componentItem = component.getComponentItemById(4);
    component.addCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(1);
    expect(component.collectedItems[0].id).toEqual(4);
    expect(component.collectedItems[0].name).toEqual('Tear of the Goddess');

  });

  it('should remove componentItem tear from collected items', () => {
    const componentItem = component.getComponentItemById(4);
    component.addCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(1);
    component.removeCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(0);
  });

  it('should add the craftedItem Bloodthirster to collected items and remove the component item components', () => {
    expect(component.collectedItems.length).toEqual(0);
    const componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    const componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);
    expect(component.collectedItems.length).toEqual(2);
    const compositeItemId = component.getCompositeItemId(6, 1);
    const compositeItem = component.findItemById(compositeItemId);
    component.addCraftedItem(compositeItem);
    expect(component.collectedItems.length).toEqual(1);
    expect(component.collectedItems[0].name).toEqual('Bloodthirster');
    expect(component.collectedItems[0].id).toEqual(16);
  });

  it('should remove the craftedItem Bloodthirster from collected items and add the component items back to collecteditems', () => {
    const componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    const componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);
    const compositeItemId = component.getCompositeItemId(6, 1);
    const compositeItem = component.findItemById(compositeItemId);
    component.addCraftedItem(compositeItem);
    expect(component.collectedItems.length).toEqual(1);
    expect(component.collectedItems[0].name).toEqual('Bloodthirster');
    expect(component.collectedItems[0].id).toEqual(16);
    component.removeCollectedItem(compositeItem);
    expect(component.collectedItems.length).toEqual(2);
    expect(component.collectedItems[0].id).toEqual(1);
    expect(component.collectedItems[0].name).toEqual('B.F. Sword');
    expect(component.collectedItems[1].id).toEqual(6);
    expect(component.collectedItems[1].name).toEqual('Negatron Cloak');
  });

  it('should have unique composite id of 16 if collected items has sword and shell', () => {
    const componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    const componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);
    const uniqueCompositeItemIds = component.getUniqueCompositeItemIds([componentItemSword.id, componentItemShell.id]);
    expect(uniqueCompositeItemIds).toEqual([16]);
  });

  it('should populate bf sword if unique composite id contains one element that equals 16', () => {
    const uniqueCompositeItemIds = [16];
    const expectedItem = component.populateCompositeItemsFromIds(uniqueCompositeItemIds);
    expect(expectedItem[0]).toEqual(component.findItemById(16));
  });

  it('should have BloodThirster in potential composite items if a sword and shell are int the collected items list', () => {
    const componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    const componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);
    const compositeItemId = component.getCompositeItemId(6, 1);
    const compositeItem = component.findItemById(compositeItemId);
    expect(component.potentialCompositeItems[0]).toEqual(compositeItem);
  });
/*
  it('should not have Guardian Angel in potential composite items if a sword and shell are in the collected item list', () => {
    const componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    const componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);
    const compositeItemId = component.getCompositeItemId(5, 1);
    const compositeItem = component.findItemById(compositeItemId);
    expect(component.potentialCompositeItems[0]).not.toEqual(compositeItem);
  });

  it('should have 36 potentialCompositeItmes given 9 unique component items in the collected item list', () => {
    for (const cpt of component.allComponentItems) {
        component.addCollectedItem(cpt);
    }
    expect(component.potentialCompositeItems.length).toEqual(36);
  });

  it('should have 45 potentialCompositeItmes given that each component item is added twice', () => {
    for (const cpt of component.allComponentItems) {
      component.addCollectedItem(cpt);
      component.addCollectedItem(cpt);
    }
    expect(component.potentialCompositeItems.length).toEqual(45);
  });

  it('should have 0 unique possible item combinations given 1 component item', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    expect(component.potentialCompositeItems.length).toEqual(0);
  });

  it('should have 1 unique possible item combination given 2 component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    expect(component.potentialCompositeItems.length).toEqual(1);
  });

  it('should have 3 unique possible item combination given 3 component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    expect(component.potentialCompositeItems.length).toEqual(3);
  });

  it('should have 6 unique possible item combination given 4 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    expect(component.potentialCompositeItems.length).toEqual(6);
  });

  it('should have 10 unique possible item combination given 5 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    component.addCollectedItem(component.allComponentItems[4]);
    expect(component.potentialCompositeItems.length).toEqual(10);
  });

  it('should have 15 unique possible item combination given 6 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    component.addCollectedItem(component.allComponentItems[4]);
    component.addCollectedItem(component.allComponentItems[5]);
    expect(component.potentialCompositeItems.length).toEqual(15);
  });

  it('should have 21 unique possible item combination given 7 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    component.addCollectedItem(component.allComponentItems[4]);
    component.addCollectedItem(component.allComponentItems[5]);
    component.addCollectedItem(component.allComponentItems[6]);
    expect(component.potentialCompositeItems.length).toEqual(21);
  });

  it('should have 28 unique possible item combination given 7 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    component.addCollectedItem(component.allComponentItems[4]);
    component.addCollectedItem(component.allComponentItems[5]);
    component.addCollectedItem(component.allComponentItems[6]);
    component.addCollectedItem(component.allComponentItems[7]);
    expect(component.potentialCompositeItems.length).toEqual(28);
  });

  it('should have 36 unique possible item combination given 8 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    component.addCollectedItem(component.allComponentItems[4]);
    component.addCollectedItem(component.allComponentItems[5]);
    component.addCollectedItem(component.allComponentItems[6]);
    component.addCollectedItem(component.allComponentItems[7]);
    component.addCollectedItem(component.allComponentItems[8]);
    expect(component.potentialCompositeItems.length).toEqual(36);
  });

  it('should have 45 unique possible item combination given 9 unique component items', () => {
    component.addCollectedItem(component.allComponentItems[0]);
    component.addCollectedItem(component.allComponentItems[1]);
    component.addCollectedItem(component.allComponentItems[2]);
    component.addCollectedItem(component.allComponentItems[3]);
    component.addCollectedItem(component.allComponentItems[4]);
    component.addCollectedItem(component.allComponentItems[5]);
    component.addCollectedItem(component.allComponentItems[6]);
    component.addCollectedItem(component.allComponentItems[7]);
    component.addCollectedItem(component.allComponentItems[8]);
    component.addCollectedItem(component.allComponentItems[9]);
    expect(component.potentialCompositeItems.length).toEqual(45);
  });
*/
  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
