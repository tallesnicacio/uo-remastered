Ultima Online - Documentação Completa para Remaster
1. VISÃO GERAL DO JOGO
Ultima Online (UO) foi lançado em 1997 pela Origin Systems e é considerado o primeiro MMORPG de sucesso comercial. É um jogo sandbox medieval-fantasia isométrico que permitia liberdade quase total aos jogadores.
Conceito Core

Gênero: MMORPG Sandbox Isométrico
Perspectiva: Top-down isométrica (visão 2.5D)
Mundo: Persistente, compartilhado por milhares de jogadores
Filosofia: "Faça o que quiser" - sem classes fixas, progressão baseada em uso de habilidades


2. ESTRUTURA TÉCNICA E VISUAL
2.1 Sistema de Tiles Isométricos
Estrutura do Tile:
- Tamanho base: 44x44 pixels (diamante isométrico)
- Camadas: Terrain → Static Objects → Dynamic Objects → Creatures → Effects
- Z-axis: 127 níveis de altura
2.2 Arte e Estilo Visual

Pixel Art detalhado com milhares de sprites
Paleta: 256 cores (estilo medieval realista)
Animações: Frame-by-frame (8 direções de movimento)
UI: Janelas "gump" com bordas ornamentadas medievais

2.3 Arquitetura de Rede

Cliente-Servidor (authoritative server)
Atualização em tempo real
Sistema de chunks/regions para carregar áreas


3. MUNDO DE BRITANNIA
3.1 Mapa Principal (Facet: Felucca/Trammel)
Dimensões: Aproximadamente 6144x4096 tiles
Principais Cidades:

Britain (Capital)

Castelo de Lord British
Centro comercial principal
Banco central
Grande biblioteca


Moonglow (Cidade dos Magos)

Lyceaum (escola de magia)
Reagent shops
Spellbook vendors


Trinsic (Cidade dos Paladinos)

Guarda de elite
Templo da Honra
Armeiros e ferreiros


Skara Brae (Ilha dos Bardos)

Teatro e tavernas
Cemitério assombrado
Rangers guild


Yew (Floresta dos Druidas)

Court of Justice (prisão para PKs)
Emporium (vendedores raros)
Florestas densas


Minoc (Cidade Mineira)

Minas profundas
Artesãos e tinkers
Guild de mineradores


Vesper (Porto Comercial)

Docks e navios
Mercado negro
Museum


Jhelom (Ilha dos Guerreiros)

Arena de duelos
Warriors guild
Mercenários


Magincia (Ruínas)

Cidade destruída por dragões
Alto spawn de monstros
Tesouros escondidos



Dungeons Principais:

Despise (Nível: Fácil) - Ettins, Harpies
Destard (Dragões) - Dragons, Drakes
Deceit (Mortos-vivos) - Liches, Zombies
Covetous (Gananciosos) - Harpies, Gazers
Shame (Vergonha) - Earth Elementals, Golems
Wrong (Erro) - Mongbats, Ratmen
Hythloth (Torre do Ódio) - Daemons, Gargoyles
Dungeon Ice (Cavernas Geladas) - Ice Elementals

Áreas Especiais:

Buccaneer's Den (Ilha dos Piratas) - zona PvP livre
Ocllo (Ilha para iniciantes)
Serpent's Hold (Fortaleza dos Cavaleiros)
Nujel'm (Cidade do deserto)
Papua (Selva tribal)

3.2 Outros Facets (Expansões)

Trammel: Versão "carebear" de Felucca (sem PvP forçado)
Ilshenar: Terras antigas com ruínas
Malas: Continente oriental com samurais
Tokuno Islands: Arquipélago japonês


4. SISTEMA DE HABILIDADES
4.1 Mecânica de Skills
Sistema Base:

Total de 700 pontos para distribuir (expansível para 720)
Cada skill: 0.0 a 100.0 (até 120.0 com power scrolls)
Skill gain: Uso ativo aumenta a skill gradualmente
Skill cap: 100 pontos por skill (hard cap)
Skill decay: Skills não usadas podem decair se você atingir o cap total

4.2 Lista Completa de Skills (52 skills)
COMBATE
Archery (Arco e Flecha)

Dano com arcos, bestas
Accuracy aumenta com skill
Perks: Critical hits em 100.0

Fencing (Esgrima)

Armas de estocada (spear, kryss, war fork)
Velocidade de ataque +10% em 100.0

Mace Fighting (Combate com Maças)

Armas de concussão (maces, hammers, clubs)
Chance de concussão (stun) aumenta

Swordsmanship (Espadas)

Katanas, longswords, broadswords
Dano base maior que outras armas

