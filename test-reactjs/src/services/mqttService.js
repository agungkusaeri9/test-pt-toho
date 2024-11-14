import React from "react";
const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
const topic = "/tohotechnology";
const client = mqtt.connect(brokerUrl);
export const connectMqtt = () => {
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

  // Fungsi untuk menerima pesan
  client.on("message", (topic, payload) => {
    const message = payload.toString();
    const dataObject = JSON.parse(message);
    if (dataObject) {
      let status_a, status_b;
      if (dataObject.status_a === 0) status_a = "Off";
      else status_a = "On";
      if (dataObject.status_b === 0) status_b = "Off";
      else status_b = "On";

      // Panggil callback untuk mengirim data yang diterima ke komponen
      if (onMessageCallback) {
        onMessageCallback({
          suhu: dataObject.suhu,
          temperature: dataObject.temperature,
          status_a,
          status_b,
        });
      }
    }
  });

  // Error handling
  client.on("error", (err) => {
    console.error("Connection error:", err);
  });
};

export const disconnectMqtt = () => {
  client.end(() => {
    console.log("Disconnected from MQTT broker");
  });
};

export default connectMqtt;
