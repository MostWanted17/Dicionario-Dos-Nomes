import json
import time
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote
from fake_useragent import UserAgent

# Configuration
IDIOMAS = {'en': 'English', 'fr': 'French'}
PAUSA = 5  # seconds between requests to avoid rate limiting
MAX_RETRIES = 3
ARQUIVO_INPUT = "../../dicionario-dos-nomes/src/database/nomes_femininos_todas_paginas_ordenados.json"
ARQUIVO_SAIDA = "nomes_traduzidos.json"
ARQUIVO_ERROS = "erros_traducao.log"
CACHE_FILE = "traducoes_cache.json"

# Initialize user agent generator
ua = UserAgent()

def load_cache():
    """Load translation cache from file"""
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"⚠️ Error loading cache: {e}")
    return {}

def save_cache(cache):
    """Save translation cache to file"""
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"⚠️ Error saving cache: {e}")

def log_error(message):
    """Log errors to file"""
    with open(ARQUIVO_ERROS, 'a', encoding='utf-8') as f:
        f.write(f"{time.ctime()} - {message}\n")

def google_translate_scrape(text, target_lang, source_lang='pt'):
    """Scrape Google Translate for translations (will retry indefinitely until success)"""
    # Create cache key
    cache_key = f"{source_lang}_{target_lang}_{text}"
    cache = load_cache()
    
    # Check cache first
    if cache_key in cache:
        return cache[cache_key]
    
    # Prepare the request
    url = f"https://translate.google.com/m?sl={source_lang}&tl={target_lang}&q={quote(text)}"
    
    while True:  # Infinite retry loop
        try:
            headers = {
                'User-Agent': ua.random,
                'Referer': 'https://translate.google.com/',
                'Accept-Language': 'en-US,en;q=0.9',
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Parse the response
            soup = BeautifulSoup(response.text, 'html.parser')
            result_div = soup.find('div', {'class': 'result-container'})
            
            if not result_div:
                raise ValueError("Translation element not found in page")
            
            translation = result_div.text.strip()
            
            # Cache the result
            cache[cache_key] = translation
            save_cache(cache)
            
            return translation
            
        except Exception as e:
            error_msg = f"❌ Failed to translate '{text}' to {target_lang}: {str(e)}. Retrying..."
            print(error_msg)
            log_error(error_msg)
            
            # Progressive backoff (wait longer after each failure)
            wait_time = PAUSA * 2  # Start with double the normal pause
            print(f"⚠️ Waiting {wait_time} seconds before retrying...")
            time.sleep(wait_time)
            
def translate_list(items, target_lang):
    """Translate a list of items"""
    return [google_translate_scrape(item, target_lang) for item in items]

def load_json_file(path):
    """Load JSON file"""
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json_file(data, path):
    """Save JSON file"""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    """Main processing function"""
    # Load data
    names_data = load_json_file(ARQUIVO_INPUT)
    translated_data = load_json_file(ARQUIVO_SAIDA) or []
    
    # Get already translated names
    translated_names = {item['nome'] for item in translated_data}
    
    # Process each name
    for idx, item in enumerate(names_data, 1):
        name = item['nome']
        
        if name in translated_names:
            print(f"⏭️ Skipping {name} (already translated)")
            continue
        
        print(f"\n🔄 Processing ({idx}/{len(names_data)}): {name}")
        
        new_entry = {
            'nome': name,
            'significados': {'pt': item['significado']},
            'origens': {'pt': item['origens']}
        }
        
        try:
            # Translate for each language
            for lang_code, lang_name in IDIOMAS.items():
                print(f"  Translating to {lang_name}...")
                
                # Translate meaning
                new_entry['significados'][lang_code] = google_translate_scrape(
                    item['significado'], lang_code)
                
                # Translate origins
                new_entry['origens'][lang_code] = translate_list(
                    item['origens'], lang_code)
                
                time.sleep(PAUSA)  # Respectful delay between requests
            
            # Add to results
            translated_data.append(new_entry)
            save_json_file(translated_data, ARQUIVO_SAIDA)
            
            print(f"✅ Saved: {name}")
            
        except Exception as e:
            error_msg = f"❌ Critical error with {name}: {str(e)}"
            print(error_msg)
            log_error(error_msg)
    
    print("\n✅ Translation complete!")
    print(f"Results saved to: {ARQUIVO_SAIDA}")
    print(f"Errors logged to: {ARQUIVO_ERROS}")

if __name__ == '__main__':
    # Install required packages if needed
    try:
        from bs4 import BeautifulSoup
        from fake_useragent import UserAgent
    except ImportError:
        print("Installing required packages...")
        import subprocess
        subprocess.run(['pip', 'install', 'beautifulsoup4', 'fake-useragent', 'requests'])
    
    main()