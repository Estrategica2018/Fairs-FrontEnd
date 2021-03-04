import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemoriesPage } from './memories.page';

describe('MemoriesPage', () => {
  let component: MemoriesPage;
  let fixture: ComponentFixture<MemoriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
