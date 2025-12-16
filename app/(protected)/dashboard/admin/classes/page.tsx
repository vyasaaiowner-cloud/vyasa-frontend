'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton } from '@/components/skeletons';
import { classesApi } from '@/features/classes/api';
import type { Class, Section, CreateClassDto, CreateSectionDto, UpdateClassDto, UpdateSectionDto } from '@/features/classes/types';
import { toast } from 'sonner';

export default function ClassesManagementPage() {
  const queryClient = useQueryClient();
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'class' | 'section' } | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [classFormData, setClassFormData] = useState<CreateClassDto>({ name: '' });
  const [sectionFormData, setSectionFormData] = useState<CreateSectionDto>({ name: '', classId: '' });

  // Fetch classes
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classesApi.getAll(),
  });

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: (data: CreateClassDto) => classesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsCreateClassOpen(false);
      setClassFormData({ name: '' });
      toast.success('Class created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create class: ${error.message}`);
    },
  });

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: (data: CreateSectionDto) => classesApi.createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsCreateSectionOpen(false);
      setSectionFormData({ name: '', classId: '' });
      toast.success('Section created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create section: ${error.message}`);
    },
  });

  // Update class mutation
  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassDto }) =>
      classesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setEditingClass(null);
      toast.success('Class updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update class: ${error.message}`);
    },
  });

  // Delete class mutation
  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setDeleteConfirmOpen(false);
      setClassToDelete(null);
      toast.success('Class deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete class: ${error.message}`);
    },
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: (id: string) => classesApi.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Section deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete section: ${error.message}`);
    },
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    createClassMutation.mutate(classFormData);
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    createSectionMutation.mutate(sectionFormData);
  };

  const handleDeleteClass = (id: string) => {
    setClassToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      deleteClassMutation.mutate(classToDelete);
    }
  };

  const handleDeleteSection = (id: string) => {
    deleteSectionMutation.mutate(id);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Classes & Sections</h2>
            <p className="text-slate-600">Manage school classes and sections</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateClass}>
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>Create a new class</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input
                        id="className"
                        placeholder="e.g., Class 5"
                        value={classFormData.name}
                        onChange={(e) => setClassFormData({ name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateClassOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createClassMutation.isPending}>
                      {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateSectionOpen} onOpenChange={setIsCreateSectionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateSection}>
                  <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                    <DialogDescription>Create a new section for a class</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="classSelect">Select Class</Label>
                      <select
                        id="classSelect"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={sectionFormData.classId}
                        onChange={(e) => setSectionFormData({ ...sectionFormData, classId: e.target.value })}
                        required
                      >
                        <option value="">Select a class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sectionName">Section Name</Label>
                      <Input
                        id="sectionName"
                        placeholder="e.g., A, B, C"
                        value={sectionFormData.name}
                        onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateSectionOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createSectionMutation.isPending}>
                      {createSectionMutation.isPending ? 'Creating...' : 'Create Section'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Classes List */}
        <div className="grid gap-6">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <TableSkeleton rows={5} />
              </CardContent>
            </Card>
          ) : classes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No classes found. Create your first class!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            classes.map(cls => (
              <Card key={cls.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{cls.name}</CardTitle>
                      <CardDescription>
                        {cls.sections.length} section{cls.sections.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClass(cls.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {cls.sections.length === 0 ? (
                    <p className="text-sm text-slate-500">No sections in this class</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cls.sections.map(section => (
                        <div key={section.id} className="flex items-center gap-2 border rounded-lg px-3 py-2">
                          <Badge variant="secondary">Section {section.name}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Class</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this class and all its sections? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setClassToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteClassMutation.isPending}
              >
                {deleteClassMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}
