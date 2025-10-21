using System;
using System.Collections.Generic;

namespace ASP_NET_Core.Models;

public class TaskItem
{
    public int Task_ID { get; set; }
    public int Task_Parent_ID { get; set; }
    public int Task_Assigned_Employee_ID { get; set; }
    public int Task_Completion { get; set; }
    public int Task_Priority { get; set; }
    public string Task_Status { get; set; } = string.Empty;
    public string Task_Subject { get; set; } = string.Empty;
    public DateTime Task_Start_Date { get; set; }
    public DateTime Task_Due_Date { get; set; }
}

public class Employee
{
    public int ID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
}

public class Priority
{
    public int id { get; set; }
    public string value { get; set; } = string.Empty;
}

public static class TaskData
{
    public static List<TaskItem> Tasks = new List<TaskItem>
    {
        new TaskItem
        {
            Task_ID = 1,
            Task_Assigned_Employee_ID = 1,
            Task_Subject = "Plans 2015",
            Task_Start_Date = new DateTime(2015, 1, 1),
            Task_Due_Date = new DateTime(2015, 4, 1),
            Task_Status = "Completed",
            Task_Priority = 4,
            Task_Completion = 100,
            Task_Parent_ID = 0
        },
        new TaskItem
        {
            Task_ID = 2,
            Task_Assigned_Employee_ID = 2,
            Task_Subject = "Health Insurance",
            Task_Start_Date = new DateTime(2015, 2, 12),
            Task_Due_Date = new DateTime(2015, 5, 30),
            Task_Status = "In Progress",
            Task_Priority = 4,
            Task_Completion = 75,
            Task_Parent_ID = 0
        },
        new TaskItem
        {
            Task_ID = 3,
            Task_Assigned_Employee_ID = 4,
            Task_Subject = "New Brochures",
            Task_Start_Date = new DateTime(2015, 2, 17),
            Task_Due_Date = new DateTime(2015, 3, 1),
            Task_Status = "Completed",
            Task_Priority = 3,
            Task_Completion = 100,
            Task_Parent_ID = 0
        },
        new TaskItem
        {
            Task_ID = 4,
            Task_Assigned_Employee_ID = 31,
            Task_Subject = "Training",
            Task_Start_Date = new DateTime(2015, 3, 2),
            Task_Due_Date = new DateTime(2015, 6, 29),
            Task_Status = "Completed",
            Task_Priority = 3,
            Task_Completion = 100,
            Task_Parent_ID = 0
        },
        new TaskItem
        {
            Task_ID = 5,
            Task_Assigned_Employee_ID = 5,
            Task_Subject = "NDA",
            Task_Start_Date = new DateTime(2015, 3, 12),
            Task_Due_Date = new DateTime(2015, 5, 1),
            Task_Status = "In Progress",
            Task_Priority = 3,
            Task_Completion = 90,
            Task_Parent_ID = 0
        },
        new TaskItem
        {
            Task_ID = 28,
            Task_Assigned_Employee_ID = 7,
            Task_Subject = "Prepare 2015 Financial",
            Task_Start_Date = new DateTime(2015, 1, 15),
            Task_Due_Date = new DateTime(2015, 1, 31),
            Task_Status = "Completed",
            Task_Priority = 4,
            Task_Completion = 100,
            Task_Parent_ID = 1
        },
        new TaskItem
        {
            Task_ID = 29,
            Task_Assigned_Employee_ID = 4,
            Task_Subject = "Prepare 2015 Marketing Plan",
            Task_Start_Date = new DateTime(2015, 1, 1),
            Task_Due_Date = new DateTime(2015, 1, 31),
            Task_Status = "Completed",
            Task_Priority = 4,
            Task_Completion = 100,
            Task_Parent_ID = 1
        },
        new TaskItem
        {
            Task_ID = 30,
            Task_Assigned_Employee_ID = 2,
            Task_Subject = "Review Health Insurance Options Under the Affordable Care Act",
            Task_Start_Date = new DateTime(2015, 2, 12),
            Task_Due_Date = new DateTime(2015, 4, 25),
            Task_Status = "In Progress",
            Task_Priority = 4,
            Task_Completion = 50,
            Task_Parent_ID = 2
        },
        new TaskItem
        {
            Task_ID = 31,
            Task_Assigned_Employee_ID = 1,
            Task_Subject = "Choose between PPO and HMO Health Plan",
            Task_Start_Date = new DateTime(2015, 2, 15),
            Task_Due_Date = new DateTime(2015, 4, 15),
            Task_Status = "In Progress",
            Task_Priority = 4,
            Task_Completion = 75,
            Task_Parent_ID = 2
        }
    };

    public static List<Employee> Employees = new List<Employee>
    {
        new Employee { ID = 1, Name = "John Heart", Picture = "images/employees/01.png" },
        new Employee { ID = 2, Name = "Samantha Bright", Picture = "images/employees/04.png" },
        new Employee { ID = 3, Name = "Arthur Miller", Picture = "images/employees/02.png" },
        new Employee { ID = 4, Name = "Robert Reagan", Picture = "images/employees/03.png" },
        new Employee { ID = 5, Name = "Greta Sims", Picture = "images/employees/06.png" },
        new Employee { ID = 7, Name = "Sandra Johnson", Picture = "images/employees/08.png" },
        new Employee { ID = 31, Name = "Nat Maguiree", Picture = "images/employees/34.png" }
    };

    public static List<Priority> Priorities = new List<Priority>
    {
        new Priority { id = 1, value = "Low" },
        new Priority { id = 2, value = "Normal" },
        new Priority { id = 3, value = "High" },
        new Priority { id = 4, value = "Urgent" }
    };
}