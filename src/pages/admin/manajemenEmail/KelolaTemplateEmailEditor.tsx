/** @format */

import React, {useState, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {AdminLayout} from '@/components/layout/admin';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {
  ArrowLeft,
  Save,
  Type,
  Image,
  Layout,
  Wand2,
  Square,
  Circle,
  Triangle,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'sonner';
import type {EmailTemplateFormData} from '@/types/emailTemplate';
import {replaceEmailVariables} from '@/types/emailTemplate';
import {EMAIL_VARIABLES} from '@/types/emailTemplate';
import {
  useEmailTemplate,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
} from '@/api/email.api';

const KelolaTemplateEmailEditor: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams<{id?: string}>();
  const isEdit = Boolean(id && id !== 'new');

  // API hooks
  const {data: existingTemplate, isLoading: isLoadingTemplate} =
    useEmailTemplate(isEdit && id ? id : '');
  const createTemplateMutation = useCreateEmailTemplate();
  const updateTemplateMutation = useUpdateEmailTemplate();

  // State management
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    code: '',
    templateName: '',
    subject: '',
    bodyText: '',
    bodyHtml: '',
  });
  const [emailBlocks, setEmailBlocks] = useState<
    Array<{
      id: string;
      type: string;
      content: string;
      style?: Record<string, string>;
      link?: string;
      alt?: string;
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Load data - from API or localStorage
  useEffect(() => {
    if (isEdit && existingTemplate) {
      setFormData({
        code: existingTemplate.code,
        templateName: existingTemplate.templateName,
        subject: existingTemplate.subject,
        bodyText: existingTemplate.bodyText,
        bodyHtml: existingTemplate.bodyHtml,
      });
    } else if (!isEdit) {
      // Check for copied template data
      const copiedData = localStorage.getItem('copiedTemplate');
      if (copiedData) {
        try {
          const parsed = JSON.parse(copiedData);
          setFormData(parsed);
          localStorage.removeItem('copiedTemplate'); // Clear after use
        } catch (error) {
          console.error('Error parsing copied template data:', error);
        }
      }
    }
  }, [isEdit, existingTemplate]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSuggestions) {
        const target = event.target as HTMLElement;
        if (
          !target.closest('.suggestion-dropdown') &&
          !target.closest('[data-block-id]')
        ) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Form handlers
  const handleInputChange = (
    field: keyof EmailTemplateFormData,
    value: string
  ) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const generateBodyTextFromBlocks = () => {
    const textParts = emailBlocks
      .map((block) => {
        switch (block.type) {
          case 'header':
            return block.content;
          case 'paragraph':
            return block.content;
          case 'button':
            return `${block.content}: ${block.link || ''}`;
          case 'footer':
            return block.content;
          default:
            return '';
        }
      })
      .filter((text) => text.trim() !== '')
      .join('\n\n');

    return textParts;
  };

  const handleSaveTemplate = async () => {
    try {
      // Generate HTML and text from visual blocks
      const finalHtml = generateHtmlFromBlocks();
      const finalBodyText = generateBodyTextFromBlocks();

      // Prepare data for API
      const templateData: EmailTemplateFormData = {
        ...formData,
        bodyHtml: finalHtml || formData.bodyHtml,
        bodyText: finalBodyText || formData.bodyText,
      };

      if (isEdit && id) {
        await updateTemplateMutation.mutateAsync({
          id,
          data: templateData,
        });
        toast.success('Template berhasil diperbarui');
      } else {
        await createTemplateMutation.mutateAsync(templateData);
        toast.success('Template berhasil dibuat');
      }

      // Navigate back to template list
      navigate('/admin/email/templates');
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: Array<{field: string; message: string}> | string;
          };
        };
      };

      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (Array.isArray(errorMessage)) {
          // Display all validation errors
          errorMessage.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        } else {
          toast.error('Gagal menyimpan template');
        }
      } else {
        toast.error('Gagal menyimpan template');
      }
    }
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
      'current.year': '2024',
    };

    return replaceEmailVariables(template, sampleData);
  };

  // Visual Editor Functions
  const addEmailBlock = (type: string) => {
    const defaultContent = getDefaultBlockContent(type);
    const newBlock = {
      id: Date.now().toString(),
      type,
      style: {},
      ...defaultContent,
    };
    setEmailBlocks((prev) => [...prev, newBlock]);
  };

  const getDefaultBlockContent = (type: string) => {
    switch (type) {
      case 'header':
        return {content: 'Selamat Datang di Sistem Tracer Study'};
      case 'paragraph':
        return {
          content:
            'Halo {{user.name}}, selamat datang di sistem Tracer Study Universitas Andalas. Kami senang Anda bergabung dengan kami untuk melacak perkembangan karir alumni.',
        };
      case 'button':
        return {content: 'Mulai Survey', link: '{{survey.link}}'};
      case 'image':
        return {
          content:
            'https://via.placeholder.com/400x200/14b8a6/ffffff?text=UNIVERSITAS+ANDALAS',
          alt: 'Logo Universitas Andalas',
        };
      case 'divider':
        return {content: ''};
      case 'footer':
        return {
          content:
            'Terima kasih atas partisipasi Anda.\n\nTim Tracer Study\nUniversitas Andalas',
        };
      default:
        return {content: ''};
    }
  };

  const updateEmailBlock = (id: string, updates: Record<string, string>) => {
    setEmailBlocks((prev) =>
      prev.map((block) => (block.id === id ? {...block, ...updates} : block))
    );
  };

  const handleBlockInput = (
    blockId: string,
    field: string,
    value: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const cursorPos =
      (event.target as HTMLInputElement | HTMLTextAreaElement).selectionStart ||
      0;
    setCursorPosition(cursorPos);
    setActiveBlockId(blockId);

    // Check if user typed "{{"
    if (value.includes('{{') && cursorPos > 0) {
      const beforeCursor = value.substring(0, cursorPos);
      const lastOpenBrace = beforeCursor.lastIndexOf('{{');

      if (lastOpenBrace !== -1) {
        const afterOpenBrace = beforeCursor.substring(lastOpenBrace + 2);
        const hasClosingBrace = afterOpenBrace.includes('}}');

        if (!hasClosingBrace) {
          // Show suggestions
          const rect = (
            event.target as HTMLInputElement | HTMLTextAreaElement
          ).getBoundingClientRect();
          setSuggestionPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      }
    } else {
      setShowSuggestions(false);
    }

    updateEmailBlock(blockId, {[field]: value});
  };

  const handleBlockKeyUp = (
    blockId: string,
    value: string,
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const cursorPos =
      (event.target as HTMLInputElement | HTMLTextAreaElement).selectionStart ||
      0;
    setCursorPosition(cursorPos);
    setActiveBlockId(blockId);

    // Check if user typed "{{"
    if (value.includes('{{') && cursorPos > 0) {
      const beforeCursor = value.substring(0, cursorPos);
      const lastOpenBrace = beforeCursor.lastIndexOf('{{');

      if (lastOpenBrace !== -1) {
        const afterOpenBrace = beforeCursor.substring(lastOpenBrace + 2);
        const hasClosingBrace = afterOpenBrace.includes('}}');

        if (!hasClosingBrace) {
          // Show suggestions
          const rect = (
            event.target as HTMLInputElement | HTMLTextAreaElement
          ).getBoundingClientRect();
          setSuggestionPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const insertVariable = (variable: string) => {
    if (!activeBlockId) return;

    // Handle subject field
    if (activeBlockId === 'subject') {
      const currentValue = formData.subject;

      // Find the last "{{" before cursor
      const beforeCursor = currentValue.substring(0, cursorPosition);
      const lastOpenBrace = beforeCursor.lastIndexOf('{{');

      if (lastOpenBrace !== -1) {
        // Create new value by replacing "{{" with "{{variable}}"
        const beforeBrace = currentValue.substring(0, lastOpenBrace);
        const afterCursor = currentValue.substring(cursorPosition);
        const newValue = beforeBrace + '{{' + variable + '}}' + afterCursor;

        handleInputChange('subject', newValue);

        setTimeout(() => {
          const newCursorPos = lastOpenBrace + variable.length + 4; // 4 for "{{" and "}}"
          const input = document.querySelector(
            `[data-block-id="subject"]`
          ) as HTMLInputElement;
          if (input) {
            input.focus();
            input.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    } else {
      // Handle email blocks
      const block = emailBlocks.find((b) => b.id === activeBlockId);
      if (!block) return;

      const field = 'content'; // Default to content field
      const currentValue = block[field] || '';

      // Find the last "{{" before cursor
      const beforeCursor = currentValue.substring(0, cursorPosition);
      const lastOpenBrace = beforeCursor.lastIndexOf('{{');

      if (lastOpenBrace !== -1) {
        // Create new value by replacing "{{" with "{{variable}}"
        const beforeBrace = currentValue.substring(0, lastOpenBrace);
        const afterCursor = currentValue.substring(cursorPosition);
        const newValue = beforeBrace + '{{' + variable + '}}' + afterCursor;

        updateEmailBlock(activeBlockId, {[field]: newValue});

        // Update cursor position after the inserted variable
        setTimeout(() => {
          const newCursorPos = lastOpenBrace + variable.length + 4; // 4 for "{{" and "}}"
          const input = document.querySelector(
            `[data-block-id="${activeBlockId}"]`
          ) as HTMLInputElement | HTMLTextAreaElement;
          if (input) {
            input.focus();
            input.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    }

    setShowSuggestions(false);
  };

  const deleteEmailBlock = (id: string) => {
    setEmailBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const moveEmailBlock = (id: string, direction: 'up' | 'down') => {
    setEmailBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index === -1) return prev;

      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index - 1], newBlocks[index]] = [
          newBlocks[index],
          newBlocks[index - 1],
        ];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [
          newBlocks[index + 1],
          newBlocks[index],
        ];
      }

      return newBlocks;
    });
  };

  const generateHtmlFromBlocks = () => {
    const htmlBlocks = emailBlocks
      .map((block) => {
        switch (block.type) {
          case 'header':
            return `<div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #0d9488; font-size: 32px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${block.content}</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #14b8a6 0%, #10b981 100%); margin: 0 auto; border-radius: 2px;"></div>
          </div>`;
          case 'paragraph':
            return `<p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: justify;">${block.content}</p>`;
          case 'button':
            return `<div style="text-align: center; margin: 40px 0;">
            <a href="${
              block.link || '#'
            }" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #10b981 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3); transition: all 0.3s ease; border: none; cursor: pointer;">${
              block.content
            }</a>
          </div>`;
          case 'image':
            return `<div style="text-align: center; margin: 32px 0;">
            <img src="${block.content}" alt="${
              block.alt || ''
            }" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); border: 2px solid #f0fdfa;" />
          </div>`;
          case 'divider':
            return `<div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; width: 80px; height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);"></div>
          </div>`;
          case 'footer':
            return `<div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${block.content.replace(
              /\n/g,
              '<br>'
            )}</p>
            <div style="text-align: center; margin-top: 20px;">
              <div style="display: inline-block; padding: 8px 16px; background-color: #f0fdfa; border-radius: 8px; border: 1px solid #ccfbf1;">
                <span style="color: #0d9488; font-size: 12px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">UNIVERSITAS ANDALAS</span>
              </div>
            </div>
          </div>`;
          default:
            return '';
        }
      })
      .join('');

    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%);">
      <!-- Header dengan Logo Universitas -->
      <div style="background: linear-gradient(135deg, #14b8a6 0%, #10b981 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="display: inline-block; padding: 12px 20px; background-color: rgba(255,255,255,0.1); border-radius: 8px; backdrop-filter: blur(10px);">
          <span style="color: #ffffff; font-size: 18px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">UNIVERSITAS ANDALAS</span>
        </div>
        <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0; font-weight: 500;">Sistem Tracer Study</p>
      </div>
      
      <!-- Content Area -->
      <div style="padding: 40px 32px; background-color: #ffffff; border-radius: 0 0 12px 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);">
        ${htmlBlocks}
      </div>
      
      <!-- Footer dengan Info Universitas -->
      <div style="background-color: #f0fdfa; padding: 20px 32px; border-radius: 0 0 12px 12px; border-top: 1px solid #ccfbf1;">
        <div style="text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            Jl. Prof. Dr. Hamka, Air Tawar Padang, Sumatera Barat 25163<br>
            Telp: (0751) 70537 | Email: info@unand.ac.id<br>
            Website: <a href="https://www.unand.ac.id" style="color: #0d9488; text-decoration: none;">www.unand.ac.id</a>
          </p>
        </div>
      </div>
    </div>`;
  };

  return (
    <AdminLayout>
      <div className='h-screen flex flex-col'>
        {/* Header */}
        <div className='p-6 border-b bg-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate('/admin/email/templates')}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Kembali
              </Button>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => navigate('/admin/dashboard')}
                      className='cursor-pointer hover:text-primary'
                    >
                      Manajemen Email
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => navigate('/admin/email/templates')}
                      className='cursor-pointer hover:text-primary'
                    >
                      Template Email
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? 'Edit Template' : 'Tambah Template'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                onClick={() => navigate('/admin/email/templates')}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveTemplate}
                disabled={
                  createTemplateMutation.isPending ||
                  updateTemplateMutation.isPending ||
                  isLoadingTemplate
                }
              >
                <Save className='mr-2 h-4 w-4' />
                {createTemplateMutation.isPending ||
                updateTemplateMutation.isPending
                  ? 'Menyimpan...'
                  : 'Simpan Template'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - 3 Panel Layout */}
        <div className='flex-1 flex overflow-hidden'>
          {/* Left Panel - Visual Editor Tools */}
          <div className='w-80 border-r bg-gray-50 overflow-y-auto'>
            <div className='p-4'>
              {/* Visual Editor */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-sm text-gray-700'>
                  Blok Email
                </h3>

                {/* Email Blocks */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-gray-600'>
                    Tambahkan Blok
                  </h4>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => addEmailBlock('header')}
                    >
                      <Type className='mr-1 h-3 w-3' />
                      Header
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => addEmailBlock('paragraph')}
                    >
                      <Square className='mr-1 h-3 w-3' />
                      Paragraf
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => addEmailBlock('button')}
                    >
                      <Circle className='mr-1 h-3 w-3' />
                      Tombol
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => addEmailBlock('image')}
                    >
                      <Image className='mr-1 h-3 w-3' />
                      Gambar
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => addEmailBlock('divider')}
                    >
                      <Triangle className='mr-1 h-3 w-3' />
                      Pemisah
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => addEmailBlock('footer')}
                    >
                      <Layout className='mr-1 h-3 w-3' />
                      Footer
                    </Button>
                  </div>
                </div>

                {/* Quick Templates */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-gray-600'>
                    Template Cepat
                  </h4>
                  <Button
                    variant='default'
                    size='sm'
                    onClick={() => {
                      const blocks = [
                        {
                          id: '1',
                          type: 'header',
                          content: 'Selamat Datang di Sistem Tracer Study',
                        },
                        {
                          id: '2',
                          type: 'paragraph',
                          content:
                            'Halo {{user.name}}, selamat datang di sistem Tracer Study Universitas Andalas. Kami senang Anda bergabung dengan kami untuk melacak perkembangan karir alumni.',
                        },
                        {
                          id: '3',
                          type: 'paragraph',
                          content:
                            'Silakan lengkapi survey berikut untuk membantu kami meningkatkan kualitas pendidikan dan layanan kepada mahasiswa.',
                        },
                        {
                          id: '4',
                          type: 'button',
                          content: 'Mulai Survey',
                          link: '{{survey.link}}',
                        },
                        {
                          id: '5',
                          type: 'footer',
                          content:
                            'Terima kasih atas partisipasi Anda.\n\nTim Tracer Study\nUniversitas Andalas',
                        },
                      ];
                      setEmailBlocks(blocks);
                      // Set form data
                      setFormData((prev) => ({
                        ...prev,
                        code: prev.code || 'WELCOME_EMAIL',
                        templateName:
                          prev.templateName || 'Email Selamat Datang',
                        subject:
                          prev.subject ||
                          'Selamat Datang di Sistem Tracer Study - {{user.name}}',
                        bodyText:
                          'Halo {{user.name}},\n\nSelamat datang di sistem Tracer Study Universitas Andalas. Kami senang Anda bergabung dengan kami untuk melacak perkembangan karir alumni.\n\nSilakan lengkapi survey berikut untuk membantu kami meningkatkan kualitas pendidikan dan layanan kepada mahasiswa.\n\nMulai Survey: {{survey.link}}\n\nTerima kasih atas partisipasi Anda.\n\nTim Tracer Study\nUniversitas Andalas',
                      }));
                    }}
                    className='w-full'
                  >
                    <Wand2 className='mr-2 h-4 w-4' />
                    Template Selamat Datang
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const blocks = [
                        {
                          id: '1',
                          type: 'header',
                          content: '⏰ Pengingat Survey Tracer Study',
                        },
                        {
                          id: '2',
                          type: 'paragraph',
                          content: 'Halo {{user.name}},',
                        },
                        {
                          id: '3',
                          type: 'paragraph',
                          content:
                            'Kami ingin mengingatkan bahwa survey Tracer Study Anda belum lengkap. Survey ini sangat penting untuk membantu kami meningkatkan kualitas pendidikan di Universitas Andalas.',
                        },
                        {
                          id: '4',
                          type: 'paragraph',
                          content:
                            'Survey akan berakhir pada {{survey.deadline}}. Silakan lengkapi survey Anda segera.',
                        },
                        {
                          id: '5',
                          type: 'button',
                          content: 'Lengkapi Survey Sekarang',
                          link: '{{survey.link}}',
                        },
                        {
                          id: '6',
                          type: 'footer',
                          content:
                            'Terima kasih atas perhatiannya.\n\nTim Tracer Study\nUniversitas Andalas',
                        },
                      ];
                      setEmailBlocks(blocks);
                      // Set form data
                      setFormData((prev) => ({
                        ...prev,
                        code: prev.code || 'SURVEY_REMINDER',
                        templateName: prev.templateName || 'Pengingat Survey',
                        subject:
                          prev.subject ||
                          'Pengingat: Survey Tracer Study - Batas Waktu {{survey.deadline}}',
                        bodyText:
                          'Halo {{user.name}},\n\nKami ingin mengingatkan bahwa survey Tracer Study Anda belum lengkap. Survey ini sangat penting untuk membantu kami meningkatkan kualitas pendidikan di Universitas Andalas.\n\nSurvey akan berakhir pada {{survey.deadline}}. Silakan lengkapi survey Anda segera.\n\nLengkapi Survey Sekarang: {{survey.link}}\n\nTerima kasih atas perhatiannya.\n\nTim Tracer Study\nUniversitas Andalas',
                      }));
                    }}
                    className='w-full'
                  >
                    <Wand2 className='mr-2 h-4 w-4' />
                    Template Pengingat
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const blocks = [
                        {
                          id: '1',
                          type: 'header',
                          content: '🎓 Survey Alumni Universitas Andalas',
                        },
                        {
                          id: '2',
                          type: 'paragraph',
                          content:
                            'Halo {{user.name}}, sebagai alumni Universitas Andalas, kami membutuhkan feedback Anda untuk meningkatkan kualitas pendidikan dan layanan kepada mahasiswa.',
                        },
                        {
                          id: '3',
                          type: 'paragraph',
                          content:
                            'Survey ini akan membantu kami memahami perkembangan karir alumni dan mengevaluasi program studi yang telah Anda ikuti.',
                        },
                        {
                          id: '4',
                          type: 'image',
                          content:
                            'https://via.placeholder.com/400x200/14b8a6/ffffff?text=ALUMNI+UNAND',
                          alt: 'Alumni Universitas Andalas',
                        },
                        {
                          id: '5',
                          type: 'button',
                          content: 'Isi Survey Alumni',
                          link: '{{survey.link}}',
                        },
                        {
                          id: '6',
                          type: 'footer',
                          content:
                            'Kontribusi Anda sangat berarti bagi kemajuan Universitas Andalas.\n\nRektorat Universitas Andalas',
                        },
                      ];
                      setEmailBlocks(blocks);
                      // Set form data
                      setFormData((prev) => ({
                        ...prev,
                        code: prev.code || 'ALUMNI_SURVEY',
                        templateName: prev.templateName || 'Survey Alumni',
                        subject:
                          prev.subject ||
                          'Survey Alumni Universitas Andalas - {{user.name}}',
                        bodyText:
                          'Halo {{user.name}}, sebagai alumni Universitas Andalas, kami membutuhkan feedback Anda untuk meningkatkan kualitas pendidikan dan layanan kepada mahasiswa.\n\nSurvey ini akan membantu kami memahami perkembangan karir alumni dan mengevaluasi program studi yang telah Anda ikuti.\n\nIsi Survey Alumni: {{survey.link}}\n\nKontribusi Anda sangat berarti bagi kemajuan Universitas Andalas.\n\nRektorat Universitas Andalas',
                      }));
                    }}
                    className='w-full'
                  >
                    <Wand2 className='mr-2 h-4 w-4' />
                    Template Alumni
                  </Button>
                </div>

                {/* Block List */}
                {emailBlocks.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-gray-600'>
                      Blok yang Ditambahkan
                    </h4>
                    <div className='space-y-1'>
                      {emailBlocks.map((block, index) => (
                        <div
                          key={block.id}
                          className='flex items-center justify-between p-2 bg-white border rounded text-xs'
                        >
                          <span className='capitalize'>{block.type}</span>
                          <div className='flex space-x-1'>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => moveEmailBlock(block.id, 'up')}
                              disabled={index === 0}
                              className='h-6 w-6 p-0'
                            >
                              ↑
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => moveEmailBlock(block.id, 'down')}
                              disabled={index === emailBlocks.length - 1}
                              className='h-6 w-6 p-0'
                            >
                              ↓
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => deleteEmailBlock(block.id)}
                              className='h-6 w-6 p-0 text-red-600'
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Panel - Form Input */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            <div className='p-6 space-y-6 overflow-y-auto'>
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Informasi Template</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='code'>Kode Template *</Label>
                      <Input
                        id='code'
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange('code', e.target.value)
                        }
                        placeholder='WELCOME_EMAIL'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='templateName'>Nama Template *</Label>
                      <Input
                        id='templateName'
                        value={formData.templateName}
                        onChange={(e) =>
                          handleInputChange('templateName', e.target.value)
                        }
                        placeholder='Email Selamat Datang'
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject Email *</Label>
                    <Input
                      id='subject'
                      data-block-id='subject'
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange('subject', e.target.value)
                      }
                      onKeyUp={(e) =>
                        handleBlockKeyUp('subject', e.currentTarget.value, e)
                      }
                      placeholder='Selamat Datang - {{user.name}}'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Visual Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Editor Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {/* Visual Editor */}
                    <div className='border rounded-lg p-4 bg-gray-50 min-h-96'>
                      {emailBlocks.length === 0 ? (
                        <div className='text-center text-gray-500 py-8'>
                          <Wand2 className='h-12 w-12 mx-auto mb-4 text-gray-400' />
                          <p>
                            Belum ada blok email. Klik tombol di panel kiri
                            untuk menambahkan blok.
                          </p>
                        </div>
                      ) : (
                        <div className='space-y-4'>
                          {emailBlocks.map((block) => (
                            <div
                              key={block.id}
                              className='bg-white border rounded-lg p-4 hover:shadow-md transition-shadow'
                            >
                              <div className='flex items-center justify-between mb-2'>
                                <span className='text-sm font-medium text-gray-600 capitalize'>
                                  {block.type}
                                </span>
                              </div>

                              {/* Block Content Editor */}
                              {block.type === 'header' && (
                                <Input
                                  data-block-id={block.id}
                                  value={block.content}
                                  onChange={(e) =>
                                    handleBlockInput(
                                      block.id,
                                      'content',
                                      e.target.value,
                                      e
                                    )
                                  }
                                  onKeyUp={(e) =>
                                    handleBlockKeyUp(
                                      block.id,
                                      e.currentTarget.value,
                                      e
                                    )
                                  }
                                  placeholder='Masukkan header...'
                                  className='font-semibold text-lg'
                                />
                              )}

                              {block.type === 'paragraph' && (
                                <Textarea
                                  data-block-id={block.id}
                                  value={block.content}
                                  onChange={(e) =>
                                    handleBlockInput(
                                      block.id,
                                      'content',
                                      e.target.value,
                                      e
                                    )
                                  }
                                  onKeyUp={(e) =>
                                    handleBlockKeyUp(
                                      block.id,
                                      e.currentTarget.value,
                                      e
                                    )
                                  }
                                  placeholder='Masukkan paragraf...'
                                  rows={3}
                                />
                              )}

                              {block.type === 'button' && (
                                <div className='space-y-2'>
                                  <Input
                                    data-block-id={block.id}
                                    value={block.content}
                                    onChange={(e) =>
                                      handleBlockInput(
                                        block.id,
                                        'content',
                                        e.target.value,
                                        e
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleBlockKeyUp(
                                        block.id,
                                        e.currentTarget.value,
                                        e
                                      )
                                    }
                                    placeholder='Teks tombol...'
                                  />
                                  <Input
                                    data-block-id={`${block.id}-link`}
                                    value={block.link || ''}
                                    onChange={(e) =>
                                      handleBlockInput(
                                        block.id,
                                        'link',
                                        e.target.value,
                                        e
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleBlockKeyUp(
                                        block.id,
                                        e.currentTarget.value,
                                        e
                                      )
                                    }
                                    placeholder='Link tujuan...'
                                  />
                                </div>
                              )}

                              {block.type === 'image' && (
                                <div className='space-y-2'>
                                  <Input
                                    data-block-id={block.id}
                                    value={block.content}
                                    onChange={(e) =>
                                      handleBlockInput(
                                        block.id,
                                        'content',
                                        e.target.value,
                                        e
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleBlockKeyUp(
                                        block.id,
                                        e.currentTarget.value,
                                        e
                                      )
                                    }
                                    placeholder='URL gambar...'
                                  />
                                  <Input
                                    data-block-id={`${block.id}-alt`}
                                    value={block.alt || ''}
                                    onChange={(e) =>
                                      handleBlockInput(
                                        block.id,
                                        'alt',
                                        e.target.value,
                                        e
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleBlockKeyUp(
                                        block.id,
                                        e.currentTarget.value,
                                        e
                                      )
                                    }
                                    placeholder='Alt text...'
                                  />
                                </div>
                              )}

                              {block.type === 'footer' && (
                                <Textarea
                                  data-block-id={block.id}
                                  value={block.content}
                                  onChange={(e) =>
                                    handleBlockInput(
                                      block.id,
                                      'content',
                                      e.target.value,
                                      e
                                    )
                                  }
                                  onKeyUp={(e) =>
                                    handleBlockKeyUp(
                                      block.id,
                                      e.currentTarget.value,
                                      e
                                    )
                                  }
                                  placeholder='Masukkan footer...'
                                  rows={2}
                                />
                              )}

                              {block.type === 'divider' && (
                                <div className='border-t border-gray-300 py-2'>
                                  <span className='text-sm text-gray-500'>
                                    Pemisah
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='w-96 border-l bg-gray-50 overflow-y-auto'>
            <div className='p-4'>
              {/* Subject Preview */}
              <div className='mb-4'>
                <h4 className='text-xs font-medium text-gray-600 mb-2'>
                  Subject
                </h4>
                <div className='p-3 bg-white border rounded text-sm'>
                  {formData.subject
                    ? replaceEmailVariables(formData.subject, {
                        'user.name': 'John Doe',
                        'survey.deadline': '31 Desember 2024',
                        'admin.name': 'Admin Sistem',
                      })
                    : 'Belum ada subject'}
                </div>
              </div>

              {/* HTML Preview */}
              <div>
                <div className='border rounded bg-white p-4 max-h-96 overflow-y-auto'>
                  {emailBlocks.length > 0 ? (
                    <div
                      className='prose prose-sm max-w-none'
                      dangerouslySetInnerHTML={{
                        __html: generateHtmlTemplate(generateHtmlFromBlocks()),
                      }}
                    />
                  ) : (
                    <div className='text-sm text-gray-500 italic'>
                      Belum ada content
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variable Suggestions Dropdown */}
      {showSuggestions &&
        createPortal(
          <div
            ref={suggestionRef}
            className='suggestion-dropdown fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'
            style={{
              top: suggestionPosition.top,
              left: suggestionPosition.left,
              minWidth: '300px',
            }}
          >
            <div className='p-2'>
              <div className='text-xs font-medium text-gray-500 mb-2 px-2'>
                Variable yang tersedia:
              </div>
              {EMAIL_VARIABLES.map((variable) => (
                <div
                  key={variable.key}
                  className='px-3 py-2 hover:bg-gray-50 cursor-pointer rounded text-sm'
                  onClick={() => insertVariable(variable.key)}
                >
                  <div className='font-mono text-teal-600 font-semibold'>
                    {variable.key}
                  </div>
                  <div className='text-xs text-gray-600 mt-1'>
                    {variable.description}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    Contoh: {variable.example}
                  </div>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </AdminLayout>
  );
};

export default KelolaTemplateEmailEditor;