Wrestling (Luta Desarmada)

Combate corpo-a-corpo sem armas
Desarme de oponentes
Útil para magos (defesa)

Tactics (Táticas)

CRUCIAL: Multiplica dano de todas as armas
Formula: Dano = (Weapon Skill + Tactics) / 2
Skill essencial para qualquer combatente

Anatomy (Anatomia)

Aumenta dano body-to-body
Permite examinar status do alvo (life bar)
Synergy com Tactics

Parrying (Aparar)

Defesa com escudos
Chance de bloquear ataques
Em 100.0: ~35% block chance

Poisoning (Envenenamento)

Envenenar armas
5 níveis de veneno (Lesser → Deadly)
Requer poison potions

MAGIA
Magery (Magia Arcana)

64 magias em 8 círculos
Requer reagentes
Skill principal para magos

Evaluating Intelligence (Avaliar Inteligência)

CRUCIAL: Multiplica dano mágico
Permite ver mana do alvo
Equivalente mágico de Tactics

Meditation (Meditação)

Regeneração passiva de mana
Em 100.0: Full mana em ~10 segundos
Não funciona com armadura de metal

Resisting Spells (Resistir Magias)

Defesa contra magias
Reduz duração de paralysis/poison
Essencial contra outros magos

Spirit Speak (Falar com Espíritos)

Comunicar com fantasmas
Buff temporal de regeneração
Synergy com Necromancy

Necromancy (Necromancia - expansão AoS)

Magias de morte e dreno de vida
17 magias únicas
Requer Necro Reagents

Chivalry (Cavalaria - expansão AoS)

Magias sagradas (Paladino)
Heals, cleanses, holy damage
Requer Tithing Points

Spellweaving (Tecer Magias - expansão ML)

Magia élfica
Buffs em área
Precisa de Arcane Focus

HABILIDADES DE PRODUÇÃO (CRAFTING)
Blacksmithy (Ferraria)

Criar armaduras e armas de metal
Reparar equipamentos
Requer forge e martelo
Exceptional items: +20% qualidade em 100.0

Tailoring (Alfaiataria)

Roupas e armaduras de couro/cloth
Tingir roupas
Requer loom para bolts of cloth

Carpentry (Carpintaria)

Arcos, móveis, barcos
Construir casas (plots pré-definidos)
Requer carpentry tools

Bowcraft/Fletching (Criar Arcos/Flechas)

Arcos, crossbows, flechas
Arrows mágicas (em combo com imbuing)

Tinkering (Engenhoca/Inventor)

Criar ferramentas, joias, golems
Unlock chests (lockpicking alternative)
Requer tinker tools

Alchemy (Alquimia)

Poções: Heal, Cure, Poison, Explosivas
Requer mortar & pestle
Greater potions em 100.0

Cooking (Culinária)

Comida que restaura stamina/food meter
Requer oven ou campfire

Inscription (Inscrição)

Scrolls de magia
Spellbooks
Requer blank scrolls

Cartography (Cartografia)

Mapas do tesouro
Treasure maps (T1-T7)
Requer mapmaker's pen

HABILIDADES DE COLETA (GATHERING)
Mining (Mineração)

Extrair minérios: Iron, Dullite, Shadow, Copper, Bronze, Gold, Agapite, Verite, Valorite
Requer pickaxe
Ore spots regeneram com tempo

Lumberjacking (Lenhador)

Cortar árvores para madeira
Tipos: Normal, Oak, Ash, Yew, Heartwood, Bloodwood, Frostwood
Requer axe
Bonus de dano com axes em combate

Fishing (Pesca)

Pescar peixes e treasure (SOS bottles)
Peixes especiais em águas profundas
Big fish contests

HABILIDADES DE EXPLORAÇÃO
Tracking (Rastrear)

Ver criaturas no mini-mapa
Essencial para rangers/hunters
Range aumenta com skill

Detecting Hidden (Detectar Ocultos)

Revelar jogadores/NPCs escondidos
Counter para Stealth/Hiding

Hiding (Esconder-se)

Ficar invisível (stealth mode)
Quebra ao se mover (sem Stealth skill)

Stealth (Furtividade)

Mover-se enquanto escondido
Passos permitidos aumentam com skill
Requer Hiding em 80.0+

Lockpicking (Abrir Fechaduras)

Abrir baús trancados
Dungeons e treasure maps
Requer lockpicks

Remove Trap (Remover Armadilhas)

Desarmar armadilhas em baús
Evitar dano de explosion/poison

Snooping (Bisbilhotar)

Ver backpack de outros jogadores
Requerido para Stealing

