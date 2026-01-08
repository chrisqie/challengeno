import React from 'react';
import { 
  Clock, 
  Play, 
  Camera, 
  Users, 
  Trophy, 
  XCircle, 
  AlertTriangle,
  CheckCircle,
  Pause
} from 'lucide-react';

interface GameStatusIndicatorProps {
  status: string;
  startDate: string;
  endDate: string;
  evidenceDeadline: string;
  currentParticipants: number;
  maxParticipants: number;
  className?: string;
}

const GameStatusIndicator: React.FC<GameStatusIndicatorProps> = ({
  status,
  startDate,
  endDate,
  evidenceDeadline,
  currentParticipants,
  maxParticipants,
  className = ''
}) => {
  const getStatusInfo = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const evidenceEnd = new Date(evidenceDeadline);

    switch (status) {
      case 'OPEN':
        const timeToStart = start.getTime() - now.getTime();
        const daysToStart = Math.ceil(timeToStart / (1000 * 60 * 60 * 24));
        
        return {
          icon: Clock,
          title: '开放报名',
          description: daysToStart > 0 
            ? `${daysToStart} 天后开始` 
            : '即将开始',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          progress: (currentParticipants / maxParticipants) * 100
        };

      case 'IN_PROGRESS':
        const timeToEnd = end.getTime() - now.getTime();
        const hoursToEnd = Math.ceil(timeToEnd / (1000 * 60 * 60));
        
        return {
          icon: Play,
          title: '进行中',
          description: hoursToEnd > 24 
            ? `还剩 ${Math.ceil(hoursToEnd / 24)} 天` 
            : `还剩 ${hoursToEnd} 小时`,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          progress: ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
        };

      case 'EVIDENCE_SUBMISSION':
        const timeToEvidenceEnd = evidenceEnd.getTime() - now.getTime();
        const hoursToEvidenceEnd = Math.ceil(timeToEvidenceEnd / (1000 * 60 * 60));
        
        return {
          icon: Camera,
          title: '证据提交',
          description: hoursToEvidenceEnd > 24 
            ? `还剩 ${Math.ceil(hoursToEvidenceEnd / 24)} 天` 
            : hoursToEvidenceEnd > 0 
              ? `还剩 ${hoursToEvidenceEnd} 小时`
              : '即将截止',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          progress: ((now.getTime() - end.getTime()) / (evidenceEnd.getTime() - end.getTime())) * 100
        };

      case 'PEER_REVIEW':
      case 'PEER_EVALUATION':
        return {
          icon: Users,
          title: '互评阶段',
          description: '参与者互相评价证据',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          progress: 75
        };

      case 'ARBITRATION':
        return {
          icon: AlertTriangle,
          title: '仲裁阶段',
          description: '等待仲裁结果',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          progress: 90
        };

      case 'COMPLETED':
        return {
          icon: Trophy,
          title: '已完成',
          description: '挑战已结束，查看结果',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          progress: 100
        };

      case 'CANCELLED':
        return {
          icon: XCircle,
          title: '已取消',
          description: '挑战已被取消',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          progress: 0
        };

      case 'PAUSED':
        return {
          icon: Pause,
          title: '已暂停',
          description: '挑战暂时暂停',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          progress: 50
        };

      default:
        return {
          icon: AlertTriangle,
          title: '未知状态',
          description: '状态异常',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-white ${statusInfo.borderColor} border`}>
          <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.title}
            </h3>
            {status === 'OPEN' && (
              <span className="text-sm text-gray-600">
                {currentParticipants}/{maxParticipants} 人
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {statusInfo.description}
          </p>
          
          {/* 进度条 */}
          {statusInfo.progress > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    status === 'OPEN' ? 'bg-green-500' :
                    status === 'IN_PROGRESS' ? 'bg-blue-500' :
                    status === 'EVIDENCE_SUBMISSION' ? 'bg-orange-500' :
                    status === 'PEER_REVIEW' || status === 'PEER_EVALUATION' ? 'bg-purple-500' :
                    status === 'ARBITRATION' ? 'bg-yellow-500' :
                    status === 'COMPLETED' ? 'bg-emerald-500' :
                    'bg-gray-500'
                  }`}
                  style={{ width: `${Math.min(statusInfo.progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>开始</span>
                <span>{Math.round(statusInfo.progress)}%</span>
                <span>结束</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatusIndicator;
