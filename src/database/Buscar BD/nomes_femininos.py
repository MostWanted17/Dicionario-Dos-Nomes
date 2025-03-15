import requests
from bs4 import BeautifulSoup
import json
import re
import unicodedata
import time
import socket
import os
import string

ARQUIVO_JSON = "nomes_femininos_todas_paginas.json"

def verificar_conexao(host="8.8.8.8", port=53, timeout=5):
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
        return True
    except socket.error:
        return False

def remover_acentos(texto):
    return ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')

def obter_soup(url):
    while True:
        if not verificar_conexao():
            print("Sem conexão com a internet. Tentando novamente...")
            time.sleep(10)
            continue
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
        except requests.exceptions.RequestException as e:
            print(f"Erro ao acessar {url}, tentando novamente... ({e})")
            time.sleep(5)

def carregar_progresso():
    if os.path.exists(ARQUIVO_JSON):
        with open(ARQUIVO_JSON, "r", encoding="utf-8") as arquivo:
            try:
                return json.load(arquivo)
            except json.JSONDecodeError:
                return []
    return []

def salvar_progresso(novo_nome):
    nomes_gerais.append(novo_nome)
    with open(ARQUIVO_JSON, "w", encoding="utf-8") as arquivo:
        json.dump(nomes_gerais, arquivo, indent=2, ensure_ascii=False)

def detectar_genero(nome):
    """Verifica o gênero do nome na página e retorna 'masculino' ou 'feminino'."""
    nome_formatado = remover_acentos(nome.lower()).replace(" ", "-")

    if nome_formatado == "mikasa":
        url_nome = "https://www.dicionariodenomesproprios.com.br/misaka/"
    elif nome_formatado == "kathleen":
        url_nome = "https://www.dicionariodenomesproprios.com.br/katheleen/"
    else:
        url_nome = f"https://www.dicionariodenomesproprios.com.br/{nome_formatado}/"

    soup_nome = obter_soup(url_nome)

    # Busca todas as ocorrências de "origem-related"
    origem_related = soup_nome.find_all("p", class_="origem-related")
    for elemento in origem_related:
        genero = elemento.find("strong")
        if genero:
            texto_genero = genero.text.strip().lower()
            if "nome feminino" in texto_genero or "female" in texto_genero:
                return "feminino"
            elif "nome masculino" in texto_genero or "male" in texto_genero:
                return "masculino"

    return "masculino"  # Retorno padrão caso não encontre

def obter_dados_nome(nome):
    """Obtém os dados do nome se for feminino, senão ignora."""
    if detectar_genero(nome) == "masculino":
        print(f"⏭️ {nome} - Gênero masculino detectado. Pulando...")
        return None

    nome_formatado = remover_acentos(nome.lower()).replace(" ", "-")

    if nome_formatado == "mikasa":
        url_nome = "https://www.dicionariodenomesproprios.com.br/misaka/"
    elif nome_formatado == "kathleen":
        url_nome = "https://www.dicionariodenomesproprios.com.br/katheleen/"
    else:
        url_nome = f"https://www.dicionariodenomesproprios.com.br/{nome_formatado}/"
    
    soup_nome = obter_soup(url_nome)

    div_significado = soup_nome.find("div", id="significado")
    significado = "Significado não encontrado"
    if div_significado:
        significado_p = div_significado.find("p")
        if significado_p:
            significado = re.sub(rf"^{nome}:\s*", "", significado_p.text.strip())
    
    origem_p = soup_nome.find("p", id="origem")
    origens = [link.text.strip() for link in origem_p.find_all("a")] if origem_p else []
    
    dados_nome = {"nome": nome, "significado": significado, "origens": origens}
    salvar_progresso(dados_nome)
    print(f"✅ {nome} - Dados coletados e salvos!")
    return dados_nome

