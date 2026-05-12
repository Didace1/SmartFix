from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from collections import Counter, defaultdict
import requests
import json
import sys
import os

# Add the parent directory to the path to fix import issues
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from database.database import get_db_connection
except ImportError:
    # Fallback if database module is not available
    def get_db_connection():
        return None

router = APIRouter()

class InventoryRecommendationEngine:
    def __init__(self):
        self.system_backend_url = "http://localhost:8080"
        
    def get_sales_data(self) -> List[Dict]:
        """Fetch sales data from the system backend"""
        try:
            response = requests.get(f"{self.system_backend_url}/api/sales")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"Error fetching sales data: {e}")
            return []
    
    def get_inventory_data(self) -> List[Dict]:
        """Fetch current inventory data"""
        try:
            response = requests.get(f"{self.system_backend_url}/api/inventory")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"Error fetching inventory data: {e}")
            return []
    
    def get_repair_data(self) -> List[Dict]:
        """Fetch repair data to understand device reliability"""
        try:
            response = requests.get(f"{self.system_backend_url}/api/repairs")
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"Error fetching repair data: {e}")
            return []
    
    def analyze_sales_trends(self, sales_data: List[Dict]) -> Dict[str, Any]:
        """Analyze sales trends and patterns"""
        if not sales_data:
            return {}
        
        # Convert to DataFrame for easier analysis
        df = pd.DataFrame(sales_data)
        
        # Parse dates
        df['sale_date'] = pd.to_datetime(df.get('saleDate', df.get('createdAt', datetime.now())))
        
        # Recent sales (last 30 days)
        recent_date = datetime.now() - timedelta(days=30)
        recent_sales = df[df['sale_date'] >= recent_date]
        
        # Category analysis
        category_sales = Counter()
        brand_sales = Counter()
        device_sales = Counter()
        
        for _, sale in recent_sales.iterrows():
            items = sale.get('items', [])
            if isinstance(items, str):
                try:
                    items = json.loads(items)
                except:
                    items = []
            
            for item in items:
                category = item.get('category', 'Unknown')
                brand = item.get('brand', 'Unknown')
                device_name = item.get('name', 'Unknown')
                quantity = item.get('quantity', 1)
                
                category_sales[category] += quantity
                brand_sales[brand] += quantity
                device_sales[device_name] += quantity
        
        # Calculate trends
        weekly_sales = defaultdict(int)
        for _, sale in recent_sales.iterrows():
            week = sale['sale_date'].strftime('%Y-W%U')
            items = sale.get('items', [])
            if isinstance(items, str):
                try:
                    items = json.loads(items)
                except:
                    items = []
            
            for item in items:
                weekly_sales[week] += item.get('quantity', 1)
        
        return {
            'top_categories': dict(category_sales.most_common(10)),
            'top_brands': dict(brand_sales.most_common(10)),
            'top_devices': dict(device_sales.most_common(15)),
            'weekly_trends': dict(weekly_sales),
            'total_recent_sales': sum(category_sales.values())
        }
    
    def analyze_inventory_gaps(self, inventory_data: List[Dict], sales_trends: Dict) -> List[Dict]:
        """Identify gaps in inventory based on sales trends"""
        current_inventory = {item['name']: item for item in inventory_data}
        top_selling_categories = sales_trends.get('top_categories', {})
        top_selling_brands = sales_trends.get('top_brands', {})
        
        gaps = []
        
        # Check for missing popular categories
        for category, sales_count in top_selling_categories.items():
            category_items = [item for item in inventory_data if item.get('category') == category]
            
            if len(category_items) < 3:  # Less than 3 items in popular category
                gaps.append({
                    'type': 'category_gap',
                    'category': category,
                    'sales_volume': sales_count,
                    'current_items': len(category_items),
                    'priority': 'high' if sales_count > 10 else 'medium'
                })
        
        # Check for missing popular brands
        for brand, sales_count in top_selling_brands.items():
            brand_items = [item for item in inventory_data if item.get('brand') == brand]
            
            if len(brand_items) < 2:  # Less than 2 items from popular brand
                gaps.append({
                    'type': 'brand_gap',
                    'brand': brand,
                    'sales_volume': sales_count,
                    'current_items': len(brand_items),
                    'priority': 'high' if sales_count > 15 else 'medium'
                })
        
        return gaps
    
    def get_market_recommendations(self) -> List[Dict]:
        """Generate market-based device recommendations"""
        # Simulated market data - in real implementation, this could come from external APIs
        market_trends = [
            {
                'device': 'iPhone 15 Pro',
                'brand': 'Apple',
                'category': 'Smartphone',
                'market_demand': 'high',
                'price_range': '80000-120000',
                'reason': 'Latest flagship with high market demand',
                'profit_margin': 'high'
            },
            {
                'device': 'Samsung Galaxy S24',
                'brand': 'Samsung',
                'category': 'Smartphone',
                'market_demand': 'high',
                'price_range': '70000-100000',
                'reason': 'Popular Android flagship alternative',
                'profit_margin': 'high'
            },
            {
                'device': 'MacBook Air M3',
                'brand': 'Apple',
                'category': 'Laptop',
                'market_demand': 'medium',
                'price_range': '150000-200000',
                'reason': 'Growing demand for Apple laptops',
                'profit_margin': 'medium'
            },
            {
                'device': 'Dell XPS 13',
                'brand': 'Dell',
                'category': 'Laptop',
                'market_demand': 'medium',
                'price_range': '120000-180000',
                'reason': 'Popular business laptop choice',
                'profit_margin': 'medium'
            },
            {
                'device': 'AirPods Pro 2',
                'brand': 'Apple',
                'category': 'Accessories',
                'market_demand': 'high',
                'price_range': '25000-35000',
                'reason': 'High demand wireless earbuds',
                'profit_margin': 'high'
            },
            {
                'device': 'iPad Air',
                'brand': 'Apple',
                'category': 'Tablet',
                'market_demand': 'medium',
                'price_range': '60000-80000',
                'reason': 'Growing tablet market segment',
                'profit_margin': 'medium'
            }
        ]
        
        return market_trends
    
    def calculate_recommendation_score(self, device: Dict, sales_trends: Dict, inventory_gaps: List[Dict]) -> float:
        """Calculate a recommendation score for a device"""
        score = 0.0
        
        # Base score from market demand
        demand_scores = {'high': 3.0, 'medium': 2.0, 'low': 1.0}
        score += demand_scores.get(device.get('market_demand', 'low'), 1.0)
        
        # Bonus for addressing category gaps
        device_category = device.get('category', '')
        for gap in inventory_gaps:
            if gap['type'] == 'category_gap' and gap['category'] == device_category:
                score += 2.0 if gap['priority'] == 'high' else 1.0
        
        # Bonus for addressing brand gaps
        device_brand = device.get('brand', '')
        for gap in inventory_gaps:
            if gap['type'] == 'brand_gap' and gap['brand'] == device_brand:
                score += 1.5 if gap['priority'] == 'high' else 0.8
        
        # Bonus for high profit margin
        if device.get('profit_margin') == 'high':
            score += 1.0
        elif device.get('profit_margin') == 'medium':
            score += 0.5
        
        return round(score, 2)
    
    def generate_recommendations(self) -> Dict[str, Any]:
        """Generate comprehensive inventory recommendations"""
        try:
            # Fetch data
            sales_data = self.get_sales_data()
            inventory_data = self.get_inventory_data()
            
            # Analyze trends
            sales_trends = self.analyze_sales_trends(sales_data)
            inventory_gaps = self.analyze_inventory_gaps(inventory_data, sales_trends)
            market_recommendations = self.get_market_recommendations()
            
            # Score and rank recommendations
            scored_recommendations = []
            for device in market_recommendations:
                score = self.calculate_recommendation_score(device, sales_trends, inventory_gaps)
                device['recommendation_score'] = score
                scored_recommendations.append(device)
            
            # Sort by score
            scored_recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)
            
            # Generate insights
            insights = []
            
            if sales_trends.get('total_recent_sales', 0) > 0:
                top_category = list(sales_trends.get('top_categories', {}).keys())[0] if sales_trends.get('top_categories') else None
                if top_category:
                    insights.append(f"📈 {top_category} is your best-selling category with {sales_trends['top_categories'][top_category]} units sold recently")
            
            for gap in inventory_gaps[:3]:  # Top 3 gaps
                if gap['type'] == 'category_gap':
                    insights.append(f"⚠️ Consider expanding {gap['category']} inventory - high demand but limited stock")
                elif gap['type'] == 'brand_gap':
                    insights.append(f"🏷️ {gap['brand']} products are selling well but you have limited variety")
            
            return {
                'recommendations': scored_recommendations[:10],  # Top 10
                'sales_trends': sales_trends,
                'inventory_gaps': inventory_gaps,
                'insights': insights,
                'analysis_date': datetime.now().isoformat(),
                'total_recommendations': len(scored_recommendations)
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

# Initialize the recommendation engine
recommendation_engine = InventoryRecommendationEngine()

@router.get("/inventory-recommendations")
async def get_inventory_recommendations():
    """Get AI-powered inventory recommendations"""
    try:
        recommendations = recommendation_engine.generate_recommendations()
        return {
            "success": True,
            "data": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sales-analysis")
async def get_sales_analysis():
    """Get detailed sales analysis"""
    try:
        sales_data = recommendation_engine.get_sales_data()
        analysis = recommendation_engine.analyze_sales_trends(sales_data)
        
        return {
            "success": True,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/inventory-gaps")
async def get_inventory_gaps():
    """Get inventory gap analysis"""
    try:
        sales_data = recommendation_engine.get_sales_data()
        inventory_data = recommendation_engine.get_inventory_data()
        sales_trends = recommendation_engine.analyze_sales_trends(sales_data)
        gaps = recommendation_engine.analyze_inventory_gaps(inventory_data, sales_trends)
        
        return {
            "success": True,
            "data": gaps
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))