Stealing (Roubar)

Roubar items de outros jogadores/NPCs
Ganhar flag criminal
Skill icônica dos thieves

HABILIDADES SOCIAIS/UTILIDADE
Animal Taming (Domar Animais)

Domar criaturas como pets
Pets: Horses, Dragons, Nightmares, Cu Sidhe
Extremamente difícil: White Wyrm requer 100.0

Animal Lore (Conhecimento Animal)

Ver stats dos animais
Necessário para treinar pets
Synergy com Taming

Veterinary (Veterinária)

Curar pets domados
Requer bandages
Equivalente a Healing para animais

Herding (Pastoreio)

Controlar movimento de animais
Pouco usado (skill "dead")

Begging (Mendigar)

Pedir ouro a NPCs
Pouco efetivo (skill roleplay)

Peacemaking (Pacificação - Bardo)

Pacificar criaturas hostis
AoE effect
Requer instrumento musical

Provocation (Provocação - Bardo)

Fazer monstros atacarem uns aos outros
Skill PvM mais poderosa
Requer instrumento

Discordance (Discordância - Bardo)

Debuff em criaturas (lower stats)
Stacks com outras debuffs
Requer instrumento

Musicianship (Música)

Requerida para todas skills de Bardo
Afeta sucesso de Peace/Provo/Discord
Requer instrumento

Healing (Curar)

Curar com bandages
Cura poison (com Anatomy 60+)
Essencial para warriors

Forensic Evaluation (Avaliação Forense)

Ver quem matou um corpo
Detectar veneno
Skill investigativa (pouco usada)

Taste Identification (Identificar Sabor)

Detectar veneno em comida
Synergy com Cooking
Skill pouco popular

Arms Lore (Conhecimento de Armas)

Ver durabilidade e qualidade de armas/armaduras
Ajuda em crafting
Bonus para smiths

Item Identification (Identificar Item)

Identificar itens mágicos
Obsoleta: Substituída por auto-identify

Camping (Acampar)

Criar acampamentos seguros
Logout instantâneo
Requer kindling

Imbuing (Imbuir - expansão SA)

Adicionar propriedades mágicas a items
Crafting avançado de mágicas

Mysticism (Misticismo - expansão SA)

Nova escola de magia
Teleports, summons, buffs únicos

Throwing (Arremesso - expansão SA)

Armas arremessáveis (boomerangs, etc)
Nova linha de combate ranged


5. SISTEMA DE MAGIAS
5.1 Magery - 8 Círculos (64 Magias)
CIRCLE 1 (Mana: 4-6)

Clumsy - Reduz Dex do alvo (-10)
Create Food - Cria comida
Feeblemind - Reduz Int do alvo (-10)
Heal - Cura pequena (10-20 HP)
Magic Arrow - Dano mágico pequeno (10-15)
Night Sight - Visão noturna
Reactive Armor - Reflete dano físico
Weaken - Reduz Str do alvo (-10)

Reagentes comuns: Black Pearl, Bloodmoss, Garlic, Ginseng, Mandrake Root, Nightshade, Spider Silk, Sulfurous Ash
CIRCLE 2 (Mana: 6-9)

Agility - Aumenta Dex (+10)
Cunning - Aumenta Int (+10)
Cure - Remove poison (Lesser/Normal)
Harm - Dano médio (20-30)
Magic Trap - Armadilha em container
Magic Untrap - Remove traps
Protection - Reduz dano físico mas aumenta casting time
Strength - Aumenta Str (+10)

CIRCLE 3 (Mana: 9-11)

Bless - Aumenta todos stats (+10)
Fireball - Dano de fogo AoE pequeno (30-50)
Magic Lock - Tranca containers/portas
Poison - Envenena alvo (level 2)
Telekinesis - Manipular objetos remotamente
Teleport - Teleporte curta distância (linha de visão)
Unlock - Destrava containers
Wall of Stone - Cria parede temporária

CIRCLE 4 (Mana: 11-14)

Arch Cure - Cure em área
Arch Protection - Protection em área
Curse - Reduz todos stats do alvo (-10)
Fire Field - Campo de fogo (DoT area denial)
Greater Heal - Cura grande (40-60 HP)
Lightning - Dano elétrico alto (40-60)
Mana Drain - Drena mana do alvo
Recall - Teleporte para rune marcado

CIRCLE 5 (Mana: 14-20)

Blade Spirits - Invoca espíritos de lâmina (summon ofensivo)
Dispel Field - Remove campos mágicos
Incognito - Disfarce (muda aparência)
Magic Reflection - Reflete próximas magias
Mind Blast - Dano baseado em diferença de Int (especial para tanks)
Paralyze - Paralisa alvo (2-3 segundos)
Poison Field - Campo de veneno
Summon Creature - Invoca criatura aleatória

CIRCLE 6 (Mana: 20-40)

Dispel - Banir summons
Energy Bolt - Dano puro alto (50-70)
Explosion - Dano massivo em área (60-80)
Invisibility - Ficar invisível
Mark - Marcar rune para Recall/Gate
Mass Curse - Curse em área
Paralyze Field - Campo de paralisia
Reveal - Revelar invisíveis em área

CIRCLE 7 (Mana: 40-50)

Chain Lightning - Lightning em alvos múltiplos (4 targets)
Energy Field - Campo de energia (mais forte que fire)
Flamestrike - Dano de fogo massivo (70-90)
Gate Travel - Portal para rune marcado (permite seguir)
Mana Vampire - Drena mana e transfere para caster
Mass Dispel - Dispel em área
Meteor Swarm - Meteoros em área (múltiplos hits)
Polymorph - Transforma em criatura (cosmético/stats)

CIRCLE 8 (Mana: 50-70)

Earthquake - Dano AoE massivo (80-100 todos ao redor)
Energy Vortex - Summon mais poderoso (ataca tudo)
Resurrection - Ressuscitar jogador morto
Air Elemental - Invoca Air Elemental (controlável)
Summon Daemon - Invoca Daemon (mais forte summon)
Earth Elemental - Invoca Earth Elemental
Fire Elemental - Invoca Fire Elemental
Water Elemental - Invoca Water Elemental

5.2 Necromancy (17 Magias - Expansão AoS)
Reagentes: Daemon Blood, Nox Crystal, Grave Dust, Pig Iron

Animate Dead - Ressuscita cadáver como minion
Blood Oath - Dano refletido entre caster e alvo
Corpse Skin - Reduz resistências do alvo
Curse Weapon - Arma drena vida
Evil Omen - Próximo spell causa critical
Horrific Beast - Transforma em monstro (+stats físicos)
Lich Form - Forma de Lich (+mana, -life regen)
Mind Rot - Reduz mana e Lower Mana Cost
Pain Spike - Dano baseado no HP missing do alvo
Poison Strike - Dano + poison instant
Strangle - DoT que drena gradualmente
Summon Familiar - Pet permanente (escolhe tipo)
Vampiric Embrace - Forma vampírica (leech, fraqueza a fire)
Vengeful Spirit - Fantasma que ataca o alvo
Wither - AoE damage over time
Wraith Form - Intangível (evade físico, +spell damage)
Exorcism - Banir undead/summons

5.3 Chivalry (10 Magias - Paladino)
Requer: Tithing Points (doados em altares)

Cleanse by Fire - Remove curse/poison com fogo
Close Wounds - Heal pequeno
Consecrate Weapon - Arma causa dano elemental do tipo fraco do inimigo
Dispel Evil - Bonus vs undead/daemons
Divine Fury - Attack speed e casting +10%
Enemy of One - +50% dano vs um tipo de criatura (penalidade em outros)
Holy Light - AoE damage vs undead/daemons
Noble Sacrifice - Transfere HP para ressuscitar aliado
Remove Curse - Limpa debuffs
Sacred Journey - Recall sagrado (versão Chivalry)

5.4 Spellweaving (16 Magias - Élfica)
Requer: Arcane Focus (ritual com múltiplos casters)

Arcane Circle - Cria círculo para ritual
Gift of Renewal - HoT (Heal over Time)
Immolating Weapon - Arma causa fire damage
Attunement - Regenera mana
Thunderstorm - Lightning storm AoE
Nature's Fury - Summon treant
Summon Fey - Summon pixie helper
Summon Fiend - Summon daemon
Reaper Form - Forma ceifador (leech + AoE)
Wildfire - Firewall móvel
Essence of Wind - Transform em vento (speed + evasion)
Ethereal Voyage - Teleporte longo
Word of Death - Execute (instant kill < 25% HP)
Gift of Life - Ressuscita sem penalidade
Arcane Empowerment - Buff massivo de spell damage
Dryad Allure - Charm criaturas


6. MECÂNICAS DE GAMEPLAY
6.1 Sistema de Combate
Hit Chance Formula:
Base Hit Chance = (Attacker Weapon Skill + Tactics) / 2
Defender Dodge = (Defender Weapon Skill + Tactics + Parry) / 2
Final Hit % = Max(0, Min(95, 50 + (Attacker - Defender) * 2))
Damage Formula:
Base Damage = Weapon Damage Range
Bonus Damage = (Str / 5) + (Tactics / 10) + (Anatomy / 10)
Final Damage = Base + Bonus - Armor Absorption
Armor Absorption:

