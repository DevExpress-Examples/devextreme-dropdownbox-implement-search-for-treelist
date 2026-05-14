const lookupUrl = '/api/SampleData/GetEmployees';
const gridLookupFieldName = 'Task_Assigned_Employee_ID';
const lookupFieldName = 'Name';

let lookupItems = [];
let treeList;
let searchTimerId;
let hasLoadedItems = false;
let searchTimeout = 1000;
let searchExprVal = 'Employee';
const firstRowKey = 1;

function getCurrentSearchExpr() {
    return searchExprVal && searchExprVal.includes(',') ? searchExprVal.split(',') : searchExprVal;
}

const lookupDataSource = DevExpress.data.AspNet.createStore({
    key: 'ID',
    loadUrl: lookupUrl,
});

lookupDataSource.load().then((items) => {
    lookupItems = items;
    $('#treeBox').dxDropDownBox('instance')?.repaint();
    return items;
}).catch((error) => {
    console.error('Failed to load lookup data:', error);
});

function displayExpr(item) {
    if (!lookupItems || !lookupItems.length) return 'Loading...';
    if (!item) return '';
    const employeeData = lookupItems.find(
        (employee) => employee.ID === item.Task_Assigned_Employee_ID,
    );
    if (!employeeData) return item.Task_Subject || '';
    return `${employeeData.Name}: ${item.Task_Subject} (${item.Task_Status})`;
}

function isSearchIncomplete(dropDownBox) {
    let displayValue = dropDownBox.option('displayValue');
    let text = dropDownBox.option('text');
    text = text?.length ? text : '';
    displayValue = displayValue && displayValue.length && displayValue[0];
    return text !== displayValue;
}

function applySearchFilter(text, ds) {
    const filter = [lookupFieldName, 'contains', text];
    lookupDataSource.load({ filter }).done((items) => {
        const filterParts = [];

        if (Array.isArray(getCurrentSearchExpr())) {
            filterParts.push([getCurrentSearchExpr()[1], 'contains', text]);
        }

        if (items.length) {
            items.forEach((item, index) => {
                if (filterParts.length > 0 || index > 0) {
                    filterParts.push('or');
                }
                filterParts.push([gridLookupFieldName, '=', item.ID]);
            });
        }

        // [gridLookupFieldName, '=', -1] was added to return "No Data"
        const filterExpr = filterParts.length > 0
            ? filterParts : [gridLookupFieldName, '=', -1];

        ds.filter(filterExpr);
        ds.load();
    });
}

function performSearch(e, ds) {
    const dropDownInstance = e.component;
    const text = dropDownInstance.option('text');
    if (isSearchIncomplete(dropDownInstance)) {
        dropDownInstance.option('focusAfterLoading', true);
        if (text) {
            return setTimeout(() => {
                // this function is used to filter lookup column items
                // if you don't have a lookup column, refer to DataGrid example:
                // https://github.com/DevExpress-Examples/devextreme-dropdownbox-filter-data-in-nested-widget
                applySearchFilter(text, ds);
            }, searchTimeout);
        }
        ds.filter([]);
        ds.load();
    }
    return null;
}

function handleDropDownOpened(e) {
    if (!treeList) return;
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

    const { text, value } = dropDownBox.option();
    const isTextEqualToDisplayValue = text === dropDownBox.option('displayValue')[0];
    const shouldClearSelection = (value && !text) || !isTextEqualToDisplayValue;
    if (shouldClearSelection && treeList.option('selectedRowKeys').length) {
        treeList.option('resetSelection', true);
        treeList.selectRows([]);
        treeList.pageIndex(0).then(() => {
            treeList.option('focusedRowIndex', 0);
            treeList.option('focusedRowKey', firstRowKey);
        });
    }
}

function resetSearchState(e, dataSource) {
    if (!treeList) return;
    const dropDownBox = e.component;
    const { text } = dropDownBox.option();
    const displayValue = dropDownBox.option('displayValue')[0];
    const resetValue = text && text !== displayValue;
    if (!hasLoadedItems) {
        dropDownBox.reset(null);
        dataSource.filter(null);
        dataSource.load();
    }
    if (resetValue && !treeList.option('selectedRowKeys').length) {
        treeList.option('autoSelection', true);
        const firstKey = treeList.getKeyByRowIndex(0);
        treeList.selectRows([firstKey]);
        treeList.option('focusedRowKey', firstKey);
    }
}

function dropDownBoxOnInput(e) {
    clearTimeout(searchTimerId);
    const instance = e.component;
    if (!instance.option('opened')) instance.open();
    const dataSource = treeList.getDataSource();
    searchTimerId = performSearch(e, dataSource);
}

function dropDownBoxOnOpened(e) {
    handleDropDownOpened(e);
}

function dropDownBoxOnOptionChanged(e) {
    const listFirstLoadCompleted = e.component.option('listFirstLoadCompleted');
    if (e.name === 'text' && !e.value && listFirstLoadCompleted) {
        treeList.pageIndex(0).then(() => {
            treeList.option('focusedRowIndex', 0);
            treeList.option('focusedRowKey', firstRowKey);
        });
    }
}

function dropDownBoxOnValueChanged(args) {
    clearTimeout(searchTimerId);
    if (args.value) {
        args.component.close();
    }
}

function dropDownBoxOnKeyDown(e) {
    const instance = e.component;
    if (e.event.key !== 'ArrowDown') return;
    if (!instance.option('opened')) {
        instance.open();
    } else if (treeList) {
        treeList.focus();
    }
}

function dropDownBoxOnClosed(e) {
    const dataSource = treeList.getDataSource();
    resetSearchState(e, dataSource);
}

function treeListOnInitialized(e) {
    treeList = e.component;
    // Replace the Razor MVC DataSource with the shared JS DataSource
    // so that search filtering in the DropDownBox applies to the TreeList too
    const ds = treeList.getDataSource();
    if (ds) {
        ds.searchExpr(getCurrentSearchExpr());
    }
}

function treeListOnContentReady() {
    const dropDownInstance = $('#treeBox').dxDropDownBox('instance');
    if (!dropDownInstance) return;
    const listFirstLoadCompleted = dropDownInstance.option('listFirstLoadCompleted');
    if (!listFirstLoadCompleted) {
        dropDownInstance.option('listFirstLoadCompleted', true);
    }
}

function treeListOnFocusedRowChanged() {
    const dropDownInstance = $('#treeBox').dxDropDownBox('instance');
    if (!dropDownInstance) return;
    if (dropDownInstance.option('focusAfterLoading')) {
        dropDownInstance.focus();
        dropDownInstance.option('focusAfterLoading', false);
    }
}

function treeListOnKeyDown(args) {
    const list = args.component;
    if (args.event.key === 'Enter') {
        list.selectRows([list.option('focusedRowKey')], false);
    }
}

function treeListOnSelectionChanged(args) {
    const { resetSelection, autoSelection } = args.component.option();
    const dropDownInstance = $('#treeBox').dxDropDownBox('instance');
    if (!resetSelection) {
        const keys = args.selectedRowKeys;
        dropDownInstance.option('value', keys.length ? keys[0] : null);
        if (!autoSelection) dropDownInstance.focus();
    }
    args.component.option('resetSelection', false);
    args.component.option('autoSelection', false);
}

function onSearchExprChanged(e) {
    searchExprVal = e.value;
    treeList?.getDataSource().searchExpr(getCurrentSearchExpr());
}

function onSearchTimeoutChanged(e) {
    searchTimeout = e.value;
}

function postProcess(items) {
    hasLoadedItems = items.length > 0;
    return items;
}
