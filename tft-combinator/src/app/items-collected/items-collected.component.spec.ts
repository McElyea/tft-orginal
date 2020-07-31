import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCollectedComponent } from './items-collected.component';

describe('ItemsCollectedComponent', () => {
  let component: ItemsCollectedComponent;
  let fixture: ComponentFixture<ItemsCollectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsCollectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
