// Preguntas del test (15 preguntas variadas)
const questions = [
    {
        question: "¿Cuál es el siguiente número en la secuencia: 2, 4, 8, 16, ___?",
        options: ["24", "32", "64", "20"],
        answer: 1, // 32
        category: "Matemáticas"
    },
    {
        question: "Si todos los Bloops son Rojos y todos los Rojos son Jinks, ¿entonces todos los Bloops son definitivamente Jinks?",
        options: ["Verdadero", "Falso"],
        answer: 0, // Verdadero
        category: "Lógica"
    },
    {
        question: "¿Qué figura completa el patrón? (▢ △ ◯ ▢ △ ◯ ▢ ___ )",
        options: ["△", "◯", "▢", "◇"],
        answer: 0, // △
        category: "Patrones"
    },
    // Añade más preguntas aquí...
    // Ejemplo de pregunta visual (usar emojis o imágenes):
    {
        question: "¿Cuál es la figura que no pertenece al grupo? (🟦 🟥 🟩 🟨 🟦 🟥 🟩)",
        options: ["🟦", "🟥", "🟩", "🟨"],
        answer: 3, // 🟨
        category: "Patrones visuales"
    }
];

// Variables globales
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft = 30;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const progressElement = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');
const timerElement = document.getElementById('timer');
const iqScoreElement = document.getElementById('iq-score');
const iqCategoryElement = document.getElementById('iq-category');
const iqDescriptionElement = document.getElementById('iq-description');
const iqChartElement = document.getElementById('iq-chart');

// Iniciar test
startBtn.addEventListener('click', startTest);
nextBtn.addEventListener('click', nextQuestion);
retryBtn.addEventListener('click', retryTest);

// Función para iniciar el test
function startTest() {
    startScreen.classList.remove('active');
    testScreen.classList.add('active');
    showQuestion();
    startTimer();
}

// Mostrar pregunta actual
function showQuestion() {
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    optionsElement.innerHTML = '';

    // Actualizar barra de progreso
    progressElement.textContent = `Pregunta ${currentQuestion + 1}/${questions.length}`;
    progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    // Crear opciones de respuesta
    question.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsElement.appendChild(button);
    });
}

// Seleccionar respuesta
function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    nextBtn.disabled = false;

    // Guardar respuesta del usuario
    userAnswers[currentQuestion] = index;
}

// Siguiente pregunta
function nextQuestion() {
    // Validar respuesta
    const correctAnswer = questions[currentQuestion].answer;
    const userAnswer = userAnswers[currentQuestion];

    if (userAnswer === correctAnswer) {
        score++;
        document.querySelectorAll('.option')[userAnswer].classList.add('correct');
    } else {
        document.querySelectorAll('.option')[userAnswer].classList.add('incorrect');
        document.querySelectorAll('.option')[correctAnswer].classList.add('correct');
    }

    // Deshabilitar botones
    nextBtn.disabled = true;
    clearInterval(timer);

    // Esperar 1.5 segundos antes de continuar
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            timeLeft = 30;
            timerElement.textContent = timeLeft;
            showQuestion();
            startTimer();
        } else {
            showResult();
        }
    }, 1500);
}

// Temporizador
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// Mostrar resultados
function showResult() {
    testScreen.classList.remove('active');
    resultScreen.classList.add('active');

    // Calcular IQ (fórmula simplificada)
    const iq = Math.round(100 + (score / questions.length) * 40);
    iqScoreElement.textContent = iq;

    // Categoría de IQ
    let category, description;
    if (iq >= 130) {
        category = "Superdotado";
        description = "Tu puntuación está en el top 2% de la población.";
    } else if (iq >= 120) {
        category = "Superior";
        description = "Tu IQ es superior al promedio (top 10%).";
    } else if (iq >= 90) {
        category = "Promedio";
        description = "Tu IQ está dentro del rango promedio.";
    } else {
        category = "Bajo promedio";
        description = "Considera practicar más ejercicios de lógica.";
    }

    iqCategoryElement.textContent = category;
    iqDescriptionElement.textContent = description;

    // Gráfico de distribución de IQ
    renderIQChart(iq);
}

// Gráfico de IQ
function renderIQChart(userIQ) {
    const ctx = iqChartElement.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["55", "70", "85", "100", "115", "130", "145"],
            datasets: [{
                label: 'Distribución de IQ en la población',
                data: [2, 14, 34, 34, 14, 2, 0.1],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Tu puntuación',
                data: Array(7).fill(null).map((_, i) => i === Math.floor((userIQ - 55) / 15) ? 10 : null),
                pointBackgroundColor: '#10b981',
                pointRadius: 8,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: '% de población' } },
                x: { title: { display: true, text: 'Rango de IQ' } }
            }
        }
    });
}

// Reiniciar test
function retryTest() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    iqChartElement.innerHTML = ''; // Limpiar gráfico anterior
}