'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Calendar, Upload } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton } from '@/components/skeletons';
import { holidaysApi } from '@/features/holidays/api';
import type { Holiday, CreateHolidayDto, UpdateHolidayDto } from '@/features/holidays/types';
import { toast } from '@/lib/toast';
import Link from 'next/link';

export default function HolidaysManagementPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState<CreateHolidayDto>({
    name: '',
    date: '',
  });

  // Fetch holidays
  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => holidaysApi.getAll(),
  });

  // Create holiday mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateHolidayDto) => holidaysApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Holiday created successfully!');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Update holiday mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHolidayDto }) =>
      holidaysApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      setIsEditOpen(false);
      setEditingHoliday(null);
      toast.success('Holiday updated successfully!');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Delete holiday mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => holidaysApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Holiday deleted successfully!');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;
    
    const updateData: UpdateHolidayDto = {
      name: editingHoliday.name,
      date: editingHoliday.date,
    };
    
    updateMutation.mutate({ id: editingHoliday.id, data: updateData });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">School Holidays</h2>
            <p className="text-slate-600">Manage school holiday calendar</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/holidays/bulk-upload">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Link>
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Add New Holiday</DialogTitle>
                    <DialogDescription>Create a new school holiday</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Holiday Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Diwali, Independence Day"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? 'Creating...' : 'Create Holiday'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Holiday</DialogTitle>
                <DialogDescription>Update holiday details</DialogDescription>
              </DialogHeader>
              {editingHoliday && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Holiday Name</Label>
                    <Input
                      id="editName"
                      value={editingHoliday.name}
                      onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDate">Date</Label>
                    <Input
                      id="editDate"
                      type="date"
                      value={editingHoliday.date}
                      onChange={(e) => setEditingHoliday({ ...editingHoliday, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update Holiday'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Holidays Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Holidays</CardTitle>
            <CardDescription>
              {holidays.length} holiday{holidays.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : sortedHolidays.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No holidays scheduled yet.</p>
                <p className="text-xs mt-1">Click "Add Holiday" to create one.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHolidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">{holiday.name}</TableCell>
                      <TableCell>{formatDate(holiday.date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(holiday)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(holiday.id)}
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
      </div>
    </ErrorBoundary>
  );
}
