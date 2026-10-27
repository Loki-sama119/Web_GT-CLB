import React from "react";
import { Link } from "react-router-dom";
import BrandWordmark from "./ui/BrandWordmark";
export default function Footer() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-container">
        <div className="footer-top">
          <BrandWordmark variant="dark" />
          <p>
            Một nơi để tìm thấy cộng đồng
            <br />
            và những trải nghiệm ngoài giảng đường.
          </p>
          <a href="https://bafu.edu.vn/" target="_blank" rel="noreferrer">
            Website Trường Đại học
            <br />
            Nông – Lâm Bắc Giang ↗
          </a>
        </div>
        <div className="footer-links">
          <Link to="/clubs">Danh bạ CLB</Link>
          <Link to="/events">Sự kiện</Link>
          <Link to="/student/dashboard">Hồ sơ sinh viên</Link>
          <Link to="/privacy-policy">Quyền riêng tư</Link>
          <Link to="/terms-of-service">Điều khoản sử dụng</Link>
        </div>
        <div className="footer-bottom">
          <span>BAFU Campus Clubs · Dự án cổng thông tin sinh viên</span>
          <span>
            Bản thí điểm · Chưa phải website chính thức được nhà trường phê
            duyệt.
          </span>
        </div>
      </div>
    </footer>
  );
}
