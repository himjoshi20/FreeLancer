import { io, Socket } from 'socket.io-client';

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  skills: Skill[];
  lookingFor: Skill[];
}

class SkillMatchingService {
  private socket: Socket | null = null;
  private static instance: SkillMatchingService;

  private constructor() {}

  static getInstance(): SkillMatchingService {
    if (!SkillMatchingService.instance) {
      SkillMatchingService.instance = new SkillMatchingService();
    }
    return SkillMatchingService.instance;
  }

  connect(): void {
    this.socket = io('http://localhost:3001');
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  updateUser(user: User): void {
    if (this.socket) {
      this.socket.emit('updateUser', user);
    }
  }

  onMatchFound(callback: (matchedUser: User) => void): void {
    if (this.socket) {
      this.socket.on('matchFound', callback);
    }
  }

  removeMatchFoundListener(callback: (matchedUser: User) => void): void {
    if (this.socket) {
      this.socket.off('matchFound', callback);
    }
  }

  requestMatches(userId: string): void {
    if (this.socket) {
      this.socket.emit('requestMatches', userId);
    }
  }
}

export const skillMatchingService = SkillMatchingService.getInstance();
export type { Skill, User }; 