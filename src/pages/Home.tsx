import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const creators = [
  { name: "Rahul", role: "Creator" },
  { name: "Dash", role: "Creator" },
  { name: "Carrey", role: "Creator" },
];

export default function Home() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");

  const GetCreator = () => {};

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleCreatorClick = (creatorName: string) => {
    navigate(`/${creatorName}`);
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-black text-black dark:text-white"
      style={{ alignContent: "center" }}
    >
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Creator Hub</h1>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Creators</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {creators.map((creator) => (
              <Card
                key={creator.name}
                className="bg-gray-900 hover:bg-gray-800 border-gray-200 dark:border-gray-800 cursor-pointer hover:scale-105 transition-transform "
                onClick={() => handleCreatorClick(creator.name)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                        {creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{creator.name}</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        {creator.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
