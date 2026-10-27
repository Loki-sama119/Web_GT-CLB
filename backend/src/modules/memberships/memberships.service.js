import prisma from '../../config/db.js';

export class MembershipsService {
  static async getClubMembers(clubId) {
    return prisma.clubMembership.findMany({
      where: {
        clubId,
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            studentProfile: true
          }
        }
      },
      orderBy: [
        { role: 'asc' }, // LEADER -> VICE_LEADER -> MEMBER
        { joinedAt: 'asc' }
      ]
    });
  }

  static async updateMemberRole(clubId, memberId, role) {
    return prisma.clubMembership.update({
      where: { id: memberId },
      data: { role }
    });
  }

  static async removeMember(clubId, memberId) {
    return prisma.clubMembership.update({
      where: { id: memberId },
      data: { status: 'INACTIVE' }
    });
  }
}
