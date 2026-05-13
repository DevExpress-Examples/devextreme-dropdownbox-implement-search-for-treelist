import { Component, OnInit } from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import { Service, Employee, SearchExprItem } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
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
