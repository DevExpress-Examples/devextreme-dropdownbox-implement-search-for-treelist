import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Service, Task, Employee, Priority } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'DropDownBox';
  focusedRowIndex: any;
  treeList: any;
  tasks: Task[];
  employees: Employee[];
  priorities: Priority[];
  statuses: string[];
  ddbInstance: any;
  searchPanelText: any = "";
  text: any = "";
  value: any;
  isOpened: boolean = false;
  onInitialized(e: any){
    this.ddbInstance = e.component;
  }

  treeListInitialized(e: any){
    this.treeList = e.component;
  }

  displayExpr(item: any){
    return typeof item === "object" ? item.Task_Subject : item;
  }

  customizeText(cellInfo: any){
    return cellInfo.valueText + "%";
  }
  
  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.employees = service.getEmployees();
    this.priorities = service.getPriorities();

    this.statuses = [
      "Not Started",
      "Need Assistance",
      "In Progress",
      "Deferred",
      "Completed"
    ];
  }

  onInput(e: any){
    if(!this.isOpened) this.isOpened = true;
    if(typeof this.value === "string"){ 
      if(this.treeList) this.searchPanelText = e.component.option("text")
    };
  }

  onOpened(e:any){
    setTimeout(()=>{
      e.component.focus();
    });
  }

  onValueChanged(e:any){
    
    if(!this.value){
      if(this.treeList) this.treeList.deselectAll()
      return;
    }
    if(Array.isArray(e.previousValue) && e.previousValue.length > 0 && typeof this.value === "string"){
      this.value = e.previousValue;
      this.treeList.deselectRows(e.previousValue.pop());
    }
  }

  onKeyDown(e: any){
    if (e.event.keyCode !== 40) return;
    if (!this.ddbInstance.option("opened")) {
      this.ddbInstance.open();
    } else{
      let visibleRows = this.treeList.getVisibleRows().length -1;
      if(this.focusedRowIndex === -1 || visibleRows < this.focusedRowIndex) this.focusedRowIndex = 0; 
      this.treeList.focus(this.treeList.getRowElement(this.focusedRowIndex));
    } 
  }
  
  getCompletionText(cellInfo: any) {
    return cellInfo.valueText + "%";
  }
  

  onSelectionChanged(e:any){
    let keys = e.selectedRowKeys,
    hasSelection = keys.length;
    this.value = hasSelection ? keys : null;
  }
}
