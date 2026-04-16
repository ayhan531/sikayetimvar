export class CreateEvidenceDto {
  description: string;
  complaintId: number;
}

export class ApproveEvidenceDto {
  approved: boolean;
  feedback?: string;
}

export class EvidenceResponseDto {
  id: number;
  fileName: string;
  fileUrl: string;
  description: string;
  status: string;
  complaint: {
    id: number;
    title: string;
  };
  uploadedAt: Date;
}
