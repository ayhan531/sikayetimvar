import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { ApproveEvidenceDto } from './dto/evidence.dto';
import { JwtGuard } from '../auth/jwt.guard';

type AuthenticatedRequest = Request & { user: { userId: number } };

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
};

const getUploadedFilename = (file: unknown): string | null => {
  if (
    typeof file === 'object' &&
    file !== null &&
    'filename' in file &&
    typeof (file as { filename: unknown }).filename === 'string'
  ) {
    return (file as { filename: string }).filename;
  }
  return null;
};

@Controller('/api/admin')
@UseGuards(JwtGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('evidence/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') || 10485760,
      },
    }),
  )
  async uploadEvidence(
    @Body() body: { complaintId: number; description: string },
    @UploadedFile() file: unknown,
  ): Promise<{ message: string; evidence: unknown }> {
    const fileName = getUploadedFilename(file);
    if (!fileName) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const evidence = await this.adminService.uploadEvidence(
        body.complaintId,
        fileName,
        `/uploads/${fileName}`,
        body.description,
      );

      return {
        message: 'Evidence uploaded successfully',
        evidence,
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Get('evidence/pending')
  async getPendingEvidences(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    return this.adminService.getPendingEvidences(page, limit);
  }

  @Get('evidence')
  async getAllEvidences(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    return this.adminService.getAllEvidences(page, limit);
  }

  @Get('evidence/:id')
  async getEvidenceById(@Param('id') id: number): Promise<unknown> {
    const evidence = await this.adminService.getEvidenceById(id);
    if (!evidence) {
      throw new HttpException('Evidence not found', HttpStatus.NOT_FOUND);
    }
    return evidence;
  }

  @Post('evidence/:id/approve')
  async approveEvidence(
    @Param('id') id: number,
    @Body() approveDto: ApproveEvidenceDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; approval: unknown }> {
    try {
      const approval = await this.adminService.approveEvidence(
        id,
        req.user.userId,
        approveDto.approved,
        approveDto.feedback,
      );

      return {
        message: approveDto.approved
          ? 'Evidence approved successfully'
          : 'Evidence rejected successfully',
        approval,
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Get('stats')
  async getAdminStats(@Req() req: AuthenticatedRequest): Promise<unknown> {
    return this.adminService.getAdminStats(req.user.userId);
  }

  @Get('dashboard')
  async getDashboardStats(): Promise<unknown> {
    return this.adminService.getDashboardStats();
  }

  @Get('approvals')
  async getApprovalHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    return this.adminService.getApprovalHistory(page, limit);
  }
}
