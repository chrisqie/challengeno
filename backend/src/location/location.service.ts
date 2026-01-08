import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface LocationInfo {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  continent_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  currency: string;
  languages: string;
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * 根据IP地址获取地理位置信息
   * 使用ipapi.co免费API
   */
  async getLocationByIP(ip?: string): Promise<LocationInfo | null> {
    try {
      // 处理IP地址格式
      let cleanIP = ip;
      if (cleanIP) {
        // 移除IPv6映射前缀
        if (cleanIP.startsWith('::ffff:')) {
          cleanIP = cleanIP.substring(7);
        }

        // 如果是本地IP或无效IP，使用自动检测
        if (cleanIP === '127.0.0.1' || cleanIP === '::1' || cleanIP === 'localhost' || !cleanIP.includes('.')) {
          cleanIP = '';
        }
      }

      // 如果没有提供IP或IP无效，获取客户端IP的位置
      const url = cleanIP
        ? `https://ipapi.co/${cleanIP}/json/`
        : 'https://ipapi.co/json/';

      this.logger.log(`Fetching location for IP: ${cleanIP || 'auto-detect'}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'bet-together-app/1.0'
          }
        })
      );

      if (response.data.error) {
        this.logger.warn(`IP API error: ${response.data.reason}`);

        // 如果指定IP失败，尝试自动检测
        if (cleanIP) {
          this.logger.log('Retrying with auto-detection...');
          return this.getLocationByIP('');
        }

        return null;
      }

      const locationData: LocationInfo = {
        ip: response.data.ip,
        city: response.data.city || '',
        region: response.data.region || '',
        region_code: response.data.region_code || '',
        country: response.data.country || response.data.country_code || '',
        country_name: response.data.country_name || '',
        country_code: response.data.country_code || '',
        continent_code: response.data.continent_code || '',
        latitude: parseFloat(response.data.latitude) || 0,
        longitude: parseFloat(response.data.longitude) || 0,
        timezone: response.data.timezone || '',
        utc_offset: response.data.utc_offset || '',
        currency: response.data.currency || '',
        languages: response.data.languages || '',
      };

      this.logger.log(`Location found: ${locationData.city}, ${locationData.country_name}`);
      return locationData;

    } catch (error) {
      this.logger.error(`Failed to get location for IP ${ip}:`, error.message);
      return null;
    }
  }

  /**
   * 获取特定字段的位置信息
   */
  async getLocationField(field: string, ip?: string): Promise<string | null> {
    try {
      const url = ip 
        ? `https://ipapi.co/${ip}/${field}/`
        : `https://ipapi.co/${field}/`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 3000,
          headers: {
            'User-Agent': 'bet-together-app/1.0'
          }
        })
      );

      return response.data || null;

    } catch (error) {
      this.logger.error(`Failed to get ${field} for IP ${ip}:`, error.message);
      return null;
    }
  }

  /**
   * 计算两个地理位置之间的距离（公里）
   * 使用Haversine公式
   */
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // 地球半径（公里）
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // 保留两位小数
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * 根据国家代码获取国旗emoji
   */
  getCountryFlag(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) {
      return '🌍'; // 默认地球图标
    }

    const flagMap: Record<string, string> = {
      'CN': '🇨🇳', 'US': '🇺🇸', 'JP': '🇯🇵', 'KR': '🇰🇷', 'GB': '🇬🇧',
      'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹', 'ES': '🇪🇸', 'RU': '🇷🇺',
      'IN': '🇮🇳', 'BR': '🇧🇷', 'CA': '🇨🇦', 'AU': '🇦🇺', 'MX': '🇲🇽',
      'TH': '🇹🇭', 'VN': '🇻🇳', 'SG': '🇸🇬', 'MY': '🇲🇾', 'ID': '🇮🇩',
      'PH': '🇵🇭', 'TW': '🇹🇼', 'HK': '🇭🇰', 'MO': '🇲🇴'
    };

    return flagMap[countryCode.toUpperCase()] || '🌍';
  }

  /**
   * 格式化位置显示文本
   */
  formatLocationDisplay(location: LocationInfo): string {
    const parts = [];
    
    if (location.city) parts.push(location.city);
    if (location.region && location.region !== location.city) {
      parts.push(location.region);
    }
    if (location.country_name) parts.push(location.country_name);
    
    return parts.join(', ') || '未知位置';
  }

  /**
   * 检查两个位置是否在指定距离范围内
   */
  isWithinDistance(
    location1: { latitude: number; longitude: number },
    location2: { latitude: number; longitude: number },
    maxDistanceKm: number
  ): boolean {
    const distance = this.calculateDistance(
      location1.latitude,
      location1.longitude,
      location2.latitude,
      location2.longitude
    );
    
    return distance <= maxDistanceKm;
  }

  /**
   * 获取常见国家列表（用于下拉选择）
   */
  getCommonCountries(): Array<{ code: string; name: string; flag: string }> {
    return [
      { code: 'CN', name: '中国', flag: '🇨🇳' },
      { code: 'US', name: '美国', flag: '🇺🇸' },
      { code: 'JP', name: '日本', flag: '🇯🇵' },
      { code: 'KR', name: '韩国', flag: '🇰🇷' },
      { code: 'GB', name: '英国', flag: '🇬🇧' },
      { code: 'FR', name: '法国', flag: '🇫🇷' },
      { code: 'DE', name: '德国', flag: '🇩🇪' },
      { code: 'CA', name: '加拿大', flag: '🇨🇦' },
      { code: 'AU', name: '澳大利亚', flag: '🇦🇺' },
      { code: 'SG', name: '新加坡', flag: '🇸🇬' },
      { code: 'TH', name: '泰国', flag: '🇹🇭' },
      { code: 'MY', name: '马来西亚', flag: '🇲🇾' },
      { code: 'VN', name: '越南', flag: '🇻🇳' },
      { code: 'IN', name: '印度', flag: '🇮🇳' },
      { code: 'BR', name: '巴西', flag: '🇧🇷' },
      { code: 'RU', name: '俄罗斯', flag: '🇷🇺' },
    ];
  }
}
