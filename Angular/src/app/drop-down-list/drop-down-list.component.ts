import {
  Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { DxDropDownBoxComponent, DxTreeListComponent } from 'devextreme-angular';
import type { DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import type { DxDropDownBoxTypes } from 'devextreme-angular/ui/drop-down-box';
import { DataSource } from 'devextreme-angular/common/data';
import { Service, firstRowKey } from '../app.service';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';

@Component({
  selector: 'app-drop-down-list',
  imports: [DxDropDownBoxModule, DxTreeListModule, DxSelectBoxModule, DxNumberBoxModule],
  templateUrl: './drop-down-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./drop-down-list.component.scss'],
})
export class DropDownListComponent implements OnInit, OnChanges {
  @Input() selectedRowKey!: number;

  @Input() dataSource!: DataSource;

  @Input() dropDownBoxDataSource!: DataSource;

  @Input() searchTimeout = 1000;

  @Input() displayExpr: ((item: any) => string) | undefined;

  @Input() searchExprValue!: string | string[];

  @ViewChild('treeListRef', { static: false }) treeListRef!: DxTreeListComponent;

  @ViewChild('dropDownBoxRef', { static: false }) dropDownBoxRef!: DxDropDownBoxComponent;

  value: number | null = null;

  dropDownBoxOpened = false;

  selectedRowKeys: number[] = [];

  focusedRowKey: number | null = null;

  focusedRowIndex = 0;

  private searchTimerId: ReturnType<typeof setTimeout> | null = null;

  private hasLoadedItems = false;

  private listFirstLoadCompleted = false;

  private resetSelectionFlag = false;

  private autoSelectionFlag = false;

  constructor(readonly service: Service, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.value = this.selectedRowKey;
    this.selectedRowKeys = [this.selectedRowKey];
    this.focusedRowKey = this.selectedRowKey;
    this.dataSource.on('changed', this.changedHandler);
  }

  private readonly changedHandler = (): void => {
    this.hasLoadedItems = !!this.dataSource.items().length;
  };

  ngOnDestroy(): void {
    this.dataSource.off('changed', this.changedHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayExpr'] && !changes['displayExpr'].firstChange) {
      this.dropDownBoxRef?.instance?.repaint();
    }
  }

  focusInput(): void {
    setTimeout(() => {
      this.dropDownBoxRef?.instance?.focus();
    });
  }

  onInput(e: DxDropDownBoxTypes.InputEvent): void {
    if (this.searchTimerId) clearTimeout(this.searchTimerId);

    const instance = e.component;
    if (!this.dropDownBoxOpened) this.dropDownBoxOpened = true;

    if (this.service.isSearchIncomplete(instance)) {
      const text = instance.option('text');
      if (text) {
        this.searchTimerId = setTimeout(() => {
          this.service.applySearchFilter(text, this.searchExprValue, this.dataSource);
        }, this.searchTimeout);
      } else {
        this.dataSource.filter(null);
      }
      this.focusInput();
    }
  }

  onOpened(e: DxDropDownBoxTypes.OpenedEvent): void {
    const treeListInstance = this.treeListRef?.instance;
    const dropDownBox = e.component;

    const handleOptionChanged = (args: DxTreeListTypes.OptionChangedEvent): void => {
      const list = args.component;
      const triggerCondition = this.listFirstLoadCompleted
        ? args.name === 'opened'
        : args.name === 'focusedRowKey' || args.name === 'focusedColumnIndex';

      if (triggerCondition) {
        list.off('optionChanged', handleOptionChanged);
        setTimeout(() => {
          list.focus();
          list.option('opened', false);
        }, 100);
      }
    };

    treeListInstance.on('optionChanged', handleOptionChanged);

    if (this.listFirstLoadCompleted && !this.service.isSearchIncomplete(dropDownBox)) {
      treeListInstance.option('opened', true);
    }

    const { text, value } = dropDownBox.option();
    const displayValue = dropDownBox.option('displayValue') as string[] | undefined;
    const isTextEqualToDisplayValue = text === displayValue?.[0];
    const shouldClearSelection = (value && !text) || !isTextEqualToDisplayValue;

    if (shouldClearSelection && this.selectedRowKeys.length) {
      this.resetSelectionFlag = true;
      this.selectedRowKeys = [];
      treeListInstance.pageIndex(0).then(() => {
        this.focusedRowIndex = 0;
        this.focusedRowKey = firstRowKey;
        this.focusInput();
      }).catch(() => {});
    }
  }

  onOptionChanged(e: DxDropDownBoxTypes.OptionChangedEvent): void {
    if (e.name === 'text' && !e.value && this.listFirstLoadCompleted) {
      const treeListInstance = this.treeListRef?.instance;
      treeListInstance?.pageIndex(0).then(() => {
        this.focusedRowIndex = 0;
        this.focusedRowKey = firstRowKey;
      }).catch(() => {});
    }
  }

  onValueChanged(e: DxDropDownBoxTypes.ValueChangedEvent): void {
    if (this.searchTimerId !== null) {
      clearTimeout(this.searchTimerId);
      this.searchTimerId = null;
    }
    if (e.value) {
      this.dropDownBoxOpened = false;
    }
  }

  onKeyDown(e: DxDropDownBoxTypes.KeyDownEvent): void {
    if (e.event?.originalEvent?.key !== 'ArrowDown') return;
    const treeListInstance = this.treeListRef?.instance;
    if (!this.dropDownBoxOpened) {
      this.dropDownBoxOpened = true;
    } else if (treeListInstance) {
      treeListInstance.focus();
    }
  }

  onClosed(e: DxDropDownBoxTypes.ClosedEvent): void {
    const treeListInstance = this.treeListRef?.instance;
    const dropDownBox = e.component;
    const text = dropDownBox.option('text');
    const displayValue = (dropDownBox.option('displayValue') as string[] | undefined)?.[0];
    const resetValue = text && text !== displayValue;

    if (!this.hasLoadedItems) {
      this.value = null;
      this.selectedRowKeys = [];
      this.dataSource.filter(null);
      this.dataSource.load().then(() => {}).catch(() => {});
    }

    if (resetValue && !this.selectedRowKeys.length) {
      this.autoSelectionFlag = true;
      const firstKey = treeListInstance.getKeyByRowIndex(0) as number;
      this.selectedRowKeys = [firstKey];
      this.focusedRowKey = firstKey;
    }
  }

  treeListOnContentReady(e: DxTreeListTypes.ContentReadyEvent): void {
    if (!this.listFirstLoadCompleted) {
      this.listFirstLoadCompleted = true;
      e.component.option('opened', true);
    }
  }

  treeListOnKeyDown(e: DxTreeListTypes.KeyDownEvent): void {
    if (e.event?.key === 'Enter' && this.focusedRowKey) {
      this.selectedRowKeys = [this.focusedRowKey];
      this.resetSelectionFlag = false;
    }
  }

  onSelectionChanged(e: DxTreeListTypes.SelectionChangedEvent): void {
    if (!this.resetSelectionFlag) {
      const keys = e.selectedRowKeys as number[];
      this.value = keys.length ? keys[0] : null;
      this.cdr.detectChanges();
      if (!this.autoSelectionFlag) {
        this.focusInput();
      }
    }
    this.resetSelectionFlag = false;
    this.autoSelectionFlag = false;
  }
}
