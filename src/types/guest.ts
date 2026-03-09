export interface Guest {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string; // optional para walang TS error
}
