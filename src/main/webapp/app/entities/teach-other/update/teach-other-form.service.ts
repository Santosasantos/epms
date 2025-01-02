import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ITeachOther, NewTeachOther } from '../teach-other.model';
import { IFeedback } from '../../feedback/feedback.model';
import { RecommendationValue } from '../../enumerations/recommendation-value.model';
import { IFeedbackResponder } from 'app/entities/feedback-responder/feedback-responder.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITeachOther for edit and NewTeachOtherFormGroupInput for create.
 */
type TeachOtherFormGroupInput = ITeachOther | PartialWithRequiredKeyOf<NewTeachOther>;

type TeachOtherFormDefaults = Pick<NewTeachOther, 'id'>;

type TeachOtherFormGroupContent = {
  id: FormControl<ITeachOther['id'] | NewTeachOther['id']>;
  technicalSkill: FormControl<ITeachOther['technicalSkill']>;
  recommendation: FormControl<ITeachOther['recommendation']>;
  particularStrengh: FormControl<ITeachOther['particularStrengh']>;
  whynotRecommend: FormControl<ITeachOther['whynotRecommend']>;
  responder: FormControl<ITeachOther['responder']>;
};

export type TeachOtherFormGroup = FormGroup<TeachOtherFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TeachOtherFormService {
  constructor(private fb: FormBuilder) {}
  createTeachOtherFormGroup(teachOther: TeachOtherFormGroupInput = { id: null }): TeachOtherFormGroup {
    const teachOtherRawValue = {
      ...this.getFormDefaults(),
      ...teachOther,
    };
    return new FormGroup<TeachOtherFormGroupContent>({
      id: new FormControl(
        { value: teachOtherRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      technicalSkill: new FormControl(teachOtherRawValue.technicalSkill, {
        validators: [Validators.required],
      }),
      recommendation: new FormControl(teachOtherRawValue.recommendation, {
        validators: [Validators.required],
      }),
      particularStrengh: new FormControl(teachOtherRawValue.particularStrengh),
      whynotRecommend: new FormControl(teachOtherRawValue.whynotRecommend),
      responder: new FormControl(teachOtherRawValue.responder),
    });
  }

  getTeachOther(form: TeachOtherFormGroup): ITeachOther | NewTeachOther {
    return form.getRawValue() as ITeachOther | NewTeachOther;
  }

  resetForm(form: TeachOtherFormGroup, teachOther: TeachOtherFormGroupInput): void {
    const teachOtherRawValue = { ...this.getFormDefaults(), ...teachOther };
    form.reset(
      {
        ...teachOtherRawValue,
        id: { value: teachOtherRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  transformToNewTechOther(teachOtherForm: FormGroup, responder?: IFeedbackResponder): NewTeachOther {
    // Remove the initial validation check
    const formValue = teachOtherForm.value;

    // Construct NewTeachOther object with null checks
    const newTeachOther: NewTeachOther = {
      id: null,
      technicalSkill: formValue.technicalSkill?.trim() || null,
      recommendation: formValue.recommendation || null,
      particularStrengh: formValue.recommendation === RecommendationValue.Yes ? formValue.particularStrengh?.trim() || null : null,
      whynotRecommend: formValue.recommendation === RecommendationValue.No ? formValue.whynotRecommend?.trim() || null : null,
      responder: responder || null,
    };

    return newTeachOther;
  }

  // Method to convert existing TeachOther to form
  convertToFormGroup(teachOther: ITeachOther): FormGroup {
    return this.fb.group({
      id: [teachOther.id],
      technicalSkill: [teachOther.technicalSkill, [Validators.required, Validators.maxLength(500)]],
      recommendation: [teachOther.recommendation, Validators.required],
      particularStrengh: [teachOther.particularStrengh, Validators.maxLength(1000)],
      whynotRecommend: [teachOther.whynotRecommend, Validators.maxLength(1000)],
      responder: [teachOther.responder],
    });
  }

  // Helper method to prepare form for different scenarios
  prepareTeachOtherForm(responder?: IFeedbackResponder, existingTeachOther?: ITeachOther): FormGroup {
    let formGroup: FormGroup;

    if (existingTeachOther) {
      // If existing teach other exists, convert it to form
      formGroup = this.convertToFormGroup(existingTeachOther);
    } else {
      // Create new form group
      formGroup = this.createTeachOtherFormGroup();
    }

    return formGroup;
  }

  private getFormDefaults(): TeachOtherFormDefaults {
    return {
      id: null,
    };
  }
}
