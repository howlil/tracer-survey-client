import { SoalComboBox } from "@/components/kuisioner/soal/SoalComboBox"
import { SoalMultiChoice } from "@/components/kuisioner/soal/SoalMultiChoice"
import { SoalRating } from "@/components/kuisioner/soal/SoalRating"
import { SoalSingleChoice } from "@/components/kuisioner/soal/SoalSingleChoice"
import { SoalTeks } from "@/components/kuisioner/soal/SoalTeks"
import { SoalTeksArea } from "@/components/kuisioner/soal/SoalTeksArea"
import { AdminLayout } from "@/components/layout/admin"
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
} from "@/components/ui/alert-dialog"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ResizableCard, ResizableContent, ResizablePanel } from "@/components/ui/resizable-card"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addQuestion, nextPage, prevPage, removeQuestion, reorderCurrentPageQuestions, setActiveQuestion, setPageMeta, updateQuestion } from "@/store/slices/builderSlice"
import type { Question } from "@/types/survey"
import { CheckSquare, ChevronLeft, ChevronRight, Circle, FileText, ListFilter, Package, Plus, Star, Trash2, Type, X } from "lucide-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"

function PaketSoalTracerStudy() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { questions, activeQuestionId } = useAppSelector(state => state.builder)
  const currentQuestionIds = useAppSelector(s=>s.builder.pages[s.builder.currentPageIndex]?.questionIds || [])
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const [overIndex, setOverIndex] = React.useState<number | null>(null)
  const activeQuestion = questions.find(q => q.id === activeQuestionId)

  const handleAdd = (type: Question["type"]) => {
    dispatch(addQuestion(type))
  }

  // const handleSelect = (id: string) => dispatch(setActiveQuestion(id))
  // const handleRemove = (id: string) => dispatch(removeQuestion(id))
  const patchActive = (patch: Partial<Question>) => {
    if (!activeQuestion) return
    dispatch(updateQuestion({ id: activeQuestion.id, patch }))
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-4rem)] p-6">
        {/* Header */}
        <div className="mb-6 relative">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => navigate("/admin/packages")}
                  className="flex items-center space-x-1 cursor-pointer hover:text-primary"
                >
                  <Package className="h-4 w-4" />
                  <span>Manajemen Paket Soal</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tracer Study</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title - Centered */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-xl font-bold text-foreground">Kelola Paket Soal Tracer Study</h1>
          </div>
        </div>

        {/* Resizable Card Container */}
        <div className="h-[calc(100%-5rem)]">
          <ResizableCard className="gap-4">
            {/* Panel Kiri - Jenis Soal */}
            <ResizablePanel
              defaultWidth={220}
              minWidth={220}
              maxWidth={220}
              resizable="right"
            >
              <Card className="h-full">
                <CardHeader className="p-3">
                  <CardTitle className="text-md">Jenis Soal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="justify-start" onClick={()=>handleAdd('text')}>
                      <Type className="h-4 w-4 mr-2" /> Teks Pendek
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={()=>handleAdd('textarea')}>
                      <FileText className="h-4 w-4 mr-2" /> Teks Panjang
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={()=>handleAdd('single')}>
                      <Circle className="h-4 w-4 mr-2" /> Single Choice
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={()=>handleAdd('multiple')}>
                      <CheckSquare className="h-4 w-4 mr-2" /> Multiple Choice
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={()=>handleAdd('combobox')}>
                      <ListFilter className="h-4 w-4 mr-2" /> Combo Box
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={()=>handleAdd('rating')}>
                      <Star className="h-4 w-4 mr-2" /> Rating
                    </Button>
                  </div>
                  {/* Tidak ada daftar soal di panel kiri sesuai permintaan */}
                </CardContent>
              </Card>
            </ResizablePanel>

            {/* Panel Tengah - Preview Form */}
            <ResizableContent>
              <Card className="h-full">
                <div className="h-full flex flex-col">
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between gap-4">
                      <Button variant="outline" size="icon" onClick={()=>dispatch(prevPage())} aria-label="Sebelumnya">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-center flex-1 px-16">
                        <Input value={useAppSelector(s=>s.builder.pages[s.builder.currentPageIndex]?.title)||""} onChange={(e)=>dispatch(setPageMeta({ title: e.target.value }))} className="text-center font-semibold" />
                        <Input value={useAppSelector(s=>s.builder.pages[s.builder.currentPageIndex]?.description)||""} onChange={(e)=>dispatch(setPageMeta({ description: e.target.value }))} className="mt-2 text-center" />
                      </div>
                      <Button size="icon" onClick={()=>dispatch(nextPage())} aria-label="Berikutnya">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto space-y-4">
                  {questions.length === 0 && (
                    <div className="text-sm text-muted-foreground">Belum ada soal untuk dipreview.</div>
                  )}
                  {/* Render hanya pertanyaan di halaman aktif */}
                  {currentQuestionIds.map((qid, idx) => {
                    const q = questions.find(qq=>qq.id===qid)
                    if(!q) return null
                    const common = { label: q.label, required: q.required, disabled: false }
                    const isActive = activeQuestionId === q.id
                    const Wrap = (children: React.ReactNode) => (
                      <div key={q.id} className="flex items-start gap-3">
                        <div className={`mt-2 w-7 h-7 rounded-full border flex items-center justify-center text-xs ${isActive ? 'border-primary text-primary' : 'text-muted-foreground'}`}>{idx + 1}</div>
                        <div
                          className={`relative p-3 rounded-md border cursor-pointer flex-1 ${isActive ? 'border-primary' : ''} ${dragIndex===idx ? 'opacity-90' : ''} ${overIndex===idx && dragIndex!==null && dragIndex!==idx ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                          onClick={() => dispatch(setActiveQuestion(q.id))}
                          draggable
                          onDragStart={() => setDragIndex(idx)}
                          onDragOver={(e) => { e.preventDefault(); setOverIndex(idx) }}
                          onDrop={() => { if(dragIndex!==null && dragIndex!==idx) { dispatch(reorderCurrentPageQuestions({ from: dragIndex, to: idx })) } setDragIndex(null); setOverIndex(null) }}
                          onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                        >
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                              aria-label="Hapus pertanyaan"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus pertanyaan?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Pertanyaan akan dihapus dari halaman ini.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={()=>dispatch(removeQuestion(q.id))}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <div className="pointer-events-none select-none">
                          {children}
                        </div>
                        </div>
                      </div>
                    )
                    switch(q.type){
                      case 'text':
                        return Wrap(<SoalTeks {...(q as any)} {...common} value="" onChange={()=>{}} />)
                      case 'textarea':
                        return Wrap(<SoalTeksArea {...(q as any)} {...common} value="" onChange={()=>{}} />)
                      case 'single':
                        return Wrap(<SoalSingleChoice {...(q as any)} {...common} opsiJawaban={(q as any).options} value="" onChange={()=>{}} />)
                      case 'multiple':
                        return Wrap(<SoalMultiChoice {...(q as any)} {...common} opsiJawaban={(q as any).options} value={[]} onChange={()=>{}} />)
                      case 'combobox':
                        return Wrap(<SoalComboBox {...(q as any)} {...common} comboboxItems={(q as any).comboboxItems.map((it:any)=>({...it, opsiComboBox: it.options}))} values={{}} onChange={()=>{}} />)
                      case 'rating':
                        return Wrap(<SoalRating {...(q as any)} {...common} values={{}} onChange={()=>{}} />)
                      default:
                        return null
                    }
                  })}
                  </CardContent>
                </div>
              </Card>
            </ResizableContent>

            {/* Panel Kanan - Detail per Soal */}
            <ResizablePanel
              defaultWidth={350}
              minWidth={300}
              maxWidth={500}
              resizable="left"
            >
              <Card className="h-full">
                <CardHeader className="p-3">
                  <CardTitle className="text-md">Detail per Soal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!activeQuestion && (
                    <div className="text-sm text-muted-foreground">Pilih atau tambah soal untuk mengedit.</div>
                  )}
                  {activeQuestion && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Label</label>
                        <Input value={activeQuestion.label} onChange={(e)=>patchActive({ label: e.target.value })} />
                      </div>
                      {(activeQuestion.type==='text' || activeQuestion.type==='textarea') && (
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Placeholder</label>
                          <Input value={(activeQuestion as any).placeholder || ''} onChange={(e)=>patchActive({ placeholder: e.target.value } as any)} />
                        </div>
                      )}
                      {(activeQuestion.type==='single' || activeQuestion.type==='multiple') && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Opsi Jawaban</label>
                            <Button size="sm" variant="outline" onClick={()=>{
                              const options = [ ...((activeQuestion as any).options || []), { value: `opsi_${Date.now()}`, label: 'Opsi Baru' } ]
                              patchActive({ options } as any)
                            }}><Plus className="h-4 w-4 mr-1" />Tambah</Button>
                          </div>
                          <div className="space-y-2">
                            {((activeQuestion as any).options || []).map((opt:any, i:number) => (
                              <div key={opt.value} className="flex items-center space-x-2">
                                <Input value={opt.label} onChange={(e)=>{
                                  const options = [ ...((activeQuestion as any).options) ]
                                  options[i] = { ...opt, label: e.target.value }
                                  patchActive({ options } as any)
                                }} />
                                <Button size="icon" variant="ghost" onClick={()=>{
                                  const options = [ ...((activeQuestion as any).options) ]
                                  options.splice(i,1)
                                  patchActive({ options } as any)
                                }}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
          </ResizableCard>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PaketSoalTracerStudy
