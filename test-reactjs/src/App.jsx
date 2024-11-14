import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const App = () => {
  const [message, setMessage] = useState(null); // State untuk menyimpan pesan dari MQTT
  const brokerUrl = "wss://broker.emqx.io:8084/mqtt"; // URL WebSocket untuk broker EMQX
  const topic = "/tohotechnology"; // Topic untuk berlangganan
  const [data, setData] = useState([]);

  useEffect(() => {
    // Membuat koneksi ke broker MQTT melalui WebSocket
    const client = mqtt.connect(brokerUrl);

    // Ketika terhubung dengan broker
    client.on("connect", () => {
      console.log("Connected to MQTT broker");

      // Berlangganan ke topic
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    // Mendengarkan pesan yang diterima pada topic
    client.on("message", (topic, payload) => {
      const message = payload.toString();
      const convert = JSON.parse(message);
      console.log(`Received message: ${convert}`);
      setData((prevMessages) => {
        const updatedMessages = [convert, ...prevMessages];
        return updatedMessages;
      });
      // Simpan data di localStorage jika ada perubahan pesan
      localStorage.setItem("mqttMessage", message);
      setMessage(message); // Update state dengan data terbaru
    });

    // Clean up: disconnect dari broker ketika komponen di-unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>MQTT Real-time Message</h1>
      <ul>
        {data &&
          data.map((item, index) => (
            <div key={index}>
              <li>{`Suhu :${item.suhu} Temperature : ${item.temperature} | Status A : ${item.status_a} | Status B : ${item.status_b}`}</li>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default App;
