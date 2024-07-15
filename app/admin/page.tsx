"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const AdminDashboard = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [chartData, setChartData] = useState<{ brand: string, sales: number }[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const logVisit = async () => {
      await fetch('/api/visitors', { method: 'POST' });
    };

    const fetchVisitorCount = async () => {
      const response = await fetch('/api/visitors', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setVisitorCount(data.count);
      } else {
        console.error('Error fetching visitor count');
      }
    };

    const fetchStaffCount = async () => {
      const { data, error } = await supabase.from('users').select('*', { count: 'exact' });
      if (error) {
        console.error('Error fetching staff count:', error);
      } else {
        setStaffCount(data.length);
      }
    };

    const fetchSoldCount = async () => {
      const { data, error } = await supabase.from('sales').select('amount');
      if (error) {
        console.error('Error fetching sold count:', error);
      } else {
        const totalSold = data.reduce((acc: number, sale: any) => acc + sale.amount, 0);
        setSoldCount(totalSold);
      }
    };

    const fetchProductCount = async () => {
      const { data, error } = await supabase.from('stock').select('*', { count: 'exact' });
      if (error) {
        console.error('Error fetching product count:', error);
      } else {
        setProductCount(data.length);
      }
    };

    const fetchChartData = async () => {
      const { data: salesData, error: salesError } = await supabase.from('sales').select('*');
      if (salesError) {
        console.error('Error fetching sales data:', salesError);
        return;
      }
      const { data: stockData, error: stockError } = await supabase.from('stock').select('*');
      if (stockError) {
        console.error('Error fetching stock data:', stockError);
        return;
      }

      const brandSales = salesData.reduce((acc: any, sale: any) => {
        const stockItem = stockData.find((item: any) => item.id === sale.product_id);
        if (stockItem) {
          const brand = stockItem.brand;
          if (!acc[brand]) {
            acc[brand] = 0;
          }
          acc[brand] += sale.amount;
        }
        return acc;
      }, {});

      const chartData = Object.keys(brandSales).map((brand) => ({
        brand,
        sales: brandSales[brand],
      }));

      setChartData(chartData);
    };

    const fetchRecentUsers = async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*, stock(price), users(name, email, profile_picture)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent users:', error);
      } else {
        const recentSalesWithUsers = data.map((sale: any) => ({
          ...sale,
          totalAmount: sale.amount * sale.stock.price,
        }));
        setRecentUsers(recentSalesWithUsers);
      }
    };

    logVisit();
    fetchVisitorCount();
    fetchStaffCount();
    fetchSoldCount();
    fetchProductCount();
    fetchChartData();
    fetchRecentUsers();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* <Button asChild>
          <Link href="/login">Download</Link>
        </Button> */}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>Visitor Count</CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{visitorCount}</h2>
            <p className="text-sm text-gray-500">Total visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Staff Count</CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{staffCount}</h2>
            <p className="text-sm text-gray-500">Total staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Sold Count</CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{soldCount}</h2>
            <p className="text-sm text-gray-500">Total sold cars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Product Count</CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{productCount}</h2>
            <p className="text-sm text-gray-500">Total products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>Car Brand Sales</CardHeader>
          <CardContent>
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brand" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Recent Users</CardHeader>
          <CardContent>
            <ul>
              {recentUsers.map((sale: any, index) => (
                <li key={index} className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={sale.users.profile_picture || "https://github.com/shadcn.png"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sale.users.name}</p>
                      <p className="text-sm text-gray-500">{sale.users.email}</p>
                    </div>
                  </div>
                  <span className="text-green-500">+RM {sale.totalAmount}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
