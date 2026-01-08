import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('request')
  async sendFriendRequest(@Request() req, @Body('username') username: string) {
    return this.friendsService.sendFriendRequest(req.user.sub, username);
  }

  @Post('respond')
  async respondToFriendRequest(
    @Request() req,
    @Body('friendshipId') friendshipId: string,
    @Body('accept') accept: boolean
  ) {
    return this.friendsService.respondToFriendRequest(req.user.sub, friendshipId, accept);
  }

  @Get()
  async getFriends(@Request() req) {
    return this.friendsService.getFriends(req.user.sub);
  }

  @Get('pending')
  async getPendingRequests(@Request() req) {
    return this.friendsService.getPendingRequests(req.user.sub);
  }

  @Delete(':id')
  async removeFriend(@Request() req, @Param('id') friendshipId: string) {
    return this.friendsService.removeFriend(req.user.sub, friendshipId);
  }

  @Get('check/:userId')
  async checkFriendship(@Request() req, @Param('userId') targetUserId: string) {
    return this.friendsService.checkFriendship(req.user.sub, targetUserId);
  }

  @Post('block')
  async blockUser(@Request() req, @Body('userId') userId: string) {
    return this.friendsService.blockUser(req.user.sub, userId);
  }

  @Post('unblock')
  async unblockUser(@Request() req, @Body('userId') userId: string) {
    return this.friendsService.unblockUser(req.user.sub, userId);
  }

  @Get('blocked')
  async getBlockedUsers(@Request() req) {
    return this.friendsService.getBlockedUsers(req.user.sub);
  }

  @Get('recommendations')
  async getFriendRecommendations(@Request() req) {
    return this.friendsService.getFriendRecommendations(req.user.sub);
  }
}
