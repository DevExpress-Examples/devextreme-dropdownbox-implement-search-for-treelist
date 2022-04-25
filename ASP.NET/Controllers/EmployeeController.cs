using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DropDownBox.Models;
using DevExtreme.AspNet.Mvc;
using DevExtreme.AspNet.Data;

namespace DropDownBox.Controllers
{
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {   
        public object Get(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(SampleData.Employees, loadOptions);
        }
    }
}
