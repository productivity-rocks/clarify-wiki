import { Routes } from '@angular/router';

import { StartPageComponent } from './startpage/startPage.component';
import { ArticleComponent } from './article/article.component';

export const routes: Routes = [
    { path: '', component: StartPageComponent },
    { path: ':path', component: ArticleComponent },
];
