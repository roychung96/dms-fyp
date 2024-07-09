"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Label } from "@/components/ui/label";
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

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'salesperson';
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  role?: 'manager' | 'salesperson';
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({ name: '', email: '', password: '' });
  const [isManager, setIsManager] = useState(true); // Assume current user is manager for demo purposes
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data as User[]);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast.error('Please fill in all fields, including selecting a role');
      return;
    }

    const { data, error } = await supabase.from('users').insert([newUser]);
    if (error) {
      console.error('Error adding user:', error);
      toast.error(`Error adding user: ${error.message}`);
    } else {
      toast.success('User added successfully!');
      if (data) {
        setUsers([...users, data[0] as User]);
      }      
      setNewUser({ name: '', email: '', password: '' });
      setShowModal(false);
      setTimeout(() => {
        window.location.reload(); // Force refresh the whole page
      }, 1000); // Adjust the timeout as needed
    }
  };

  const handleDeleteUser = async (id: number) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } else {
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully!');
      window.location.reload(); // Force refresh the whole page after deletion
    }
  };

  const handleEditUser = (id: number) => {
    // Logic to edit user goes here
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        {isManager && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <FaPlus className="mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Fill in the details below to add new user.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</Label>
                  <select
                    name="role"
                    value={newUser.role || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select a role</option>
                    <option value="manager">Manager</option>
                    <option value="salesperson">Salesperson</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser}>Submit</Button>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </header>

      <Card>
        <CardHeader>User Management</CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                {isManager && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  {isManager && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" onClick={() => handleEditUser(user.id)} className="mr-2">
                        <FaEdit />
                      </Button>
                      <Button variant="outline" onClick={() => handleDeleteUser(user.id)}>
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

      <ToastContainer />
    </div>
  );
};

export default UsersPage;
