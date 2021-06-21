var treeList, searchTimer, focusedRowKey;
$(function() {
    var treeListData = $.map(tasks, function(task, _) {
        task.Task_Assigned_Employee = null;
        $.each(employees, function(_, employee) {
            if(employee.ID == task.Task_Assigned_Employee_ID)
                task.Task_Assigned_Employee = employee;
        });
        return task;
	});
  
  var dataSource = new DevExpress.data.DataSource({
    store: treeListData,
  });
	$("#treeBox").dxDropDownBox({
    onValueChanged: function(e){
      if(!e.value){
        treeList.deselectAll()
        return;
      }
      if(Array.isArray(e.previousValue) && e.previousValue.length > 0 && typeof e.value === "string"){
        treeList.deselectRows(e.previousValue.pop());
        e.component.option("value", e.previousValue)
      }
    },
    showClearButton: true,
    acceptCustomValue: true,
    openOnFieldClick: false,
    valueChangeEvent: "input",
    hoverStateEnabled: true,
    focusedRowIndex: 0,
    remoteOperations: true,
    height: "100%",
    width: '100%',
    keyExpr: "Task_ID",
    valueExpr: "Task_ID",
    dataSource: treeListData,
    displayExpr: function(item){
      return item.Task_Subject;
    },
    onInput: function(e){
      let ddbInstance = e.component;
      if(!ddbInstance.option("opened")) ddbInstance.open();
      let text = ddbInstance.option("text");
      let value = ddbInstance.option("value");
      if(typeof value === "string"){ 
        treeList.option("searchPanel.text", text)
      };
    },
    onOpened:function(e){
      setTimeout(()=>{
        e.component.focus();
      });
    },
    onKeyDown: function(e){
      let ddbInstance = e.component;
      if (e.event.keyCode !== 40) return;
      if (!ddbInstance.option("opened")) {
          ddbInstance.open();
      } else{
        let treeListInstance = treeList.instance();
        let focusedIndex = treeListInstance.option("focusedRowIndex");
        let visibleRows = treeListInstance.getVisibleRows().length -1;
        if(focusedIndex === -1 || visibleRows < focusedIndex) focusedIndex = 0; 
        treeList.focus(treeListInstance.getRowElement(focusedIndex));
        // treeList.focus(treeListInstance.getRowElement(0));
      } 
    },
    contentTemplate: function(e, container){
       let ddbInstance = e.component;
       let treeListContainer = $("<div>").dxTreeList({
          dataSource: tasks,
          keyExpr: "Task_ID",
          parentIdExpr: "Task_Parent_ID",
          columnAutoWidth: true,
          wordWrapEnabled: true,
          showBorders: true,
          height: "100%",
          width: '100%',
          focusedRowEnabled: true,
          searchPanel: {
              highlightSearchText: false,
          },
          selection: {
              mode: "multiple"
          },
          columns: [{
              dataField: "Task_ID"
          },{
              dataField: "Task_Subject",
              width: 300
          }, {
              dataField: "Task_Assigned_Employee_ID",
              caption: "Assigned",
              allowSorting: false,
              minWidth: 200,
              lookup: {
                  dataSource: employees,
                  valueExpr: "ID",
                  displayExpr: "Name"
              }
          }, {
              dataField: "Task_Status",
              caption: "Status",
              minWidth: 100,
              lookup: {
                  dataSource: [
                      "Not Started",
                      "Need Assistance",
                      "In Progress",
                      "Deferred",
                      "Completed"
                  ]
              }
          }, {
              dataField: "Task_Priority",
              caption: "Priority",
              lookup: {
                  dataSource: priorities,
                  valueExpr: "id",
                  displayExpr: "value"
              },
              visible: false
          }, {
              dataField: "Task_Completion",
              caption: "% Completed",
              customizeText: function(cellInfo) {
                  return cellInfo.valueText + "%";
              },
              visible: false
          }, {
              dataField: "Task_Start_Date",
              caption: "Start Date",
              dataType: "date"
          }, {
              dataField: "Task_Due_Date",
              caption: "Due Date",
              dataType: "date"
          }],
         onSelectionChanged: function(e){
            let keys = e.selectedRowKeys,
            hasSelection = keys.length;
            ddbInstance.option("value", hasSelection ? keys : null);
         }
      }); 
      container.append(treeListContainer);
      treeList = treeListContainer.dxTreeList("instance");
      return container;
    }
  });
});