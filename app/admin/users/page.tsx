/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
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
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id?: number;
  name?: string;
  email: string;
  password: string;
  role: 'manager' | 'salesperson';
  profile_picture: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ name: '', email: '', password: '', role: 'salesperson', profile_picture: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isManager, setIsManager] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['image/*'],
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
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
  });

  const handleProfilePictureChange = async (file: File, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('profile_pictures')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading profile picture:', error);
      toast.error(`Error uploading profile picture: ${error.message}`);
      return null;
    } else {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pictures/${fileName}`;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role || !imageFile) {
      toast.error('Please fill in all fields, including selecting a role and uploading a profile picture');
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const imageUrl = await handleProfilePictureChange(imageFile, fileName);
    if (!imageUrl) return;

    const userWithImage = { ...newUser, profile_picture: imageUrl };

    const { data, error } = await supabase.from('users').insert([userWithImage]);
    if (error) {
      console.error('Error adding user:', error);
      toast.error(`Error adding user: ${error.message}`);
    } else {
      toast.success('User added successfully!');
      if (data) {
        setUsers([...users, data[0]]);
      }
      setNewUser({ name: '', email: '', password: '', role: 'salesperson', profile_picture: '' });
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.name || !editingUser.email || !editingUser.password || !editingUser.role || (!editingUser.profile_picture && !imageFile)) {
      toast.error('Please fill in all fields, including selecting a role and uploading a profile picture');
      return;
    }

    let imageUrl = editingUser.profile_picture;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      imageUrl = await handleProfilePictureChange(imageFile, fileName);
      if (!imageUrl) return;
    }

    const { id, name, email, password, role } = editingUser;
    const { data, error } = await supabase.from('users').update({ name, email, password, role, profile_picture: imageUrl }).eq('id', id);
    if (error) {
      console.error('Error updating user:', error);
      toast.error(`Error updating user: ${error.message}`);
    } else {
      toast.success('User updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setUsers(users.map(u => (u.id === id ? (data ? data[0] : u) : u)));
      setEditingUser(null);
      setShowModal(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } else {
      setUsers(users.filter(item => item.id !== id));
      toast.success('User deleted successfully!');
      window.location.reload();
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setImagePreview(user.profile_picture);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted'); // Add this line for debugging
    if (editingUser) {
      await handleUpdateUser();
    } else {
      await handleAddUser();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        {isManager && (
          <Button className="flex items-center" onClick={() => { setEditingUser(null); setImagePreview(null); setShowModal(true); }}>
            <FaPlus className="mr-2" />
            Add User
          </Button>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Picture</th>
                {isManager && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((item) => (
                item && (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={item.profile_picture} alt={`${item.name} profile`} width={50} height={50} />
                    </td>
                    {isManager && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="outline" onClick={() => handleEditUser(item)} className="mr-2">
                          <FaEdit />
                        </Button>
                        <Button variant="outline" onClick={() => handleDeleteUser(item.id ?? 0)}>
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
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>Fill in the details below to {editingUser ? 'update' : 'add new'} user.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={editingUser ? editingUser.password : newUser.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</Label>
                <select
                  name="role"
                  value={editingUser ? editingUser.role : newUser.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select a role</option>
                  <option value="manager">Manager</option>
                  <option value="salesperson">Salesperson</option>
                </select>
              </div>
              <div>
                <Label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">Profile Picture</Label>
                <div {...getRootProps()} className="mt-1 block w-full border-2 border-dashed border-gray-300 rounded-md shadow-sm p-2 cursor-pointer">
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-80 h-auto rounded-md" />
                  ) : (
                    <p>Drag 'n' drop a file here, or click to select a file</p>
                  )}
                </div>
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

export default UsersPage;
