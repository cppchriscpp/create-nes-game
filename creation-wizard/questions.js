const mappers = require('../data/mappers');
const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[36m",
};

const allQuestions = [

    {
        id: "name",
        question: 'Name for game (no spaces)',
        type: 'input',
        showIf: () => true,
        onSubmit: (game, userValue) => {
            try {
                game.name = userValue;
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    {
        id: "mapper",
        question: `What mapper should the rom use?\nnrom is by far the simplest. Use ${colors.blue}https://mapper.nes.science${colors.reset} to compare\n`,
        type: 'choice', 
        possibleValues: Object.keys(mappers),
        defaultValue: 'nrom',
        showIf: () => true,
        onSubmit: (game, userValue) => {
            game.mapper = userValue;
            return true;
        }
    },
    {
        id: "chr-ram",
        question: 'Would you like to use chr ram?',
        type: 'choice', 
        possibleValues: ['yes', 'no'],
        defaultValue: 'no',
        runDefault: (game) => {
            if (game.getMapperDefinition().features['chr rom']) {
                game.useChrRam = false;
            } else {
                game.useChrRam = true;
            }
        },
        showIf: (game) => game.getMapperDefinition().features['chr ram'] && game.getMapperDefinition().features['chr rom'],
        onSubmit: (game, userValue) => {
            game.useChrRam = userValue === 'yes';
            if (game.useChrRam) {
                game.chrBanks = 0;
            }
            return true;
        }
    },
    {
        id: "prg-banks",
        question: game => `How many (${mappers[game.mapper].prgBankSize}) prg banks should the rom have?`,
        type: 'choice',
        possibleValues: (game) => game.getMapperDefinition().prgBankOptions,
        defaultValue: (game) => game.getMapperDefinition().prgBankOptions[game.getMapperDefinition().prgBankOptions.length - 1],
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.prgBanks = userValue;
            return true;
        }
    },
    {
        id: "chr-banks",
        question: 'How many (8kb) chr banks should the rom have?',
        type: 'choice',
        possibleValues: (game) => game.getMapperDefinition().chrBankOptions,
        defaultValue: (game) => game.getMapperDefinition().chrBankOptions[game.getMapperDefinition().chrBankOptions.length - 1],
        runDefault: (game) => {
            if (game.useChrRam) { 
                game.chrBanks = 0; 
            }
        },
        showIf: (game) => !game.useChrRam,
        onSubmit: (game, userValue) => {
            game.chrBanks = userValue;
            return true;
        }
    },
    {
        id: "mirroring",
        question: 'How would you like mirroring set by default?',
        type: 'choice',
        possibleValues: (game) => [
            'horizontal', 
            'vertical', 
            ...(game.getMapperDefinition().features['single screen mirror'] ? ['single screen'] : []),
        ],
        defaultValue: 'horizontal',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.mirroring = userValue;
            return true;
        }
    },
    {
        id: "prg-ram",
        question: 'Would you like to add battery-backed RAM? (WRAM/SRAM)',
        type: 'choice',
        // Future: add support for 32k banks, needs demo of how to use, implementation , etc
        // possibleValues: (game) => ['none', '8kb'].concat(game.getMapperDefinition().features['32k prg ram'] ? ['32kb'] : []),
        possibleValues: (game) => ['none', '8kb'],
        defaultValue: (game) => 'none',
        showIf: (game) => game.getMapperDefinition().features['prg ram'],
        onSubmit: (game, userValue) => {
            game.useSram = userValue !== 'none';
            game.sramSize = userValue !== '32kb' ? 8 : 32
        }
    },
    {
        id: "use-c",
        question: 'Would you like to use C?',
        type: 'choice',
        possibleValues: ['yes', 'no'],
        defaultValue: 'no',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.includeC = userValue === 'yes';
            return true;
        }
    }, 
    {
        id: "c-library",
        question: "Would you like to include a C library?",
        type: 'choice',
        possibleValues: ['none', 'neslib with famitone2', 'neslib with famitracker'],
        defaultValue: 'none',
        showIf: (game) => game.includeC,
        onSubmit: (game, userValue) => {
            game.includeCLibrary = userValue;
            return true;
        }
    },
    {
        id: "ci-provider",
        question: 'What CI provider would you like configuration for?',
        type: 'choice',
        possibleValues: ['none', 'circleci', 'github'],
        defaultValue: 'none',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.ciProvider = userValue;
            return true;
        }
    }, 
    {
        id: "test-provider",
        question: 'What test provider would you like to use?',
        type: 'choice',
        possibleValues: ['none', 'nes-test'],
        defaultValue: 'nes-test',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.testProvider = userValue;
            return true;
        }
    },
    {
        id: "emulator",
        question: 'Which emulator would you like to install?',
        type: 'choice',
        possibleValues: ['system default', 'mesen', 'fceux'],
        showIf: (game) => true,
        defaultValue: 'mesen',
        onSubmit: (game, userValue) => {
            game.installEmulator = userValue;
            return true;
        }
    },

];

module.exports = allQuestions;