export interface RFIDCard {
  id: number;
  userId: number;
  cardUID: string;
  sectorKey: string;
  cardToken: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface CardToken {
  token: string;
  sectorKey: string;
  expiresAt: number;
  cardUID: string;
}
