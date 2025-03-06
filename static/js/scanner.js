document.addEventListener("DOMContentLoaded", () => {
    const scanButton = document.getElementById("scan-btn");
    const scannerContainer = document.getElementById("scanner-container");
    let scannerInitialized = false; // Controle do estado do scanner

    // Função para determinar o campo de entrada correto
    const getTargetInput = () => {
        // Para a página 'consulta'
        const pesquisaInput = document.getElementById("pesquisa");
        if (pesquisaInput) {
            return pesquisaInput;
        }
        // Para a página 'cadastro'
        const inputISBN = document.getElementById("isbn");
        if (inputISBN) {
            return inputISBN;
        }
        return null;
    };

    const stopScanner = () => {
        if (scannerInitialized) {
            Quagga.stop();
            scannerInitialized = false;
            console.log("Scanner desligado.");
        }
        scannerContainer.style.display = "none"; // Esconde o contêiner da câmera
    };

    if (scanButton) {
        scanButton.addEventListener("click", () => {
            scannerContainer.style.display = "block";
            if (!scannerInitialized) {
                Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: document.querySelector('#scanner-container'), // Conectado ao contêiner com dimensões ajustadas
                    },
                    decoder: {
                        readers: ["ean_reader"], // Tipo de código de barras
                    }
                }, function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    Quagga.start();
                    scannerInitialized = true;
                    console.log("Scanner iniciado.");
                });

                Quagga.onDetected((data) => {
                    const code = data.codeResult.code;
                    console.log(`Código escaneado: ${code}`);
                    const targetInput = getTargetInput();
                    if (targetInput) {
                        targetInput.value = code;
                    }
                    stopScanner();
                });
            }
        });
    }

    // Garanta que o scanner seja desligado ao sair da página
    window.addEventListener("beforeunload", stopScanner);
});
