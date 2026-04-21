const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const apiService = {
  // Employees
  getEmployees: () => request<any[]>('/employees'),
  createEmployee: (data: any) => request<any>('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: string, data: any) => request<any>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id: string) => request<void>(`/employees/${id}`, { method: 'DELETE' }),

  // Managers
  getManagers: () => request<any[]>('/managers'),
  createManager: (data: any) => request<any>('/managers', { method: 'POST', body: JSON.stringify(data) }),
  updateManager: (id: string, data: any) => request<any>(`/managers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Sites
  getSites: () => request<any[]>('/sites'),
  createSite: (data: any) => request<any>('/sites', { method: 'POST', body: JSON.stringify(data) }),
  updateSite: (id: string, data: any) => request<any>(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSite: (id: string) => request<void>(`/sites/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: () => request<any[]>('/attendance'),
  saveAttendance: (data: any) => request<any>('/attendance', { method: 'POST', body: JSON.stringify(data) }),

  // Documents
  getDocuments: () => request<any[]>('/documents'),
  createDocument: (data: any) => request<any>('/documents', { method: 'POST', body: JSON.stringify(data) }),
  updateDocument: (id: string, data: any) => request<any>(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDocument: (id: string) => request<void>(`/documents/${id}`, { method: 'DELETE' }),
};
