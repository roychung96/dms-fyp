"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import Image from 'next/image';

// Dummy data for demonstration
const initialStock = [
  { id: 1, brand: 'Toyota', model: 'Camry', year: 2021, engine: '2.5L', price: 24000, status: 'on sales', photo: '/car1.jpg' },
  { id: 2, brand: 'Honda', model: 'Civic', year: 2020, engine: '1.8L', price: 20000, status: 'incoming', photo: '/car2.jpg' },
];

const StockPage = () => {
  const [stock, setStock] = useState(initialStock);
  const [newStock, setNewStock] = useState({ brand: '', model: '', year: '', engine: '', price: '', status: 'incoming', photo: '' });
  const [isManager, setIsManager] = useState(true); // Assume current user is manager for demo purposes

  useEffect(() => {
    // Fetch stock from API when component mounts
    // For now, we're using dummy data
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStock = () => {
    setStock([...stock, { ...newStock, id: stock.length + 1 }]);
    setNewStock({ brand: '', model: '', year: '', engine: '', price: '', status: 'incoming', photo: '' });
  };

  const handleDeleteStock = (id) => {
    setStock(stock.filter(item => item.id !== id));
  };

  const handleEditStock = (id) => {
    // Logic to edit stock goes here
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Stock</h1>
        {isManager && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <FaPlus className="mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Stock</DialogTitle>
                <DialogDescription>Fill in the details below to add new stock.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                  <Input
                    type="text"
                    name="brand"
                    value={newStock.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                  <Input
                    type="text"
                    name="model"
                    value={newStock.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                  <Input
                    type="number"
                    name="year"
                    value={newStock.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Engine</label>
                  <Input
                    type="text"
                    name="engine"
                    value={newStock.engine}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <Input
                    type="number"
                    name="price"
                    value={newStock.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={newStock.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="incoming">Incoming</option>
                    <option value="on sales">On Sales</option>
                    <option value="booking">Booking</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo URL</label>
                  <Input
                    type="text"
                    name="photo"
                    value={newStock.photo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddStock}>Submit</Button>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </header>

      <Card>
        <CardHeader>Stock Management</CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engine</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                {isManager && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stock.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.engine}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image src={item.photo} alt={`${item.brand} ${item.model}`} width={50} height={50} />
                  </td>
                  {isManager && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" onClick={() => handleEditStock(item.id)} className="mr-2">
                        <FaEdit />
                      </Button>
                      <Button variant="outline" onClick={() => handleDeleteStock(item.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockPage;
