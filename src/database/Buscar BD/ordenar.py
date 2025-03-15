import json
import os

def ordenar_json(arquivo_entrada, arquivo_saida):
    """
    Ordena um arquivo JSON por nome, remove duplicatas e salva o resultado.

    Args:
        arquivo_entrada (str): Caminho para o arquivo JSON de entrada.
        arquivo_saida (str): Caminho para o arquivo JSON de saída.
    """

    if not os.path.exists(arquivo_entrada):
        print(f"❌ Erro: Arquivo '{arquivo_entrada}' não encontrado.")
        return

    try:
        # Carrega os dados do JSON de entrada
        with open(arquivo_entrada, 'r', encoding='utf-8') as arquivo:
            dados = json.load(arquivo)

        if not isinstance(dados, list):
            print("❌ Erro: O JSON deve conter uma lista de objetos.")
            return

        # Filtra apenas itens que possuem a chave 'nome'
        dados_validos = [item for item in dados if isinstance(item, dict) and 'nome' in item]

        if not dados_validos:
            print("⚠️ Nenhum item válido encontrado no JSON.")
            return

        # Ordena os dados por nome, ignorando maiúsculas/minúsculas
        dados_ordenados = sorted(dados_validos, key=lambda x: x['nome'].lower())

        # Remove duplicatas, mantendo apenas o primeiro item encontrado para cada nome
        nomes_vistos = set()
        dados_unicos = []
        nomes_duplicados = {}

        for item in dados_ordenados:
            nome = item['nome'].strip().lower()
            if nome in nomes_vistos:
                nomes_duplicados[nome] = nomes_duplicados.get(nome, 1) + 1
            else:
                nomes_vistos.add(nome)
                dados_unicos.append(item)

        # Exibir nomes duplicados, se houver
        if nomes_duplicados:
            print("\n🔁 Nomes duplicados encontrados:")
            for nome, count in nomes_duplicados.items():
                print(f"   - {nome} ({count}x)")
            print(f"\n🔻 Total de {sum(nomes_duplicados.values()) - len(nomes_duplicados)} nomes duplicados removidos.")

        # Salva os dados ordenados e sem duplicatas
        with open(arquivo_saida, 'w', encoding='utf-8') as arquivo:
            json.dump(dados_unicos, arquivo, ensure_ascii=False, indent=4)

        print(f"\n✅ {len(dados_unicos)} nomes únicos ordenados e salvos em '{arquivo_saida}'.")

    except json.JSONDecodeError:
        print(f"❌ Erro: Arquivo '{arquivo_entrada}' não é um JSON válido.")
    except Exception as e:
        print(f"⚠️ Ocorreu um erro inesperado: {e}")

# Solicita os arquivos ao usuário
arquivo_entrada = input("📂 Digite o nome do arquivo JSON de entrada: ").strip()
arquivo_saida = input("💾 Digite o nome do arquivo JSON de saída: ").strip()

ordenar_json(arquivo_entrada, arquivo_saida)
