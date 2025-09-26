# Configuration Template for DysLexiCheck
# Copy this file to config.py and add your actual API keys

import os

# Azure Computer Vision API Configuration
AZURE_CONFIG = {
    'subscription_key': os.getenv('AZURE_SUBSCRIPTION_KEY', 'your_azure_subscription_key_here'),
    'endpoint': os.getenv('AZURE_ENDPOINT', 'https://your-resource-name.cognitiveservices.azure.com/')
}

# Bing Spell Check API Configuration
BING_CONFIG = {
    'api_key': os.getenv('BING_API_KEY', 'your_bing_api_key_here'),
    'endpoint': 'https://api.bing.microsoft.com/v7.0/SpellCheck'
}

# Application Configuration
APP_CONFIG = {
    'debug': os.getenv('DEBUG', 'False').lower() == 'true',
    'port': int(os.getenv('PORT', 8501)),
    'host': os.getenv('HOST', 'localhost')
}

# Model Configuration
MODEL_CONFIG = {
    'model_path': 'model_training/Decision_tree_model.sav',
    'use_fallback': True,  # Use fallback values when APIs are unavailable
    'cache_predictions': True
}

# Feature Extraction Configuration
FEATURE_CONFIG = {
    'spelling_weight': 0.25,
    'grammar_weight': 0.25,
    'correction_weight': 0.25,
    'phonetic_weight': 0.25,
    'phonetic_algorithms': {
        'soundex': 0.2,
        'metaphone': 0.2,
        'caverphone': 0.5,
        'nysiis': 0.1
    }
}

# Vocabulary Configuration
VOCAB_CONFIG = {
    'elementary_path': 'data/elementary_voc.csv',
    'intermediate_path': 'data/intermediate_voc.csv',
    'test_word_count': 10
}

# Audio Configuration
AUDIO_CONFIG = {
    'recognition_timeout': 10,  # seconds
    'speech_rate': 150,  # words per minute for TTS
    'language': 'en-US'
}

# Security Configuration
SECURITY_CONFIG = {
    'max_file_size': 10 * 1024 * 1024,  # 10MB
    'allowed_extensions': ['.jpg', '.jpeg', '.png'],
    'rate_limit': 100  # requests per hour
}

# Logging Configuration
LOGGING_CONFIG = {
    'level': os.getenv('LOG_LEVEL', 'INFO'),
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'file': 'logs/dyslexicheck.log'
}

def get_config():
    """Get all configuration as a dictionary"""
    return {
        'azure': AZURE_CONFIG,
        'bing': BING_CONFIG,
        'app': APP_CONFIG,
        'model': MODEL_CONFIG,
        'features': FEATURE_CONFIG,
        'vocab': VOCAB_CONFIG,
        'audio': AUDIO_CONFIG,
        'security': SECURITY_CONFIG,
        'logging': LOGGING_CONFIG
    }

def validate_config():
    """Validate that required configuration is present"""
    required_keys = [
        AZURE_CONFIG['subscription_key'],
        AZURE_CONFIG['endpoint'],
        BING_CONFIG['api_key']
    ]
    
    missing_keys = []
    for key in required_keys:
        if not key or key.startswith('your_'):
            missing_keys.append(key)
    
    if missing_keys:
        print("⚠️  Warning: Missing API configuration!")
        print("Please update config.py with your actual API keys.")
        print("The application will run with limited functionality.")
        return False
    
    return True

# Environment-specific configurations
ENVIRONMENTS = {
    'development': {
        'debug': True,
        'cache_predictions': False,
        'use_fallback': True
    },
    'production': {
        'debug': False,
        'cache_predictions': True,
        'use_fallback': False
    },
    'testing': {
        'debug': True,
        'cache_predictions': False,
        'use_fallback': True
    }
}

def get_environment_config(env='development'):
    """Get environment-specific configuration"""
    return ENVIRONMENTS.get(env, ENVIRONMENTS['development'])