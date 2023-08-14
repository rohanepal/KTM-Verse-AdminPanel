import React, { useEffect, useState } from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getMonthlyData, getOrders, getYearlyData } from "../features/auth/authSlice";



const Dashboard = () => {

  const dispatch = useDispatch()
  const monthlyDataState = useSelector(state => state?.auth?.monthlyData)
  const yearlyDataState = useSelector(state => state?.auth?.yearlyData)
  const orderState = useSelector(state => state?.auth?.orders?.orders)
  const [dataMonthly,setDataMonthly]=useState([])
  const [dataMonthlySales,setDataMonthlySales]=useState([])
  const [orderData,setOrderData]=useState([])
  console.log(orderState);
  useEffect(() => {
    dispatch(getMonthlyData()) 
    dispatch(getYearlyData())
    dispatch(getOrders())
  },[])
  useEffect(() => {
    let monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
  
    let data = [];
    let monthlyOrderCount = [];
  
    for (let index = 0; index < monthlyDataState?.length; index++) {
      const element = monthlyDataState[index];
      data.push({ type: monthNames[element?._id?.month], income: element?.amount });
      monthlyOrderCount.push({ type: monthNames[element?._id?.month], sales: element?.count });
    }
  
    // Sort data and monthlyOrderCount based on the predefined month order
    data.sort((a, b) => monthNames.indexOf(a.type) - monthNames.indexOf(b.type));
    monthlyOrderCount.sort((a, b) => monthNames.indexOf(a.type) - monthNames.indexOf(b.type));
  
    setDataMonthly(data);
    setDataMonthlySales(monthlyOrderCount);
  
    const data1 = [];
  
    for (let i = 0; i < orderState?.length; i++) {
      data1.push({
        key: i,
        name: orderState[i]?.shippingInfo?.firstName + " " + orderState[i]?.shippingInfo?.lastName,
        product: orderState[i]?.orderItems?.length,
        price: orderState[i]?.totalPriceAfterDiscount,
        status: orderState[i]?.paymentMethod,
      });
    }
  
    setOrderData(data1);
  }, [monthlyDataState]);
  

  const config = {
    data: dataMonthly,
    xField: "type",
    yField: "income",
    color: ({ type }) => {
      return "#d2d2d2";
    },
    label: {
      position: "middle",
      style: {
        fill: "#161616",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      income: {
        alias: "Income",
      }, 
    },
  };

  const config2 = {
    data: dataMonthlySales,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      return "#d2d2d2";
    },
    label: {
      position: "middle",
      style: {
        fill: "#161616",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Sales",
      },
    },
  };

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
      align: "center",
    },
    {
      title: " Customer Name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Items",
      dataIndex: "product",
      align: "center",
    },  
    {
      title: "Total Price",
      dataIndex: "price",
      align: "center",
    },
    {
      title: "Payment Method",
      dataIndex: "status",
      align: "center",
    },
  ];
  
  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total Income of Current Year</p>
            <h4 className="mb-0 sub-title">NPR {yearlyDataState && yearlyDataState[0].amount}.00</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
           </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total Sales of Current Year</p>
            <h4 className="mb-0 sub-title">{yearlyDataState && yearlyDataState[0].count}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
           
          </div>
        </div>
        
      </div>


      <div className="d-flex justify-content-between gap-3">
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">Income Statics</h3>
          <div>
            <Column {...config} />
          </div>
        </div>
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">Sales Statics</h3>
          <div>
            <Column {...config2} />
          </div>
        </div>
      </div>



      <div className="mt-4">
        <h3 className="mb-5 title">Recent Orders</h3>
        <div>
          <Table columns={columns} dataSource={orderData} />
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;
