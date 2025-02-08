import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, Clock, Save, Edit2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Role {
  id: number;
  name: string;
  assignedTo: string;
  isEditing: boolean;
  tempValue: string;
}

export default function VideoPage() {
  const { creatorName, name, videoId } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [status, setStatus] = useState<"Ongoing" | "Completed">("Ongoing");

  // Mock data - replace with actual data fetching
  const [videoData] = useState({
    title: "Building a Full-Stack App",
    createdAt: new Date("2024-02-05T14:30:00"),
    roles: [
      {
        id: 1,
        name: "Editor",
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      },
      {
        id: 2,
        name: "Recorder 1",
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      },
      {
        id: 3,
        name: "Recorder 2",
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      },
      {
        id: 4,
        name: "Model Maker",
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      },
      {
        id: 5,
        name: "Texture Pack Map Developer",
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      },
      {
        id: 6,
        name: "Thumbnail Maker",
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      },
    ],
  });

  const [roles, setRoles] = useState<Role[]>(videoData.roles);

  const handleEdit = (roleId: number) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? { ...role, isEditing: true, tempValue: role.assignedTo }
          : role
      )
    );
  };

  const handleSave = (roleId: number) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? { ...role, isEditing: false, assignedTo: role.tempValue }
          : role
      )
    );
  };

  const handleInputChange = (roleId: number, value: string) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId ? { ...role, tempValue: value } : role
      )
    );
  };

  const handleStatusChange = () => {
    setStatus("Completed");
    setShowAlert(false);
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newRole: Role = {
        id: Math.max(...roles.map((r) => r.id)) + 1,
        name: newRoleName.trim(),
        assignedTo: "",
        isEditing: false,
        tempValue: "",
      };
      setRoles([...roles, newRole]);
      setNewRoleName("");
      setShowAddRole(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8">
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="space-y-4">
              <CardTitle className="text-3xl font-bold text-white">
                {videoData.title}
              </CardTitle>
              <p className="text-xl text-gray-400">Channel: {name}</p>
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {videoData.createdAt.toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {videoData.createdAt.toLocaleTimeString()}
                </div>
                <Badge
                  variant={status === "Completed" ? "default" : "secondary"}
                  className={`${
                    status === "Completed" ? "bg-green-600" : "bg-yellow-600"
                  } text-white`}
                >
                  {status}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-white">
                Role Assignments
              </CardTitle>
              <Button
                onClick={() => setShowAddRole(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <span className="text-lg font-medium">{role.name}</span>
                  <div className="flex items-center space-x-2">
                    {role.isEditing ? (
                      <>
                        <Input
                          placeholder="Assign person"
                          value={role.tempValue}
                          onChange={(e) =>
                            handleInputChange(role.id, e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white w-48"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSave(role.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="w-48 px-3 py-2">
                          {role.assignedTo || "Unassigned"}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(role.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {status !== "Completed" && (
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAlert(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark as Completed
            </Button>
          </div>
        )}

        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent className="bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Mark Video as Completed?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. The video status will be
                permanently changed to completed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleStatusChange}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showAddRole} onOpenChange={setShowAddRole}>
          <AlertDialogContent className="bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Role</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Enter the name of the new role to add to the video project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="Role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAddRole}
                className="bg-green-600 hover:bg-green-700"
              >
                Add Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
