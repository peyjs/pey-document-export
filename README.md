# pey.document-export

[![AI](https://img.shields.io/badge/Built%20with-AI-blueviolet)](#)
[![version](https://img.shields.io/badge/version-1.1.0-blue.svg)](#)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Bonyan Architecture](https://img.shields.io/badge/bonyan-0.11-56c3bf)](https://github.com/barnevis/bonyan)

## هدف

افزونه‌ی ویژگی (feature) از زیست‌بوم پی برای خروجی گرفتن از اسناد متنی: سند HTML مستقلِ فارسیِ راست‌به‌چپ با تم (رندر Markdown روی `pey.markdown.service`) و آرشیو zip چندسندی از فایل‌های Markdown. برای خروجی دادهٔ عمومی (CSV، اکسل، Word و…) نیست.

## ساختار

- `docs/` — سندهای پروژه.
- `lib/` — منطق سرویس و افزونه‌های رندر.
- `tests/` — آزمون‌های افزونه.
- `index.js` — نقطه‌ی ورود.
- `manifest.json` — قرارداد افزونه.

## وابستگی‌ها

- **الزامی:** `pey.markdown.service` — رندر Markdown؛ هر دو متد بدون آن صریحاً شکست می‌خورند.
- **اختیاری:** ندارد.

## نصب و استفاده

افزونه با `manifest.json` و بستهٔ npm به برنامه‌ی میزبان افزوده می‌شود و پس از دو فاز آماده‌سازی و فعال‌سازی، سرویس `pey.document-export.service` را عرضه می‌کند. `exportHtml` متن Markdown را به سند مستقل با تم (`light`، `dark`، `sepia`) تبدیل می‌کند و `exportZip` چند سند Markdown را در یک آرشیو می‌بندد. جزئیات کامل در [مرجع](docs/reference.md).

## مجوز

این پروژه با مجوز MIT منتشر شده است؛ متن کامل در [LICENSE](LICENSE).

## سندهای مرتبط

- [معرفی](docs/introduction.md) — شناخت افزونه به زبان ساده.
- [مرجع](docs/reference.md) — API، رویدادها، خطاها و پیکربندی.
- [نیازمندی‌ها](docs/requirements.md) — سند ساخت افزونه، مکتوب پیش از پیاده‌سازی.
