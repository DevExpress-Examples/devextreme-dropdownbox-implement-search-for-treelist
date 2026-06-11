import {
  firstRowKey, makeAsyncDataSource, displayExpr, performSearch,
  handleDropDownOpened, resetSearchState,
} from './helpers.js';

const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

let lookupItems = [];

const lookupDataSource = makeAsyncDataSource('ID', `${url}/TaskEmployees`);

lookupDataSource.load().then((items) => {
  lookupItems = items;
  $('#treeBox').dxDropDownBox('instance')?.repaint();
  return items;
}).catch((error) => {
  console.error('Failed to load lookup data:', error);
});

$(() => {
  let treeList;
  let searchTimerId;
  let hasLoadedItems = false;
  let searchTimeout = 1000;
  const storeKey = 'Task_ID';
  // If the key of the first record is unknown, you can request
  // data from the server to retrieve it from the first returned item.
  const defaultValue = 22;

  const dataSource = new DevExpress.data.DataSource({
    store: makeAsyncDataSource(storeKey, `${url}/Tasks`, {
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
      onLoaded(e) {
        hasLoadedItems = !!e.length;
      },
    }),
  });

  const dropDownBox = $('#treeBox').dxDropDownBox({
    showClearButton: true,
    width: '40vw',
    value: defaultValue,
    acceptCustomValue: true,
    openOnFieldClick: false,
    valueChangeEvent: '',
    height: '100%',
    valueExpr: storeKey,
    dataSource,
    displayExpr: (item) => displayExpr(item, lookupItems),
    onInput(e) {
      clearTimeout(searchTimerId);
      const instance = e.component;
      if (!instance.option('opened')) instance.open();
      const searchExprVal = $('#searchExprOption').dxSelectBox('instance').option('value');
      searchTimerId = performSearch({
        e, lookupDataSource, dataSource, searchTimeout, searchExprVal,
      });
    },
    onOpened(e) {
      handleDropDownOpened({ e, treeList });
    },
    onOptionChanged(e) {
      const listFirstLoadCompleted = e.component.option('listFirstLoadCompleted');
      if (e.name === 'text' && !e.value && listFirstLoadCompleted) {
        treeList.pageIndex(0).then(() => {
          treeList.option('focusedRowIndex', 0);
          treeList.option('focusedRowKey', firstRowKey);
        });
      }
    },
    onValueChanged(args) {
      clearTimeout(searchTimerId);
      if (args.value) {
        args.component.close();
      }
    },
    onKeyDown(e) {
      const instance = e.component;
      if (e.event.key !== 'ArrowDown') return;
      if (!instance.option('opened')) {
        instance.isKeyDown = true;
        instance.open();
      } else if (treeList) {
        treeList.focus();
      }
    },
    onClosed(e) {
      resetSearchState({
        e, hasLoadedItems, treeList, dataSource,
      });
    },
    contentTemplate(templateData, container) {
      const dropDownInstance = templateData.component;
      const value = dropDownInstance.option('value');
      const treeListContainer = $('<div>').dxTreeList({
        dataSource,
        hasItemsExpr: 'Has_Items',
        remoteOperations: {
          filtering: true,
          sorting: true,
          grouping: true,
        },
        parentIdExpr: 'Task_Parent_ID',
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        height: 400,
        width: '100%',
        focusedRowEnabled: true,
        selection: { mode: 'single' },
        scrolling: { mode: 'virtual' },
        selectedRowKeys: [value],
        focusedRowKey: value,
        onContentReady: () => {
          const listFirstLoadCompleted = dropDownInstance
            .option('listFirstLoadCompleted');
          if (!listFirstLoadCompleted) {
            dropDownInstance.option('listFirstLoadCompleted', true);
          }
        },
        onFocusedRowChanged() {
          if (dropDownBox.option('focusAfterLoading')) {
            dropDownBox.focus();
            dropDownBox.option('focusAfterLoading', false);
          }
        },
        onKeyDown: (args) => {
          const list = args.component;
          if (args.event.key === 'Enter') {
            list.selectRows([list.option('focusedRowKey')], false);
          }
        },
        columns: [{
          dataField: 'Task_ID',
        },
        {
          dataField: 'Task_Assigned_Employee_ID',
          caption: 'Employee',
          minWidth: 120,
          lookup: {
            dataSource: lookupDataSource,
            valueExpr: 'ID',
            displayExpr: 'Name',
          },
        },
        {
          dataField: 'Task_Subject',
          width: 300,
        }, {
          dataField: 'Task_Start_Date',
          caption: 'Start Date',
          dataType: 'date',
        }, {
          dataField: 'Task_Status',
          caption: 'Status',
        }, {
          dataField: 'Task_Due_Date',
          caption: 'Due Date',
          dataType: 'date',
        }],
        onSelectionChanged(args) {
          const { resetSelection, autoSelection } = args.component.option();
          if (!resetSelection) {
            const keys = args.selectedRowKeys;
            dropDownInstance.option(
              'value',
              keys.length ? keys[0] : null,
            );
            if (!autoSelection) dropDownInstance.focus();
          }
          args.component.option('resetSelection', false);
          args.component.option('autoSelection', false);
        },
      });
      container.append(treeListContainer);
      treeList = treeListContainer.dxTreeList('instance');
      return container;
    },
  }).dxDropDownBox('instance');
  $('#searchExprOption').dxSelectBox({
    items: [{
      name: "'Employee'",
      value: 'Employee',
    }, {
      name: "['Employee','Task_ID']",
      value: ['Employee', 'Task_ID'],
    }, {
      name: "['Employee','Task_Subject']",
      value: ['Employee', 'Task_Subject'],
    }],
    displayExpr: 'name',
    valueExpr: 'value',
    value: 'Employee',
    onValueChanged(e) {
      dataSource.searchExpr(e.value);
    },
  });
  $('#searchTimeoutOption').dxNumberBox({
    min: 0,
    max: 10000,
    value: 1000,
    showSpinButtons: true,
    step: 100,
    onValueChanged(e) {
      searchTimeout = e.value;
    },
  });
});
