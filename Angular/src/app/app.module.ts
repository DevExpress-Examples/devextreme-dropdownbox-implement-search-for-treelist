import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDropDownBoxModule,
    DxTreeListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
