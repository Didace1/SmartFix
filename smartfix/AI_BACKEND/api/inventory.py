# smartfix/AI_BACKEND/api/inventory.py
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from collections import Counter, defaultdict
import requests
import os
from typing import List, Dict, Any

router = APIRouter()

# System Backend URL
SYSTEM_BACKEND_URL = os.getenv('SYSTEM_BACKEND_URL', 'http://localhost:8080')

# Device catalog with market intelligence
DEVICE_CATALOG = [
    {
        'device': 'iPhone 14 Pro',
        'brand': 'Apple',
        'category': 'Phone',
        'market_demand': 'high',
        'profit_margin': 'high',
        'base_score': 4.0
    },
    {
        'device': 'iPhone 13',
        'brand': 'Apple',
        'category': 'Phone',
        'market_demand': 'high',
        'profit_margin': 'high',
        'base_score': 3.8
    },
    {
        'device': 'Samsung Galaxy S23',
        'brand': 'Samsung',
        'category': 'Phone',
        'market_demand': 'high',
        'profit_margin': 'medium',
        'base_score': 3.7
    },
    {
        'device': 'MacBook Air M2',
        'brand': 'Apple',
        'category': 'Laptop',
        'market_demand': 'high',
        'profit_margin': 'medium',
        'base_score': 4.2
    },
    {
        'device': 'MacBook Pro M2',
        'brand': 'Apple',
        'category': 'Laptop',
        'market_demand': 'medium',
        'profit_margin': 'high',
        'base_score': 3.5
    },
    {
        'device': 'Dell XPS 13',
        'brand': 'Dell',
        'category': 'Laptop',
        'market_demand': 'medium',
        'profit_margin': 'medium',
        'base_score': 3.3
    },
    {
        'device': 'HP Pavilion 15',
        'brand': 'HP',
        'category': 'Laptop',
        'market_demand': 'high',
        'profit_margin': 'low',
        'base_score': 3.0
    },
    {
        'device': 'Lenovo ThinkPad X1',
        'brand': 'Lenovo',
        'category': 'Laptop',
        'market_demand': 'medium',
        'profit_margin': 'medium',
        'base_score': 3.2
    },
    {
        'device': 'iPad Pro 12.9"',
        'brand': 'Apple',
        'category': 'Tablet',
        'market_demand': 'medium',
        'profit_margin': 'high',
        'base_score': 3.4
    },
    {
        'device': 'Samsung Galaxy Tab S8',
        'brand': 'Samsung',
        'category': 'Tablet',
        'market_demand': 'medium',
        'profit_margin': 'medium',
        'base_score': 2.8
    },
    {
        'device': 'Apple Watch Series 8',
        'brand': 'Apple',
        'category': 'Smartwatch',
        'market_demand': 'high',
        'profit_margin': 'high',
        'base_score': 3.6
    },
    {
        'device': 'Samsung Galaxy Watch 5',
        'brand': 'Samsung',
        'category': 'Smartwatch',
        'market_demand': 'medium',
        'profit_margin': 'medium',
        'base_score': 2.9
    },
    {
        'device': 'AirPods Pro 2',
        'brand': 'Apple',
        'category': 'Spare Part',
        'market_demand': 'high',
        'profit_margin': 'high',
        'base_score': 3.5
    },
    {
        'device': 'MacBook Charger (USB-C)',
        'brand': 'Apple',
        'category': 'Spare Part',
        'market_demand': 'high',
        'profit_margin': 'medium',
        'base_score': 3.8
    },
    {
        'device': 'iPhone Screen Replacement Kit',
        'brand': 'Generic',
        'category': 'Spare Part',
        'market_demand': 'high',
        'profit_margin': 'high',
        'base_score': 4.0
    }
]


