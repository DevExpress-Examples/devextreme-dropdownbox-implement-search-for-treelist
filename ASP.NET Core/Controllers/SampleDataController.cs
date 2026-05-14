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
        return DataSourceLoader.Load(SampleData.EmployeeTasks, loadOptions);
    }

    [HttpGet]
    [Route("GetEmployees")]
    public object GetEmployees(DataSourceLoadOptions loadOptions) {
        return DataSourceLoader.Load(SampleData.TaskEmployees, loadOptions);
    }

}
