import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPipelineListsComponent } from './application-pipeline-lists.component';

describe('ApplicationPipelineListsComponent', () => {
  let component: ApplicationPipelineListsComponent;
  let fixture: ComponentFixture<ApplicationPipelineListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationPipelineListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationPipelineListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
