// Validação de email
const validateEmail = (email) => {
    // Regex básico para validar formato do email
    const simpleRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Lista de erros comuns em domínios
    const commonErrors = ['gmil', 'educao', 'hotmai', 'outlok'];
    
    if (!simpleRegex.test(email)) {
        return {
            isValid: false,
            error: 'Formato de email inválido'
        };
    }
    
    const [, domain] = email.split('@');
    const hasCommonError = commonErrors.some(error => domain.includes(error));
    
    if (hasCommonError) {
        return {
            isValid: false,
            error: 'Domínio de email inválido ou com erro de digitação'
        };
    }
    
    return {
        isValid: true
    };
};

// Validação de senha forte
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`A senha deve ter no mínimo ${minLength} caracteres`);
    }
    if (!hasUpperCase) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    if (!hasLowerCase) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    if (!hasNumbers) {
        errors.push('A senha deve conter pelo menos um número');
    }
    if (!hasSpecialChar) {
        errors.push('A senha deve conter pelo menos um caractere especial');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validação de matrícula
const validateMatricula = (matricula) => {
    // Formato: AAXXXXXXX (AA = ano, XXXXXXX = 7 dígitos)
    const regex = /^[0-9]{9}$/;
    
    if (!regex.test(matricula)) {
        return {
            isValid: false,
            error: 'Matrícula deve conter 9 dígitos numéricos'
        };
    }
    
    const anoMatricula = parseInt(matricula.substring(0, 2));
    const anoAtual = new Date().getFullYear() % 100;
    
    if (anoMatricula < 0 || anoMatricula > anoAtual) {
        return {
            isValid: false,
            error: 'Ano da matrícula inválido'
        };
    }
    
    return {
        isValid: true
    };
};

// Validação de ISBN
const validateISBN = (isbn) => {
    // Remove hifens e espaços
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    
    // Verifica se é ISBN-10 ou ISBN-13
    if (cleanIsbn.length !== 10 && cleanIsbn.length !== 13) {
        return {
            isValid: false,
            error: 'ISBN deve ter 10 ou 13 dígitos'
        };
    }
    
    // Validação de ISBN-10
    if (cleanIsbn.length === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += (10 - i) * parseInt(cleanIsbn[i]);
        }
        const lastChar = cleanIsbn[9].toUpperCase();
        const checksum = (lastChar === 'X') ? 10 : parseInt(lastChar);
        sum += checksum;
        
        if (sum % 11 !== 0) {
            return {
                isValid: false,
                error: 'ISBN-10 inválido'
            };
        }
    }
    
    // Validação de ISBN-13
    if (cleanIsbn.length === 13) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += (i % 2 === 0 ? 1 : 3) * parseInt(cleanIsbn[i]);
        }
        const checksum = (10 - (sum % 10)) % 10;
        
        if (parseInt(cleanIsbn[12]) !== checksum) {
            return {
                isValid: false,
                error: 'ISBN-13 inválido'
            };
        }
    }
    
    return {
        isValid: true
    };
};

// Sanitização de inputs
const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return input;
    }
    
    // Remove caracteres HTML
    let sanitized = input.replace(/[<>]/g, '');
    
    // Remove scripts
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove múltiplos espaços
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    // Remove espaços no início e fim
    sanitized = sanitized.trim();
    
    return sanitized;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateMatricula,
    validateISBN,
    sanitizeInput
};