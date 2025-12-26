// ==========================================
// QUIZMAS - Vragen Generator
// Nederlandse trivia vragen voor de hele familie
// ==========================================

class QuestionGenerator {
    constructor() {
        // Vragenbanken voor verschillende categorieën
        this.questionBanks = {
            general: this.getAlgemeneVragen(),
            nederland: this.getNederlandVragen(),
            history: this.getGeschiedenisVragen(),
            geography: this.getAardrijkskundeVragen(),
            science: this.getWetenschapVragen(),
            sports: this.getSportVragen(),
            music: this.getMuziekVragen(),
            movies: this.getFilmsVragen(),
            literature: this.getLiteratuurVragen(),
            art: this.getKunstVragen(),
            food: this.getEtenVragen(),
            nature: this.getNatuurVragen(),
            technology: this.getTechnologieVragen(),
            christmas: this.getKerstVragen()
        };
    }

    async generate(category, difficulty, count) {
        // Haal vragen op uit de bank
        let questions = this.questionBanks[category] || this.questionBanks.general;
        
        // Filter op moeilijkheid als niet gemengd
        if (difficulty !== 'mixed') {
            questions = questions.filter(q => q.difficulty === difficulty);
        }

        // Schud en neem het gevraagde aantal
        questions = this.shuffleArray([...questions]);
        questions = questions.slice(0, Math.min(count, questions.length));

        // Voeg categorie info toe
        return questions.map(q => ({
            ...q,
            category: category,
            mediaType: q.mediaType || 'none',
            mediaUrl: q.mediaUrl || null,
            timeLimit: q.timeLimit || 20
        }));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ==========================================
    // Vragenbanken per Categorie
    // ==========================================

    getAlgemeneVragen() {
        return [
            {
                text: "Wat is de hoofdstad van Nederland?",
                answers: ["Amsterdam", "Den Haag", "Rotterdam", "Utrecht"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel continenten zijn er op aarde?",
                answers: ["7", "5", "6", "8"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de grootste planeet in ons zonnestelsel?",
                answers: ["Jupiter", "Saturnus", "Neptunus", "Aarde"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het chemische symbool voor goud?",
                answers: ["Au", "Ag", "Fe", "Cu"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie schilderde de Mona Lisa?",
                answers: ["Leonardo da Vinci", "Michelangelo", "Rafaël", "Rembrandt"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de grootste oceaan op aarde?",
                answers: ["Stille Oceaan", "Atlantische Oceaan", "Indische Oceaan", "Noordelijke IJszee"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel poten heeft een spin?",
                answers: ["8", "6", "10", "4"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de hoofdstad van Japan?",
                answers: ["Tokio", "Kyoto", "Osaka", "Hiroshima"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie schreef 'Romeo en Julia'?",
                answers: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het kleinste land ter wereld?",
                answers: ["Vaticaanstad", "Monaco", "San Marino", "Liechtenstein"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel dagen heeft een schrikkeljaar?",
                answers: ["366", "365", "364", "367"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de hoogste berg ter wereld?",
                answers: ["Mount Everest", "K2", "Kangchenjunga", "Mont Blanc"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getNederlandVragen() {
        return [
            {
                text: "In welk jaar werd Willem-Alexander koning?",
                answers: ["2013", "2010", "2015", "2014"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is de langste rivier van Nederland?",
                answers: ["De Rijn", "De Maas", "De IJssel", "De Waal"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel provincies heeft Nederland?",
                answers: ["12", "10", "11", "13"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welke stad staat het Rijksmuseum?",
                answers: ["Amsterdam", "Den Haag", "Rotterdam", "Utrecht"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de nationale bloem van Nederland?",
                answers: ["Tulp", "Roos", "Narcis", "Hyacint"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse voetbalclub heeft de meeste landstitels?",
                answers: ["Ajax", "PSV", "Feyenoord", "AZ"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk jaar werd de Deltawerken voltooid?",
                answers: ["1997", "1990", "2000", "1985"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Waar staat het hoofdkantoor van Shell?",
                answers: ["Den Haag", "Amsterdam", "Rotterdam", "Eindhoven"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke beroemde Nederlandse schilder knipte zijn oor af?",
                answers: ["Vincent van Gogh", "Rembrandt", "Johannes Vermeer", "Piet Mondriaan"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de grootste stad van Nederland qua inwoners?",
                answers: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk jaar vond de Watersnoodramp plaats?",
                answers: ["1953", "1945", "1960", "1950"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse wetenschapper ontdekte het elektron?",
                answers: ["Hendrik Lorentz", "Christiaan Huygens", "Heike Kamerlingh Onnes", "Willem Einthoven"],
                correctIndex: 0,
                difficulty: "hard",
                explanation: "Hoewel J.J. Thomson officieel het elektron ontdekte, droeg Lorentz significant bij aan de theorie."
            },
            {
                text: "Wat is de oudste universiteit van Nederland?",
                answers: ["Universiteit Leiden", "Universiteit Utrecht", "Universiteit Groningen", "Universiteit van Amsterdam"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse DJ won meerdere keren de DJ Mag Top 100?",
                answers: ["Armin van Buuren", "Tiësto", "Martin Garrix", "Hardwell"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoe heet het grootste eiland van Nederland?",
                answers: ["Texel", "Vlieland", "Terschelling", "Ameland"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke kleur heeft de middelste baan van de Nederlandse vlag?",
                answers: ["Wit", "Rood", "Blauw", "Oranje"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie schreef 'Het Achterhuis' (Anne Frank dagboek)?",
                answers: ["Anne Frank", "Corrie ten Boom", "Etty Hillesum", "Margot Frank"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse uitvinder verbeterde de microscoop?",
                answers: ["Antoni van Leeuwenhoek", "Christiaan Huygens", "Hans Lipperhey", "Zacharias Janssen"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Wat is het bekendste exportproduct van Gouda?",
                answers: ["Kaas", "Stroopwafels", "Hagelslag", "Fietsen"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse stad heeft de grootste haven van Europa?",
                answers: ["Rotterdam", "Amsterdam", "Antwerpen", "Hamburg"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoe heet de zetel van de regering in Nederland?",
                answers: ["Den Haag", "Amsterdam", "Utrecht", "Rotterdam"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk bouwwerk is het symbool van Rotterdam?",
                answers: ["De Erasmusbrug", "De Euromast", "Het Witte Huis", "De Markthal"],
                correctIndex: 0,
                difficulty: "medium"
            }
        ];
    }

    getGeschiedenisVragen() {
        return [
            {
                text: "In welk jaar eindigde de Tweede Wereldoorlog?",
                answers: ["1945", "1944", "1946", "1943"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie was de eerste vrouwelijke premier van een Europees land?",
                answers: ["Margaret Thatcher", "Angela Merkel", "Indira Gandhi", "Golda Meir"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Het oude Rome werd gebouwd op hoeveel heuvels?",
                answers: ["7", "5", "6", "8"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie ontdekte Amerika in 1492?",
                answers: ["Christoffel Columbus", "Amerigo Vespucci", "Marco Polo", "Ferdinand Magellan"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wanneer viel de Berlijnse Muur?",
                answers: ["1989", "1991", "1987", "1990"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie was de Egyptische koningin bekend om haar schoonheid?",
                answers: ["Cleopatra", "Nefertiti", "Hatsjepsoet", "Ankhesenamun"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie was de eerste mens op de maan?",
                answers: ["Neil Armstrong", "Buzz Aldrin", "Michael Collins", "Yuri Gagarin"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk jaar begon de Eerste Wereldoorlog?",
                answers: ["1914", "1915", "1913", "1918"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie was de leider van Nazi-Duitsland?",
                answers: ["Adolf Hitler", "Joseph Goebbels", "Heinrich Himmler", "Hermann Göring"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk jaar werd Nederland bevrijd van de Duitsers?",
                answers: ["1945", "1944", "1946", "1943"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie leidde de Nederlandse opstand tegen Spanje?",
                answers: ["Willem van Oranje", "Johan van Oldenbarnevelt", "Maurits van Nassau", "Frederik Hendrik"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat was de Gouden Eeuw in Nederland?",
                answers: ["17e eeuw", "16e eeuw", "18e eeuw", "15e eeuw"],
                correctIndex: 0,
                difficulty: "medium"
            }
        ];
    }

    getAardrijkskundeVragen() {
        return [
            {
                text: "Wat is de langste rivier ter wereld?",
                answers: ["De Nijl", "De Amazone", "De Yangtze", "De Mississippi"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is de grootste woestijn ter wereld?",
                answers: ["Sahara", "Arabische Woestijn", "Gobi", "Kalahari"],
                correctIndex: 0,
                difficulty: "medium",
                explanation: "Antarctica is technisch de grootste woestijn, maar de Sahara is de grootste hete woestijn!"
            },
            {
                text: "Welk land heeft de meeste inwoners?",
                answers: ["China", "India", "Verenigde Staten", "Indonesië"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de hoofdstad van Australië?",
                answers: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "In welk gebergte ligt de Mount Everest?",
                answers: ["Himalaya", "Alpen", "Andes", "Rocky Mountains"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het kleinste continent?",
                answers: ["Australië", "Europa", "Antarctica", "Zuid-Amerika"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk land staat bekend als het Land van de Rijzende Zon?",
                answers: ["Japan", "China", "Zuid-Korea", "Thailand"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de hoofdstad van Canada?",
                answers: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Waar ligt het Great Barrier Reef?",
                answers: ["Australië", "Indonesië", "Filipijnen", "Thailand"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het grootste land ter wereld qua oppervlakte?",
                answers: ["Rusland", "Canada", "China", "Verenigde Staten"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke zee grenst aan Nederland?",
                answers: ["Noordzee", "Oostzee", "Middellandse Zee", "Atlantische Oceaan"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de hoofdstad van België?",
                answers: ["Brussel", "Antwerpen", "Gent", "Brugge"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getWetenschapVragen() {
        return [
            {
                text: "Wat is H2O in de volksmond?",
                answers: ["Water", "Zuurstof", "Waterstof", "Kooldioxide"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke planeet wordt de Rode Planeet genoemd?",
                answers: ["Mars", "Venus", "Jupiter", "Mercurius"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de hardste natuurlijke stof op aarde?",
                answers: ["Diamant", "Goud", "IJzer", "Platina"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk gas nemen planten op uit de atmosfeer?",
                answers: ["Kooldioxide", "Zuurstof", "Stikstof", "Waterstof"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel botten heeft het menselijk lichaam?",
                answers: ["206", "186", "226", "196"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is het centrum van een atoom?",
                answers: ["Kern (nucleus)", "Proton", "Elektron", "Neutron"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is het grootste orgaan van het menselijk lichaam?",
                answers: ["Huid", "Lever", "Hersenen", "Hart"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat voor soort dier is een dolfijn?",
                answers: ["Zoogdier", "Vis", "Reptiel", "Amfibie"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het belangrijkste gas in de lucht die we inademen?",
                answers: ["Stikstof", "Zuurstof", "Kooldioxide", "Helium"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel planeten zijn er in ons zonnestelsel?",
                answers: ["8", "9", "7", "10"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat meet een thermometer?",
                answers: ["Temperatuur", "Luchtdruk", "Luchtvochtigheid", "Windsnelheid"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse wetenschapper ontdekte de ringen van Saturnus?",
                answers: ["Christiaan Huygens", "Antoni van Leeuwenhoek", "Hendrik Lorentz", "Jan Ingenhousz"],
                correctIndex: 0,
                difficulty: "hard"
            }
        ];
    }

    getSportVragen() {
        return [
            {
                text: "Hoeveel spelers staan er bij voetbal op het veld per team?",
                answers: ["11", "9", "10", "12"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welke sport maak je een 'slam dunk'?",
                answers: ["Basketbal", "Volleybal", "Tennis", "Handbal"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk land won het WK voetbal in 2022?",
                answers: ["Argentinië", "Frankrijk", "Brazilië", "Nederland"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel ringen staan er op de Olympische vlag?",
                answers: ["5", "4", "6", "7"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoe heet het als het 40-40 staat bij tennis?",
                answers: ["Deuce", "Advantage", "Love", "Set Point"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel holes heeft een standaard golfbaan?",
                answers: ["18", "9", "12", "21"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse schaatser won de meeste Olympische gouden medailles?",
                answers: ["Ireen Wüst", "Sven Kramer", "Ard Schenk", "Yvonne van Gennip"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke sport wordt gespeeld tijdens de Tour de France?",
                answers: ["Wielrennen", "Hardlopen", "Zwemmen", "Triathlon"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welke stad werden de Olympische Spelen 2024 gehouden?",
                answers: ["Parijs", "Los Angeles", "Tokio", "Londen"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse voetballer was international topscorer?",
                answers: ["Robin van Persie", "Dennis Bergkamp", "Patrick Kluivert", "Ruud van Nistelrooy"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel sets moet je winnen om een tenniswedstrijd te winnen bij de mannen Grand Slam?",
                answers: ["3", "2", "4", "5"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke kleur kaart krijg je bij een waarschuwing bij voetbal?",
                answers: ["Geel", "Rood", "Oranje", "Wit"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getMuziekVragen() {
        return [
            {
                text: "Wie wordt de 'King of Pop' genoemd?",
                answers: ["Michael Jackson", "Elvis Presley", "Prince", "Freddie Mercury"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke band zong 'Bohemian Rhapsody'?",
                answers: ["Queen", "The Beatles", "Led Zeppelin", "Pink Floyd"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel snaren heeft een standaard gitaar?",
                answers: ["6", "4", "8", "5"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse zanger zingt 'Zij Gelooft in Mij'?",
                answers: ["André Hazes", "Marco Borsato", "Frans Bauer", "René Froger"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke componist werd later in zijn leven doof?",
                answers: ["Beethoven", "Mozart", "Bach", "Chopin"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse DJ is bekend van 'Animals'?",
                answers: ["Martin Garrix", "Tiësto", "Armin van Buuren", "Afrojack"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Van welke band was John Lennon lid?",
                answers: ["The Beatles", "The Rolling Stones", "The Who", "Led Zeppelin"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse band zong 'Radar Love'?",
                answers: ["Golden Earring", "Shocking Blue", "BZN", "The Cats"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Uit welk land komt K-pop?",
                answers: ["Zuid-Korea", "Japan", "China", "Thailand"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse artiest won het Eurovisiesongfestival in 2019?",
                answers: ["Duncan Laurence", "Anouk", "Ilse DeLange", "Trijntje Oosterhuis"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel toetsen heeft een standaard piano?",
                answers: ["88", "76", "92", "84"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse band is bekend van 'Venus'?",
                answers: ["Shocking Blue", "Golden Earring", "Focus", "The Cats"],
                correctIndex: 0,
                difficulty: "medium"
            }
        ];
    }

    getFilmsVragen() {
        return [
            {
                text: "Wie speelde Jack in de film Titanic?",
                answers: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welke film komt het personage 'Buzz Lightyear' voor?",
                answers: ["Toy Story", "Finding Nemo", "Monsters Inc.", "The Incredibles"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoe heet de toverschool in Harry Potter?",
                answers: ["Zweinstein", "Beauxbatons", "Klansen", "Ilvermorny"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie speelde de Joker in The Dark Knight?",
                answers: ["Heath Ledger", "Jack Nicholson", "Joaquin Phoenix", "Jared Leto"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoe heet de vader van Simba in The Lion King?",
                answers: ["Mufasa", "Scar", "Rafiki", "Zazu"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welke film wordt het liedje 'Let It Go' gezongen?",
                answers: ["Frozen", "Rapunzel", "Vaiana", "Brave"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie speelt Iron Man in de Marvel films?",
                answers: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse film won een Oscar voor Beste Buitenlandse Film?",
                answers: ["Karakter", "Soldaat van Oranje", "Turks Fruit", "De Aanslag"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Wie is de hoofdpersoon in de Shrek films?",
                answers: ["Een groene ogre", "Een ezel", "Een kat", "Een draak"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk jaar kwam de eerste Star Wars film uit?",
                answers: ["1977", "1980", "1975", "1983"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse actrice speelde in Game of Thrones?",
                answers: ["Carice van Houten", "Famke Janssen", "Halina Reijn", "Lieke van Lexmond"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoe heet de clownvis in Finding Nemo?",
                answers: ["Nemo", "Marlin", "Dory", "Gill"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getLiteratuurVragen() {
        return [
            {
                text: "Wie schreef 'Het Achterhuis'?",
                answers: ["Anne Frank", "Corrie ten Boom", "Harry Mulisch", "Jan Wolkers"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het eerste boek van de Bijbel?",
                answers: ["Genesis", "Exodus", "Leviticus", "Numeri"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie schreef '1984'?",
                answers: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "In welke boekenreeks komt Hermelien Griffel voor?",
                answers: ["Harry Potter", "De Hongerspelen", "Twilight", "Percy Jackson"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie schreef 'In de Heer der Ringen'?",
                answers: ["J.R.R. Tolkien", "C.S. Lewis", "George R.R. Martin", "Terry Pratchett"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke Nederlandse schrijver schreef 'De Ontdekking van de Hemel'?",
                answers: ["Harry Mulisch", "Willem Frederik Hermans", "Gerard Reve", "Jan Wolkers"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie is de auteur van 'Don Quichot'?",
                answers: ["Miguel de Cervantes", "Gabriel García Márquez", "Pablo Neruda", "Jorge Luis Borges"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Hoe heet de detective van Arthur Conan Doyle?",
                answers: ["Sherlock Holmes", "Hercule Poirot", "Miss Marple", "Philip Marlowe"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie schreef 'Max Havelaar'?",
                answers: ["Multatuli", "Louis Couperus", "Simon Vestdijk", "Hella Haasse"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse schrijfster schreef 'Oeroeg'?",
                answers: ["Hella Haasse", "Annie M.G. Schmidt", "Renate Dorrestein", "A.F.Th. van der Heijden"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Wie schreef de Narnia boeken?",
                answers: ["C.S. Lewis", "J.R.R. Tolkien", "Roald Dahl", "Enid Blyton"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie schreef 'De Kleine Prins'?",
                answers: ["Antoine de Saint-Exupéry", "Victor Hugo", "Albert Camus", "Jean-Paul Sartre"],
                correctIndex: 0,
                difficulty: "medium"
            }
        ];
    }

    getKunstVragen() {
        return [
            {
                text: "Wie schilderde 'De Sterrennacht'?",
                answers: ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Salvador Dalí"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Waar hangt de Mona Lisa?",
                answers: ["Het Louvre, Parijs", "Het Vaticaan", "Het Rijksmuseum", "Het Prado, Madrid"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie beeldhouwde 'David'?",
                answers: ["Michelangelo", "Donatello", "Bernini", "Rodin"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse schilder schilderde 'De Nachtwacht'?",
                answers: ["Rembrandt van Rijn", "Johannes Vermeer", "Frans Hals", "Jan Steen"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie is beroemd om zijn Campbell's soepblikken schilderijen?",
                answers: ["Andy Warhol", "Roy Lichtenstein", "Jasper Johns", "Keith Haring"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wie schilderde het plafond van de Sixtijnse Kapel?",
                answers: ["Michelangelo", "Leonardo da Vinci", "Rafaël", "Botticelli"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke nationaliteit had Frida Kahlo?",
                answers: ["Mexicaans", "Spaans", "Argentijns", "Braziliaans"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welke Nederlandse schilder is bekend om 'Het Meisje met de Parel'?",
                answers: ["Johannes Vermeer", "Rembrandt van Rijn", "Vincent van Gogh", "Piet Mondriaan"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Bij welke kunststroming hoort Piet Mondriaan?",
                answers: ["De Stijl", "Impressionisme", "Kubisme", "Surrealisme"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welk schilderij van Edvard Munch toont een figuur met een angstige uitdrukking?",
                answers: ["De Schreeuw", "De Kus", "Melancholie", "De Dans des Levens"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getEtenVragen() {
        return [
            {
                text: "Wat is het hoofdingrediënt van guacamole?",
                answers: ["Avocado", "Tomaat", "Ui", "Paprika"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Uit welk land komt sushi?",
                answers: ["Japan", "China", "Korea", "Thailand"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de duurste specerij ter wereld?",
                answers: ["Saffraan", "Vanille", "Kardemom", "Kaneel"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is het hoofdingrediënt van hummus?",
                answers: ["Kikkererwten", "Linzen", "Witte bonen", "Zwarte bonen"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk land heeft de pizza uitgevonden?",
                answers: ["Italië", "Griekenland", "VS", "Frankrijk"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke noot wordt gebruikt om marsepein te maken?",
                answers: ["Amandel", "Walnoot", "Hazelnoot", "Pistache"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is een typisch Nederlands gerecht?",
                answers: ["Stamppot", "Paella", "Fish and chips", "Currywurst"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Uit welke stad komt de stroopwafel?",
                answers: ["Gouda", "Amsterdam", "Rotterdam", "Den Haag"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welk Nederlands product eten veel mensen op brood?",
                answers: ["Hagelslag", "Marmelade", "Pindakaas", "Nutella"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het nationale gerecht van België?",
                answers: ["Moules-frites", "Wafels", "Stoofvlees", "Waterzooi"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Van welk dier komt Parmezaanse kaas (traditioneel)?",
                answers: ["Koe", "Geit", "Schaap", "Buffel"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is een typische Nederlandse snack van de snackbar?",
                answers: ["Frikandel", "Bratwurst", "Currywurst", "Hot dog"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getNatuurVragen() {
        return [
            {
                text: "Wat is het grootste zoogdier ter wereld?",
                answers: ["Blauwe vinvis", "Olifant", "Giraffe", "Nijlpaard"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is het snelste landdier?",
                answers: ["Cheeta", "Leeuw", "Gazelle", "Paard"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel harten heeft een octopus?",
                answers: ["3", "1", "2", "4"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welk zoogdier kan echt vliegen?",
                answers: ["Vleermuis", "Eekhoorn", "Suikereekhoorn", "Kangoeroe"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de grootste pinguïnsoort?",
                answers: ["Keizerspinguïn", "Koningspinguïn", "Ezelspinguïn", "Macaronipinguïn"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat voor soort dier is een Komodovaraan?",
                answers: ["Hagedis", "Slang", "Krokodil", "Dinosaurus"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoe noem je een groep leeuwen?",
                answers: ["Troep", "Kudde", "Roedel", "Zwerm"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke vogel kan achteruit vliegen?",
                answers: ["Kolibrie", "Zwaluw", "IJsvogel", "Mus"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel poten heeft een bij?",
                answers: ["6", "4", "8", "10"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk dier slaapt met één oog open?",
                answers: ["Dolfijn", "Haai", "Uil", "Krokodil"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Wat is het nationale dier van Nederland (symbolisch)?",
                answers: ["Leeuw", "Koe", "Ooievaar", "Kievit"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoeveel jaar kan een schildpad gemiddeld oud worden?",
                answers: ["Meer dan 100 jaar", "50 jaar", "25 jaar", "200 jaar"],
                correctIndex: 0,
                difficulty: "medium"
            }
        ];
    }

    getTechnologieVragen() {
        return [
            {
                text: "Waar staat 'www' voor?",
                answers: ["World Wide Web", "Wide World Web", "Web Wide World", "World Web Wide"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wie heeft Microsoft opgericht?",
                answers: ["Bill Gates & Paul Allen", "Steve Jobs & Steve Wozniak", "Larry Page & Sergey Brin", "Mark Zuckerberg"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk jaar kwam de eerste iPhone uit?",
                answers: ["2007", "2005", "2008", "2010"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Waar staat CPU voor?",
                answers: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk bedrijf maakte het Android besturingssysteem?",
                answers: ["Google", "Apple", "Microsoft", "Samsung"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Waar staat 'HTML' voor?",
                answers: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Making Language", "Home Tool Markup Language"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk bedrijf maakt de PlayStation?",
                answers: ["Sony", "Nintendo", "Microsoft", "Sega"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de meest gebruikte zoekmachine ter wereld?",
                answers: ["Google", "Bing", "Yahoo", "DuckDuckGo"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "In welk land werd Spotify opgericht?",
                answers: ["Zweden", "Nederland", "Verenigde Staten", "Duitsland"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is de naam van de virtuele assistent van Apple?",
                answers: ["Siri", "Alexa", "Cortana", "Google Assistant"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk Nederlands bedrijf maakt navigatiesystemen?",
                answers: ["TomTom", "Garmin", "Philips", "ASML"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welk sociaal medium werd opgericht door Mark Zuckerberg?",
                answers: ["Facebook", "Twitter", "Instagram", "TikTok"],
                correctIndex: 0,
                difficulty: "easy"
            }
        ];
    }

    getKerstVragen() {
        return [
            {
                text: "Hoeveel rendieren heeft de Kerstman (inclusief Rudolph)?",
                answers: ["9", "8", "10", "7"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Uit welk land komt de kerstboom traditie?",
                answers: ["Duitsland", "VS", "Engeland", "Nederland"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Hoe heet de hond van de Grinch?",
                answers: ["Max", "Buddy", "Rex", "Spot"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Onder welke plant kussen mensen traditioneel?",
                answers: ["Maretak", "Hulst", "Kerstster", "Klimop"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat is de voornaam van Scrooge in 'Een Kerstvertelling'?",
                answers: ["Ebenezer", "Edward", "Edmund", "Edgar"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wanneer vieren Nederlanders Sinterklaas?",
                answers: ["5 december", "6 december", "25 december", "24 december"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat zetten Nederlandse kinderen bij de schoorsteen voor Sinterklaas?",
                answers: ["Een schoen", "Een sok", "Een muts", "Een handschoen"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke kleur was het pak van de Kerstman oorspronkelijk?",
                answers: ["Groen", "Blauw", "Bruin", "Paars"],
                correctIndex: 0,
                difficulty: "hard"
            },
            {
                text: "Welk rendier heeft een rode neus?",
                answers: ["Rudolph", "Dasher", "Dancer", "Prancer"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoe heet het meisje in 'De Notenkraker'?",
                answers: ["Clara", "Marie", "Anna", "Sophie"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Welk kerstliedje begint met 'Stille nacht'?",
                answers: ["Stille Nacht, Heilige Nacht", "O Dennenboom", "Jingle Bells", "White Christmas"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Wat eten veel Nederlanders traditioneel met kerst?",
                answers: ["Gourmetten", "Kalkoen", "Gans", "Wild zwijn"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Welke drie wijzen bezochten het kindje Jezus?",
                answers: ["Caspar, Melchior en Balthasar", "Jan, Piet en Klaas", "Abraham, Isaac en Jakob", "Petrus, Paulus en Johannes"],
                correctIndex: 0,
                difficulty: "medium"
            },
            {
                text: "Wat is 'Glühwein' in het Nederlands?",
                answers: ["Warme wijn", "Koude wijn", "Rode wijn", "Witte wijn"],
                correctIndex: 0,
                difficulty: "easy"
            },
            {
                text: "Hoeveel geesten bezoeken Scrooge in 'Een Kerstvertelling'?",
                answers: ["3", "4", "2", "5"],
                correctIndex: 0,
                difficulty: "medium"
            }
        ];
    }
}

// Export singleton
const questionGenerator = new QuestionGenerator();
export default questionGenerator;
