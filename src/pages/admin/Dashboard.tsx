/** @format */

import {useMemo} from 'react';

import {useDashboardOverview} from '@/api/dashboard.api';
import {AdminLayout} from '@/components/layout/admin';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {Skeleton} from '@/components/ui/skeleton';

import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Home,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{className?: string}>;
  description?: string;
}

function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
}: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {change && (
          <p
            className={`text-xs ${changeColor[changeType]} flex items-center mt-1`}
          >
            <TrendingUp className='h-3 w-3 mr-1' />
            {change}
          </p>
        )}
        {description && (
          <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentActivityProps {
  type: 'tracer' | 'user';
  name: string;
  status: 'completed' | 'pending' | 'in_progress';
  time: string;
}

function RecentActivityItem({type, name, status, time}: RecentActivityProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Selesai',
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      label: 'Menunggu',
    },
    in_progress: {
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      label: 'Berlangsung',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className='flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
      <div className={`p-2 rounded-full ${config.bgColor}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-foreground truncate'>{name}</p>
        <div className='flex items-center space-x-2 mt-1'>
          <Badge
            variant='outline'
            className='text-xs'
          >
            {type === 'tracer' ? 'Tracer Study' : 'User Survey'}
          </Badge>
          <span className={`text-xs ${config.color}`}>{config.label}</span>
        </div>
      </div>
      <span className='text-xs text-muted-foreground'>{time}</span>
    </div>
  );
}

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  const now = Date.now();
  const diffMs = now - date.getTime();
  if (diffMs < 0) return 'Baru saja';

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < minute) return 'Baru saja';
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} menit yang lalu`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} jam yang lalu`;
  }
  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} hari yang lalu`;
  }
  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} minggu yang lalu`;
  }
  if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} bulan yang lalu`;
  }
  const years = Math.floor(diffMs / year);
  return `${years} tahun yang lalu`;
};

function Dashboard() {
  const {data, isLoading, isError, refetch} = useDashboardOverview();

  const numberFormatter = useMemo(() => new Intl.NumberFormat('id-ID'), []);

  const stats = [
    {
      title: 'Total Tracer Study',
      value: data?.stats
        ? numberFormatter.format(data.stats.totalTracerStudy)
        : '-',
      icon: FileText,
      description: 'Survei yang telah dikumpulkan',
    },
    {
      title: 'Total User Survey',
      value: data?.stats
        ? numberFormatter.format(data.stats.totalUserSurvey)
        : '-',
      icon: Users,
      description: 'Survei pengguna yang selesai',
    },
    {
      title: 'Response Rate',
      value:
        typeof data?.stats?.responseRate === 'number'
          ? `${data.stats.responseRate.toFixed(1)}%`
          : '-',
      icon: BarChart3,
      description: 'Tingkat respons keseluruhan',
    },
    {
      title: 'Pending Reviews',
      value: data?.stats
        ? numberFormatter.format(data.stats.pendingReviews)
        : '-',
      icon: Clock,
      description: 'Survei yang perlu ditinjau',
    },
  ];

  const recentActivities: RecentActivityProps[] =
    data?.recentActivities.map((activity) => ({
      type: activity.type === 'TRACER_STUDY' ? 'tracer' : 'user',
      name: activity.name,
      status:
        activity.status === 'PENDING'
          ? 'pending'
          : activity.status === 'IN_PROGRESS'
            ? 'in_progress'
            : 'completed',
      time: formatRelativeTime(activity.submittedAt),
    })) || [];

  return (
    <AdminLayout>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='mb-6 relative'>
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className='flex items-center space-x-1'>
                  <Home className='h-4 w-4' />
                  <span>Dashboard</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {isLoading
            ? Array.from({length: 4}).map((_, index) => (
                <Card key={`skeleton-${index}`}>
                  <CardHeader>
                    <Skeleton className='h-4 w-24' />
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-3 w-20' />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat, index) => (
                <StatCard
                  key={index}
                  {...stat}
                />
              ))}
        </div>

        {/* Content Grid */}
        <div className=''>
          {/* Recent Activities */}
          <div className=''>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Clock className='h-5 w-5' />
                  <span>Aktivitas Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {isLoading ? (
                    Array.from({length: 5}).map((_, index) => (
                      <div
                        key={`activity-skeleton-${index}`}
                        className='flex items-center space-x-3 p-3'
                      >
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <div className='flex-1 space-y-2'>
                          <Skeleton className='h-4 w-48' />
                          <Skeleton className='h-3 w-32' />
                        </div>
                        <Skeleton className='h-3 w-16' />
                      </div>
                    ))
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <RecentActivityItem
                        key={index}
                        {...activity}
                      />
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Belum ada aktivitas terbaru.
                    </p>
                  )}
                </div>
                {isError && (
                  <p className='text-sm text-red-600 mt-4'>
                    Gagal memuat data dashboard.{' '}
                    <button
                      type='button'
                      className='underline'
                      onClick={() => refetch()}
                    >
                      Coba lagi
                    </button>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
