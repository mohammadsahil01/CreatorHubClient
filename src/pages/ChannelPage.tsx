import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
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
import axios from "axios";
import { Scrollbar } from "@radix-ui/react-scroll-area";

interface Video {
  id: string;
  title: string;
  createdAt: Date;
  status: "Ongoing" | "Completed";
}

interface Role {
  id: number;
  name: string;
}
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

export default function ChannelPage() {
  const navigate = useNavigate();
  const { creatorName, name } = useParams();
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("id");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentDate.getFullYear().toString()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newRole, setNewRole] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Editor" },
    { id: 2, name: "Recorder 1" },
    { id: 3, name: "Recorder 2" },
    { id: 4, name: "Model Maker" },
    { id: 5, name: "Texture Pack Map Developer" },
    { id: 6, name: "Thumbnail Maker" },
  ]);

  // Mock video data (keep existing code)

  const years = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    return Array.from({ length: 5 }, (_, i) =>
      (currentYear - 2 + i).toString()
    );
  }, []);

  const handleAddRole = () => {
    if (newRole.trim()) {
      setRoles([...roles, { id: roles.length + 1, name: newRole.trim() }]);
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  const handleCreate = async () => {
    if (!channelId) {
      setError("Channel ID is missing");
      return;
    }

    if (!newVideoTitle.trim()) {
      setError("Video title is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log("roles", roles);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/videos`,
        {
          channelId: channelId,
          videoTitle: newVideoTitle.trim(),
          roles: roles,
        }
      );

      // Add the new video to the list (you might want to fetch the updated list instead)
      const newVideo: Video = {
        id: response.data.data._id,
        title: response.data.data.title,
        createdAt: new Date(response.data.data.createdAt),
        status: "Ongoing",
      };

      setVideos([newVideo, ...videos]);

      // Close modal and reset form
      setIsModalOpen(false);
      setNewVideoTitle("");
      setRoles([
        { id: 1, name: "Editor" },
        { id: 2, name: "Recorder 1" },
        { id: 3, name: "Recorder 2" },
        { id: 4, name: "Model Maker" },
        { id: 5, name: "Texture Pack Map Developer" },
        { id: 6, name: "Thumbnail Maker" },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create video";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    console.log("videoId", videoId);

    navigate(`/${creatorName}/${name}/${videoId}`);
  };

  const fetchVideos = async () => {
    if (!channelId) return;

    try {
      setIsLoading(true);
      const monthIndex =
        selectedMonth === "all" ? null : months.indexOf(selectedMonth) + 1;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/videos/channel/${channelId}`,
        {
          params: {
            year: selectedYear,
            month: monthIndex,
          },
        }
      );

      const formattedVideos: Video[] = response.data.data.map((video: any) => ({
        id: video._id,
        title: video.title,
        createdAt: new Date(video.addedDateTime),
        status: video.status,
      }));

      setVideos(formattedVideos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch videos";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [channelId, selectedMonth, selectedYear]);

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
                  className="rounded-[10px] bg-blue-600 hover:bg-blue-700"
                >
                  Create New Video
                </Button>
                <div className="flex-col">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="rounded-[10px] w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px] bg-gray-800 border-gray-700">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          className="text-white data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger className="mt-5 rounded-[10px] w-[180px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Filter by month" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px] bg-gray-800 border-gray-700">
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
                  className="rounded-[10px] bg-gray-800 border-gray-700 text-white"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
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
                    className="rounded-[10px] bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleAddRole}
                    size="sm"
                    className="rounded-[10px] bg-blue-600 hover:bg-blue-700"
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
                className="rounded-[10px] bg-gray-800 hover:bg-gray-700 text-white"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="rounded-[10px] bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ScrollArea className=" scroll-area h-[600px] px-4">
          <Scrollbar />
          <div className="space-y-4 pb-4">
            {videos.length > 0 ? (
              videos.map((video) => (
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
                            video.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                          className={`rounded-[10px] ${
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
              ))
            ) : (
              <div className="flex text-2xl justify-center items-center h-full text-gray-400">
                No videos found.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
