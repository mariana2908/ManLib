'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estudantes', [
      // Turmas de Administração
      // ADMMAT1SA - 35 estudantes
      {
        nome: 'ALEXANDRE RANGEL DOS SANTOS',
        matricula: '202530734266',
        turma_id: 1,      
      },
      {
        nome: 'ANA CAROLINA SILVA BOZER',
        matricula: '202530520644',
        turma_id: 1,
      },
      {
        nome: 'ANA LETICIA DE OLIVEIRA TEIXEIRA',
        matricula: '202530619531',
        turma_id: 1,
      },
      {
        nome: 'ANA LIVIA SOUZA SILVA',
        matricula: '202531234657',
        turma_id: 1,
      },
      {
        nome: 'ANNA CLARA MEDINA LOBO',
        matricula: '202530265597',
        turma_id: 1,
      },
      {
        nome: 'ANNA CLARA MOREIRA MACHADO',
        matricula: '202530375730',
        turma_id: 1,
      },
      {
        nome: 'ANNE KAROLLYNE MOREIRA RIBEIRO',
        matricula: '202530298328',
        turma_id: 1,
      },
      {
        nome: 'CELYNNE JULIA NERES BACELAR',
        matricula: '202531216069',
        turma_id: 1,
      },
      {
        nome: 'DAVI COSTA DOS SANTOS',
        matricula: '202531219884',
        turma_id: 1,
      },
      {
        nome: 'ELVIO BOREL VIEIRA',
        matricula: '202530411775',
        turma_id: 1,
      },
      {
        nome: 'ERICK TORRES DAS NEVES',
        matricula: '202530447689',
        turma_id: 1,
      },
      {
        nome: 'FABIANE SILVA GAMA',
        matricula: '202530294712',
        turma_id: 1,
      },
      {
        nome: 'GABRIEL VIANA MARQUES',
        matricula: '202530208133',
        turma_id: 1,
      },
      {
        nome: 'GEOVANA OLIVEIRA VILAS BOAS',
        matricula: '202530339663',
        turma_id: 1,
      },
      {
        nome: 'GESIEL RIBEIRO ARAUJO',
        matricula: '202530344799',
        turma_id: 1,
      },
      {
        nome: 'HEBERT MENDES OLIVEIRA',
        matricula: '202530749080',
        turma_id: 1,
      },
      {
        nome: 'IARLEY ROMA SANTOS',
        matricula: '202530335673',
        turma_id: 1,
      },
      {
        nome: 'IEMILLY DA SILVA MIRANDA',
        matricula: '202531283876',
        turma_id: 1,
      },
      {
        nome: 'JESSICA COSTA LUZ',
        matricula: '202530471174',
        turma_id: 1,
      },
      {
        nome: 'JOYCI FEITOSA PARDINHO',
        matricula: '202530370369',
        turma_id: 1,
      },
      {
        nome: 'KAROLINE FERREIRA LIMA',
        matricula: '202530806580',
        turma_id: 1,
      },
      {
        nome: 'LETICIA DA SILVA FALCAO',
        matricula: '202530438400',
        turma_id: 1,
      },
      {
        nome: 'LIS FATIMA SAID MARTINS',
        matricula: '202530347496',
        turma_id: 1,
      },
      {
        nome: 'LUAN PIETRO FELIX NEVES',
        matricula: '202530415694',
        turma_id: 1,
      },
      {
        nome: 'LUIZ HENRIQUE MEDEIROS DE OLIVEIRA',
        matricula: '202530031023',
        turma_id: 1,
      },
      {
        nome: 'MARIA EDUARDA ASSIS NUNES',
        matricula: '202531455890',
        turma_id: 1,
      },
      {
        nome: 'MARIA EDUARDA MAIA MOTA',
        matricula: '202531354575',
        turma_id: 1,
      },
      {
        nome: 'MARIA JULIA VELGA FERRAZ',
        matricula: '202530456481',
        turma_id: 1,
      },
      {
        nome: 'MARYA EDUARDA SALES SILVA',
        matricula: '202531006384',
        turma_id: 1,
      },
      {
        nome: 'MURYLO DE OLIVEIRA ALMEIDA',
        matricula: '202530798782',
        turma_id: 1,
      },
      {
        nome: 'NICOLLY DE JESUS CABRAL',
        matricula: '202530832759',
        turma_id: 1,
      },
      {
        nome: 'SOFIA DA SILVA FERREIRA',
        matricula: '202531727921',
        turma_id: 1,
      },
      {
        nome: 'WALYSON SANTOS DIAS',
        matricula: '202530306751',
        turma_id: 1,
      },
      {
        nome: 'YASMIN DA SILVA FERRAZ',
        matricula: '202530810591',
        turma_id: 1,
      },
      {
        nome: 'YASMIN GOMES ESTEVES',
        matricula: '202530639015',
        turma_id: 1,
      },

      // ADMMAT1SB - 40 estudantes
      {
        nome: 'ALLYCE DE JESUS SANTOS RODRIGUES',
        matricula: '202530174975',
        turma_id: 2,
      },
      {
        nome: 'ANA CAROLINA REZENDE ALMEIDA',
        matricula: '202530477561',
        turma_id: 2,
      },
      {
        nome: 'ANA GLORIA PEDRAL DE JESUS',
        matricula: '202530326932',
        turma_id: 2,
      },
      {
        nome: 'ANA VITORIA LAURENTINO MONTEIRO',
        matricula: '202530812999',
        turma_id: 2,
      },
      {
        nome: 'ARTHUR FERREIRA DA SILVA',
        matricula: '202530821174',
        turma_id: 2,
      },
      {
        nome: 'BEATRIZ VASCONCELOS ARAUJO',
        matricula: '202531189220',
        turma_id: 2,
      },
      {
        nome: 'BRENNO VIANA DE FRANCA',
        matricula: '202530393381',
        turma_id: 2,
      },
      {
        nome: 'CAMILLY ALVES SANTOS',
        matricula: '202530689788',
        turma_id: 2,
      },
      {
        nome: 'DAVI RODRIGUES QUARESMA PRATES',
        matricula: '202530832697',
        turma_id: 2,
      },
      {
        nome: 'EDUARDO MENANI ANDRADE',
        matricula: '202530667486',
        turma_id: 2,
      },
      {
        nome: 'ELISA OLIVEIRA ALMEIDA',
        matricula: '202530388167',
        turma_id: 2,
      },
      {
        nome: 'EMANUELLE SANTANA DE SOUZA',
        matricula: '202530280539',
        turma_id: 2,
      },
      {
        nome: 'EVILYN DA SILVA BARRETO',
        matricula: '202530302304',
        turma_id: 2,
      },
      {
        nome: 'FLAVIA LAVINY DOS SANTOS RUAS',
        matricula: '202530444785',
        turma_id: 2,
      },
      {
        nome: 'GEOVANIA DOS SANTOS CRUZ',
        matricula: '202530323289',
        turma_id: 2,
      },
      {
        nome: 'HELOISA ALVES RODRIGUES',
        matricula: '202530313916',
        turma_id: 2,
      },
      {
        nome: 'HELOYZA ARAUJO BRITO',
        matricula: '202530817725',
        turma_id: 2,
      },
      {
        nome: 'HENRIQUE GABRIEL GONCALVES XAVIER',
        matricula: '202531057730',
        turma_id: 2,
      },
      {
        nome: 'ISABELA RODRIGUES ALCANTARA',
        matricula: '202530777675',
        turma_id: 2,
      },
      {
        nome: 'ISABELA SOFIA SILVA CASTRO',
        matricula: '202530603980',
        turma_id: 2,
      },
      {
        nome: 'ISABELY SOUZA AVELAR',
        matricula: '202530355415',
        turma_id: 2,
      },
      {
        nome: 'ISAQUE LACERDA DE OLIVEIRA',
        matricula: '202530821227',
        turma_id: 2,
      },
      {
        nome: 'IZABELA SANTOS DE JESUS',
        matricula: '202232455609',
        turma_id: 2,
      },
      {
        nome: 'JESSICA SOUZA RIBEIRO',
        matricula: '202530155989',
        turma_id: 2,
      },
      {
        nome: 'LAILA DA SILVA MATOS',
        matricula: '202530921652',
        turma_id: 2,
      },
      {
        nome: 'LAURA LEUCK DE OLIVEIRA',
        matricula: '202530376264',
        turma_id: 2,
      },
      {
        nome: 'LIVIA GALDINO DE ALMEIDA',
        matricula: '202530390030',
        turma_id: 2,
      },
      {
        nome: 'LUAN DOS REIS GUIMARAES',
        matricula: '202530802212',
        turma_id: 2,
      },
      {
        nome: 'MARIA RAPHAELA FERNANDES DE OLIVEIRA',
        matricula: '202530479539',
        turma_id: 2,
      },
      {
        nome: 'MARIA RITA FERREIRA CABRAL',
        matricula: '202530581265',
        turma_id: 2,
      },
      {
        nome: 'MATHEUS RODRIGUES SOARES',
        matricula: '202531355367',
        turma_id: 2,
      },
      {
        nome: 'MAYSA ELEN INACIA GONCALVES',
        matricula: '202531171412',
        turma_id: 2,
      },
      {
        nome: 'MICAELE DA COSTA NOVAES',
        matricula: '202530804253',
        turma_id: 2,
      },
      {
        nome: 'NICOLAS FERRAZ CARVALHO',
        matricula: '202531370800',
        turma_id: 2,
      },
      {
        nome: 'RAICA EDUARDA SANTOS MACIEL',
        matricula: '202531291789',
        turma_id: 2,
      },
      {
        nome: 'RAISSA DAMACENA CRUZ',
        matricula: '202530054180',
        turma_id: 2,
      },
      {
        nome: 'REBECA FELIX DOS SANTOS',
        matricula: '202531583362',
        turma_id: 2,
      },
      {
        nome: 'ROMULO JOSE MONTEIRO FERNANDES BARROS',
        matricula: '202530397836',
        turma_id: 2,
      },
      {
        nome: 'TAMIRES MAIA HENRIQUETA AMANCIO',
        matricula: '202530456015',
        turma_id: 2,
      },
      {
        nome: 'YSABELA KELEN SILVA TEIXEIRA',
        matricula: '202530457362',
        turma_id: 2,
      },

      // ADMVES1SA - 39 estudantes
      {
        nome: 'ANA LIVIA MATOS PEREIRA',
        matricula: '202530417877',
        turma_id: 3,
      },
      {
        nome: 'ANA VITORIA RODRIGUES NASCIMENTO',
        matricula: '202530411819',
        turma_id: 3,
      },
      {
        nome: 'BRUNO VIEIRA SOUZA',
        matricula: '202530269451',
        turma_id: 3,
      },
      {
        nome: 'BRUNO VITAL RIBEIRO FERREIRA',
        matricula: '202530203790',
        turma_id: 3,
      },
      {
        nome: 'CRISTIANE COSTA EVANGELISTA',
        matricula: '202531249551',
        turma_id: 3,
      },
      {
        nome: 'DAVI DOS SANTOS CARDOSO DE SENA',
        matricula: '202531336998',
        turma_id: 3,
      },
      {
        nome: 'DAVID LUCAS DE SOUZA PEREIRA',
        matricula: '202530418300',
        turma_id: 3,
      },
      {
        nome: 'DOMINIKI DE SOUZA CONCEICAO',
        matricula: '202530252712',
        turma_id: 3,
      },
      {
        nome: 'GABRIEL PEREIRA DE MORAES',
        matricula: '202530225250',
        turma_id: 3,
      },
      {
        nome: 'ISADORA OLIVEIRA BATISTA',
        matricula: '202531129114',
        turma_id: 3,
      },
      {
        nome: 'JASMINE VITORIA PEREIRA MARTINS',
        matricula: '202530388452',
        turma_id: 3,
      },
      {
        nome: 'KEZIA SANTOS DE SOUZA',
        matricula: '202530801494',
        turma_id: 3,
      },
      {
        nome: 'LARA CRISTINA ARAUJO SANTOS',
        matricula: '202530702155',
        turma_id: 3,
      },
      {
        nome: 'LAZARO GOMES SANTOS',
        matricula: '202530627210',
        turma_id: 3,
      },
      {
        nome: 'LEANDRO HENRIQUE SILVA COSTA',
        matricula: '202530434359',
        turma_id: 3,
      },
      {
        nome: 'LENON LOPES TEIXEIRA MOURA',
        matricula: '10817434',
        turma_id: 3,
      },
      {
        nome: 'MAIARA DA SILVA VIANA',
        matricula: '202530212350',
        turma_id: 3,
      },
      {
        nome: 'MAISA SOARES TEIXEIRA',
        matricula: '202530465239',
        turma_id: 3,
      },
      {
        nome: 'MARIA EDUARDA DIAS SENA',
        matricula: '202530839357',
        turma_id: 3,
      },
      {
        nome: 'NICOLY RODRIGUES DE JESUS',
        matricula: '202530733151',
        turma_id: 3,
      },
      {
        nome: 'PABLO DA RESSURREICAO SILVA',
        matricula: '202530398548',
        turma_id: 3,
      },
      {
        nome: 'PAMELA SOUZA MIRANDA',
        matricula: '202232453696',
        turma_id: 3,
      },
      {
        nome: 'PEDRO HENRIQUE RODRIGUES LEAL',
        matricula: '202530311260',
        turma_id: 3,
      },
      {
        nome: 'PIETRO ROCHA OLIVEIRA',
        matricula: '202530812344',
        turma_id: 3,
      },
      {
        nome: 'RAPHAEL DE OLIVEIRA FERREIRA',
        matricula: '202530957468',
        turma_id: 3,
      },
      {
        nome: 'REBEKAH LUIZA DOS SANTOS BOMFIM',
        matricula: '202530335501',
        turma_id: 3,
      },
      {
        nome: 'RIQUELME AUGUSTO BOMFIM DOS SANTOS',
        matricula: '202530183277',
        turma_id: 3,
      },
      {
        nome: 'RODRIGO CARVALHO SILVA',
        matricula: '202530409893',
        turma_id: 3,
      },
      {
        nome: 'SABRINA GOMES ROCKSTROK',
        matricula: '202530343236',
        turma_id: 3,
      },
      {
        nome: 'SAMUEL CUSTODIO MOREIRA',
        matricula: '202530427102',
        turma_id: 3,
      },
      {
        nome: 'SOFIA DE SOUZA SOARES',
        matricula: '202530331370',
        turma_id: 3,
      },
      {
        nome: 'STEFHANY PRATES AMARAL',
        matricula: '202530340000',
        turma_id: 3,
      },
      {
        nome: 'TAUANE DA SILVA FERREIRA',
        matricula: '202530407502',
        turma_id: 3,
      },
      {
        nome: 'THAMARA SANTOS DA SILVA',
        matricula: '202530046643',
        turma_id: 3,
      },
      {
        nome: 'THAMIRES SANTOS DA SILVA',
        matricula: '202530053610',
        turma_id: 3,
      },
      {
        nome: 'VICTORIA FEITOSA PARDINHO',
        matricula: '202530366150',
        turma_id: 3,
      },
      {
        nome: 'YASMIM SOUZA SILVA',
        matricula: '202530467752',
        turma_id: 3,
      },
      {
        nome: 'YORRANA ALMEIDA VIANA',
        matricula: '202530643125',
        turma_id: 3,
      },
      {
        nome: 'YRVING ALDRED ANDRADE OLIVEIRA',
        matricula: '202530150427',
        turma_id: 3,
      },

      // ADMMAT2SA - 40 estudantes
      {
        nome: 'ANA VITORIA SANTOS CAMPANHAO',
        matricula: '202430598896',
        turma_id: 4,
      },
      {
        nome: 'ARTHUR GOMES DE OLIVEIRA',
        matricula: '202430607126',
        turma_id: 4,
      },
      {
        nome: 'CLARICE MOREIRA SOUZA',
        matricula: '202430597137',
        turma_id: 4,
      },
      {
        nome: 'DANIEL LUCAS PEREIRA RIBEIRO',
        matricula: '202430912490',
        turma_id: 4,
      },
      {
        nome: 'EDUARDA VICTORIA LIMA SANTANA',
        matricula: '202430103460',
        turma_id: 4,
      },
      {
        nome: 'ESTEFANY BONJARDIM LIMA',
        matricula: '202430103139',
        turma_id: 4,
      },
      {
        nome: 'FABIOLA DA CONCEICAO SOUZA',
        matricula: '202430608123',
        turma_id: 4,
      },
      {
        nome: 'GABRIEL REIS SOARES',
        matricula: '202431408216',
        turma_id: 4,
      },
      {
        nome: 'GEOVANA DA SILVA POLY',
        matricula: '202430871057',
        turma_id: 4,
      },
      {
        nome: 'GEOVANA ROCHA PEDROSO',
        matricula: '202430868196',
        turma_id: 4,
      },
      {
        nome: 'GUSTAVO SANTOS CARVALHO',
        matricula: '202430598214',
        turma_id: 4,
      },
      {
        nome: 'HELOIZA PARAISO RAMIRES DE SOUZA',
        matricula: '202431310442',
        turma_id: 4,
      },
      {
        nome: 'HENRIQUE VIANA SANTOS',
        matricula: '202430908569',
        turma_id: 4,
      },
      {
        nome: 'IEZA GABRIELLY DE SOUZA PASSOS SILVA',
        matricula: '202430604026',
        turma_id: 4,
      },
      {
        nome: 'INACIO PEREIRA DE BRITO NETO',
        matricula: '202430609560',
        turma_id: 4,
      },
      {
        nome: 'JAMILY OLIVEIRA SOUZA',
        matricula: '202430911644',
        turma_id: 4,
      },
      {
        nome: 'JULIA OLIVEIRA SOUZA ',
        matricula: '202432144838',
        turma_id: 4,
      },
      {
        nome: 'KAWANY MEIRA MOREIRA',
        matricula: '202430970340',
        turma_id: 4,
      },
      {
        nome: 'KEZIA FERREIRA DE SOUZA',
        matricula: '202431151177',
        turma_id: 4,
      },
      {
        nome: 'LAIS MARQUES ROCHA',
        matricula: '202430592121',
        turma_id: 4,
      },
      {
        nome: 'LUIS FELIPE ARAUJO SANTOS',
        matricula: '202431154535',
        turma_id: 4,
      },
      {
        nome: 'MADSON THEODORO SANTOS',
        matricula: '202431157297',
        turma_id: 4,
      },
      {
        nome: 'MARIA EDUARDA BORGES WAN DER MAAS',
        matricula: '202431323128',
        turma_id: 4,
      },
      {
        nome: 'MARIA LUISA SILVA MARQUES',
        matricula: '202430008461',
        turma_id: 4,
      },
      {
        nome: 'MARIA LUIZA QUEIROZ SILVA',
        matricula: '202430870167',
        turma_id: 4,
      },
      {
        nome: 'MAURICIO JULIO MACRINO DE OLIVEIRA',
        matricula: '202430619593',
        turma_id: 4,
      },
      {
        nome: 'PABLO HENRIQUE COSTA NASCIMENTO',
        matricula: '202430600303',
        turma_id: 4,
      },
      {
        nome: 'PEDRO JONAS OLIVEIRA DE JESUS',
        matricula: '202430872546',
        turma_id: 4,
      },
      {
        nome: 'RAYANNE MARQUES DOS SANTOS',
        matricula: '202430590771',
        turma_id: 4,
      },
      {
        nome: 'REBECA DOS SANTOS RIBEIRO',
        matricula: '202430868875',
        turma_id: 4,
      },
      {
        nome: 'REBECA PARRA PEREIRA',
        matricula: '202430605490',
        turma_id: 4,
      },
      {
        nome: 'RENAN BALDO DA SILVA',
        matricula: '202430867340',
        turma_id: 4,
      },
      {
        nome: 'SAIMEN CONCEICAO OTAVIO DOS SANTOS',
        matricula: '202430602433',
        turma_id: 4,
      },
      {
        nome: 'SAMUEL DA SILVA GONCALVES',
        matricula: '202431786970',
        turma_id: 4,
      },
      {
        nome: 'SAMUEL LAURENTINO MONTEIRO',
        matricula: '202430601042',
        turma_id: 4,
      },
      {
        nome: 'SARAH KELLY DE SANTANA OLIVEIRA',
        matricula: '202431293646',
        turma_id: 4,
      },
      {
        nome: 'SARAH OLIVEIRA SANTOS',
        matricula: '202431132500',
        turma_id: 4,
      },
      {
        nome: 'SOFIA PEREIRA DE AZEVEDO',
        matricula: '202430661819',
        turma_id: 4,
      },
      {
        nome: 'VICTOR SANTOS OLIVEIRA',
        matricula: '202430106097',
        turma_id: 4,
      },
      {
        nome: 'WELTON PEREIRA LOPES',
        matricula: '202431149769',
        turma_id: 4,
      },

      // ADMVES2SA - 24 estudantes
      {
        nome: 'ANIEL JHONATA DA SILVA AMARAL',
        matricula: '202430512668',
        turma_id: 5,
      },
      {
        nome: 'ANY KERLY GOMES FARIAS',
        matricula: '202430079801',
        turma_id: 5,
      },
      {
        nome: 'CAMILA GUIMARAES DIAS',
        matricula: '202430097550',
        turma_id: 5,
      },
      {
        nome: 'CARLOS DANIEL RODRIGUES DA SILVA',
        matricula: '202430100520',
        turma_id: 5,
      },
      {
        nome: 'CLARISSE DIAS DE SOUZA',
        matricula: '202430614597',
        turma_id: 5,
      },
      {
        nome: 'DANIELLY CHRISTINY COIMBRA FERREIRA',
        matricula: '202430610990',
        turma_id: 5,
      },
      {
        nome: 'DIULLIAN PEREIRA DE ARAUJO',
        matricula: '202430894866',
        turma_id: 5,
      },
      {
        nome: 'GUILHERME ENRIQUE BANDEIRA BASTOS',
        matricula: '20243080885',
        turma_id: 5,
      },
      {
        nome: 'HENRIQUE GONCALVEZ DE SOUZA',
        matricula: '202430595580',
        turma_id: 5,
      },
      {
        nome: 'IZA BARBARA OLIVEIRA DA SILVA',
        matricula: '202430612583',
        turma_id: 5,
      },
      {
        nome: 'JADNA AQUINO DOS SANTOS',
        matricula: '202430589645',
        turma_id: 5,
      },
      {
        nome: 'KAIO PEREIRA PINUS',
        matricula: '202430596470',
        turma_id: 5,
      },
      {
        nome: 'KAIQUE LIMA CRUZ',
        matricula: '202430601641',
        turma_id: 5,
      },
      {
        nome: 'KAUA PEREIRA PINUS',
        matricula: '202430595384',
        turma_id: 5,
      },
      {
        nome: 'KELVIN SOUZA SILVA',
        matricula: '202430620683',
        turma_id: 5,
      },
      {
        nome: 'LARA ROCHA PRADO',
        matricula: '202430475582',
        turma_id: 5,
      },
      {
        nome: 'MARCOS OLIVEIRA RODRIGUES',
        matricula: '202430775364',
        turma_id: 5,
      },
      {
        nome: 'MARIA FERNANDA RODRIGUES SILVA',
        matricula: '202430085344',
        turma_id: 5,
      },
      {
        nome: 'PAULO VICTOR ALMEIDA SILVA',
        matricula: '202430594449',
        turma_id: 5,
      },
      {
        nome: 'RAQUEL MANNY SOUZA RUAS',
        matricula: '202430603207',
        turma_id: 5,
      },
      {
        nome: 'RHAQUEL DE JESUS BATISTA',
        matricula: '202430772353',
        turma_id: 5,
      },
      {
        nome: 'STEFANNE FERREIRA DURVAL',
        matricula: '202430623890',
        turma_id: 5,
      },
      {
        nome: 'YASMIN VIEIRA BARRETO',
        matricula: '202430776657',
        turma_id: 5,
      },
      {
        nome: 'YESSA VITORIA SANTOS MARTINS',
        matricula: '202430644961',
        turma_id: 5,
      },

      // ADMVES2SB - 30 estudantes
      {
        nome: 'ALANY RICKELLY ROCHA SOUZA',
        matricula: '20243153841',
        turma_id: 6,
      },
      {
        nome: 'ANA CAROLINA DOS SANTOS SAMPAIO',
        matricula: '202431153055',
        turma_id: 6,
      },
      {
        nome: 'ANA GABRIELY ROCHA ALMEIDA',
        matricula: '202431310694',
        turma_id: 6,
      },
      {
        nome: 'ARTHUR PEREIRA VIANA',
        matricula: '202431149043',
        turma_id: 6,
      },
      {
        nome: 'BRUNA CRISTINO DOS SANTOS',
        matricula: '202431160505',
        turma_id: 6,
      },
      {
        nome: 'CAUA CARDOZO MOREIRA',
        matricula: '202430665658',
        turma_id: 6,
      },
      {
        nome: 'CHRISLANY DE SOUZA MENEZES',
        matricula: '202430727554',
        turma_id: 6,
      },
      {
        nome: 'ESTHER DE JESUS SILVA',
        matricula: '202431117003',
        turma_id: 6,
      },
      {
        nome: 'EVILI ALMEIDA SANTOS',
        matricula: '202430701001',
        turma_id: 6,
      },
      {
        nome: 'GABRIEL SANTOS CRUZ',
        matricula: '202432068469',
        turma_id: 6,
      },
      {
        nome: 'GABRIELLE SILVA ROCHA',
        matricula: '202431161923',
        turma_id: 6,
      },
      {
        nome: 'GEOVANA BARRETO SANTOS',
        matricula: '202430906250',
        turma_id: 6,
      },
      {
        nome: 'GUSTAVO DIMITRY PEREIRA DOS SANTOS',
        matricula: '202431410896',
        turma_id: 6,
      },
      {
        nome: 'GUSTAVO SANTOS LIMA',
        matricula: '202431152085',
        turma_id: 6,
      },
      {
        nome: 'JOAO PEDRO DE SOUZA PACHECO',
        matricula: '202431148402',
        turma_id: 6,
      },
      {
        nome: 'JULIA ALMEIDA LIMA',
        matricula: '202430737470',
        turma_id: 6,
      },
      {
        nome: 'KAIQUE GANGA GOUVEIA',
        matricula: '202431789195',
        turma_id: 6,
      },
      {
        nome: 'KAUA SILVA DE JESUS',
        matricula: '202431141232',
        turma_id: 6,
      },
      {
        nome: 'LARISSA KRYGSMAN DE OLIVEIRA',
        matricula: '202430754462',
        turma_id: 6,
      },
      {
        nome: 'LAYZA SANTOS DE MATOS',
        matricula: '202430706447',
        turma_id: 6,
      },
      {
        nome: 'LUCAS ROCHA DOS SANTOS',
        matricula: '202430900103',
        turma_id: 6,
      },
      {
        nome: 'MATEUS BRITO DOS ANJOS',
        matricula: '10676976',
        turma_id: 6,
      },
      {
        nome: 'PABLO HENRIQUE DA SILVA SOUZA',
        matricula: '202431162214',
        turma_id: 6,
      },
      {
        nome: 'PIETRA SOUZA TINOCO PINHAL',
        matricula: '202430732803',
        turma_id: 6,
      },
      {
        nome: 'RAIANE DE JESUS GOMES',
        matricula: '202432023645',
        turma_id: 6,
      },
      {
        nome: 'RIQUELME SILVA DIAS',
        matricula: '202430694462',
        turma_id: 6,
      },
      {
        nome: 'SARAH EMANUELLE PINTO COSTA',
        matricula: '202431152675',
        turma_id: 6,
      },
      {
        nome: 'SARAH LEONNY OLIVEIRA COSTA',
        matricula: '202430701997',
        turma_id: 6,
      },
      {
        nome: 'THAIS BRAZ ROCHA',
        matricula: '202431136045',
        turma_id: 6,
      },
      {
        nome: 'YASMIN VITORIA LIMA DA PURIFICACAO',
        matricula: '202430666780',
        turma_id: 6,
      },

      // ADMMATADMA - 31 estudantes
      {
        nome: 'ANA CLARA BARBOSA RIBEIRO',
        matricula: '202330157511',
        turma_id: 7,
      },
      
      {
        nome: 'ANNA LUISA BARRETO DE SOUZA',
        matricula: '202330167090',
        turma_id: 7,
      },
      {
        nome: 'ARIEL GLICERIO',
        matricula: '202331025740',
        turma_id: 7,
      },
      {
        nome: 'BERNARDO COUTO ARAGAO',
        matricula: '202331586387',
        turma_id: 7,
      },
      {
        nome: 'BRENDA SANTOS DE OLIVEIRA',
        matricula: '202330159721',
        turma_id: 7,
      },
      {
        nome: 'DANIEL LOMBARDI DOS SANTOS',
        matricula: '202330897453',
        turma_id: 7,
      },
      {
        nome: 'EDUARDA FERREIRA EVANGELISTA',
        matricula: '202330144890',
        turma_id: 7,
      },
      {
        nome: 'ELLEN SARAH OLIVEIRA SOARES',
        matricula: '202330761876',
        turma_id: 7,
      },
      {
        nome: 'EMANUELY RANGEL CAETANO',
        matricula: '202330208924',
        turma_id: 7,
      },
      {
        nome: 'EMILLY PINHEIRO MOTA',
        matricula: '202330190060',
        turma_id: 7,
      },
      {
        nome: 'ERICK DARLEY SANTOS DE JESUS',
        matricula: '202330136315',
        turma_id: 7,
      },
      {
        nome: 'EVELYN DOS SANTOS CECILIO',
        matricula: '202330156908',
        turma_id: 7,
      },
      {
        nome: 'FABIAN BRITO DOS SANTOS',
        matricula: '202330903120',
        turma_id: 7,
      },
      {
        nome: 'IANE AFONSO SANTOS',
        matricula: '202330454561',
        turma_id: 7,
      },
      {
        nome: 'ISABELLE OLIVEIRA DE ALMEIDA',
        matricula: '202330084934',
        turma_id: 7,
      },
      {
        nome: 'JOAO VITOR ANDRADE SOUZA',
        matricula: '202330898657',
        turma_id: 7,
      },
      {
        nome: 'JULIA DE SOUZA ANDRADE',
        matricula: '202330628259',
        turma_id: 7,
      },
      {
        nome: 'JULIA GABRIELY BALIEIRO DE SOUZA',
        matricula: '202330538699',
        turma_id: 7,
      },
      {
        nome: 'JULIA PRATES POMPILIO',
        matricula: '202330217333',
        turma_id: 7,
      },
      {
        nome: 'LARA VITORIA PEREIRA SANTOS',
        matricula: '202330876391',
        turma_id: 7,
      },
      {
        nome: 'LUIZA LAUREANO DE OLIVEIRA',
        matricula: '202330455193',
        turma_id: 7,
      },
      {
        nome: 'MARIA CLARA OLIVEIRA FERREIRA',
        matricula: '202330161265',
        turma_id: 7,
      },
      {
        nome: 'MARIA VITORIA PEREIRA SALES',
        matricula: '202330164131',
        turma_id: 7,
      },
      {
        nome: 'MARIANA LEUCK DE OLIVEIRA',
        matricula: '202331097276',
        turma_id: 7,
      },
      {
        nome: 'MARIANA RODRIGUES SANTOS',
        matricula: '202231268666',
        turma_id: 7,
      },
      {
        nome: 'MATHEUS GOMES SILVA',
        matricula: '202330878547',
        turma_id: 7,
      },
      {
        nome: 'MIKELY ALVES SAO LEAO',
        matricula: '202230861529',
        turma_id: 7,
      },
      {
        nome: 'RAFAEL SANTANA RODRIGUES',
        matricula: '202330750308',
        turma_id: 7,
      },
      {
        nome: 'RAYANNA LOPES SANTOS',
        matricula: '202330905985',
        turma_id: 7,
      },
      {
        nome: 'TAYLA SILVA DO NASCIMENTO',
        matricula: '202330147435',
        turma_id: 7,
      },
      {
        nome: 'WENDER SANTANA DE ALMEIDA',
        matricula: '202330153432',
        turma_id: 7,
      },

      // ADMVESADMA - 30 estudantes
      {
        nome: 'ANA JULIA ROCHA FREITAS',
        matricula: '202330796906',
        turma_id: 8,
      },
      {
        nome: 'ANA LUISA FIGUEIREDO DE SOUZA',
        matricula: '202330089402',
        turma_id: 8,
      },
      {
        nome: 'ANA LUIZA CABRAL NOVAIS',
        matricula: '202331839445',
        turma_id: 8,
      },
      {
        nome: 'ANNA CLARA DIAS DOS SANTOS',
        matricula: '202330098869',
        turma_id: 8,
      },
      {
        nome: 'ARTHUR GOMES FARIAS',
        matricula: '202330857592',
        turma_id: 8,
      },
      {
        nome: 'CAIO FERNANDES DE JESUS',
        matricula: '202330778461',
        turma_id: 8,
      },
      {
        nome: 'CLARYCE FIGUEREDO SANTOS',
        matricula: '202330993333',
        turma_id: 8,
      },
      {
        nome: 'DARIELLY FERREIRA PAULINO',
        matricula: '202330839146',
        turma_id: 8,
      },
      {
        nome: 'EDUARDA DE SOUZA COSTA',
        matricula: '202330848913',
        turma_id: 8,
      },
      {
        nome: 'EMILLY SOUZA RIBEIRO',
        matricula: '202330450455',
        turma_id: 8,
      },
      {
        nome: 'GEOVANNA TEIXEIRA VIANA',
        matricula: '202331321612',
        turma_id: 8,
      },
      {
        nome: 'HILQUIAS CHAVES ALMEIDA',
        matricula: '202330426530',
        turma_id: 8,
      },
      {
        nome: 'JOAO NICOLAS HENRIQUETA DIAS',
        matricula: '202331319392',
        turma_id: 8,
      },
      {
        nome: 'JOAO PEDRO SOUZA SANTANA',
        matricula: '202330868007',
        turma_id: 8,
      },
      {
        nome: 'KETLY CAMILY GOMES DOS SANTOS',
        matricula: '202331289542',
        turma_id: 8,
      },
      {
        nome: 'LETICIA COSTA SIMOES',
        matricula: '202330862752',
        turma_id: 8,
      },
      {
        nome: 'LETICIA DIAS LIMA',
        matricula: '202330073690',
        turma_id: 8,
      },
      {
        nome: 'LIVIA SILVA SANTOS',
        matricula: '202330958989',
        turma_id: 8,
      },
      {
        nome: 'LUCAS MOREIRA GARRIDO MARTIN',
        matricula: '202331009970',
        turma_id: 8,
      },
      {
        nome: 'LUCAS TAVARES DA SILVA PEREIRA',
        matricula: '202330894086',
        turma_id: 8,
      },
      {
        nome: 'MAILA VIANA DE SA',
        matricula: '202331310118',
        turma_id: 8,
      },
      {
        nome: 'MELISSA FLORA REIS',
        matricula: '202330886440',
        turma_id: 8,
      },
      {
        nome: 'PEDRO HENRIQUE SA SILVA ROCHA',
        matricula: '202330870530',
        turma_id: 8,
      },
      {
        nome: 'REBECA SOPHIE ALMEIDA NEVES',
        matricula: '202330536809',
        turma_id: 8,
      },
      {
        nome: 'RYAN LOPES DA SILVA',
        matricula: '202331502055',
        turma_id: 8,
      },
      {
        nome: 'SABRINA SILVA DE MOURA',
        matricula: '202331712517',
        turma_id: 8,
      },
      {
        nome: 'SAVIO LIMA CRUZ',
        matricula: '202330899233',
        turma_id: 8,
      },
      {
        nome: 'TALISSON MOTA DOS SANTOS',
        matricula: '202330872392',
        turma_id: 8,
      },
      {
        nome: 'VICTOR PINHEIRO SILVA',
        matricula: '202330836538',
        turma_id: 8,
      },
      {
        nome: 'WENDY SANTOS SOUZA',
        matricula: '202330893070',
        turma_id: 8,
      },

      // ADMNOTM1A2 - 32 estudantes
      {
        nome: 'ADEILMA RAMOS SOARES GOMES',
        matricula: '202531855711',
        turma_id: 9
      },
      {
        nome: 'ANA BEATRIZ SOARES DOS SANDOS',
        matricula: '9087412',
        turma_id: 9
      },
      {
        nome: 'ARIANE DA SILVA SANTOS',
        matricula: '202531856817',
        turma_id: 9
      },
      {
        nome: 'CARLOS DANIEL COUTINHO SANTOS',
        matricula: '10687822',
        turma_id: 9
      },
      {
        nome: 'DAIANE SOUZA LIMA',
        matricula: '8477665',
        turma_id: 9
      },
      {
        nome: 'DERILTON DA CRUZ GUIMARAES',
        matricula: '9729542',
        turma_id: 9
      },
      {
        nome: 'ERICA ALVES PEREIRA',
        matricula: '9639616',
        turma_id: 9
      },
      {
        nome: 'ESDRAS TELES DOS SANTOS',
        matricula: '10640941',
        turma_id: 9
      },
      {
        nome: 'FABIANA VIANA COSTA',
        matricula: '8336982',
        turma_id: 9
      },  
      {
        nome: 'GEOVANA SANTOS FERREIRA',
        matricula: '10695323',
        turma_id: 9
      },
      {
        nome: 'GILVANIA SANTOS DAMASCENA',
        matricula: '9638510',
        turma_id: 9
      },
      {
        nome: 'GLEIZIANE AUCENA DE DEUS',
        matricula: '202531855435',
        turma_id: 9
      },
      {
        nome: 'HILLARY MARTINS DA CUNHA',
        matricula: '202230200502',
        turma_id: 9
      },
      {
        nome: 'JAQUELINE FONSECA COSTA CIDADE',
        matricula: '202531857000',
        turma_id: 9
      },
      {
        nome: 'JESSICA DA SILVA SANTANA',
        matricula: '5594041',
        turma_id: 9
      },
      {
        nome: 'JONAS AGUIAR DOS REIS',
        matricula: '202332051333',
        turma_id: 9
      },
      {
        nome: 'LISSAN STEFANE SILVA PIRES',
        matricula: '202531855794',
        turma_id: 9
      },
      {
        nome: 'LORRANY EMANUELE CARVALHO LIMA',
        matricula: '7597179',
        turma_id: 9
      },
      {
        nome: 'MARTINALIA SOARES FARIAS',
        matricula: '9056881',
        turma_id: 9
      },
      {
        nome: 'MILENE RIBEIRO DOS SANTOS',
        matricula: '10002243',
        turma_id: 9
      },
      {
        nome: 'NARLA ALVES PEREIRA',
        matricula: '9639434',
        turma_id: 9
      },
      {
        nome: 'PATRICIA BRANDAO CONCEICAO',
        matricula: '202531857912',
        turma_id: 9
      },
      {
        nome: 'ROSICLEIDE DA SILVA',
        matricula: '202531854886',
        turma_id: 9
      },
      {
        nome: 'SABRINA QUEIROZ BOAVENTURA',
        matricula: '10697123',
        turma_id: 9
      },
      {
        nome: 'SILAS QUEIROZ BOAVENTURA',
        matricula: '10761650',
        turma_id: 9
      },
      {
        nome: 'SILVANETE DOS SANTOS CABRAL',
        matricula: '202531855112',
        turma_id: 9
      },
      {
        nome: 'TALITA LIMA SOUZA',
        matricula: '202230444114',
        turma_id: 9
      },
      {
        nome: 'TATIELE CRUZ OLIVEIRA SALOMAO',
        matricula: '8876563',
        turma_id: 9
      },
      {
        nome: 'THADILA OLIVEIRA MELO',
        matricula: '10691193',
        turma_id: 9
      },
      {
        nome: 'TIFFANY BARBOSA SALES SILVA',
        matricula: '202531862313',
        turma_id: 9
      },
      {
        nome: 'VITOR SANTOS DA CRUZ',
        matricula: '202231057142',
        turma_id: 9
      },
      {
        nome: 'WILLIAN PEREIRA ROCHA',
        matricula: '10530325',
        turma_id: 9
      },

      // ADMNOTM2A2 - 17 estudantes
      {
        nome: 'BEATRIZ CONCEICAO VITURINO',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'CAMILA SANTOS MARINHO MOREIRA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'CARLOS VINICIOS DOS SANTOS',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'EMILLY LUIZA DA COSTA MELO',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'FABRICIA GOMES DE LIMA BUDERA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'GLEISSA RESSURREICAO FREITAS',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'JOSIANE MARIA OLIVEIRA DA SILVA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'LARISSA MOREIRA DA SILVA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'LUANDRO SANTOS DA SILVA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'MARIANA LACERDA CASSIANO DA SILVA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'MYLEN TEIXEIRA DOS SANTOS SILVA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'NAYANE PEREIRA DOS SANTOS',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'NUBIA SOUZA DOS SANTOS',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'VALDINEIA FERREIRA PESSOA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'VINÍCIUS GUERRA COSTA',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'WIANE SANTOS BARROS',
        matricula: '',
        turma_id: 10
      },
      {
        nome: 'YAGO SILVA DOS SANTOS',
        matricula: '',
        turma_id: 10
      },

      // ADMNOTM3A2 - 28 estudantes
      {
        nome: 'ALAISE DA ASSUNCAO SANTOS',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'AMANDA PEREIRA DE JESUS',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'CAMILA DE JESUS CARVALHO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'DANIELLE PEREIRA MACHADO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'DANILO SILVA RIBEIRO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'DANUBIA DA SILVA OLIVEIRA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'ELIELSON SAMPAIO BRAGA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'EVELIN DA SILVA QUARESMA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'GIBRANIA MORAIS DE SANTANA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'HIGOR PAIXAO PINHO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'JUCIARA MORAIS SANTOS',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'KLAYVERT DA COSTA CRUZ',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'LAYSLA PEREIRA DOS SANTOS',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'MAQUES EMILIANO MUNIZ RIBEIRO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'MARILZA MEIRELES SOUZA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'MARLUCE DOS SANTOS CAMPIRA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'MIRIELEN SANTOS SOUZA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'MOISES FERREIRA DA SILVA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'NATHANIE SARA OLIVEIRA FERREIRA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'NATIELE REIS DA SILVA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'PABLO DOS ANJOS OLIVEIRA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'RAIANE SOARES SILVA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'ROBERTA SANTOS VIDAL',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'ROGER FERNANDES DOS SANTOS',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'RONNE PETERSON JESUS TEIXEIRA',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'TALITA DA SILVA CONCEIÇÃO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'TAMIRES DA SILVA CONCEIÇÃO',
        matricula: '',
        turma_id: 11
      },
      {
        nome: 'WANDERSON PAIVA MENEZES',
        matricula: '',
        turma_id: 11
      },

      // Turmas de Biotecnologia
      // BIOTVES1SA - 36 estudantes
      {
        nome: 'ALESSANDRO SOUZA TALHER',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ANA CLARA SILVA ROCHA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ANA LUIZA AMARAL MURO',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ARIEL FERREIRA COSTA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ARTHUR LOBEU AGUILAR',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ARTUR LEONE DA ROCHA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'CAIO PORTO FARIAS',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'DAFINE YORRANE DE SOUZA POLY',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ELOA SANTOS MEIRELES',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'EMANUELY PORTELA DOS SANTOS KUHL',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ENDRILLY PEREIRA ALVES',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'ENZO LIMA MARINHO',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'EVELYN LAURENTINO OLIVEIRA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'GABRIEL COSTA ARPINI',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'GESSYCA KARINE SANTOS SOUZA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'GIOVANA PEREIRA SILVA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'GUSTAVO APOSTOLO DOS SANTOS',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'GUSTAVO DOS SANTOS FERREIRA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'JACKSON MEIRELES DE OLIVEIRA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'JOAO PAULO FRANCIS LEITE JUNIOR',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'LARA STEFANE SOUZA RIBEIRO',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'LUANA OLIVEIRA COSTA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'LUCIANA FREIRE DE SANTANA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'LUIZ FERNANDO NASCIMENTO DOS SANTOS',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'MARIA CLARA SANTOS DE OLIVEIRA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'MARIA EDUARDA DOS SANTOS MARTINS',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'MIQUEIAS DA SILVA MENDES',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'NATALIA BRAGA BORGES',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'NATHALIA OLIVEIRA DA SILVEIRA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'NATHALIA SAMPAIO MATTOS',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'PAMELA MOREIRA LACERDA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'RAVI GOMES ROCHA',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'SAMUEL VICTOR AMARAL DOS SANTOS',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'TIFANY VIANA LOPES',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'VITORIA CAROLINA NUNES LUIZ',
        matricula: '',
        turma_id: 12
      },
      {
        nome: 'YURE OLIVEIRA DE JESUS',
        matricula: '',
        turma_id: 12
      },

      // BIOTVES2SA - 28 estudantes
      {
        nome: 'ANA JULIA FRANCISCA DA SILVA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'ANA LUIZA PORTO CANTO',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'CAMILA FERREIRA LACERDA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'CAUA ANDRADE PEREIRA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'DAVI OLIVEIRA SILVA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'DEBORA MOREIRA DE SOUZA FILHA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'GABRIEL CRUZ SILVA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'GUSTAVO NASCIMENTO SATURNINO',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'HELOYSE DA SILVA DUTRA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'ISABELLE DIAS NERES DE SOUZA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'JOABE SHELDON DIONOR ROCHA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'KLEBSON FILYPE PEREIRA RUAS',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'MARIA EDUARDA BARBOSA DA SILVA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'MARIA HELOIZA DOS SANTOS PAIVA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'MARINA SILVA MEDEIROS',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'MAYLA SANTOS AURELIANO',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'MERLIN RIBEIRO SANTOS',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'MICAELLY DE SOUZA PIRES',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'NATIELE ALVES COSTA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'NICOLLE PEREIRA NERES',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'PAMELA LARANJEIRA DOS SANTOS',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'PAULO VICTOR MIRANDA NEVES',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'PEDRO NERES GOMES',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'SARA SILVA QUEIROZ',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'SOPHIA PENHA DUSTIN',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'THAMARA GOMES SILVA',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'THAYNA ESTEFANY DA ROCHA HENRIQUES',
        matricula: '',
        turma_id: 13
      },
      {
        nome: 'THAYZA DIAS SEABRA',
        matricula: '',
        turma_id: 13
      },

      // BIOTNOTM3A2 - 5 estudantes
      {
        nome: 'CHEILA PEREIRA MENDES SILVA',
        matricula: '202432173286',
        turma_id: 14
      },
      {
        nome: 'CLAUDIA RIBEIRO BATISTA COSTA',
        matricula: '202432186560',
        turma_id: 14
      },
      {
        nome: 'FABIO FERREIRA ALVES CHAVES',
        matricula: '8721677',
        turma_id: 14
      },
      {
        nome: 'GUSTAVO PAES MOTA',
        matricula: '8242755',
        turma_id: 14
      },
      {
        nome: 'MATEUS DE ALMEIDA MENDES',
        matricula: '10503347',
        turma_id: 14
      },

      // BIOTNOTM4A2 - 11 estudantes id: 15
      {
        nome: 'EMANOELLA MARIA NASCIMENTO VIANA',
        matricula: '10698122',
        turma_id: 15
      },
      {
        nome: 'FILIPE MEDEIROS SANTOS',
        matricula: '10697398',
        turma_id: 15
      },
      {
        nome: 'GABRIELA SANTOS SANTANA',
        matricula: '9739789',
        turma_id: 15
      },
      {
        nome: 'JOELIA PEREIRA DOS SANTOS',
        matricula: '10361098',
        turma_id: 15
      },
      {
        nome: 'KARINE DO NASCIMENTO AMANCIO',
        matricula: '202431829334',
        turma_id: 15
      },
      {
        nome: 'LETICIA MAI SOUZA',
        matricula: '10381750',
        turma_id: 15
      },
      {
        nome: 'LUISA ANDRADE LIMA',
        matricula: '9477173',
        turma_id: 15
      },
      {
        nome: 'MARCIA RODRIGUES DA SILVA LOBO',
        matricula: '202431592494',
        turma_id: 15
      },
      {
        nome: 'MATHEUS VITTORIO NOZZA LIMA',
        matricula: '10473834',
        turma_id: 15
      },
      {
        nome: 'TAMIRES SANTOS VIEIRA',
        matricula: '8205628',
        turma_id: 15
      },
      {
        nome: 'WENIA DA SILVA DIAS',
        matricula: '10532541',
        turma_id: 15
      },
      
      // Turmas de Informática
      // INFMAT1SA - 39 estudantes id: 16
      // INFMAT1SB - 39 estudantes id: 17
      // INFVES1SA - 38 estudantes id: 18
      // INFMAT2SA - 39 estudantes id: 19
      // INFVES2SA - 21 estudantes id: 20
      // INFMAT3SA - 34 estudantes id: 21
      // INFVES3SA - 26 estudantes id: 22
      // INFNOTM2A - 18 estudantes id: 23

      // INFNOTM3A - 10 estudantes id: 24
      {
        nome: 'ANTONIE RIBEIRO SANTOS',
        matricula: '10605237',
        turma_id: 24
      },
      {
        nome: 'DALILA GALVAO SILVA',
        matricula: '8265868',
        turma_id: 24
      },
      {
        nome: 'DANIEL DA SILVA CHAVES',
        matricula: '10340690',
        turma_id: 24
      },
      {
        nome: 'ELDER ALVES ARAUJO',
        matricula: '10350365',
        turma_id: 24
      },
      {
        nome: 'JAMILE NERES ALVES',
        matricula: '10700791',
        turma_id: 24
      },
      {
        nome: 'JOSEFRAN LUCIO DA SILVA GOIS',
        matricula: '9778456',
        turma_id: 24
      },
      {
        nome: 'MARCO ANTONIO DE SOUZA',
        matricula: '202432181054',
        turma_id: 24
      },
      {
        nome: 'MARCOS VINICIUS SOUZA TELES',
        matricula: '10691835',
        turma_id: 24
      },
      {
        nome: 'RAILINE VIANA RODRIGUES',
        matricula: '9638065',
        turma_id: 24
      },
      {
        nome: 'RENATO SANTOS DA SILVA',
        matricula: '10701692',
        turma_id: 24
      },

      // INFNOTM4A - 7 estudantes
      {
        nome: 'JOAO VICTOR ALMEIDA ECA',
        matricula: '7607710',
        turma_id: 25
      },
      {
        nome: 'KELIANA OLIVEIRA NASCIMENTO',
        matricula: '10435626',
        turma_id: 25
      },
      {
        nome: 'LUCICLEIA MEDEIROS DA SILVA',
        matricula: '10547492',
        turma_id: 25
      },
      {
        nome: 'MARLENE DE JESUS SILVA',
        matricula: '10477086',
        turma_id: 25
      },
      {
        nome: 'PABLO DA SILVA SANTOS',
        matricula: '10702361',
        turma_id: 25
      },
      {
        nome: 'PAULO SILAS REGES GOMES',
        matricula: '7332811',
        turma_id: 25
      },
      {
        nome: 'RENATA GOMES LIMA',
        matricula: '7080394',
        turma_id: 25
      },

      // Turmas de Enfermagem
      // ENFENOTM3A2 - 22 estudantes id: 26

      // Turmas de Análises Clínicas
      // ANACVES1SA - 36 estudantes id: 27
      // ANACVES3SA - 29 estudantes id: 28
      
      // Turmas de Química
      // QUIMMAT1SA - 36 estudantes id: 29
      // QUIMMAT1SB - 37 estudantes id: 30
      // QUIMMAT2SA - 28 estudantes id: 31
      // QUIMMAT3SA - 32 estudantes id: 32
      // QUIMNOTM2A2 - 18 estudantes id: 33
      // QUIMNOTM3A2 - 14 estudantes
      {
        nome: 'ALIANDESSANDRO CARDOSO DOS SANTOS',
        matricula: '1788020',
        turma_id: 34
      },
      {
        nome: 'DALETE DA SILVA COSTA',
        matricula: '10098409',
        turma_id: 34
      },
      {
        nome: 'EDUARDA SOUZA DOS SANTOS',
        matricula: '10691982',
        turma_id: 34
      },
      {
        nome: 'EMILLY ALVES MONTEIRO',
        matricula: '10358209',
        turma_id: 34
      },
      {
        nome: 'EVELYN ANDRADE DOS SANTOS',
        matricula: '202231011573',
        turma_id: 34
      },
      {
        nome: 'FABIO SILVA SOARES',
        matricula: '202432182534',
        turma_id: 34
      },
      {
        nome: 'JOZIRO FERNANDES DE SOUZA NETO',
        matricula: '202432173704',
        turma_id: 34
      },
      {
        nome: 'JULIANA TOMAZ ALVES',
        matricula: '10366688',
        turma_id: 34
      },
      {
        nome: 'LUDIMILI GOMES ARAUJO',
        matricula: '10369662',
        turma_id: 34
      },
      {
        nome: 'MANUELE NEVES FERREIRA',
        matricula: '10858226',
        turma_id: 34
      },
      {
        nome: 'NAIARA DA ROCHA OLIVEIRA',
        matricula: '9155470',
        turma_id: 34
      },
      {
        nome: 'REBECA PIRES NUNES',
        matricula: '10695842',
        turma_id: 34
      },
      {
        nome: 'TAMARA DE OLIVEIRA SANTANA',
        matricula: '202432194375',
        turma_id: 34
      },
      {
        nome: 'VANDERLANDE DE JESUS SILVA',
        matricula: '4155200',
        turma_id: 34
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Estudantes', null, {});
  }
};
