const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Erro de validação do Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Erro único do Sequelize (por exemplo, violação de chave única)
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: 'Erro de unicidade',
            details: err.errors.map(e => ({
                field: e.path,
                message: 'Este valor já está em uso'
            }))
        });
    }

    // Erro de chave estrangeira do Sequelize
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: 'Erro de referência',
            message: 'O registro referenciado não existe'
        });
    }

    // Erro de validação do express-validator
    if (Array.isArray(err)) {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }

    // Erro genérico
    return res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Um erro inesperado ocorreu'
    });
};

module.exports = errorHandler;