import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicDataComponent } from './basic-data.component';
import { CourseDataComponent } from './course-data/course-data.component';
import { PositionDataComponent } from './position-data/position-data.component';
import { UserDataComponent } from './user-data/user-data.component';
import { BranchDataComponent } from './branch-data/branch-data.component';
import { BranchResolver, CourseResolver, PositionResolver, UserResolver } from './basic.resolver';

const routes: Routes = [
  {
    path: '',
    component: BasicDataComponent,
    children: [
      {
        path: 'user',
        component: UserDataComponent,
        resolve: {
          users: UserResolver
        }
      },
      {
        path: 'course',
        component: CourseDataComponent,
        resolve: {
          courses: CourseResolver
        }
      },
      {
        path: 'position',
        component: PositionDataComponent,
        resolve: {
          positions: PositionResolver
        }
      },
      {
        path: 'branch',
        component: BranchDataComponent,
        resolve: {
          branchs: BranchResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicDataRoutingModule { }
