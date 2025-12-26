// ==========================================
// QUIZMAS - Voorbeeld Vragen Data
// Nederlandse vragen voor de hele familie
// ==========================================

const voorbeeldVragen = [
    // Kerst Vragen
    {
        category: "christmas",
        difficulty: "easy",
        text: "Wat zetten kinderen voor Sinterklaas bij de schoorsteen?",
        answers: ["Hun schoen", "Hun sok", "Hun laars", "Hun sloffen"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "christmas",
        difficulty: "easy",
        text: "Wat zet men traditioneel bovenop de kerstboom?",
        answers: ["Een ster of engel", "Een vogel", "Een kaars", "Een vlag"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "christmas",
        difficulty: "medium",
        text: "Op welke datum is Sinterklaasavond in Nederland?",
        answers: ["5 december", "6 december", "24 december", "25 december"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "christmas",
        difficulty: "easy",
        text: "Welk rendier heeft een rode neus?",
        answers: ["Rudolph", "Dasher", "Prancer", "Comet"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "christmas",
        difficulty: "medium",
        text: "Hoe heet de helper van Sinterklaas traditioneel?",
        answers: ["Zwarte Piet", "Kerstelf", "Knecht Ruprecht", "Père Fouettard"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "christmas",
        difficulty: "easy",
        text: "Wat eten veel Nederlandse families met kerst?",
        answers: ["Gourmetten", "Patat", "Brood", "Soep"],
        correctIndex: 0,
        timeLimit: 15
    },
    
    // Nederland Vragen
    {
        category: "nederland",
        difficulty: "easy",
        text: "Hoe heet de koning van Nederland?",
        answers: ["Willem-Alexander", "Beatrix", "Willem III", "Juliana"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "nederland",
        difficulty: "easy",
        text: "Wat is de grootste stad van Nederland?",
        answers: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "nederland",
        difficulty: "medium",
        text: "Hoeveel provincies heeft Nederland?",
        answers: ["12", "10", "11", "14"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "nederland",
        difficulty: "easy",
        text: "Welke kleur krijg je als je rood, wit en blauw combineert?",
        answers: ["De kleuren van de Nederlandse vlag", "Groen", "Paars", "Oranje"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "nederland",
        difficulty: "medium",
        text: "Welke Nederlandse stad is beroemd om kaas?",
        answers: ["Gouda", "Amsterdam", "Rotterdam", "Alkmaar"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "nederland",
        difficulty: "hard",
        text: "In welk jaar werd Nederland bevrijd in de Tweede Wereldoorlog?",
        answers: ["1945", "1944", "1946", "1943"],
        correctIndex: 0,
        timeLimit: 25
    },
    
    // Algemene Kennis
    {
        category: "general",
        difficulty: "easy",
        text: "Wat is de hoofdstad van België?",
        answers: ["Brussel", "Antwerpen", "Gent", "Brugge"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "general",
        difficulty: "medium",
        text: "Hoeveel dagen heeft februari in een schrikkeljaar?",
        answers: ["29", "28", "30", "31"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "general",
        difficulty: "easy",
        text: "Welke kleur heeft een banaan als hij rijp is?",
        answers: ["Geel", "Groen", "Rood", "Blauw"],
        correctIndex: 0,
        timeLimit: 10
    },
    
    // Aardrijkskunde
    {
        category: "geography",
        difficulty: "easy",
        text: "Welke zee grenst aan Nederland?",
        answers: ["Noordzee", "Oostzee", "Middellandse Zee", "Zwarte Zee"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "geography",
        difficulty: "medium",
        text: "Wat is de hoofdstad van Duitsland?",
        answers: ["Berlijn", "München", "Hamburg", "Frankfurt"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "geography",
        difficulty: "easy",
        text: "Welk land grenst NIET aan Nederland?",
        answers: ["Frankrijk", "Duitsland", "België", "Alle grenzen aan Nederland"],
        correctIndex: 0,
        timeLimit: 20
    },
    
    // Wetenschap
    {
        category: "science",
        difficulty: "easy",
        text: "Bij welke temperatuur kookt water?",
        answers: ["100°C", "90°C", "110°C", "80°C"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "science",
        difficulty: "easy",
        text: "Hoeveel planeten zijn er in ons zonnestelsel?",
        answers: ["8", "9", "7", "10"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "science",
        difficulty: "medium",
        text: "Wat is het chemische symbool voor water?",
        answers: ["H2O", "CO2", "O2", "NaCl"],
        correctIndex: 0,
        timeLimit: 20
    },
    
    // Sport
    {
        category: "sports",
        difficulty: "easy",
        text: "Hoeveel spelers heeft een voetbalteam op het veld?",
        answers: ["11", "10", "12", "9"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "sports",
        difficulty: "medium",
        text: "Welke Nederlandse voetbalclub speelt in de Johan Cruijff ArenA?",
        answers: ["Ajax", "Feyenoord", "PSV", "AZ"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "sports",
        difficulty: "easy",
        text: "In welke sport gebruik je schaatsen?",
        answers: ["Schaatsen", "Wielrennen", "Zwemmen", "Tennis"],
        correctIndex: 0,
        timeLimit: 10
    },
    
    // Muziek
    {
        category: "music",
        difficulty: "easy",
        text: "Welke Nederlandse zanger is bekend van 'Bloed, Zweet en Tranen'?",
        answers: ["André Hazes", "Marco Borsato", "Frans Bauer", "Guus Meeuwis"],
        correctIndex: 0,
        timeLimit: 20
    },
    {
        category: "music",
        difficulty: "medium",
        text: "Hoeveel snaren heeft een gitaar normaal gesproken?",
        answers: ["6", "4", "5", "8"],
        correctIndex: 0,
        timeLimit: 15
    },
    
    // Films
    {
        category: "movies",
        difficulty: "easy",
        text: "Hoe heet de groene ogre uit de animatiefilms?",
        answers: ["Shrek", "Hulk", "Fiona", "Donkey"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "movies",
        difficulty: "easy",
        text: "In welke film zingt Elsa 'Let It Go'?",
        answers: ["Frozen", "Tangled", "Moana", "Brave"],
        correctIndex: 0,
        timeLimit: 15
    },
    
    // Eten & Drinken
    {
        category: "food",
        difficulty: "easy",
        text: "Wat is typisch Nederlands om op brood te doen?",
        answers: ["Hagelslag", "Ketchup", "Mayonaise", "Mosterd"],
        correctIndex: 0,
        timeLimit: 15
    },
    {
        category: "food",
        difficulty: "easy",
        text: "Waar komt de stroopwafel vandaan?",
        answers: ["Nederland", "België", "Duitsland", "Frankrijk"],
        correctIndex: 0,
        timeLimit: 15
    },
    
    // Natuur
    {
        category: "nature",
        difficulty: "easy",
        text: "Welk dier maakt honing?",
        answers: ["Bij", "Wesp", "Vlinder", "Mug"],
        correctIndex: 0,
        timeLimit: 10
    },
    {
        category: "nature",
        difficulty: "easy",
        text: "Hoeveel poten heeft een hond?",
        answers: ["4", "2", "6", "8"],
        correctIndex: 0,
        timeLimit: 10
    },
    {
        category: "nature",
        difficulty: "medium",
        text: "Welke vogel staat symbool voor Nederland?",
        answers: ["Kievit", "Meeuw", "Zwaan", "Ooievaar"],
        correctIndex: 0,
        timeLimit: 20
    }
];

// Functie om vragen te importeren naar Firebase
async function importVoorbeeldVragen(firebaseService) {
    console.log('🎄 Voorbeeld vragen importeren...');
    
    for (const vraag of voorbeeldVragen) {
        try {
            await firebaseService.saveQuestion({
                ...vraag,
                mediaType: 'none',
                mediaUrl: null
            });
            console.log(`✓ Vraag toegevoegd: ${vraag.text.substring(0, 50)}...`);
        } catch (error) {
            console.error(`✗ Fout bij toevoegen vraag: ${vraag.text}`, error);
        }
    }
    
    console.log('🎉 Import voltooid!');
}

// Export voor gebruik in browser console of modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { voorbeeldVragen, importVoorbeeldVragen };
}

// Maak beschikbaar in window object voor browser console gebruik
if (typeof window !== 'undefined') {
    window.voorbeeldVragen = voorbeeldVragen;
    window.importVoorbeeldVragen = importVoorbeeldVragen;
}
