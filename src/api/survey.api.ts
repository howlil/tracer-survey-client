/** @format */

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export interface Survey {
  id: string;
  name: string;
  type?: 'TRACER_STUDY' | 'USER_SURVEY'; // Derived from targetRole (ALUMNI = TRACER_STUDY, MANAGER = USER_SURVEY)
  description?: string; // Optional for list view
  targetRole?: 'ALUMNI' | 'MANAGER';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'CLOSED';
  documentUrl?: string;
  createdAt?: string; // Optional for list view
  updatedAt?: string; // Optional for list view
  questionCount?: number;
  responseCount?: number;
  surveyRulesCount?: number; // From backend as surveyRulesCount
  greetingOpening?: GreetingOpening;
  greatingOpening?: GreetingOpening; // Legacy typo support
  greetingClosing?: GreetingClosing;
  surveyRules?: SurveyRule[];
}

export interface GreetingOpening {
  title: string;
  greeting: {
    islamic: string;
    general: string;
  };
  addressee: string;
  introduction: string;
  ikuList: {
    title: string;
    items: string[];
  };
  purpose: string;
  expectation: string;
  signOff: {
    department: string;
    university: string;
  };
}

export interface GreetingClosing {
  title: string;
  greeting: {
    islamic: string;
    general: string;
  };
  addressee: string;
  introduction: string;
  expectation: string;
  signOff: {
    department: string;
    university: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface SurveyRule {
  id: string;
  surveyId: string;
  degree: 'S1' | 'PASCA' | 'PROFESI' | 'VOKASI';
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  surveyId: string;
  codeId: string;
  parentId?: string | null;
  groupQuestionId: string;
  questionText: string;
  questionType:
    | 'ESSAY'
    | 'LONG_TEST'
    | 'SINGLE_CHOICE'
    | 'MULTIPLE_CHOICE'
    | 'MATRIX_SINGLE_CHOICE'
    | 'COMBO_BOX';
  isRequired: boolean;
  sortOrder: number;
  placeholder?: string;
  searchplaceholder?: string;
  version?: string;
  questionCode?: string;
  pageNumber?: number; // Nomor halaman untuk struktur data yang lebih terstruktur
  createdAt: string;
  updatedAt: string;
  answerQuestion?: AnswerOption[];
  questionTree?: QuestionTree[];
}

export interface AnswerOption {
  id?: string;
  answerText: string;
  sortOrder: number;
  otherOptionPlaceholder?: string;
  isTriggered?: boolean;
}

export interface ExtendedQuestion extends Question {
  questionTree?: QuestionTree[];
}

export interface QuestionTree {
  answerQuestionTriggerId: string;
  questionPointerToId: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  surveys: T[];
  meta: PaginationMeta;
}

export interface CreateSurveyData {
  name: string;
  type: 'TRACER_STUDY' | 'USER_SURVEY';
  description: string;
}

export interface UpdateSurveyData {
  name?: string;
  targetRole?: 'ALUMNI' | 'MANAGER';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'CLOSED';
  description?: string;
  documentUrl?: string;
  greetingOpening?: GreetingOpening;
  greatingOpening?: GreetingOpening; // Legacy typo support
  greetingClosing?: GreetingClosing;
}

export interface CreateSurveyRuleData {
  degree: 'S1' | 'PASCA' | 'PROFESI' | 'VOKASI';
}

export interface CreateCodeQuestionData {
  code: string;
  questions: Omit<
    Question,
    'id' | 'surveyId' | 'codeId' | 'createdAt' | 'updatedAt'
  >[];
}

export interface SaveBuilderData {
  pages?: {
    id: string;
    title: string;
    description?: string;
    codeIds: string[];
  }[];
  questions: (Omit<Question, 'surveyId' | 'createdAt' | 'updatedAt'> & {
    codeId: string;
  })[];
}

const getSurveysApi = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  targetRole?: string;
  public?: boolean; // If true, use public endpoint (no auth required)
}): Promise<PaginatedResponse<Survey>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status && !params.public) queryParams.append('status', params.status); // Public endpoint always uses PUBLISHED
  if (params.targetRole) queryParams.append('targetRole', params.targetRole);

  // Use public endpoint if public flag is true
  const endpoint = params.public ? '/v1/public/surveys' : '/v1/surveys';
  const response = await axiosInstance.get(
    `${endpoint}?${queryParams.toString()}`
  );
  const data = response.data.data;
  
  // Map targetRole to type for frontend compatibility
  if (data.surveys) {
    data.surveys = data.surveys.map((survey: Survey) => ({
      ...survey,
      type: survey.targetRole === 'ALUMNI' ? 'TRACER_STUDY' : 'USER_SURVEY',
    }));
  }
  
  return data;
};

