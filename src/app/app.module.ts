import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { V2013Component } from './v2013/v2013.component';
import { V2014Component } from './v2014/v2014.component';
import { V2017Component } from './v2017/v2017.component';


// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
{ path: '', redirectTo: 'V2013', pathMatch: 'full'},
{ path: 'home', component: HomeComponent },
{ path: 'about', component: AboutComponent },
{ path: 'V2013', component: V2013Component },
{ path: 'V2014', component: V2014Component },
{ path: 'V2017', component: V2017Component }
];


@NgModule({
  declarations: [
  AppComponent,
  HomeComponent,
  AboutComponent,
  V2013Component,
  V2014Component,
  V2017Component
  ],
  imports: [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,
  NgbModule.forRoot(),
  TranslateModule.forRoot({
    loader: { 
      provide: TranslateLoader, 
      useFactory: (createTranslateLoader), 
      deps: [Http]
    } 
  }),
  RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
