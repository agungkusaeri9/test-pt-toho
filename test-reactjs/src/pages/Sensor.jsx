import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  Button,
  Label,
  Pagination,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import {
  exportSensor,
  filterSensors,
  getSensors,
} from "../services/sensorService";
import { dateFormat } from "../utils/DateFormat";
import axios from "axios";

function Sensor() {
  const [sensors, setSensors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [formFilter, setFormFilter] = useState({
    date: "",
    status: "",
  });

  const fetchSensors = async (page) => {
    try {
      const response = await getSensors(null, page);
      const modifiedData = response.data.map((sensor) => {
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

      // Update state dengan data yang sudah dimodifikasi
      setSensors(modifiedData);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const showingPagination = () => {
    return `Showing ${
      (pagination.current_page - 1) * pagination.per_page + 1
    } to${" "}
    ${Math.min(
      pagination.current_page * pagination.per_page,
      pagination.total
    )} of${" "}
    ${pagination.total || 0} entries`;
  };

  const handlePageChange = (page) => {
    fetchSensors(page);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFormFilter((prevFilter) => ({
      ...prevFilter,
      [id]: value,
    }));
  };

  const handleExport = async () => {
    try {
      const data = await exportSensor(formFilter.date, formFilter.status);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sensors.xlsx"); // Nama file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const response = await filterSensors(formFilter.date, formFilter.status);
      const modifiedData = response.data.map((sensor) => {
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

      // Update state dengan data yang sudah dimodifikasi
      setSensors(modifiedData);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <>
      <MainLayout>
        <div className="flex justify-between mb-5 items-center">
          <h2 className="text-base mb-5 w-1/2">Data Sensor</h2>
          <form onSubmit={handleFilter}>
            <div className="flex justify-between gap-4">
              <div>
                <TextInput
                  type="date"
                  id="date"
                  sizing="md"
                  value={formFilter.date}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="">
                <Select
                  id="status"
                  className="w-full"
                  value={formFilter.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">Filter Status</option>
                  <option value="1">On</option>
                  <option value="0">Off</option>
                </Select>
              </div>
              <div>
                <Button type="submit">Filter</Button>
              </div>
              <div>
                <Button
                  className="bg-red-700"
                  type="button"
                  onClick={handleExport}
                >
                  Export
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="overflow-x-auto mb-10">
          <div className="mb-5">
            <Table>
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Suhu</Table.HeadCell>
                <Table.HeadCell>Temperature</Table.HeadCell>
                <Table.HeadCell>Status A</Table.HeadCell>
                <Table.HeadCell>Status B</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {sensors &&
                  sensors.map((sensor, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      <Table.Cell>{dateFormat(sensor.created_at)}</Table.Cell>
                      <Table.Cell>{sensor.suhu}</Table.Cell>
                      <Table.Cell>{sensor.temperature}</Table.Cell>
                      <Table.Cell>{sensor.status_a_update}</Table.Cell>
                      <Table.Cell>{sensor.status_b_update}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
          {sensors && sensors.length > 0 ? (
            <div className="flex justify-between items-center mt-20 bg-white">
              <div>
                <div className="text-sm text-gray-600">
                  {showingPagination()}
                </div>
              </div>
              <div className="flex justify-end">
                <nav>
                  <ul className="flex justify-end space-x-2">
                    {/* Previous button */}
                    <li
                      className={`${
                        pagination.current_page === 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <button
                        className="px-4 py-2 border rounded-md text-sm bg-blue-500 text-gray-500 disabled:bg-gray-300"
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Menampilkan nomor halaman */}
                    {pagination.current_page > 3 && (
                      <>
                        <li>
                          <button
                            className="px-4 py-2 border rounded-md text-sm bg-blue-500 text-gray-500"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </button>
                        </li>
                        {pagination.current_page > 4 && (
                          <li className="flex items-center justify-center px-4 py-2 text-sm">
                            <span className="text-gray-500">...</span>
                          </li>
                        )}
                      </>
                    )}

                    {Array.from(
                      { length: Math.min(3, pagination.last_page) },
                      (_, index) => {
                        const pageNumber =
                          Math.max(2, pagination.current_page - 2) + index;
                        if (pageNumber <= pagination.last_page) {
                          return (
                            <li key={pageNumber}>
                              <button
                                className={`px-4 py-2 border rounded-md text-sm ${
                                  pagination.current_page === pageNumber
                                    ? "bg-blue-500 text-gray-500 font-semibold"
                                    : "bg-white text-gray-500"
                                }`}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          );
                        }
                        return null;
                      }
                    )}

                    {pagination.current_page < pagination.last_page - 2 && (
                      <>
                        {pagination.current_page < pagination.last_page - 3 && (
                          <li className="flex items-center justify-center px-4 py-2 text-sm">
                            <span className="text-gray-500">...</span>
                          </li>
                        )}
                        <li>
                          <button
                            className="px-4 py-2 border text-gray-500 rounded-md text-sm bg-blue-500 "
                            onClick={() =>
                              handlePageChange(pagination.last_page)
                            }
                          >
                            {pagination.last_page}
                          </button>
                        </li>
                      </>
                    )}

                    {/* Next button */}
                    <li
                      className={`${
                        pagination.current_page === pagination.last_page
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <button
                        className="px-4 py-2 border rounded-md text-sm bg-blue-500 text-gray-500 disabled:bg-gray-300"
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">Tidak Ada Data.</p>
          )}
        </div>
      </MainLayout>
    </>
  );
}

export default Sensor;
