import { Injectable } from '@angular/core';

export interface Task {
  Task_ID: number;
  Task_Parent_ID: number;
  Task_Assigned_Employee_ID: number;
  Task_Completion: number;
  Task_Priority: number;
  Task_Status: string;
  Task_Subject: string;
  Task_Start_Date: string;
  Task_Due_Date: string;
  Task_Assigned_Employee?: Employee;
}

export interface Employee {
  ID: number;
  Name: string;
  Picture: string;
}

export interface Priority {
  id: number;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class Service {
  getTasks(): Task[] {
    return [
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
  }

  getEmployees(): Employee[] {
    return [
      {
        ID: 1,
        Name: 'John Heart',
        Picture: 'images/employees/01.png',
      },
      {
        ID: 2,
        Name: 'Samantha Bright',
        Picture: 'images/employees/04.png',
      },
      {
        ID: 3,
        Name: 'Arthur Miller',
        Picture: 'images/employees/02.png',
      },
      {
        ID: 4,
        Name: 'Robert Reagan',
        Picture: 'images/employees/03.png',
      },
      {
        ID: 5,
        Name: 'Greta Sims',
        Picture: 'images/employees/06.png',
      },
      {
        ID: 7,
        Name: 'Sandra Johnson',
        Picture: 'images/employees/08.png',
      },
      {
        ID: 31,
        Name: 'Nat Maguiree',
        Picture: 'images/employees/34.png',
      },
    ];
  }

  getPriorities(): Priority[] {
    return [
      { id: 1, value: 'Low' },
      { id: 2, value: 'Normal' },
      { id: 3, value: 'High' },
      { id: 4, value: 'Urgent' },
    ];
  }

  getStatuses(): string[] {
    return [
      'Not Started',
      'Need Assistance',
      'In Progress',
      'Deferred',
      'Completed',
    ];
  }
}
