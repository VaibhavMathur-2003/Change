"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, NotebookIcon as Lotus, Brain, Apple } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("changeAuth")) {
      router.push("/");
    }
  }, [router]);

  const newPlan = () => {
    localStorage.removeItem("changeAuth");
    router.push("/");
  };
  const categories = [
    {
      title: "Exercise",
      description: "Build strength and endurance",
      icon: Dumbbell,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Yoga",
      description: "Improve flexibility and balance",
      icon: Lotus,
      image:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHlvZ2ElMjBiYW5uZXJ8ZW58MHwwfDB8fHww",
      color: "from-green-500 to-teal-500",
    },

    {
      title: "Meditation",
      description: "Reduce stress and find inner peace",
      icon: Brain,
      image:
        "https://images.unsplash.com/photo-1526724038726-3007ffb8025f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1lZGl0YXRpb24lMjBiYW5uZXJ8ZW58MHwwfDB8fHww",
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Nutrition",
      description: "Fuel your body with healthy foods",
      icon: Apple,
      image:
        "https://images.unsplash.com/photo-1514995669114-6081e934b693?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-yellow-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Change
        </h1>
        <p className="text-xl md:text-xl text-gray-300">
          Transform Your Life, One Step at a Time
        </p>
      </div>
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 border-none text-white overflow-hidden hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-80`}
              ></div>
              <Image
                width={700}
                height={700}
                src={category.image}
                alt={category.title}
                className="object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                <category.icon className="w-6 h-6" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{category.title}</CardTitle>
              <CardDescription className="text-gray-300">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Discover the power of {category.title.toLowerCase()} and
                transform your life.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/${category.title.toLocaleLowerCase()}`}>
                <Button
                  className={`w-full bg-gradient-to-r ${category.color} text-white hover:opacity-90 transition-opacity duration-300`}
                >
                  Get Started
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        className="text-xl mb-32 bg-gradient-to-r from-blue-600 to-indigo-800"
        onClick={newPlan}
      >
        {" "}
        Want To Generate Different Plans??{" "}
      </Button>
    </div>
  );
}
