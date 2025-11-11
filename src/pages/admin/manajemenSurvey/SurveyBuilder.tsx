/** @format */

import {SoalComboBox} from '@/components/kuisioner/soal/SoalComboBox';
import {SoalMultiChoice} from '@/components/kuisioner/soal/SoalMultiChoice';
import {SoalRating} from '@/components/kuisioner/soal/SoalRating';
import {SoalSingleChoice} from '@/components/kuisioner/soal/SoalSingleChoice';
import {SoalTeks} from '@/components/kuisioner/soal/SoalTeks';
import {SoalTeksArea} from '@/components/kuisioner/soal/SoalTeksArea';
import {AdminLayout} from '@/components/layout/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  ResizableCard,
  ResizableContent,
  ResizablePanel,
} from '@/components/ui/resizable-card';
import {useBuilderStore} from '@/stores/builder-store';
import type {
  ComboBoxQuestion,
  MultipleChoiceQuestion,
  Question,
  RatingQuestion,
  SingleChoiceQuestion,
  TextAreaQuestion,
  TextQuestion,
} from '@/types/survey';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  Edit,
  FileText,
  ListFilter,
  Package,
  Plus,
  Star,
  Trash2,
  Type,
  X,
  ArrowLeft,
} from 'lucide-react';
import * as React from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {toast} from 'sonner';
import {useSaveBuilder} from '@/api/survey.api';
import {v4 as uuidv4} from 'uuid';

interface ErrorDetail {
  field: string;
  message: string;
  type: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string | ErrorDetail[];
    };
  };
}

type ExtendedQuestion = Question & {
  questionCode?: string;
  version?: string;
  parentId?: string | null;
  groupQuestionId?: string;
  placeholder?: string;
  searchplaceholder?: string;
  questionTree?: Array<{
    answerQuestionTriggerId: string;
    questionPointerToId: string;
  }>;
};

interface AnswerOption {
  id?: string;
  answerText: string;
  sortOrder: number;
  otherOptionPlaceholder: string;
  isTriggered: boolean;
}

