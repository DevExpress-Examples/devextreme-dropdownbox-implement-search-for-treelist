let treeList; let searchTimer; let
  focusedRowKey;

const tasks = [
  {
    Task_ID: 1,
    Task_Assigned_Employee_ID: 1,
    Task_Subject: 'Plans 2015',
    Task_Start_Date: '2015-01-01T00:00:00',
    Task_Due_Date: '2015-04-01T00:00:00',
    Task_Status: 'Completed',
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 0,
  },
  {
    Task_ID: 2,
    Task_Assigned_Employee_ID: 2,
    Task_Subject: 'Health Insurance',
    Task_Start_Date: '2015-02-12T00:00:00',
    Task_Due_Date: '2015-05-30T00:00:00',
    Task_Status: 'In Progress',
    Task_Priority: 4,
    Task_Completion: 75,
    Task_Parent_ID: 0,
  },
  {
    Task_ID: 3,
    Task_Assigned_Employee_ID: 4,
    Task_Subject: 'New Brochures',
    Task_Start_Date: '2015-02-17T00:00:00',
    Task_Due_Date: '2015-03-01T00:00:00',
    Task_Status: 'Completed',
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0,
  },
  {
    Task_ID: 4,
    Task_Assigned_Employee_ID: 31,
    Task_Subject: 'Training',
    Task_Start_Date: '2015-03-02T00:00:00',
    Task_Due_Date: '2015-06-29T00:00:00',
    Task_Status: 'Completed',
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0,
  },
  {
    Task_ID: 5,
    Task_Assigned_Employee_ID: 5,
    Task_Subject: 'NDA',
    Task_Start_Date: '2015-03-12T00:00:00',
    Task_Due_Date: '2015-05-01T00:00:00',
    Task_Status: 'In Progress',
    Task_Priority: 3,
    Task_Completion: 90,
    Task_Parent_ID: 0,
  },
  {
    Task_ID: 28,
    Task_Assigned_Employee_ID: 7,
    Task_Subject: 'Prepare 2015 Financial',
    Task_Start_Date: '2015-01-15T00:00:00',
    Task_Due_Date: '2015-01-31T00:00:00',
    Task_Status: 'Completed',
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 1,
  },
  {
    Task_ID: 29,
    Task_Assigned_Employee_ID: 4,
    Task_Subject: 'Prepare 2015 Marketing Plan',
    Task_Start_Date: '2015-01-01T00:00:00',
    Task_Due_Date: '2015-01-31T00:00:00',
    Task_Status: 'Completed',
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 1,
  },
  {
    Task_ID: 30,
    Task_Assigned_Employee_ID: 2,
    Task_Subject: 'Review Health Insurance Options Under the Affordable Care Act',
    Task_Start_Date: '2015-02-12T00:00:00',
    Task_Due_Date: '2015-04-25T00:00:00',
    Task_Status: 'In Progress',
    Task_Priority: 4,
    Task_Completion: 50,
    Task_Parent_ID: 2,
  },
  {
    Task_ID: 31,
    Task_Assigned_Employee_ID: 1,
    Task_Subject: 'Choose between PPO and HMO Health Plan',
    Task_Start_Date: '2015-02-15T00:00:00',
    Task_Due_Date: '2015-04-15T00:00:00',
    Task_Status: 'In Progress',
    Task_Priority: 4,
    Task_Completion: 75,
    Task_Parent_ID: 2,
  },
];

const employees = [
  {
    ID: 1,
    Name: 'John Heart',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
  },
  {
    ID: 2,
    Name: 'Samantha Bright',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/04.png',
  },
  {
    ID: 3,
    Name: 'Arthur Miller',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/02.png',
  },
  {
    ID: 4,
    Name: 'Robert Reagan',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/03.png',
  },
  {
    ID: 5,
    Name: 'Greta Sims',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png',
  },
  {
    ID: 7,
    Name: 'Sandra Johnson',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/08.png',
  },
  {
    ID: 31,
    Name: 'Nat Maguiree',
    Picture: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/34.png',
  },
];

const priorities = [
  { id: 1, value: 'Low' },
  { id: 2, value: 'Normal' },
  { id: 3, value: 'High' },
  { id: 4, value: 'Urgent' },
];

