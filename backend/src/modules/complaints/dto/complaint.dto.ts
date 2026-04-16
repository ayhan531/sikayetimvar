export class CreateComplaintDto {
  title: string;
  content: string;
  companyName: string;
  categoryId: number;
}

export class CreateCommentDto {
  content: string;
}

export class ComplaintResponseDto {
  id: number;
  title: string;
  content: string;
  companyName: string;
  status: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    rank: string;
  };
  category: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
