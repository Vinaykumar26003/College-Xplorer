"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarClock, ChevronLeft, Edit2, MoreHorizontal, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { Task, Comment } from "@/lib/types";
import { 
  formatDate, 
  getTaskById, 
  getUserById, 
  getAssignedUsers,
  getPriorityColor,
  getStatusColor
} from "@/lib/utils/task-utils";

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would fetch the task from an API
    const fetchedTask = getTaskById(params.id);
    
    if (fetchedTask) {
      setTask(fetchedTask);
    } else {
      // Task not found, redirect to tasks list
      router.push("/tasks");
    }
  }, [params.id, router]);

  const handleAddComment = () => {
    if (!comment.trim() || !task) return;
    
    setIsLoading(true);
    
    // In a real app, you would send this to an API
    const userId = localStorage.getItem("userId") || "user-1";
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      taskId: task.id,
      userId,
      content: comment,
      createdAt: new Date().toISOString(),
    };
    
    // Update task with new comment
    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), newComment],
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API delay
    setTimeout(() => {
      setTask(updatedTask);
      setComment("");
      setIsLoading(false);
    }, 500);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!task) return;
    
    // In a real app, you would send this to an API
    const updatedTask = {
      ...task,
      status: newStatus as Task["status"],
      updatedAt: new Date().toISOString(),
    };
    
    setTask(updatedTask);
  };

  const handleDeleteTask = () => {
    setIsDeleting(true);
    
    // In a real app, you would send a delete request to an API
    // For the mock version, we'll just redirect after a delay
    setTimeout(() => {
      router.push("/tasks");
    }, 500);
  };

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case "backlog": return "Backlog";
      case "todo": return "To Do";
      case "in-progress": return "In Progress";
      case "in-review": return "In Review";
      case "done": return "Done";
      default: return status;
    }
  };

  const assignedUsers = getAssignedUsers(task);
  const creator = getUserById(task.createdBy);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/tasks">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Task Details</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  Make changes to this task.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  This would normally open a form to edit the task. For this demo, editing is simulated.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {task.status !== "done" && (
                <DropdownMenuItem onClick={() => handleStatusChange("done")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Done
                </DropdownMenuItem>
              )}
              {task.status === "done" && (
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Reopen Task
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteTask}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {getTaskStatusLabel(task.status)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                {task.labels?.map((label) => (
                  <Badge key={label} variant="outline">
                    {label}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <CardDescription className="flex items-center">
                <CalendarClock className="mr-1 h-3 w-3" />
                Due {formatDate(task.dueDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{task.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>
                Discuss this task with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => {
                    const user = getUserById(comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="mb-4" />
              <div className="flex w-full gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getUserById(localStorage.getItem("userId") || "user-1")?.avatar} alt="Your avatar" />
                  <AvatarFallback>
                    {getUserById(localStorage.getItem("userId") || "user-1")?.name.substring(0, 2).toUpperCase() || "YO"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[80px]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddComment} 
                      disabled={!comment.trim() || isLoading}
                    >
                      {isLoading ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created By</h4>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={creator?.avatar} alt={creator?.name} />
                      <AvatarFallback>{creator?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{creator?.name}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created At</h4>
                  <p>{new Date(task.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                  <p>{new Date(task.updatedAt).toLocaleString()}</p>
                </div>
                
                {task.labels && task.labels.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Labels</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.labels.map((label) => (
                        <Badge key={label} variant="outline">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}