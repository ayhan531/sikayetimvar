import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    const category = this.categoriesRepository.create({
      name,
      description,
    });
    return this.categoriesRepository.save(category);
  }

  async seedCategories(): Promise<void> {
    const existingCategories = await this.categoriesRepository.count();
    if (existingCategories > 0) {
      console.log('Categories already exist');
      return;
    }

    const categories = [
      {
        name: 'Banka ve Finans',
        description: 'Banka ve finans hizmetleri ile ilgili şikayetler',
      },
      {
        name: 'Telekomünikasyon',
        description: 'Telefon ve internet servis sağlayıcıları',
      },
      {
        name: 'E-Ticaret',
        description: 'Online alışveriş siteleri ve hizmetleri',
      },
      {
        name: 'Gıda ve İçecek',
        description: 'Yiyecek, içecek ve tarım ürünleri',
      },
      { name: 'Otomotiv', description: 'Otomobil ve araç servisleri' },
      {
        name: 'Turizm ve Otelcilik',
        description: 'Seyahat ve konaklama hizmetleri',
      },
      { name: 'Sağlık ve İlaç', description: 'Tıbbi hizmetler ve eczaneler' },
      { name: 'Eğitim', description: 'Öğretim kurumları ve eğitim hizmetleri' },
      { name: 'Sigortacılık', description: 'Sigorta şirketleri ve hizmetleri' },
      { name: 'Elektrik ve Su', description: 'Kamu hizmetleri' },
    ];

    for (const cat of categories) {
      await this.createCategory(cat.name, cat.description);
    }

    console.log('Categories seeded successfully');
  }
}
