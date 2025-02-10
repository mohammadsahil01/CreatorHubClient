import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
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
  _id: string;
  roleName: string;
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
  const [videoData, setVideoData] = useState({
    title: "",
    createdAt: new Date(),
    roles: [] as Role[],
  });
  const [roles, setRoles] = useState<Role[]>([]);

  // Fetch video details from the API
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/videos/${videoId}`
        );
        const data = response.data?.data;

        // Transform roles to include isEditing and tempValue
        const transformedRoles = data.roles.map((role: any) => ({
          ...role,
          isEditing: false,
          tempValue: role.assignedTo || "",
        }));

        // Update state with fetched data
        setVideoData({
          title: data.title,
          createdAt: new Date(data.createdAt),
          roles: transformedRoles,
        });
        setRoles(transformedRoles);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const handleEdit = (roleId: string) => {
    setRoles(
      roles.map((role) =>
        role._id === roleId
          ? { ...role, isEditing: true, tempValue: role.assignedTo }
          : role
      )
    );
  };

  const handleSave = async (roleId: string) => {
    const roleToUpdate = roles.find((role) => role._id === roleId);
    if (!roleToUpdate) return;

    // Check if tempValue is empty
    if (!roleToUpdate.tempValue?.trim()) {
      // Reset isEditing and tempValue
      setRoles(
        roles.map((role) =>
          role._id === roleId
            ? { ...role, isEditing: false, tempValue: "" }
            : role
        )
      );
      return; // Exit the function early
    }

    try {
      // Make a PUT request to assign the role
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/videos/${videoId}/roles/${roleId}/assign`,
        { assigneeName: roleToUpdate.tempValue }
      );

      // Update the state if the API call is successful
      setRoles(
        roles.map((role) =>
          role._id === roleId
            ? { ...role, isEditing: false, assignedTo: role.tempValue }
            : role
        )
      );
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };
  const handleInputChange = (roleId: string, value: string) => {
    setRoles(
      roles.map((role) =>
        role._id === roleId ? { ...role, tempValue: value } : role
      )
    );
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/videos/${videoId}`, {
        status: "Completed",
      });

      setStatus("Completed");
      setShowAlert(false);
    } catch (error) {
      console.error("Error updating video status:", error);
    }
  };

  const handleAddRole = async () => {
    if (newRoleName.trim()) {
      try {
        // Make a POST request to add the new role
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/videos/${videoId}/roles`,
          { customRoleName: newRoleName.trim() }
        );

        // If the API call is successful, update the state with the new role
        const newRole = {
          _id: response.data.data._id, // Use the ID returned by the backend
          roleName: newRoleName.trim(),
          assignedTo: "",
          isEditing: false,
          tempValue: "",
        };

        setRoles([...roles, newRole]);
        setNewRoleName("");
        setShowAddRole(false);
      } catch (error) {
        console.error("Error adding new role:", error);
      }
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
                  key={role._id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <span className="text-lg font-medium">{role.roleName}</span>
                  <div className="flex items-center space-x-2">
                    {role.isEditing ? (
                      <>
                        <Input
                          placeholder="Assign person"
                          value={role.tempValue}
                          onChange={(e) =>
                            handleInputChange(role._id, e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white w-48"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSave(role._id)}
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
                          onClick={() => handleEdit(role._id)}
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
