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
import { announcementsApi } from '@/features/announcements/api';
import { classesApi } from '@/features/classes/api';
import type { Announcement, CreateAnnouncementDto, UpdateAnnouncementDto } from '@/features/announcements/types';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { getSchoolContext } from '@/lib/school-scope';

export default function AnnouncementsManagementPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAnnouncementDto>({
    title: '',
    content: '',
    targetAll: true,
    targetClass: '',
    targetSection: '',
  });

  const schoolId = getSchoolContext();

  // Fetch announcements with school-scoped cache key
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements', schoolId],
    queryFn: () => announcementsApi.getAll(),
  });

  // Fetch classes for targeting
  const { data: classes = [] } = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: () => classesApi.getAll(),
  });

  // Create announcement mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementDto) => announcementsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', schoolId] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Announcement created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create announcement: ${error.message}`);
    },
  });

  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementDto }) =>
      announcementsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsEditOpen(false);
      setEditingAnnouncement(null);
      toast.success('Announcement updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update announcement: ${error.message}`);
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', schoolId] });
      setDeleteConfirmOpen(false);
      setAnnouncementToDelete(null);
      toast.success('Announcement deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete announcement: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      targetAll: true,
      targetClass: '',
      targetSection: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: CreateAnnouncementDto = {
      title: formData.title,
      content: formData.content,
      targetAll: formData.targetAll,
      ...(formData.targetAll ? {} : {
        targetClass: formData.targetClass,
        targetSection: formData.targetSection,
      }),
    };
    createMutation.mutate(submitData);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    const updateData: UpdateAnnouncementDto = {
      title: editingAnnouncement.title,
      content: editingAnnouncement.content,
      targetAll: editingAnnouncement.targetAll,
      ...(editingAnnouncement.targetAll ? {} : {
        targetClass: editingAnnouncement.targetClass || '',
        targetSection: editingAnnouncement.targetSection || '',
      }),
    };

    updateMutation.mutate({ id: editingAnnouncement.id, data: updateData });
  };

  const handleDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      deleteMutation.mutate(announcementToDelete);
    }
  };

  const getTargetBadge = (announcement: Announcement) => {
    if (announcement.targetAll) {
      return <Badge>All Students</Badge>;
    }
    if (announcement.targetClass && announcement.targetSection) {
      return <Badge variant="secondary">{announcement.targetClass} - {announcement.targetSection}</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
            <p className="text-slate-600">Manage school announcements</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                  <DialogDescription>Send an announcement to students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <textarea
                      id="content"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="targetAll"
                        checked={formData.targetAll}
                        onCheckedChange={(checked: boolean) => setFormData({
                          ...formData,
                          targetAll: checked,
                          targetClass: '',
                          targetSection: '',
                        })}
                      />
                      <Label htmlFor="targetAll" className="font-normal">
                        Send to all students
                      </Label>
                    </div>
                    {!formData.targetAll && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="targetClass">Target Class</Label>
                          <select
                            id="targetClass"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.targetClass}
                            onChange={(e) => setFormData({
                              ...formData,
                              targetClass: e.target.value,
                              targetSection: '',
                            })}
                            required
                          >
                            <option value="">Select a class</option>
                            {classes.map(cls => (
                              <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="targetSection">Target Section</Label>
                          <select
                            id="targetSection"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.targetSection}
                            onChange={(e) => setFormData({ ...formData, targetSection: e.target.value })}
                            required
                            disabled={!formData.targetClass}
                          >
                            <option value="">Select a section</option>
                            {classes
                              .find(c => c.name === formData.targetClass)
                              ?.sections.map(section => (
                                <option key={section.id} value={section.name}>
                                  {section.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Announcements Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>
              {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={8} />
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No announcements yet. Create your first announcement!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map(announcement => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell className="max-w-md truncate">{announcement.content}</TableCell>
                      <TableCell>{getTargetBadge(announcement)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(announcement)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(announcement.id)}
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Announcement</DialogTitle>
                <DialogDescription>Update announcement details</DialogDescription>
              </DialogHeader>
              {editingAnnouncement && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editingAnnouncement.title}
                      onChange={(e) => setEditingAnnouncement({
                        ...editingAnnouncement,
                        title: e.target.value,
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editingAnnouncement.content}
                      onChange={(e) => setEditingAnnouncement({
                        ...editingAnnouncement,
                        content: e.target.value,
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="editTargetAll"
                        checked={editingAnnouncement.targetAll}
                        onCheckedChange={(checked: boolean) => setEditingAnnouncement({
                          ...editingAnnouncement,
                          targetAll: checked,
                          targetClass: '',
                          targetSection: '',
                        })}
                      />
                      <Label htmlFor="editTargetAll" className="font-normal">
                        Send to all students
                      </Label>
                    </div>
                    {!editingAnnouncement.targetAll && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Target Class</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editingAnnouncement.targetClass || ''}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              targetClass: e.target.value,
                              targetSection: '',
                            })}
                            required
                          >
                            <option value="">Select a class</option>
                            {classes.map(cls => (
                              <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Target Section</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editingAnnouncement.targetSection || ''}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              targetSection: e.target.value,
                            })}
                            required
                            disabled={!editingAnnouncement.targetClass}
                          >
                            <option value="">Select a section</option>
                            {classes
                              .find(c => c.name === editingAnnouncement.targetClass)
                              ?.sections.map(section => (
                                <option key={section.id} value={section.name}>
                                  {section.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Announcement</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this announcement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setAnnouncementToDelete(null);
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
