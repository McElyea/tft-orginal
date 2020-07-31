import { TestBed, async } from '@angular/core/testing';
import { DashboardComponent } from '../../../tft-combinator/src/app/dashboard/dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    let itemCount = app.getItems();
    expect(app).toEqual(9);
  });


});
