"use client";

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
  const [recentSales, setRecentSales] = useState<any[]>([]);

  useEffect(() => {
    const logVisit = async () => {
      const response = await fetch('/api/visitors', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setVisitorCount(data.count);
      } else {
        console.error('Error logging visit');
      }
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
      const { data, error } = await supabase.from('sales').select('brand, count').group('brand');
      if (error) {
        console.error('Error fetching chart data:', error);
      } else {
        setChartData(data.map((item: any) => ({ brand: item.brand, sales: item.count })));
      }
    };

    const fetchRecentSales = async () => {
      const { data, error } = await supabase.from('sales').select('*, stock(price)').order('created_at', { ascending: false }).limit(5);
      if (error) {
        console.error('Error fetching recent sales:', error);
      } else {
        setRecentSales(data.map((sale: any) => ({
          ...sale,
          amount: sale.amount * sale.stock.price,
        })));
      }
    };

    logVisit();
    fetchVisitorCount();
    fetchStaffCount();
    fetchSoldCount();
    fetchProductCount();
    fetchChartData();
    fetchRecentSales();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/login">Download</Link>
        </Button>
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
          <CardHeader>Recent Sales</CardHeader>
          <CardContent>
            <ul>
              {recentSales.map((sale: any, index) => (
                <li key={index} className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={sale.customer_avatar || "https://github.com/shadcn.png"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sale.customer_name}</p>
                      <p className="text-sm text-gray-500">{sale.customer_email}</p>
                    </div>
                  </div>
                  <span className="text-green-500">+RM {sale.amount}</span>
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
