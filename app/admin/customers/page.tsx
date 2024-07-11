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

interface Customer {
  id?: number; // Optional, as it may not be present before saving to the database
  name: string;
  phone: string;
  ic: string;
  status: string;
}

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Customer>({ name: '', phone: '', ic: '', status: 'Booking' });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isManager, setIsManager] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data);
      }
    };

    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [name]: value });
    } else {
      setNewCustomer({ ...newCustomer, [name]: value });
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.ic || !newCustomer.status) {
      toast.error('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase.from('customers').insert([newCustomer]);
    if (error) {
      console.error('Error adding customer:', error);
      toast.error(`Error adding customer: ${error.message}`);
    } else {
      toast.success('Customer added successfully!');
      if (data) {
        setCustomers([...customers, data[0]]);
      }
      setNewCustomer({ name: '', phone: '', ic: '', status: 'Booking' });
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer || !editingCustomer.name || !editingCustomer.phone || !editingCustomer.ic || !editingCustomer.status) {
      toast.error('Please fill in all fields');
      return;
    }

    const { id, name, phone, ic, status } = editingCustomer;
    const { data, error } = await supabase.from('customers').update({ name, phone, ic, status }).eq('id', id);
    if (error) {
      console.error('Error updating customer:', error);
      toast.error(`Error updating customer: ${error.message}`);
    } else {
      toast.success('Customer updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setCustomers(customers.map(c => (c.id === id ? (data ? data[0] : c) : c)));
      setEditingCustomer(null);
      setShowModal(false);
     
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      console.error('Error deleting customer:', error);
      toast.error('Error deleting customer');
    } else {
      setCustomers(customers.filter(item => item.id !== id));
      toast.success('Customer deleted successfully!');
      window.location.reload();
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSubmit = editingCustomer ? handleUpdateCustomer : handleAddCustomer;

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        {isManager && (
          <Button className="flex items-center" onClick={() => { setEditingCustomer(null); setShowModal(true); }}>
            <FaPlus className="mr-2" />
            Add Customer
          </Button>
        )}
      </header>

      <Card>
        <CardHeader>Customer Management</CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IC</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {isManager && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.ic}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.status}</td>
                  {isManager && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" onClick={() => handleEditCustomer(item)} className="mr-2">
                        <FaEdit />
                      </Button>
                      <Button variant="outline" onClick={() => handleDeleteCustomer(item.id ?? 0)}>
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
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>Fill in the details below to {editingCustomer ? 'update' : 'add new'} customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                name="name"
                value={editingCustomer ? editingCustomer.name : newCustomer.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                type="text"
                name="phone"
                value={editingCustomer ? editingCustomer.phone : newCustomer.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="ic" className="block text-sm font-medium text-gray-700">IC</label>
              <Input
                type="text"
                name="ic"
                value={editingCustomer ? editingCustomer.ic : newCustomer.ic}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={editingCustomer ? editingCustomer.status : newCustomer.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="Booking">Booking</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
              </select>
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

export default CustomerPage;