def fetch_sales_from_system_backend(days: int = 60) -> List[Dict]:
    """Fetch sales data from System Backend"""
    try:
        response = requests.get(f'{SYSTEM_BACKEND_URL}/api/sales', timeout=10)
        if response.status_code == 200:
            all_sales = response.json()
            
            # Filter by date range
            cutoff_date = datetime.now() - timedelta(days=days)
            recent_sales = []
            
            for sale in all_sales:
                if sale.get('createdAt'):
                    sale_date = datetime.fromisoformat(sale['createdAt'].replace('Z', '+00:00'))
                    if sale_date >= cutoff_date:
                        recent_sales.append(sale)
            
            return recent_sales
        return []
    except Exception as e:
        print(f"Error fetching sales: {e}")
        return []


def fetch_inventory_from_system_backend() -> List[Dict]:
    """Fetch inventory data from System Backend"""
    try:
        response = requests.get(f'{SYSTEM_BACKEND_URL}/api/inventory', timeout=10)
        if response.status_code == 200:
            return response.json()
        return []
    except Exception as e:
        print(f"Error fetching inventory: {e}")
        return []


def analyze_sales_trends(sales_data: List[Dict]) -> Dict[str, Any]:
    """Analyze sales trends from recent sales data"""
    if not sales_data:
        return {
            'top_categories': {},
            'top_brands': {},
            'top_products': {},
            'total_recent_sales': 0,
            'total_revenue': 0,
            'avg_sale_value': 0
        }
    
    categories = Counter()
    brands = Counter()
    products = Counter()
    total_revenue = 0
    
    for sale in sales_data:
        if not sale:
            continue
        items = sale.get('items', [])
        for item in items:
            if not item:
                continue
            quantity = item.get('quantity', 1)
            category = item.get('category', 'Unknown')
            brand = extract_brand(item.get('name', ''))
            product_name = item.get('name', 'Unknown')
            price = float(item.get('price', 0))
            
            categories[category] += quantity
            brands[brand] += quantity
            products[product_name] += quantity
            total_revenue += price * quantity
    
    return {
        'top_categories': dict(categories.most_common(10)),
        'top_brands': dict(brands.most_common(10)),
        'top_products': dict(products.most_common(10)),
        'total_recent_sales': len(sales_data),
        'total_revenue': round(total_revenue, 2),
        'avg_sale_value': round(total_revenue / len(sales_data), 2) if sales_data else 0
    }


def extract_brand(product_name: str) -> str:
    """Extract brand from product name"""
    brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Google', 'Huawei']
    product_upper = product_name.upper()
    
    for brand in brands:
        if brand.upper() in product_upper:
            return brand
    
    return 'Generic'


