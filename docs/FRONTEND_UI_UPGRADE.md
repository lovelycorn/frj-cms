# Frontend UI Upgrade Delivery

## 目标与边界

本次交付完成工业外贸官网 + B2B 商城模板化前端架构升级，核心是基于 shadcn/ui 体系建立可复用组件层。

边界约束（已遵守）：

- 不改 Docker 结构
- 不改 Strapi 后端模型
- 不改 PostgreSQL 配置结构
- 不改部署流程入口

## 架构结果

### 新前端目录

```text
frontend/src/
  styles/
    design-system.ts
  components/
    ui/
      accordion.tsx
      badge.tsx
      button.tsx
      card.tsx
      cn.ts
      container.tsx
      dropdown-menu.tsx
      input.tsx
      label.tsx
      motion-fade-in.tsx
      navigation-menu.tsx
      section.tsx
      separator.tsx
      sheet.tsx
      tabs.tsx
      textarea.tsx
      tooltip.tsx
    layout/
      floating-inquiry.tsx
      mega-menu-config.ts
      site-footer.tsx
      site-header.tsx
    sections/
      about/about-page-layout.tsx
      contact/contact-form.tsx
      contact/contact-page-layout.tsx
      home/home-hero.tsx
      home/homepage-layout.tsx
      inquiry/inquiry-cta.tsx
    commerce/
      product-card.tsx
      product-category-tabs.tsx
      product-detail-summary.tsx
      product-gallery.tsx
      product-grid.tsx
      product-specification-table.tsx
      related-products.tsx
    industry/
      factory-strength-section.tsx
      industry-solutions-section.tsx
```

### 旧组件清理

已删除：

- `frontend/components/CTASection.tsx`
- `frontend/components/ContactForm.tsx`
- `frontend/components/Footer.tsx`
- `frontend/components/Header.tsx`
- `frontend/components/Hero.tsx`
- `frontend/components/ProductCard.tsx`
- `frontend/components/ProductGrid.tsx`

保留（兼容旧路由调用）：

- `frontend/components/LocalizedLink.tsx`

## 功能完成清单

### P0 页面模块

- Header（含桌面 Mega Menu）
- Mobile Navigation（Sheet）
- Hero Banner
- Product Showcase
- Industry Solutions
- Factory Strength
- Inquiry CTA
- Footer

### 产品系统

- Product Grid
- Product Card
- Product Detail Summary
- Product Gallery
- Product Specification Table
- Related Products

### 询盘系统

- 全站询盘入口统一（Header / Footer / Floating）
- 产品详情询盘入口
- 联系页询盘表单
- 移动端 WhatsApp CTA

### 动画规范落地

- 仅使用 Framer Motion 微动画
- 默认渐入 / hover 反馈
- 不使用重型动画和高性能成本特效

### shadcn/ui 核心组件落地

- `button`
- `sheet`
- `label`
- `separator`
- `dropdown-menu`
- `accordion`
- `tabs`
- `navigation-menu`
- `tooltip`

## 数据兼容策略

- 维持现有 Strapi API 契约
- 产品规格字段兼容多来源形态（无需后端迁移）：
- `specifications`
- `specificationTable`
- `specs`
- object / array / json-string

## 验收结果

本阶段已完成以下验证：

- `npm run typecheck` 通过
- `npm run lint` 通过（容器 Node 20 环境）
- 前端健康接口 `GET /api/health` 返回 `200`
- Strapi 健康接口 `GET /api/health` 返回 `200`
- 核心页面可访问（首页、产品列表、产品详情、关于、联系）
- Docker 开发编排服务 `postgres/strapi/nextjs` 全部 `healthy`
