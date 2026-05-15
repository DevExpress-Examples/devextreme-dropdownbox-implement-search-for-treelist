using System;
using System.Collections.Generic;
using System.Linq;
using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace ASP_NET_Core.Controllers;

[Route("api/[controller]")]
public class SampleDataController: Controller {


    [HttpGet]
    [Route("GetTasks")]
    public object GetTasks(DataSourceLoadOptions loadOptions) {
        var tasks = SampleData.EmployeeTasks;
        var projected = tasks.Select(d => new EmployeeTask {
            Task_ID = d.Task_ID,
            Task_Parent_ID = d.Task_Parent_ID,
            Task_Owner_ID = d.Task_Owner_ID,
            Task_Assigned_Employee_ID = d.Task_Assigned_Employee_ID,
            Task_Completion = d.Task_Completion,
            Task_Priority = d.Task_Priority,
            Task_Status = d.Task_Status,
            Task_Subject = d.Task_Subject,
            Task_Start_Date = d.Task_Start_Date,
            Task_Due_Date = d.Task_Due_Date,
            Has_Items = tasks.Any(t => t.Task_Parent_ID == d.Task_ID)
        });
        return DataSourceLoader.Load(projected, loadOptions);
    }

    [HttpGet]
    [Route("GetEmployees")]
    public object GetEmployees(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(SampleData.TaskEmployees, loadOptions);
    }

}
