import json
import time
import os
from translate import Translator

IDIOMAS = ['en', 'fr']  # idiomas para tradução
PAUSA = 1  # segundos entre requisições para evitar bloqueio

def traduzir_texto(texto, idioma_destino):
    try:
        translator = Translator(to_lang=idioma_destino, from_lang='pt')
        return translator.translate(texto)
    except Exception as e:
        print(f"❌ Erro na tradução de '{texto}' para '{idioma_destino}': {e}")
        return texto

def traduzir_lista(lista, idioma_destino):
    traduzidos = []
    for item in lista:
        traduzidos.append(traduzir_texto(item, idioma_destino))
        time.sleep(PAUSA)
    return traduzidos

def processar():
    with open("../nomes_masculinos_todas_paginas_ordenados.json", "r", encoding="utf-8") as f:
        nomes = json.load(f)

    resultado = []
    traduzidos = set()

    # Se já existe arquivo de traduções, lê e carrega os nomes já processados
    if os.path.exists("nomes_traduzidos.json"):
        with open("nomes_traduzidos.json", "r", encoding="utf-8") as f_in:
            resultado = json.load(f_in)
            traduzidos = set(item["nome"] for item in resultado)

    total = len(nomes)
    for idx, item in enumerate(nomes, 1):
        if item["nome"] in traduzidos:
            print(f"⏭️ Pulando {item['nome']} (já traduzido)")
            continue

        print(f"🔄 Traduzindo ({idx}/{total}): {item['nome']}")

        novo = {
            "nome": item["nome"],
            "significados": {"pt": item["significado"]},
            "origens": {"pt": item["origens"]}
        }

        for idioma in IDIOMAS:
            sig = traduzir_texto(item["significado"], idioma)
            time.sleep(PAUSA)

            ori = traduzir_lista(item["origens"], idioma)
            time.sleep(PAUSA)

            novo["significados"][idioma] = sig
            novo["origens"][idioma] = ori

        resultado.append(novo)
        traduzidos.add(item["nome"])

        with open("nomes_traduzidos.json", "w", encoding="utf-8") as f_out:
            json.dump(resultado, f_out, indent=2, ensure_ascii=False)

    print("✅ Tradução concluída. Verifique o arquivo 'nomes_traduzidos.json'.")


if __name__ == "__main__":
    processar()
