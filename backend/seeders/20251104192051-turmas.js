'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Turmas', [
      // Turmas de ADM
      {
        id: 1,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'ADMMAT1SA',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 2,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'ADMMAT1SB',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 3,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'ADMVES1SA',
        turno: 'vespertino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 4,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'ADMMAT2SA',
        turno: 'matutino',
        serie: '2ª serie',
        ano: 2025
      },
      {
        id: 5,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'ADMVES2SA',
        turno: 'vespertino',
        serie: '2ª serie',
        ano: 2025
      },
      {
        id: 6,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'ADMVES2SB',
        turno: 'vespertino',
        serie: '2ª serie',
        ano: 2025
      },
      {
        id: 7,       
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 3ª SERIE',
        codigo: 'ADMMATADMA',
        turno: 'matutino',
        serie: '3ª serie',
        ano: 2025
      },
      {       
        id: 8,
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - ENSINO MÉDIO INTEGRADO - 3ª SERIE',
        codigo: 'ADMVESADMA',
        turno: 'vespertino',
        serie: '3ª serie',
        ano: 2025
      },
      {
        id: 9,       
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - SUBSEQUENTE - MÓDULO 1',
        codigo: 'ADMNOTM1A2',
        turno: 'noturno',
        serie: 'Módulo 1',
        ano: 2025 
      },
      {
        id: 10,       
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - SUBSEQUENTE - MÓDULO 2',
        codigo: 'ADMNOTM2A2',
        turno: 'noturno',
        serie: 'Módulo 2',
        ano: 2025 
      },
      {
        id: 11,       
        nome: 'TÉCNICO EM ADMINISTRAÇÃO - SUBSEQUENTE - MÓDULO 3',
        codigo: 'ADMNOTM3A2',
        turno: 'noturno',
        serie: 'Módulo 3',
        ano: 2025 
      },
      // Turmas de Biotecnologia
      {
        id: 12,
        nome: 'TÉCNICO EM BIOTECNOLOGIA - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'BIOVES1SA',
        turno: 'vespertino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 13,
        nome: 'TÉCNICO EM BIOTECNOLOGIA - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'BIOVES2SA',
        turno: 'vespertino',
        serie: '2ª serie',
        ano: 2025
      },
      {
        id: 14,       
        nome: 'TÉCNICO EM BIOTECNOLOGIA - SUBSEQUENTE - MÓDULO 3',
        codigo: 'BIONOTM3A2',
        turno: 'noturno',
        serie: 'Módulo 3',
        ano: 2025
      },
      {
        id: 15,       
        nome: 'TÉCNICO EM BIOTECNOLOGIA - SUBSEQUENTE - MÓDULO 4',
        codigo: 'BIONOTM4A2',
        turno: 'noturno',
        serie: 'Módulo 4',
        ano: 2025
      },
      // Turmas de Informática
      {
        id: 16,
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'INFMAT1SA',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 17,
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'INFMAT1SB',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 18,
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'INFMAT2SA',
        turno: 'matutino',
        serie: '2ª serie',
        ano: 2025
      },
      {
        id: 19,
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'INFVES1SA',
        turno: 'vespertino',
        serie: '1ª serie',
        ano: 2025
      },
      {
        id: 20,
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'INFMAT2SA',
        turno: 'matutino',
        serie: '2ª serie',
        ano: 2025
      },
      {
        id: 21,       
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'INFVES2SA',
        turno: 'vespertino',
        serie: '2ª serie',
        ano: 2025 
      },
      {
        id: 22,       
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 3ª SERIE',
        codigo: 'INTMAT3SA',
        turno: 'matutino',
        serie: '3ª serie',
        ano: 2025 
      },
      {
        id: 23,       
        nome: 'TÉCNICO EM INFORMÁTICA - ENSINO MÉDIO INTEGRADO - 3ª SERIE',
        codigo: 'INFVES3SA',
        turno: 'vespertino',
        serie: '3ª serie',
        ano: 2025 
      },
      {
        id: 24,       
        nome: 'TÉCNICO EM INFORMÁTICA - SUBSEQUENTE - MÓDULO 2',
        codigo: 'INFNOTM2A',
        turno: 'noturno',
        serie: 'Módulo 2',
        ano: 2025 
      },
      {
        id: 25,       
        nome: 'TÉCNICO EM INFORMÁTICA - SUBSEQUENTE - MÓDULO 3',
        codigo: 'INFNOTM3A',
        turno: 'noturno',
        serie: 'Módulo 3',
        ano: 2025 
      },
      {
        id: 26,       
        nome: 'TÉCNICO EM INFORMÁTICA - SUBSEQUENTE - MÓDULO 4',
        codigo: 'INFNOTM4A',
        turno: 'noturno',
        serie: 'Módulo 4',
        ano: 2025 
      },
      // Turma de Enfermagem
      {
        id: 27,      
        nome: 'TÉCNICO EM ENFERMAGEM - SUBSEQUENTE - MÓDULO 3',
        codigo: 'ENFeNOTM3A2',
        turno: 'noturno',
        serie: 'Módulo 3',
        ano: 2025 
      },
      // Turmas de Análises Clínicas
      {
        id: 28,      
        nome: 'TÉCNICO EM ANÁLISES CLÍNICAS - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'ANACVESS1SA',
        turno: 'vespertino',
        serie: '1ª serie',
        ano: 2025 
      },
      {
        id: 29,      
        nome: 'TÉCNICO EM ANÁLISES CLÍNICAS - ENSINO MÉDIO INTEGRADO - 3ª SERIE',
        codigo: 'ANACVES3SA',
        turno: 'vespertino',
        serie: '3ª serie',
        ano: 2025 
      },
      // Turmas de Química
      {
        id: 30,      
        nome: 'TÉCNICO EM QUÍMICA - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'QUIMMAT1SA',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2025 
      },
      {
        id: 31,      
        nome: 'TÉCNICO EM QUÍMICA - ENSINO MÉDIO INTEGRADO - 1ª SERIE',
        codigo: 'QUIMMAT1SB',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2025 
      },
      {
        id: 32,      
        nome: 'TÉCNICO EM QUÍMICA - ENSINO MÉDIO INTEGRADO - 2ª SERIE',
        codigo: 'QUIMMAT2SA',
        turno: 'matutino',
        serie: '2ª serie',
        ano: 2025 
      },
      {
        id: 33,      
        nome: 'TÉCNICO EM QUÍMICA - ENSINO MÉDIO INTEGRADO - 3ª SERIE',
        codigo: 'QUIMMAT3SA',
        turno: 'matutino',
        serie: '3ª serie',
        ano: 2025 
      },
      {
        id: 34,      
        nome: 'TÉCNICO EM QUÍMICA - SUBSEQUENTE - MÓDULO 2',
        codigo: 'QUIMNOTM2A2',
        turno: 'noturno',
        serie: 'Módulo 2',
        ano: 2025 
      },
      {
        id: 35,      
        nome: 'TÉCNICO EM QUÍMICA - SUBSEQUENTE - MÓDULO 3',
        codigo: 'QUIMNOTM3A2',
        turno: 'noturno',
        serie: 'Módulo 3',
        ano: 2025 
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Turmas', null, {});
  }
};
