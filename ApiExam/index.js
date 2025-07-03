const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const SIMULADOS_DIR = path.join(__dirname, 'simulados');

// 1. Listar simulados disponíveis
app.get('/simulados', (req, res) => {
    fs.readdir(SIMULADOS_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: 'Erro ao listar simulados.' });
        const simulados = files.filter(f => f.endsWith('.json'));
        res.json({ simulados });
    });
});

// 2. Endpoint para retornar questões de um simulado específico
app.get('/simulados/:nome', (req, res) => {
    const nome = req.params.nome;
    const simuladoPath = path.join(SIMULADOS_DIR, nome);
    if (!fs.existsSync(simuladoPath)) {
        return res.status(404).json({ error: 'Simulado não encontrado.' });
    }
    const simuladoData = JSON.parse(fs.readFileSync(simuladoPath, 'utf-8'));
    // Retorna apenas as questões e alternativas
    const questoes = simuladoData.map(q => ({
        questao_id: q.questao_id,
        questao: q.questao,
        alternativas: q.alternativas ? q.alternativas.map(a => ({ letra: a.letra, texto: a.texto })) : []
    }));
    res.json({ questoes });
});

// 3. Receber respostas do aluno e corrigir qualquer simulado informado
app.post('/corrigir', async (req, res) => {
    const { simulado_nome, respostas } = req.body;
    if (!simulado_nome || !Array.isArray(respostas) || respostas.length === 0) {
        return res.status(400).json({ error: 'Envie o nome do simulado e um array de respostas no padrão correto.' });
    }
    const simuladoPath = path.join(SIMULADOS_DIR, simulado_nome);
    if (!fs.existsSync(simuladoPath)) {
        return res.status(404).json({ error: 'Simulado não encontrado.' });
    }
    const simuladoData = JSON.parse(fs.readFileSync(simuladoPath, 'utf-8'));
    // 1. Análise do simulado (áreas, temas, questões)
    const resumoSimulado = simuladoData.map(q => ({
        questao_id: q.questao_id,
        area: q.area,
        tema: q.tema || '',
        enunciado: q.questao ? (q.questao.length > 100 ? q.questao.substring(0, 100) + '...' : q.questao) : ''
    }));
    let analiseSimulado = '';
    try {
        const promptSimulado = `Analise o simulado a seguir, identificando as áreas do direito, temas mais cobrados, grau de dificuldade geral e possíveis estratégias de estudo. Simulado: ${JSON.stringify(resumoSimulado)}`;
        const openaiResSimulado = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Você é um orientador de estudos para provas da OAB.' },
                { role: 'user', content: promptSimulado }
            ],
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        analiseSimulado = openaiResSimulado.data.choices[0].message.content;
    } catch (e) {
        analiseSimulado = 'Não foi possível obter a análise do simulado no momento.';
    }
    // Corrige as respostas
    let acertos = 0;
    let erros = [];
    let detalhes = [];
    for (const resposta of respostas) {
        const questao = simuladoData.find(q => q.questao_id === resposta.questao_id);
        const correta = (questao && questao.alternativas) ? questao.alternativas.find(a => a.correta) : null;
        const acertou = correta && resposta.resposta_usuario === correta.letra;
        if (acertou) acertos++;
        else erros.push({ questao_id: resposta.questao_id, respostaAluno: resposta.resposta_usuario, respostaCerta: correta ? correta.letra : null });
        detalhes.push({ questao_id: resposta.questao_id, resposta_usuario: resposta.resposta_usuario, correta: acertou, resposta_certa: correta ? correta.letra : null });
    }
    // 2. Diagnóstico do aluno, incluindo análise do simulado
    const prompt = `Você é um orientador de estudos da empresa MeuCurso (meucurso.com.br), especializada em preparação para a OAB. Com base na análise do simulado: \"${analiseSimulado}\", avalie o desempenho do aluno neste simulado OAB. Total de questões: ${respostas.length}. Acertos: ${acertos}. Erros: ${erros.length}. Informe os erros e acertos. Liste pontos fortes, pontos fracos e dê dicas de estudo personalizadas. Para cada ponto fraco, sugira produtos, cursos, trilhas ou materiais da MeuCurso que podem ajudar o aluno a reforçar os estudos. Ao final, convide o aluno a conhecer mais sobre a plataforma MeuCurso e seus diferenciais. Por fim, elabore um plano de estudos semanal personalizado para o aluno, indicando quais disciplinas e temas ele deve priorizar, com sugestões de carga horária e ordem de estudo.`;
    let diagnostico = '';
    try {
        const openaiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Você é um orientador de estudos para provas da OAB.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 700
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        diagnostico = openaiRes.data.choices[0].message.content;
    } catch (e) {
        diagnostico = 'Não foi possível obter o diagnóstico automático no momento.';
    }
    res.json({ total: respostasAluno.length, acertos, erros, detalhes, analiseSimulado, diagnostico });
});

app.listen(PORT, () => {
    console.log(`API de Simulados rodando em http://localhost:${PORT}`);
});
