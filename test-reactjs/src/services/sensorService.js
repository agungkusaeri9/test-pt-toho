import axios from "axios";

const API_URL = "http://localhost:8000";

const getSensors = async (limit, page) => {
  try {
    const response = await axios.get(`${API_URL}/api/sensor`, {
      params: {
        limit: limit,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suhu data:", error);
    throw error;
  }
};

const filterSensors = async (date, status) => {
  try {
    const response = await axios.get(`${API_URL}/api/sensor`, {
      params: {
        date: date,
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suhu data:", error);
    throw error;
  }
};

const exportSensor = async (date = null, status = "all") => {
  try {
    const response = await axios.post(
      `${API_URL}/api/sensor/export`,
      {
        date: date,
        status: status,
      },
      {
        responseType: "blob", // Tempatkan di opsi konfigurasi, di luar data params
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching suhu data:", error);
    throw error;
  }
};

const createSensor = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/sensor`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating suhu data:", error);
    throw error;
  }
};

export { getSensors, createSensor, filterSensors, exportSensor };
