import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, PlayCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Video {
  id: number;
  title: string;
  createdAt: Date;
  status: "Ongoing" | "Completed";
}

interface Role {
  id: number;
  name: string;
}

export default function ChannelPage() {
  const navigate = useNavigate();
  const { creatorName, name } = useParams();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newRole, setNewRole] = useState("");
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Editor" },
    { id: 2, name: "Recorder 1" },
    { id: 3, name: "Recorder 2" },
    { id: 4, name: "Model Maker" },
    { id: 5, name: "Texture Pack Map Developer" },
    { id: 6, name: "Thumbnail Maker" },
  ]);

  // Mock video data
  const videos: Video[] = useMemo(
    () => [
      {
        id: 1,
        title: "Getting Started with React",
        createdAt: new Date("2024-01-15"),
        status: "Completed",
      },
      {
        id: 2,
        title: "Advanced TypeScript Features",
        createdAt: new Date("2024-01-20"),
        status: "Completed",
      },
      {
        id: 3,
        title: "Building a Full-Stack App",
        createdAt: new Date("2024-02-05"),
        status: "Ongoing",
      },
      {
        id: 4,
        title: "State Management Deep Dive",
        createdAt: new Date("2024-02-10"),
        status: "Ongoing",
      },
    ],
    []
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = [...videos];
    if (selectedMonth !== "all") {
      filtered = filtered.filter(
        (video) => months[video.createdAt.getMonth()] === selectedMonth
      );
    }
    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [videos, selectedMonth]);

  const handleAddRole = () => {
    if (newRole.trim()) {
      setRoles([...roles, { id: roles.length + 1, name: newRole.trim() }]);
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  const handleCreate = () => {
    // Handle create logic here
    setIsModalOpen(false);
    setNewVideoTitle("");
    // Reset other form states if needed
  };

  const handleVideoClick = (videoId: number) => {
    navigate(`/${creatorName}/${name}/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8">
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Creator: {creatorName}
                </CardTitle>
                <p className="text-3xl font-bold text-white mb-2">
                  Channel: {name}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create New Video
                </Button>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem
                      value="all"
                      className="text-white data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                    >
                      All Months
                    </SelectItem>
                    {months.map((month) => (
                      <SelectItem
                        key={month}
                        value={month}
                        className="text-white data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-md font-medium">Title</label>
                <Input
                  placeholder="Enter video title"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-md font-medium">Roles</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Badge
                      key={role.id}
                      className="text-sm bg-gray-800 text-white flex items-center gap-1"
                    >
                      {role.name}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-400"
                        onClick={() => handleRemoveRole(role.id)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add new role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleAddRole}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ScrollArea className="h-[600px] px-4">
          <div className="space-y-4 pb-4">
            {filteredAndSortedVideos.map((video) => (
              <div key={video.id}>
                <Card
                  onClick={() => handleVideoClick(video.id)}
                  className="bg-gray-900 border-gray-700 transition-colors duration-200 cursor-pointer hover:bg-gray-700"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <PlayCircle className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {video.title}
                          </h3>
                          <div className="flex items-center text-gray-400 mt-1">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {video.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          video.status === "Completed" ? "default" : "secondary"
                        }
                        className={`${
                          video.status === "Completed"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        {video.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