def identify_inventory_gaps(sales_data: List[Dict], inventory_data: List[Dict]) -> List[Dict]:
    """Identify gaps between sales demand and inventory availability"""
    gaps = []
    
    if not sales_data or not inventory_data:
        return gaps
    
    # Build sales frequency map
    product_sales = defaultdict(int)
    category_sales = defaultdict(int)
    brand_sales = defaultdict(int)
    
    for sale in sales_data:
        if not sale:
            continue
        for item in sale.get('items', []):
            if not item:
                continue
            product_id = item.get('id')
            product_name = item.get('name', '')
            category = item.get('category', 'Unknown')
            brand = extract_brand(product_name)
            quantity = item.get('quantity', 1)
            
            if product_id:
                product_sales[product_id] += quantity
            category_sales[category] += quantity
            brand_sales[brand] += quantity
    
    # Check inventory levels against sales
    inventory_map = {item['id']: item for item in inventory_data}
    
    for product_id, sales_count in product_sales.items():
        if product_id in inventory_map:
            inventory_item = inventory_map[product_id]
            current_stock = inventory_item.get('quantity', 0)
            product_name = inventory_item.get('name', 'Unknown')
            
            # Safely get category name
            category_obj = inventory_item.get('category')
            if category_obj and isinstance(category_obj, dict):
                category_name = category_obj.get('name', 'Unknown')
            else:
                category_name = 'Unknown'
            
            # High sales but out of stock
            if current_stock == 0 and sales_count >= 5:
                gaps.append({
                    'type': 'out_of_stock',
                    'product': product_name,
                    'category': category_name,
                    'sales_volume': sales_count,
                    'current_stock': 0,
                    'priority': 'high'
                })
            # High sales but low stock
            elif current_stock < 5 and sales_count >= 10:
                gaps.append({
                    'type': 'low_stock',
                    'product': product_name,
                    'category': category_name,
                    'sales_volume': sales_count,
                    'current_stock': current_stock,
                    'priority': 'high'
                })
            # Moderate sales but low stock
            elif current_stock < 3 and sales_count >= 5:
                gaps.append({
                    'type': 'low_stock',
                    'product': product_name,
                    'category': category_name,
                    'sales_volume': sales_count,
                    'current_stock': current_stock,
                    'priority': 'medium'
                })
    
    # Check for category gaps
    inventory_categories = Counter()
    for item in inventory_data:
        category_obj = item.get('category')
        if category_obj and isinstance(category_obj, dict):
            category = category_obj.get('name', 'Unknown')
        else:
            category = 'Unknown'
        inventory_categories[category] += 1
    
    for category, sales_count in category_sales.items():
        current_items = inventory_categories.get(category, 0)
        if sales_count > 20 and current_items < 3:
            gaps.append({
                'type': 'category_gap',
                'category': category,
                'sales_volume': sales_count,
                'current_items': current_items,
                'priority': 'high'
            })
    
    # Check for brand gaps
    inventory_brands = Counter()
    for item in inventory_data:
        brand = extract_brand(item.get('name', ''))
        inventory_brands[brand] += 1
    
    for brand, sales_count in brand_sales.items():
        current_items = inventory_brands.get(brand, 0)
        if sales_count > 15 and current_items < 2:
            gaps.append({
                'type': 'brand_gap',
                'brand': brand,
                'sales_volume': sales_count,
                'current_items': current_items,
                'priority': 'medium'
            })
    
    return gaps


def calculate_device_score(device: Dict, sales_trends: Dict, inventory_data: List[Dict]) -> float:
    """Calculate recommendation score for a device"""
    score = device['base_score']
    
    # Boost score based on category performance
    category = device['category']
    top_categories = sales_trends.get('top_categories', {})
    if category in top_categories:
        category_rank = list(top_categories.keys()).index(category) + 1
        if category_rank == 1:
            score += 0.8
        elif category_rank <= 3:
            score += 0.5
        elif category_rank <= 5:
            score += 0.3
    
    # Boost score based on brand performance
    brand = device['brand']
    top_brands = sales_trends.get('top_brands', {})
    if brand in top_brands:
        brand_rank = list(top_brands.keys()).index(brand) + 1
        if brand_rank == 1:
            score += 0.6
        elif brand_rank <= 3:
            score += 0.4
        elif brand_rank <= 5:
            score += 0.2
    
    # Check if similar device exists in inventory
    device_in_inventory = False
    for item in inventory_data:
        if device['device'].lower() in item.get('name', '').lower():
            device_in_inventory = True
            if item.get('quantity', 0) == 0:
                score += 0.5  # Boost if out of stock
            elif item.get('quantity', 0) < 3:
                score += 0.3  # Boost if low stock
            break
    
    if not device_in_inventory:
        score += 0.4  # Boost for new products
    
    # Market demand adjustment
    if device['market_demand'] == 'high':
        score += 0.3
    elif device['market_demand'] == 'medium':
        score += 0.1
    
    return min(round(score, 1), 5.0)


