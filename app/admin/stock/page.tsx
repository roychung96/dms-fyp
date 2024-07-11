"use client";

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
} from "@/components/ui/dialog";
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface StockItem {
  id?: number;
  brand: string;
  model: string;
  year: string;
  engine: string;
  price: string;
  status: string;
  photo: string;
}

const StockPage: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [newStock, setNewStock] = useState<StockItem>({ brand: '', model: '', year: '', engine: '', price: '', status: 'incoming', photo: '' });
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isManager, setIsManager] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name}`;
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      if (file) {
        reader.readAsDataURL(file);
        setImageFile(file);
      }
    }
  };

  const handleCarPhotoChange = async (file: File, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('car')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading car photo:', error);
      toast.error(`Error uploading car photo: ${error.message}`);
      return null;
    } else {
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car/${fileName}?t=${encodeURIComponent(new Date().toISOString())}`;
      setImagePreview(imageUrl); // Update the image preview to the uploaded image URL
      return imageUrl;
    }
  };

  useEffect(() => {
    const fetchStock = async () => {
      const { data, error } = await supabase.from('stock').select('*');
      if (error) {
        console.error('Error fetching stock:', error);
      } else {
        setStock(data);
      }
    };

    fetchStock();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingStock) {
      setEditingStock({ ...editingStock, [name]: value });
    } else {
      setNewStock({ ...newStock, [name]: value });
    }
  };

  const handleAddStock = async () => {
    if (!newStock.brand || !newStock.model || !newStock.year || !newStock.engine || !newStock.price || !newStock.status || !imageFile) {
      toast.error('Please fill in all fields');
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const imageUrl = await handleCarPhotoChange(imageFile, fileName);
    if (!imageUrl) return;

    const stockWithImage = { ...newStock, photo: imageUrl };

    const { data, error } = await supabase.from('stock').insert([stockWithImage]);
    if (error) {
      console.error('Error adding stock:', error);
      toast.error(`Error adding stock: ${error.message}`);
    } else {
      toast.success('Stock added successfully!');
      if (data) {
        setStock([...stock, data[0]]);
      }
      setNewStock({ brand: '', model: '', year: '', engine: '', price: '', status: 'incoming', photo: '' });
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleUpdateStock = async () => {
    if (!editingStock || !editingStock.brand || !editingStock.model || !editingStock.year || !editingStock.engine || !editingStock.price || !editingStock.status || (!editingStock.photo && !imageFile)) {
      toast.error('Please fill in all fields');
      return;
    }

    let imageUrl = editingStock.photo;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      imageUrl = await handleCarPhotoChange(imageFile, fileName);
      if (!imageUrl) return;
    }

    const { id, brand, model, year, engine, price, status } = editingStock;
    const { data, error } = await supabase.from('stock').update({ brand, model, year, engine, price, status, photo: imageUrl }).eq('id', id);
    if (error) {
      console.error('Error updating stock:', error);
      toast.error(`Error updating stock: ${error.message}`);
    } else {
      toast.success('Stock updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setStock(stock.map(s => (s.id === id ? (data ? data[0] : s) : s)));
      setEditingStock(null);
      setShowModal(false);
    }
  };

  const handleDeleteStock = async (id: number) => {
    const { error } = await supabase.from('stock').delete().eq('id', id);
    if (error) {
      console.error('Error deleting stock:', error);
      toast.error('Error deleting stock');
    } else {
      setStock(stock.filter(item => item.id !== id));
      toast.success('Stock deleted successfully!');
      window.location.reload();
    }
  };

  const handleEditStock = (stock: StockItem) => {
    setEditingStock(stock);
    setImagePreview(stock.photo);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStock) {
      await handleUpdateStock();
    } else {
      await handleAddStock();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Stock</h1>
        {isManager && (
          <Button className="flex items-center" onClick={() => { setEditingStock(null); setImagePreview(null); setShowModal(true); }}>
            <FaPlus className="mr-2" />
            Add Stock
          </Button>
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
              {stock.map((item) => (
                item && (
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
                        <Button variant="outline" onClick={() => handleEditStock(item)} className="mr-2">
                          <FaEdit />
                        </Button>
                        <Button variant="outline" onClick={() => handleDeleteStock(item.id ?? 0)}>
                          <FaTrash />
                        </Button>
                      </td>
                    )}
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStock ? 'Edit Stock' : 'Add New Stock'}</DialogTitle>
            <DialogDescription>Fill in the details below to {editingStock ? 'update' : 'add new'} stock.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                <Input
                  type="text"
                  name="brand"
                  value={editingStock ? editingStock.brand : newStock.brand}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                <Input
                  type="text"
                  name="model"
                  value={editingStock ? editingStock.model : newStock.model}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <Input
                  type="number"
                  name="year"
                  value={editingStock ? editingStock.year : newStock.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Engine</label>
                <Input
                  type="text"
                  name="engine"
                  value={editingStock ? editingStock.engine : newStock.engine}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <Input
                  type="number"
                  name="price"
                  value={editingStock ? editingStock.price : newStock.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editingStock ? editingStock.status : newStock.status}
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
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                <Input
                  type="file"
                  name="photo"
                  onChange={handlePhotoChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <Image src={imagePreview} alt="Preview" width={100} height={100} />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default StockPage;
