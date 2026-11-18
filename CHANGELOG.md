# تاریخچه تغییرات

تمام تغییرات این پروژه در همین فایل ثبت می‌شود.
قالب فایل بر پایه‌ی [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) و نسخه‌گذاری بر پایه‌ی [Semantic Versioning](https://semver.org/) است.

## [1.1.0] - 1405-08-22

### برطرف‌شده

- وابستگی‌های گیت `pey.markdown` و `parsneshan` به کامیت‌های دقیق پین شدند تا تعویض تگ، کد وابسته را عوض نکند.
- قلاب‌های خاموشی و غیرفعال‌سازی به رکورد هر فراخوانی `prepare` پیوند شدند.
- نقض قرارداد Event Bus در زمان راه‌اندازی با کد ساخت‌یافتهٔ `EXPORT_EVENT_BUS_INVALID` گزارش می‌شود.
- `exportZip` نبود وابستگی Markdown را مثل `exportHtml` اجرا می‌کند.
- مرجع‌های کهنهٔ `events` از کد و مستندات پاک شدند.
- `micromark` به‌صورت devDependency صریح آزمون parity اعلام شد.
- نسخهٔ `parsneshan` در lockfile با کامیت پین‌شده همگام شد و مقدار `.npmrc` به شکلی که npm می‌پذیرد اصلاح شد.
- فهرست ساختار README با سورس‌ها همگام شد.

## [1.0.1] - 1405-08-15

### برطرف‌شده

- هایلایت `==...==` در خروجی نهایی HTML زنده ماند و وابستگی Markdown به `v1.2.0` ارتقا یافت.
- `exportZip` نبود وابستگی Markdown را با `EXPORT_MARKDOWN_UNAVAILABLE` اجرا می‌کند.
- اشتراک `core:service-unavailable` پس از خاموشی، غیرفعال‌سازی یا فراخوانی دوبارهٔ `prepare` آزاد می‌شود.
- شکست فعال‌سازی به‌واسطهٔ نبود وابستگی، خطای ساخت‌یافتهٔ راه‌اندازی می‌شود.
- عنوان غیررشته‌ای رکورد zip به عنوان پیش‌فرض خوانده می‌شود.
- نبود یا نقض قرارداد Event Bus در زمان راه‌اندازی بلند شکست می‌خورد و ZipWriter در شکست بسته می‌شود.

### دگرگون‌شده

- آزمون‌ها به‌شکل آینهٔ فایل‌های سورس چیده شدند و پوشش مرزی گسترش یافت.

## [1.0.0] - 1405-08-08

نخستین انتشار در زیست‌بوم پی: خروجی سند Markdown به‌شکل HTML مستقل فارسیِ راست‌به‌چپ با سه تم (`exportHtml`) و آرشیو zip چندسندی مارک‌داون (`exportZip`)؛ پیش از این انتشار به‌صورت `parsinegar.export` پرورش یافته بود.

[منتشرنشده]: https://github.com/peyjs/pey-document-export/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/peyjs/pey-document-export/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/peyjs/pey-document-export/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/peyjs/pey-document-export/releases/tag/v1.0.0
