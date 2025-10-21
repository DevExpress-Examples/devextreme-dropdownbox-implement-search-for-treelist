using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using ASP_NET_Core.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace ASP_NET_Core.Controllers;

[Route("api/[controller]")]
public class SampleDataController: Controller {

    [HttpGet]
    public object Get(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(SampleData.Orders, loadOptions);
    }

    [HttpGet]
    [Route("GetTasks")]
    public object GetTasks(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(TaskData.Tasks, loadOptions);
    }

    [HttpGet]
    [Route("GetEmployees")]
    public object GetEmployees(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(TaskData.Employees, loadOptions);
    }

    [HttpGet]
    [Route("GetPriorities")]
    public object GetPriorities(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(TaskData.Priorities, loadOptions);
    }

}
