// 游戏配置渲染器 - 处理各种模板类型的配置显示

import React from 'react';
import { Clock, Target, Users, BookOpen, Settings, Tag } from 'lucide-react';

// 健康生活类渲染器
export const renderWakeupConfig = (dynamicConfig: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dynamicConfig.currentWakeTime && (
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-900">目前起床时间</div>
            <div className="text-sm text-blue-700">{dynamicConfig.currentWakeTime}</div>
          </div>
        </div>
      )}
      
      {dynamicConfig.targetWakeTime && (
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <Target className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium text-green-900">目标起床时间</div>
            <div className="text-sm text-green-700">{dynamicConfig.targetWakeTime}</div>
          </div>
        </div>
      )}
      
      {dynamicConfig.goals && dynamicConfig.goals.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <Target className="w-5 h-5 text-purple-600" />
          <div>
            <div className="font-medium text-purple-900">早起目标</div>
            <div className="text-sm text-purple-700">
              {dynamicConfig.goals.map((goal: string) => getWakeupGoalLabel(goal)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.sleepTime && (
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <Clock className="w-5 h-5 text-orange-600" />
          <div>
            <div className="font-medium text-orange-900">计划睡觉时间</div>
            <div className="text-sm text-orange-700">{dynamicConfig.sleepTime}</div>
          </div>
        </div>
      )}
      
      {dynamicConfig.motivation && (
        <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
          <Settings className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="font-medium text-indigo-900">动机强度</div>
            <div className="text-sm text-indigo-700">
              {getMotivationLabel(dynamicConfig.motivation)}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.strategies && dynamicConfig.strategies.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
          <Settings className="w-5 h-5 text-pink-600" />
          <div>
            <div className="font-medium text-pink-900">辅助策略</div>
            <div className="text-sm text-pink-700">
              {dynamicConfig.strategies.map((strategy: string) => getStrategyLabel(strategy)).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const renderWaterConfig = (dynamicConfig: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dynamicConfig.currentIntake && (
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-900">目前饮水量</div>
            <div className="text-sm text-blue-700">{dynamicConfig.currentIntake}</div>
          </div>
        </div>
      )}
      
      {dynamicConfig.targetIntake && (
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <Target className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium text-green-900">目标饮水量</div>
            <div className="text-sm text-green-700">{dynamicConfig.targetIntake}</div>
          </div>
        </div>
      )}
      
      {dynamicConfig.goals && dynamicConfig.goals.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <Target className="w-5 h-5 text-purple-600" />
          <div>
            <div className="font-medium text-purple-900">健康目标</div>
            <div className="text-sm text-purple-700">
              {dynamicConfig.goals.map((goal: string) => getWaterGoalLabel(goal)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.waterType && dynamicConfig.waterType.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <Tag className="w-5 h-5 text-orange-600" />
          <div>
            <div className="font-medium text-orange-900">饮水类型</div>
            <div className="text-sm text-orange-700">
              {dynamicConfig.waterType.map((type: string) => getWaterTypeLabel(type)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.schedule && dynamicConfig.schedule.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
          <Clock className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="font-medium text-indigo-900">饮水时间安排</div>
            <div className="text-sm text-indigo-700">
              {dynamicConfig.schedule.map((time: string) => getWaterScheduleLabel(time)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.reminders && dynamicConfig.reminders.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
          <Settings className="w-5 h-5 text-pink-600" />
          <div>
            <div className="font-medium text-pink-900">提醒方式</div>
            <div className="text-sm text-pink-700">
              {dynamicConfig.reminders.map((reminder: string) => getReminderLabel(reminder)).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const renderMeditationConfig = (dynamicConfig: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dynamicConfig.experience && (
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-900">冥想经验</div>
            <div className="text-sm text-blue-700">
              {getExperienceLabel(dynamicConfig.experience)}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.meditationType && dynamicConfig.meditationType.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <Settings className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium text-green-900">冥想类型</div>
            <div className="text-sm text-green-700">
              {dynamicConfig.meditationType.map((type: string) => getMeditationTypeLabel(type)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.goals && dynamicConfig.goals.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <Target className="w-5 h-5 text-purple-600" />
          <div>
            <div className="font-medium text-purple-900">练习目标</div>
            <div className="text-sm text-purple-700">
              {dynamicConfig.goals.map((goal: string) => getMeditationGoalLabel(goal)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.duration && (
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <Clock className="w-5 h-5 text-orange-600" />
          <div>
            <div className="font-medium text-orange-900">冥想时长</div>
            <div className="text-sm text-orange-700">
              {getDurationLabel(dynamicConfig.duration)}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.timeOfDay && dynamicConfig.timeOfDay.length > 0 && (
        <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
          <Clock className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="font-medium text-indigo-900">冥想时间</div>
            <div className="text-sm text-indigo-700">
              {dynamicConfig.timeOfDay.map((time: string) => getMeditationTimeLabel(time)).join(', ')}
            </div>
          </div>
        </div>
      )}
      
      {dynamicConfig.environment && (
        <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
          <Users className="w-5 h-5 text-pink-600" />
          <div>
            <div className="font-medium text-pink-900">冥想环境</div>
            <div className="text-sm text-pink-700">
              {getMeditationEnvironmentLabel(dynamicConfig.environment)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 标签映射函数
function getWakeupGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'exercise': '晨练运动',
    'study': '学习充电',
    'work': '工作效率',
    'meditation': '冥想静心',
    'planning': '规划一天',
    'hobby': '个人爱好'
  };
  return labels[value] || value;
}

function getMotivationLabel(value: string): string {
  const labels: Record<string, string> = {
    'strong': '强烈动机',
    'moderate': '中等动机',
    'weak': '尝试改变'
  };
  return labels[value] || value;
}

function getStrategyLabel(value: string): string {
  const labels: Record<string, string> = {
    'alarm_multiple': '多个闹钟',
    'alarm_far': '闹钟放远处',
    'sleep_early': '提前睡觉',
    'no_phone': '睡前不玩手机',
    'morning_routine': '晨间例行公事',
    'accountability': '找人监督'
  };
  return labels[value] || value;
}

function getWaterGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'skin_health': '改善肌肤',
    'weight_loss': '辅助减重',
    'detox': '排毒养颜',
    'energy': '提升精力',
    'kidney_health': '肾脏健康',
    'habit_building': '养成习惯'
  };
  return labels[value] || value;
}

function getWaterTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'plain_water': '白开水',
    'mineral_water': '矿泉水',
    'lemon_water': '柠檬水',
    'tea': '茶类',
    'fruit_water': '果味水'
  };
  return labels[value] || value;
}

function getWaterScheduleLabel(value: string): string {
  const labels: Record<string, string> = {
    'morning_wake': '晨起一杯',
    'before_meals': '餐前饮水',
    'work_breaks': '工作间隙',
    'exercise': '运动前后',
    'evening': '睡前适量'
  };
  return labels[value] || value;
}

function getReminderLabel(value: string): string {
  const labels: Record<string, string> = {
    'phone_app': '手机应用提醒',
    'water_bottle': '带刻度水杯',
    'alarm': '定时闹钟',
    'sticky_notes': '便签提醒',
    'habit_tracker': '习惯追踪器'
  };
  return labels[value] || value;
}

function getExperienceLabel(value: string): string {
  const labels: Record<string, string> = {
    'beginner': '初学者',
    'occasional': '偶尔练习',
    'regular': '定期练习',
    'advanced': '资深练习者'
  };
  return labels[value] || value;
}

function getMeditationTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'mindfulness': '正念冥想',
    'guided': '引导冥想',
    'breathing': '呼吸冥想',
    'body_scan': '身体扫描',
    'loving_kindness': '慈心冥想',
    'walking': '行走冥想'
  };
  return labels[value] || value;
}

function getMeditationGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'stress_relief': '缓解压力',
    'focus': '提升专注力',
    'emotional_balance': '情绪平衡',
    'sleep_quality': '改善睡眠',
    'self_awareness': '自我觉察',
    'spiritual_growth': '精神成长'
  };
  return labels[value] || value;
}

function getDurationLabel(value: string): string {
  const labels: Record<string, string> = {
    '5_min': '5分钟',
    '10_min': '10分钟',
    '15_min': '15分钟',
    '20_min': '20分钟',
    '30_min': '30分钟',
    'flexible': '灵活时长'
  };
  return labels[value] || value;
}

function getMeditationTimeLabel(value: string): string {
  const labels: Record<string, string> = {
    'morning': '晨间冥想',
    'lunch_break': '午休冥想',
    'evening': '傍晚冥想',
    'before_sleep': '睡前冥想',
    'stress_moments': '压力时刻'
  };
  return labels[value] || value;
}

function getMeditationEnvironmentLabel(value: string): string {
  const labels: Record<string, string> = {
    'quiet_room': '安静房间',
    'nature': '自然环境',
    'meditation_space': '专门冥想区',
    'anywhere': '随时随地'
  };
  return labels[value] || value;
}
