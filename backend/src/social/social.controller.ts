import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialActivityService } from './social-activity.service';
import { SocialInteractionService } from './social-interaction.service';
import { SocialCommunityService } from './social-community.service';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(
    private socialActivityService: SocialActivityService,
    private socialInteractionService: SocialInteractionService,
    private socialCommunityService: SocialCommunityService,
  ) {}

  // === 社交动态相关 ===

  // 获取用户动态
  @Get('activities/user/:userId')
  async getUserActivities(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    return this.socialActivityService.getUserActivities(userId, limitNum, offsetNum);
  }

  // 获取好友动态流
  @Get('activities/feed')
  async getFriendsActivityFeed(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;
    return this.socialActivityService.getFriendsActivityFeed(req.user.sub, limitNum, offsetNum);
  }

  // 获取公开动态
  @Get('activities/public')
  async getPublicActivities(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.socialActivityService.getPublicActivities(limitNum);
  }

  // 获取热门动态
  @Get('activities/trending')
  async getTrendingActivities(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.socialActivityService.getTrendingActivities(limitNum);
  }

  // 搜索动态
  @Get('activities/search')
  async searchActivities(
    @Request() req: any,
    @Query('q') query: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.socialActivityService.searchActivities(query, req.user.sub, limitNum);
  }

  // 点赞动态
  @Post('activities/:activityId/like')
  async likeActivity(
    @Request() req: any,
    @Param('activityId') activityId: string
  ) {
    return this.socialActivityService.likeActivity(req.user.sub, activityId);
  }

  // 评论动态
  @Post('activities/:activityId/comment')
  async commentOnActivity(
    @Request() req: any,
    @Param('activityId') activityId: string,
    @Body('content') content: string
  ) {
    return this.socialActivityService.commentOnActivity(req.user.sub, activityId, content);
  }

  // 获取动态互动统计
  @Get('activities/:activityId/interactions')
  async getActivityInteractions(@Param('activityId') activityId: string) {
    return this.socialActivityService.getActivityInteractions(activityId);
  }

  // === 用户关注相关 ===

  // 关注用户
  @Post('follow/:userId')
  async followUser(
    @Request() req: any,
    @Param('userId') userId: string
  ) {
    return this.socialInteractionService.followUser(req.user.sub, userId);
  }

  // 取消关注
  @Delete('follow/:userId')
  async unfollowUser(
    @Request() req: any,
    @Param('userId') userId: string
  ) {
    return this.socialInteractionService.unfollowUser(req.user.sub, userId);
  }

  // 获取关注列表
  @Get('following')
  async getFollowing(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    return this.socialInteractionService.getFollowing(req.user.sub, limitNum, offsetNum);
  }

  // 获取粉丝列表
  @Get('followers')
  async getFollowers(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    return this.socialInteractionService.getFollowers(req.user.sub, limitNum, offsetNum);
  }

  // 检查关注状态
  @Get('follow-status/:userId')
  async checkFollowStatus(
    @Request() req: any,
    @Param('userId') userId: string
  ) {
    return this.socialInteractionService.checkFollowStatus(req.user.sub, userId);
  }

  // 获取用户社交统计
  @Get('stats/:userId')
  async getUserSocialStats(@Param('userId') userId: string) {
    return this.socialInteractionService.getUserSocialStats(userId);
  }

  // 获取推荐关注用户
  @Get('recommendations/users')
  async getRecommendedUsers(
    @Request() req: any,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.socialInteractionService.getRecommendedUsers(req.user.sub, limitNum);
  }

  // === 内容互动相关 ===

  // 点赞内容
  @Post('like')
  async likeContent(
    @Request() req: any,
    @Body() body: { targetType: string; targetId: string }
  ) {
    return this.socialInteractionService.likeContent(req.user.sub, body.targetType, body.targetId);
  }

  // 评论内容
  @Post('comment')
  async commentOnContent(
    @Request() req: any,
    @Body() body: { targetType: string; targetId: string; content: string }
  ) {
    return this.socialInteractionService.commentOnContent(
      req.user.sub, 
      body.targetType, 
      body.targetId, 
      body.content
    );
  }

  // 分享内容
  @Post('share')
  async shareContent(
    @Request() req: any,
    @Body() body: { targetType: string; targetId: string; message?: string }
  ) {
    return this.socialInteractionService.shareContent(
      req.user.sub, 
      body.targetType, 
      body.targetId, 
      body.message
    );
  }

  // 获取内容互动统计
  @Get('interactions/:targetType/:targetId')
  async getContentInteractions(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string
  ) {
    return this.socialInteractionService.getContentInteractions(targetType, targetId);
  }

  // === 社区群组相关 ===

  // 创建群组
  @Post('groups')
  async createGroup(
    @Request() req: any,
    @Body() groupData: {
      name: string;
      description: string;
      category: string;
      isPublic: boolean;
      tags?: string[];
      rules?: string[];
    }
  ) {
    return this.socialCommunityService.createGroup(req.user.sub, groupData);
  }

  // 获取群组列表
  @Get('groups')
  async getGroups(
    @Query('category') category?: string,
    @Query('isPublic') isPublic?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    const isPublicBool = isPublic ? isPublic === 'true' : undefined;

    return this.socialCommunityService.getGroups({
      category,
      isPublic: isPublicBool,
      search,
      limit: limitNum,
      offset: offsetNum
    });
  }

  // 获取用户加入的群组
  @Get('groups/my')
  async getUserGroups(@Request() req: any) {
    return this.socialCommunityService.getUserGroups(req.user.sub);
  }

  // 获取热门群组
  @Get('groups/trending')
  async getTrendingGroups(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.socialCommunityService.getTrendingGroups(limitNum);
  }

  // 加入群组
  @Post('groups/:groupId/join')
  async joinGroup(
    @Request() req: any,
    @Param('groupId') groupId: string
  ) {
    return this.socialCommunityService.joinGroup(req.user.sub, groupId);
  }

  // 离开群组
  @Delete('groups/:groupId/leave')
  async leaveGroup(
    @Request() req: any,
    @Param('groupId') groupId: string
  ) {
    return this.socialCommunityService.leaveGroup(req.user.sub, groupId);
  }

  // 发布群组帖子
  @Post('groups/:groupId/posts')
  async createGroupPost(
    @Request() req: any,
    @Param('groupId') groupId: string,
    @Body() postData: {
      title: string;
      content: string;
      type: 'TEXT' | 'IMAGE' | 'GAME_SHARE' | 'POLL';
      attachments?: any[];
    }
  ) {
    return this.socialCommunityService.createGroupPost(req.user.sub, groupId, postData);
  }

  // 获取群组帖子
  @Get('groups/:groupId/posts')
  async getGroupPosts(
    @Request() req: any,
    @Param('groupId') groupId: string,
    @Query('type') type?: string,
    @Query('isPinned') isPinned?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    const isPinnedBool = isPinned ? isPinned === 'true' : undefined;

    return this.socialCommunityService.getGroupPosts(groupId, req.user.sub, {
      type,
      isPinned: isPinnedBool,
      limit: limitNum,
      offset: offsetNum
    });
  }

  // 搜索群组
  @Get('groups/search')
  async searchGroups(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('isPublic') isPublic?: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    const isPublicBool = isPublic ? isPublic === 'true' : undefined;

    return this.socialCommunityService.searchGroups(query, {
      category,
      isPublic: isPublicBool,
      limit: limitNum
    });
  }
}
