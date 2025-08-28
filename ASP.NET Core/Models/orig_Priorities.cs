using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DropDownBox.Models
{
    public partial class SampleData
    {
        public static IEnumerable<Priority> Priorities = new[]
        {
            new Priority{ id= 1, value= "Low" },
            new Priority{ id= 2, value= "Normal" },
            new Priority{ id= 3, value= "Urgent" },
            new Priority{ id= 4, value= "High" }
        };
    }
}
