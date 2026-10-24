---
# DRAFT — this whole level is a PROPOSAL for the owner to confirm. Nothing here is announced yet.
slug: level-2-clean-architecture
title: "المستوى 2: مشروع باحتراف — EF Core و Patterns و Frontend Framework"
titleEn: "Level 2 — Professional project: EF Core, patterns, and a frontend framework"
level: 2
status: coming-soon
summary: "مسودة: المستوى الجاي بعد مخيم الخريجين. بتنقل مشروعك من الأساسيات لهيكلة احترافية زي اللي بتشوفها بالشركات."
prerequisites:
  - "إنهاء المستوى 1 (مخيم تجهيز الخريجين) أو مستوى مكافئ"
  - "مشروع Web API شغّال بـ C# و SQL Server (تبعك)"
  - "راحة بالتعامل مع Git: Branches و Pull Requests"
stack:
  - "ASP.NET Core Web API"
  - "Entity Framework Core"
  - "Repository Pattern"
  - "Unit of Work"
  - "Dependency Injection"
  - "SQL Server"
  - "Frontend framework — TODO (owner): React / Angular / Blazor / Vue"
durationWeeks: null     # TODO (owner)
sessionsPerWeek: null   # TODO (owner)
sessionHours: null      # TODO (owner)
totalSessions: null
language: null          # TODO (owner)
certificate: null       # TODO (owner)
telegramUrl: "https://t.me/musabatieh"
refundPolicy: null      # TODO (owner)
cohorts: []             # no cohort scheduled yet
---

> ⚠️ **مسودة — المحتوى مقترح وقابل للتغيير.** ما في موعد أو سعر معلن لهاد المستوى لسا. إذا مهتم، تواصل معنا وبنبلّغك أول ما يفتح.

## 🎯 شو الفكرة؟

بالمستوى 1 كتبت كل شي بإيدك وفهمت الأساس. بالمستوى 2 بتتعلم كيف الشركات بتنظّم المشروع لما يكبر: طبقات واضحة، أدوات بتوفّر وقت، وواجهة مبنية بـ Framework.

القاعدة نفسها: **انت بتبني، احنا بنراجع.**

## 📚 المحتوى المقترح (Proposal — للتأكيد من المحاضر)

### 🔹 المرحلة 1: من ADO.NET لـ EF Core
- ليش الـ ORM؟ ومتى ADO.NET لسا أفضل
- DbContext، Entities، Relationships
- Migrations و Seeding
- LINQ وكيف تشوف الـ SQL اللي بيطلع (وتتجنب مشاكل الأداء زي N+1)

### 🔹 المرحلة 2: الهيكلة والـ Patterns
- Dependency Injection بشكل عملي
- Repository Pattern و Unit of Work: متى بتفيد ومتى بتكون زيادة
- DTOs و Mapping
- تقسيم المشروع لطبقات (API / Application / Domain / Infrastructure) — مقدمة لـ Clean Architecture
- Validation مركزي و Global Error Handling و Logging

### 🔹 المرحلة 3: Frontend Framework
- TODO (owner): اختيار الـ Framework (React / Angular / Blazor / Vue)
- Components، Routing، State
- ربط الواجهة مع الـ API، Authentication (JWT) من جهة الواجهة

### 🔹 المرحلة 4: الجودة والنشر
- Unit Tests أساسية للـ Services
- إعدادات البيئات (Development / Production)
- نشر المشروع (IIS أو خيار آخر — TODO (owner))
- مراجعة كود نهائية زي الـ Code Review بالشركات

## 🛠️ شو رح تبني؟

نفس مشروعك من المستوى 1 بعد إعادة هيكلة، أو مشروع جديد أكبر (نتفق عليه). الهدف مشروع بتقدر تعرضه كـ "مشروع بمستوى شركات" بالـ CV.

## 👥 لمين؟

- اللي خلّصوا المستوى 1 أو عندهم مشروع Web API شغّال بـ ADO.NET أو أي طريقة
- اللي بدهم يفهموا الـ Patterns بشكل عملي مش بس تعريفات

## 🚫 مش إلك إذا...

- لسا ما كتبت API بإيدك من قبل: ابدأ بالمستوى 1
- بدك تحفظ أسماء Patterns بدون ما تطبّقها

## 📝 المطلوب منك

نفس قواعد المستوى 1: واجب بعد كل لقاء، تسليم على GitHub بداية اللقاء الجاي، ومراجعة على كل محطة بالمشروع.

## ❓ أسئلة

**إمتى بيبدأ؟** لسا ما في موعد. TODO (owner).
**قديش السعر والمدة؟** TODO (owner).
**لازم أكون أخذت المستوى 1؟** لا، بس لازم يكون مستواك مكافئ. ممكن نطلب منك توريّنا مشروع سابق أو نعمل مكالمة قصيرة.

📲 **للاهتمام والاستفسار:** [تواصل معنا على التلغرام](https://t.me/musabatieh)