Cada peça de armadura reduz dano
AR (Armor Rating): 0-100+ (plate completo ~60 AR)
Redução: ~0.5 dano por ponto de AR

Casting Mechanics:

Cast Time: Baseado no círculo da magia
Interruption: Dano durante cast cancela magia
Fizzle: Falha se skill muito baixa
Reagentes: Consumidos ao cast (não em fizzle)

6.2 Sistema de Status
HP (Hit Points):
HP = (Str / 2) + 50
Regeneração: 1 HP a cada 5 segundos (base)
+ Healing skill aumenta regen
+ Meditation não funciona em armor pesado
Mana:
Mana = Int
Regeneração: Depende de Meditation skill
100 Meditation = Full mana em ~10 seg (sem armor)
Armor de metal: Penalidade severa em regen
Stamina:
Stamina = Dex
Usado para: Special moves, run (correr constante drena)
Regeneração: Rápida quando parado
Stats Caps:

Str/Dex/Int: 100 cada (expansível)
Total stats cap: 225 (expansível para 255+)

6.3 Sistema de Items e Loot
Qualidade de Items:

Normal - Stats base
Exceptional - +20-30% stats (craftado com 100 skill)
Magic - Propriedades mágicas aleatórias
Artifact - Items únicos de bosses

Durabilidade:

Todos items têm durabilidade
0 durability = item quebra
Reparável com Blacksmithy/Tailoring
Cada repair reduz Max Durability

Sistema de Propriedades Mágicas:
Armas:

Damage Increase (DI) - +% dano
Hit Chance Increase (HCI) - +% acerto
Swing Speed Increase (SSI) - +% velocidade
Hit Spell (Lightning, Fireball, etc) - Proc mágico
Slayers - +300% dano vs tipo específico (Dragon Slayer, Undead Slayer, etc)

Armaduras:

Defense Chance Increase (DCI) - +% evasão
Resistances (Physical, Fire, Cold, Poison, Energy) - 0-70% cada
Lower Mana Cost (LMC) - Reduz custo de mana
Mana Regeneration - +regen
Luck - +chance de loot melhor

Joias:

Stat bonuses (Str/Dex/Int)
Skill bonuses (+Magery, +Swords, etc)
Regeneration (HP/Mana/Stam)

6.4 Sistema de Housing (Casas)
Tipos de Casas:

Small (7x7 tiles)
Medium (10x10)
Large (15x15)
Castles (28x28 - raríssimo)
Custom houses (design próprio)

Mecânicas:

Plots fixos no mapa
Primeira pessoa a colocar sign = dono
Decay: 30 dias sem login = casa cai
Secure containers (guardar items com segurança)
Lockdowns (decorar objetos)
Vendors (NPCs vendedores player-run)

6.5 Sistema de Karma e Fame
Fame:

Reputação positiva (0-15000)
Ganho: Matar monstros, completar quests
Títulos: Unknown → Known → Famous → Renowned → Illustrious → Lord/Lady

Karma:

Alinhamento moral (-15000 a +15000)
Positivo: Matar evil creatures, doar a beggars
Negativo: Matar innocents, roubar, murder

Murder System:

Matar jogador "blue" (innocent) = murder count
5+ murder counts = Red (murderer/PK)
Reds: Atacáveis por qualquer um, não pode entrar guard zones
Murder counts decaem: 8 horas de gameplay por count

6.6 Sistema de Guilds
Guild Mechanics:

Criar guild: 40,000 gold
Guild Stone em casa
Guild Master = controle total
Ranks customizáveis
Guild wars (PvP declarado entre guilds)
Alliances (multi-guild)

Tipos de Guild:

Standard (PvM/social)
Order (anti-PK)
Chaos (PK guild)

6.7 Sistema de Pets (Animal Taming)
Taming Difficulty:

Depende da criatura
White Wyrm: 96.0 skill (extremamente difícil)
Nightmare: 95.0
Dragon: 93.0
Horse: 30.0

Pet Control Slots:

Jogador tem 5 control slots
Dragon = 4 slots
Cu Sidhe = 4 slots
Horse = 1 slot
Greater Dragon = 5 slots (apenas 1 por vez)

Pet Training:

Pets ganham XP matando
Level up aumenta stats
Veterinary para curar
Animal Lore para ver potential

Pet Commands:

All Follow Me
All Kill [target]
All Guard Me
All Stay
All Stop


7. CRIATURAS E MONSTROS
7.1 Categorias de Monstros
TIER 1 - Iniciantes (Fame: 0-2000)
Mongbat

