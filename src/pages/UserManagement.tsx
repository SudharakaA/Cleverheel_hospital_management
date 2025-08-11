
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Mail, Phone, Calendar, Shield, Edit, Trash2, UserCog, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  user_roles: { role: string }[];
  patients?: { full_name: string; phone: string | null } | null;
  doctors?: { full_name: string; specialization: string; phone: string | null } | null;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    birthdate: "",
    gender: "",
    roles: ["patient"] as string[],
    specialization: "cardiology" as string
  });
  const [addingUser, setAddingUser] = useState(false);
  const { userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [userRole]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      // Fetch profiles first
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          patients (
            full_name,
            phone
          ),
          doctors (
            full_name,
            specialization,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = (profilesData || []).map(profile => ({
        ...profile,
        user_roles: rolesData?.filter(role => role.user_id === profile.id).map(r => ({ role: r.role })) || []
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      const email = user.email.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return fullName.includes(search) || email.includes(search);
    });
    
    setFilteredUsers(filtered);
  };

  const getUserDisplayName = (user: UserData) => {
    // Try patient name first, then doctor name, then profile name, then email
    if (user.patients) {
      return user.patients.full_name;
    }
    if (user.doctors) {
      return user.doctors.full_name;
    }
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email;
  };

  const getUserPhone = (user: UserData) => {
    if (user.patients && user.patients.phone) {
      return user.patients.phone;
    }
    if (user.doctors && user.doctors.phone) {
      return user.doctors.phone;
    }
    return user.phone;
  };

  const getUserRoles = (user: UserData) => {
    return user.user_roles.map(ur => ur.role);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'doctor':
        return 'default';
      case 'patient':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          phone: editingUser.phone,
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Update user roles
      const currentRoles = getUserRoles(editingUser);
      
      // Delete existing roles
      const { error: deleteRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', editingUser.id);

      if (deleteRolesError) throw deleteRolesError;

      // Insert new roles
      if (currentRoles.length > 0) {
        const { error: insertRolesError } = await supabase
          .from('user_roles')
          .insert(
            currentRoles.map(role => ({
              user_id: editingUser.id,
              role: role as any
            }))
          );

        if (insertRolesError) throw insertRolesError;
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Delete user roles first
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userToDelete.id);

      if (rolesError) throw rolesError;

      // Delete patient record if exists
      if (userToDelete.patients) {
        const { error: patientError } = await supabase
          .from('patients')
          .delete()
          .eq('user_id', userToDelete.id);

        if (patientError) throw patientError;
      }

      // Delete doctor record if exists
      if (userToDelete.doctors) {
        const { error: doctorError } = await supabase
          .from('doctors')
          .delete()
          .eq('user_id', userToDelete.id);

        if (doctorError) throw doctorError;
      }

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const updateEditingUserRole = (role: string, action: 'add' | 'remove') => {
    if (!editingUser) return;

    const currentRoles = editingUser.user_roles.map(ur => ur.role);
    let newRoles;

    if (action === 'add' && !currentRoles.includes(role)) {
      newRoles = [...editingUser.user_roles, { role }];
    } else if (action === 'remove') {
      newRoles = editingUser.user_roles.filter(ur => ur.role !== role);
    } else {
      return;
    }

    setEditingUser({
      ...editingUser,
      user_roles: newRoles
    });
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setAddingUser(true);
    try {
      console.log('Attempting to create user:', newUser.email);
      
      // Temporarily use direct signup instead of edge function to bypass the connection issue
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            phone: newUser.phone,
            birthdate: newUser.birthdate,
            gender: newUser.gender
          }
        }
      });

      console.log('Signup response:', { data, error });

      // Handle signup errors
      if (error) {
        console.error('Signup error:', error);
        
        if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
          throw new Error('A user with this email address already exists');
        } else {
          throw new Error(error.message || 'Failed to create user');
        }
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      // If user creation was successful, update additional profile info and roles
      if (data?.user) {
        console.log('User created successfully, updating additional info');
        
        // Update profile with phone if provided
        if (newUser.phone) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              phone: newUser.phone,
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.warn('Profile update error:', profileError);
          }
        }

        // Add selected user roles (the signup already creates a default 'patient' role via trigger)
        // First, delete the default patient role if user didn't select patient
        if (!newUser.roles.includes('patient')) {
          const { error: deleteDefaultRole } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', data.user.id)
            .eq('role', 'patient');
          
          if (deleteDefaultRole) {
            console.warn('Error deleting default patient role:', deleteDefaultRole);
          }
        }
        
        // Add all selected roles except patient (which is already added or kept)
        const rolesToAdd = newUser.roles.filter(role => role !== 'patient');
        if (rolesToAdd.length > 0) {
          const { error: rolesError } = await supabase
            .from('user_roles')
            .insert(
              rolesToAdd.map(role => ({
                user_id: data.user.id,
                role: role as any
              }))
            );

          if (rolesError) {
            console.warn('Additional roles insert error:', rolesError);
          }
        }

        // Create doctor record if doctor role is selected
        if (newUser.roles.includes('doctor')) {
          const fullName = `${newUser.first_name} ${newUser.last_name}`.trim() || newUser.email;
          
          const { error: doctorError } = await supabase
            .from('doctors')
            .insert({
              user_id: data.user.id,
              full_name: fullName,
              email: newUser.email,
              phone: newUser.phone || null,
              specialization: newUser.specialization as any,
              qualifications: '',
              experience_years: 0,
              consultation_fee: 0,
              available_days: [],
              available_hours: '09:00-17:00',
              symptoms: []
            });

          if (doctorError) {
            console.warn('Doctor record creation error:', doctorError);
          }
        }

        // Create patient record if patient role is selected
        if (newUser.roles.includes('patient')) {
          const fullName = `${newUser.first_name} ${newUser.last_name}`.trim() || newUser.email;
          
          const { error: patientError } = await supabase
            .from('patients')
            .insert({
              user_id: data.user.id,
              full_name: fullName,
              email: newUser.email,
              phone: newUser.phone || null
            });

          if (patientError) {
            console.warn('Patient record creation error:', patientError);
          }
        }
      }

      toast({
        title: "Success",
        description: "User created successfully",
      });

      setAddUserDialogOpen(false);
      setNewUser({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        birthdate: "",
        gender: "",
        roles: ["patient"],
        specialization: "cardiology"
      });
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      let errorMessage = "Failed to create user";
      
      // Handle specific error messages
      if (error.message?.includes("already been registered") || 
          error.message?.includes("already exists") ||
          error.message?.includes("email address already exists")) {
        errorMessage = "A user with this email address already exists";
      } else if (error.message?.includes("user not allowed") || 
                 error.message?.includes("permission")) {
        errorMessage = "You don't have permission to create users. Please contact your administrator.";
      } else if (error.message?.includes("non-2xx status code")) {
        errorMessage = "Server error occurred. Please check the logs and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };

  const updateNewUserRole = (role: string, action: 'add' | 'remove') => {
    let newRoles;

    if (action === 'add' && !newUser.roles.includes(role)) {
      newRoles = [...newUser.roles, role];
    } else if (action === 'remove') {
      newRoles = newUser.roles.filter(r => r !== role);
    } else {
      return;
    }

    setNewUser({
      ...newUser,
      roles: newRoles
    });
  };

  if (userRole !== 'admin') {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              Only administrators can access user management.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      topbar={
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-semibold">User Management</h1>
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} users
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Users
            </CardTitle>
            <CardDescription>
              Search by name or email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Users
                </CardTitle>
                <CardDescription>
                  View and manage all users registered in the system
                </CardDescription>
              </div>
              <Button onClick={() => setAddUserDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : filteredUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {getUserDisplayName(user)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getUserPhone(user) ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {getUserPhone(user)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No phone</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          {getUserRoles(user).map((role) => (
                            <Badge 
                              key={role} 
                              variant={getRoleBadgeVariant(role)}
                              className="capitalize"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      
                       <TableCell>
                         {user.doctors ? (
                           <span className="capitalize">
                             {user.doctors.specialization.replace('_', ' ')}
                           </span>
                         ) : (
                           <span className="text-muted-foreground">N/A</span>
                         )}
                       </TableCell>
                      
                       <TableCell>
                         <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-muted-foreground" />
                           {new Date(user.created_at).toLocaleDateString()}
                         </div>
                       </TableCell>
                       
                       <TableCell>
                         <div className="flex items-center gap-2">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleEditUser(user)}
                           >
                             <Edit className="w-4 h-4 mr-1" />
                             Edit
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleDeleteUser(user)}
                             className="text-destructive hover:text-destructive"
                           >
                             <Trash2 className="w-4 h-4 mr-1" />
                             Delete
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and roles.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editingUser.first_name || ""}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      first_name: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={editingUser.last_name || ""}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      last_name: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    phone: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editingUser.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label>User Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {['admin', 'doctor', 'patient'].map(role => {
                    const hasRole = getUserRoles(editingUser).includes(role);
                    return (
                      <Button
                        key={role}
                        variant={hasRole ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateEditingUserRole(role, hasRole ? 'remove' : 'add')}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to toggle roles
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{userToDelete ? getUserDisplayName(userToDelete) : ""}</strong>'s
              account and remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add New User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account with email and password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new_first_name">First Name</Label>
                <Input
                  id="new_first_name"
                  placeholder="First name"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({
                    ...newUser,
                    first_name: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_last_name">Last Name</Label>
                <Input
                  id="new_last_name"
                  placeholder="Last name"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({
                    ...newUser,
                    last_name: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="new_email"
                type="email"
                placeholder="user@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({
                  ...newUser,
                  email: e.target.value
                })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">Password <span className="text-destructive">*</span></Label>
              <Input
                id="new_password"
                type="password"
                placeholder="Enter a secure password"
                value={newUser.password}
                onChange={(e) => setNewUser({
                  ...newUser,
                  password: e.target.value
                })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_phone">Phone</Label>
              <Input
                id="new_phone"
                placeholder="Phone number"
                value={newUser.phone}
                onChange={(e) => setNewUser({
                  ...newUser,
                  phone: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_birthdate">Birthdate</Label>
              <Input
                id="new_birthdate"
                type="date"
                value={newUser.birthdate}
                onChange={(e) => setNewUser({
                  ...newUser,
                  birthdate: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_gender">Gender</Label>
              <select 
                id="new_gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newUser.gender}
                onChange={(e) => setNewUser({
                  ...newUser,
                  gender: e.target.value
                })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>User Roles</Label>
              <div className="flex flex-wrap gap-2">
                {['admin', 'doctor', 'patient'].map(role => {
                  const hasRole = newUser.roles.includes(role);
                  return (
                    <Button
                      key={role}
                      variant={hasRole ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateNewUserRole(role, hasRole ? 'remove' : 'add')}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Click to toggle roles. At least one role is required.
              </p>
            </div>

            {/* Specialization field - only show when doctor role is selected */}
            {newUser.roles.includes('doctor') && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization <span className="text-destructive">*</span></Label>
                <Select
                  value={newUser.specialization}
                  onValueChange={(value) => setNewUser({
                    ...newUser,
                    specialization: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="gynecology">Gynecology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setAddUserDialogOpen(false);
                setNewUser({
                  email: "",
                  password: "",
                  first_name: "",
                  last_name: "",
                  phone: "",
                  birthdate: "",
                  gender: "",
                  roles: ["patient"],
                  specialization: "cardiology"
                });
              }}
              disabled={addingUser}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={addingUser || !newUser.email || !newUser.password || newUser.roles.length === 0}
            >
              {addingUser ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default UserManagement;
