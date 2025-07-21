import json
import time
import os
import requests
from translate import Translator

IDIOMAS = ['en', 'fr']
PAUSA = 0.5  # pausa menor
RETRY_INTERVAL = 5
MAX_RETRY = 10
ARQUIVO_INPUT = "../nomes_masculinos_todas_paginas_ordenados.json"
ARQUIVO_SAIDA = "nomes_traduzidos.json"
ARQUIVO_ERROS = "erros_traducao.log"

def verificar_internet():
    for tentativa in range(1, MAX_RETRY + 1):
        try:
            requests.get("https://www.google.com", timeout=5)
            return True
        except (requests.ConnectionError, requests.Timeout, requests.exceptions.ReadTimeout):
            print(f"📡 Sem conexão (tentativa {tentativa}/{MAX_RETRY})... aguardando {RETRY_INTERVAL}s")
            time.sleep(RETRY_INTERVAL)
    return False

def log_erro(mensagem):
    with open(ARQUIVO_ERROS, "a", encoding="utf-8") as f:
        f.write(mensagem + "\n")

def traduzir_texto(texto, idioma_destino):
    while True:
        if not verificar_internet():
            print("🚫 Sem conexão estável. Aguardando reconexão...")
            continue
        try:
            translator = Translator(to_lang=idioma_destino, from_lang='pt')
            return translator.translate(texto)
        except Exception as e:
            erro = f"❌ Erro ao traduzir '{texto}' para '{idioma_destino}': {e}"
            print(erro)
            log_erro(erro)
            print("🔁 Tentando novamente em alguns segundos...")
            time.sleep(RETRY_INTERVAL)

def traduzir_lista(lista, idioma_destino):
    return [traduzir_texto(item, idioma_destino) for item in lista]

def carregar_arquivo(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def salvar_arquivo(dados, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)

def processar():
    nomes = carregar_arquivo(ARQUIVO_INPUT)
    resultado = carregar_arquivo(ARQUIVO_SAIDA)
    nomes_traduzidos = set(item["nome"] for item in resultado)

    total = len(nomes)
    for idx, item in enumerate(nomes, 1):
        nome = item["nome"]
        if nome in nomes_traduzidos:
            print(f"⏭️ Pulando {nome} (já traduzido)")
            continue

        print(f"🔄 Traduzindo ({idx}/{total}): {nome}")

        novo = {
            "nome": nome,
            "significados": {"pt": item["significado"]},
            "origens": {"pt": item["origens"]}
        }

        for idioma in IDIOMAS:
            novo["significados"][idioma] = traduzir_texto(item["significado"], idioma)
            novo["origens"][idioma] = traduzir_lista(item["origens"], idioma)
            time.sleep(PAUSA)  # só pausa depois de cada conjunto idioma

        resultado.append(novo)
        nomes_traduzidos.add(nome)

        # Salvamento incremental
        salvar_arquivo(resultado, ARQUIVO_SAIDA)

    print("✅ Tradução concluída. Verifique o arquivo:", ARQUIVO_SAIDA)


if __name__ == "__main__":
    processar()
