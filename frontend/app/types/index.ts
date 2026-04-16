export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
  rank: string;
  isAdmin?: boolean;
  phone?: string;
  city?: string;
  bio?: string;
  profileImage?: string;
  profileCompleted?: boolean;
  approvedCount: number;
  createdAt: Date;
}

export interface Complaint {
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
  evidences: Evidence[];
  comments?: ComplaintComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplaintComment {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    rank: string;
  };
}

export interface Evidence {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  description: string;
  status: string;
  uploadedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  complaintCount: number;
}

export interface AdminApproval {
  id: number;
  approved: boolean;
  feedback: string;
  pointsGained: number;
  approvedAt: Date;
  admin: User;
}