HP: 20-30
Damage: 2-5
Skills: Wrestling 40, Tactics 30
Loot: 10-50 gold, couro
Local: Wrong dungeon, florestas

Orc

HP: 50-80
Damage: 5-10
Skills: Mace 50, Tactics 40
Loot: 50-150 gold, orcish equipment
Local: Orc fort, Wrong

Rat/Giant Rat

HP: 10-20
Damage: 2-4
Poison: Level 1 (raro)
Loot: 1-10 gold
Local: Sewers, dungeons

Slime

HP: 20-35
Damage: 3-6
Poison: Level 2
Loot: Pouca gold
Local: Dungeons úmidos

TIER 2 - Intermediários (Fame: 2000-6000)
Ettin

HP: 150-200
Damage: 10-20
Skills: Mace 70, Tactics 60
Loot: 200-400 gold, gems
Local: Despise, montanhas

Harpy

HP: 80-120
Damage: 8-15
Skills: Wrestling 60, Magery 50
Magias: Lightning, Magic Arrow
Loot: 100-300 gold, reagents

Gargoyle

HP: 200-300
Damage: 15-25
Skills: Wrestling 80, Tactics 70
Resistência: Alta defesa física
Loot: 300-600 gold, granite

Earth Elemental

HP: 250-350
Damage: 20-30
Skills: Wrestling 85, Tactics 75
Resistência: Fire fraco, Physical forte
Loot: Iron ore, gems

TIER 3 - Avançados (Fame: 6000-12000)
Lich

HP: 300-400
Damage: 15-25 (físico) + magias
Skills: Wrestling 70, Magery 90, Resist 75
Magias: Flamestrike, Lightning, Poison, Energy Bolt
Loot: 500-1000 gold, magic items, reagents, necro reagents
Local: Deceit, cemitérios

Drake (Dragão menor)

HP: 400-600
Damage: 25-40
Skills: Wrestling 85, Tactics 80
Breath: Fire (30-50 damage)
Loot: 1000-2000 gold, scales, gems
Local: Destard (upper levels)

Daemon

HP: 500-700
Damage: 30-45
Skills: Wrestling 90, Magery 95, Resist 80
Magias: Energy Vortex, Meteor Swarm, Flamestrike
Loot: 1500-3000 gold, daemon bone, magic weapons
Local: Hythloth, Fire dungeon

Ogre Lord

HP: 600-800
Damage: 35-50
Skills: Mace 95, Tactics 90
Regeneração: Alta
Loot: 2000-4000 gold, ogre's club (raro)

TIER 4 - Elite (Fame: 12000+)
Dragon

HP: 800-1200
Damage: 40-60
Skills: Wrestling 95, Tactics 95, Resist 85
Breath: Fire (50-80 damage) AoE
Loot: 3000-6000 gold, dragon scales, magic items, gems
Tameable: 93.0 Animal Taming
Local: Destard (deep), Ice dungeon

Ancient Wyrm

HP: 1000-1500
Damage: 50-70
Skills: Wrestling 100, Tactics 100, Resist 95
Breath: Fire (70-100 damage) longo alcance
Loot: 5000-10000 gold, rare gems, artifacts
Local: Destard (bottom level)

Balron (Greater Daemon)

HP: 1200-1800
Damage: 50-80
Skills: Wrestling 100, Magery 100, Resist 100
Magias: Todas 8th circle + summons
Dispel: Pode dispel player summons
Loot: 5000-12000 gold, rare magic items, balron bone
Local: Hythloth (bottom)

Shadow Wyrm (Black Dragon)

HP: 1500-2000
Damage: 60-90
Skills: Wrestling 105, Tactics 105
Breath: Energy (ignora armor)
Poison: Level 4
Loot: 8000-15000 gold, shadow wyrm scale (raro)
Local: Ilshenar deep dungeons

7.2 Boss Creatures (Champion Spawns)
Lord Oaks (Forest boss)

HP: 10,000
Spawn: Pixies → Kirin → Centaurs
Loot: Power scrolls, stat scrolls, artifacts

Rikktor (Ophidian boss)

HP: 12,000
Spawn: Ophidian warriors → Avengers
Loot: Ophidian artifacts

Barracoon (Ratman boss)

HP: 8,000
Spawn: Rats → Ratmen → Ratman mage
Loot: Rat artifacts, power scrolls

Semidar (Undead boss)

HP: 15,000
Spawn: Zombies → Mummies → Liches → Ancient Liches
Loot: Necro artifacts, necro power scrolls

7.3 Sistema de Spawn
Spawn Mechanics:

