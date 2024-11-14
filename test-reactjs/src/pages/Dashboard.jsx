import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { createSensor, getSensors } from "../services/sensorService";
import { Line, Bar, Pie } from "react-chartjs-2";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);
import "chartjs-adapter-date-fns";

function Dashboard() {
  const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
  const topic = "/tohotechnology";
  const [sensor, setSensor] = useState({
    suhu: "-",
    temperature: "-",
    status_a: "-",
    status_b: "-",
  });
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: "Suhu",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Temperature",
        data: [],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  });

  const fetchLatestSensor = async () => {
    try {
      const response = await getSensors(1);
      const modifiedData = response.data[0].map((sensor) => {
        let newStatusA, newStatusB;
        if (sensor.status_a == 0) newStatusA = "Off";
        else newStatusA = "On";

        if (sensor.status_b == 0) newStatusB = "Off";
        else newStatusB = "On";

        return {
          ...sensor,
          status_a_update: newStatusA,
          status_b_update: newStatusB,
        };
      });
      console.log(modifiedData[0]);
      setSensor(modifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const sendData = async (data) => {
    try {
      const response = await createSensor(data);
      if (response.meta.code == 200) {
        // console.log("Success!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLineData = async () => {
    try {
      const latestData = await getSensors(20);

      // Membalikkan urutan data agar data terbaru di sebelah kanan
      const reversedData = latestData.data.reverse();

      // Mendapatkan labels, suhu, dan temperatur dari data yang dibalik
      const labels = reversedData.map((item) =>
        moment(item.created_at).format("DD/MM/yy HH:mm:ss")
      );
      const suhuData = reversedData.map((item) => item.suhu);
      const temperatureData = reversedData.map((item) => item.temperature);

      setLineData({
        labels: labels,
        datasets: [
          {
            label: "Suhu",
            data: suhuData,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Temperature",
            data: temperatureData,
            fill: false,
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        type: "category",
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "C",
        },
      },
    },
  };

  useEffect(() => {
    fetchLatestSensor();
    getLineData();
    const client = mqtt.connect(brokerUrl);
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", (topic, payload) => {
      const message = payload.toString();
      const dataObject = JSON.parse(message);
      if (dataObject) {
        let status_a, status_b;
        if (dataObject.status_a == 0) status_a = "Off";
        else status_a = "On";
        if (dataObject.status_b == 0) status_b = "Off";
        else status_b = "On";
        setSensor({
          suhu: `${dataObject.suhu} C`,
          temperature: `${dataObject.temperature} C`,
          status_a: status_a,
          status_b: status_b,
        });
        sendData(dataObject);
        getLineData();
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <>
      <MainLayout>
        <div className="mb-5 pt-10">
          <div className="flex justify-between gap-4">
            <div className="border rounded-sm shadow-sm py-3 w-full text-center text-sm">
              <h1>Suhu</h1>
              <div className="text-[100px]">{sensor.suhu}</div>
            </div>
            <div className="border rounded-sm shadow-sm py-3 w-full text-center text-sm">
              <h1>Temperature</h1>
              <div className="text-">{sensor.temperature}</div>
            </div>
            <div className="border rounded-sm shadow-sm py-3 w-full text-center text-sm">
              <h1>Status A</h1>
              <div className="text-">{sensor.status_a}</div>
            </div>
            <div className="border rounded-sm shadow-sm py-3 w-full text-center text-sm">
              <h1>Status B</h1>
              <div className="text-">{sensor.status_b}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-sm mb-4 text-center">Suhu & Temperature</h2>
              <Line data={lineData} options={options} />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export default Dashboard;
