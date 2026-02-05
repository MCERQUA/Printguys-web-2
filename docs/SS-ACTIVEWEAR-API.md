# SS Activewear API Documentation

## Overview

SS Activewear provides a REST API v2 for accessing their wholesale apparel catalog. This documentation covers what we can access and how to integrate with Printguys.

**Base URLs:**
- Canada: `https://api-ca.ssactivewear.com/V2/`
- US: `https://api.ssactivewear.com/v2/`

**Documentation:** https://api.ssactivewear.com/v2/

## Authentication

| Method | Details |
|--------|---------|
| Type | Basic Authentication |
| Username | Account Number |
| Password | API Key |

**To get your API Key:** Go to the "My Account" page on ssactivewear.com

### Environment Variables

```env
SS_ACTIVWEAR_API_KEY=cdcbaa1d-73ca-48a5-aa95-75eb0c9339ba
SS_ACTIVWEAR_API_URL=https://api-ca.ssactivewear.com/V2/
SS_ACTIVWEAR_ACCOUNT_NUMBER=your_account_number
SS_ACTIVWEAR_WEBSITE=https://en-ca.ssactivewear.com/
```

## Available Endpoints

### Products API

**Endpoint:** `GET /v2/products/`

**What it returns:** Product information including SKU, GTIN, color, size, pricing, inventory, images

**Request Options:**

| Option | Format | Description |
|--------|--------|-------------|
| Get All | `/v2/products/` | Returns all products |
| Filter by Product | `/v2/products/{product}` | Filter by SkuID, Sku, Gtin, or YourSku |
| Filter by Style | `/v2/products/?style={style}` | Filter by StyleID, PartNumber, or BrandName Name |
| Filter by StyleID | `/v2/products/?styleid={style}` | Filter by StyleID |
| Filter by PartNumber | `/v2/products/?partnumber={part}` | Filter by PartNumber |
| Filter Warehouses | `/v2/products/B00760003?warehouses={IL,KS}` | Returns specific warehouses only |
| Filter Fields | `/v2/products/B00760003?fields={fields}` | Return specific fields only |
| Response Format | `/v2/products/B00760003?mediatype=json` | JSON or XML (default=json) |

**Example Response Object:**

```json
{
  "sku": "B00760004",
  "gtin": "00821780001001",
  "skuID_Master": 2343,
  "yourSku": "",
  "styleID": 39,
  "brandName": "Gildan",
  "styleName": "2000",
  "colorName": "White",
  "colorCode": "00",
  "colorPriceCodeName": "White",
  "colorGroup": "79",
  "colorGroupName": "White",
  "colorFamilyID": "1",
  "colorFamily": "Neutrals",
  "colorSwatchImage": "Images/ColorSwatch/7229_fm.jpg",
  "colorSwatchTextColor": "#000000",
  "colorFrontImage": "Images/Color/17130_f_fm.jpg",
  "colorSideImage": "Images/Color/17130_fm.jpg",
  "colorBackImage": "Images/Color/17130_b_fm.jpg",
  "colorOnModelFrontImage": "",
  "colorOnModelSideImage": "",
  "colorOnModelBackImage": "",
  "color1": "#FFFFFF",
  "color2": "",
  "sizeName": "M",
  "sizeCode": "4",
  "sizeOrder": "B2",
  "sizePriceCodeName": "S-XL",
  "caseQty": 72,
  "unitWeight": 0.4444444444444,
  "mapPrice": x.xx,
  "piecePrice": x.xx,
  "dozenPrice": x.xx,
  "casePrice": x.xx,
  "salePrice": x.xx,
  "customerPrice": x.xx,
  "saleExpiration": "2016-08-05T00:00:00",
  "noeRetailing": false,
  "caseWeight": 28,
  "caseWidth": 16,
  "caseLength": 23.75,
  "caseHeight": 12.5,
  "PolyPackQty": "24",
  "qty": 19536,
  "countryOfOrigin": "NI,DO,HT",
  "warehouses": [
    {
      "warehouseAbbr": "IL",
      "skuID": 2343,
      "qty": 10000,
      "closeout": false,
      "dropship": false,
      "excludeFreeFreight": false,
      "fullCaseOnly": false,
      "returnable": true
    }
  ]
}
```

