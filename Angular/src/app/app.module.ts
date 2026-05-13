import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropDownListComponent } from './drop-down-list/drop-down-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DropDownListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDropDownBoxModule,
    DxTreeListModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
