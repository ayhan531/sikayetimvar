import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidence, EvidenceStatus, AdminApproval, User, Complaint, Category } from '../../entities';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Evidence)
    private evidencesRepository: Repository<Evidence>,
    @InjectRepository(AdminApproval)
    private approvalsRepository: Repository<AdminApproval>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private usersService: UsersService,
  ) {}

  async uploadEvidence(
    complaintId: number,
    fileName: string,
    fileUrl: string,
    description: string,
  ): Promise<Evidence> {
    const evidence = this.evidencesRepository.create({
      fileName,
      fileUrl,
      description,
      status: EvidenceStatus.PENDING,
      complaint: { id: complaintId },
    });
    return this.evidencesRepository.save(evidence);
  }

  async getPendingEvidences(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const [evidences, total] = await this.evidencesRepository.findAndCount({
      where: { status: EvidenceStatus.PENDING },
      relations: ['complaint', 'complaint.user'],
      order: { uploadedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: evidences,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getAllEvidences(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const [evidences, total] = await this.evidencesRepository.findAndCount({
      relations: ['complaint', 'complaint.user'],
      order: { uploadedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: evidences,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getEvidenceById(id: number): Promise<Evidence | null> {
    return this.evidencesRepository.findOne({
      where: { id },
      relations: ['complaint', 'complaint.user', 'approvals'],
    });
  }

  async approveEvidence(
    evidenceId: number,
    adminId: number,
    approved: boolean,
    feedback?: string,
  ): Promise<AdminApproval> {
    const evidence = await this.getEvidenceById(evidenceId);
    if (!evidence) {
      throw new HttpException('Evidence not found', HttpStatus.NOT_FOUND);
    }

    const pointsGained = approved ? 1 : 0;

    const approval = this.approvalsRepository.create({
      evidence,
      admin: { id: adminId },
      approved,
      feedback,
      pointsGained,
    });

    const savedApproval = await this.approvalsRepository.save(approval);

    evidence.status = approved
      ? EvidenceStatus.APPROVED
      : EvidenceStatus.REJECTED;
    await this.evidencesRepository.save(evidence);

    if (approved) {
      await this.usersService.addPoints(adminId, pointsGained);
    }

    return savedApproval;
  }

  async getApprovalHistory(page: number = 1, limit: number = 10): Promise<any> {
    const [approvals, total] = await this.approvalsRepository.findAndCount({
      relations: ['evidence', 'evidence.complaint', 'admin'],
      order: { approvedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: approvals,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getAdminStats(adminId: number): Promise<any> {
    const admin = await this.usersService.findById(adminId);
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    const approvedCount = await this.approvalsRepository.count({
      where: {
        admin: { id: adminId },
        approved: true,
      },
    });

    const rejectedCount = await this.approvalsRepository.count({
      where: {
        admin: { id: adminId },
        approved: false,
      },
    });

    const pendingEvidences = await this.evidencesRepository.count({
      where: { status: EvidenceStatus.PENDING },
    });

    const totalUsers = await this.usersRepository.count();
    const totalComplaints = await this.complaintsRepository.count();

    return {
      adminId: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      rank: admin.rank,
      totalPoints: admin.points,
      pendingEvidences,
      approvedCount,
      rejectedCount,
      totalApprovals: approvedCount + rejectedCount,
      totalUsers,
      totalComplaints,
      totalEvidences: approvedCount + rejectedCount,
    };
  }

  async getDashboardStats(): Promise<any> {
    const totalUsers = await this.usersRepository.count();
    const totalComplaints = await this.complaintsRepository.count();
    const totalCategories = await this.categoriesRepository.count();
    
    const pendingEvidences = await this.evidencesRepository.count({
      where: { status: EvidenceStatus.PENDING },
    });
    
    const approvedEvidences = await this.evidencesRepository.count({
      where: { status: EvidenceStatus.APPROVED },
    });
    
    const rejectedEvidences = await this.evidencesRepository.count({
      where: { status: EvidenceStatus.REJECTED },
    });

    const totalPoints = await this.usersRepository
      .createQueryBuilder('user')
      .select('SUM(user.points)', 'total')
      .getRawOne();

    const activeUsers = await this.usersRepository.count({
      where: { points: 0 },
    });

    const monthlyComplaints = await this.complaintsRepository
      .createQueryBuilder('complaint')
      .select('DATE_FORMAT(complaint.createdAt, "%Y-%m")', 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(6)
      .getRawMany();

    return {
      totalUsers,
      totalComplaints,
      totalCategories,
      totalPoints: totalPoints?.total || 0,
      activeUsers: totalUsers - activeUsers,
      pendingEvidences,
      approvedEvidences,
      rejectedEvidences,
      monthlyComplaints: monthlyComplaints.reverse(),
    };
  }
}
