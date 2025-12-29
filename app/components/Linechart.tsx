"use client";

  import Highcharts from "highcharts";
  import HighchartsReact from "highcharts-react-official";

  export default function LineChart() {
    // Generate random data: 7 days of values between 10-100
    const randomData = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 90) + 10
    );

    const options: Highcharts.Options = {
      title: {
        text: "Weekly Activity",
      },
      xAxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        title: {
          text: "Notes Created",
        },
      },
      series: [
        {
          type: "line",
          name: "Notes",
          data: randomData,
        },
      ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }