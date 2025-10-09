/** @format */

export interface EmailTemplate {
  id: string;
  code: string;
  templateName: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplateFormData {
  code: string;
  templateName: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
}

export interface EmailVariable {
  key: string;
  label: string;
  description: string;
  example: string;
}

// Predefined variables yang bisa digunakan dalam template
export const EMAIL_VARIABLES: EmailVariable[] = [
  {
    key: 'user.name',
    label: 'Nama Pengguna',
    description: 'Nama lengkap pengguna',
    example: 'John Doe'
  },
  {
    key: 'user.email',
    label: 'Email Pengguna',
    description: 'Alamat email pengguna',
    example: 'john.doe@example.com'
  },
  {
    key: 'user.username',
    label: 'Username',
    description: 'Username pengguna',
    example: 'johndoe'
  },
  {
    key: 'survey.title',
    label: 'Judul Survey',
    description: 'Judul survey yang sedang berjalan',
    example: 'Tracer Study 2024'
  },
  {
    key: 'survey.link',
    label: 'Link Survey',
    description: 'Link untuk mengakses survey',
    example: 'https://survey.example.com/tracer-study'
  },
  {
    key: 'survey.deadline',
    label: 'Batas Waktu Survey',
    description: 'Tanggal deadline survey',
    example: '31 Desember 2024'
  },
  {
    key: 'admin.name',
    label: 'Nama Admin',
    description: 'Nama admin yang mengirim email',
    example: 'Admin Sistem'
  },
  {
    key: 'system.url',
    label: 'URL Sistem',
    description: 'URL utama sistem',
    example: 'https://tracer-study.example.com'
  },
  {
    key: 'current.date',
    label: 'Tanggal Hari Ini',
    description: 'Tanggal saat email dikirim',
    example: '15 Januari 2024'
  },
  {
    key: 'current.year',
    label: 'Tahun Saat Ini',
    description: 'Tahun saat email dikirim',
    example: '2024'
  }
];

// Function untuk replace variables dalam template
export const replaceEmailVariables = (template: string, variables: Record<string, string>): string => {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

// Function untuk extract variables dari template
export const extractTemplateVariables = (template: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
};
