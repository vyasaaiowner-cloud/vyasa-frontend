'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, UserCheck, UserX, Upload } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton } from '@/components/skeletons';
import { teachersApi } from '@/features/teachers/api';
import { classesApi } from '@/features/classes/api';
import type { Teacher, CreateTeacherDto, UpdateTeacherDto } from '@/features/teachers/types';
import { toast } from 'sonner';
import { getSchoolContext } from '@/lib/school-scope';
import Link from 'next/link';

export default function TeachersManagementPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateTeacherDto>({
    name: '',
    countryCode: '+91',
    mobileNo: '',
    email: '',
    sectionIds: [],
  });

  const schoolId = getSchoolContext();

  // Fetch teachers with school-scoped cache key
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: () => teachersApi.getAll(false),
  });

  // Fetch classes with sections for assignment
  const { data: classes = [] } = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: () => classesApi.getAll(),
  });

  // Create teacher mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTeacherDto) => teachersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Teacher created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create teacher: ${error.message}`);
    },
  });

  // Update teacher sections mutation
  const updateSectionsMutation = useMutation({
    mutationFn: ({ id, sectionIds }: { id: string; sectionIds: string[] }) =>
      teachersApi.update(id, { sectionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
      setIsAssignOpen(false);
      setEditingTeacher(null);
      setSelectedSections([]);
      toast.success('Teacher sections updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update teacher sections: ${error.message}`);
    },
  });

  // Delete teacher mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => teachersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
      setDeleteConfirmOpen(false);
      setTeacherToDelete(null);
      toast.success('Teacher deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete teacher: ${error.message}`);
    },
  });

  // Activate/Deactivate teacher
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? teachersApi.deactivate(id) : teachersApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update teacher status: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      countryCode: '+91',
      mobileNo: '',
      email: '',
      sectionIds: [],
    });
    setEditingTeacher(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sanitize phone number before submission
    const sanitizedData = {
      ...formData,
      mobileNo: formData.mobileNo.replace(/\D/g, ''),
    };
    createMutation.mutate(sanitizedData);
  };

  const handleDelete = (id: string) => {
    setTeacherToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteMutation.mutate(teacherToDelete);
    }
  };

  const handleAssignSections = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setSelectedSections(teacher.assignments.map(a => a.sectionId));
    setIsAssignOpen(true);
  };

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleUpdateSections = () => {
    if (editingTeacher) {
      updateSectionsMutation.mutate({
        id: editingTeacher.id,
        sectionIds: selectedSections,
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
            <p className="text-slate-600">Manage school teachers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/teachers/bulk-upload">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Link>
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>Create a new teacher account</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="countryCode">Code</Label>
                        <Input
                          id="countryCode"
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.trim() })}
                          required
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="mobileNo">Mobile Number</Label>
                        <Input
                          id="mobileNo"
                          value={formData.mobileNo}
                          onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? 'Creating...' : 'Create Teacher'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>
              {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : teachers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No teachers found. Add your first teacher!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Sections Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map(teacher => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.user.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{teacher.user.phoneE164}</div>
                          {teacher.user.email && (
                            <div className="text-slate-500">{teacher.user.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.assignments.length > 0 ? (
                            teacher.assignments.map(assignment => (
                              <Badge key={assignment.id} variant="secondary" className="text-xs">
                                {assignment.section.class.name} - {assignment.section.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500">No sections assigned</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.isActive ? 'default' : 'secondary'}>
                          {teacher.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignSections(teacher)}
                            title="Assign Sections"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActiveMutation.mutate({ id: teacher.id, isActive: teacher.isActive })}
                            title={teacher.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {teacher.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Assign Sections Dialog */}
        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Sections to {editingTeacher?.user.name}</DialogTitle>
              <DialogDescription>
                Select the sections this teacher should be assigned to
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {classes.map(classItem => (
                <div key={classItem.id} className="space-y-2">
                  <h4 className="font-semibold text-sm">{classItem.name}</h4>
                  <div className="grid grid-cols-2 gap-2 ml-4">
                    {classItem.sections.map(section => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() => handleSectionToggle(section.id)}
                        />
                        <Label
                          htmlFor={section.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {section.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAssignOpen(false);
                  setEditingTeacher(null);
                  setSelectedSections([]);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateSections}
                disabled={updateSectionsMutation.isPending}
              >
                {updateSectionsMutation.isPending ? 'Updating...' : 'Update Sections'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Teacher</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this teacher? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setTeacherToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}
