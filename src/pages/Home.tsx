import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

interface Creator {
  name: string;
  _id: string; // Adding id assuming API returns it
}

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { logout, user } = useKindeAuth();
  console.log(user?.given_name);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/creators`
        );
        setCreators(response.data?.data);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleCreatorClick = (creatorName: string, creatorId: string): void => {
    navigate(`/${creatorName}?id=${creatorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-black text-black dark:text-white"
      style={{ alignContent: "center" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-white">
                  {user?.given_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 rounded-[10px]">
              <DropdownMenuItem
                className="text-white hover:text-white"
                onClick={() => logout()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Creator Hub Admin
          </h1>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Creators</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {creators.map((creator) => (
              <Card
                key={creator._id}
                className="bg-gray-900 hover:bg-gray-800 border-gray-200 dark:border-gray-800 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleCreatorClick(creator.name, creator._id)}
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
                        Creator
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
