jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ExtraquestionService } from '../service/extraquestion.service';

import { ExtraquestionDeleteDialogComponent } from './extraquestion-delete-dialog.component';

describe('Extraquestion Management Delete Component', () => {
  let comp: ExtraquestionDeleteDialogComponent;
  let fixture: ComponentFixture<ExtraquestionDeleteDialogComponent>;
  let service: ExtraquestionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ExtraquestionDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ExtraquestionDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExtraquestionDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExtraquestionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
