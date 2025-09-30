import { AdminLayout } from "@/components/layout/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    Clock,
    FileText,
    TrendingUp,
    UserCheck,
    Users
} from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

function StatCard({ title, value, change, changeType = "neutral", icon: Icon, description }: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${changeColor[changeType]} flex items-center mt-1`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface RecentActivityProps {
  type: "tracer" | "user"
  name: string
  status: "completed" | "pending" | "in_progress"
  time: string
}

function RecentActivityItem({ type, name, status, time }: RecentActivityProps) {
  const statusConfig = {
    completed: { 
      icon: CheckCircle, 
      color: "text-green-600", 
      bgColor: "bg-green-50",
      label: "Selesai"
    },
    pending: { 
      icon: Clock, 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-50",
      label: "Menunggu"
    },
    in_progress: { 
      icon: AlertCircle, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      label: "Berlangsung"
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-full ${config.bgColor}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {name}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {type === "tracer" ? "Tracer Study" : "User Survey"}
          </Badge>
          <span className={`text-xs ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  )
}

function Dashboard() {
  // Test toast functions
  const testSuccessToast = () => {
    toast.success("Test Success Toast", {
      description: "Ini adalah contoh toast sukses untuk testing"
    })
  }

  const testErrorToast = () => {
    toast.error("Test Error Toast", {
      description: "Ini adalah contoh toast error untuk testing"
    })
  }

  const testInfoToast = () => {
    toast.info("Test Info Toast", {
      description: "Ini adalah contoh toast info untuk testing"
    })
  }

  const testWarningToast = () => {
    toast.warning("Test Warning Toast", {
      description: "Ini adalah contoh toast warning untuk testing"
    })
  }

  // Mock data - dalam implementasi nyata, data ini akan diambil dari API
  const stats = [
    {
      title: "Total Tracer Study",
      value: "1,234",
      change: "+12% dari bulan lalu",
      changeType: "positive" as const,
      icon: FileText,
      description: "Survei yang telah dikumpulkan"
    },
    {
      title: "Total User Survey", 
      value: "856",
      change: "+8% dari bulan lalu",
      changeType: "positive" as const,
      icon: Users,
      description: "Survei pengguna yang selesai"
    },
    {
      title: "Response Rate",
      value: "78.5%",
      change: "+5.2% dari bulan lalu",
      changeType: "positive" as const,
      icon: BarChart3,
      description: "Tingkat respons keseluruhan"
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "-3 dari kemarin",
      changeType: "positive" as const,
      icon: Clock,
      description: "Survei yang perlu ditinjau"
    }
  ]

  const recentActivities: RecentActivityProps[] = [
    {
      type: "tracer",
      name: "Ahmad Rizki - Teknik Informatika",
      status: "completed",
      time: "2 jam yang lalu"
    },
    {
      type: "user", 
      name: "PT. Maju Jaya - Perusahaan",
      status: "completed",
      time: "3 jam yang lalu"
    },
    {
      type: "tracer",
      name: "Siti Nurhaliza - Manajemen",
      status: "in_progress",
      time: "5 jam yang lalu"
    },
    {
      type: "user",
      name: "CV. Sukses Mandiri - Perusahaan", 
      status: "pending",
      time: "1 hari yang lalu"
    },
    {
      type: "tracer",
      name: "Budi Santoso - Akuntansi",
      status: "completed",
      time: "1 hari yang lalu"
    }
  ]

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang di panel admin Tracer Study & User Survey
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <UserCheck className="h-3 w-3" />
              <span>Admin</span>
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Aktivitas Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivities.map((activity, index) => (
                    <RecentActivityItem key={index} {...activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Aksi Cepat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Lihat Tracer Study</p>
                      <p className="text-xs text-muted-foreground">Kelola data tracer study</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Lihat User Survey</p>
                      <p className="text-xs text-muted-foreground">Kelola data user survey</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Analisis Data</p>
                      <p className="text-xs text-muted-foreground">Lihat laporan dan grafik</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Test Toast Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Test Toast</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={testSuccessToast} variant="outline" size="sm">
                    Success Toast
                  </Button>
                  <Button onClick={testErrorToast} variant="outline" size="sm">
                    Error Toast
                  </Button>
                  <Button onClick={testInfoToast} variant="outline" size="sm">
                    Info Toast
                  </Button>
                  <Button onClick={testWarningToast} variant="outline" size="sm">
                    Warning Toast
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Klik tombol di atas untuk test berbagai jenis toast notification
                </p>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Status Sistem</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
