# Documentação do Projeto API de Simulados OAB

## Visão Geral

Este projeto é uma API desenvolvida em Node.js (Express) para correção automática e análise de simulados do Exame da OAB (Ordem dos Advogados do Brasil). O objetivo é auxiliar estudantes na preparação para a 1ª fase do exame, fornecendo feedback detalhado, diagnóstico de desempenho e recomendações de estudo personalizadas.

A API utiliza arquivos JSON para armazenar os simulados e as respostas dos alunos. Também integra com a API da OpenAI para gerar análises automáticas e planos de estudo.

## Estrutura dos Dados
- Os simulados estão na pasta `simulados/` (exemplo: `simulado_oab_3847.json`).
- As respostas dos alunos podem ser enviadas em formato JSON.

## Endpoints

### 1. Listar Simulados Disponíveis
- **Endpoint:** `GET /simulados`
- **Descrição:** Retorna uma lista dos arquivos de simulados disponíveis na pasta `simulados/`.
- **Resposta de exemplo:**
```json
{
  "simulados": ["simulado_oab_3847.json"]
}
```

### 2. Corrigir Respostas do Aluno e Gerar Diagnóstico
- **Endpoint:** `POST /corrigir`
- **Descrição:** Recebe um array de respostas do aluno, compara com o gabarito do simulado e retorna o resultado da correção, análise do simulado e diagnóstico personalizado.
- **Requisição:**
  - Corpo (JSON): Array de objetos com `questao_id` e `resposta_usuario`.
  - Exemplo:
```json
[
  { "questao_id": 1, "resposta_usuario": "A" },
  { "questao_id": 2, "resposta_usuario": "C" }
]
```
- **Resposta:**
  - `total`: total de questões respondidas
  - `acertos`: número de acertos
  - `erros`: lista de erros (questão, resposta do aluno, resposta correta)
  - `detalhes`: lista detalhada de cada questão
  - `analiseSimulado`: análise automática do simulado (áreas, temas, grau de dificuldade, estratégias)
  - `diagnostico`: diagnóstico personalizado do desempenho do aluno, pontos fortes/fracos, dicas e plano de estudos
- **Resposta de exemplo:**
```json
{
  "total": 2,
  "acertos": 1,
  "erros": [
    { "questao_id": 2, "respostaAluno": "C", "respostaCerta": "B" }
  ],
  "detalhes": [
    { "questao_id": 1, "resposta_usuario": "A", "correta": true, "resposta_certa": "A" },
    { "questao_id": 2, "resposta_usuario": "C", "correta": false, "resposta_certa": "B" }
  ],
  "analiseSimulado": "...",
  "diagnostico": "..."
}
```

## Observações
- A análise e o diagnóstico utilizam inteligência artificial (OpenAI) para gerar feedback e recomendações.
- Para funcionamento completo, é necessário configurar a chave da OpenAI no arquivo `.env` (ver instruções em `simulados/README_OPENAI.txt`).

## Execução
- Para rodar a API, execute: `npm start`
- A API ficará disponível em `http://localhost:3000`

---

Este projeto é voltado para preparação de alunos para o Exame da OAB, com foco em automação de correção, análise pedagógica e orientação personalizada.
