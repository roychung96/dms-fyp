/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';
import ContactForm from './components/ContactForm';
import Image from 'next/image';

interface CarModel {
  id: number;
  brand: string;
  model: string;
  year: number;
  engine: string;
  price: number;
  status: string;
  photo: string;
}

const Home = () => {
  const [cars, setCars] = useState<CarModel[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch('/api/stock');
      if (response.ok) {
        const data = await response.json();
        const onSaleCars = data.filter((car: CarModel) => car.status === 'on sales');
        setCars(onSaleCars);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Discover the Future of Driving with CarNation
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Experience the pinnacle of automotive engineering with our cutting-edge car models, designed to
                    redefine the driving experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Explore Models
                  </Link>
                  <Link
                    href="#contact"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <Image
                src="/future.jpg"
                width="600"
                height="400"
                alt="Hero Car"
                className="mx-auto "
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">About CarNation</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    CarNation is a leading automotive manufacturer dedicated to crafting exceptional vehicles that
                    redefine the driving experience. With a rich heritage of innovation and a commitment to excellence,
                    we strive to push the boundaries of what's possible in the world of automobiles.
                  </p>
                </div>
              </div>
              <Image
                src="/about-banner.jpg"
                width="550"
                height="310"
                alt="About CarNation"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl ">Our Car Models</h2>
                <p className=" text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
                  Explore our cutting-edge car models, each designed to provide an unparalleled driving experience.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {cars.map((car) => (
                <div key={car.id} className="bg-card rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={car.photo}
                    width="400"
                    height="300"
                    alt={car.model}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                    <p className="text-muted-foreground mt-2">
                      {car.engine} - RM {car.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Have questions or need more information? Reach out to us!
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
