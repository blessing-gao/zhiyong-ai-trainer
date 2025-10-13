import { useState, useEffect } from "react";
import webLogo from "@/assets/web_logo.svg";
import oilanText from "@/assets/oilan-text.svg";

const Footer = () => {
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });

  useEffect(() => {
    const handleNavChange = (e: CustomEvent) => {
      setIsVertical(e.detail === "vertical");
    };

    window.addEventListener("navPositionChange", handleNavChange as EventListener);
    return () => {
      window.removeEventListener("navPositionChange", handleNavChange as EventListener);
    };
  }, []);

  return (
    <footer className={`bg-gradient-card border-t border-border/50 transition-all duration-300 ${isVertical ? "ml-44" : ""}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={webLogo} alt="Web Logo" className="h-8 w-auto" />
              <img src={oilanText} alt="Oilan" className="h-6 w-auto" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              通过创新设计和开发，创造卓越的数字化体验，推动企业成功。
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">服务项目</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">网站设计</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">系统开发</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">SEO优化</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">运维服务</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">公司信息</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">关于我们</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">项目案例</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">加入我们</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">联系方式</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>hello@zhiyong.com</li>
              <li>+86 138-0013-8000</li>
              <li>北京市朝阳区<br />创新科技园 A座 1008室</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 智涌科技. 保留所有权利.
          </p>
          <div className="flex space-x-6 text-muted-foreground text-sm">
            <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
            <a href="#" className="hover:text-primary transition-colors">服务条款</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie政策</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;