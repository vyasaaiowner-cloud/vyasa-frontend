/**
 * Breadcrumb utility for generating breadcrumb items from route paths
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Custom labels for specific routes
 * Key should be the path segment or full path
 */
const customLabels: Record<string, string> = {
  // Dashboard routes
  'dashboard': 'Dashboard',
  'super-admin': 'Platform Admin',
  'admin': 'School Admin',
  'teacher': 'Teacher Dashboard',
  'parent': 'Parent Dashboard',
  
  // Feature modules
  'teachers': 'Teachers',
  'students': 'Students',
  'classes': 'Classes',
  'sections': 'Sections',
  'attendance': 'Attendance',
  'announcements': 'Announcements',
  'holidays': 'Holidays',
  'schools': 'Schools',
  
  // Actions
  'new': 'Add New',
  'edit': 'Edit',
  'view': 'View Details',
};

/**
 * Convert a path segment to a readable label
 */
function formatLabel(segment: string): string {
  // Check if we have a custom label
  if (customLabels[segment]) {
    return customLabels[segment];
  }
  
  // If it looks like a UUID or ID, return 'Details'
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return 'Details';
  }
  
  // Otherwise, capitalize and replace hyphens
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate breadcrumb items from a pathname
 * @param pathname - Current pathname from usePathname()
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove leading/trailing slashes and split
  const segments = pathname.replace(/^\/|\/$/g, '').split('/');
  
  // Filter out empty segments and (protected) route group
  const validSegments = segments.filter(s => s && !s.startsWith('('));
  
  // Always start with Dashboard
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' }
  ];
  
  // Build breadcrumbs by accumulating path
  let currentPath = '';
  validSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip the first 'dashboard' segment since we already have it
    if (segment === 'dashboard' && index === 0) {
      return;
    }
    
    breadcrumbs.push({
      label: formatLabel(segment),
      href: currentPath,
    });
  });
  
  return breadcrumbs;
}

/**
 * Get custom breadcrumbs for specific pages
 * This can be used to override auto-generated breadcrumbs
 */
export function getCustomBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  // Add custom breadcrumb configurations here
  // Example:
  // if (pathname === '/dashboard/admin/teachers/new') {
  //   return [
  //     { label: 'Dashboard', href: '/dashboard' },
  //     { label: 'Teachers', href: '/dashboard/admin/teachers' },
  //     { label: 'Add New Teacher', href: '/dashboard/admin/teachers/new' },
  //   ];
  // }
  
  return null; // Return null to use auto-generated breadcrumbs
}
