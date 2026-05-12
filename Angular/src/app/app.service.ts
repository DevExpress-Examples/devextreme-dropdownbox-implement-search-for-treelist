import { Injectable } from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import type DxDropDownBox from 'devextreme/ui/drop_down_box';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';
export const firstRowKey = 1;
const gridLookupFieldName = 'Task_Assigned_Employee_ID';
const lookupFieldName = 'Name';
export interface Task {
  Task_ID: number;
  Task_Parent_ID: number;
  Task_Assigned_Employee_ID: number;
  Task_Completion: number;
  Task_Priority: number;
  Task_Status: string;
  Task_Subject: string;
  Task_Start_Date: string;
  Task_Due_Date: string;
  Has_Items?: boolean;
}
export interface Employee {
  ID: number;
  Name: string;
}
export interface SearchExprItem {
  name: string;
  value: string | string[];
}
@Injectable({
  providedIn: 'root',
})
export class Service {
  readonly lookupStore = AspNetData.createStore({
    key: 'ID',
    loadUrl: `${url}/TaskEmployees`,
  });

  createTasksDataSource(
    onBeforeSend: (method: string, ajaxOptions: Record<string, unknown>) => void,
  ): DataSource {
    return new DataSource({
      store: AspNetData.createStore({
        key: 'Task_ID',
        loadUrl: `${url}/Tasks`,
        onBeforeSend,
      }),
    });
  }

  getSearchExprItems(): SearchExprItem[] {
    return [
      { name: '\'Employee\'', value: 'Employee' },
      { name: '[\'Employee\',\'Task_ID\']', value: ['Employee', 'Task_ID'] },
      { name: '[\'Employee\',\'Task_Subject\']', value: ['Employee', 'Task_Subject'] },
    ];
  }

  isSearchIncomplete(dropDownBox: DxDropDownBox): boolean {
    const displayValue = dropDownBox.option('displayValue') as string[] | undefined;
    let text = dropDownBox.option('text');
    text = text?.length ? text : '';
    const displayValueFirst = displayValue?.length ? displayValue[0] : undefined;
    return text !== displayValueFirst;
  }

  getDisplayExpr(item: Task, lookupItems: Employee[]): string {
    if (!lookupItems?.length) return 'Loading...';
    const employeeData = lookupItems.find(
      (employee) => employee.ID === item.Task_Assigned_Employee_ID,
    );
    if (!employeeData) return item.Task_Subject || '';
    return `${employeeData.Name}: ${item.Task_Subject} (${item.Task_Status})`;
  }

  applySearchFilter(
    text: string,
    searchExprValue: string | string[],
    dataSource: DataSource,
  ): void {
    const filter = [lookupFieldName, 'contains', text];
    (this.lookupStore.load({ filter }) as Promise<Employee[]>).then((result) => {
      const items: Employee[] = Array.isArray(result) ? result : [];
      const filterParts: unknown[] = [];
      if (Array.isArray(searchExprValue)) {
        filterParts.push([searchExprValue[1], 'contains', text]);
      }
      if (items.length) {
        items.forEach((item, index) => {
          if (filterParts.length > 0 || index > 0) {
            filterParts.push('or');
          }
          filterParts.push([gridLookupFieldName, '=', item.ID]);
        });
      }
      const filterExpr = filterParts.length > 0
        ? filterParts
        : [gridLookupFieldName, '=', -1];
      dataSource.filter(filterExpr);
      dataSource.load().then(() => {}).catch(() => {});
    }).catch(() => {});
  }
}
