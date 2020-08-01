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
    let componentItem = component.getComponentItemById(1);
    expect(componentItem.id).toEqual(1);
    expect(componentItem.name).toEqual("B.F. Sword");
  });

  it('should return composite item id', () => {        
    let compositeItemId = component.getCraftedItemId(1,5);
    expect(compositeItemId).toEqual(15);
  });

  it('should return composite item id even out of order', () => {        
    let compositeItemId = component.getCraftedItemId(5,1);
    expect(compositeItemId).toEqual(15);
  });

  it('should return composite item', () => {        
    let compositeItemId = component.getCraftedItemId(5,1);
    let compositeItem = component.findItemById(compositeItemId);
    expect(compositeItem.id).toEqual(15);
    expect(compositeItem.name).toEqual("Guardian Angel");
  });

  it('should add the component item tear of the goddess to collected items', () => {
    expect(component.collectedItems.length).toEqual(0);    
    let componentItem = component.getComponentItemById(4);
    component.addCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(1);    
    expect(component.collectedItems[0].id).toEqual(4);      
    expect(component.collectedItems[0].name).toEqual("Tear of the Goddess");      

  });


  it('should remove componentItem tear from collected items', () => {
    let componentItem = component.getComponentItemById(4);
    component.addCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(1); 
    component.removeCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(0); 
  });

  it('should add the craftedItem Bloodthirster to collected items and remove the component item components', () => {
    expect(component.collectedItems.length).toEqual(0);    
    let componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    let componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);
    expect(component.collectedItems.length).toEqual(2);    
    let compositeItemId = component.getCraftedItemId(6,1);
    let compositeItem = component.findItemById(compositeItemId);    
    component.addCraftedItem(compositeItem);
    expect(component.collectedItems.length).toEqual(1);  
    expect(component.collectedItems[0].name).toEqual("Bloodthirster");      
    expect(component.collectedItems[0].id).toEqual(16);     
  });

  it('should remove the craftedItem Bloodthirster from collected items and add the component items back to collecteditems', () => {
    
    let componentItemSword = component.getComponentItemById(1);
    component.addCollectedItem(componentItemSword);
    let componentItemShell = component.getComponentItemById(6);
    component.addCollectedItem(componentItemShell);    
    let compositeItemId = component.getCraftedItemId(6,1);
    let compositeItem = component.findItemById(compositeItemId);    
    component.addCraftedItem(compositeItem);
    expect(component.collectedItems.length).toEqual(1);  
    expect(component.collectedItems[0].name).toEqual("Bloodthirster");      
    expect(component.collectedItems[0].id).toEqual(16);     
    component.removeCollectedItem(compositeItem);    
    expect(component.collectedItems.length).toEqual(2); 
    expect(component.collectedItems[0].id).toEqual(1);      
    expect(component.collectedItems[0].name).toEqual("B.F. Sword");      
    expect(component.collectedItems[1].id).toEqual(6);      
    expect(component.collectedItems[1].name).toEqual("Negatron Cloak");      


  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