Monstros respawnam em intervalos
Spawn rate: 30 segundos - 5 minutos
Dungeons têm spawn regions
Over-farming pode exaurir spawn temporariamente

Spawn Levels (Dungeons):

Level 1: Entrance (easy mobs)
Level 2-3: Mid-levels (medium mobs)
Level 4+: Deep (high-level mobs + bosses)


8. ECONOMIA E CRAFTING
8.1 Sistema Econômico
Moeda:

Gold Pieces (GP)
Items stackáveis até 60,000 per slot
Checks bancários para valores altos

Vendors NPCs:

Compram/vendem items
Preços fixos baseados em item type
Restock: Items regeneram periodicamente

Player Vendors:

Colocados em player houses
Preços definidos pelo dono
Comissão diária por vendor

8.2 Crafting Detalhado
Blacksmithy (Ferraria)
Materiais:

Iron Ingots (básico)
Colored Ingots: Dullite, Shadow, Copper, Bronze, Gold, Agapite, Verite, Valorite
Cada metal = +% resistências e durabilidade

Receitas:

Armas: Longsword, Katana, Halberd, War Axe, Mace, War Hammer
Armaduras: Platemail (Helm, Gorget, Arms, Gloves, Legs, Chest, Tunic)
Escudos: Buckler, Bronze Shield, Heater, Metal Shield, Kite Shield

Exceptional Items:

100.0 skill = ~50% chance exceptional
Exceptional = +35% durability, +6 AR (armaduras)

Runic Hammers:

Obtidos via BODs (Bulk Order Deeds)
Permitem craftar items com propriedades mágicas

Tailoring (Alfaiataria)
Materiais:

Cloth (comprado ou feito de cotton)
Leather (de animais domados/mortos)
Spined/Horned/Barbed Leather (de criaturas especiais)

Receitas:

Roupas: Robes, Cloaks, Doublets, Kilts, Skirts
Armaduras de Couro: Leather (Cap, Gorget, Arms, Gloves, Legs, Chest, Skirt)
Armaduras de Studded: Studded Leather (mais AR)

Dyeing:

Dye Tubs para colorir roupas
Cores raras valem fortunas

Alchemy
Poções Base:

Heal Potions

Lesser: 10-20 HP
Normal: 20-30 HP
Greater: 30-50 HP
Cooldown: 10 segundos entre potions


Cure Potions

Lesser: Cura poison nível 1-2
Normal: Nível 1-3
Greater: Nível 1-4


Poison Potions

Lesser: Poison Level 1
Normal: Level 2
Greater: Level 3
Deadly: Level 4
Lethal: Level 5


Explosion Potions

Dano: 20-40 em área pequena
Atraso de 2 segundos
Pode ser refletida


Refresh Potions

Total: Restaura stamina completa


Agility/Strength Potions

+10 ao stat por 2 minutos



8.3 Bulk Order Deeds (BODs)
Sistema:

NPCs dão BODs aleatoriamente
Small BODs: 1 item type (ex: 20 iron longswords)
Large BODs: Múltiplos items (set completo)

Rewards:

Cloth/Leather (hue especial)
Runic tools (para crafting mágico)
Power Scrolls (raro)


9. PvP E FACÇÕES
9.1 Sistema de PvP
Flagging System:
Colors:

Gray (Criminal): Atacou innocent/roubou - 2 minutos
Red (Murderer): 5+ murder counts
Blue (Innocent): Padrão
Orange (Guild War): Inimigo de guild
Green (Guild/Party): Aliado

Consent:

Beneficial acts = consent (heal, buff)
Você fica gray se ajudar criminal/red

Trammel vs Felucca:

Trammel: Apenas consensual PvP
Felucca: PvP livre, +double resources

9.2 Facções (Faction System)
4 Facções:

Minax (Evil)
Shadowlords (Chaos)
Council of Mages (Order)
True Britannians (Good)

Mecânicas:

Captura de towns (control = vendors, buffs)
Faction artifacts (equipment especial)
Kill points (ranking)
Sigils (objetivos de captura)


10. QUESTS E HISTÓRIA
10.1 Lore Principal
Contexto Histórico:

Britannia foi fundada por Lord British (avatar)
8 Virtues governam a moral: Honesty, Compassion, Valor, Justice, Sacrifice, Honor, Spirituality, Humility
Mondain (mago maligno) criou Gem of Immortality
Exodus (computador maligno) ameaçou o mundo
Guardian (entidade dimensional) é antagonista recorrente

Era do UO:

Pós-Ultima 9
Lord British desapareceu
Lord Blackthorn governa
Fragmentação entre Felucca (mundo original) e Trammel (mirror sem PvP)

