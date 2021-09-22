import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GridTableComponent } from './grid-table.component';

describe('GridTableComponent', () => {
  let component: GridTableComponent;
  let fixture: ComponentFixture<GridTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