function SurveyBuilder() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const questions = useBuilderStore((state) => state.questions);
  const activeQuestionId = useBuilderStore((state) => state.activeQuestionId);
  const currentPageIndex = useBuilderStore((state) => state.currentPageIndex);
  const pages = useBuilderStore((state) => state.pages);
  const addQuestion = useBuilderStore((state) => state.addQuestion);
  const createQuestionVersion = useBuilderStore(
    (state) => state.createQuestionVersion
  );
  const nextPage = useBuilderStore((state) => state.nextPage);
  const prevPage = useBuilderStore((state) => state.prevPage);
  const removeQuestionVersion = useBuilderStore(
    (state) => state.removeQuestionVersion
  );
  const reorderCurrentPageQuestions = useBuilderStore(
    (state) => state.reorderCurrentPageQuestions
  );
  const replaceQuestionInCurrentPage = useBuilderStore(
    (state) => state.replaceQuestionInCurrentPage
  );
  const setActiveQuestion = useBuilderStore((state) => state.setActiveQuestion);
  const setPageMeta = useBuilderStore((state) => state.setPageMeta);
  const updateQuestion = useBuilderStore((state) => state.updateQuestion);
  const updatePages = useBuilderStore((state) => state.updatePages);
  const currentQuestionIds = pages[currentPageIndex]?.questionIds || [];
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const [versionComboOpen, setVersionComboOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const surveyType = searchParams.get('type') as
    | 'TRACER_STUDY'
    | 'USER_SURVEY'
    | null;
  const surveyId = searchParams.get('id');
  const isEditMode = searchParams.get('edit') === 'true';

  // API Hooks
  const saveBuilderMutation = useSaveBuilder();

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  // Get survey type info
  const getSurveyTypeInfo = () => {
    switch (surveyType) {
      case 'TRACER_STUDY':
        return {
          title: 'Tracer Study',
          description: 'Survey untuk melacak status lulusan dan alumni',
          icon: FileText,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'USER_SURVEY':
        return {
          title: 'User Survey',
          description: 'Survey untuk mengukur kepuasan mahasiswa',
          icon: Package,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        };
      default:
        return {
          title: 'Survey',
          description: 'Survey builder',
          icon: FileText,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const surveyInfo = getSurveyTypeInfo();

  const handleAdd = (type: Question['type']) => {
    addQuestion(type);
  };

  // Toggle edit mode and update URL
  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    if (newEditMode) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('edit', 'true');
        return newParams;
      });
    } else {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('edit');
        return newParams;
      });
    }
  };

  const patchActive = (patch: Partial<Question>) => {
    if (!activeQuestion) return;
    updateQuestion({id: activeQuestion.id, patch});
  };

  // Get all questions with same questionCode for version selection
  const getVersionQuestions = () => {
    if (!activeQuestion) return [];
    const questionCode =
      (activeQuestion as Question & {questionCode?: string}).questionCode ||
      `Q${currentQuestionIds.findIndex((id) => id === activeQuestion.id) + 1}`;
    return questions.filter(
      (q) =>
        (q as Question & {questionCode?: string}).questionCode === questionCode
    );
  };

  // Create new version of current question
  const createNewVersion = () => {
    if (!activeQuestion) return;
    const questionCode =
      (activeQuestion as Question & {questionCode?: string}).questionCode ||
      `Q${currentQuestionIds.findIndex((id) => id === activeQuestion.id) + 1}`;
    const existingVersions = getVersionQuestions();
    const maxVersion = Math.max(
      ...existingVersions.map((q) =>
        parseInt((q as Question & {version?: string}).version || '2024')
      )
    );
    const newVersion = (maxVersion + 1).toString();

    // Create base question with default values for the type
    const getDefaultQuestionData = (type: Question['type']) => {
      const baseData = {
        id: uuidv4(),
        type,
        label: 'Label pertanyaan',
        required: false,
        questionCode,
        version: newVersion,
      };

      switch (type) {
        case 'text':
          return {
            ...baseData,
            placeholder: 'Masukkan jawaban...',
            inputType: 'text' as const,
          };
        case 'textarea':
          return {...baseData, placeholder: 'Masukkan jawaban...', rows: 3};
        case 'single':
          return {
            ...baseData,
            options: [{value: uuidv4(), label: 'Opsi 1'}],
            layout: 'vertical' as const,
          };
        case 'multiple':
          return {
            ...baseData,
            options: [{value: uuidv4(), label: 'Opsi 1'}],
            layout: 'vertical' as const,
          };
        case 'combobox':
          return {
            ...baseData,
            comboboxItems: [
              {
                id: uuidv4(),
                label: 'Item 1',
                placeholder: 'Pilih...',
                searchPlaceholder: 'Cari...',
                required: false,
                options: [{value: uuidv4(), label: 'Opsi 1'}],
              },
            ],
          };
        case 'rating':
          return {
            ...baseData,
            ratingItems: [{id: uuidv4(), label: 'Aspek 1'}],
            ratingOptions: [
              {value: uuidv4(), label: 'Sangat Buruk'},
              {value: uuidv4(), label: 'Buruk'},
              {value: uuidv4(), label: 'Cukup'},
              {value: uuidv4(), label: 'Baik'},
              {value: uuidv4(), label: 'Sangat Baik'},
            ],
          };
        default:
          return baseData;
      }
    };

    const newQuestionData = getDefaultQuestionData(activeQuestion.type);

    createQuestionVersion(newQuestionData);

    replaceQuestionInCurrentPage({
      oldQuestionId: activeQuestion.id,
      newQuestionId: newQuestionData.id,
    });
    setActiveQuestion(newQuestionData.id);
  };

  const handleSave = async () => {
    if (!surveyId) {
      toast.error('Survey ID tidak ditemukan');
      return;
    }

    if (questions.length === 0) {
      toast.error('Tidak ada pertanyaan untuk disimpan');
      return;
    }

    setIsSaving(true);
    try {
      // Validate and fix pages ID to UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const updatedPages = pages.map((page) => {
        if (!uuidRegex.test(page.id)) {
          return {...page, id: uuidv4()};
        }
        return page;
      });

      // Update store if any pages ID were changed
      const hasInvalidIds = pages.some(
        (page, idx) => page.id !== updatedPages[idx].id
      );
      if (hasInvalidIds) {
        updatePages(updatedPages);
      }

      // Transform questions ke format API
      const transformedQuestions = questions.map((q, index) => {
        const extQ = q as ExtendedQuestion;
        const isValidUUID = uuidRegex.test(q.id);
        const questionId = isValidUUID ? q.id : undefined;
        const codeId = extQ.questionCode || `Q${index + 1}`;

        // Ensure groupQuestionId is always UUID
        let groupQuestionId = extQ.groupQuestionId || q.id;
        if (!uuidRegex.test(groupQuestionId)) {
          groupQuestionId = uuidv4();
        }

        const answerOptions = mapAnswerOptions(q);

        // Transform questionTree: map option value to answerOption based on answerText and sortOrder
        // We'll use answerText and sortOrder as temporary identifiers, backend will map to AnswerOptionQuestion ID
        let questionTree:
          | Array<{
              answerQuestionTriggerId: string;
              questionPointerToId: string;
              _tempAnswerText?: string;
              _tempSortOrder?: number;
            }>
          | undefined = undefined;
        if (q.type === 'single' && extQ.questionTree) {
          const singleQ = q as SingleChoiceQuestion;
          const treeData = extQ.questionTree || [];
          questionTree = treeData
            .map((tree) => {
              // Skip if questionPointerToId is empty (user checked trigger but didn't select question yet)
              if (!tree.questionPointerToId) return null;

              // Find the option by value
              const option = singleQ.options?.find(
                (opt) => opt.value === tree.answerQuestionTriggerId
              );
              if (!option) return null;

              // Find the answer option by answerText and sortOrder
              const answerOption = answerOptions.find(
                (ao, idx) =>
                  ao.answerText === option.label && ao.sortOrder === idx
              );
              if (!answerOption) return null;

              // If answerOption has ID, use it; otherwise use answerText and sortOrder as temporary identifier
              return {
                answerQuestionTriggerId:
                  answerOption.id ||
                  `${answerOption.answerText}_${answerOption.sortOrder}`,
                questionPointerToId: tree.questionPointerToId,
                _tempAnswerText: answerOption.answerText,
                _tempSortOrder: answerOption.sortOrder,
              };
            })
            .filter((t): t is NonNullable<typeof t> => t !== null);
        }

        return {
          ...(questionId ? {id: questionId} : {}),
          codeId,
          parentId: extQ.parentId || null,
          groupQuestionId,
          questionText: q.label,
          questionType: mapQuestionTypeToAPI(q.type),
          isRequired: q.required,
          sortOrder: index,
          placeholder: extQ.placeholder || '',
          searchplaceholder: extQ.searchplaceholder || '',
          version: extQ.version || '2024',
          questionCode: codeId,
          answerQuestion: answerOptions,
          ...(questionTree && questionTree.length > 0 ? {questionTree} : {}),
        };
      });

      await saveBuilderMutation.mutateAsync({
        surveyId,
        data: {
          pages: updatedPages.map((page, idx) => ({
            id: page.id,
            title: page.title || `Halaman ${idx + 1}`,
            description: page.description || '',
            codeIds: page.questionIds.map((qid) => {
              const q = questions.find((qq) => qq.id === qid) as
                | ExtendedQuestion
                | undefined;
              return q?.questionCode || `Q${idx + 1}`;
            }),
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          questions: transformedQuestions as any,
        },
      });

      toast.success('Survey berhasil disimpan');

      // Only redirect if not in edit mode (if surveyId exists, it's edit mode)
      if (!surveyId) {
        navigate('/admin/survey');
      }
    } catch (error) {
      const err = error as ErrorResponse;
      const errorMessage = err?.response?.data?.message;

      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((errDetail) => {
          toast.error(`${errDetail.field}: ${errDetail.message}`);
        });
      } else if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else {
        toast.error('Gagal menyimpan survey');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const mapQuestionTypeToAPI = (type: Question['type']): string => {
    const mapping: Record<string, string> = {
      text: 'ESSAY',
      textarea: 'LONG_TEST',
      single: 'SINGLE_CHOICE',
      multiple: 'MULTIPLE_CHOICE',
      combobox: 'COMBO_BOX',
      rating: 'MATRIX_SINGLE_CHOICE',
    };
    return mapping[type] || 'ESSAY';
  };

  const mapAnswerOptions = (question: Question): AnswerOption[] => {
    if (question.type === 'single' || question.type === 'multiple') {
      const options =
        (question as SingleChoiceQuestion | MultipleChoiceQuestion).options ||
        [];
      return options.map(
        (opt, idx): AnswerOption => ({
          answerText: opt.label,
          sortOrder: idx,
          otherOptionPlaceholder: '',
          isTriggered: false,
        })
      );
    }
    if (question.type === 'combobox') {
      const items = (question as ComboBoxQuestion).comboboxItems || [];
      return items.flatMap((item, itemIdx) =>
        (item.options || []).map(
          (opt, optIdx): AnswerOption => ({
            answerText: opt.label,
            sortOrder: itemIdx * 100 + optIdx,
            otherOptionPlaceholder: '',
            isTriggered: false,
          })
        )
      );
    }
    if (question.type === 'rating') {
      const options = (question as RatingQuestion).ratingOptions || [];
      return options.map(
        (opt, idx): AnswerOption => ({
          answerText: opt.label,
          sortOrder: idx,
          otherOptionPlaceholder: '',
          isTriggered: false,
        })
      );
    }
    return [];
  };

  const handleBack = () => {
    navigate('/admin/survey');
  };

  return (
    <AdminLayout>
      <div className='h-[calc(100vh-4rem)] p-6'>
        {/* Header */}
        <div className='mb-6 relative'>
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('/admin/dashboard')}
                  className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                >
                  <Package className='h-4 w-4' />
                  <span>Dashboard</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('/admin/survey')}
                  className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                >
                  <FileText className='h-4 w-4' />
                  <span>Pengaturan Survey</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{surveyInfo.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title - Centered */}
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <div className='text-center'>
              <h1 className='text-xl font-bold text-foreground flex items-center justify-center space-x-2'>
                <surveyInfo.icon className={`h-6 w-6 ${surveyInfo.color}`} />
                <span>Kelola {surveyInfo.title}</span>
              </h1>
              <p className='text-sm text-muted-foreground mt-1'>
                {surveyInfo.description}
              </p>
            </div>
          </div>

          {/* Action Buttons - Top Right */}
          <div className='absolute top-0 right-0 pointer-events-auto flex items-center space-x-2'>
            <Button
              variant='outline'
              onClick={handleBack}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
            <Button
              variant={isEditMode ? 'default' : 'outline'}
              onClick={toggleEditMode}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              {isEditMode ? 'Keluar Edit' : 'Edit'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className='flex items-center gap-2'
            >
              <FileText className='h-4 w-4' />
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>

        {/* Resizable Card Container */}
        <div className='h-[calc(100%-5rem)]'>
          <ResizableCard className='gap-4'>
            {/* Panel Kiri - Jenis Soal - Hanya muncul saat edit mode */}
            {isEditMode && (
              <ResizablePanel
                defaultWidth={220}
                minWidth={220}
                maxWidth={220}
                resizable='right'
                className='animate-in slide-in-from-left duration-300'
              >
                <Card className='h-full'>
                  <CardHeader className='p-3'>
                    <CardTitle className='text-md'>Jenis Soal</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='grid grid-cols-1 gap-2'>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => handleAdd('text')}
                      >
                        <Type className='h-4 w-4 mr-2' /> Teks Pendek
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => handleAdd('textarea')}
                      >
                        <FileText className='h-4 w-4 mr-2' /> Teks Panjang
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => handleAdd('single')}
                      >
                        <Circle className='h-4 w-4 mr-2' /> Single Choice
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => handleAdd('multiple')}
                      >
                        <CheckSquare className='h-4 w-4 mr-2' /> Multiple Choice
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => handleAdd('combobox')}
                      >
                        <ListFilter className='h-4 w-4 mr-2' /> Combo Box
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => handleAdd('rating')}
                      >
                        <Star className='h-4 w-4 mr-2' /> Rating
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ResizablePanel>
            )}

            {/* Panel Tengah - Preview Form */}
            <ResizableContent>
              <Card className='h-full'>
                <div className='h-full flex flex-col'>
                  <CardHeader className='p-3'>
                    <div className='flex items-center justify-between gap-4'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => prevPage()}
                        aria-label='Sebelumnya'
                      >
                        <ChevronLeft className='h-4 w-4' />
                      </Button>
                      <div className='text-center flex-1 px-16'>
                        <Input
                          value={pages[currentPageIndex]?.title || ''}
                          onChange={(e) => setPageMeta({title: e.target.value})}
                          className='text-center font-semibold'
                        />
                        <Input
                          value={pages[currentPageIndex]?.description || ''}
                          onChange={(e) =>
                            setPageMeta({description: e.target.value})
                          }
                          className='mt-2 text-center'
                        />
                      </div>
                      <Button
                        size='icon'
                        onClick={() => nextPage()}
                        aria-label='Berikutnya'
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-1 overflow-auto space-y-4'>
                    {questions.length === 0 && (
                      <div className='text-sm text-muted-foreground'>
                        Belum ada soal untuk dipreview.
                      </div>
                    )}
                    {/* Render hanya pertanyaan di halaman aktif */}
                    {currentQuestionIds.map((qid, idx) => {
                      const q = questions.find((qq) => qq.id === qid);
                      if (!q) return null;
                      const questionCode = `Q${idx + 1}`;
                      const common = {
                        label: q.label,
                        required: q.required,
                        disabled: false,
                      };
                      const isActive = activeQuestionId === q.id;
                      const Wrap = (children: React.ReactNode) => (
                        <div
                          key={q.id}
                          className='flex items-start gap-3'
                        >
                          <div
                            className={`mt-2 w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
                              isActive
                                ? 'border-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div
                            className={`relative p-3 rounded-md border flex-1 ${
                              isEditMode ? 'cursor-pointer' : 'cursor-default'
                            } ${isActive ? 'border-primary' : ''} ${
                              dragIndex === idx ? 'opacity-90' : ''
                            } ${
                              overIndex === idx &&
                              dragIndex !== null &&
                              dragIndex !== idx
                                ? 'ring-2 ring-primary ring-offset-2'
                                : ''
                            }`}
                            onClick={() =>
                              isEditMode && setActiveQuestion(q.id)
                            }
                            draggable={isEditMode}
                            onDragStart={() => isEditMode && setDragIndex(idx)}
                            onDragOver={(e) => {
                              if (isEditMode) {
                                e.preventDefault();
                                setOverIndex(idx);
                              }
                            }}
                            onDrop={() => {
                              if (
                                isEditMode &&
                                dragIndex !== null &&
                                dragIndex !== idx
                              ) {
                                reorderCurrentPageQuestions({
                                  from: dragIndex,
                                  to: idx,
                                });
                              }
                              setDragIndex(null);
                              setOverIndex(null);
                            }}
                            onDragEnd={() => {
                              setDragIndex(null);
                              setOverIndex(null);
                            }}
                          >
                            {isEditMode && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className='absolute top-2 right-2 text-muted-foreground hover:text-destructive'
                                    aria-label='Hapus pertanyaan'
                                  >
                                    <X className='h-4 w-4' />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Hapus versi pertanyaan?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className='space-y-2'>
                                      <div>
                                        Tindakan ini tidak dapat dibatalkan.
                                        Hanya versi pertanyaan yang dipilih akan
                                        dihapus.
                                      </div>
                                      <div className='bg-muted p-3 rounded-md'>
                                        <div className='text-sm font-medium'>
                                          Detail pertanyaan yang akan dihapus:
                                        </div>
                                        <div className='text-sm space-y-1 mt-1'>
                                          <div>
                                            <span className='font-medium'>
                                              Kode:
                                            </span>{' '}
                                            {(
                                              q as Question & {
                                                questionCode?: string;
                                              }
                                            ).questionCode || `Q${idx + 1}`}
                                          </div>
                                          <div>
                                            <span className='font-medium'>
                                              Versi:
                                            </span>{' '}
                                            v
                                            {(
                                              q as Question & {version?: string}
                                            ).version || '2024'}
                                          </div>
                                          <div>
                                            <span className='font-medium'>
                                              Label:
                                            </span>{' '}
                                            {q.label}
                                          </div>
                                          <div>
                                            <span className='font-medium'>
                                              Tipe:
                                            </span>{' '}
                                            {q.type}
                                          </div>
                                        </div>
                                      </div>
                                      <div className='text-xs text-muted-foreground'>
                                        Versi lain dengan kode yang sama akan
                                        tetap tersimpan.
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        removeQuestionVersion(q.id)
                                      }
                                    >
                                      Hapus Versi
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <div className='pointer-events-none select-none'>
                              <div className='flex items-center gap-2 mb-2'>
                                <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                                  {(q as Question & {questionCode?: string})
                                    .questionCode || questionCode}
                                </span>
                                {(q as Question & {version?: string})
                                  .version && (
                                  <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded'>
                                    v
                                    {
                                      (q as Question & {version?: string})
                                        .version
                                    }
                                  </span>
                                )}
                              </div>
                              {children}
                            </div>
                          </div>
                        </div>
                      );

                      // Filter out non-DOM props before passing to components
                      const getCleanProps = (question: Question) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const {questionCode, version, ...cleanProps} =
                          question as Question & {
                            questionCode?: string;
                            version?: string;
                          };
                        return cleanProps;
                      };

                      switch (q.type) {
                        case 'text': {
                          const textQuestion = q as TextQuestion;
                          const textProps = getCleanProps(textQuestion);
                          // Ensure type is only "text" for SoalTeks
                          return Wrap(
                            <SoalTeks
                              {...{...textProps, type: 'text'}}
                              {...common}
                              value=''
                              onChange={() => {}}
                            />
                          );
                        }
                        case 'textarea': {
                          const textareaQuestion = q as TextAreaQuestion;
                          const textareaProps = getCleanProps(textareaQuestion);
                          return Wrap(
                            <SoalTeksArea
                              {...textareaProps}
                              {...common}
                              value=''
                              onChange={() => {}}
                            />
                          );
                        }
                        case 'single': {
                          const singleQuestion = q as SingleChoiceQuestion;
                          const singleProps = getCleanProps(singleQuestion);
                          return Wrap(
                            <SoalSingleChoice
                              {...singleProps}
                              {...common}
                              opsiJawaban={singleQuestion.options}
                              value=''
                              onChange={() => {}}
                            />
                          );
                        }
                        case 'multiple': {
                          const multipleQuestion = q as MultipleChoiceQuestion;
                          const multipleProps = getCleanProps(multipleQuestion);
                          return Wrap(
                            <SoalMultiChoice
                              {...multipleProps}
                              {...common}
                              opsiJawaban={multipleQuestion.options}
                              value={[]}
                              onChange={() => {}}
                            />
                          );
                        }
                        case 'combobox': {
                          const comboQuestion = q as ComboBoxQuestion;
                          const comboProps = getCleanProps(comboQuestion);
                          return Wrap(
                            <SoalComboBox
                              {...comboProps}
                              {...common}
                              comboboxItems={comboQuestion.comboboxItems.map(
                                (it) => ({...it, opsiComboBox: it.options})
                              )}
                              values={{}}
                              onChange={() => {}}
                            />
                          );
                        }
                        case 'rating': {
                          const ratingQuestion = q as RatingQuestion;
                          const ratingProps = getCleanProps(ratingQuestion);
                          return Wrap(
                            <SoalRating
                              {...ratingProps}
                              {...common}
                              ratingItems={ratingQuestion.ratingItems}
                              values={{}}
                              onChange={() => {}}
                            />
                          );
                        }
                        default:
                          return null;
                      }
                    })}
                  </CardContent>
                </div>
              </Card>
            </ResizableContent>

            {/* Panel Kanan - Detail per Soal - Hanya muncul saat edit mode */}
            {isEditMode && (
              <ResizablePanel
                defaultWidth={350}
                minWidth={300}
                maxWidth={500}
                resizable='left'
                className='animate-in slide-in-from-right duration-300'
              >
                <Card className='h-full'>
                  <CardHeader className='p-3'>
                    <CardTitle className='text-md'>Detail per Soal</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {!activeQuestion && (
                      <div className='text-sm text-muted-foreground'>
                        Pilih atau tambah soal untuk mengedit.
                      </div>
                    )}
                    {activeQuestion && (
                      <div className='space-y-3'>
                        <div className='space-y-1'>
                          <label className='text-sm font-medium'>
                            Kode Soal
                          </label>
                          <Input
                            value={
                              (
                                activeQuestion as Question & {
                                  questionCode?: string;
                                }
                              ).questionCode ||
                              `Q${
                                currentQuestionIds.findIndex(
                                  (id) => id === activeQuestion.id
                                ) + 1
                              }`
                            }
                            onChange={(e) =>
                              patchActive({
                                questionCode: e.target.value,
                              } as Partial<Question & {questionCode?: string}>)
                            }
                            placeholder='Q1, Q2, dst...'
                          />
                        </div>
                        <div className='space-y-1'>
                          <label className='text-sm font-medium'>
                            Versi Soal
                          </label>
                          <div className='text-xs text-muted-foreground mb-2'>
                            Pilih versi atau buat versi baru
                          </div>
                          <Popover
                            open={versionComboOpen}
                            onOpenChange={setVersionComboOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={versionComboOpen}
                                className='w-full justify-between'
                              >
                                {activeQuestion
                                  ? `v${
                                      (
                                        activeQuestion as Question & {
                                          version?: string;
                                        }
                                      ).version || '2024'
                                    }`
                                  : 'Pilih versi...'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-full p-0'>
                              <Command>
                                <CommandInput placeholder='Cari versi...' />
                                <CommandList>
                                  <CommandEmpty>
                                    Versi tidak ditemukan.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {getVersionQuestions().map(
                                      (versionQuestion) => (
                                        <CommandItem
                                          key={versionQuestion.id}
                                          value={`v${
                                            (
                                              versionQuestion as Question & {
                                                version?: string;
                                              }
                                            ).version || '2024'
                                          }`}
                                          className='bg-background hover:bg-muted data-[selected=true]:bg-muted data-[selected=true]:text-foreground'
                                          onSelect={() => {
                                            // Switch version: replace current question in page with selected version
                                            if (
                                              activeQuestion &&
                                              versionQuestion.id !==
                                                activeQuestion.id
                                            ) {
                                              replaceQuestionInCurrentPage({
                                                oldQuestionId:
                                                  activeQuestion.id,
                                                newQuestionId:
                                                  versionQuestion.id,
                                              });
                                            }
                                            setActiveQuestion(
                                              versionQuestion.id
                                            );
                                            setVersionComboOpen(false);
                                          }}
                                        >
                                          <div className='flex items-center justify-between w-full'>
                                            <div className='flex items-center gap-2'>
                                              <span className='font-medium'>
                                                v
                                                {(
                                                  versionQuestion as Question & {
                                                    version?: string;
                                                  }
                                                ).version || '2024'}
                                              </span>
                                            </div>
                                            {versionQuestion.id ===
                                              activeQuestion?.id && (
                                              <span className='text-xs bg-primary text-primary-foreground px-2 py-1 rounded'>
                                                Aktif
                                              </span>
                                            )}
                                          </div>
                                        </CommandItem>
                                      )
                                    )}
                                    <CommandItem
                                      onSelect={() => {
                                        createNewVersion();
                                        setVersionComboOpen(false);
                                      }}
                                      className='border-t'
                                    >
                                      <div className='flex items-center gap-2 text-primary'>
                                        <Plus className='h-4 w-4' />
                                        <span className='font-medium'>
                                          Buat Versi Baru
                                        </span>
                                      </div>
                                    </CommandItem>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className='space-y-1'>
                          <label className='text-sm font-medium'>Label</label>
                          <Input
                            value={activeQuestion.label}
                            onChange={(e) =>
                              patchActive({label: e.target.value})
                            }
                          />
                        </div>
                        {(activeQuestion.type === 'text' ||
                          activeQuestion.type === 'textarea') && (
                          <div className='space-y-1'>
                            <label className='text-sm font-medium'>
                              Placeholder
                            </label>
                            <Input
                              value={
                                (
                                  activeQuestion as
                                    | TextQuestion
                                    | TextAreaQuestion
                                ).placeholder || ''
                              }
                              onChange={(e) =>
                                patchActive({placeholder: e.target.value})
                              }
                            />
                          </div>
                        )}
                        {activeQuestion.type === 'text' && (
                          <div className='space-y-1'>
                            <label className='text-sm font-medium'>
                              Input Type
                            </label>
                            <select
                              value={
                                (activeQuestion as TextQuestion).inputType ||
                                'text'
                              }
                              onChange={(e) =>
                                patchActive({
                                  inputType: e.target.value as
                                    | 'text'
                                    | 'email'
                                    | 'number'
                                    | 'tel'
                                    | 'url',
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            >
                              <option value='text'>Text</option>
                              <option value='email'>Email</option>
                              <option value='number'>Number</option>
                              <option value='tel'>Telephone</option>
                              <option value='url'>URL</option>
                            </select>
                          </div>
                        )}
                        {activeQuestion.type === 'textarea' && (
                          <div className='space-y-1'>
                            <label className='text-sm font-medium'>Rows</label>
                            <Input
                              type='number'
                              value={
                                (activeQuestion as TextAreaQuestion).rows || 3
                              }
                              onChange={(e) =>
                                patchActive({rows: parseInt(e.target.value)})
                              }
                              min='1'
                              max='10'
                            />
                          </div>
                        )}
                        {(activeQuestion.type === 'single' ||
                          activeQuestion.type === 'multiple') && (
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <label className='text-sm font-medium'>
                                Opsi Jawaban
                              </label>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  const currentOptions =
                                    (
                                      activeQuestion as
                                        | SingleChoiceQuestion
                                        | MultipleChoiceQuestion
                                    ).options || [];
                                  const options = [
                                    ...currentOptions,
                                    {
                                      value: uuidv4(),
                                      label: 'Opsi Baru',
                                    },
                                  ];
                                  patchActive({options});
                                }}
                              >
                                <Plus className='h-4 w-4 mr-1' />
                                Tambah
                              </Button>
                            </div>
                            <div className='space-y-2'>
                              {(
                                (
                                  activeQuestion as
                                    | SingleChoiceQuestion
                                    | MultipleChoiceQuestion
                                ).options || []
                              ).map((opt, i: number) => (
                                <div
                                  key={opt.value}
                                  className='flex items-center space-x-2'
                                >
                                  <Input
                                    value={opt.label}
                                    onChange={(e) => {
                                      const currentOptions =
                                        (
                                          activeQuestion as
                                            | SingleChoiceQuestion
                                            | MultipleChoiceQuestion
                                        ).options || [];
                                      const options = [...currentOptions];
                                      options[i] = {
                                        ...opt,
                                        label: e.target.value,
                                      };
                                      patchActive({options});
                                    }}
                                  />
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => {
                                      const currentOptions =
                                        (
                                          activeQuestion as
                                            | SingleChoiceQuestion
                                            | MultipleChoiceQuestion
                                        ).options || [];
                                      const options = [...currentOptions];
                                      options.splice(i, 1);
                                      patchActive({options});
                                    }}
                                  >
                                    <Trash2 className='h-4 w-4 text-destructive' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {activeQuestion.type === 'single' && (
                          <div className='space-y-2 border-t pt-4'>
                            <label className='text-sm font-medium'>
                              Question Tree (Tampilkan pertanyaan jika opsi
                              dipilih - Recursive)
                            </label>
                            <p className='text-xs text-gray-500'>
                              Pilih opsi yang akan menjadi trigger untuk
                              menampilkan pertanyaan berikutnya. Pertanyaan yang
                              dipilih juga bisa memiliki question tree sendiri
                              (recursive).
                            </p>
                            <div className='space-y-3'>
                              {(
                                (activeQuestion as SingleChoiceQuestion)
                                  .options || []
                              ).map((opt) => {
                                const extQ = activeQuestion as ExtendedQuestion;
                                const currentQuestionTree =
                                  extQ.questionTree || [];
                                const treeForOption = currentQuestionTree.find(
                                  (tree) =>
                                    tree.answerQuestionTriggerId === opt.value
                                );
                                return (
                                  <div
                                    key={opt.value}
                                    className='p-3 border rounded-md space-y-2'
                                  >
                                    <div className='flex items-center justify-between'>
                                      <div className='text-sm font-medium text-gray-700'>
                                        Jika memilih: {opt.label}
                                      </div>
                                      <label className='flex items-center space-x-2 text-sm'>
                                        <input
                                          type='checkbox'
                                          checked={!!treeForOption}
                                          onChange={(e) => {
                                            const extQ =
                                              activeQuestion as ExtendedQuestion;
                                            const currentQuestionTree =
                                              extQ.questionTree || [];
                                            if (!e.target.checked) {
                                              // Remove question tree for this option
                                              const newQuestionTree =
                                                currentQuestionTree.filter(
                                                  (t) =>
                                                    t.answerQuestionTriggerId !==
                                                    opt.value
                                                );
                                              patchActive({
                                                questionTree: newQuestionTree,
                                              } as Partial<ExtendedQuestion>);
                                            } else {
                                              // Add empty question tree (user needs to select question)
                                              const newQuestionTree = [
                                                ...currentQuestionTree.filter(
                                                  (t) =>
                                                    t.answerQuestionTriggerId !==
                                                    opt.value
                                                ),
                                                {
                                                  answerQuestionTriggerId:
                                                    opt.value,
                                                  questionPointerToId: '',
                                                },
                                              ];
                                              patchActive({
                                                questionTree: newQuestionTree,
                                              } as Partial<ExtendedQuestion>);
                                            }
                                          }}
                                          className='rounded border-gray-300'
                                        />
                                        <span>Jadikan trigger</span>
                                      </label>
                                    </div>
                                    {treeForOption && (
                                      <select
                                        value={
                                          treeForOption?.questionPointerToId ||
                                          ''
                                        }
                                        onChange={(e) => {
                                          const extQ =
                                            activeQuestion as ExtendedQuestion;
                                          const currentQuestionTree =
                                            extQ.questionTree || [];
                                          const newQuestionTree = e.target.value
                                            ? [
                                                ...currentQuestionTree.filter(
                                                  (t) =>
                                                    t.answerQuestionTriggerId !==
                                                    opt.value
                                                ),
                                                {
                                                  answerQuestionTriggerId:
                                                    opt.value,
                                                  questionPointerToId:
                                                    e.target.value,
                                                },
                                              ]
                                            : currentQuestionTree.filter(
                                                (t) =>
                                                  t.answerQuestionTriggerId !==
                                                  opt.value
                                              );
                                          patchActive({
                                            questionTree: newQuestionTree,
                                          } as Partial<ExtendedQuestion>);
                                        }}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                      >
                                        <option value=''>
                                          Pilih pertanyaan lanjutan
                                        </option>
                                        {questions
                                          .filter(
                                            (q) => q.id !== activeQuestion.id
                                          )
                                          .map((q) => (
                                            <option
                                              key={q.id}
                                              value={q.id}
                                            >
                                              {q.label} ({q.type})
                                              {q.type === 'single' &&
                                                ' - bisa recursive'}
                                            </option>
                                          ))}
                                      </select>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {activeQuestion.type === 'combobox' && (
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <label className='text-sm font-medium'>
                                ComboBox Items
                              </label>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  const currentItems =
                                    (activeQuestion as ComboBoxQuestion)
                                      .comboboxItems || [];
                                  const newItem = {
                                    id: uuidv4(),
                                    label: 'Item Baru',
                                    placeholder: 'Pilih...',
                                    searchPlaceholder: 'Cari...',
                                    required: false,
                                    options: [
                                      {value: uuidv4(), label: 'Opsi 1'},
                                      {value: uuidv4(), label: 'Opsi 2'},
                                    ],
                                  };
                                  patchActive({
                                    comboboxItems: [...currentItems, newItem],
                                  });
                                }}
                              >
                                <Plus className='h-4 w-4 mr-1' />
                                Tambah Item
                              </Button>
                            </div>
                            <div className='space-y-2'>
                              {(
                                (activeQuestion as ComboBoxQuestion)
                                  .comboboxItems || []
                              ).map((item, i) => (
                                <div
                                  key={item.id}
                                  className='p-3 border rounded-md space-y-2'
                                >
                                  <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium'>
                                      Item {i + 1}
                                    </span>
                                    <Button
                                      size='icon'
                                      variant='ghost'
                                      onClick={() => {
                                        const currentItems =
                                          (activeQuestion as ComboBoxQuestion)
                                            .comboboxItems || [];
                                        const newItems = currentItems.filter(
                                          (_, idx) => idx !== i
                                        );
                                        patchActive({comboboxItems: newItems});
                                      }}
                                    >
                                      <Trash2 className='h-4 w-4 text-destructive' />
                                    </Button>
                                  </div>
                                  <Input
                                    value={item.label}
                                    onChange={(e) => {
                                      const currentItems =
                                        (activeQuestion as ComboBoxQuestion)
                                          .comboboxItems || [];
                                      const newItems = [...currentItems];
                                      newItems[i] = {
                                        ...item,
                                        label: e.target.value,
                                      };
                                      patchActive({comboboxItems: newItems});
                                    }}
                                    placeholder='Label item'
                                  />
                                  <Input
                                    value={item.placeholder || ''}
                                    onChange={(e) => {
                                      const currentItems =
                                        (activeQuestion as ComboBoxQuestion)
                                          .comboboxItems || [];
                                      const newItems = [...currentItems];
                                      newItems[i] = {
                                        ...item,
                                        placeholder: e.target.value,
                                      };
                                      patchActive({comboboxItems: newItems});
                                    }}
                                    placeholder='Placeholder'
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {activeQuestion.type === 'rating' && (
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <label className='text-sm font-medium'>
                                Rating Items
                              </label>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  const currentItems =
                                    (activeQuestion as RatingQuestion)
                                      .ratingItems || [];
                                  const newItem = {
                                    id: uuidv4(),
                                    label: 'Aspek Baru',
                                  };
                                  patchActive({
                                    ratingItems: [...currentItems, newItem],
                                  });
                                }}
                              >
                                <Plus className='h-4 w-4 mr-1' />
                                Tambah Aspek
                              </Button>
                            </div>
                            <div className='space-y-2'>
                              {(
                                (activeQuestion as RatingQuestion)
                                  .ratingItems || []
                              ).map((item, i) => (
                                <div
                                  key={item.id}
                                  className='flex items-center space-x-2'
                                >
                                  <Input
                                    value={item.label}
                                    onChange={(e) => {
                                      const currentItems =
                                        (activeQuestion as RatingQuestion)
                                          .ratingItems || [];
                                      const newItems = [...currentItems];
                                      newItems[i] = {
                                        ...item,
                                        label: e.target.value,
                                      };
                                      patchActive({ratingItems: newItems});
                                    }}
                                  />
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => {
                                      const currentItems =
                                        (activeQuestion as RatingQuestion)
                                          .ratingItems || [];
                                      const newItems = currentItems.filter(
                                        (_, idx) => idx !== i
                                      );
                                      patchActive({ratingItems: newItems});
                                    }}
                                  >
                                    <Trash2 className='h-4 w-4 text-destructive' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <div className='flex items-center justify-between'>
                              <label className='text-sm font-medium'>
                                Rating Options
                              </label>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  const currentOptions =
                                    (activeQuestion as RatingQuestion)
                                      .ratingOptions || [];
                                  const newOption = {
                                    value: uuidv4(),
                                    label: 'Opsi Baru',
                                  };
                                  patchActive({
                                    ratingOptions: [
                                      ...currentOptions,
                                      newOption,
                                    ],
                                  });
                                }}
                              >
                                <Plus className='h-4 w-4 mr-1' />
                                Tambah Opsi
                              </Button>
                            </div>
                            <div className='space-y-2'>
                              {(
                                (activeQuestion as RatingQuestion)
                                  .ratingOptions || []
                              ).map((opt, i) => (
                                <div
                                  key={opt.value}
                                  className='flex items-center space-x-2'
                                >
                                  <Input
                                    value={opt.label}
                                    onChange={(e) => {
                                      const currentOptions =
                                        (activeQuestion as RatingQuestion)
                                          .ratingOptions || [];
                                      const newOptions = [...currentOptions];
                                      newOptions[i] = {
                                        ...opt,
                                        label: e.target.value,
                                      };
                                      patchActive({ratingOptions: newOptions});
                                    }}
                                  />
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => {
                                      const currentOptions =
                                        (activeQuestion as RatingQuestion)
                                          .ratingOptions || [];
                                      const newOptions = currentOptions.filter(
                                        (_, idx) => idx !== i
                                      );
                                      patchActive({ratingOptions: newOptions});
                                    }}
                                  >
                                    <Trash2 className='h-4 w-4 text-destructive' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ResizablePanel>
            )}
          </ResizableCard>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SurveyBuilder;
