# 🧠 Simulador de Algoritmo de Rede Social

Projeto didático desenvolvido para fins educacionais no **Mundo SENAI**, com o objetivo de demonstrar de forma interativa e visual como os **algoritmos das redes sociais** operam por trás dos feeds personalizados.

## 📘 Contexto Educacional

Este projeto faz parte da apresentação **“A verdade por trás dos algoritmos”**, elaborada pelo Instrutor **Lenon Yuri**. A apresentação explora os seguintes temas:

- Como as redes sociais decidem o que você vê.
- Por que o conteúdo que aparece parece “adivinhar” seus gostos.
- Como algoritmos, modelos e inteligência artificial influenciam seu comportamento online.
- Quais dados são coletados sobre você — e como eles são usados.
- Impactos sociais, éticos e psicológicos da personalização algorítmica.

O material base pode ser consultado no PDF da apresentação, que contextualiza a base teórica deste simulador.

## 🎯 Objetivo

O projeto visa simular de forma visual e funcional:

- A lógica de um feed ordenado por **engajamento**.
- A influência de **interações do usuário** (curtidas, comentários, denúncias etc.).
- A atuação de **bolhas de interesse** (clusters).
- A **viralização de conteúdos** mesmo fora da bolha.
- O reforço comportamental causado por algoritmos personalizados.

## 🚀 Funcionalidades do Simulador

- Geração dinâmica de postagens com dados aleatórios.
- Botões de interação real (Curtir, Descurtir, Comentar, Compartilhar, Denunciar).
- Cálculo de **score algorítmico** com base em pesos reais de redes sociais.
- **Simulação de bolhas**: o usuário escolhe sua bolha de afinidade (Tech, Política, Lifestyle).
- **Conteúdos virais** podem romper a bolha e aparecer com frequência.
- Identificação visual de postagens “dentro” ou “fora” da bolha do usuário.
- Interface responsiva e amigável com **HTML + Bootstrap + CSS + JavaScript puro**.

## 🧠 Como funciona o algoritmo

1. Cada post recebe uma pontuação baseada em:
   - Curtidas (+5)
   - Comentários (+4)
   - Compartilhamentos (+8)
   - Descurtidas (–3)
   - Denúncias (–15)
2. O algoritmo simula o comportamento da plataforma:
   - Quanto mais um tipo de conteúdo é consumido, mais ele aparece.
   - Postagens virais são impulsionadas mesmo fora da bolha.
   - O algoritmo **aprende** com as interações do usuário.

## 💡 Estrutura dos Arquivos

```

/algoritmo-simulador/
│
├── index.html         # Estrutura do simulador e interface
├── style.css          # Estilo visual customizado
├── script.js          # Lógica do algoritmo, interações e feed
└── README.md          # Documentação explicativa (este arquivo)

```

## 📚 Referência Teórica

Este projeto foi fundamentado na apresentação:

**Red Black Modern Technology Presentation – "A verdade por trás dos algoritmos"**  
Instrutor: **Lenon Yuri**  
Fonte: Mundo SENAI (2024)

O conteúdo aborda conceitos como:
- Algoritmos determinísticos e adaptativos.
- Sistemas de recomendação (content-based vs collaborative).
- Bolhas informacionais, câmaras de eco e FOMO.
- Riscos de fake news, vieses e manipulação algorítmica.

## 👨‍🏫 Indicação de uso em sala

Este simulador é indicado para:

- Aulas de **programação web (HTML/CSS/JS)**.
- Demonstrações práticas de **algoritmos e inteligência artificial**.
- Discussões sobre **ética digital e privacidade**.
- Atividades de conscientização sobre **comportamento online**.

## 📌 Licença

Uso exclusivamente educacional no contexto da **Formação Profissional SENAI**.  
Proibida a utilização comercial sem autorização do autor.

---

**Instrutor responsável**: [Lenon Yuri]  
**Curso Técnico em Informática para Internet – Mundo SENAI**  
```
