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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  Edit,
  FileText,
  GitBranch,
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
import {useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {
  useSaveBuilder,
  useSurveyQuestions,
  useDeleteQuestion,
  useDeleteCodeQuestion,
  useReorderQuestions,
  type Question as APIQuestion,
} from '@/api/survey.api';
import {v4 as uuidv4} from 'uuid';
import {
  getDetailedErrorMessage,
  getAllErrorMessages,
  logError,
} from '@/utils/error-handler';

// Error handling types are now in error-handler utility

type ExtendedQuestion = Question & {
  questionCode?: string;
  version?: string;
  parentId?: string | null;
  groupQuestionId?: string;
  placeholder?: string;
  searchplaceholder?: string;
  pageNumber?: number; // Nomor halaman untuk struktur data yang lebih terstruktur
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
  const {mutateAsync: deleteQuestion} = useDeleteQuestion();
  const {mutateAsync: deleteCodeQuestion} = useDeleteCodeQuestion();
  const queryClient = useQueryClient();

  // Handle delete question with API sync
  const handleDeleteQuestion = async (questionId: string) => {
    if (!surveyId) {
      // If no surveyId, just remove from state (new survey)
      removeQuestionVersion(questionId);
      return;
    }

    try {
      // Delete from API first
      await deleteQuestion({surveyId, questionId});

      // Reset hasLoadedQuestions flag to reload data from API
      setHasLoadedQuestions(false);

      // Invalidate and refetch queries to refresh data from API
      await queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', surveyId],
      });

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: ['surveyQuestions', surveyId],
      });

      toast.success('Pertanyaan berhasil dihapus');
    } catch (error) {
      logError(error, 'handleDeleteQuestion');
      const errorMessage = getDetailedErrorMessage(
        error,
        'Gagal menghapus pertanyaan'
      );
      toast.error(errorMessage);
    }
  };
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
  const loadQuestionsFromAPI = useBuilderStore(
    (state) => state.loadQuestionsFromAPI
  );
  const addChildQuestion = useBuilderStore((state) => state.addChildQuestion);
  const removeQuestion = useBuilderStore((state) => state.removeQuestion);
  const resetBuilder = useBuilderStore((state) => state.resetBuilder);

  // Handle delete group question (delete all questions with same questionCode)
  const handleDeleteGroupQuestion = async (codeId: string) => {
    if (!surveyId) {
      // If no surveyId, just remove from state (new survey)
      const questionsToDelete = questions.filter(
        (q) => (q as ExtendedQuestion).questionCode === codeId
      );
      questionsToDelete.forEach((q) => removeQuestion(q.id));
      toast.success('Group pertanyaan berhasil dihapus');
      return;
    }

    try {
      // Use the new deleteCodeQuestion endpoint which handles all related deletions
      await deleteCodeQuestion({surveyId, codeId});

      // Reset hasLoadedQuestions flag to reload data from API
      setHasLoadedQuestions(false);

      // Invalidate and refetch queries to refresh data from API
      await queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', surveyId],
      });

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: ['surveyQuestions', surveyId],
      });

      toast.success('Group pertanyaan berhasil dihapus');
    } catch (error) {
      logError(error, 'handleDeleteGroupQuestion');
      const errorMessage = getDetailedErrorMessage(
        error,
        'Gagal menghapus group pertanyaan'
      );
      toast.error(errorMessage);
    }
  };
  const currentQuestionIds = pages[currentPageIndex]?.questionIds || [];
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const [versionComboOpen, setVersionComboOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [createChildDialogOpen, setCreateChildDialogOpen] =
    React.useState(false);
  const [selectedOptionForChild, setSelectedOptionForChild] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [childQuestionType, setChildQuestionType] =
    React.useState<Question['type']>('text');
  const [collapsedQuestions, setCollapsedQuestions] = React.useState<
    Set<string>
  >(new Set());

  const surveyType = searchParams.get('type') as
    | 'TRACER_STUDY'
    | 'USER_SURVEY'
    | null;
  const surveyId = searchParams.get('id');
  const isEditMode = searchParams.get('edit') === 'true';

  // API Hooks
  const saveBuilderMutation = useSaveBuilder();
  const {data: surveyQuestionsData, isLoading: isLoadingQuestions} =
    useSurveyQuestions(surveyId || '');
  const {mutateAsync: reorderQuestions} = useReorderQuestions();
  
  // Extract questions array and pages from response (new structure: { questions, pages })
  const apiQuestions = surveyQuestionsData?.questions || [];
  const apiPages = surveyQuestionsData?.pages || [];

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
              if (!tree.questionPointerToId) {
                return null;
              }

              // Find the option by value
              const option = singleQ.options?.find(
                (opt) => opt.value === tree.answerQuestionTriggerId
              );
              if (!option) {
                return null;
              }

              // Find the answer option by answerText and sortOrder
              const answerOption = answerOptions.find(
                (ao, idx) =>
                  ao.answerText === option.label && ao.sortOrder === idx
              );
              if (!answerOption) {
                return null;
              }

              // Verify that child question exists
              const childQuestionExists = questions.some((cq) => cq.id === tree.questionPointerToId);
              if (!childQuestionExists) {
                return null;
              }

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

        const transformed = {
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

        return transformed;
      });

      // Filter pages yang tidak memiliki questions (group question kosong)
      const filteredPages = updatedPages
        .map((page, idx) => {
          // Get codeIds from questions in this page
          const codeIds = page.questionIds
            .map((qid) => {
              const q = questions.find((qq) => qq.id === qid) as
                | ExtendedQuestion
                | undefined;
              return q?.questionCode;
            })
            .filter((codeId): codeId is string => !!codeId);

          // Only include page if it has at least one codeId
          if (codeIds.length === 0) return null;

          return {
            id: page.id,
            title: page.title || `Halaman ${idx + 1}`,
            description: page.description || '',
            codeIds,
          };
        })
        .filter((page): page is NonNullable<typeof page> => page !== null);

      // Filter questions yang belong to non-empty groups (codeIds that exist in filteredPages)
      const validCodeIds = new Set(
        filteredPages.flatMap((page) => page.codeIds)
      );
      
      // IMPORTANT: Include ALL questions (parent + child) even if their codeId is not in filteredPages
      // Child questions should be included because they are part of parent questions
      const filteredQuestions = transformedQuestions.filter((q) => {
        // Include if codeId is in validCodeIds (parent questions)
        if (validCodeIds.has(q.codeId)) {
          return true;
        }
        // Include child questions (they have parentId) even if codeId not in filteredPages
        // because they are part of parent questions
        if (q.parentId) {
          // Check if parent question is in validCodeIds
          const parentQuestion = transformedQuestions.find(
            (pq) => pq.id === q.parentId && validCodeIds.has(pq.codeId)
          );
          if (parentQuestion) {
            return true;
          }
        }
        return false;
      });

      await saveBuilderMutation.mutateAsync({
        surveyId,
        data: {
          pages: filteredPages,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          questions: filteredQuestions as any,
        },
      });

      // Reset hasLoadedQuestions flag to reload data from API
      setHasLoadedQuestions(false);

      // Invalidate queries to refresh data from API
      await queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', surveyId],
      });

      // Wait for refetch to complete
      await queryClient.refetchQueries({
        queryKey: ['surveyQuestions', surveyId],
      });

      toast.success('Survey berhasil disimpan');

      // Only redirect if not in edit mode (if surveyId exists, it's edit mode)
      if (!surveyId) {
        navigate('/admin/survey');
      }
    } catch (error) {
      logError(error, 'handleSave');
      const errorMessages = getAllErrorMessages(
        error,
        'Gagal menyimpan survey'
      );

      if (errorMessages.length === 1) {
        toast.error(errorMessages[0]);
      } else {
        // Show multiple errors sequentially
        errorMessages.forEach((msg, index) => {
          setTimeout(() => {
            toast.error(msg);
          }, index * 500);
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Transform API Question type to Builder Question type
  const mapAPIQuestionTypeToBuilder = (apiType: string): Question['type'] => {
    const mapping: Record<string, Question['type']> = {
      ESSAY: 'text',
      LONG_TEST: 'textarea',
      SINGLE_CHOICE: 'single',
      MULTIPLE_CHOICE: 'multiple',
      COMBO_BOX: 'combobox',
      MATRIX_SINGLE_CHOICE: 'rating',
    };
    return mapping[apiType] || 'text';
  };

  // Transform API Question to Builder Question
  const transformAPIQuestionToBuilder = (
    apiQ: APIQuestion
  ): ExtendedQuestion & {
    order: number;
    status: 'saved';
    questionCode?: string;
  } => {
    const builderType = mapAPIQuestionTypeToBuilder(apiQ.questionType);
    const baseQuestion: Partial<Question> = {
      id: apiQ.id,
      type: builderType,
      label: apiQ.questionText,
      required: apiQ.isRequired,
    };

    // Transform answer options based on question type
    if (builderType === 'single' || builderType === 'multiple') {
      const options = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || uuidv4(),
        label: opt.answerText,
        isOther: opt.otherOptionPlaceholder ? true : false,
      }));
      (baseQuestion as SingleChoiceQuestion | MultipleChoiceQuestion).options =
        options;
      (baseQuestion as SingleChoiceQuestion | MultipleChoiceQuestion).layout =
        'vertical';
      if (
        (apiQ.answerQuestion || []).some((opt) => opt.otherOptionPlaceholder)
      ) {
        const otherOption = (apiQ.answerQuestion || []).find(
          (opt) => opt.otherOptionPlaceholder
        );
        if (otherOption) {
          (
            baseQuestion as SingleChoiceQuestion | MultipleChoiceQuestion
          ).otherInputPlaceholder = otherOption.otherOptionPlaceholder || '';
        }
      }
    } else if (builderType === 'combobox') {
      // For combobox, all answer options become dropdown options in a single combobox item
      const options = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || uuidv4(),
        label: opt.answerText,
      }));
      const items = [
        {
          id: apiQ.id || uuidv4(),
          label: apiQ.questionText || 'Item 1',
          placeholder: apiQ.placeholder || 'Pilih...',
          searchPlaceholder: apiQ.searchplaceholder || 'Cari...',
          required: apiQ.isRequired || false,
          options: options,
        },
      ];
      (baseQuestion as ComboBoxQuestion).comboboxItems = items;
      (baseQuestion as ComboBoxQuestion).layout = 'vertical';
    } else if (builderType === 'rating') {
      // For rating, extract rating options from answerQuestion
      const ratingOptions = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || uuidv4(),
        label: opt.answerText,
      }));
      (baseQuestion as RatingQuestion).ratingOptions = ratingOptions;

      // Rating items will be populated from children questions later in useEffect
      // For now, create a placeholder
      (baseQuestion as RatingQuestion).ratingItems = [
        {id: uuidv4(), label: apiQ.questionText},
      ];
    } else if (builderType === 'text' || builderType === 'textarea') {
      (baseQuestion as TextQuestion | TextAreaQuestion).placeholder =
        apiQ.placeholder || '';
    }

    return {
      ...(baseQuestion as Question),
      order: apiQ.sortOrder || 0,
      status: 'saved' as const,
      questionCode: apiQ.codeId || apiQ.questionCode,
      version: apiQ.version || '2024',
      parentId: apiQ.parentId || null,
      groupQuestionId: apiQ.groupQuestionId || apiQ.id,
      placeholder: apiQ.placeholder || '',
      searchplaceholder: apiQ.searchplaceholder || '',
      pageNumber: (apiQ as APIQuestion & {pageNumber?: number}).pageNumber, // Include pageNumber from API
      questionTree: apiQ.questionTree?.map((tree) => ({
        answerQuestionTriggerId: tree.answerQuestionTriggerId,
        questionPointerToId: tree.questionPointerToId,
      })),
    } as ExtendedQuestion & {
      order: number;
      status: 'saved';
      questionCode?: string;
      pageNumber?: number;
    };
  };

  // Load questions from API when surveyId exists and questions are loaded
  const [hasLoadedQuestions, setHasLoadedQuestions] = React.useState(false);

  React.useEffect(() => {
    // Reset state and flag when surveyId changes
    if (surveyId) {
      resetBuilder(); // Clear all local state
      setHasLoadedQuestions(false); // Allow reload from API
    }
  }, [surveyId, resetBuilder]);

  React.useEffect(() => {
    // Always load from API, don't check local storage
    if (!surveyId || isLoadingQuestions || hasLoadedQuestions) {
      return;
    }

    // Check if we have questions array
    if (!Array.isArray(apiQuestions) || apiQuestions.length === 0) {
      // If no questions from API, reset store to empty
      loadQuestionsFromAPI(
        [],
        [{id: uuidv4(), title: 'Halaman 1', description: '', questionIds: []}]
      );
      setHasLoadedQuestions(true);
      return;
    }

    try {
      // Separate parent and child questions
      const parentQuestions = apiQuestions.filter((q) => !q.parentId);
      const childQuestions = apiQuestions.filter((q) => q.parentId);

      // Transform parent questions first
      const transformedParents = parentQuestions
        .map((apiQ) => transformAPIQuestionToBuilder(apiQ))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // Update parent rating questions with children as ratingItems FIRST
      // This needs to happen before transforming children
      transformedParents.forEach((parentQ) => {
        if (parentQ.type === 'rating') {
          const ratingQ = parentQ as RatingQuestion;
          const parentApiQ = parentQuestions.find((q) => q.id === parentQ.id);

          // Get all children that belong to this rating parent
          const ratingItemChildren = childQuestions
            .filter(
              (c) =>
                c.parentId === parentQ.id && c.questionType === 'SINGLE_CHOICE'
            )
            .map((c) => ({
              id: c.id,
              label: c.questionText,
            }));

          if (ratingItemChildren.length > 0) {
            ratingQ.ratingItems = ratingItemChildren;
          }

          // Get rating options from parent's answerQuestion
          if (
            parentApiQ?.answerQuestion &&
            parentApiQ.answerQuestion.length > 0
          ) {
            ratingQ.ratingOptions = parentApiQ.answerQuestion.map((opt) => ({
              value: opt.id || uuidv4(),
              label: opt.answerText,
            }));
          }
        }
      });

      // Transform ALL child questions (including rating items)
      // They will be displayed in builder, but rating items are also part of parent rating question
      const transformedChildren = childQuestions
        .map((apiQ) => transformAPIQuestionToBuilder(apiQ))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // Combine all questions - include ALL children questions
      // Rating items are both part of parent rating question AND displayed as separate questions
      // This allows users to see and edit all questions in the builder
      const allQuestions = [...transformedParents, ...transformedChildren];

      // Sort all questions by sortOrder to maintain proper order
      allQuestions.sort((a, b) => (a.order || 0) - (b.order || 0));

      // Group questions by pageNumber (from backend) for structured data
      // Setiap pertanyaan sudah memiliki pageNumber dari backend
      const questionsByPage = allQuestions.reduce((acc, q) => {
        // Extract pageNumber from transformed question (already includes pageNumber from API)
        const pageNumber = (q as ExtendedQuestion)?.pageNumber || 1;
        
        if (!acc[pageNumber]) {
          acc[pageNumber] = [];
        }
        acc[pageNumber].push(q);
        return acc;
      }, {} as Record<number, typeof allQuestions>);

      // Create pages from pageNumber groups
      const pageNumbers = Object.keys(questionsByPage)
        .map(Number)
        .sort((a, b) => a - b);
      
      let newPages: Array<{id: string; title: string; description: string; questionIds: string[]}>;
      
      if (apiPages && apiPages.length > 0) {
        // Use pages from backend, but ensure questionIds match pageNumber grouping
        newPages = apiPages.map((page) => {
          // Get questions for this page number
          const pageQuestions = questionsByPage[page.page] || [];
          const questionIds = pageQuestions
            .filter(q => !(q as ExtendedQuestion).parentId) // Only parent questions
          .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((q) => q.id);
          
          return {
            id: uuidv4(), // Generate new UUID for frontend
            title: page.title || `Halaman ${page.page}`,
            description: page.description || `Pertanyaan ${page.codeId || ''}`,
            questionIds: questionIds.length > 0 ? questionIds : (page.questionIds || []),
          };
        });
      } else {
        // Fallback: Create pages from pageNumber groups
        newPages = pageNumbers.map((pageNum) => {
          const pageQuestions = questionsByPage[pageNum] || [];
          const questionIds = pageQuestions
            .filter(q => !(q as ExtendedQuestion).parentId) // Only parent questions
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((q) => q.id);
          
          return {
            id: uuidv4(),
            title: `Halaman ${pageNum}`,
            description: `Halaman ${pageNum}`,
            questionIds: questionIds,
          };
        });
      }

      // Load questions and pages into store
      loadQuestionsFromAPI(allQuestions, newPages);
      setHasLoadedQuestions(true);

      if (allQuestions.length > 0) {
        setActiveQuestion(allQuestions[0].id);
      }
    } catch (error) {
      logError(error, 'loadQuestionsFromAPI');
      const errorMessage = getDetailedErrorMessage(
        error,
        'Gagal memuat pertanyaan dari server'
      );
      toast.error(errorMessage);
      setHasLoadedQuestions(true); // Set to true even on error to prevent infinite retry
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId, surveyQuestionsData, isLoadingQuestions, hasLoadedQuestions]);

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
        (opt, idx): AnswerOption => {
          // The value in options should be the answerOptionQuestion ID if it exists
          // UUIDs are typically 36 chars, so check if value looks like a UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const answerOptionId = opt.value && uuidRegex.test(opt.value) ? opt.value : undefined;
          
          return {
            id: answerOptionId, // Include ID if available (from existing options)
            answerText: opt.label,
            sortOrder: idx,
            otherOptionPlaceholder: (question as SingleChoiceQuestion | MultipleChoiceQuestion).otherInputPlaceholder || '',
            isTriggered: false,
          };
        }
      );
    }
    if (question.type === 'combobox') {
      const items = (question as ComboBoxQuestion).comboboxItems || [];
      return items.flatMap((item, itemIdx) =>
        (item.options || []).map(
          (opt, optIdx): AnswerOption => {
            // The value in options should be the answerOptionQuestion ID if it exists
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const answerOptionId = opt.value && uuidRegex.test(opt.value) ? opt.value : undefined;
            
            return {
              id: answerOptionId, // Include ID if available
              answerText: opt.label,
              sortOrder: itemIdx * 100 + optIdx,
              otherOptionPlaceholder: '',
              isTriggered: false,
            };
          }
        )
      );
    }
    if (question.type === 'rating') {
      const options = (question as RatingQuestion).ratingOptions || [];
      return options.map(
        (opt, idx): AnswerOption => {
          // The value in options should be the answerOptionQuestion ID if it exists
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const answerOptionId = opt.value && uuidRegex.test(opt.value) ? opt.value : undefined;
          
          return {
            id: answerOptionId, // Include ID if available
            answerText: opt.label,
            sortOrder: idx,
            otherOptionPlaceholder: '',
            isTriggered: false,
          };
        }
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
        <div className='mb-8 relative'>
          {/* Breadcrumb */}
          <Breadcrumb className='mb-4'>
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
        <div className='h-[calc(100%-7rem)]'>
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
                <Card className='h-full flex flex-col'>
                  <CardHeader className='p-3 shrink-0'>
                    <CardTitle className='text-md'>Jenis Soal</CardTitle>
                  </CardHeader>
                  <CardContent className='flex-1 overflow-y-auto space-y-3 p-4'>
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
              <Card className='h-full flex flex-col'>
                <CardHeader className='p-3 shrink-0'>
                  <div className='flex items-center justify-between gap-4'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => prevPage()}
                      aria-label='Sebelumnya'
                      disabled={currentPageIndex === 0}
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
                    <div className='flex items-center gap-2'>
                      {isEditMode && (
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => {
                            // Add new page/group
                            const newCodeId = `Q${pages.length + 1}`;
                            const newPage = {
                              id: uuidv4(),
                              title: `Halaman ${pages.length + 1}`,
                              description: `Pertanyaan ${newCodeId}`,
                              questionIds: [],
                            };
                            updatePages([...pages, newPage]);
                            nextPage();
                            toast.success(
                              'Grup soal baru berhasil ditambahkan'
                            );
                          }}
                          aria-label='Tambah grup soal'
                          title='Tambah grup soal baru'
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      )}
                      {isEditMode && currentQuestionIds.length > 0 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size='icon'
                              variant='destructive'
                              aria-label='Hapus group pertanyaan'
                              title='Hapus semua pertanyaan di halaman ini'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Hapus Group Pertanyaan?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Semua
                                pertanyaan dengan code{' '}
                                <strong>
                                  {pages[currentPageIndex]?.description ||
                                    `Halaman ${currentPageIndex + 1}`}
                                </strong>{' '}
                                akan dihapus.
                              </AlertDialogDescription>
                              <div className='space-y-2 mt-4'>
                                <div className='bg-muted p-3 rounded-md'>
                                  <div className='text-sm font-medium'>
                                    Detail group pertanyaan yang akan dihapus:
                                  </div>
                                  <div className='text-sm space-y-1 mt-1'>
                                    <div>
                                      <span className='font-medium'>Code:</span>{' '}
                                      {(() => {
                                        const firstQ = questions.find((q) =>
                                          currentQuestionIds.includes(q.id)
                                        );
                                        return (
                                          (firstQ as ExtendedQuestion)
                                            ?.questionCode || '-'
                                        );
                                      })()}
                                    </div>
                                    <div>
                                      <span className='font-medium'>
                                        Jumlah pertanyaan:
                                      </span>{' '}
                                      {currentQuestionIds.length}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  const firstQ = questions.find((q) =>
                                    currentQuestionIds.includes(q.id)
                                  );
                                  if (firstQ) {
                                    const codeId = (firstQ as ExtendedQuestion)
                                      ?.questionCode;
                                    if (codeId) {
                                      handleDeleteGroupQuestion(codeId);
                                    }
                                  }
                                }}
                              >
                                Hapus Group
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button
                        size='icon'
                        onClick={() => nextPage()}
                        aria-label='Berikutnya'
                        disabled={currentPageIndex >= pages.length - 1}
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='flex-1 overflow-y-auto space-y-4 p-4'>
                  {/* Render hanya pertanyaan di halaman aktif dengan hierarchy */}
                  {(() => {
                    // Filter: hanya tampilkan questions yang sudah disimpan (status: 'saved')
                    // Kecuali saat edit mode, tampilkan semua untuk bisa diedit
                    const displayQuestions = isEditMode
                      ? questions
                      : questions.filter((q) => {
                          const builderQ = q as Question & {
                            status?: 'new' | 'edited' | 'saved';
                          };
                          return builderQ.status === 'saved';
                        });

                    if (displayQuestions.length === 0) {
                      return (
                        <div className='text-sm text-muted-foreground'>
                          Belum ada soal untuk dipreview.
                        </div>
                      );
                    }

                    // Filter currentQuestionIds untuk hanya include questions yang ada di displayQuestions
                    const displayQuestionIds = currentQuestionIds.filter(
                      (qid) => displayQuestions.some((q) => q.id === qid)
                    );

                    // Helper function to get child questions from questionTree
                    // Returns unique child question IDs (no duplicates even if multiple QuestionTree entries point to same question)
                    const getChildQuestions = (parentId: string): string[] => {
                      const parentQ = displayQuestions.find(
                        (q) => q.id === parentId
                      );
                      if (!parentQ) return [];
                      const extQ = parentQ as ExtendedQuestion;
                      const questionTree = extQ.questionTree || [];
                      const childIds = questionTree
                        .map((tree) => tree.questionPointerToId)
                        .filter(Boolean)
                        .filter((childId) =>
                          displayQuestions.some((q) => q.id === childId)
                        );
                      // Remove duplicates using Set
                      return Array.from(new Set(childIds));
                    };

                    // Get all question IDs that appear as questionPointerToId in any QuestionTree
                    // These are conditional questions that should only appear through QuestionTree
                    const conditionalQuestionIds = new Set<string>();
                    displayQuestions.forEach((q) => {
                      const extQ = q as ExtendedQuestion;
                      const questionTree = extQ.questionTree || [];
                      questionTree.forEach((tree) => {
                        if (tree.questionPointerToId) {
                          conditionalQuestionIds.add(tree.questionPointerToId);
                        }
                      });
                    });

                    // Separate parent and child questions - remove duplicates
                    // Only render parent questions that are NOT children of other questions
                    // AND are NOT conditional questions (only appear through QuestionTree)
                    // Remove duplicates by using Set and filter by parentId
                    const seenIds = new Set<string>();
                    const parentQuestionIds = displayQuestionIds.filter(
                      (qid, index, self) => {
                        // Remove duplicates - if we've seen this ID before, skip it
                        if (seenIds.has(qid)) return false;
                        seenIds.add(qid);

                        // Also check if it's a duplicate in the array itself
                        if (self.indexOf(qid) !== index) return false;

                        const q = displayQuestions.find((qq) => qq.id === qid);
                        if (!q) return false;

                        const extQ = q as ExtendedQuestion;
                        
                        // Exclude if it's a child question (parentId is not null/undefined)
                        if (extQ.parentId) return false;
                        
                        // Exclude if it's a conditional question (only appears through QuestionTree)
                        // Conditional questions should only appear when their trigger condition is met
                        // They should not appear in the regular question list
                        if (conditionalQuestionIds.has(qid)) {
                          // This question only appears through QuestionTree, exclude it from regular list
                          return false;
                        }
                        
                        return true;
                      }
                    );

                    // Render question with hierarchy
                    const renderQuestion = (
                      qid: string,
                      idx: number,
                      level: number = 0,
                      parentId?: string
                    ) => {
                      const q = displayQuestions.find((qq) => qq.id === qid);
                      if (!q) return null;

                      const questionCode = `Q${idx + 1}`;
                      const isChild = !!parentId;
                      const childQuestionIds = getChildQuestions(qid);
                      const hasChildren = childQuestionIds.length > 0;
                      const isCollapsed = collapsedQuestions.has(qid);
                      const isActive = activeQuestionId === q.id;

                      const common = {
                        label: q.label,
                        required: q.required,
                        disabled: false,
                      };

                      // Filter out non-DOM props before passing to components
                      const getCleanProps = (question: Question) => {
                        const {
                          questionCode: _,
                          version: __,
                          ...cleanProps
                        } = question as Question & {
                          questionCode?: string;
                          version?: string;
                        };
                        void _; // Mark as intentionally unused
                        void __; // Mark as intentionally unused
                        return cleanProps;
                      };

                      const renderQuestionContent = () => {
                        switch (q.type) {
                          case 'text': {
                            const textQuestion = q as TextQuestion;
                            const textProps = getCleanProps(textQuestion);
                            return (
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
                            const textareaProps =
                              getCleanProps(textareaQuestion);
                            return (
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
                            return (
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
                            const multipleQuestion =
                              q as MultipleChoiceQuestion;
                            const multipleProps =
                              getCleanProps(multipleQuestion);
                            return (
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
                            return (
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
                            return (
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
                      };

                      return (
                        <React.Fragment key={qid}>
                          <div className='flex items-start gap-3'>
                            {/* Indentation and vertical line for child questions */}
                            {isChild && (
                              <div
                                className='relative flex flex-col items-center'
                                style={{width: '28px', minHeight: '40px'}}
                              >
                                {/* Vertical line */}
                                <div className='absolute left-1/2 top-0 bottom-0 w-px bg-border' />
                                {/* Horizontal line */}
                                <div
                                  className='absolute left-1/2 top-5 w-3 h-px bg-border'
                                  style={{transform: 'translateX(-100%)'}}
                                />
                              </div>
                            )}

                            {/* Question number */}
                            <div
                              className={`mt-2 w-7 h-7 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                                isActive
                                  ? 'border-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {idx + 1}
                            </div>

                            {/* Question card */}
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
                              } ${isChild ? 'ml-0' : ''}`}
                              onClick={() =>
                                isEditMode && setActiveQuestion(q.id)
                              }
                              draggable={isEditMode}
                              onDragStart={() =>
                                isEditMode && setDragIndex(idx)
                              }
                              onDragOver={(e) => {
                                if (isEditMode) {
                                  e.preventDefault();
                                  setOverIndex(idx);
                                }
                              }}
                              onDrop={async () => {
                                if (
                                  isEditMode &&
                                  dragIndex !== null &&
                                  dragIndex !== idx
                                ) {
                                  // Update local state first
                                  reorderCurrentPageQuestions({
                                    from: dragIndex,
                                    to: idx,
                                  });

                                  // Auto-save reorder to API if surveyId exists
                                  if (surveyId) {
                                    try {
                                      const page = pages[currentPageIndex];
                                      if (page) {
                                        // Get all questions in current page after reorder
                                        const pageQuestions = page.questionIds
                                          .map((qid) =>
                                            questions.find((q) => q.id === qid)
                                          )
                                          .filter(
                                            (
                                              q
                                            ): q is NonNullable<
                                              (typeof questions)[0]
                                            > => q !== undefined
                                          );

                                        // Create questionOrders with global sortOrder
                                        // Find the minimum sortOrder from all questions to maintain relative order
                                        const allQuestionsSorted = [
                                          ...questions,
                                        ].sort((a, b) => {
                                          const aOrder =
                                            (a as Question & {order?: number})
                                              .order || 0;
                                          const bOrder =
                                            (b as Question & {order?: number})
                                              .order || 0;
                                          return aOrder - bOrder;
                                        });

                                        // Get the first question's order in current page as base
                                        const firstPageQuestion =
                                          pageQuestions[0];
                                        const baseOrder = firstPageQuestion
                                          ? allQuestionsSorted.findIndex(
                                              (q) =>
                                                q.id === firstPageQuestion.id
                                            )
                                          : 0;

                                        // Create questionOrders with updated sortOrder
                                        const questionOrders =
                                          pageQuestions.map((q, orderIdx) => ({
                                            questionId: q.id,
                                            sortOrder: baseOrder + orderIdx,
                                          }));

                                        await reorderQuestions({
                                          surveyId,
                                          questionOrders,
                                        });
                                        // Invalidate queries to refresh data
                                        await queryClient.invalidateQueries({
                                          queryKey: [
                                            'surveyQuestions',
                                            surveyId,
                                          ],
                                        });
                                      }
                                    } catch (error) {
                                      logError(error, 'reorderQuestions');
                                      const errorMessage =
                                        getDetailedErrorMessage(
                                          error,
                                          'Gagal menyimpan urutan pertanyaan'
                                        );
                                      toast.error(errorMessage);
                                    }
                                  }
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
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <X className='h-4 w-4' />
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Hapus versi pertanyaan?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan.
                                        Hanya versi pertanyaan yang dipilih akan
                                        dihapus.
                                      </AlertDialogDescription>
                                      <div className='space-y-2 mt-4'>
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
                                                q as Question & {
                                                  version?: string;
                                                }
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
                                      </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Batal
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteQuestion(q.id)
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
                                  {/* Collapse/Expand button */}
                                  {hasChildren && (
                                    <button
                                      className='pointer-events-auto -ml-1 text-muted-foreground hover:text-foreground'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCollapsedQuestions((prev) => {
                                          const newSet = new Set(prev);
                                          if (newSet.has(qid)) {
                                            newSet.delete(qid);
                                          } else {
                                            newSet.add(qid);
                                          }
                                          return newSet;
                                        });
                                      }}
                                    >
                                      {isCollapsed ? (
                                        <ChevronRight className='h-4 w-4' />
                                      ) : (
                                        <ChevronDown className='h-4 w-4' />
                                      )}
                                    </button>
                                  )}

                                  {isChild && !hasChildren && (
                                    <div className='w-4' />
                                  )}

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
                                  {isChild && (
                                    <span className='text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1'>
                                      <GitBranch className='h-3 w-3' />
                                      Kondisional
                                    </span>
                                  )}
                                </div>
                                {renderQuestionContent()}
                              </div>
                            </div>
                          </div>

                          {/* Render child questions */}
                          {hasChildren && !isCollapsed && (
                            <div className='ml-12 space-y-2 border-l-2 border-border pl-4'>
                              {childQuestionIds.map((childQid, childIdx) => {
                                const childQ = displayQuestions.find(
                                  (qq) => qq.id === childQid
                                );
                                if (!childQ) return null;
                                const childIndexInPage =
                                  displayQuestionIds.indexOf(childQid);
                                return renderQuestion(
                                  childQid,
                                  childIndexInPage >= 0
                                    ? childIndexInPage
                                    : idx + childIdx + 1,
                                  level + 1,
                                  qid
                                );
                              })}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    };

                    return parentQuestionIds.map((qid, idx) => {
                      const q = displayQuestions.find((qq) => qq.id === qid);
                      if (!q) return null;
                      const originalIndex = displayQuestionIds.indexOf(qid);
                      return renderQuestion(
                        qid,
                        originalIndex >= 0 ? originalIndex : idx,
                        0
                      );
                    });
                  })()}
                </CardContent>
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
                <Card className='h-full flex flex-col'>
                  <CardHeader className='p-3 shrink-0'>
                    <CardTitle className='text-md'>Detail per Soal</CardTitle>
                  </CardHeader>
                  <CardContent className='flex-1 overflow-y-auto space-y-4 p-4'>
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
                              ).map((opt, i: number) => {
                                const extQ = activeQuestion as ExtendedQuestion;
                                const currentQuestionTree =
                                  extQ.questionTree || [];
                                const hasChildQuestion =
                                  currentQuestionTree.some(
                                    (tree) =>
                                      tree.answerQuestionTriggerId === opt.value
                                  );
                                return (
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
                                      className='flex-1'
                                    />
                                    {activeQuestion.type === 'single' && (
                                      <Button
                                        size='icon'
                                        variant={
                                          hasChildQuestion
                                            ? 'default'
                                            : 'outline'
                                        }
                                        onClick={() => {
                                          if (hasChildQuestion) {
                                            // Show child question if exists
                                            const treeForOption =
                                              currentQuestionTree.find(
                                                (tree) =>
                                                  tree.answerQuestionTriggerId ===
                                                  opt.value
                                              );
                                            if (
                                              treeForOption?.questionPointerToId
                                            ) {
                                              const childQ = questions.find(
                                                (q) =>
                                                  q.id ===
                                                  treeForOption.questionPointerToId
                                              );
                                              if (childQ) {
                                                // Check if child question is saved (only navigate if saved or in edit mode)
                                                const builderQ =
                                                  childQ as Question & {
                                                    status?:
                                                      | 'new'
                                                      | 'edited'
                                                      | 'saved';
                                                  };
                                                if (
                                                  isEditMode ||
                                                  builderQ.status === 'saved'
                                                ) {
                                                  setActiveQuestion(childQ.id);
                                                }
                                              }
                                            }
                                          } else {
                                            // Open dialog to select question type
                                            setSelectedOptionForChild(opt);
                                            setChildQuestionType('text');
                                            setCreateChildDialogOpen(true);
                                          }
                                        }}
                                        title={
                                          hasChildQuestion
                                            ? 'Edit pertanyaan lanjutan'
                                            : 'Buat pertanyaan lanjutan'
                                        }
                                      >
                                        <GitBranch
                                          className={`h-4 w-4 ${
                                            hasChildQuestion
                                              ? 'text-white'
                                              : 'text-primary'
                                          }`}
                                        />
                                      </Button>
                                    )}
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

                                        // Remove question tree if exists
                                        if (activeQuestion.type === 'single') {
                                          const extQ =
                                            activeQuestion as ExtendedQuestion;
                                          const newTree = (
                                            extQ.questionTree || []
                                          ).filter(
                                            (t) =>
                                              t.answerQuestionTriggerId !==
                                              opt.value
                                          );
                                          patchActive({
                                            questionTree: newTree,
                                          } as Partial<ExtendedQuestion>);
                                        }
                                      }}
                                    >
                                      <Trash2 className='h-4 w-4 text-destructive' />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {activeQuestion.type === 'single' && (
                          <div className='space-y-3 border-t pt-4'>
                            <div className='flex items-center gap-2'>
                              <GitBranch className='h-4 w-4 text-primary' />
                              <label className='text-sm font-medium'>
                                Question Tree (Pertanyaan Kondisional)
                              </label>
                            </div>
                            <p className='text-xs text-muted-foreground'>
                              Klik icon branch di opsi jawaban untuk membuat
                              pertanyaan lanjutan. Pertanyaan yang dibuat bisa
                              memiliki jenis dan opsi jawaban sendiri
                              (recursive).
                            </p>
                            {/* Show existing child questions */}
                            {(() => {
                              const extQ = activeQuestion as ExtendedQuestion;
                              const currentQuestionTree =
                                extQ.questionTree || [];
                              if (currentQuestionTree.length === 0) {
                                return (
                                  <div className='text-sm text-muted-foreground py-4 text-center border rounded-md'>
                                    Belum ada pertanyaan kondisional. Klik icon
                                    branch di opsi jawaban untuk membuat.
                                  </div>
                                );
                              }
                              return (
                                <div className='space-y-2'>
                                  {currentQuestionTree.map((tree) => {
                                    const childQ = questions.find(
                                      (q) => q.id === tree.questionPointerToId
                                    );
                                    const triggerOpt = (
                                      (activeQuestion as SingleChoiceQuestion)
                                        .options || []
                                    ).find(
                                      (opt) =>
                                        opt.value ===
                                        tree.answerQuestionTriggerId
                                    );
                                    if (!childQ || !triggerOpt) return null;
                                    return (
                                      <div
                                        key={tree.answerQuestionTriggerId}
                                        className='p-3 border rounded-md bg-muted/30 space-y-2'
                                      >
                                        <div className='flex items-center justify-between'>
                                          <div className='flex items-center gap-2'>
                                            <GitBranch className='h-4 w-4 text-primary' />
                                            <span className='text-sm font-medium'>
                                              Jika memilih:{' '}
                                              <strong>
                                                {triggerOpt.label}
                                              </strong>
                                            </span>
                                          </div>
                                          <Button
                                            size='sm'
                                            variant='ghost'
                                            onClick={() =>
                                              setActiveQuestion(childQ.id)
                                            }
                                          >
                                            <Edit className='h-3 w-3 mr-1' />
                                            Edit
                                          </Button>
                                        </div>
                                        <div className='pl-6 space-y-1'>
                                          <div className='text-sm text-muted-foreground'>
                                            Pertanyaan:{' '}
                                            <strong>{childQ.label}</strong>
                                          </div>
                                          <div className='text-xs text-muted-foreground'>
                                            Tipe: {childQ.type}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
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
                                  <div className='space-y-2 pt-2 border-t'>
                                    <div className='flex items-center justify-between'>
                                      <label className='text-xs font-medium text-muted-foreground'>
                                        Opsi Dropdown
                                      </label>
                                      <Button
                                        size='sm'
                                        variant='ghost'
                                        className='h-7 text-xs'
                                        onClick={() => {
                                          const currentItems =
                                            (activeQuestion as ComboBoxQuestion)
                                              .comboboxItems || [];
                                          const newItems = [...currentItems];
                                          const currentOptions = newItems[i].options || [];
                                          newItems[i] = {
                                            ...item,
                                            options: [
                                              ...currentOptions,
                                              {
                                                value: uuidv4(),
                                                label: 'Opsi Baru',
                                              },
                                            ],
                                          };
                                          patchActive({comboboxItems: newItems});
                                        }}
                                      >
                                        <Plus className='h-3 w-3 mr-1' />
                                        Tambah Opsi
                                      </Button>
                                    </div>
                                    <div className='space-y-1 max-h-[200px] overflow-y-auto'>
                                      {(item.options || []).map((option, optIdx) => (
                                        <div
                                          key={option.value}
                                          className='flex items-center gap-2 p-2 bg-muted/50 rounded border'
                                        >
                                          <Input
                                            value={option.label}
                                            onChange={(e) => {
                                              const currentItems =
                                                (activeQuestion as ComboBoxQuestion)
                                                  .comboboxItems || [];
                                              const newItems = [...currentItems];
                                              const updatedOptions = [...(newItems[i].options || [])];
                                              updatedOptions[optIdx] = {
                                                ...option,
                                                label: e.target.value,
                                              };
                                              newItems[i] = {
                                                ...item,
                                                options: updatedOptions,
                                              };
                                              patchActive({comboboxItems: newItems});
                                            }}
                                            placeholder='Nama opsi'
                                            className='h-8 text-xs'
                                          />
                                          <Button
                                            size='icon'
                                            variant='ghost'
                                            className='h-7 w-7'
                                            onClick={() => {
                                              const currentItems =
                                                (activeQuestion as ComboBoxQuestion)
                                                  .comboboxItems || [];
                                              const newItems = [...currentItems];
                                              const updatedOptions = (newItems[i].options || []).filter(
                                                (_, idx) => idx !== optIdx
                                              );
                                              newItems[i] = {
                                                ...item,
                                                options: updatedOptions,
                                              };
                                              patchActive({comboboxItems: newItems});
                                            }}
                                          >
                                            <Trash2 className='h-3 w-3 text-destructive' />
                                          </Button>
                                </div>
                              ))}
                                      {(!item.options || item.options.length === 0) && (
                                        <div className='text-xs text-muted-foreground text-center py-2'>
                                          Belum ada opsi. Klik "Tambah Opsi" untuk menambahkan.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {activeQuestion.type === 'rating' && (
                          <div className='space-y-4 border-t pt-4'>
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
                            <div className='space-y-2 max-h-[300px] overflow-y-auto pr-2'>
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
                                    className='flex-1'
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
                            <div className='flex items-center justify-between border-t pt-4'>
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
                            <div className='space-y-2 max-h-[200px] overflow-y-auto pr-2'>
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
                                    className='flex-1'
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

        {/* Dialog untuk memilih jenis question saat membuat child question */}
        <AlertDialog
          open={createChildDialogOpen}
          onOpenChange={setCreateChildDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Buat Pertanyaan Lanjutan</AlertDialogTitle>
              <AlertDialogDescription>
                Pilih jenis pertanyaan untuk opsi:{' '}
                <strong>{selectedOptionForChild?.label}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Jenis Pertanyaan</label>
                <select
                  value={childQuestionType}
                  onChange={(e) =>
                    setChildQuestionType(e.target.value as Question['type'])
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='text'>Text (Input Teks)</option>
                  <option value='textarea'>Textarea (Input Panjang)</option>
                  <option value='single'>
                    Single Choice (Pilihan Tunggal)
                  </option>
                  <option value='multiple'>
                    Multiple Choice (Pilihan Ganda)
                  </option>
                  <option value='combobox'>ComboBox (Dropdown)</option>
                  <option value='rating'>Rating (Penilaian)</option>
                </select>
              </div>
              <div className='text-xs text-muted-foreground'>
                Pertanyaan lanjutan akan muncul ketika opsi "
                {selectedOptionForChild?.label}" dipilih. Anda bisa mengedit
                pertanyaan setelah dibuat.
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setCreateChildDialogOpen(false);
                  setSelectedOptionForChild(null);
                }}
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!selectedOptionForChild || !activeQuestion) {
                    return;
                  }

                  const childQId = uuidv4();
                  const parentExtQ = activeQuestion as ExtendedQuestion;

                  // Create child question
                  addChildQuestion(activeQuestion.id, {
                    id: childQId,
                    type: childQuestionType,
                    label: 'Pertanyaan lanjutan',
                    required: false,
                    ...(parentExtQ.questionCode && {
                      questionCode: parentExtQ.questionCode,
                    }),
                    ...(parentExtQ.groupQuestionId && {
                      groupQuestionId: parentExtQ.groupQuestionId,
                    }),
                  } as Partial<Question> & {type: Question['type']; parentId?: string; groupQuestionId?: string; questionCode?: string});

                  // Update parent question tree
                  const extQ = activeQuestion as ExtendedQuestion;
                  const newTree = [
                    ...(extQ.questionTree || []),
                    {
                      answerQuestionTriggerId: selectedOptionForChild.value,
                      questionPointerToId: childQId,
                    },
                  ];
                  patchActive({
                    questionTree: newTree,
                  } as Partial<ExtendedQuestion>);

                  setActiveQuestion(childQId);
                  setCreateChildDialogOpen(false);
                  setSelectedOptionForChild(null);
                  toast.success('Pertanyaan lanjutan berhasil dibuat');
                }}
              >
                Buat Pertanyaan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

export default SurveyBuilder;
