import { AdminLayout } from "@/components/layout/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CustomPagination } from "@/components/ui/pagination"
import { 
  Search, 
  Filter, 
  Users, 
  Calendar,
  BookOpen,
  Award,
  Building
} from "lucide-react"
import * as React from "react"

// Types berdasarkan Prisma schema
interface Alumni {
  id: string
  nim: string
  graduatedYear: number
  graduatePeriode: 'WISUDA_I' | 'WISUDA_II' | 'WISUDA_III' | 'WISUDA_IV' | 'WISUDA_V' | 'WISUDA_VI'
  degree: 'D3' | 'S1' | 'S2' | 'S3' | 'PROFESI'
  respondent: {
    id: string
    fullName: string
    email: string
    role: 'ALUMNI' | 'MANAGER'
    createdAt: string
  }
  major: {
    id: string
    name: string
    faculty: {
      id: string
      name: string
    }
  }
  createdAt: string
  updatedAt: string
}

interface Faculty {
  id: string
  name: string
}

interface Major {
  id: string
  name: string
  faculty: Faculty
}

// Mock data untuk demo
const mockFaculties: Faculty[] = [
  { id: '1', name: 'Fakultas Teknik' },
  { id: '2', name: 'Fakultas Ekonomi' },
  { id: '3', name: 'Fakultas Kedokteran' },
  { id: '4', name: 'Fakultas Hukum' },
  { id: '5', name: 'Fakultas Pertanian' },
  { id: '6', name: 'Fakultas Ilmu Budaya' },
  { id: '7', name: 'Fakultas Matematika dan Ilmu Pengetahuan Alam' },
  { id: '8', name: 'Fakultas Ilmu Sosial dan Ilmu Politik' },
]

const mockMajors: Major[] = [
  { id: '1', name: 'Teknik Informatika', faculty: mockFaculties[0] },
  { id: '2', name: 'Teknik Sipil', faculty: mockFaculties[0] },
  { id: '3', name: 'Teknik Mesin', faculty: mockFaculties[0] },
  { id: '4', name: 'Manajemen', faculty: mockFaculties[1] },
  { id: '5', name: 'Akuntansi', faculty: mockFaculties[1] },
  { id: '6', name: 'Kedokteran', faculty: mockFaculties[2] },
  { id: '7', name: 'Hukum', faculty: mockFaculties[3] },
  { id: '8', name: 'Agroteknologi', faculty: mockFaculties[4] },
]

const mockAlumni: Alumni[] = [
  {
    id: '1',
    nim: '1911522012',
    graduatedYear: 2023,
    graduatePeriode: 'WISUDA_I',
    degree: 'S1',
    respondent: {
      id: 'resp-1',
      fullName: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@example.com',
      role: 'ALUMNI',
      createdAt: '2023-01-15T00:00:00Z'
    },
    major: mockMajors[0],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    nim: '1911522013',
    graduatedYear: 2023,
    graduatePeriode: 'WISUDA_II',
    degree: 'S1',
    respondent: {
      id: 'resp-2',
      fullName: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@example.com',
      role: 'ALUMNI',
      createdAt: '2023-07-20T00:00:00Z'
    },
    major: mockMajors[1],
    createdAt: '2023-07-20T00:00:00Z',
    updatedAt: '2023-07-20T00:00:00Z'
  },
  {
    id: '3',
    nim: '1911522014',
    graduatedYear: 2022,
    graduatePeriode: 'WISUDA_I',
    degree: 'S1',
    respondent: {
      id: 'resp-3',
      fullName: 'Budi Santoso',
      email: 'budi.santoso@example.com',
      role: 'ALUMNI',
      createdAt: '2022-01-10T00:00:00Z'
    },
    major: mockMajors[2],
    createdAt: '2022-01-10T00:00:00Z',
    updatedAt: '2022-01-10T00:00:00Z'
  },
  {
    id: '4',
    nim: '1911522015',
    graduatedYear: 2023,
    graduatePeriode: 'WISUDA_III',
    degree: 'S2',
    respondent: {
      id: 'resp-4',
      fullName: 'Dewi Kartika',
      email: 'dewi.kartika@example.com',
      role: 'ALUMNI',
      createdAt: '2023-08-15T00:00:00Z'
    },
    major: mockMajors[3],
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2023-08-15T00:00:00Z'
  },
  {
    id: '5',
    nim: '1911522016',
    graduatedYear: 2021,
    graduatePeriode: 'WISUDA_II',
    degree: 'S1',
    respondent: {
      id: 'resp-5',
      fullName: 'Eko Prasetyo',
      email: 'eko.prasetyo@example.com',
      role: 'ALUMNI',
      createdAt: '2021-01-05T00:00:00Z'
    },
    major: mockMajors[4],
    createdAt: '2021-01-05T00:00:00Z',
    updatedAt: '2021-01-05T00:00:00Z'
  }
]