def calculate_recommended_quantity(device: Dict, sales_trends: Dict, inventory_data: List[Dict], score: float) -> int:
    """Calculate recommended quantity to stock based on sales data and score"""
    # Base quantity based on score
    if score >= 4.5:
        base_qty = 20
    elif score >= 4.0:
        base_qty = 15
    elif score >= 3.5:
        base_qty = 10
    elif score >= 3.0:
        base_qty = 7
    else:
        base_qty = 5
    
    # Adjust based on category sales volume
    category = device['category']
    top_categories = sales_trends.get('top_categories', {})
    category_sales = top_categories.get(category, 0)
    
    if category_sales > 50:
        base_qty += 10
    elif category_sales > 30:
        base_qty += 5
    elif category_sales > 15:
        base_qty += 3
    
    # Adjust based on brand sales volume
    brand = device['brand']
    top_brands = sales_trends.get('top_brands', {})
    brand_sales = top_brands.get(brand, 0)
    
    if brand_sales > 50:
        base_qty += 5
    elif brand_sales > 30:
        base_qty += 3
    
    # Check current inventory
    for item in inventory_data:
        if device['device'].lower() in item.get('name', '').lower():
            current_qty = item.get('quantity', 0)
            if current_qty == 0:
                # Out of stock - recommend more
                base_qty += 5
            elif current_qty < 5:
                # Low stock - recommend moderate amount
                base_qty += 3
            break
    
    # Category-specific adjustments
    if category == 'Spare Part':
        base_qty = int(base_qty * 1.5)  # Spare parts need more stock
    elif category == 'Laptop':
        base_qty = max(5, int(base_qty * 0.7))  # Laptops need less stock (expensive)
    
    return min(base_qty, 50)  # Cap at 50 units


def generate_recommendation_reason(device: Dict, score: float, sales_trends: Dict) -> str:
    """Generate human-readable reason for recommendation"""
    reasons = []
    
    category = device['category']
    brand = device['brand']
    
    # Category performance
    top_categories = sales_trends.get('top_categories', {})
    if category in list(top_categories.keys())[:3]:
        reasons.append(f"{category} is a top-selling category")
    
    # Brand performance
    top_brands = sales_trends.get('top_brands', {})
    if brand in list(top_brands.keys())[:3]:
        reasons.append(f"{brand} products are in high demand")
    
    # Market demand
    if device['market_demand'] == 'high':
        reasons.append("high market demand")
    
    # Profit margin
    if device['profit_margin'] == 'high':
        reasons.append("excellent profit margins")
    
    if not reasons:
        reasons.append("solid market performer with good potential")
    
    return f"Recommended because: {', '.join(reasons)}."


def generate_insights(sales_trends: Dict, inventory_gaps: List[Dict], recommendations: List[Dict]) -> List[str]:
    """Generate actionable AI insights"""
    insights = []
    
    # Top category insight
    top_categories = sales_trends.get('top_categories', {})
    if top_categories:
        top_category = list(top_categories.keys())[0]
        top_category_sales = top_categories[top_category]
        insights.append(
            f"📱 {top_category} is your best-selling category with {top_category_sales} units sold. "
            f"Consider expanding this inventory line."
        )
    
    # Top brand insight
    top_brands = sales_trends.get('top_brands', {})
    if top_brands:
        top_brand = list(top_brands.keys())[0]
        top_brand_sales = top_brands[top_brand]
        insights.append(
            f"⭐ {top_brand} is your top-performing brand with {top_brand_sales} units sold. "
            f"Stock more {top_brand} devices to meet demand."
        )
    
    # Inventory gaps insight
    high_priority_gaps = [g for g in inventory_gaps if g.get('priority') == 'high']
    if high_priority_gaps:
        insights.append(
            f"⚠️ You have {len(high_priority_gaps)} high-priority inventory gaps. "
            f"Address these immediately to avoid lost sales."
        )
    
    # Revenue insight
    total_revenue = sales_trends.get('total_revenue', 0)
    avg_sale = sales_trends.get('avg_sale_value', 0)
    if total_revenue > 0:
        insights.append(
            f"💰 Recent sales generated {total_revenue:,.0f} RWF with an average sale value of {avg_sale:,.0f} RWF. "
            f"Focus on mid-to-high value items for better margins."
        )
    
    # Recommendation insight
    if recommendations:
        top_rec = recommendations[0]
        insights.append(
            f"🎯 Top recommendation: {top_rec['device']} (Score: {top_rec['recommendation_score']}/5.0). "
            f"This device aligns perfectly with current market trends."
        )
    
    # General market insight
    insights.append(
        "📊 Market analysis shows strong demand for smartphones and laptops. "
        "Premium and mid-range devices offer the best profit margins."
    )
    
    return insights


