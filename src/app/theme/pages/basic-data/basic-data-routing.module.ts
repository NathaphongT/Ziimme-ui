import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicDataComponent } from './basic-data.component';
import { CourseDataComponent } from './course-data/course-data.component';
import { PositionDataComponent } from './position-data/position-data.component';
import { UserDataComponent } from './user-data/user-data.component';
import { BranchDataComponent } from './branch-data/branch-data.component';

const routes: Routes = [
  {
    path: '',
    component: BasicDataComponent,
    children: [
      {
        path: 'user',
        component: UserDataComponent,
      },
      {
        path: 'course',
        component: CourseDataComponent,
      },
      {
        path: 'position',
        component: PositionDataComponent,
      },
      {
        path: 'branch',
        component: BranchDataComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicDataRoutingModule { }
