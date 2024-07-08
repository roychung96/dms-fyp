"use client"

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Link from 'next/link';

const visitorCount = 10234;
const staffCount = 15;
const soldCount = 123;

const chartData = [
  { brand: "Toyota", sales: 40 },
  { brand: "Honda", sales: 30 },
  { brand: "BMW", sales: 20 },
  { brand: "Mercedes", sales: 10 },
];

const AdminDashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/login">Download</Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <li className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Olivia Martin</p>
                    <p className="text-sm text-gray-500">olivia.martin@email.com</p>
                  </div>
                </div>
                <span className="text-green-500">+$1,999.00</span>
              </li>
              {/* Repeat similar blocks for other sales */}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