$(() => {
  const treeListData = $.map(tasks, (task) => {
    task.Task_Assigned_Employee = null;
    $.each(employees, (index, employee) => {
      if (employee.ID === task.Task_Assigned_Employee_ID) {
        task.Task_Assigned_Employee = employee;
      }
    });
    return task;
  });

  const dataSource = new DevExpress.data.DataSource({
    store: treeListData,
  });

  $('#treeBox').dxDropDownBox({
    onValueChanged(e) {
      if (!e.value) {
        treeList.deselectAll();
        return;
      }
      if (Array.isArray(e.previousValue) && e.previousValue.length > 0 && typeof e.value === 'string') {
        treeList.deselectRows(e.previousValue.pop());
        e.component.option('value', e.previousValue);
      }
    },
    showClearButton: true,
    acceptCustomValue: true,
    openOnFieldClick: false,
    valueChangeEvent: 'input',
    hoverStateEnabled: true,
    focusedRowIndex: 0,
    remoteOperations: true,
    height: '100%',
    width: '100%',
    keyExpr: 'Task_ID',
    valueExpr: 'Task_ID',
    dataSource: treeListData,
    displayExpr(item) {
      return item.Task_Subject;
    },
    onInput(e) {
      const dropDownInstance = e.component;
      if (!dropDownInstance.option('opened')) {
        dropDownInstance.open();
      }
      const text = dropDownInstance.option('text');
      const value = dropDownInstance.option('value');
      if (typeof value === 'string') {
        treeList.option('searchPanel.text', text);
      }
    },
    onOpened(e) {
      setTimeout(() => {
        e.component.focus();
      });
    },
    onKeyDown(e) {
      const dropDownInstance = e.component;
      if (e.event.keyCode !== 40) return;
      if (!dropDownInstance.option('opened')) {
        dropDownInstance.open();
      } else {
        const treeListInstance = treeList.instance();
        let focusedIndex = treeListInstance.option('focusedRowIndex');
        const visibleRows = treeListInstance.getVisibleRows().length - 1;
        if (focusedIndex === -1 || visibleRows < focusedIndex) {
          focusedIndex = 0;
        }
        treeList.focus(treeListInstance.getRowElement(focusedIndex));
      }
    },
    contentTemplate(templateData, container) {
      const dropDownInstance = templateData.component;
      const treeListContainer = $('<div>').dxTreeList({
        dataSource: tasks,
        keyExpr: 'Task_ID',
        parentIdExpr: 'Task_Parent_ID',
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        height: '100%',
        width: '100%',
        focusedRowEnabled: true,
        searchPanel: {
          highlightSearchText: false,
        },
        selection: {
          mode: 'multiple',
        },
        columns: [{
          dataField: 'Task_ID',
        }, {
          dataField: 'Task_Subject',
          width: 300,
        }, {
          dataField: 'Task_Assigned_Employee_ID',
          caption: 'Assigned',
          allowSorting: false,
          minWidth: 200,
          lookup: {
            dataSource: employees,
            valueExpr: 'ID',
            displayExpr: 'Name',
          },
        }, {
          dataField: 'Task_Status',
          caption: 'Status',
          minWidth: 100,
          lookup: {
            dataSource: [
              'Not Started',
              'Need Assistance',
              'In Progress',
              'Deferred',
              'Completed',
            ],
          },
        }, {
          dataField: 'Task_Priority',
          caption: 'Priority',
          lookup: {
            dataSource: priorities,
            valueExpr: 'id',
            displayExpr: 'value',
          },
          visible: false,
        }, {
          dataField: 'Task_Completion',
          caption: '% Completed',
          customizeText(cellInfo) {
            return `${cellInfo.valueText}%`;
          },
          visible: false,
        }, {
          dataField: 'Task_Start_Date',
          caption: 'Start Date',
          dataType: 'date',
        }, {
          dataField: 'Task_Due_Date',
          caption: 'Due Date',
          dataType: 'date',
        }],
        onSelectionChanged(selectionEvent) {
          const keys = selectionEvent.selectedRowKeys;
          const hasSelection = keys.length;
          dropDownInstance.option('value', hasSelection ? keys : null);
        },
      });
      container.append(treeListContainer);
      treeList = treeListContainer.dxTreeList('instance');
      return container;
    },
  });
});
