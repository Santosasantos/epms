import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
import LoginComponent from './login/login.component';
import { FeedbackRequestFormComponent } from './feedback-request-form/feedback-request-form.component';
import { FeedbackSuperviseeListComponent } from './feedback-review-supervisor/feedback-supervisee-list/feedback-supervisee-list.component';
import { FeedbackReviewSupervisorComponent } from './feedback-review-supervisor/feedback-review-supervisor.component';
import { FeedbackPreviewListComponent } from './feedback-preview-list/feedback-preview-list.component';
import { FeedbackAssessmentFormComponent } from './feedback-assessment-form/feedback-assessment-form.component';
import { FeedbackReportComponent } from './feedback-report/feedback-report.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'home.title',
  },
  {
    path: 'feedback-request-form',
    component: FeedbackRequestFormComponent,
    title: 'Feedback Request Form',
  },
  {
    path: 'feedback-supervisee-list',
    component: FeedbackSuperviseeListComponent,
    title: 'Feedback Supervisee List',
  },
  {
    path: 'feedback-review-form/:feedbackId',
    component: FeedbackReviewSupervisorComponent,
  },
  {
    path: 'feedback-requestee',
    component: FeedbackPreviewListComponent,
    title: 'Feedback Requestee List',
  },
  {
    path: 'feedback-assessment-form/:responderId',
    component: FeedbackAssessmentFormComponent,
    title: 'Feedback Assessment Form',
  },
  {
    path: 'feedback-report-view',
    component: FeedbackReportComponent,
    title: 'Feedback Report View',
  },
  {
    path: '',
    component: NavbarComponent,
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'login.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  ...errorRoute,
];

export default routes;
