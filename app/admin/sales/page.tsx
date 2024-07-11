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
import { supabase } from '@/lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Sale {
  id?: number;
  customer_id: number;
  product_id: number;
  salesperson_id: number;
  amount: number;
}

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [newSale, setNewSale] = useState<Sale>({ customer_id: 0, product_id: 0, salesperson_id: 0, amount: 0 });
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isManager, setIsManager] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase.from('sales').select('*');
      if (error) {
        console.error('Error fetching sales:', error);
      } else {
        setSales(data);
      }
    };

    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data);
      }
    };

    const fetchProducts = async () => {
      const { data, error } = await supabase.from('stock').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchSales();
    fetchCustomers();
    fetchProducts();
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingSale) {
      setEditingSale({ ...editingSale, [name]: value });
    } else {
      setNewSale({ ...newSale, [name]: value });
    }
  };

  const handleAddSale = async () => {
    if (!newSale.customer_id || !newSale.product_id || !newSale.salesperson_id || !newSale.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase.from('sales').insert([newSale]);
    if (error) {
      console.error('Error adding sale:', error);
      toast.error(`Error adding sale: ${error.message}`);
    } else {
      toast.success('Sale added successfully!');
      if (data) {
        setSales([...sales, data[0]]);
      }
      setNewSale({ customer_id: 0, product_id: 0, salesperson_id: 0, amount: 0 });
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleUpdateSale = async () => {
    if (!editingSale || !editingSale.customer_id || !editingSale.product_id || !editingSale.salesperson_id || !editingSale.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const { id, customer_id, product_id, salesperson_id, amount } = editingSale;
    const { data, error } = await supabase
      .from('sales')
      .update({ customer_id, product_id, salesperson_id, amount })
      .eq('id', id);

    if (error) {
      console.error('Error updating sale:', error);
      toast.error(`Error updating sale: ${error.message}`);
    } else {
      toast.success('Sale updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setSales(sales.map(s => (s.id === id ? (data ? data[0] : s) : s)));
      setEditingSale(null);
      setShowModal(false);
    }
  };

  const handleDeleteSale = async (id: number) => {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) {
      console.error('Error deleting sale:', error);
      toast.error('Error deleting sale');
    } else {
      setSales(sales.filter(item => item.id !== id));
      toast.success('Sale deleted successfully!');
      window.location.reload();
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setShowModal(true);
  };

  const handleSubmit = editingSale ? handleUpdateSale : handleAddSale;

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Sales Management</h1>
        {isManager && (
          <Button className="flex items-center" onClick={() => { setEditingSale(null); setShowModal(true); }}>
            <FaPlus className="mr-2" />
            Add Sale
          </Button>
        )}
      </header>

      <Card>
        <CardHeader>Sales Management</CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                {isManager && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale: any) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{customers.find(c => c.id === sale.customer_id)?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{products.find(p => p.id === sale.product_id)?.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{users.find(u => u.id === sale.salesperson_id)?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.amount}</td>
                  {isManager && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" onClick={() => handleEditSale(sale)} className="mr-2">
                        <FaEdit />
                      </Button>
                      <Button variant="outline" onClick={() => handleDeleteSale(sale.id ?? 0)}>
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSale ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
            <DialogDescription>Fill in the details below to {editingSale ? 'update' : 'add new'} sale.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                name="customer_id"
                value={editingSale ? editingSale.customer_id : newSale.customer_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a customer</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product</label>
              <select
                name="product_id"
                value={editingSale ? editingSale.product_id : newSale.product_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a product</option>
                {products.map((product: any) => (
                  <option key={product.id} value={product.id}>{product.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="salesperson_id" className="block text-sm font-medium text-gray-700">Salesperson</label>
              <select
                name="salesperson_id"
                value={editingSale ? editingSale.salesperson_id : newSale.salesperson_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a salesperson</option>
                {users.map((user: any) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <Input
                type="number"
                name="amount"
                value={editingSale ? editingSale.amount : newSale.amount}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default SalesPage;
