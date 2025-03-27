import json
from bs4 import BeautifulSoup

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
        # Remove unnecessary decimal zeros and convert to int if possible
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
        product['url'] = 'https://www.carrefourksa.com' + name_tag['href']
    
    # Extract image URL
    img_tag = card.find('img', {'data-testid': 'product_image_main'})
    if img_tag:
        product['image_url'] = img_tag['src']
    
    # Extract current price (as number)
    price_tag = card.find('div', {'data-testid': 'product-card-discount-price'}) or card.find('div', {'data-testid': 'product-card-original-price'})
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
            product['price'] = clean_price(price_str)
    
    # Extract original price if there's a discount (as number)
    original_price_tag = card.find('div', {'data-testid': 'product-card-original-price', 'type': 'original'})
    if original_price_tag and original_price_tag != price_tag:
        original_price_parts = original_price_tag.find_all('div', recursive=False)
        if len(original_price_parts) >= 1:
            main_original_price = original_price_parts[0].get_text(strip=True)
            decimal_original_price = ''
            
            if len(original_price_parts) > 1:
                decimal_original_part = original_price_parts[1].find('div', class_='css-1pjcwg4')
                if decimal_original_part:
                    decimal_original_price = decimal_original_part.get_text(strip=True)
            
            original_price_str = f"{main_original_price}.{decimal_original_price}" if decimal_original_price else main_original_price
            product['original_price'] = clean_price(original_price_str)
    
    # Extract discount percentage (as integer)
    discount_tag = card.find('span', {'data-testid': 'headerStickerId', 'type': 'discount'})
    if discount_tag:
        discount_text = discount_tag.get_text(strip=True)
        # Extract only numbers from discount text
        numeric_discount = ''.join(c for c in discount_text if c.isdigit())
        if numeric_discount:
            try:
                product['discount'] = int(numeric_discount)
            except (ValueError, TypeError):
                pass
    
    if product:  # Only add if we found at least some data
        products.append(product)

# Save to JSON file
with open('carrefour_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Scraped {len(products)} products and saved to carrefour_products.json")