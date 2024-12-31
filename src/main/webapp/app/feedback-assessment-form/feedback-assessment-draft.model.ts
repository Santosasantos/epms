import {IFeedbackResponder} from "../entities/feedback-responder/feedback-responder.model";
import {IFeedbackSubType} from "../entities/feedback-sub-type/feedback-sub-type.model";

export interface IFeedbackAssessmentDraftModel {
  feedbackForm: Array<{
    id: number | null;
    responder: IFeedbackResponder | null;
    feedbacksubtypes: IFeedbackSubType | null;
    commentsforfeedbacksubtype: string;
    ratingvalue: number | string;
  }>;
  skillForm: {
    selectedSkills: Array<any>;
  };
  teachOtherForm: {
    id: number | null;
    technicalSkill: string;
    recommendation: string | null;
    particularStrengh: string;
    whynotRecommend: string;
    responder: IFeedbackResponder | null;
  };
}
