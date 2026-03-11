// No database storage is required for this application as per user requirements.
export interface IStorage {}

export class MemStorage implements IStorage {}

export const storage = new MemStorage();
