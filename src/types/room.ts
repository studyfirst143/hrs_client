// client/src/types/room.ts
export type RoomStatus = "available" | "occupied" | "inactive" | "maintenance";

export interface Room {
  _id: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  image?: string;
}
