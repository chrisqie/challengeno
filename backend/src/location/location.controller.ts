import { Controller, Get, Query, Req } from '@nestjs/common';
import { LocationService } from './location.service';
import { Public } from '../auth/decorators/public.decorator';
import { Request } from 'express';

@Controller('location')
@Public()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * 获取客户端IP的地理位置信息
   */
  @Get('current')
  async getCurrentLocation(@Req() req: Request) {
    // 获取客户端真实IP
    const clientIP = this.getClientIP(req);
    
    const location = await this.locationService.getLocationByIP(clientIP);
    
    return {
      success: true,
      data: location,
      clientIP,
    };
  }

  /**
   * 根据指定IP获取地理位置信息
   */
  @Get('by-ip')
  async getLocationByIP(@Query('ip') ip: string) {
    if (!ip) {
      return {
        success: false,
        message: 'IP地址不能为空',
      };
    }

    const location = await this.locationService.getLocationByIP(ip);
    
    return {
      success: true,
      data: location,
    };
  }

  /**
   * 获取常见国家列表
   */
  @Get('countries')
  getCommonCountries() {
    return {
      success: true,
      data: this.locationService.getCommonCountries(),
    };
  }

  /**
   * 计算两个位置之间的距离
   */
  @Get('distance')
  calculateDistance(
    @Query('lat1') lat1: string,
    @Query('lon1') lon1: string,
    @Query('lat2') lat2: string,
    @Query('lon2') lon2: string,
  ) {
    const latitude1 = parseFloat(lat1);
    const longitude1 = parseFloat(lon1);
    const latitude2 = parseFloat(lat2);
    const longitude2 = parseFloat(lon2);

    if (isNaN(latitude1) || isNaN(longitude1) || isNaN(latitude2) || isNaN(longitude2)) {
      return {
        success: false,
        message: '坐标参数无效',
      };
    }

    const distance = this.locationService.calculateDistance(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    );

    return {
      success: true,
      data: {
        distance,
        unit: 'km',
      },
    };
  }

  /**
   * 获取客户端真实IP地址
   */
  private getClientIP(req: Request): string {
    // 尝试从各种头部获取真实IP
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIP = req.headers['x-real-ip'] as string;
    const cfConnectingIP = req.headers['cf-connecting-ip'] as string;
    
    if (forwarded) {
      // x-forwarded-for 可能包含多个IP，取第一个
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
    
    // 最后使用连接IP
    return req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
  }
}