def coletar_nomes_relacionados(nome):
    """Coleta nomes relacionados, mas ignora masculinos."""
    nome_formatado = remover_acentos(nome.lower()).replace(" ", "-")

    if nome_formatado == "mikasa":
        url_nome = "https://www.dicionariodenomesproprios.com.br/misaka/"
    elif nome_formatado == "kathleen":
        url_nome = "https://www.dicionariodenomesproprios.com.br/katheleen/"
    else:
        url_nome = f"https://www.dicionariodenomesproprios.com.br/{nome_formatado}/"

    soup_nome = obter_soup(url_nome)
    
    ul_relacionados = soup_nome.find("ul", class_="nomes-relacionados")
    if ul_relacionados:
        for li in ul_relacionados.find_all("li"):
            a = li.find("a")
            if a:
                nome_relacionado = a.text.strip()

                # Verifica se o nome é feminino antes de coletar
                if detectar_genero(nome_relacionado) == "masculino":
                    print(f"⏭️ Nome relacionado {nome_relacionado} é masculino. Pulando...")
                    continue

                if nome_relacionado not in nomes_existentes:
                    dados_relacionado = obter_dados_nome(nome_relacionado)
                    if dados_relacionado:
                        nomes_existentes.add(nome_relacionado)
                        print(f"✅ Nome relacionado coletado: {nome_relacionado}")
                else:
                    print(f"⏭️ Nome relacionado {nome_relacionado} já coletado. Pulando...")

def coletar_top_nomes():
    print("\nPegando a Lista dos Nomes Populares Femininos")
    url_nomes_top = "https://www.dicionariodenomesproprios.com.br/nomes-femininos/"
    soup_nomes_top = obter_soup(url_nomes_top)
    lista_top = soup_nomes_top.find("ol", class_="gender-top--list female")
    
    if lista_top:
        for li in lista_top.find_all("li"):
            a = li.find("a")
            if a:
                nome_top = a.find("span", class_="name-title").text.strip()
                
                if nome_top not in nomes_existentes:
                    print(f"Coletando dados para {nome_top} (Nome Popular)")
                    dados_nome_top = obter_dados_nome(nome_top)
                    if dados_nome_top:
                        nomes_existentes.add(nome_top)
                else:
                    print(f"⏭️ {nome_top} já coletado. Pulando...")

def coletar_top_nomes_por_letra():
    print("\nColetando Nomes Populares Femininos por letra:")
    for letra in string.ascii_lowercase:
        url_letra = f"https://www.dicionariodenomesproprios.com.br/nomes-femininos/{letra}/"
        print(f"Processando letra: {letra.upper()}")
        try:
            soup_letra = obter_soup(url_letra)
            lista_letra = soup_letra.find("ol", class_="gender-top--list female")
            
            if lista_letra:
                for li in lista_letra.find_all("li"):
                    a = li.find("a")
                    if a:
                        nome_letra = a.find("span", class_="name-title").text.strip()
                        
                        if nome_letra not in nomes_existentes:
                            print(f"Coletando dados para {nome_letra} (Letra {letra.upper()})")
                            dados_nome_letra = obter_dados_nome(nome_letra)
                            if dados_nome_letra:
                                nomes_existentes.add(nome_letra)
                        else:
                            print(f"⏭️ {nome_letra} já coletado. Pulando...")
        except Exception as e:
            print(f"Erro ao processar letra {letra.upper()}: {e}")

nomes_gerais = carregar_progresso()
nomes_existentes = {d["nome"] for d in nomes_gerais}

for pagina in range(1, 159):
    print(f"\nProcessando página: {pagina}")
    url_base = f"https://www.dicionariodenomesproprios.com.br/nomes-femininos/{pagina}/"
    soup = obter_soup(url_base)
    
    for nome_span in soup.find_all("span", class_="list-wide--name full-w"):
        nome = nome_span.text.strip()
        if nome not in nomes_existentes:
            dados_nome = obter_dados_nome(nome)
            if dados_nome:
                nomes_existentes.add(nome)

        coletar_nomes_relacionados(nome)

coletar_top_nomes()
coletar_top_nomes_por_letra()

print("\nArquivo JSON atualizado com sucesso!")
