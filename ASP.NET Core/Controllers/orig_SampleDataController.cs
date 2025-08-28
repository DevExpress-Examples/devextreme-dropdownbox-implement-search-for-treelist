using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using DropDownBox.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace DropDownBox.Controllers {

    [Route("api/[controller]")]
    public class SampleDataController : Controller {

        readonly IEnumerable<Task> tasks = SampleData.Tasks;
        readonly IEnumerable<Employee> employees = SampleData.Employees;
        
        public object Get(DataSourceLoadOptions loadOptions)
        {
            var joinedTasks = tasks.Join(employees,
                tasks => tasks.Task_Assigned_Employee_ID,
                employees => employees.ID,
                (tasks, employees) =>
                new{
                    Task_ID = tasks.Task_ID,
                    Task_Parent_ID = tasks.Task_Parent_ID,
                    Task_Assigned_Employee_ID = tasks.Task_Assigned_Employee_ID,
                    Task_Completion = tasks.Task_Completion,
                    Task_Priority = tasks.Task_Priority,
                    Task_Status = tasks.Task_Status,
                    Task_Subject = tasks.Task_Subject,
                    Task_Start_Date = tasks.Task_Start_Date,
                    Task_Due_Date = tasks.Task_Due_Date,
                    Task_Assigned_Employee = employees,
                }
            );
            return DataSourceLoader.Load(joinedTasks, loadOptions);
        }

    }
}