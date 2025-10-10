/** @format */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  File, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Code,
  Monitor,
  Type
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';
import type { 
  EmailTemplate, 
  EmailTemplateFormData
} from '@/types/emailTemplate';
import { 
  EMAIL_VARIABLES,
  replaceEmailVariables,
  extractTemplateVariables
} from '@/types/emailTemplate';

const KelolaTemplateEmail: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<EmailTemplate | null>(null);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [isHtmlPreviewOpen, setIsHtmlPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    code: '',
    templateName: '',
    subject: '',
    bodyText: '',
    bodyHtml: ''
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        code: 'WELCOME_EMAIL',
        templateName: 'Email Selamat Datang',
        subject: 'Selamat Datang di Sistem Tracer Study - {{user.name}}',
        bodyText: 'Halo {{user.name}},\n\nSelamat datang di sistem Tracer Study Universitas Andalas.\n\nSilakan klik link berikut untuk mengakses survey: {{survey.link}}\n\nTerima kasih,\n{{admin.name}}',
        bodyHtml: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;"><div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><h2 style="color: #2563eb; margin-bottom: 20px;">Halo {{user.name}},</h2><p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">Selamat datang di sistem Tracer Study Universitas Andalas.</p><p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">Silakan klik link berikut untuk mengakses survey:</p><div style="text-align: center; margin: 25px 0;"><a href="{{survey.link}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Akses Survey</a></div><p style="color: #6b7280; font-size: 14px; margin-top: 25px;">Terima kasih,<br><strong>{{admin.name}}</strong></p></div></div>',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        code: 'SURVEY_REMINDER',
        templateName: 'Pengingat Survey',
        subject: 'Pengingat: Survey Tracer Study - Batas Waktu {{survey.deadline}}',
        bodyText: 'Halo {{user.name}},\n\nIni adalah pengingat bahwa survey Tracer Study akan berakhir pada {{survey.deadline}}.\n\nSilakan segera lengkapi survey Anda di: {{survey.link}}\n\nTerima kasih,\n{{admin.name}}',
        bodyHtml: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;"><div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><h2 style="color: #dc2626; margin-bottom: 20px;">⏰ Pengingat Survey</h2><p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">Halo {{user.name}},</p><p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">Ini adalah pengingat bahwa survey Tracer Study akan berakhir pada <strong style="color: #dc2626;">{{survey.deadline}}</strong>.</p><p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">Silakan segera lengkapi survey Anda:</p><div style="text-align: center; margin: 25px 0;"><a href="{{survey.link}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Lengkapi Survey</a></div><p style="color: #6b7280; font-size: 14px; margin-top: 25px;">Terima kasih,<br><strong>{{admin.name}}</strong></p></div></div>',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  // Form handlers
  const resetForm = () => {
    setFormData({
      code: '',
      templateName: '',
      subject: '',
      bodyText: '',
      bodyHtml: ''
    });
    setEditingTemplate(null);
  };

  const handleInputChange = (field: keyof EmailTemplateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTemplate = async () => {
    setLoading(true);
    try {
      if (editingTemplate) {
        // Update existing template
        const updatedTemplate: EmailTemplate = {
          ...editingTemplate,
          ...formData,
          updatedAt: new Date().toISOString()
        };
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
      } else {
        // Create new template
        const newTemplate: EmailTemplate = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setTemplates(prev => [...prev, newTemplate]);
      }
      
      setIsSheetOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteTemplate = async () => {
    if (!deleteTemplate) return;
    
    setLoading(true);
    try {
      setTemplates(prev => prev.filter(t => t.id !== deleteTemplate.id));
      setDeleteTemplate(null);
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCopyTemplate = (template: EmailTemplate) => {
    // Store copied data in localStorage for the editor
    const copiedData = {
      code: `${template.code}_COPY`,
      templateName: `${template.templateName} (Copy)`,
      subject: template.subject,
      bodyText: template.bodyText,
      bodyHtml: template.bodyHtml
    };
    localStorage.setItem('copiedTemplate', JSON.stringify(copiedData));
    navigate('/admin/email/templates/new');
  };

  const insertVariable = (variable: string, target: 'text' | 'html' = 'text') => {
    const textareaId = target === 'text' ? 'bodyText' : 'bodyHtml';
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + variable + after;
      
      if (target === 'text') {
        setFormData(prev => ({ ...prev, bodyText: newText }));
      } else {
        setFormData(prev => ({ ...prev, bodyHtml: newText }));
      }
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const getTemplateVariables = (template: string): string[] => {
    return extractTemplateVariables(template);
  };

  const generateHtmlTemplate = (template: string): string => {
    const sampleData = {
      'user.name': 'John Doe',
      'user.email': 'john.doe@example.com',
      'survey.link': 'https://survey.example.com/tracer-study',
      'survey.deadline': '31 Desember 2024',
      'admin.name': 'Admin Sistem',
      'system.url': 'https://tracer-study.example.com',
      'current.date': '15 Januari 2024',
      'current.year': '2024'
    };

    return replaceEmailVariables(template, sampleData);
  };

  const insertHtmlTag = (tag: string) => {
    const textarea = document.getElementById('bodyHtml') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
      
      let newText = '';
      if (tag === 'br') {
        newText = text.substring(0, start) + '<br>' + text.substring(end);
      } else if (tag === 'p') {
        newText = text.substring(0, start) + `<p>${selectedText || 'Paragraf baru'}</p>` + text.substring(end);
      } else if (tag === 'h2') {
        newText = text.substring(0, start) + `<h2>${selectedText || 'Judul'}</h2>` + text.substring(end);
      } else if (tag === 'strong') {
        newText = text.substring(0, start) + `<strong>${selectedText || 'Teks tebal'}</strong>` + text.substring(end);
      } else if (tag === 'a') {
        newText = text.substring(0, start) + `<a href="{{survey.link}}">${selectedText || 'Link'}</a>` + text.substring(end);
      }
      
      setFormData(prev => ({ ...prev, bodyHtml: newText }));
      
      // Set cursor position
      setTimeout(() => {
        textarea.focus();
        if (tag === 'br') {
          textarea.setSelectionRange(start + 4, start + 4);
        } else {
          textarea.setSelectionRange(start + newText.length - text.substring(end).length - (tag === 'a' ? 4 : 0), start + newText.length - text.substring(end).length - (tag === 'a' ? 4 : 0));
        }
      }, 0);
    }
  };

  return (
    <AdminLayout>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='mb-6 relative'>
          <div className='flex items-center justify-between'>
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate('/admin/dashboard')}
                    className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                  >
                    <Mail className='h-4 w-4' />
                    <span>Manajemen Email</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola Template Email</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Tambah Template */}
            <Button onClick={() => navigate('/admin/email/templates/new')}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Template
            </Button>
          </div>
        </div>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <File className='h-5 w-5' />
              <span>Daftar Template Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Template</TableHead>
                  <TableHead>Nama Template</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Badge variant="outline">{template.code}</Badge>
                    </TableCell>
                    <TableCell className='font-medium'>{template.templateName}</TableCell>
                    <TableCell className='max-w-xs truncate'>{template.subject}</TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-1'>
                        {getTemplateVariables(template.subject + ' ' + template.bodyText).slice(0, 3).map((variable) => (
                          <Badge key={variable} variant="secondary" className='text-xs'>
                            {variable}
                          </Badge>
                        ))}
                        {getTemplateVariables(template.subject + ' ' + template.bodyText).length > 3 && (
                          <Badge variant="secondary" className='text-xs'>
                            +{getTemplateVariables(template.subject + ' ' + template.bodyText).length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(template.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end space-x-2'>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/email/templates/${template.id}/edit`)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyTemplate(template)}
                        >
                          <Copy className='h-4 w-4' />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteTemplate(template)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Template Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className='w-[95vw] max-w-[1400px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>
                {editingTemplate ? 'Edit Template Email' : 'Tambah Template Email'}
              </SheetTitle>
              <SheetDescription>
                {editingTemplate 
                  ? 'Ubah template email yang sudah ada' 
                  : 'Buat template email baru dengan variable dinamis'
                }
              </SheetDescription>
            </SheetHeader>

            {/* Quick Start Guide */}
            {!editingTemplate && (
              <Card className='mt-4 bg-blue-50 border-blue-200'>
                <CardHeader>
                  <CardTitle className='text-lg text-blue-800'>🚀 Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-blue-700'>1. Informasi Template</h4>
                      <p className='text-blue-600'>Isi kode, nama, dan subject email di kolom kiri</p>
                    </div>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-blue-700'>2. HTML Template</h4>
                      <p className='text-blue-600'>Klik "Starter Template" untuk template siap pakai, atau buat sendiri</p>
                    </div>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-blue-700'>3. Variables</h4>
                      <p className='text-blue-600'>Klik "Variables" untuk insert variable seperti {`{{user.name}}`}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6'>
              {/* Left Column - Form */}
              <div className='space-y-6'>
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Informasi Template</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='code'>Kode Template *</Label>
                      <Input
                        id='code'
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        placeholder='WELCOME_EMAIL'
                        className='text-sm'
                      />
                      <p className='text-xs text-muted-foreground'>Kode unik untuk template ini</p>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='templateName'>Nama Template *</Label>
                      <Input
                        id='templateName'
                        value={formData.templateName}
                        onChange={(e) => handleInputChange('templateName', e.target.value)}
                        placeholder='Email Selamat Datang'
                        className='text-sm'
                      />
                      <p className='text-xs text-muted-foreground'>Nama yang mudah diingat untuk template</p>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='subject'>Subject Email *</Label>
                      <Input
                        id='subject'
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder='Selamat Datang - {{user.name}}'
                        className='text-sm'
                      />
                      <p className='text-xs text-muted-foreground'>Judul email yang akan dikirim</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Body Text */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg'>Body Text</CardTitle>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setIsVariablesOpen(!isVariablesOpen)}
                      >
                        <Code className='mr-2 h-4 w-4' />
                        Variables
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id='bodyText'
                      value={formData.bodyText}
                      onChange={(e) => handleInputChange('bodyText', e.target.value)}
                      placeholder='Halo {{user.name}},

Selamat datang di sistem Tracer Study Universitas Andalas.

Silakan klik link berikut untuk mengakses survey: {{survey.link}}

Terima kasih,
{{admin.name}}'
                      rows={12}
                      className='text-sm'
                    />
                    <p className='text-xs text-muted-foreground mt-2'>Versi plain text dari email</p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className='flex justify-end space-x-2'>
                  <Button variant='outline' onClick={() => setIsSheetOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSaveTemplate} disabled={loading}>
                    {loading ? 'Menyimpan...' : (editingTemplate ? 'Update' : 'Simpan')}
                  </Button>
                </div>
              </div>

              {/* Right Column - HTML Editor */}
              <div className='space-y-6'>
                {/* Body HTML */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg'>Body HTML</CardTitle>
                      <div className='flex items-center space-x-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => setIsHtmlPreviewOpen(!isHtmlPreviewOpen)}
                        >
                          <Monitor className='mr-2 h-4 w-4' />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* HTML Toolbar */}
                    <div className='flex flex-wrap gap-2 p-3 border rounded bg-muted/30'>
                      <span className='text-sm font-medium text-muted-foreground mr-2'>HTML Tools:</span>
                      <Button
                        type='button'
                        variant='default'
                        size='sm'
                        onClick={() => {
                          const starterTemplate = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;"><div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><h2 style="color: #2563eb; margin-bottom: 20px;">Halo {{user.name}},</h2><p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">Selamat datang di sistem Tracer Study Universitas Andalas.</p><p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">Silakan klik link berikut untuk mengakses survey:</p><div style="text-align: center; margin: 25px 0;"><a href="{{survey.link}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Akses Survey</a></div><p style="color: #6b7280; font-size: 14px; margin-top: 25px;">Terima kasih,<br><strong>{{admin.name}}</strong></p></div></div>';
                          setFormData(prev => ({ ...prev, bodyHtml: starterTemplate }));
                        }}
                      >
                        <Type className='mr-1 h-3 w-3' />
                        Starter Template
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => insertHtmlTag('h2')}
                      >
                        H2
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => insertHtmlTag('p')}
                      >
                        P
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => insertHtmlTag('strong')}
                      >
                        Bold
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => insertHtmlTag('br')}
                      >
                        BR
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => insertHtmlTag('a')}
                      >
                        Link
                      </Button>
                    </div>
                    
                    <Textarea
                      id='bodyHtml'
                      value={formData.bodyHtml}
                      onChange={(e) => handleInputChange('bodyHtml', e.target.value)}
                      placeholder='<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #2563eb; margin-bottom: 20px;">Halo {{user.name}},</h2>
    <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">Selamat datang di sistem Tracer Study Universitas Andalas.</p>
    <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">Silakan klik link berikut untuk mengakses survey:</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="{{survey.link}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Akses Survey</a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">Terima kasih,<br><strong>{{admin.name}}</strong></p>
  </div>
</div>'
                      rows={16}
                      className='text-sm font-mono'
                    />
                    <p className='text-xs text-muted-foreground'>Versi HTML dengan styling untuk email</p>
                  </CardContent>
                </Card>

                {/* HTML Preview */}
                {isHtmlPreviewOpen && formData.bodyHtml && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>Preview HTML</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='border rounded p-4 bg-white max-h-96 overflow-y-auto'>
                        <div 
                          className='prose prose-sm max-w-none'
                          dangerouslySetInnerHTML={{
                            __html: generateHtmlTemplate(formData.bodyHtml)
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Variables Panel - Full Width */}
            {isVariablesOpen && (
              <Card className='mt-6'>
                <CardHeader>
                  <CardTitle className='text-lg'>Variable yang Tersedia</CardTitle>
                  <p className='text-sm text-muted-foreground'>Klik "Text" untuk insert ke Body Text, atau "HTML" untuk insert ke Body HTML</p>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto'>
                    {EMAIL_VARIABLES.map((variable) => (
                      <div key={variable.key} className='flex flex-col p-3 border rounded bg-muted/30'>
                        <div className='font-mono text-sm font-semibold mb-1'>{variable.key}</div>
                        <div className='text-xs text-muted-foreground mb-2'>{variable.description}</div>
                        <div className='text-xs text-blue-600 mb-2'>Contoh: {variable.example}</div>
                        <div className='flex space-x-1'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => insertVariable(variable.key, 'text')}
                            className='text-xs'
                          >
                            Text
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => insertVariable(variable.key, 'html')}
                            className='text-xs'
                          >
                            HTML
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </SheetContent>
        </Sheet>


        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTemplate} onOpenChange={() => setDeleteTemplate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Template Email</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Apakah Anda yakin ingin menghapus template <strong>{deleteTemplate?.templateName}</strong>?
                  <br />
                  <br />
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus template secara permanen.
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTemplate} disabled={loading}>
                {loading ? 'Menghapus...' : 'Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default KelolaTemplateEmail;
