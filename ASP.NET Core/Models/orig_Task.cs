using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DropDownBox.Models
{
    public class Task
    {
		public int Task_ID { get; set; }
		public int Task_Parent_ID { get; set; }
		public int Task_Assigned_Employee_ID { get; set; }
		public int Task_Completion { get; set; }
		public int Task_Priority { get; set; }
		public string Task_Status { get; set; }
		public string Task_Subject { get; set; }
		public string Task_Start_Date { get; set; }
		public string Task_Due_Date { get; set; }
		public Employee Task_Assigned_Employee { get; set; }
    }
}
