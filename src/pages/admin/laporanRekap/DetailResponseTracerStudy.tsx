/** @format */

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Calendar,
  XCircle,
  Download,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import {AdminLayout} from '@/components/layout/admin';
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
import {useTracerStudyResponseDetail, type QuestionResponse} from '@/api/response.api';

// Extended type for rating questions with children
type RatingQuestionResponse = QuestionResponse & {
  children?: Array<{
    id: string;
    questionText: string;
    isAnswered: boolean;
    answer: string | null;
  }>;
  answerOptions?: Array<{
    id: string;
    optionText: string;
    isSelected?: boolean;
  }>;
};

const DetailResponseTracerStudy: React.FC = () => {
  const navigate = useNavigate();
  const {id: responseId} = useParams<{id: string}>();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // API hook
  const {
    data: response,
    isLoading: loading,
    error,
  } = useTracerStudyResponseDetail(responseId || '');

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return 'Pilihan Tunggal';
      case 'MULTIPLE_CHOICE':
        return 'Pilihan Ganda';
      case 'MATRIX_SINGLE_CHOICE':
        return 'Rating/Matrix';
      case 'ESSAY':
        return 'Esai';
      case 'LONG_TEST':
        return 'Teks Panjang';
      case 'COMBO_BOX':
        return 'Combo Box';
      case 'TEXT':
        return 'Teks';
      case 'SCALE':
        return 'Skala';
      case 'DATE':
        return 'Tanggal';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const getGraduatePeriodeLabel = (periode: string) => {
    switch (periode) {
      case 'WISUDA_I':
        return 'Wisuda I';
      case 'WISUDA_II':
        return 'Wisuda II';
      case 'WISUDA_III':
        return 'Wisuda III';
      case 'WISUDA_IV':
        return 'Wisuda IV';
      case 'WISUDA_V':
        return 'Wisuda V';
      case 'WISUDA_VI':
        return 'Wisuda VI';
      default:
        return periode;
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info('Fitur export sedang dalam pengembangan');
  };

  const getFilteredResponses = () => {
    if (!response) return [];

    let filtered = response.responses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (q.answer &&
            q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by question type
    if (filterType !== 'all') {
      filtered = filtered.filter((q) => q.questionType === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((q) =>
        filterStatus === 'answered' ? q.isAnswered : !q.isAnswered
      );
    }

    return filtered;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Memuat data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !response) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <XCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>
              {error ? 'Terjadi Kesalahan' : 'Data tidak ditemukan'}
            </h3>
            <p className='text-muted-foreground mb-4'>
              {error
                ? 'Gagal memuat detail response. Silakan coba lagi.'
                : 'Response dengan ID tersebut tidak ditemukan.'}
            </p>
            <Button onClick={() => navigate('/admin/reports/tracer-study')}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Kembali ke Rekap
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='p-6'>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/reports/tracer-study'>
                Rekap Tracer Study
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail Response</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate('/admin/reports/tracer-study')}
              className='hover:bg-gray-50'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Kembali
            </Button>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                Detail Response Tracer Study
              </h1>
              <p className='text-sm text-gray-500'>
                Detail soal dan jawaban dari{' '}
                <span className='font-medium text-gray-700'>
                  {response.fullName}
                </span>
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {response.submittedAt && (
              <Badge
                variant='outline'
                className='px-2 py-1 text-xs'
              >
                <Calendar className='h-3 w-3 mr-1' />
                {new Date(response.submittedAt).toLocaleDateString('id-ID')}
              </Badge>
            )}
            <Button
              onClick={handleExport}
              size='sm'
            >
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
          </div>
        </div>

        {/* Alumni Info */}
        <div className='bg-white border border-gray-200 rounded-lg mb-6'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Informasi Alumni
              </h2>
              <div className='text-right'>
                <div className='text-lg font-semibold text-gray-900'>
                  {response.completionPercentage}%
                </div>
                <div className='text-xs text-gray-500'>Kelengkapan</div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='p-3 border border-gray-200 rounded-lg'>
                <div className='text-sm text-gray-600 mb-1'>Nama Lengkap</div>
                <p className='font-medium text-gray-900'>{response.fullName}</p>
              </div>

              <div className='p-3 border border-gray-200 rounded-lg'>
                <div className='text-sm text-gray-600 mb-1'>Email</div>
                <p className='font-medium text-gray-900'>{response.email}</p>
              </div>

              <div className='p-3 border border-gray-200 rounded-lg'>
                <div className='text-sm text-gray-600 mb-1'>NIM</div>
                <p className='font-medium text-gray-900'>{response.nim}</p>
              </div>

              <div className='p-3 border border-gray-200 rounded-lg'>
                <div className='text-sm text-gray-600 mb-1'>
                  Fakultas/Jurusan
                </div>
                <div>
                  <p className='font-medium text-gray-900'>
                    {response.major.majorName}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {response.major.faculty.facultyName}
                  </p>
                </div>
              </div>

              <div className='p-3 border border-gray-200 rounded-lg'>
                <div className='text-sm text-gray-600 mb-1'>Tahun Lulus</div>
                <div>
                  <p className='font-medium text-gray-900'>
                    {response.graduatedYear}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {getGraduatePeriodeLabel(response.graduatePeriode)}
                  </p>
                </div>
              </div>

              <div className='p-3 border border-gray-200 rounded-lg'>
                <div className='text-sm text-gray-600 mb-1'>Progress</div>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1 bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full ${
                        response.completionPercentage === 100
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{width: `${response.completionPercentage}%`}}
                    ></div>
                  </div>
                  <span className='text-xs font-medium text-gray-600'>
                    {response.answeredQuestions}/{response.totalQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className='bg-white border border-gray-200 rounded-lg mb-6'>
          <div className='p-4'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Cari pertanyaan atau jawaban...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Button
                variant='outline'
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center gap-2'
              >
                <Filter className='h-4 w-4' />
                Filter
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              <div className='text-sm text-gray-600'>
                {getFilteredResponses().length} dari {response.responses.length}{' '}
                pertanyaan
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className='pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-medium text-gray-900'>Filter</h3>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={clearFilters}
                  >
                    Reset Filter
                  </Button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-sm text-gray-600'>
                      Tipe Pertanyaan
                    </Label>
                    <Select
                      value={filterType}
                      onValueChange={setFilterType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Semua Tipe' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Semua Tipe</SelectItem>
                        <SelectItem value='SINGLE_CHOICE'>
                          Pilihan Tunggal
                        </SelectItem>
                        <SelectItem value='MULTIPLE_CHOICE'>
                          Pilihan Ganda
                        </SelectItem>
                        <SelectItem value='TEXT'>Teks</SelectItem>
                        <SelectItem value='SCALE'>Skala</SelectItem>
                        <SelectItem value='DATE'>Tanggal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className='text-sm text-gray-600'>
                      Status Jawaban
                    </Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Semua Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Semua Status</SelectItem>
                        <SelectItem value='answered'>Sudah Dijawab</SelectItem>
                        <SelectItem value='unanswered'>
                          Belum Dijawab
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Responses */}
        <div className='bg-white border border-gray-200 rounded-lg'>
          <div className='p-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Respons Pertanyaan
            </h2>
          </div>
          <div className='p-4'>
            <div className='space-y-4'>
              {getFilteredResponses().map((questionResponse) => (
                <div
                  key={questionResponse.questionId}
                  className='border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center space-x-3'>
                      <div className='h-6 w-6 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-medium text-sm'>
                        {questionResponse.sortOrder}
                      </div>
                      <div className='flex items-center space-x-2'>
                        {questionResponse.isRequired && (
                          <span className='text-red-500 text-xs'>*</span>
                        )}
                        <Badge
                          variant={
                            questionResponse.isAnswered ? 'default' : 'outline'
                          }
                          className={`text-xs ${
                            questionResponse.isAnswered
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {questionResponse.isAnswered
                            ? 'Terjawab'
                            : 'Belum Dijawab'}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant='outline'
                      className='text-xs'
                    >
                      {getQuestionTypeLabel(questionResponse.questionType)}
                    </Badge>
                  </div>

                  <h4 className='font-medium text-gray-900 mb-3'>
                    {questionResponse.questionText}
                  </h4>

                  {/* For rating questions, show as rating table */}
                  {questionResponse.questionType === 'MATRIX_SINGLE_CHOICE' && 
                   (() => {
                     const ratingQuestion = questionResponse as RatingQuestionResponse
                     return ratingQuestion.children && 
                       Array.isArray(ratingQuestion.children) && 
                       ratingQuestion.children.length > 0
                   })() ? (
                    <div className='overflow-x-auto'>
                      <table className='w-full border-collapse rounded-lg overflow-hidden border border-gray-200'>
                        <thead>
                          <tr className='border-b border-gray-200 bg-gray-100'>
                            <th className='text-left py-3 px-4 font-normal text-gray-900 bg-gray-100 rounded-tl-lg min-w-[200px] w-1/3'>
                              Uraian
                            </th>
                            {(() => {
                              const ratingQuestion = questionResponse as RatingQuestionResponse
                              const answerOptions = ratingQuestion.answerOptions
                              
                              if (answerOptions && Array.isArray(answerOptions) && answerOptions.length > 0) {
                                return answerOptions.map((option, index) => (
                                  <th
                                    key={option.id}
                                    className={`text-center py-3 px-2 font-normal text-gray-900 bg-gray-100 min-w-[80px] ${
                                      index === answerOptions.length - 1 ? 'rounded-tr-lg' : ''
                                    }`}
                                  >
                                    {option.optionText}
                                  </th>
                                ))
                              }
                              
                              // Fallback default options
                              return (
                                <>
                                  <th className='text-center py-3 px-2 font-normal text-gray-900 bg-gray-100 min-w-[80px]'>Sangat Tinggi</th>
                                  <th className='text-center py-3 px-2 font-normal text-gray-900 bg-gray-100 min-w-[80px]'>Tinggi</th>
                                  <th className='text-center py-3 px-2 font-normal text-gray-900 bg-gray-100 min-w-[80px]'>Cukup</th>
                                  <th className='text-center py-3 px-2 font-normal text-gray-900 bg-gray-100 min-w-[80px]'>Rendah</th>
                                  <th className='text-center py-3 px-2 font-normal text-gray-900 bg-gray-100 min-w-[80px] rounded-tr-lg'>Sangat Rendah</th>
                                </>
                              )
                            })()}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const ratingQuestion = questionResponse as RatingQuestionResponse
                            const children = ratingQuestion.children || []
                            
                            // Get rating options from answerOptions or use default
                            const ratingOptions = ratingQuestion.answerOptions && 
                              Array.isArray(ratingQuestion.answerOptions) &&
                              ratingQuestion.answerOptions.length > 0
                              ? ratingQuestion.answerOptions
                              : [
                                  { id: '1', optionText: 'Sangat Tinggi' },
                                  { id: '2', optionText: 'Tinggi' },
                                  { id: '3', optionText: 'Cukup' },
                                  { id: '4', optionText: 'Rendah' },
                                  { id: '5', optionText: 'Sangat Rendah' }
                                ]
                            
                            return children.map((child, index) => {
                              const isLastRow = index === children.length - 1
                              
                              // Find which option matches the child's answer
                              // The answer is the optionText from answerOptionQuestion
                              const selectedOption = child.isAnswered && child.answer
                                ? ratingOptions.find(opt => 
                                    opt.optionText === child.answer || 
                                    opt.id === child.answer ||
                                    (opt.optionText && child.answer && child.answer.includes(opt.optionText))
                                  )
                                : null
                              
                              return (
                                <tr
                                  key={child.id}
                                  className={`border-b border-gray-200 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  }`}
                                >
                                  <td className={`py-3 px-4 text-sm text-gray-900 ${
                                    isLastRow ? 'rounded-bl-lg' : ''
                                  }`}>
                                    {child.questionText}
                                  </td>
                                  {ratingOptions.map((option, optionIndex) => {
                                    // Check if this option is the selected one
                                    const isSelected = selectedOption && (
                                      selectedOption.id === option.id ||
                                      selectedOption.optionText === option.optionText
                                    )
                                    
                                    return (
                                      <td
                                        key={option.id || optionIndex}
                                        className={`py-3 px-2 text-center ${
                                          isLastRow && optionIndex === ratingOptions.length - 1 ? 'rounded-br-lg' : ''
                                        }`}
                                      >
                                        <div className='flex justify-center'>
                                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                            isSelected
                                              ? 'border-primary bg-primary'
                                              : 'border-gray-300 bg-white'
                                          }`}>
                                            {isSelected && (
                                              <div className='h-2 w-2 rounded-full bg-white' />
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                    )
                                  })}
                                </tr>
                              )
                            })
                          })()}
                        </tbody>
                      </table>
                    </div>
                  ) : questionResponse.isAnswered ? (
                    <div className='bg-gray-50 p-3 rounded border'>
                      <div className='text-sm text-gray-600 mb-1'>Jawaban:</div>
                      <p className='text-gray-900 font-medium'>
                        {questionResponse.answer}
                      </p>
                    </div>
                  ) : (
                    <div className='text-gray-400 italic'>
                      Tidak ada jawaban
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailResponseTracerStudy;