function AlumniDatabase() {
  const [alumni] = React.useState<Alumni[]>(mockAlumni)
  const [filteredAlumni, setFilteredAlumni] = React.useState<Alumni[]>(mockAlumni)
  const [showFilters, setShowFilters] = React.useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFaculty, setSelectedFaculty] = React.useState<string>("")
  const [selectedMajor, setSelectedMajor] = React.useState<string>("")
  const [selectedDegree, setSelectedDegree] = React.useState<string>("")
  const [selectedGraduatedYear, setSelectedGraduatedYear] = React.useState<string>("")
  const [selectedPeriode, setSelectedPeriode] = React.useState<string>("")
  
  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  
  // Get unique years for filter
  const graduatedYears = React.useMemo(() => {
    const years = [...new Set(alumni.map(a => a.graduatedYear))].sort((a, b) => b - a)
    return years
  }, [alumni])
  
  // Get majors filtered by faculty
  const filteredMajors = React.useMemo(() => {
    if (!selectedFaculty || selectedFaculty === "all") return mockMajors
    return mockMajors.filter(major => major.faculty.id === selectedFaculty)
  }, [selectedFaculty])
  
  // Apply filters
  React.useEffect(() => {
    let filtered = [...alumni]
    
    // Search by name
    if (searchQuery.trim()) {
      filtered = filtered.filter(alumni => 
        alumni.respondent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.respondent.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by faculty
    if (selectedFaculty && selectedFaculty !== "all") {
      filtered = filtered.filter(alumni => alumni.major.faculty.id === selectedFaculty)
    }
    
    // Filter by major
    if (selectedMajor && selectedMajor !== "all") {
      filtered = filtered.filter(alumni => alumni.major.id === selectedMajor)
    }
    
    // Filter by degree
    if (selectedDegree && selectedDegree !== "all") {
      filtered = filtered.filter(alumni => alumni.degree === selectedDegree)
    }
    
    // Filter by graduated year
    if (selectedGraduatedYear && selectedGraduatedYear !== "all") {
      filtered = filtered.filter(alumni => alumni.graduatedYear === parseInt(selectedGraduatedYear))
    }
    
    // Filter by periode
    if (selectedPeriode && selectedPeriode !== "all") {
      filtered = filtered.filter(alumni => alumni.graduatePeriode === selectedPeriode)
    }
    
    setFilteredAlumni(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [alumni, searchQuery, selectedFaculty, selectedMajor, selectedDegree, selectedGraduatedYear, selectedPeriode])
  
  // Pagination
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAlumni = filteredAlumni.slice(startIndex, endIndex)
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedFaculty("")
    setSelectedMajor("")
    setSelectedDegree("")
    setSelectedGraduatedYear("")
    setSelectedPeriode("")
  }
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Database Alumni
              </h1>
              <p className="text-muted-foreground mt-2">
                Kelola dan pantau data alumni Universitas Andalas
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alumni</p>
                  <p className="text-2xl font-bold text-foreground">{alumni.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tahun Ini</p>
                  <p className="text-2xl font-bold text-foreground">
                    {alumni.filter(a => a.graduatedYear === new Date().getFullYear()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Program Studi</p>
                  <p className="text-2xl font-bold text-foreground">{mockMajors.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fakultas</p>
                  <p className="text-2xl font-bold text-foreground">{mockFaculties.length}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          {/* Search Bar with Filter Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Cari berdasarkan nama, NIM, atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border border-border/50 bg-background focus:border-primary transition-all duration-200"
              />
            </div>
            <Button
              onClick={toggleFilters}
              variant={showFilters ? "default" : "outline"}
              className="h-12 px-4 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Faculty Filter */}
                <div className="space-y-2">
                  <Label htmlFor="faculty" className="text-sm font-medium text-foreground">Fakultas</Label>
                  <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Fakultas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Fakultas</SelectItem>
                      {mockFaculties.map(faculty => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Major Filter */}
                <div className="space-y-2">
                  <Label htmlFor="major" className="text-sm font-medium text-foreground">Program Studi</Label>
                  <Select 
                    value={selectedMajor} 
                    onValueChange={setSelectedMajor}
                    disabled={!selectedFaculty}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Program Studi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Program Studi</SelectItem>
                      {filteredMajors.map(major => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Degree Filter */}
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-sm font-medium text-foreground">Jenjang</Label>
                  <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenjang</SelectItem>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                      <SelectItem value="PROFESI">Profesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Graduated Year Filter */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-foreground">Tahun Lulus</Label>
                  <Select value={selectedGraduatedYear} onValueChange={setSelectedGraduatedYear}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      {graduatedYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Periode Filter */}
                <div className="space-y-2">
                  <Label htmlFor="periode" className="text-sm font-medium text-foreground">Periode Wisuda</Label>
                  <Select value={selectedPeriode} onValueChange={setSelectedPeriode}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Periode</SelectItem>
                      <SelectItem value="WISUDA_I">Wisuda I</SelectItem>
                      <SelectItem value="WISUDA_II">Wisuda II</SelectItem>
                      <SelectItem value="WISUDA_III">Wisuda III</SelectItem>
                      <SelectItem value="WISUDA_IV">Wisuda IV</SelectItem>
                      <SelectItem value="WISUDA_V">Wisuda V</SelectItem>
                      <SelectItem value="WISUDA_VI">Wisuda VI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-foreground">{filteredAlumni.length}</span> dari{' '}
                  <span className="font-semibold text-foreground">{alumni.length}</span> alumni
                </div>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="h-9 px-4"
                >
                  Hapus Filter
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Pure Table */}
        <div className="bg-background border border-border/50 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-muted/30">
                  <TableHead className="font-semibold">NIM</TableHead>
                  <TableHead className="font-semibold">Nama Lengkap</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Fakultas</TableHead>
                  <TableHead className="font-semibold">Program Studi</TableHead>
                  <TableHead className="font-semibold">Jenjang</TableHead>
                  <TableHead className="font-semibold">Tahun Lulus</TableHead>
                  <TableHead className="font-semibold">Periode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAlumni.map((alumni) => (
                  <TableRow key={alumni.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm">
                      {alumni.nim}
                    </TableCell>
                    <TableCell className="font-medium">
                      {alumni.respondent.fullName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {alumni.respondent.email}
                    </TableCell>
                    <TableCell>
                      {alumni.major.faculty.name}
                    </TableCell>
                    <TableCell>
                      {alumni.major.name}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={alumni.degree === 'S1' ? 'default' : 'outline'}
                        className="flex items-center gap-1 w-fit"
                      >
                        <Award className="h-3 w-3" />
                        {alumni.degree}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {alumni.graduatedYear}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={alumni.graduatePeriode === 'WISUDA_I' ? 'default' : 'secondary'}
                      >
                        {alumni.graduatePeriode.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center p-4 border-t border-border/50">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
          
          {/* Empty State */}
          {filteredAlumni.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Tidak ada alumni ditemukan
              </h3>
              <p className="text-muted-foreground mb-4">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <Button onClick={clearFilters} variant="outline">
                Hapus Semua Filter
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AlumniDatabase
