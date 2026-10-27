import React from 'react';

/**
 * Tạo chữ viết tắt monogram thông minh từ tên câu lạc bộ
 * Loại bỏ tiền tố "CLB", "Câu lạc bộ" để lấy 2 chữ cái đại diện chính
 */
function getMonogram(name = '') {
  if (!name) return 'CL';
  const cleanName = name
    .replace(/^CLB\s+/i, '')
    .replace(/^Câu lạc bộ\s+/i, '')
    .trim();

  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Sinh gradient màu sắc hài hòa theo thể loại CLB
 */
function getCategoryGradient(categorySlug = '', clubName = '') {
  if (categorySlug.includes('hoc-thuat') || categorySlug.includes('tech') || clubName.includes('Tech')) {
    return 'from-[#142B49] to-[#1E4B7A] text-white';
  }
  if (categorySlug.includes('tinh-nguyen') || categorySlug.includes('xanh') || clubName.includes('Tình Nguyện')) {
    return 'from-[#167C66] to-[#259A80] text-white';
  }
  if (categorySlug.includes('the-thao') || clubName.includes('Bóng') || clubName.includes('Cầu Lông')) {
    return 'from-[#0D5C75] to-[#148A9C] text-white';
  }
  if (categorySlug.includes('nghe-thuat') || categorySlug.includes('am-nhac') || clubName.includes('Guitar')) {
    return 'from-[#7C3AED] to-[#A855F7] text-white';
  }
  return 'from-[#142B49] to-[#167C66] text-white';
}

export default function ClubLogo({
  logoUrl,
  name = '',
  categorySlug = '',
  size = 'md', // sm (36px) | md (48px) | lg (64px) | xl (80px)
  className = ''
}) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const sizeClasses = {
    sm: 'w-9 h-9 rounded-xl text-xs font-bold',
    md: 'w-12 h-12 rounded-xl text-sm font-extrabold',
    lg: 'w-16 h-16 rounded-2xl text-lg font-black',
    xl: 'w-20 h-20 rounded-2xl text-2xl font-black'
  };

  const monogram = getMonogram(name);
  const gradient = getCategoryGradient(categorySlug, name);

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={`Logo ${name}`}
        className={`object-cover bg-white border border-slate-200/80 shadow-2xs shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center tracking-wider shadow-xs select-none shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={name}
      aria-label={`Logo đại diện ${name}`}
    >
      {monogram}
    </div>
  );
}

