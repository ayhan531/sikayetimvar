import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ComplaintsService } from './complaints.service';
import { CreateCommentDto, CreateComplaintDto } from './dto/complaint.dto';
import { JwtGuard } from '../auth/jwt.guard';

type AuthenticatedRequest = Request & { user: { userId: number } };

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
};

@Controller('/api/complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createComplaint(
    @Body() createComplaintDto: CreateComplaintDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; complaint: unknown; pointsInfo: string }> {
    try {
      const complaint = await this.complaintsService.createComplaint(
        req.user.userId,
        createComplaintDto.categoryId,
        createComplaintDto,
      );
      return {
        message: 'Complaint created successfully',
        complaint,
        pointsInfo:
          'Sikayet olusturma puani eklendi. Ayni firmaya ait diger kullanici sikayetleri varsa bonus puan da verildi.',
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Get('trending')
  async getTrendingComplaints(
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    const complaints =
      await this.complaintsService.getTrendingComplaints(limit);
    return complaints;
  }

  @Get('search')
  async searchComplaints(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    return this.complaintsService.searchComplaints(query, page, limit);
  }

  @Get('category/:categoryId')
  async getComplaintsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    return this.complaintsService.getComplaintsByCategory(
      categoryId,
      page,
      limit,
    );
  }

  @Get(':id')
  async getComplaintById(@Param('id') id: number): Promise<unknown> {
    const complaint = await this.complaintsService.getComplaintById(id);
    if (!complaint) {
      throw new HttpException('Complaint not found', HttpStatus.NOT_FOUND);
    }
    return complaint;
  }

  @Get()
  async getAllComplaints(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<unknown> {
    return this.complaintsService.getAllComplaints(page, limit);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteComplaint(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    const complaint = await this.complaintsService.getComplaintById(id);
    if (!complaint) {
      throw new HttpException('Complaint not found', HttpStatus.NOT_FOUND);
    }
    if (complaint.user.id !== req.user.userId) {
      throw new HttpException(
        'You can only delete your own complaints',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.complaintsService.deleteComplaint(id);
    return { message: 'Complaint deleted successfully' };
  }

  @Post(':id/like')
  @UseGuards(JwtGuard)
  async toggleLike(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ liked: boolean; likeCount: number }> {
    try {
      return this.complaintsService.toggleLike(id, req.user.userId);
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: number): Promise<unknown> {
    return this.complaintsService.getComments(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtGuard)
  async addComment(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<{ message: string; comment: unknown }> {
    try {
      const comment = await this.complaintsService.addComment(
        id,
        req.user.userId,
        createCommentDto,
      );

      return {
        message: 'Comment added successfully',
        comment,
      };
    } catch (error) {
      throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST);
    }
  }
}
