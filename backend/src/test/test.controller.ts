import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('test')
export class TestController {
  @Public()
  @Post('upload')
  testUpload(@Body() body: any) {
    const contentLength = body.content?.length || 0;
    const estimatedSize = Math.round((contentLength * 3) / 4);
    
    console.log('Test upload received:', {
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      contentLength,
      estimatedSize: `${(estimatedSize / 1024 / 1024).toFixed(2)} MB`
    });

    return {
      success: true,
      message: 'File received successfully',
      details: {
        fileName: body.fileName,
        fileType: body.fileType,
        originalSize: body.fileSize,
        base64Length: contentLength,
        estimatedSize: estimatedSize,
        estimatedSizeMB: (estimatedSize / 1024 / 1024).toFixed(2)
      }
    };
  }
}

