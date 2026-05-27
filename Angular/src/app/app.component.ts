import { Component, OnInit } from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import { Service, Employee, SearchExprItem } from './app.service';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DropDownListComponent } from './drop-down-list/drop-down-list.component';

@Component({
  selector: 'app-root',
  imports: [DxDropDownBoxModule, DxTreeListModule, DxSelectBoxModule, DxNumberBoxModule, DropDownListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dataSource!: DataSource;

  dropDownBoxDataSource!: DataSource;

  displayExpr: ((item: any) => string) | undefined;

  searchExprItems!: SearchExprItem[];

  searchExprValue: string | string[] = 'Employee';

  searchTimeout = 1000;

  constructor(readonly service: Service) {}

  ngOnInit(): void {
    this.searchExprItems = this.service.getSearchExprItems();

    this.dataSource = this.service.createTasksDataSource();
    this.dropDownBoxDataSource = this.dataSource;

    (this.service.lookupStore.load() as Promise<Employee[]>).then((items) => {
      this.displayExpr = (item: any): string => this.service.getDisplayExpr(item, items);
      return items;
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load lookup data:', error);
    });
  }
}