**Key Fields for Import:**
- `sku` - SS Activewear SKU
- `gtin` - Industry standard identifier (barcode)
- `styleID` - Unique style ID (never changes)
- `brandName` - Brand name (e.g., "Gildan")
- `styleName` - Style number/name (e.g., "2000")
- `colorName` - Color name
- `colorCode` - Two digit color code
- `colorFamily` - Base color family
- `sizeName` - Size name
- `piecePrice` - Single piece price
- `dozenPrice` - Dozen price
- `casePrice` - Case price
- `customerPrice` - Your account's price
- `qty` - Total inventory across warehouses
- `warehouses[]` - Per-warehouse inventory

**Image URLs (need base URL prefix):**
- `colorSwatchImage` - Small color swatch
- `colorFrontImage` - Front view
- `colorSideImage` - Side view
- `colorBackImage` - Back view
- `colorOnModelFrontImage` - On model front
- `colorOnModelSideImage` - On model side
- `colorOnModelBackImage` - On model back

**Image URL Format:**
```
https://www.ssactivewear.com/{imagePath}
```
- Replace `_fm` with `_fl` for large images
- Replace `_fm` with `_fs` for small images

### Categories API

**Endpoint:** `GET /v2/categories/`

**What it returns:** Category information

**Request Options:**

| Option | Format | Description |
|--------|--------|-------------|
| Get All | `/v2/categories/` | Returns all categories |
| Filter by ID | `/v2/categories/{category}` | Filter by CategoryID |
| Filter Fields | `/v2/categories/?fields={fields}` | Return specific fields only |
| Response Format | `/v2/categories/?mediatype=json` | JSON or XML |

**Example Response:**
```json
{
  "categoryID": 81,
  "name": "3/4 Sleeve",
  "image": "deprecated"
}
```

### Styles API

**Endpoint:** `GET /v2/styles/`

**What it returns:** Style-level information (brand, style name, description, specs)

Style-level info includes product descriptions, measurements, and specifications that apply to all variants of a style.

### Inventory API

**Endpoint:** `GET /v2/inventory/`

**What it returns:** Real-time inventory data

### Specs API

**Endpoint:** `GET /v2/specs/`

**What it returns:** Product specifications and measurements

### Brands API

**Endpoint:** `GET /v2/brands/`

**What it returns:** Brand information

### Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v2/orders/` | Retrieve orders |
| POST | `/v2/orders/` | Submit orders |
| DELETE | `/v2/orders/` | Cancel orders |

## Integration Options

### 1. API (Recommended)

**Pros:**
- Real-time data
- All features supported
- JSON or XML formats
- Can place orders programmatically

**Cons:**
- Requires development
- API rate limits may apply
- Need to handle pagination

**Use when:** You want real-time inventory and pricing

### 2. Data Library (CSV/Excel Download)

**Pros:**
- Simple download (no coding)
- Excel format easy to work with
- All data in one file

**Cons:**
- Manual process
- Data becomes stale
- Need to re-download for updates

**Download location:** https://www.ssactivewear.com/marketing/edi

**Files available:**
- Product Information (Excel with product data)
- Images (ZIP file, ~1GB)

**Use when:** One-time import or occasional updates

### 3. FTP (Legacy)

**Pros:**
- Automated file drops
- Good for legacy systems

**Cons:**
- Not all features available
- Older technology

**Use when:** Legacy system integration

### 4. PromoStandards

Industry standard API for promotional products. SS Activewear supports:
- Electronic Access to Inventory
- Electronic Access to Order Status
- Automatic Order Shipment Notification
- Electronic Access to Data

## Data Library Download vs API

### Data Library (Recommended for Initial Import)

Since we need to add all blank products and you're already downloading images, using the Data Library CSV/Excel is the best approach for initial import:

