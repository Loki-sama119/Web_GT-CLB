import prisma from "../../config/db.js";
import {
  verifiedWhere,
  activeCampaignWhere,
  visibleUserWhere,
  presentClub,
  isIsolatedTest,
} from "../../utils/dataPolicy.js";
export class ClubsService {
  static async getCategories() {
    return prisma.clubCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: {
            clubs: { where: { status: "ACTIVE", ...verifiedWhere() } },
          },
        },
      },
    });
  }
  static async getClubs({
    category,
    search,
    recruiting,
    page = 1,
    limit = 12,
  }) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(50, Math.max(1, Number(limit) || 12));
    const where = {
      status: "ACTIVE",
      ...verifiedWhere(),
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: ["name", "shortDescription", "description"].map((field) => ({
          [field]: { contains: search, mode: "insensitive" },
        })),
      }),
      ...(recruiting === "true" && {
        campaigns: { some: activeCampaignWhere() },
      }),
    };
    const [total, clubs, assets] = await Promise.all([
      prisma.club.count({ where }),
      prisma.club.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          campaigns: { where: activeCampaignWhere() },
          _count: {
            select: {
              memberships: {
                where: { status: "ACTIVE", user: visibleUserWhere() },
              },
              campaigns: { where: activeCampaignWhere() },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.mediaAsset.findMany({
        where: {
          verificationStatus: "VERIFIED_APPROVED",
          usagePermission: "APPROVED",
        },
      }),
    ]);
    return {
      clubs: clubs.map((club) => presentClub(club, assets)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
  static async getClubBySlug(slug) {
    const club = await prisma.club.findFirst({
      where: { slug, status: "ACTIVE", ...verifiedWhere() },
      include: {
        category: true,
        memberships: {
          where: {
            status: "ACTIVE",
            role: { in: ["LEADER", "VICE_LEADER"] },
            user: visibleUserWhere(),
          },
          include: {
            user: { select: { id: true, email: true, studentProfile: true } },
          },
        },
        campaigns: {
          where: activeCampaignWhere(),
          include: {
            form: {
              include: { questions: { orderBy: { orderIndex: "asc" } } },
            },
          },
        },
        events: {
          where: { isPublic: true, ...verifiedWhere() },
          orderBy: { startTime: "desc" },
          take: 6,
        },
        posts: {
          where: { status: "PUBLISHED", ...verifiedWhere() },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        assets: true,
        _count: {
          select: {
            memberships: {
              where: { status: "ACTIVE", user: visibleUserWhere() },
            },
            events: { where: verifiedWhere() },
            posts: { where: verifiedWhere() },
          },
        },
      },
    });
    if (!club)
      throw Object.assign(
        new Error("Thông tin câu lạc bộ chưa được công bố hoặc không tồn tại"),
        { statusCode: 404 },
      );
    const result = presentClub(club, club.assets);
    delete result.assets;
    return result;
  }
  static async createClub(data) {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return prisma.club.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        meetingSchedule: data.meetingSchedule || null,
        email: data.email || null,
        phone: data.phone || null,
        fanpageUrl: data.fanpageUrl || null,
        status: data.status || (isIsolatedTest() ? "ACTIVE" : "PENDING"),
      },
    });
  }
  static async updateClub(clubId, data) {
    const allowed = [
      "name",
      "slug",
      "shortDescription",
      "description",
      "categoryId",
      "meetingSchedule",
      "email",
      "phone",
      "fanpageUrl",
    ];
    const editable = Object.fromEntries(
      allowed
        .filter((key) => data[key] !== undefined)
        .map((key) => [key, data[key]]),
    );
    return prisma.club.update({
      where: { id: clubId },
      data: {
        ...editable,
        ...(!isIsolatedTest() && {
          dataClassification: "REAL_UNVERIFIED",
          verifiedAt: null,
        }),
      },
    });
  }
}
