import requests
import cloudinary
import cloudinary.uploader
import json
import time
import re

# إعداد Cloudinary
cloudinary.config(
    cloud_name="dkfvlgdd3",
    api_key="481299973458484",
    api_secret="nosiR0ZaXLOL7HyOtujwqSB--lk"
)

# دالة لتعديل اسم المنتج ليكون مناسبًا
def generate_image_name(product_name):
    # إزالة الأحرف الخاصة والمسافات الزائدة
    name = re.sub(r'[^\w\s-]', '', product_name)  # إزالة أي حرف غير alphanumeric أو space أو dash
    name = re.sub(r'[\s-]+', '-', name)  # تحويل المسافات إلى "-"
    return name.lower()  # تحويل الاسم إلى lowercase ليكون متسقًا

# قراءة البيانات من ملف test.json
with open("test.json", "r", encoding="utf-8") as f:
    products = json.load(f)

updated_products = []

for product in products:
    print(f"🔄 جاري تحميل الصورة: {product['image_url']}")
    try:
        # إرسال الطلب مع User-Agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
        response = requests.get(product["image_url"], headers=headers, timeout=15)

        if response.status_code == 200:
            # تعديل اسم المنتج ليكون أكثر وضوحًا
            image_name = generate_image_name(product["name"]) + ".jpg"
            
            # رفع الصورة إلى Cloudinary من البايتس مع اسم مخصص
            upload_result = cloudinary.uploader.upload(response.content, public_id=image_name)
            product["new_image_url"] = upload_result["secure_url"]  # إضافة رابط الصورة الجديدة
            updated_products.append(product)
            print(f"✅ تم رفع الصورة بنجاح: {upload_result['secure_url']}")
        else:
            print(f"❌ فشل تحميل الصورة: {product['image_url']}, كود: {response.status_code}")

    except Exception as e:
        print(f"❌ خطأ أثناء المعالجة: {e}")

    time.sleep(1.5)  # ⏳ تأخير بسيط عشان ما يقطعك السيرفر

# حفظ النتائج في ملف JSON (الذي يحتوي فقط على URL الجديد)
with open("updated_products.json", "w", encoding="utf-8") as f:
    json.dump(updated_products, f, ensure_ascii=False, indent=2)

print("\n🎉 تم الانتهاء! تم حفظ المنتجات في ملف updated_products.json")