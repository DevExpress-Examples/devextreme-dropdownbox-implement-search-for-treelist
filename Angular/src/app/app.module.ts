import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxDropDownBoxModule, DxTreeListModule } from 'devextreme-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxDropDownBoxModule,
    DxTreeListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