**Advantages:**
1. Get ALL products at once (no pagination)
2. Excel format easy to parse
3. Same fields as API
4. Images can be downloaded separately

**Process:**
1. Download Product Information Excel from Data Library
2. Download Images ZIP
3. Run import script (similar to Sanmar import)
4. Schedule periodic updates via API for inventory/price changes

### API (For Ongoing Updates)

After initial import, use API to:
- Update inventory levels (real-time)
- Update pricing changes
- Add new products
- Discontinue old products

## Comparison: Sanmar vs SS Activewear

| Feature | Sanmar | SS Activewear |
|---------|--------|---------------|
| Data Format | Excel (CSV) | API + Excel |
| Images | Included in data | Separate download |
| Inventory | Static | Real-time via API |
| Categories | Included | Separate endpoint |
| Colors | Hex codes provided | HTML color codes |
| Pricing | Tiered (1+, case, 10+ case) | Piece, dozen, case |

## Import Strategy

### Phase 1: Initial Import (Data Library)

1. Download Product Information Excel
2. Download Images ZIP
3. Parse and import to database
4. Map categories to our structure

### Phase 2: Ongoing Sync (API)

1. Nightly inventory sync via API
2. Weekly price updates
3. Monthly new product additions

## Image Handling

SS Activewear provides multiple image types:
- **Swatch images**: Small color squares
- **Product images**: Front, side, back views
- **On-model images**: Products worn by models

Image URLs from API need base URL:
```
https://www.ssactivewear.com/Images/Color/17130_f_fm.jpg
```

For the downloaded images ZIP, images are organized by style/SKU.

## Pricing Notes

SS Activewear pricing:
- **piecePrice** - Single piece price
- **dozenPrice** - Per-piece price when buying by dozen
- **casePrice** - Per-piece price when buying by case
- **customerPrice** - Your account's specific pricing
- **salePrice** - Sale price (if applicable)
- **mapPrice** - Minimum advertised price

**Best practice:** Use `customerPrice` for your account pricing, fall back to `piecePrice`.

## Warehouse Information

SS Activewear has multiple warehouses:
- **IL** - Illinois
- **NV** - Nevada
- **PA** - Pennsylvania
- **KS** - Kansas
- **CA** - California (Canada)

Warehouse data includes:
- `qty` - Quantity at that warehouse
- `closeout` - Is this being discontinued?
- `dropship` - Does this ship directly from mill?
- `excludeFreeFreight` - Excluded from free freight promotions
- `fullCaseOnly` - Must order full case quantities
- `returnable` - Is this returnable?

## Code Examples

### Basic API Call (Node.js)

```javascript
const https = require('https');

const options = {
  hostname: 'api-ca.ssactivewear.com',
  path: '/V2/products/',
  auth: 'account_number:api_key',
  method: 'GET'
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const products = JSON.parse(data);
    console.log(`Retrieved ${products.length} products`);
  });
});
```

### Using Fetch

```javascript
const response = await fetch('https://api-ca.ssactivewear.com/V2/products/', {
  headers: {
    'Authorization': 'Basic ' + btoa('account_number:api_key')
  }
});
const products = await response.json();
```

## Resources

- **API Documentation:** https://api.ssactivewear.com/v2/
- **Code Examples:** https://api.ssactivewear.com/v2/Help_Examples.aspx
- **Integration Info:** https://www.ssactivewear.com/marketing/edi
- **Email Support:** api@ssactivewear.com

## Next Steps for Printguys

1. **Get Account Number** - You have the API key, but need your account number for authentication
2. **Download Data Library** - Get the Product Information Excel file
3. **Download Images** - Get the images ZIP file
4. **Create Import Script** - Based on Sanmar import pattern
5. **Test API Access** - Verify credentials work
6. **Run Initial Import** - Import all products
7. **Schedule Updates** - Set up recurring inventory sync

## Notes

- Images ZIP is ~1GB - plan storage accordingly
- Product data updates nightly in Data Library
- Inventory updates every 15 minutes via API
- Canada API URL differs from US (`api-ca` vs `api`)
- API returns both US and Canadian products depending on endpoint
