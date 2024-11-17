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

export default function Component() {
  const categories = [
    {
      title: "Exercise",
      description: "Build strength and endurance",
      icon: Dumbbell,
      image: "https://t3.ftcdn.net/jpg/05/72/91/08/360_F_572910874_gjyCeTnHtxFMIuPFcfE0djznBMgsU4Bf.jpg",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Yoga",
      description: "Improve flexibility and balance",
      icon: Lotus,
      image: "https://www.shutterstock.com/image-vector/international-yoga-day-vector-illustration-260nw-1960577128.jpg",
      color: "from-green-500 to-teal-500",
    },
    
    {
      title: "Meditation",
      description: "Reduce stress and find inner peace",
      icon: Brain,
      image: "https://t3.ftcdn.net/jpg/04/87/48/66/360_F_487486623_CatNgUbulZ6rOpENckeTzRfY7IzrqOKd.jpg",
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Nutrition",
      description: "Fuel your body with healthy foods",
      icon: Apple,
      image: "https://thumbs.dreamstime.com/b/rice-vegetables-cooking-ingredients-bowls-dark-rustic-background-banner-healthy-vegetarian-food-diet-nutrition-82672613.jpg",
      color: "from-yellow-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex flex-col items-center justify-center p-4 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Change
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Transform Your Life, One Step at a Time
        </p>
      </div>
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="bg-white/10 backdrop-blur-lg border-none text-white overflow-hidden hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-80`}
              ></div>
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
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
              <Link href={`/${category.title}`}>
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
    </div>
  );
}
