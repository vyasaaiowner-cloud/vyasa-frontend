'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton } from '@/components/skeletons';
import { studentsApi } from '@/features/students/api';
import { classesApi } from '@/features/classes/api';
import type { Student, CreateStudentDto, UpdateStudentDto } from '@/features/students/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getSchoolContext } from '@/lib/school-scope';

export default function StudentsManagementPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [formData, setFormData] = useState<CreateStudentDto>({
    name: '',
    className: '',
    section: '',
    rollNo: 1,
    parentName: '',
    parentCountryCode: '+91',
    parentMobileNo: '',
    parentEmail: '',
  });

  const schoolId = getSchoolContext();

  // Fetch classes for filter
  const { data: classes = [] } = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: () => classesApi.getAll(),
  });

  // Fetch students with school-scoped cache key
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students', schoolId, selectedClass, selectedSection],
    queryFn: () => studentsApi.getAll(selectedClass || undefined, selectedSection || undefined),
  });

  // Create student mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateStudentDto) => {
      // Sanitize phone number if provided
      const sanitizedData = data.parentMobileNo
        ? { ...data, parentMobileNo: data.parentMobileNo.replace(/\D/g, '') }
        : data;
      return studentsApi.create(sanitizedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', schoolId] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Student created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create student: ${error.message}`);
    },
  });

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
      studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', schoolId] });
      setIsEditOpen(false);
      setEditingStudent(null);
      toast.success('Student updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });

  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', schoolId] });
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      toast.success('Student deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      className: '',
      section: '',
      rollNo: 1,
      parentName: '',
      parentCountryCode: '+91',
      parentMobileNo: '',
      parentEmail: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    const updateData: UpdateStudentDto = {
      name: editingStudent.name,
      className: editingStudent.className,
      section: editingStudent.section,
      rollNo: editingStudent.rollNo,
    };
    
    updateMutation.mutate({ id: editingStudent.id, data: updateData });
  };

  const handleDelete = (id: string) => {
    setStudentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Students</h2>
            <p className="text-slate-600">Manage student records</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Create a new student record</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class</Label>
                      <Input
                        id="className"
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        placeholder="Class 5"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        placeholder="A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll No</Label>
                      <Input
                        id="rollNo"
                        type="number"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Parent Information (Optional)</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Parent Name</Label>
                        <Input
                          id="parentName"
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentEmail">Parent Email</Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="parentCode">Code</Label>
                          <Input
                            id="parentCode"
                            value={formData.parentCountryCode}
                            onChange={(e) => setFormData({ ...formData, parentCountryCode: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="parentMobile">Mobile</Label>
                          <Input
                            id="parentMobile"
                            value={formData.parentMobileNo}
                            onChange={(e) => setFormData({ ...formData, parentMobileNo: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Student'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={selectedClass || "all"} onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input
                  placeholder="All Sections"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>
              {students.length} student{students.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={10} />
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No students found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Parents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>
                        {student.parents && student.parents.length > 0 ? (
                          <div className="text-sm">
                            {student.parents.map(p => (
                              <div key={p.id}>{p.parent.name}</div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">No parent linked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(student)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(student.id)}
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
          <DialogContent>
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>Update student information</DialogDescription>
              </DialogHeader>
              {editingStudent && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Input
                        value={editingStudent.className}
                        onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Input
                        value={editingStudent.section}
                        onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Roll No</Label>
                      <Input
                        type="number"
                        value={editingStudent.rollNo}
                        onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update Student'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this student? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setStudentToDelete(null);
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
