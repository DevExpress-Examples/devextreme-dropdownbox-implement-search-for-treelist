import { Component, OnInit, ViewChild } from '@angular/core';
import { DxTreeListComponent, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxDropDownBoxComponent, DxDropDownBoxTypes } from 'devextreme-angular/ui/drop-down-box';
import DataSource from 'devextreme/data/data_source';
import {
  Service, Employee, SearchExprItem, firstRowKey,
} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private searchTimerId: ReturnType<typeof setTimeout> | null = null;

  private hasLoadedItems = false;

  private listFirstLoadCompleted = false;

  private focusAfterLoadingFlag = false;

  private isDropDownKeyDown = false;

  private resetSelectionFlag = false;

  private autoSelectionFlag = false;

  @ViewChild('treeListRef', { static: false }) treeListRef!: DxTreeListComponent;

  @ViewChild('dropDownBoxRef', { static: false }) dropDownBoxRef!: DxDropDownBoxComponent;

  readonly defaultValue = 22;

  value: number | null = this.defaultValue;

  dataSource!: DataSource;

  lookupItems: Employee[] = [];

  searchExprItems!: SearchExprItem[];

  searchExprValue: string | string[] = 'Employee';

  searchTimeout = 1000;

  constructor(readonly service: Service) {}

  // Arrow function so 'this' is captured correctly when passed as [displayExpr] binding
  displayExprFn = (item: unknown): string => this.service.getDisplayExpr(
    item as Parameters<Service['getDisplayExpr']>[0],
    this.lookupItems,
  );

  ngOnInit(): void {
    this.searchExprItems = this.service.getSearchExprItems();

    this.dataSource = this.service.createTasksDataSource(
      (_method, ajaxOptions) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ajaxOptions as any).xhrFields = { withCredentials: true };
      },
      (e) => {
        this.hasLoadedItems = !!e.length;
      },
    );

    (this.service.lookupStore.load() as Promise<Employee[]>).then((items) => {
      this.lookupItems = items;
      this.dropDownBoxRef?.instance?.repaint();
      return items;
    }).catch((error: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load lookup data:', error);
    });
  }

  // ── DropDownBox event handlers ──────────────────────────────────────────

  onInput(e: DxDropDownBoxTypes.InputEvent): void {
    if (this.searchTimerId !== null) {
      clearTimeout(this.searchTimerId);
      this.searchTimerId = null;
    }

    const instance = e.component;
    if (!instance.option('opened')) instance.open();

    if (this.service.isSearchIncomplete(instance)) {
      this.focusAfterLoadingFlag = true;
      const text = instance.option('text') as string;
      if (text) {
        this.searchTimerId = setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.service.applySearchFilter(text, this.searchExprValue, this.dataSource);
        }, this.searchTimeout);
      } else {
        this.dataSource.filter([]);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.dataSource.load();
      }
    }
  }

  onOpened(e: DxDropDownBoxTypes.OpenedEvent): void {
    const treeListInstance = this.treeListRef?.instance;
    if (!treeListInstance) return;

    const dropDownBox = e.component;

    if (this.isDropDownKeyDown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleOptionChanged = (args: any): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const list = args.component;
        const triggerCondition = this.listFirstLoadCompleted
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ? args.name === 'opened'
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          : args.name === 'focusedRowKey' || args.name === 'focusedColumnIndex';

        if (triggerCondition) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          list.off('optionChanged', handleOptionChanged);
          if (this.listFirstLoadCompleted) {
            requestAnimationFrame(() => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              list.focus();
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              list.option('opened', false);
            });
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            list.focus();
          }
        }
      };

      treeListInstance.on('optionChanged', handleOptionChanged);

      if (this.listFirstLoadCompleted) {
        // Setting a non-standard custom option triggers optionChanged
        // which the handleOptionChanged handler listens to
        treeListInstance.option('opened', true);
      }
      this.isDropDownKeyDown = false;
    }

    // Reset selection if text doesn't match displayValue (e.g. after clear+type)
    const text = dropDownBox.option('text');
    const value = dropDownBox.option('value');
    const displayValue = dropDownBox.option('displayValue') as string[] | undefined;
    const isTextEqualToDisplayValue = text === (displayValue?.[0] ?? null);
    const shouldClearSelection = (value && !text) || !isTextEqualToDisplayValue;

    if (shouldClearSelection && (treeListInstance.option('selectedRowKeys') as unknown[]).length) {
      this.resetSelectionFlag = true;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      treeListInstance.selectRows([], false);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      treeListInstance.pageIndex(0).then(() => {
        treeListInstance.option('focusedRowIndex', 0);
        treeListInstance.option('focusedRowKey', firstRowKey);
      });
    }
  }

  onOptionChanged(e: DxDropDownBoxTypes.OptionChangedEvent): void {
    // When text is cleared AND list has already loaded, reset tree to first row
    if (e.name === 'text' && !e.value && this.listFirstLoadCompleted) {
      const treeListInstance = this.treeListRef?.instance;
      if (!treeListInstance) return;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      treeListInstance.pageIndex(0).then(() => {
        treeListInstance.option('focusedRowIndex', 0);
        treeListInstance.option('focusedRowKey', firstRowKey);
      });
    }
  }

  onValueChanged(e: DxDropDownBoxTypes.ValueChangedEvent): void {
    if (this.searchTimerId !== null) {
      clearTimeout(this.searchTimerId);
      this.searchTimerId = null;
    }
    if (e.value !== null && e.value !== undefined) {
      e.component.close();
    }
  }

  onKeyDown(e: DxDropDownBoxTypes.KeyDownEvent): void {
    if (e.event?.key !== 'ArrowDown') return;

    const instance = e.component;
    if (!instance.option('opened')) {
      this.isDropDownKeyDown = true;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.open();
    } else {
      const treeListInstance = this.treeListRef?.instance;
      if (!treeListInstance) return;
      treeListInstance.focus();
    }
  }

  onClosed(e: DxDropDownBoxTypes.ClosedEvent): void {
    const treeListInstance = this.treeListRef?.instance;
    if (!treeListInstance) return;

    const dropDownBox = e.component;
    const text = dropDownBox.option('text');
    const displayValue = (dropDownBox.option('displayValue') as string[] | undefined)?.[0];
    const resetValue = text && text !== displayValue;

    if (!this.hasLoadedItems) {
      dropDownBox.reset();
      this.dataSource.filter(null);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.dataSource.load();
    }

    if (resetValue && !(treeListInstance.option('selectedRowKeys') as unknown[]).length) {
      this.autoSelectionFlag = true;
      const firstKey = treeListInstance.getKeyByRowIndex(0) as number;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      treeListInstance.selectRows([firstKey], false);
      treeListInstance.option('focusedRowKey', firstKey);
    }
  }

  // ── TreeList event handlers ──────────────────────────────────────────────

  treeListOnContentReady(): void {
    if (!this.listFirstLoadCompleted) {
      this.listFirstLoadCompleted = true;
    }
  }

  treeListOnFocusedRowChanged(): void {
    if (this.focusAfterLoadingFlag) {
      this.dropDownBoxRef?.instance?.focus();
      this.focusAfterLoadingFlag = false;
    }
  }

  treeListOnKeyDown(e: DxTreeListTypes.KeyDownEvent): void {
    if (e.event?.key === 'Enter') {
      const list = e.component;
      const focusedKey = list.option('focusedRowKey') as number;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      list.selectRows([focusedKey], false);
    }
  }

  onSelectionChanged(e: DxTreeListTypes.SelectionChangedEvent): void {
    if (!this.resetSelectionFlag) {
      const keys = e.selectedRowKeys as number[];
      this.value = keys.length ? keys[0] : null;
      if (!this.autoSelectionFlag) {
        this.dropDownBoxRef?.instance?.focus();
      }
    }
    this.resetSelectionFlag = false;
    this.autoSelectionFlag = false;
  }

  // ── Search options event handlers ────────────────────────────────────────

  onSearchExprChanged(e: any): void {
    this.dataSource.searchExpr(e.value);
  }
}