@router.get("/inventory-recommendations")
async def get_inventory_recommendations():
    """Main endpoint for AI inventory recommendations"""
    try:
        # Fetch data from System Backend
        sales_data = fetch_sales_from_system_backend(days=60)
        inventory_data = fetch_inventory_from_system_backend()
        
        # Check if we have data
        if not sales_data:
            print("Warning: No sales data available from System Backend")
        if not inventory_data:
            print("Warning: No inventory data available from System Backend")
        
        # Analyze sales trends
        sales_trends = analyze_sales_trends(sales_data)
        
        # Identify inventory gaps
        inventory_gaps = identify_inventory_gaps(sales_data, inventory_data)
        
        # Generate device recommendations
        recommendations = []
        for device in DEVICE_CATALOG:
            score = calculate_device_score(device, sales_trends, inventory_data)
            if score >= 2.5:  # Only recommend devices with decent scores
                recommended_qty = calculate_recommended_quantity(device, sales_trends, inventory_data, score)
                recommendations.append({
                    **device,
                    'recommendation_score': score,
                    'recommended_quantity': recommended_qty,
                    'reason': generate_recommendation_reason(device, score, sales_trends)
                })
        
        # Sort by score (highest first)
        recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)
        
        # Take top 10
        top_recommendations = recommendations[:10]
        
        # Generate AI insights
        insights = generate_insights(sales_trends, inventory_gaps, top_recommendations)
        
        # Add system status message
        system_status = {
            'java_backend_connected': len(sales_data) > 0 or len(inventory_data) > 0,
            'sales_data_available': len(sales_data) > 0,
            'inventory_data_available': len(inventory_data) > 0,
            'message': 'Using real data from System Backend' if (sales_data or inventory_data) else 'No data from System Backend - showing catalog-based recommendations'
        }
        
        return {
            'success': True,
            'data': {
                'recommendations': top_recommendations,
                'sales_trends': sales_trends,
                'inventory_gaps': inventory_gaps,
                'insights': insights,
                'analysis_date': datetime.now().isoformat(),
                'total_recommendations': len(top_recommendations),
                'system_status': system_status
            }
        }
        
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail={
                'success': False,
                'error': str(e),
                'message': 'Failed to generate inventory recommendations. Make sure Java backend is running on port 8080.'
            }
        )


@router.post("/inventory-recommendations/refresh")
async def refresh_recommendations():
    """Force refresh of recommendations"""
    return await get_inventory_recommendations()


@router.get("/test-connection")
async def test_system_backend_connection():
    """Test connection to System Backend"""
    results = {
        'system_backend_url': SYSTEM_BACKEND_URL,
        'sales_endpoint': f'{SYSTEM_BACKEND_URL}/api/sales',
        'inventory_endpoint': f'{SYSTEM_BACKEND_URL}/api/inventory',
        'tests': {}
    }
    
    # Test sales endpoint
    try:
        response = requests.get(f'{SYSTEM_BACKEND_URL}/api/sales', timeout=5)
        results['tests']['sales'] = {
            'status': 'success' if response.status_code == 200 else 'failed',
            'status_code': response.status_code,
            'data_count': len(response.json()) if response.status_code == 200 else 0
        }
    except Exception as e:
        results['tests']['sales'] = {
            'status': 'error',
            'error': str(e)
        }
    
    # Test inventory endpoint
    try:
        response = requests.get(f'{SYSTEM_BACKEND_URL}/api/inventory', timeout=5)
        results['tests']['inventory'] = {
            'status': 'success' if response.status_code == 200 else 'failed',
            'status_code': response.status_code,
            'data_count': len(response.json()) if response.status_code == 200 else 0
        }
    except Exception as e:
        results['tests']['inventory'] = {
            'status': 'error',
            'error': str(e)
        }
    
    # Overall status
    all_success = all(
        test.get('status') == 'success' 
        for test in results['tests'].values()
    )
    
    results['overall_status'] = 'connected' if all_success else 'disconnected'
    results['message'] = (
        'Successfully connected to System Backend' if all_success 
        else 'Cannot connect to System Backend. Make sure Java backend is running on port 8080.'
    )
    
    return results