const getSurveyByIdApi = async (id: string, isPublic = false): Promise<Survey> => {
  const endpoint = isPublic ? `/v1/public/surveys/${id}` : `/v1/surveys/${id}`;
  const response = await axiosInstance.get(endpoint);
  const data = response.data.data;
  
  // Map targetRole to type for frontend compatibility
  return {
    ...data,
    type: data.targetRole === 'ALUMNI' ? 'TRACER_STUDY' : 'USER_SURVEY',
  };
};

const createSurveyApi = async (data: CreateSurveyData): Promise<Survey> => {
  const response = await axiosInstance.post('/v1/surveys', data);
  return response.data.data;
};

const updateSurveyApi = async (
  id: string,
  data: UpdateSurveyData
): Promise<Survey> => {
  const response = await axiosInstance.patch(`/v1/surveys/${id}`, data);
  return response.data.data;
};

const deleteSurveyApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/v1/surveys/${id}`);
};

const getSurveyRulesApi = async (surveyId: string): Promise<SurveyRule[]> => {
  const response = await axiosInstance.get(`/v1/surveys/${surveyId}/rules`);
  return response.data.data;
};

const createSurveyRuleApi = async (
  surveyId: string,
  data: CreateSurveyRuleData
): Promise<SurveyRule> => {
  const response = await axiosInstance.post(
    `/v1/surveys/${surveyId}/rules`,
    data
  );
  return response.data.data;
};

const updateSurveyRuleApi = async (
  surveyId: string,
  ruleId: string,
  data: Partial<CreateSurveyRuleData>
): Promise<SurveyRule> => {
  const response = await axiosInstance.patch(
    `/v1/surveys/${surveyId}/rules/${ruleId}`,
    data
  );
  return response.data.data;
};

const deleteSurveyRuleApi = async (
  surveyId: string,
  ruleId: string
): Promise<void> => {
  await axiosInstance.delete(`/v1/surveys/${surveyId}/rules/${ruleId}`);
};

export interface SurveyPage {
  page: number;
  title: string;
  description?: string;
  codeId?: string;
  questionIds: string[];
}

export interface SurveyQuestionsResponse {
  questions: Question[];
  pages: SurveyPage[];
}

const getSurveyQuestionsApi = async (
  surveyId: string,
  codeId?: string,
  isPublic = false
): Promise<SurveyQuestionsResponse> => {
  const params = codeId ? `?codeId=${codeId}` : '';
  const endpoint = isPublic 
    ? `/v1/public/surveys/${surveyId}/questions${params}`
    : `/v1/surveys/${surveyId}/questions${params}`;
  const response = await axiosInstance.get(endpoint);

  const responseData = response.data.data;

  // Backend returns { codeQuestions: [...], pages: [...], questions: [...] }
  // Use questions array from backend (already flattened with parents + children, no duplicates)
  if (responseData?.questions && Array.isArray(responseData.questions)) {
    // Backend already provides flattened questions array with all data
    // Just ensure required fields are present
    const questions: Question[] = responseData.questions.map((q: Question & {children?: unknown}) => {
      // Remove children field if exists (it's just metadata for parent questions)
      const {children, ...questionWithoutChildren} = q;
      void children; // Explicitly ignore children field
      
      return {
        ...questionWithoutChildren,
        // Ensure all required fields are present
        surveyId: questionWithoutChildren.surveyId || surveyId,
        createdAt: questionWithoutChildren.createdAt || new Date().toISOString(),
        updatedAt: questionWithoutChildren.updatedAt || new Date().toISOString(),
      };
    });

    // Sort by sortOrder to maintain order
    const sorted = questions.sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    // Use pages from backend if available
    const pages: SurveyPage[] = responseData.pages && Array.isArray(responseData.pages) && responseData.pages.length > 0
      ? responseData.pages
      : [];

    return {
      questions: sorted,
      pages: pages
    };
  }

  // Fallback: if backend doesn't provide questions array, build from codeQuestions
  if (responseData?.codeQuestions) {
    const allQuestions: Question[] = [];
    const questionIdsSet = new Set<string>(); // Track IDs to avoid duplicates

    for (const codeQ of responseData.codeQuestions) {
      if (codeQ.questions && Array.isArray(codeQ.questions)) {
        for (const q of codeQ.questions) {
          // Skip if already added (avoid duplicates)
          if (questionIdsSet.has(q.id)) {
            continue;
          }
          questionIdsSet.add(q.id);
          
          // Remove children field if exists
          const {children, ...questionWithoutChildren} = q;
          void children;
          
          allQuestions.push({
            ...questionWithoutChildren,
            questionCode: codeQ.code,
            surveyId: questionWithoutChildren.surveyId || surveyId,
            codeId: questionWithoutChildren.codeId || codeQ.code,
            version: questionWithoutChildren.version,
            createdAt: questionWithoutChildren.createdAt || new Date().toISOString(),
            updatedAt: questionWithoutChildren.updatedAt || new Date().toISOString(),
          });
        }
      }
    }

    const sorted = allQuestions.sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    const pages: SurveyPage[] = responseData.pages && Array.isArray(responseData.pages) && responseData.pages.length > 0
      ? responseData.pages
      : [];

    return {
      questions: sorted,
      pages: pages
    };
  }

  // Fallback: return as is if already array
  const questions = responseData?.questions || responseData || [];
  return {
    questions: Array.isArray(questions) ? questions : [],
    pages: []
  };
};

const createCodeQuestionApi = async (
  surveyId: string,
  data: CreateCodeQuestionData
): Promise<Question[]> => {
  const response = await axiosInstance.post(
    `/v1/surveys/${surveyId}/code-questions`,
    data
  );
  return response.data.data;
};

const updateQuestionApi = async (
  surveyId: string,
  questionId: string,
  data: Partial<Omit<Question, 'id' | 'surveyId' | 'createdAt' | 'updatedAt'>>
): Promise<Question> => {
  const response = await axiosInstance.patch(
    `/v1/surveys/${surveyId}/questions/${questionId}`,
    data
  );
  return response.data.data;
};

const deleteQuestionApi = async (
  surveyId: string,
  questionId: string
): Promise<void> => {
  await axiosInstance.delete(`/v1/surveys/${surveyId}/questions/${questionId}`);
};

const deleteCodeQuestionApi = async (
  surveyId: string,
  codeId: string
): Promise<void> => {
  // Encode codeId to handle special characters
  const encodedCodeId = encodeURIComponent(codeId);
  await axiosInstance.delete(
    `/v1/surveys/${surveyId}/code-questions/${encodedCodeId}`
  );
};

const reorderQuestionsApi = async (
  surveyId: string,
  questionOrders: {questionId: string; sortOrder: number}[]
): Promise<void> => {
  await axiosInstance.patch(`/v1/surveys/${surveyId}/questions/reorder`, {
    questionOrders,
  });
};

const saveBuilderApi = async (
  surveyId: string,
  data: SaveBuilderData
): Promise<{questions: Question[]}> => {
  const response = await axiosInstance.post(
    `/v1/surveys/${surveyId}/builder/save`,
    data
  );
  return response.data.data;
};

export const useSurveys = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  targetRole?: string;
  public?: boolean; // If true, use public endpoint (no auth required)
}) => {
  return useQuery<PaginatedResponse<Survey>, Error>({
    queryKey: ['surveys', params],
    queryFn: () => getSurveysApi(params),
  });
};

export const useSurvey = (id: string, isPublic = false) => {
  return useQuery<Survey, Error>({
    queryKey: ['survey', id, isPublic],
    queryFn: () => getSurveyByIdApi(id, isPublic),
    enabled: !!id,
  });
};

export const useCreateSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation<Survey, Error, CreateSurveyData>({
    mutationFn: createSurveyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['surveys']});
    },
  });
};

export const useUpdateSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation<Survey, Error, {id: string; data: UpdateSurveyData}>({
    mutationFn: ({id, data}) => updateSurveyApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['surveys']});
      queryClient.invalidateQueries({queryKey: ['survey', variables.id]});
    },
  });
};

export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSurveyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['surveys']});
    },
  });
};

export const useSurveyRules = (surveyId: string) => {
  return useQuery<SurveyRule[], Error>({
    queryKey: ['surveyRules', surveyId],
    queryFn: () => getSurveyRulesApi(surveyId),
    enabled: !!surveyId,
  });
};

export const useCreateSurveyRule = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SurveyRule,
    Error,
    {surveyId: string; data: CreateSurveyRuleData}
  >({
    mutationFn: ({surveyId, data}) => createSurveyRuleApi(surveyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyRules', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
    },
  });
};

export const useUpdateSurveyRule = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SurveyRule,
    Error,
    {surveyId: string; ruleId: string; data: Partial<CreateSurveyRuleData>}
  >({
    mutationFn: ({surveyId, ruleId, data}) =>
      updateSurveyRuleApi(surveyId, ruleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyRules', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
    },
  });
};

export const useDeleteSurveyRule = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, {surveyId: string; ruleId: string}>({
    mutationFn: ({surveyId, ruleId}) => deleteSurveyRuleApi(surveyId, ruleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyRules', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
    },
  });
};

export const useSurveyQuestions = (surveyId: string, codeId?: string, isPublic = false) => {
  return useQuery<SurveyQuestionsResponse, Error>({
    queryKey: ['surveyQuestions', surveyId, codeId, isPublic],
    queryFn: () => getSurveyQuestionsApi(surveyId, codeId, isPublic),
    enabled: !!surveyId,
  });
};

export const useCreateCodeQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Question[],
    Error,
    {surveyId: string; data: CreateCodeQuestionData}
  >({
    mutationFn: ({surveyId, data}) => createCodeQuestionApi(surveyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Question,
    Error,
    {
      surveyId: string;
      questionId: string;
      data: Partial<
        Omit<Question, 'id' | 'surveyId' | 'createdAt' | 'updatedAt'>
      >;
    }
  >({
    mutationFn: ({surveyId, questionId, data}) =>
      updateQuestionApi(surveyId, questionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, {surveyId: string; questionId: string}>({
    mutationFn: ({surveyId, questionId}) =>
      deleteQuestionApi(surveyId, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
      queryClient.invalidateQueries({queryKey: ['surveys']});
    },
  });
};

export const useDeleteCodeQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, {surveyId: string; codeId: string}>({
    mutationFn: ({surveyId, codeId}) => deleteCodeQuestionApi(surveyId, codeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
      queryClient.invalidateQueries({queryKey: ['surveys']});
    },
  });
};

export const useReorderQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      surveyId: string;
      questionOrders: {questionId: string; sortOrder: number}[];
    }
  >({
    mutationFn: ({surveyId, questionOrders}) =>
      reorderQuestionsApi(surveyId, questionOrders),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', variables.surveyId],
      });
    },
  });
};

export const useSaveBuilder = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {questions: Question[]},
    Error,
    {surveyId: string; data: SaveBuilderData}
  >({
    mutationFn: ({surveyId, data}) => saveBuilderApi(surveyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['surveyQuestions', variables.surveyId],
      });
      queryClient.invalidateQueries({queryKey: ['survey', variables.surveyId]});
    },
  });
};