10.2 Sistema de Quests
Quest Chains Principais:
The Virtue Quests:

Uma quest para cada Virtue
Rewards: Virtue titles, special items

Haven Tutorial:

Intro para novos players
Ensina basics de combate, magic, crafting
Reward: Equipamento inicial

Ancient Wyrm Hunt:

Localizar e matar Ancient Wyrm
Reward: Ancient Wyrm Scale (crafting material raro)

Doom Gauntlet:

Dungeon challenge progressivo
6 boss rooms
Reward: Doom artifacts (uber items)

10.3 Events Mundiais
Invasions:

Cidades invadidas por mobs
Players defendem NPCs
Reward: Special hue items, fame/karma

Holiday Events:

Halloween: Trick-or-Treat, decorações
Christmas: Secret Santa, special gifts
Easter: Egg hunt


11. SISTEMAS SOCIAIS
11.1 Comunicação
Canais de Chat:

Say (local, ~18 tiles)
Whisper (muito próximo)
Yell (range maior)
Guild chat
Party chat
Alliance chat

Emotes:

bow = animação reverência
salute = animação saudar
Sistema completo de emotes

11.2 Trade System
Trade Window:

Arrastar items para janela
Ambos jogadores aceitam
Seguro contra scam

Banking:

Bancos em cada cidade
"bank" = abre bank box (125 items, weight limit)
Seguro (items não dropam ao morrer)


12. SISTEMAS AVANÇADOS
12.1 Runebooks

Armazenam runes marcados (16 por book)
Cast Recall/Gate direto do book
Essencial para transporte

12.2 Refinements e Imbuing
Imbuing:

Adicionar propriedades a items
Usa ingredientes raros
Intensidade baseada em skill

Reforging:

Reroll de propriedades
Runics determinam tier

12.3 Power Scrolls

Dropam de Champion Spawns
Aumentam skill cap: 105, 110, 115, 120
Tradeable/valuable


13. MECÂNICAS TÉCNICAS PARA IMPLEMENTAÇÃO
13.1 Network Protocol
Packet Structure:
[CMD_ID] [Length] [Data...]
Key Packets:

0x80: Login Request
0xBF: General Information
0x20: Character Movement
0x1A/1B: World Item (objects)
0x78: Character Draw

13.2 Save System
Player Data:

Character stats/skills
Inventory
Bank box
House ownership
Quests state
Karma/Fame

World Data:

Item persistence
House decay timers
Spawn timers
Vendor inventories

13.3 Collision & Pathfinding
Tile Properties:

Walkable/Impassable
Height (Z-level)
Surface type (dirt, stone, etc)

A Pathfinding:*

NPCs/Pets navegam automaticamente
Obstáculos dinâmicos (players, items)


14. VISUAL E AUDIO
14.1 Sprite System
Character Sprites:

Body types: Human (Male/Female), Elf, Gargoyle
8 direções
Equipamento sobrepõe body
Animações: Walk, Run, Attack, Cast, Death

14.2 Tile Engine
Layering:
Z-Index Order:
1. Terrain (ground tiles)
2. Static objects (trees, buildings)
3. Items (on ground)
4. Creatures (mobiles)
5. Overhead text
6. Weather effects
14.3 Sound Effects
Combat:

Sword swing: "swish"
Hit flesh: "thump"
Miss: "whoosh"

Magic:

Cada spell tem SFX único
Flamestrike: fogo rugindo
Lightning: trovão

Ambient:

Crickets (noite)
Birds (dia)
Water (perto de rios)
Wind (montanhas)


RESUMO EXECUTIVO PARA DESENVOLVIMENTO
Core Pillars para o Remaster:

Liberdade Total - Sem classes, skill-based progression
Mundo Persistente - Ações têm consequências
Economia Player-Driven - Crafting relevante
Risco/Recompensa - Full loot em Felucca
Comunidade - Guilds, housing, player vendors

Features Essenciais:
✅ Sistema de skills 0-100 (52 skills)
✅ Combate em tempo real (não tab-target)
✅ Sistema de magia completo (64+ spells)
✅ Crafting robusto (8 profissões principais)
✅ Housing system
✅ PvP com flagging system
✅ Taming system com pets
✅ Dungeons com spawn dinâmico
✅ Economia com vendors NPCs e players
✅ Sistema de morte (ghost, resurrection)
Referências Visuais:

Perspectiva: Diablo 1/2 (isométrica)
Estilo: Pixel art detalhado 90s
UI: Janelas draggable medieval style
Animações: 8 direções, frame-by-frame