export const CLASSIFICATIONS = [
  "REAL_VERIFIED",
  "REAL_UNVERIFIED",
  "DEMO",
  "E2E_TEST",
  "PLACEHOLDER",
  "UNKNOWN",
];
export function databaseName(url = process.env.DATABASE_URL) {
  try {
    return new URL(url).pathname.slice(1);
  } catch {
    return "";
  }
}
export function isIsolatedTest() {
  return (
    process.env.NODE_ENV === "test" &&
    ["club_portal_e2e", "club_portal_test"].includes(databaseName())
  );
}
export function assertTestDatabase() {
  if (process.env.NODE_ENV === "test" && !isIsolatedTest())
    throw new Error(
      "Test runtime requires club_portal_e2e or club_portal_test",
    );
}
export const verifiedWhere = () =>
  isIsolatedTest()
    ? {}
    : {
        dataClassification: "REAL_VERIFIED",
        sourceUrl: { not: null },
        verifiedAt: { not: null },
      };
export const visibleUserWhere = () =>
  isIsolatedTest()
    ? {}
    : { dataClassification: { notIn: ["DEMO", "E2E_TEST", "PLACEHOLDER"] } };
export const managedContentWhere = () =>
  isIsolatedTest()
    ? {}
    : { dataClassification: { notIn: ["DEMO", "E2E_TEST", "PLACEHOLDER"] } };
export const activeCampaignWhere = () => ({
  ...verifiedWhere(),
  status: "OPEN",
  startDate: { lte: new Date() },
  endDate: { gte: new Date() },
});
export function isPublicRecord(record) {
  return (
    isIsolatedTest() ||
    (record?.dataClassification === "REAL_VERIFIED" &&
      record.sourceUrl &&
      record.verifiedAt)
  );
}
export function approvedAsset(asset) {
  return (
    asset?.verificationStatus === "VERIFIED_APPROVED" &&
    asset.usagePermission === "APPROVED" &&
    asset.sourceUrl &&
    asset.verifiedAt
  );
}
export function presentClub(club, assets = []) {
  if (isIsolatedTest()) return club;
  const own = assets.filter((a) => a.clubId === club.id && approvedAsset(a));
  return {
    ...club,
    logoUrl:
      own.find((a) => a.type === "LOGO" && a.url === club.logoUrl)?.url || null,
    coverUrl:
      own.find((a) => a.type === "COVER" && a.url === club.coverUrl)?.url ||
      null,
  };
}
