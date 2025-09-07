import { AnimationEventHandler, AriaRole, ClipboardEventHandler, CompositionEventHandler, CSSProperties, DragEventHandler, FocusEventHandler, FormEventHandler, Key, KeyboardEventHandler, MouseEventHandler, PointerEventHandler, ReactEventHandler, ReactNode, RefAttributes, TouchEventHandler, TransitionEventHandler, UIEventHandler, useEffect, useState, WheelEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";

export const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { request, data, error, responseCode } = useApi();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      console.log(data);
      console.log(error);
      console.log(responseCode);
      
    }
  }, [isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
      await request("post", "/api/auth/set-password", { "token": token, "password": formData.newPassword });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if(data) {
        toast({
          title: "Success",
          description: data.token,
        });
      }
      else if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      }
      
      setFormData({
        newPassword: "",
        confirmPassword: ""
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Enter new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};