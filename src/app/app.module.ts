import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {TreeItemComponent} from "./tree-item.component";
import {GroupComponent} from "./group.component";
import {SettingComponent} from "./setting.component";

@NgModule({
  declarations: [
    AppComponent,
    TreeItemComponent,
    GroupComponent,
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
