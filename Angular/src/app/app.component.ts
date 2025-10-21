import { Component, ViewChild } from '@angular/core';
import { DxTreeListComponent, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxDropDownBoxComponent, DxDropDownBoxTypes } from 'devextreme-angular/ui/drop-down-box';
import {
  Service, Task, Employee, Priority,
} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('treeList', { static: false }) treeList!: DxTreeListComponent;

  @ViewChild('dropDownBox', { static: false }) dropDownBox!: DxDropDownBoxComponent;

  title = 'DropDownBox';

  focusedRowIndex = -1;

  tasks: Task[];

  employees: Employee[];

  priorities: Priority[];

  statuses: string[];

  searchPanelText = '';

  value: number[] | null = null;

  isOpened = false;

  constructor(private readonly service: Service) {
    this.tasks = this.service.getTasks();
    this.employees = this.service.getEmployees();
    this.priorities = this.service.getPriorities();

    this.statuses = this.service.getStatuses();
  }

  onInitialized(e: DxDropDownBoxTypes.InitializedEvent): void {
  }

  treeListInitialized(e: DxTreeListTypes.InitializedEvent): void {
  }

  displayExpr(item: Task | string): string {
    return typeof item === 'object' ? item.Task_Subject : String(item);
  }

  customizeText(cellInfo: { valueText: string }): string {
    return `${cellInfo.valueText}%`;
  }

  onInput(e: DxDropDownBoxTypes.InputEvent): void {
    if (!this.isOpened) {
      this.isOpened = true;
    }

    const instance = this.treeList?.instance;
    if (!instance) return;

    if (typeof this.value === 'string') {
      const text = e.component.option('text') as string;
      this.searchPanelText = text || '';
    }
  }

  onOpened(e: DxDropDownBoxTypes.OpenedEvent): void {
    // eslint-disable-next-line no-void
    void setTimeout(() => {
      e.component.focus();
    });
  }

  onValueChanged(e: DxDropDownBoxTypes.ValueChangedEvent): void {
    const instance = this.treeList?.instance;
    if (!instance) return;

    if (!this.value) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.deselectAll();
      return;
    }

    if (Array.isArray(e.previousValue) && e.previousValue.length > 0 && typeof this.value === 'string') {
      this.value = e.previousValue;
      const lastValue = e.previousValue.pop();
      if (lastValue !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        instance.deselectRows([lastValue]);
      }
    }
  }

  onKeyDown(e: DxDropDownBoxTypes.KeyDownEvent): void {
    if (e.event?.keyCode !== 40) return;

    const ddbInstance = this.dropDownBox?.instance;
    if (!ddbInstance) return;

    if (!ddbInstance.option('opened')) {
      // eslint-disable-next-line no-void
      void ddbInstance.open();
    } else {
      const treeInstance = this.treeList?.instance;
      if (!treeInstance) return;

      const visibleRows = treeInstance.getVisibleRows().length - 1;
      if (this.focusedRowIndex === -1 || visibleRows < this.focusedRowIndex) {
        this.focusedRowIndex = 0;
      }
      const rowElement = treeInstance.getRowElement(this.focusedRowIndex);
      if (rowElement && rowElement.length > 0) {
        treeInstance.focus(rowElement[0]);
      }
    }
  }

  onSelectionChanged(e: DxTreeListTypes.SelectionChangedEvent): void {
    const keys = e.selectedRowKeys;
    const hasSelection = keys.length;
    this.value = hasSelection ? keys : null;
  }
}
