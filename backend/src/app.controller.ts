import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppService } from './app.service';
import { CategoriesService } from './modules/categories/categories.service';
import {
  User,
  Category,
  Complaint,
  ComplaintStatus,
  Evidence,
  EvidenceStatus,
} from './entities';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly categoriesService: CategoriesService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Complaint)
    private readonly complaintsRepository: Repository<Complaint>,
    @InjectRepository(Evidence)
    private readonly evidencesRepository: Repository<Evidence>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')
  async seed() {
    await this.categoriesService.seedCategories();

    const adminEmail = 'admin@sikayetimvar.com';
    const adminPassword = 'Admin123!';

    let adminUser = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = this.usersRepository.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Sistem',
        lastName: 'Yonetici',
        isAdmin: true,
        rank: 'Director',
        points: 180,
        approvedCount: 12,
      });
      await this.usersRepository.save(adminUser);
    } else if (!adminUser.isAdmin || adminUser.rank !== 'Director') {
      adminUser.isAdmin = true;
      adminUser.rank = 'Director';
      if (adminUser.points < 151) {
        adminUser.points = 151;
      }
      await this.usersRepository.save(adminUser);
    }

    const demoUsers = [
      {
        email: 'ayse.demo@sikayetimvar.com',
        firstName: 'Ayse',
        lastName: 'Demir',
        password: 'Demo123!',
      },
      {
        email: 'mehmet.demo@sikayetimvar.com',
        firstName: 'Mehmet',
        lastName: 'Kaya',
        password: 'Demo123!',
      },
      {
        email: 'zeynep.demo@sikayetimvar.com',
        firstName: 'Zeynep',
        lastName: 'Aydin',
        password: 'Demo123!',
      },
    ];

    const createdDemoUsers: User[] = [];
    for (const demoUser of demoUsers) {
      let user = await this.usersRepository.findOne({
        where: { email: demoUser.email },
      });
      if (!user) {
        const hashedPassword = await bcrypt.hash(demoUser.password, 10);
        user = this.usersRepository.create({
          email: demoUser.email,
          password: hashedPassword,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          isAdmin: false,
          rank: 'Recruit',
          points: 0,
          approvedCount: 0,
        });
        user = await this.usersRepository.save(user);
      }
      createdDemoUsers.push(user);
    }

    const categories = await this.categoriesRepository.find();
    const complaintCount = await this.complaintsRepository.count();

    if (categories.length > 0 && complaintCount === 0) {
      const demoComplaints = [
        {
          title: 'Kredi karti aidati iadesi yapilmadi',
          companyName: 'Anadolu Bank',
          content:
            'Banka tarafindan yillik kart aidati cekildi. Tuketici haklari kapsaminda iade talep ettim ancak donus alamadim.',
          status: ComplaintStatus.OPEN,
          viewCount: 38,
          likeCount: 12,
          commentCount: 4,
        },
        {
          title: 'Internet hizi taahhut edilen degerin altinda',
          companyName: 'FiberNet Iletisim',
          content:
            'Son iki haftadir internet hizi ciddi sekilde dusuk. Teknik destek kaydi actim fakat kalici cozum sunulmadi.',
          status: ComplaintStatus.PENDING,
          viewCount: 54,
          likeCount: 16,
          commentCount: 7,
        },
        {
          title: 'Siparis edilen urun eksik teslim edildi',
          companyName: 'HizliSepet',
          content:
            'E-ticaret siparisimde 3 urun olmasi gerekirken 2 urun teslim edildi. Iade sureci de yavas ilerliyor.',
          status: ComplaintStatus.OPEN,
          viewCount: 29,
          likeCount: 9,
          commentCount: 3,
        },
        {
          title: 'Otel rezervasyonu tek tarafli iptal edildi',
          companyName: 'BlueWave Hotels',
          content:
            'On odemesi yapilan rezervasyon, giris tarihine 24 saat kala herhangi bir alternatif sunulmadan iptal edildi.',
          status: ComplaintStatus.RESOLVED,
          viewCount: 62,
          likeCount: 21,
          commentCount: 10,
        },
        {
          title: 'Arac servisinde fatura disi ucret talebi',
          companyName: 'OtoPlus Servis',
          content:
            'Yetkili servis, onceden bildirilmeyen ek ucret talep etti ve detayli fatura sunmadi.',
          status: ComplaintStatus.APPROVED,
          viewCount: 47,
          likeCount: 11,
          commentCount: 5,
        },
        {
          title: 'Elektrik faturasi anormal yuksek geldi',
          companyName: 'EnerjiDagitim AS',
          content:
            'Gecen aya gore tuketim benzer olmasina ragmen faturam neredeyse iki katina cikti. Sayaç kontrolu talep ettim.',
          status: ComplaintStatus.OPEN,
          viewCount: 33,
          likeCount: 8,
          commentCount: 2,
        },
      ];

      const createdComplaints: Complaint[] = [];
      for (let i = 0; i < demoComplaints.length; i += 1) {
        const owner = createdDemoUsers[i % createdDemoUsers.length];
        const category = categories[i % categories.length];
        const complaint = this.complaintsRepository.create({
          ...demoComplaints[i],
          user: { id: owner.id },
          category: { id: category.id },
        });
        createdComplaints.push(await this.complaintsRepository.save(complaint));
      }

      const evidences = [
        {
          fileName: 'banka-ekstresi.pdf',
          fileUrl: '/uploads/demo-banka-ekstresi.pdf',
          description: 'Aidat kesintisini gosteren kredi karti ekstresi',
          status: EvidenceStatus.PENDING,
          complaint: createdComplaints[0],
        },
        {
          fileName: 'hiz-testi-sonucu.png',
          fileUrl: '/uploads/demo-hiz-testi-sonucu.png',
          description:
            'Taahhut edilen hiz ile olculen hiz farkini gosteren ekran goruntusu',
          status: EvidenceStatus.PENDING,
          complaint: createdComplaints[1],
        },
        {
          fileName: 'kargo-teslim-tutanagi.jpg',
          fileUrl: '/uploads/demo-kargo-teslim-tutanagi.jpg',
          description: 'Eksik urun teslimine ait teslim tutanagi',
          status: EvidenceStatus.APPROVED,
          complaint: createdComplaints[2],
        },
        {
          fileName: 'rezervasyon-bilgisi.pdf',
          fileUrl: '/uploads/demo-rezervasyon-bilgisi.pdf',
          description: 'Iptal edilen rezervasyona ait odeme ve onay bilgileri',
          status: EvidenceStatus.REJECTED,
          complaint: createdComplaints[3],
        },
      ];

      await this.evidencesRepository.save(
        evidences.map((evidence) => this.evidencesRepository.create(evidence)),
      );
    }

    const complaintsWithMissingCompany = await this.complaintsRepository
      .createQueryBuilder('complaint')
      .where(
        'complaint.companyName IS NULL OR complaint.companyName = :empty',
        {
          empty: '',
        },
      )
      .getMany();

    for (const complaint of complaintsWithMissingCompany) {
      complaint.companyName = 'Belirtilmeyen Firma';
      await this.complaintsRepository.save(complaint);
    }

    const seededComplaintCount = await this.complaintsRepository.count();
    const pendingEvidenceCount = await this.evidencesRepository.count({
      where: { status: EvidenceStatus.PENDING },
    });

    return {
      message: 'Seeding completed successfully',
      adminCredentials: {
        email: adminEmail,
        password: adminPassword,
      },
      demoUserPassword: 'Demo123!',
      totals: {
        users: await this.usersRepository.count(),
        complaints: seededComplaintCount,
        pendingEvidences: pendingEvidenceCount,
      },
    };
  }
}
