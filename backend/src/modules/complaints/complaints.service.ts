import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Complaint,
  ComplaintComment,
  ComplaintLike,
  ComplaintStatus,
  UserPointEvent,
} from '../../entities';
import { CreateCommentDto, CreateComplaintDto } from './dto/complaint.dto';
import { POINT_RULES, UsersService } from '../users/users.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
    @InjectRepository(ComplaintLike)
    private likesRepository: Repository<ComplaintLike>,
    @InjectRepository(ComplaintComment)
    private commentsRepository: Repository<ComplaintComment>,
    @InjectRepository(UserPointEvent)
    private pointEventsRepository: Repository<UserPointEvent>,
    private usersService: UsersService,
  ) {}

  private normalizeCompanyName(companyName: string): string {
    return companyName.trim().toLocaleLowerCase('tr-TR');
  }

  private async awardPointsOnce(
    userId: number,
    actionType: string,
    referenceKey: string,
    points: number,
  ): Promise<boolean> {
    const existingEvent = await this.pointEventsRepository.findOne({
      where: {
        user: { id: userId },
        actionType,
        referenceKey,
      },
      relations: ['user'],
    });

    if (existingEvent) {
      return false;
    }

    const event = this.pointEventsRepository.create({
      user: { id: userId },
      actionType,
      referenceKey,
      points,
    });
    await this.pointEventsRepository.save(event);
    await this.usersService.addActivityPoints(userId, points);

    return true;
  }

  private async assertCommentNotSpam(
    complaintId: number,
    userId: number,
    content: string,
  ): Promise<void> {
    const now = Date.now();
    const twoMinutesAgo = new Date(now - 2 * 60 * 1000);
    const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000);

    const recentUserCommentCount = await this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.userId = :userId', { userId })
      .andWhere('comment.createdAt >= :twoMinutesAgo', { twoMinutesAgo })
      .getCount();

    if (recentUserCommentCount >= 3) {
      throw new Error(
        'Cok hizli yorum yapiyorsunuz. Lutfen biraz bekleyip tekrar deneyin.',
      );
    }

    const duplicateRecentComment = await this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.userId = :userId', { userId })
      .andWhere('comment.complaintId = :complaintId', { complaintId })
      .andWhere('LOWER(comment.content) = :content', {
        content: content.toLocaleLowerCase('tr-TR'),
      })
      .andWhere('comment.createdAt >= :thirtyMinutesAgo', { thirtyMinutesAgo })
      .getOne();

    if (duplicateRecentComment) {
      throw new Error(
        'Ayni yorumu kisa surede tekrar paylasamazsiniz. Lutfen farkli bir aciklama ekleyin.',
      );
    }
  }

  async createComplaint(
    userId: number,
    categoryId: number,
    dto: CreateComplaintDto,
  ): Promise<Complaint> {
    const normalizedCompanyName = this.normalizeCompanyName(dto.companyName);
    const sameCompanyCount = await this.complaintsRepository
      .createQueryBuilder('complaint')
      .where('LOWER(complaint.companyName) = :companyName', {
        companyName: normalizedCompanyName,
      })
      .andWhere('complaint.userId != :userId', { userId })
      .getCount();

    const complaint = this.complaintsRepository.create({
      title: dto.title,
      content: dto.content,
      companyName: dto.companyName.trim(),
      status: ComplaintStatus.OPEN,
      user: { id: userId },
      category: { id: categoryId },
    });
    const createdComplaint = await this.complaintsRepository.save(complaint);

    const bonusPoints =
      POINT_RULES.COMPLAINT_CREATE +
      (sameCompanyCount > 0 ? POINT_RULES.SAME_COMPANY_REPORT : 0);
    await this.usersService.addActivityPoints(userId, bonusPoints);

    return createdComplaint;
  }

  async getComplaintById(id: number): Promise<Complaint | null> {
    const complaint = await this.complaintsRepository.findOne({
      where: { id },
      relations: [
        'user',
        'category',
        'evidences',
        'comments',
        'comments.user',
        'likes',
      ],
    });

    if (complaint) {
      complaint.viewCount += 1;
      await this.complaintsRepository.save(complaint);
    }

    return complaint;
  }

  async getAllComplaints(page: number = 1, limit: number = 10): Promise<any> {
    const [complaints, total] = await this.complaintsRepository.findAndCount({
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: complaints,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getComplaintsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const [complaints, total] = await this.complaintsRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: complaints,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async searchComplaints(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const [complaints, total] = await this.complaintsRepository
      .createQueryBuilder('complaint')
      .where('complaint.title LIKE :query', { query: `%${query}%` })
      .orWhere('complaint.content LIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('complaint.user', 'user')
      .leftJoinAndSelect('complaint.category', 'category')
      .orderBy('complaint.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: complaints,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async updateComplaintStatus(
    id: number,
    status: ComplaintStatus,
  ): Promise<Complaint | null> {
    const complaint = await this.getComplaintById(id);
    if (!complaint) {
      return null;
    }
    complaint.status = status;
    return this.complaintsRepository.save(complaint);
  }

  async deleteComplaint(id: number): Promise<void> {
    await this.complaintsRepository.delete(id);
  }

  async getTrendingComplaints(limit: number = 10): Promise<Complaint[]> {
    return this.complaintsRepository.find({
      relations: ['user', 'category', 'likes'],
      order: { viewCount: 'DESC', likeCount: 'DESC' },
      take: limit,
    });
  }

  async toggleLike(
    complaintId: number,
    userId: number,
  ): Promise<{ liked: boolean; likeCount: number }> {
    const complaint = await this.complaintsRepository.findOne({
      where: { id: complaintId },
      relations: ['user'],
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        complaint: { id: complaintId },
        user: { id: userId },
      },
      relations: ['complaint', 'user'],
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      complaint.likeCount = Math.max(complaint.likeCount - 1, 0);
      await this.complaintsRepository.save(complaint);
      return { liked: false, likeCount: complaint.likeCount };
    }

    const newLike = this.likesRepository.create({
      complaint: { id: complaintId },
      user: { id: userId },
    });
    await this.likesRepository.save(newLike);

    complaint.likeCount += 1;
    await this.complaintsRepository.save(complaint);

    await this.awardPointsOnce(
      userId,
      'LIKE_GIVEN',
      `complaint:${complaintId}`,
      POINT_RULES.LIKE_GIVEN,
    );
    if (complaint.user.id !== userId) {
      await this.awardPointsOnce(
        complaint.user.id,
        'LIKE_RECEIVED',
        `complaint:${complaintId}:from:${userId}`,
        POINT_RULES.LIKE_RECEIVED,
      );
    }

    return { liked: true, likeCount: complaint.likeCount };
  }

  async addComment(
    complaintId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<ComplaintComment> {
    const trimmedContent = dto.content.trim();
    const complaint = await this.complaintsRepository.findOne({
      where: { id: complaintId },
    });
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    await this.assertCommentNotSpam(complaintId, userId, trimmedContent);

    const comment = this.commentsRepository.create({
      content: trimmedContent,
      complaint: { id: complaintId },
      user: { id: userId },
    });

    const savedComment = await this.commentsRepository.save(comment);
    complaint.commentCount += 1;
    await this.complaintsRepository.save(complaint);

    await this.usersService.addActivityPoints(
      userId,
      POINT_RULES.COMMENT_GIVEN,
    );
    return savedComment;
  }

  async getComments(complaintId: number): Promise<ComplaintComment[]> {
    return this.commentsRepository.find({
      where: { complaint: { id: complaintId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
