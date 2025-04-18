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
    cloud_name="dkfvlgdd3",
    api_key="481299973458484",
    api_secret="nosiR0ZaXLOL7HyOtujwqSB--lk"
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
with open('carrefour_page.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Find all product cards
product_cards = soup.find_all('ul', {'data-testid': '', 'class': 'css-1omnv59'})

products = []

for card in product_cards:
    product = {}
    
    # Extract product name
    name_tag = card.find('a', {'data-testid': 'product_name'})
    if name_tag:
        product['name'] = name_tag.get_text(strip=True)
    
    # Extract image URL and upload to Cloudinary
    img_tag = card.find('img', {'data-testid': 'product_image_main'})
    if img_tag and 'src' in img_tag.attrs:
        original_image_url = img_tag['src']
        if original_image_url.startswith('http'):
            cloudinary_url = upload_to_cloudinary(original_image_url, product.get('name', ''))
            if cloudinary_url:
                product['images'] = [cloudinary_url]  # Changed to array format
    
    # Extract discount percentage (as integer)
    discount_tag = card.find('span', {'data-testid': 'headerStickerId', 'type': 'discount'})
    if discount_tag:
        discount_text = discount_tag.get_text(strip=True)
        numeric_discount = ''.join(c for c in discount_text if c.isdigit())
        if numeric_discount:
            try:
                product['discount'] = int(numeric_discount)
            except (ValueError, TypeError):
                pass
    
    # Extract price (always included, using original price)
    price_tag = card.find('div', {'data-testid': 'product-card-original-price'}) or \
                card.find('div', {'data-testid': 'product-card-discount-price'})
    if price_tag:
        price_parts = price_tag.find_all('div', recursive=False)
        if len(price_parts) >= 1:
            main_price = price_parts[0].get_text(strip=True)
            decimal_price = ''
            
            if len(price_parts) > 1:
                decimal_part = price_parts[1].find('div', class_='css-1pjcwg4')
                if decimal_part:
                    decimal_price = decimal_part.get_text(strip=True)
            
            price_str = f"{main_price}.{decimal_price}" if decimal_price else main_price
            product['price'] = clean_price(price_str)  # Changed to just 'price'
    
    # Extract discounted price (only if available)
    discount_price_tag = card.find('div', {'data-testid': 'product-card-discount-price'})
    if discount_price_tag:
        discount_price_parts = discount_price_tag.find_all('div', recursive=False)
        if len(discount_price_parts) >= 1:
            main_discount_price = discount_price_parts[0].get_text(strip=True)
            decimal_discount_price = ''
            
            if len(discount_price_parts) > 1:
                decimal_discount_part = discount_price_parts[1].find('div', class_='css-1pjcwg4')
                if decimal_discount_part:
                    decimal_discount_price = decimal_discount_part.get_text(strip=True)
            
            discount_price_str = f"{main_discount_price}.{decimal_discount_price}" if decimal_discount_price else main_discount_price
            product['discounted_price'] = clean_price(discount_price_str)
    
    if product:  # Only add if we found at least some data
        products.append(product)

# Save to JSON file
with open('carrefour_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Scraped {len(products)} products and saved to carrefour_products.json")