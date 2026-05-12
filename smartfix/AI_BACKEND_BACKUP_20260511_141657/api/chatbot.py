from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import json
import re
from datetime import datetime
import sqlite3
import os

chatbot_bp = Blueprint('chatbot', __name__)

# Simple knowledge base for the chatbot
KNOWLEDGE_BASE = {
    "greetings": [
        "Hello! Welcome to Corex Ltd. How can I help you today?",
        "Hi there! I'm here to assist you with your electronic device needs.",
        "Welcome to Corex Ltd! What can I help you with?"
    ],
    "services": {
        "repair": "We offer professional repair services for smartphones, laptops, tablets, smartwatches, and other electronic devices. Our expert technicians use genuine parts and provide warranty on all repairs.",
        "devices": "We sell a wide range of electronic devices including iPhones, Android phones, MacBooks, Windows laptops, iPads, Apple Watches, and various accessories.",
        "warranty": "All our repairs come with a warranty period. Device sales include manufacturer warranty. Contact us for specific warranty details.",
        "pricing": "Our pricing is competitive and transparent. We provide free quotes for repairs. Device prices vary by model and specifications."
    },
    "device_categories": {
        "smartphones": "We have the latest iPhone and Android smartphones in stock. Popular models include iPhone 15, Samsung Galaxy S24, and Google Pixel series.",
        "laptops": "Our laptop collection includes MacBooks, Dell, HP, Lenovo, and ASUS models for both personal and professional use.",
        "tablets": "We offer iPads, Samsung Galaxy Tabs, and other tablet devices for entertainment and productivity.",
        "smartwatches": "Apple Watch, Samsung Galaxy Watch, and fitness trackers are available with health monitoring features.",
        "accessories": "We stock cases, chargers, screen protectors, headphones, and other essential accessories."
    },
    "repair_issues": {
        "screen": "We repair cracked screens, display issues, and touch problems for all device types.",
        "battery": "Battery replacement and charging issues are common repairs we handle professionally.",
        "water_damage": "We provide water damage repair services with specialized cleaning and component replacement.",
        "software": "Software issues, virus removal, and system optimization services are available.",
        "hardware": "We fix hardware problems including motherboard issues, camera problems, and speaker repairs."
    },
    "contact": {
        "location": "We're located in Kigali, Rwanda. Visit our store for device purchases and repair services.",
        "hours": "We're open Monday to Saturday, 8:00 AM to 6:00 PM.",
        "phone": "Contact us at +250 XXX XXX XXX for immediate assistance.",
        "emergency": "For urgent repairs, we offer same-day service for critical business devices."
    }
}

def get_device_info():
    """Get real device information from the database"""
    try:
        # Connect to the main system database
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'smartfix.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get available devices
        cursor.execute("""
            SELECT i.name, i.price, i.quantity, c.name as category 
            FROM inventory_items i 
            JOIN categories c ON i.category_id = c.id 
            WHERE i.quantity > 0 
            ORDER BY i.name
        """)
        
        devices = cursor.fetchall()
        conn.close()
        
        return devices
    except Exception as e:
        print(f"Database error: {e}")
        return []

def analyze_intent(message):
    """Analyze user message to determine intent"""
    message_lower = message.lower()
    
    # Greeting patterns
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
        return 'greeting'
    
    # Device inquiry patterns
    if any(word in message_lower for word in ['phone', 'smartphone', 'iphone', 'android', 'samsung']):
        return 'smartphone_inquiry'
    elif any(word in message_lower for word in ['laptop', 'macbook', 'computer', 'pc']):
        return 'laptop_inquiry'
    elif any(word in message_lower for word in ['tablet', 'ipad']):
        return 'tablet_inquiry'
    elif any(word in message_lower for word in ['watch', 'smartwatch', 'apple watch']):
        return 'watch_inquiry'
    elif any(word in message_lower for word in ['accessory', 'accessories', 'case', 'charger', 'headphone']):
        return 'accessory_inquiry'
    
    # Repair inquiry patterns
    if any(word in message_lower for word in ['repair', 'fix', 'broken', 'cracked', 'damaged']):
        if any(word in message_lower for word in ['screen', 'display']):
            return 'screen_repair'
        elif any(word in message_lower for word in ['battery', 'charging', 'power']):
            return 'battery_repair'
        elif any(word in message_lower for word in ['water', 'wet', 'liquid']):
            return 'water_damage'
        else:
            return 'general_repair'
    
    # Service inquiries
    if any(word in message_lower for word in ['service', 'services', 'what do you do']):
        return 'services'
    
    # Pricing inquiries
    if any(word in message_lower for word in ['price', 'cost', 'how much', 'pricing']):
        return 'pricing'
    
    # Contact inquiries
    if any(word in message_lower for word in ['contact', 'location', 'address', 'phone', 'hours', 'open']):
        return 'contact'
    
    # Warranty inquiries
    if any(word in message_lower for word in ['warranty', 'guarantee']):
        return 'warranty'
    
    return 'general'

