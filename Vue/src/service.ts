import DataSource from 'devextreme/data/data_source';
import type DxDropDownBox from 'devextreme/ui/drop_down_box';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore third-party store has no types
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const BASE_URL = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';
export const FIRST_ROW_KEY = 1;
const GRID_LOOKUP_FIELD_NAME = 'Task_Assigned_Employee_ID';
const LOOKUP_FIELD_NAME = 'Name';

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

export const lookupStore = AspNetData.createStore({
  key: 'ID',
  loadUrl: `${BASE_URL}/TaskEmployees`,
});

export function createTasksDataSource(): DataSource {
  return new DataSource({
    store: AspNetData.createStore({
      key: 'Task_ID',
      loadUrl: `${BASE_URL}/Tasks`,
      onBeforeSend: (_method: string, ajaxOptions: Record<string, unknown>) => {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
  });
}

export function getSearchExprItems(): SearchExprItem[] {
  return [
    { name: "'Employee'", value: 'Employee' },
    { name: "['Employee','Task_ID']", value: ['Employee', 'Task_ID'] },
    { name: "['Employee','Task_Subject']", value: ['Employee', 'Task_Subject'] },
  ];
}

export function isSearchIncomplete(dropDownBox: DxDropDownBox): boolean {
  const displayValue = dropDownBox.option('displayValue') as string[] | undefined;
  let text = dropDownBox.option('text');
  text = text?.length ? text : '';
  const displayValueFirst = displayValue?.length ? displayValue[0] : undefined;
  return text !== displayValueFirst;
}

export function getDisplayExpr(item: Task, lookupItems: Employee[]): string {
  if (!lookupItems?.length) return 'Loading...';
  const employeeData = lookupItems.find(
    (employee) => employee.ID === item.Task_Assigned_Employee_ID,
  );
  if (!employeeData) return item.Task_Subject || '';
  return `${employeeData.Name}: ${item.Task_Subject} (${item.Task_Status})`;
}

export function applySearchFilter(
  text: string,
  searchExprValue: string | string[],
  dataSource: DataSource,
): void {
  const filter = [LOOKUP_FIELD_NAME, 'contains', text];
  (lookupStore.load({ filter }) as Promise<Employee[]>).then((result) => {
    const items: Employee[] = Array.isArray(result) ? result : [];
    const filterParts: Array<unknown[] | string> = [];
    if (Array.isArray(searchExprValue)) {
      filterParts.push([searchExprValue[1], 'contains', text]);
    }
    if (items.length) {
      items.forEach((item, index) => {
        if (filterParts.length > 0 || index > 0) {
          filterParts.push('or');
        }
        filterParts.push([GRID_LOOKUP_FIELD_NAME, '=', item.ID]);
      });
    }
    const filterExpr = filterParts.length > 0
      ? filterParts
      : [GRID_LOOKUP_FIELD_NAME, '=', -1];
    dataSource.filter(filterExpr);
    dataSource.load().catch(() => {});
  }).catch(() => {});
}
