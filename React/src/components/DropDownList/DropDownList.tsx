import {
  useCallback, useEffect, useReducer, useRef, useState,
} from 'react';
import DropDownBox, { type DropDownBoxRef, type DropDownBoxTypes } from 'devextreme-react/drop-down-box';
import TreeList, {
  Column, Lookup, RemoteOperations, Scrolling, Selection, type TreeListRef, type TreeListTypes,
} from 'devextreme-react/tree-list';
import { type DataSource } from 'devextreme-react/common/data';
import {
  FIRST_ROW_KEY, applySearchFilter, isSearchIncomplete, lookupStore,
} from '../../service';
import { selectionReducer } from './selectionReducer';

interface DropDownListProps {
  selectedRowKey: number;
  dataSource: DataSource;
  dropDownBoxDataSource: DataSource;
  searchTimeout?: number;
  displayExpr?: ((item: unknown) => string) | undefined;
  searchExprValue: string | string[];
}

export default function DropDownList({
  selectedRowKey,
  dataSource,
  dropDownBoxDataSource,
  searchTimeout = 1000,
  displayExpr,
  searchExprValue,
}: DropDownListProps): JSX.Element {
  const [selection, dispatch] = useReducer(selectionReducer, {
    dropDownValue: selectedRowKey,
    selectedRowKeys: [selectedRowKey],
    focusedRowKey: selectedRowKey,
  });

  const [dropDownBoxOpened, setDropDownBoxOpened] = useState(false);
  const [treeListDS, setTreeListDS] = useState<DataSource | null>(null);

  const treeListRef = useRef<TreeListRef>(null);
  const dropDownBoxRef = useRef<DropDownBoxRef>(null);

  const searchTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedItemsRef = useRef(false);
  const listFirstLoadCompletedRef = useRef(false);

  useEffect(() => {
    function changedHandler(): void {
      hasLoadedItemsRef.current = !!dataSource.items().length;
      if (hasLoadedItemsRef.current && !selection.focusedRowKey) {
        const items = dataSource.items();
        dispatch({ type: 'SET_FOCUSED_KEY', key: items[0].key });
      }
    }
    dataSource.on('changed', changedHandler);
    return () => {
      dataSource.off('changed', changedHandler);
    };
  }, [dataSource]);

  const focusInput = useCallback((): void => {
    setTimeout(() => {
      dropDownBoxRef.current?.instance().focus();
    });
  }, [dropDownBoxRef]);

  const onInput = useCallback((e: DropDownBoxTypes.InputEvent): void => {
    if (searchTimerIdRef.current) clearTimeout(searchTimerIdRef.current);

    const instance = e.component;
    if (!dropDownBoxOpened) setDropDownBoxOpened(true);

    if (isSearchIncomplete(instance)) {
      const text = instance.option('text');
      if (text) {
        searchTimerIdRef.current = setTimeout(() => {
          applySearchFilter(text, searchExprValue, dataSource);
        }, searchTimeout);
      } else {
        dataSource.filter(null);
      }
      focusInput();
    }
  }, [searchTimerIdRef, dropDownBoxOpened, searchExprValue, dataSource, searchTimeout]);

  const onOpened = useCallback((e: DropDownBoxTypes.OpenedEvent): void => {
    const treeListInstance = treeListRef.current?.instance();
    if (!treeListDS) setTreeListDS(dataSource);
    const dropDownBox = e.component;

    function handleOptionChanged(args: TreeListTypes.OptionChangedEvent): void {
      const list = args.component;
      const triggerCondition = listFirstLoadCompletedRef.current
        ? args.name === 'openTrigger'
        : args.name === 'focusedRowKey' || args.name === 'focusedColumnIndex';

      if (triggerCondition) {
        list.off('optionChanged', handleOptionChanged);
        requestAnimationFrame(() => {
          list.focus();
          list.option('openTrigger', 'closed');
        });
      }
    }

    treeListInstance?.on('optionChanged', handleOptionChanged);

    if (listFirstLoadCompletedRef.current) {
      treeListInstance?.option('openTrigger', 'opened');
    }

    const { text, value: dropDownValue } = dropDownBox.option();
    const dropDownDisplayValue = dropDownBox.option('displayValue') as string[] | undefined;
    const isTextEqualToDisplayValue = text === dropDownDisplayValue?.[0];
    const shouldClearSelection = (dropDownValue && !text) || !isTextEqualToDisplayValue;
    if (shouldClearSelection) {
      dispatch({ type: 'RESET' });
      treeListInstance?.pageIndex(0).then(() => {
        treeListInstance?.option('focusedRowIndex', 0);
        dispatch({ type: 'SET_FOCUSED_KEY', key: FIRST_ROW_KEY });
        focusInput();
      }).catch(() => {});
    }
  }, [treeListDS, focusInput, listFirstLoadCompletedRef, treeListRef]);

  const onOptionChanged = useCallback((e: DropDownBoxTypes.OptionChangedEvent): void => {
    if (e.name === 'text' && !e.value && listFirstLoadCompletedRef.current) {
      treeListRef.current?.instance().pageIndex(0).then(() => {
        treeListRef.current?.instance().option('focusedRowIndex', 0);
        dispatch({ type: 'SET_FOCUSED_KEY', key: FIRST_ROW_KEY });
      }).catch(() => {});
    }
  }, []);

  const onValueChanged = useCallback((e: DropDownBoxTypes.ValueChangedEvent): void => {
    if (searchTimerIdRef.current !== null) {
      clearTimeout(searchTimerIdRef.current);
      searchTimerIdRef.current = null;
    }
    dispatch({ type: 'SELECT_VALUE', value: e.value ?? null });
    if (e.value) {
      setDropDownBoxOpened(false);
    }
  }, [searchTimerIdRef]);

  const onKeyDown = useCallback((e: DropDownBoxTypes.KeyDownEvent): void => {
    if (e.event?.originalEvent?.key !== 'ArrowDown') return;
    const treeListInstance = treeListRef.current?.instance();
    if (!dropDownBoxOpened) {
      setDropDownBoxOpened(true);
    } else if (treeListInstance) {
      treeListInstance.focus();
    }
  }, [dropDownBoxOpened]);

  const onClosed = useCallback((e: DropDownBoxTypes.ClosedEvent): void => {
    const treeListInstance = treeListRef.current?.instance();
    const dropDownBox = e.component;
    const text = dropDownBox.option('text');
    const dropDownDisplayValue = (dropDownBox.option('displayValue') as string[] | undefined)?.[0];
    const resetValue = text && text !== dropDownDisplayValue;

    if (!hasLoadedItemsRef.current) {
      dispatch({ type: 'SELECT_VALUE', value: null });
      dataSource.filter(null);
      dataSource.load().catch(() => {});
    }

    if (resetValue && !selection.selectedRowKeys.length && treeListInstance) {
      const firstKey = treeListInstance.getKeyByRowIndex(0) as number;
      dispatch({ type: 'SELECT_VALUE', value: firstKey });
    }
  }, [selection.selectedRowKeys.length, dataSource]);

  const treeListOnContentReady = useCallback((e: TreeListTypes.ContentReadyEvent): void => {
    if (!listFirstLoadCompletedRef.current) {
      listFirstLoadCompletedRef.current = true;
      e.component.option('openTrigger', 'opened');
    }
  }, [listFirstLoadCompletedRef]);

  const treeListOnKeyDown = useCallback((e: TreeListTypes.KeyDownEvent): void => {
    if (e.event?.key === 'Enter') {
      dispatch({ type: 'SELECT_FOCUSED_ROW' });
      focusInput();
    }
  }, []);

  const onFocusedRowChanged = useCallback((e: TreeListTypes.FocusedRowChangedEvent): void => {
    dispatch({ type: 'SET_FOCUSED_KEY', key: (e.row?.key as number) ?? null });
  }, []);

  const onSelectionChanged = useCallback((e: TreeListTypes.SelectionChangedEvent): void => {
    if (!listFirstLoadCompletedRef.current || !e.selectedRowKeys.length) return;
    dispatch({ type: 'SELECT_ROW', keys: e.selectedRowKeys as number[] });
    focusInput();
  }, []);

  return (
    <DropDownBox
      ref={dropDownBoxRef}
      placeholder="Select a value..."
      showClearButton
      width="40vw"
      value={selection.dropDownValue}
      acceptCustomValue
      openOnFieldClick={false}
      valueChangeEvent=""
      valueExpr="Task_ID"
      dataSource={dropDownBoxDataSource}
      displayExpr={displayExpr}
      opened={dropDownBoxOpened}
      onInput={onInput}
      onOpened={onOpened}
      onOptionChanged={onOptionChanged}
      onValueChanged={onValueChanged}
      onKeyDown={onKeyDown}
      onClosed={onClosed}
      onOpenedChange={setDropDownBoxOpened}
    >
      <TreeList
        ref={treeListRef}
        dataSource={treeListDS}
        hasItemsExpr="Has_Items"
        parentIdExpr="Task_Parent_ID"
        columnAutoWidth
        wordWrapEnabled
        showBorders
        height={400}
        width="100%"
        focusedRowEnabled
        focusedRowKey={selection.focusedRowKey}
        selectedRowKeys={selection.selectedRowKeys}
        onContentReady={treeListOnContentReady}
        onKeyDown={treeListOnKeyDown}
        onFocusedRowChanged={onFocusedRowChanged}
        onSelectionChanged={onSelectionChanged}
      >
        <RemoteOperations filtering sorting grouping />
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Column dataField="Task_ID" />
        <Column dataField="Task_Assigned_Employee_ID" caption="Employee" minWidth={120}>
          <Lookup dataSource={lookupStore} valueExpr="ID" displayExpr="Name" />
        </Column>
        <Column dataField="Task_Subject" width={300} />
        <Column dataField="Task_Start_Date" caption="Start Date" dataType="date" />
        <Column dataField="Task_Status" caption="Status" />
        <Column dataField="Task_Due_Date" caption="Due Date" dataType="date" />
      </TreeList>
    </DropDownBox>
  );
}
