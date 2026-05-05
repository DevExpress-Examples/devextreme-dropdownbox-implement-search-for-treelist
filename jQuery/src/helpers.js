export const firstRowKey = 1;

const gridLookupFieldName = 'Task_Assigned_Employee_ID';
const lookupFieldName = 'Name';

export function isSearchIncomplete(dropDownBox) {
  let displayValue = dropDownBox.option('displayValue');
  let text = dropDownBox.option('text');
  text = text?.length ? text : '';
  displayValue = displayValue && displayValue.length && displayValue[0];
  return text !== displayValue;
}

export function makeAsyncDataSource(key, loadUrl, callbacks = {}) {
  return DevExpress.data.AspNet.createStore({
    key,
    loadUrl,
    ...callbacks,
  });
}

export function displayExpr(item, lookupItems) {
  if (!lookupItems || !lookupItems.length) return 'Loading...';
  const employeeData = lookupItems.find(
    (employee) => employee.ID === item.Task_Assigned_Employee_ID,
  );
  return `${employeeData.Name}: ${item.Task_Subject} (${item.Task_Status})`;
}

export function performSearch({
  e, lookupDataSource, dataSource, searchTimeout,
}) {
  const dropDownInstance = e.component;
  const text = dropDownInstance.option('text');
  if (isSearchIncomplete(dropDownInstance)) {
    dropDownInstance?.option('focusAfterLoading', true);
    if (text) {
      setTimeout(() => {
        // this function is used to filter lookup column items
        // if you don't have a lookup column, refer to DataGrid example:
        // https://github.com/DevExpress-Examples/devextreme-dropdownbox-filter-data-in-nested-widget
        const searchExprVal = $('#searchExprOption').dxSelectBox('instance').option('value');
        applySearchFilter({
          text,
          lookupField: lookupFieldName,
          dataField: gridLookupFieldName,
          searchExprVal,
          lookupDataSource,
          dataSource,
        });
      }, searchTimeout);
    } else {
      dataSource.filter([]);
      dataSource.load();
    }
  }
}

export function handleDropDownOpened({ e, treeList }) {
  const dropDownBox = e.component;
  const listFirstLoadCompleted = dropDownBox.option('listFirstLoadCompleted');

  const handleOptionChanged = (args) => {
    const list = args.component;
    const triggerCondition = listFirstLoadCompleted
      ? args.name === 'opened'
      : args.name === 'focusedRowKey' || args.name === 'focusedColumnIndex';

    if (triggerCondition) {
      list.off('optionChanged', handleOptionChanged);

      if (listFirstLoadCompleted) {
        requestAnimationFrame(() => {
          list.focus();
          list.option('opened', false);
        });
      } else {
        list.focus();
      }
    }
  };

  treeList.on('optionChanged', handleOptionChanged);

  if (listFirstLoadCompleted) {
    treeList.option('opened', true);
  }
  // the code below resets selection and focused row if a value was cleared
  const isTextEqualToDisplayValue = dropDownBox.option('text') === dropDownBox.option('displayValue')[0];
  if ((dropDownBox.option('value') && !dropDownBox.option('text')) || !isTextEqualToDisplayValue) {
    if (treeList.option('selectedRowKeys').length) {
      treeList.option('resetSelection', true);
      treeList.option('selectedRowKeys', []);
      treeList.pageIndex(0).then(() => {
        treeList.option('focusedRowIndex', 0);
        treeList.option('focusedRowKey', firstRowKey);
      });
    }
  }
}

export function resetSearchState({
  e, loadedItemsLength, treeList, dataSource,
}) {
  const dropDownBox = e.component;
  const text = dropDownBox.option('text');
  const displayValue = dropDownBox.option('displayValue')[0];
  const resetValue = text && text !== displayValue;
  if (!loadedItemsLength) {
    dropDownBox.reset(null);
    dataSource.filter([]);
    dataSource.load();
  }
  if (resetValue) {
    const firstKey = treeList.getKeyByRowIndex(0);
    treeList.selectRows(firstKey);
    treeList.option('focusedRowKey', firstKey);
  }
}

function applySearchFilter({
  text, lookupField, dataField, searchExprVal, lookupDataSource, dataSource,
}) {
  const filter = [lookupField, 'contains', text];
  lookupDataSource.load({ filter }).done((items) => {
    const filterParts = [];

    if (Array.isArray(searchExprVal)) {
      filterParts.push([searchExprVal[1], 'contains', text]);
    }

    if (items.length) {
      items.forEach((item, index) => {
        if (filterParts.length > 0 || index > 0) {
          filterParts.push('or');
        }
        filterParts.push([dataField, '=', item.ID]);
      });
    }
    // [dataField, '=', -1] was added to return "No Data"
    const filterExpr = filterParts.length > 0 ? filterParts : [dataField, '=', -1];

    dataSource.filter(filterExpr);
    dataSource.load();
  });
}