def generate_response(intent, message):
    """Generate appropriate response based on intent"""
    
    if intent == 'greeting':
        return {
            "message": KNOWLEDGE_BASE["greetings"][0],
            "suggestions": [
                "What devices do you have?",
                "I need a repair service",
                "What are your prices?",
                "Where are you located?"
            ]
        }
    
    elif intent == 'smartphone_inquiry':
        devices = get_device_info()
        smartphones = [d for d in devices if 'phone' in d[3].lower() or 'smartphone' in d[3].lower()]
        
        if smartphones:
            device_list = "\n".join([f"• {d[0]} - {d[1]:,.0f} RWF ({d[2]} available)" for d in smartphones[:5]])
            response = f"Here are our available smartphones:\n\n{device_list}\n\nWould you like more details about any specific model?"
        else:
            response = KNOWLEDGE_BASE["device_categories"]["smartphones"]
        
        return {
            "message": response,
            "suggestions": [
                "Tell me about iPhone models",
                "What Android phones do you have?",
                "I need a repair service",
                "What are your prices?"
            ]
        }
    
    elif intent == 'laptop_inquiry':
        devices = get_device_info()
        laptops = [d for d in devices if 'laptop' in d[3].lower()]
        
        if laptops:
            device_list = "\n".join([f"• {d[0]} - {d[1]:,.0f} RWF ({d[2]} available)" for d in laptops[:5]])
            response = f"Here are our available laptops:\n\n{device_list}\n\nWould you like more information about any specific model?"
        else:
            response = KNOWLEDGE_BASE["device_categories"]["laptops"]
        
        return {
            "message": response,
            "suggestions": [
                "Tell me about MacBooks",
                "What Windows laptops do you have?",
                "I need laptop repair",
                "What are your prices?"
            ]
        }
    
    elif intent == 'tablet_inquiry':
        return {
            "message": KNOWLEDGE_BASE["device_categories"]["tablets"],
            "suggestions": [
                "Tell me about iPads",
                "What Android tablets do you have?",
                "I need tablet repair",
                "What are your prices?"
            ]
        }
    
    elif intent == 'watch_inquiry':
        return {
            "message": KNOWLEDGE_BASE["device_categories"]["smartwatches"],
            "suggestions": [
                "Tell me about Apple Watch",
                "What fitness trackers do you have?",
                "I need watch repair",
                "What are your prices?"
            ]
        }
    
    elif intent == 'accessory_inquiry':
        return {
            "message": KNOWLEDGE_BASE["device_categories"]["accessories"],
            "suggestions": [
                "What phone cases do you have?",
                "Do you have wireless chargers?",
                "What headphones are available?",
                "What are your prices?"
            ]
        }
    
    elif intent == 'screen_repair':
        return {
            "message": KNOWLEDGE_BASE["repair_issues"]["screen"] + " We offer free diagnosis and competitive pricing with warranty on all screen repairs.",
            "suggestions": [
                "How much for iPhone screen repair?",
                "Do you repair laptop screens?",
                "What's your warranty policy?",
                "Where are you located?"
            ]
        }
    
    elif intent == 'battery_repair':
        return {
            "message": KNOWLEDGE_BASE["repair_issues"]["battery"] + " We use genuine batteries and provide warranty on all battery replacements.",
            "suggestions": [
                "How much for battery replacement?",
                "How long does battery repair take?",
                "What's your warranty policy?",
                "Where are you located?"
            ]
        }
    
    elif intent == 'water_damage':
        return {
            "message": KNOWLEDGE_BASE["repair_issues"]["water_damage"] + " Time is critical for water damage - bring your device as soon as possible for best results.",
            "suggestions": [
                "How much for water damage repair?",
                "How long does it take?",
                "What's your success rate?",
                "Where are you located?"
            ]
        }
    
    elif intent == 'general_repair':
        return {
            "message": KNOWLEDGE_BASE["services"]["repair"],
            "suggestions": [
                "What devices do you repair?",
                "How much do repairs cost?",
                "What's your warranty policy?",
                "Where are you located?"
            ]
        }
    
    elif intent == 'services':
        return {
            "message": f"{KNOWLEDGE_BASE['services']['repair']}\n\n{KNOWLEDGE_BASE['services']['devices']}",
            "suggestions": [
                "What devices do you sell?",
                "What repairs do you do?",
                "What are your prices?",
                "Where are you located?"
            ]
        }
    
    elif intent == 'pricing':
        return {
            "message": KNOWLEDGE_BASE["services"]["pricing"] + " Contact us for specific pricing on repairs or device purchases.",
            "suggestions": [
                "Get repair quote",
                "See device prices",
                "Contact information",
                "Visit our store"
            ]
        }
    
    elif intent == 'contact':
        return {
            "message": f"{KNOWLEDGE_BASE['contact']['location']}\n{KNOWLEDGE_BASE['contact']['hours']}\n{KNOWLEDGE_BASE['contact']['phone']}",
            "suggestions": [
                "Get directions",
                "Call now",
                "What services do you offer?",
                "What devices do you have?"
            ]
        }
    
    elif intent == 'warranty':
        return {
            "message": KNOWLEDGE_BASE["services"]["warranty"],
            "suggestions": [
                "What's covered under warranty?",
                "How long is the warranty?",
                "What services do you offer?",
                "Contact information"
            ]
        }
    
    else:  # general
        return {
            "message": "I'm here to help you with information about our electronic devices and repair services. What would you like to know?",
            "suggestions": [
                "What devices do you sell?",
                "I need a repair service",
                "What are your prices?",
                "Where are you located?"
            ]
        }

@chatbot_bp.route('/chat', methods=['POST'])
@cross_origin()
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        # Analyze intent and generate response
        intent = analyze_intent(message)
        response = generate_response(intent, message)
        
        return jsonify({
            'success': True,
            'response': response['message'],
            'suggestions': response.get('suggestions', []),
            'intent': intent,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@chatbot_bp.route('/chat/suggestions', methods=['GET'])
@cross_origin()
def get_suggestions():
    """Get initial conversation suggestions"""
    return jsonify({
        'success': True,
        'suggestions': [
            "What devices do you have available?",
            "I need my phone repaired",
            "What are your repair prices?",
            "Where is your store located?",
            "What services do you offer?",
            "Do you have iPhone 15 in stock?"
        ]
    })