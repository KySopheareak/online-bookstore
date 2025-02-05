import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { BookComponentComponent } from './book-component/book-component.component';
import { BookFormComponent } from './book-form/book-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'book-list',
    component: HomeComponentComponent,
    children: [
      {
        path: 'book-list',
        component: BookComponentComponent,
      },
      {
        path: 'book-create',
        component: BookFormComponent,
      },
    ],
  },
];
