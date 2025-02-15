import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Video } from "lucide-react";
import axios from "axios";

interface Channel {
  id: string;
  name: string;
  videoCount: number;
}

export default function CreatorPage() {
  const { creatorName } = useParams<{ creatorName: string }>();
  const [searchParams] = useSearchParams();
  const creatorId = searchParams.get("id");
  const navigate = useNavigate();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);

  const fetchChannels = async () => {
    if (!creatorId) return;

    setIsLoadingChannels(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/channels/${creatorId}`
      );
      const formattedChannels: Channel[] = response.data.channels.map(
        (channel: any) => ({
          id: channel._id,
          name: channel.name,
          videoCount: channel.videoCount || 0,
        })
      );
      setChannels(formattedChannels);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch channels";
      setError(errorMessage);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [creatorId]);

  const addChannel = async () => {
    if (!newChannelName.trim()) {
      setError("Channel name cannot be empty");
      return;
    }

    if (!creatorId) {
      setError("Creator ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/channels/createChannel`,
        {
          creatorId: creatorId,
          channelData: {
            name: newChannelName.trim(),
          },
        }
      );

      const newChannel: Channel = {
        id: response.data?.channel?._id,
        name: response.data?.channel?.name,
        videoCount: response.data?.channel?.videos?.length || 0,
      };

      setChannels((prevChannels) => [...prevChannels, newChannel]);
      setNewChannelName("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create channel";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelClick = (name: string, id: string): void => {
    navigate(`/${creatorName}/${name}?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">
            Creator: {creatorName}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your channels and create new ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="New channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="flex-grow bg-gray-800 text-white border-gray-700"
                  disabled={isLoading}
                />
                <Button
                  onClick={addChannel}
                  className="flex items-center rounded-[10px] bg-gray-700 hover:bg-gray-600"
                  disabled={isLoading}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isLoading ? "Creating..." : "Add Channel"}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <ScrollArea className="h-[500px] rounded-md">
              <div className="p-4 space-y-4">
                {isLoadingChannels ? (
                  <div className="text-center text-gray-400">
                    Loading channels...
                  </div>
                ) : channels.length === 0 ? (
                  <div className="text-center text-gray-400">
                    No channels found
                  </div>
                ) : (
                  channels.map((channel) => (
                    <Card
                      key={channel.id}
                      className="bg-gray-800 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out hover:bg-gray-700"
                      onClick={() =>
                        handleChannelClick(channel.name, channel.id)
                      }
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                        <div className="flex items-center space-x-4">
                          <CardTitle className="text-lg font-medium text-white">
                            {channel.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Video className="h-4 w-4 mr-2" />
                          <span>{channel.videoCount} videos</span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-400">
            You have {channels.length} channel{channels.length !== 1 ? "s" : ""}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
