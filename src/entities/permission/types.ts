export interface Permission {
  id: number;
  userId: number;
  floorId: number;
  relayChannel: number;
  grantedAt: Date;
}

export interface ACLEntry {
  userId: number;
  relayMask: number;
}
