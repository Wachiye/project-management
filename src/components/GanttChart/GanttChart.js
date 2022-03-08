import React from 'react'
import Chart from 'react-google-charts'

const tasksToRows = (tasks) => {
    let rows = []
    tasks.forEach(task => {
        let row = [task._id, task.name, new Date(task.startDate), new Date(task.endDate), task.duration, task.progress, null];
        rows.push(row);
    });

    return rows;
}

const GanttChart = ({tasks}) => {
    let chartColumns = [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" }
      ];

    let chartRows = tasksToRows(tasks);

    let chartData = [chartColumns, ...chartRows];

    return (
        <div className="card-text my-1">
          <Chart
            width={'100%'}
            chartType="Gantt"
            loader={<div className='font-italic text-info'>Loading Chart. This may take longer. Please wait ...</div>}
            data={ chartData}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      )

}

export default GanttChart