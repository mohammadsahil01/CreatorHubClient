import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface Channel {
  id: number;
  name: string;
  videoCount: number;
}

export default function CreatorPage() {
  const { creatorName } = useParams<{ creatorName: string }>();
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "Main Channel", videoCount: 15 },
    { id: 2, name: "Behind the Scenes", videoCount: 8 },
  ]);
  const [newChannelName, setNewChannelName] = useState("");

  const addChannel = () => {
    if (newChannelName.trim()) {
      setChannels([
        ...channels,
        { id: Date.now(), name: newChannelName.trim(), videoCount: 0 },
      ]);
      setNewChannelName("");
    }
  };

  const handleChannelClick = (name: string) => {
    navigate(`/${creatorName}/${name}`);
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
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="New channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="flex-grow bg-gray-800 text-white border-gray-700"
              />
              <Button
                onClick={addChannel}
                className="flex items-center bg-gray-700 hover:bg-gray-600"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Channel
              </Button>
            </div>
            <ScrollArea className="h-[500px] rounded-md">
              <div className="p-4 space-y-4">
                {channels.map((channel) => (
                  <Card
                    key={channel.id}
                    className="bg-gray-800 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out hover:bg-gray-700"
                    onClick={() => handleChannelClick(channel.name)}
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
                ))}
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
