-- 更新快捷模板标记
-- 将用户指定的模板标记为快捷模板 (isQuickStart = true)

-- 健康类快捷模板
UPDATE game_templates SET is_quick_start = true WHERE name = 'health_sleep_early'; -- 早睡早起挑战
UPDATE game_templates SET is_quick_start = true WHERE name = 'health_diet_water'; -- 每日饮水2升
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_no_junk_food'; -- 戒零食挑战 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'health_mental_meditation'; -- 每日冥想15分钟
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_morning_routine'; -- 晨间仪式养成 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'health_mental_digital_detox'; -- 压力管理挑战/数字排毒

-- 健身类快捷模板
UPDATE game_templates SET is_quick_start = true WHERE name = 'fitness_cardio_running'; -- 每日跑步5公里
UPDATE game_templates SET is_quick_start = true WHERE name = 'fitness_cardio_steps'; -- 每日万步挑战
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_stairs_climbing'; -- 爬楼梯挑战 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'fitness_strength_pushups'; -- 俯卧撑挑战
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_plank_challenge'; -- 平板支撑挑战 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_muscle_building'; -- 增肌训练计划
UPDATE game_templates SET is_quick_start = true WHERE name = 'fitness_flexibility_yoga'; -- 瑜伽练习挑战

-- 注意：以下模板在数据库中不存在，需要创建
-- - 每日运动挑战 (可能对应 fitness_cardio_running 或其他)
-- - 基础健身挑战 (需要新建)

-- 学习类快捷模板
UPDATE game_templates SET is_quick_start = true WHERE name = 'learning_language_english'; -- 英语学习打卡
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_vocabulary'; -- 每日背单词50个 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_language_fluency'; -- 语言流利度提升
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_podcast_learning'; -- 每日播客学习 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'learning_skill_programming'; -- 编程技能提升
UPDATE game_templates SET is_quick_start = true WHERE name = 'learning_reading_daily'; -- 每日阅读30分钟
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_book_club'; -- 读书会挑战

-- 个人成长类快捷模板
UPDATE game_templates SET is_quick_start = true WHERE name = 'personal_productivity_pomodoro'; -- 番茄工作法挑战
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_no_phone_morning'; -- 早晨不看手机 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'personal_productivity_todo'; -- 每日任务清单
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_creative_project'; -- 创意项目完成
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_compliment'; -- 每日赞美他人 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'personal_growth_learning'; -- 每日学习新知识

-- 注意：戒断社交媒体 可能对应 health_mental_digital_detox (数字排毒挑战)

-- 生活方式类快捷模板
UPDATE game_templates SET is_quick_start = true WHERE name = 'lifestyle_home_cooking'; -- 每日健康烹饪
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_bed_making'; -- 每日整理床铺 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_minimalism'; -- 极简生活挑战
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_sustainable_living'; -- 可持续生活方式
UPDATE game_templates SET is_quick_start = true WHERE name = 'lifestyle_home_cleaning'; -- 生活方式改善/每日整理收纳
UPDATE game_templates SET is_quick_start = true WHERE name = 'quick_family_time'; -- 每日家庭时光 (已经是快捷模板)
UPDATE game_templates SET is_quick_start = true WHERE name = 'lifestyle_social_connection'; -- 每日社交联系
UPDATE game_templates SET is_quick_start = true WHERE name = 'lifestyle_social_volunteer'; -- 志愿服务挑战
UPDATE game_templates SET is_quick_start = true WHERE name = 'lifestyle_hobby_movie'; -- 电影观赏计划
UPDATE game_templates SET is_quick_start = true WHERE name = 'lifestyle_hobby_photography'; -- 每日摄影练习

-- 注意：极简生活实践 可能与 advanced_minimalism 重复

-- 职业发展类快捷模板
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_side_hustle'; -- 副业启动计划
UPDATE game_templates SET is_quick_start = true WHERE name = 'advanced_leadership_development'; -- 领导力提升计划

-- 删除指定的模板
DELETE FROM game_templates WHERE name = 'vip_custom_challenge'; -- 完全自定义挑战 (VIP)
DELETE FROM game_templates WHERE name = 'vip_private_room'; -- 私密房间挑战 (VIP)
DELETE FROM game_templates WHERE name = 'vip_team_challenge'; -- 团队协作挑战 (VIP)
DELETE FROM game_templates WHERE name = 'lifestyle_hobby_gardening'; -- 园艺种植体验

-- 更新通用模板为VIP专属
UPDATE game_templates SET
  title = '通用自定义挑战',
  description = '完全自定义的挑战模板，适合特殊需求和创意挑战。VIP专享功能，提供最大的灵活性。',
  is_vip_only = true,
  vip_tier = 'BASIC',
  is_quick_start = false
WHERE name = 'general_custom';

-- 合并睡眠相关模板：将 advanced_sleep_optimization 合并到 health_sleep_quality
-- 删除 advanced_sleep_optimization，保留 health_sleep_quality 作为精细模板
DELETE FROM game_templates WHERE name = 'advanced_sleep_optimization';
UPDATE game_templates SET 
  title = '睡眠质量优化',
  description = '优化睡眠环境和习惯：固定作息、睡前仪式、环境调整，全面提升睡眠质量',
  instructions = '记录睡眠时间、睡眠质量、睡前活动，使用睡眠监测app追踪数据',
  example_evidence = '睡眠日记+睡眠监测数据+睡眠环境照片',
  is_quick_start = false,
  difficulty_level = 'INTERMEDIATE',
  is_vip_only = false,
  vip_tier = NULL
WHERE name = 'health_sleep_quality';

-- 合并健身房训练模板：将 fitness_strength_gym 设置为精细模板
-- 注意：没有找到另一个"健身房训练"模板，只保留这一个作为精细模板
UPDATE game_templates SET 
  title = '健身房力量训练',
  description = '系统的健身房力量训练：器械训练、自由重量、复合动作，全面提升肌肉力量和体能',
  instructions = '每次训练拍摄健身房照片或训练记录，记录训练动作、组数、重量',
  example_evidence = '健身房器械训练照片+训练日志+体能数据',
  is_quick_start = false,
  difficulty_level = 'INTERMEDIATE'
WHERE name = 'fitness_strength_gym';

