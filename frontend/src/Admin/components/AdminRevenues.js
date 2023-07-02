import SideBar from "./SideBar";
import "./AdminComments.css";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
);

const AdminRevenues = (props) => {
  const [profitPerBook, setProfitPerBook] = useState({});
  const [profitPerBookOption, setProfitPerBookOption] = useState({});
  const [soldBook, setSoldBook] = useState({});
  const [soldBookOption, setSoldBookOptions] = useState({});
  const [profitByDate, setProfitByDate] = useState({});
  const [profitByDateOption, setProfitByDateOption] = useState({});
  const [profitLossByDate, setProfitLossByDate] = useState({});
  const [profitLossByDateOption, setProfitLossByDateOption] = useState({});

  useEffect(() => {
    const getProfitPerBook = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/admin/sales-manager/profit-per-book",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();

        if (!data || data.length === 0) {
          console.error("No data returned from API");
          return;
        }

        const chartData = {
          labels: data.map((item) => (item.title ? item.title : "Unknown")),
          datasets: [
            {
              label: "Profit",
              data: data.map((item) => (item.profit ? item.profit : 0)),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
            },
          ],
        };

        const options = {
          scales: {
            x: {
              type: "category",
              labels: data.map((item) => item.title),
            },
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        };
        setProfitPerBook(chartData);
        setProfitPerBookOption(options);
      } catch (err) {
        setProfitPerBook({});
      }
    };

    getProfitPerBook();
  }, []);

  useEffect(() => {
    const getSoldBook = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/admin/sales-manager/books-sold",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();

        if (!data || data.length === 0) {
          console.error("No data returned from API");
          return;
        }

        const chartData = {
          labels: data.map((item) => (item.title ? item.title : "Unknown")),
          datasets: [
            {
              label: "Profit",
              data: data.map((item) => (item.sold ? item.sold : 0)),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
            },
          ],
        };

        const options = {
          scales: {
            x: {
              type: "category",
              labels: data.map((item) => item.title),
            },
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        };
        setSoldBook(chartData);
        setSoldBookOptions(options);
      } catch (err) {
        setSoldBook({});
      }
    };

    getSoldBook();
  }, []);

  useEffect(() => {
    const getProfitByDate = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/admin/sales-manager/profit-by-date",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();
        console.log(data);

        if (!data || data.length === 0) {
          console.error("No data returned from API");
          return;
        }

        const chartData = {
          labels: data.map((item) => new Date(item.date).toLocaleDateString()),
          datasets: [
            {
              label: "Profit",
              data: data.map((item) => item.profit),
              fill: false,
              backgroundColor: "rgb(153, 102, 255)",
              borderColor: "rgba(153, 102, 255, 0.2)",
            },
          ],
        };

        const options = {
          scales: {
            x: {
              type: "category",
              labels: data.map((item) =>
                new Date(item.date).toLocaleDateString()
              ),
            },
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        };
        setProfitByDate(chartData);
        setProfitByDateOption(options);
      } catch (err) {
        setSoldBook({});
      }
    };

    getProfitByDate();
  }, []);

  useEffect(() => {
    const getProfitLossByDate = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/admin/sales-manager/profit-loss", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await response.json();

        if (!data || data.length === 0) {
          console.error("No data returned from API");
          return;
        }

        const chartData = {
          labels: data.map((item) => item.date),
          datasets: [
            {
              label: "Profit/Loss",
              data: data.map((item) => item.profitOrLoss),
              fill: false,
              backgroundColor: "rgb(75,192,192)",
              borderColor: "rgba(75,192,192,0.2)",
            },
          ],
        };

        const options = {
          scales: {
            x: {
              type: "category",
              labels: data.map((item) => item.date),
            },
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        };

        setProfitLossByDate(chartData);
        setProfitLossByDateOption(options);
      } catch (err) {
        setProfitLossByDate({});
      }
    };

    getProfitLossByDate();
  }, []);

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
          Profit Per Book
        </h1>
        <div className="chart">
          {profitPerBookOption &&
            profitPerBook.labels &&
            profitPerBook.datasets && (
              <Bar data={profitPerBook} options={profitPerBookOption} />
            )}
        </div>
        <h1 style={{ textAlign: "center", marginTop: "1rem" }}>Sold Book</h1>
        <div className="chart">
          {soldBookOption && soldBook.labels && soldBook.datasets && (
            <Line data={soldBook} options={soldBookOption} />
          )}
        </div>
        <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
          Revenue - Order Date
        </h1>
        <div className="chart">
          {profitByDate && profitByDate.labels && profitByDate.datasets && (
            <Line data={profitByDate} options={profitByDateOption} />
          )}
        </div>
        <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
          Profit/Loss by Date
        </h1>
        <div className="chart">
          {profitLossByDate &&
            profitLossByDate.labels &&
            profitLossByDate.datasets && (
              <Line data={profitLossByDate} options={profitLossByDateOption} />
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminRevenues;
