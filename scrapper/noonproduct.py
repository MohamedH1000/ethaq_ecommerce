import json
import requests
from bs4 import BeautifulSoup
import cloudinary
import cloudinary.uploader
import cloudinary.api
import time
import re
from urllib.parse import urlparse

# Configure Cloudinary
cloudinary.config(
    cloud_name="dbyc0sncy",
    api_key="879596477713364",
    api_secret="lhtglSKnDUGnG5RG9OjCpdcOfVg"
)

def generate_image_name(product_name):
    # Remove special characters and extra spaces
    name = re.sub(r'[^\w\s-]', '', product_name)
    name = re.sub(r'[\s-]+', '-', name)
    return name.lower()

def upload_to_cloudinary(image_url, product_name):
    print(f"🔄 Uploading image: {image_url}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(image_url, headers=headers, timeout=15)

        if response.status_code == 200:
            image_name = generate_image_name(product_name) + ".jpg"
            upload_result = cloudinary.uploader.upload(
                response.content, 
                public_id=image_name
            )
            print(f"✅ Image uploaded successfully: {upload_result['secure_url']}")
            return upload_result['secure_url']
        else:
            print(f"❌ Failed to download image: {image_url}, code: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error during processing: {e}")
        return None
    time.sleep(1.5)

def clean_price(price_str):
    """Convert price string to float, removing currency and cleaning decimals"""
    if not price_str:
        return None
    
    # Remove all non-numeric characters except dot
    numeric_str = ''.join(c for c in price_str if c.isdigit() or c == '.')
    
    # Handle cases where there might be multiple dots
    parts = numeric_str.split('.')
    if len(parts) > 1:
        numeric_str = f"{parts[0]}.{''.join(parts[1:])}"
    
    try:
        price_float = float(numeric_str)
        return int(price_float) if price_float.is_integer() else price_float
    except (ValueError, TypeError):
        return None

# Load the HTML content
with open('noon_page.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Find all product cards
product_cards = soup.find_all('div', class_='ProductBoxLinkHandler_linkWrapper__b0qZ9')

products = []

for card in product_cards:
    product = {}

    # Extract product name
    name_tag = card.find('h2', class_='ProductDetailsSection_title__JorAV')
    if name_tag:
        product['name'] = name_tag.get_text(strip=True)
    else:
        continue

    # Extract image URL and upload to Cloudinary
    img_tag = card.find('img', class_='ProductImageCarousel_productImage__jtsOn')
    if img_tag and 'src' in img_tag.attrs:
        original_image_url = img_tag['src']
        if original_image_url.startswith('http'):
            cloudinary_url = upload_to_cloudinary(original_image_url, product.get('name', ''))
            if cloudinary_url:
                product['images'] = [cloudinary_url]

    # Extract discount percentage (if present)
    discount_tag = card.find('span', class_='PriceDiscount_discount__1ViHb')
    if discount_tag:
        discount_text = discount_tag.get_text(strip=True)
        numeric_discount = ''.join(c for c in discount_text if c.isdigit())
        if numeric_discount:
            try:
                product['discount'] = int(numeric_discount)
            except (ValueError, TypeError):
                pass

    # Extract price: use old price if discounted, otherwise use selling price
    price_container = card.find('div', class_='Price_container__URFkc')
    if price_container:
        old_price_tag = price_container.find('span', class_='Price_oldPrice__ZqD8B')
        if old_price_tag:
            product['price'] = clean_price(old_price_tag.get_text(strip=True))
        else:
            selling_price_tag = price_container.find('span', class_='Price_amount__2sXa7')
            if selling_price_tag:
                product['price'] = clean_price(selling_price_tag.get_text(strip=True))

    if product and 'price' in product:
        products.append(product)

# Save to JSON file
with open('noon_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Scraped {len(products)} products and saved to noon_products.json")