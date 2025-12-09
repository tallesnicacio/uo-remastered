ULTIMA ONLINE - CONFIGURAÇÃO COMPLETA DE SERVIDOR (ServUO Based)
1. ESTRUTURA DE CONFIGURAÇÃO
1.1 Diretórios Principais
ServUO/
├── Config/                    # Arquivos .cfg (configurações principais)
│   ├── Server.cfg            # Config do servidor (nome, IP, porta)
│   ├── PlayerCaps.cfg        # Caps de skills/stats
│   ├── Account.cfg           # Sistema de contas
│   ├── Housing.cfg           # Sistema de casas
│   ├── Expansion.cfg         # Expansões ativas
│   ├── VetRewards.cfg        # Recompensas por veterania
│   ├── DataPath.cfg          # Caminho dos arquivos do cliente
│   └── ...
├── Scripts/
│   ├── Misc/                 # Scripts gerais
│   │   ├── ServerList.cs    # Nome do shard na lista
│   │   ├── SkillCheck.cs    # Sistema de ganho de skills
│   │   ├── CharacterCreation.cs  # Criação de personagens
│   │   └── MapDefinitions.cs     # Definições de mapas
│   └── Services/
└── Data/

2. ARQUIVOS .CFG PRINCIPAIS
2.1 Server.cfg - Configuração Básica do Servidor
cfg# ==========================================
# IDENTIFICAÇÃO DO SERVIDOR
# ==========================================

# Nome do Shard (aparece na lista de servidores)
Name=My Ultima Server

# Auto-detectar IP público (true/false)
AutoDetect=true

# IP do servidor (deixe vazio para auto-detect)
# Se atrás de roteador, configure port forwarding (TCP 2593)
@Address=

# IP privado (para Docker ou NAT)
@PrivateAddress=

# Porta do servidor
# Default: 2593
@Port=2593

# ==========================================
# MODO DE DEBUG
# ==========================================

# Habilitar modo debug (mais logs, stack traces)
Debug=false

# Habilitar profiler de performance
Profile=false

# ==========================================
# CONFIGURAÇÕES DE REDE
# ==========================================

# Máximo de conexões simultâneas
MaxConnections=256

# Timeout de conexão (milissegundos)
ConnectionTimeout=30000

# Buffer size para rede
BufferSize=4096

2.2 PlayerCaps.cfg - Caps de Skills e Stats
cfg# ==========================================
# CONFIGURAÇÃO DE CAPS - JOGADORES
# ==========================================

# ============ NOVOS CHARS APENAS ============

# Cap individual de cada skill (0.0 - 100.0 base)
# Nota: Valor em décimos (1000 = 100.0)
SkillCap=1000

# Cap total de skills (soma de todas as skills)
# Nota: Valor em décimos (7000 = 700.0 total)
TotalSkillCap=7000

# ============ TODOS OS CHARS ============

# Cap total de stats (Str + Dex + Int)
TotalStatCap=225

# Cap individual de stat (por expansão)
# ML (Mondain's Legacy) = 150 máximo
# Para mudar, edite PlayerMobile.cs:
# Math.Min(base.Str, 150) -> Math.Min(base.Str, XXX)

# ==========================================
# TIPOS DE SERVIDOR COMUNS
# ==========================================

# === CLASSIC ERA (Pre-AOS) ===
# SkillCap=1000
# TotalSkillCap=7000
# TotalStatCap=225

# === RENAISSANCE ===
# SkillCap=1000
# TotalSkillCap=7000
# TotalStatCap=225

# === AOS (Age of Shadows) ===
# SkillCap=1200  (power scrolls para 120)
# TotalSkillCap=7200
# TotalStatCap=225

# === EASY SHARD (Acelerado) ===
# SkillCap=2500  (skills max 250.0)
# TotalSkillCap=25000
# TotalStatCap=500

# === WAR SHARD (PvP Focused) ===
# SkillCap=1000
# TotalSkillCap=7000
# TotalStatCap=300  (mais stats para combate)

# === GOD SHARD (Infinito) ===
# SkillCap=10000
# TotalSkillCap=100000
# TotalStatCap=1000
```

**IMPORTANTE**: Para aplicar mudanças em chars existentes:
```
[global set SkillsCap 18000 where playermobile
[global set StatCap 300 where playermobile

2.3 Account.cfg - Sistema de Contas
cfg# ==========================================
# CONFIGURAÇÃO DE CONTAS
# ==========================================

# Permitir criação automática de contas
# true = qualquer um pode criar conta no login
# false = apenas admin cria contas
AutoAccountCreation=false

# Número máximo de contas por IP
MaxAccountsPerIP=1

# Número de chars por conta
CharactersPerAccount=7

# Idade mínima da conta (em dias) para certas ações
MinAccountAge=0

# Deletar contas inativas após X dias
# 0 = nunca deletar
InactiveDeletion=0

# Requer confirmação de email
RequireEmailConfirmation=false

# ==========================================
# TIPOS DE SERVIDOR
# ==========================================

# === PUBLIC SHARD (Público) ===
# AutoAccountCreation=true
# MaxAccountsPerIP=3
# CharactersPerAccount=7

# === PRIVATE SHARD (Amigos/Família) ===
# AutoAccountCreation=false
# MaxAccountsPerIP=10
# CharactersPerAccount=7

# === DEVELOPMENT SERVER ===
# AutoAccountCreation=true
# MaxAccountsPerIP=999
# CharactersPerAccount=10

2.4 Housing.cfg - Sistema de Casas
cfg# ==========================================
# CONFIGURAÇÃO DE HOUSES
# ==========================================

# Número de casas por conta
AccountHouseLimit=1

# Decay de casas (em dias sem login)
# 0 = sem decay
DecayDelay=30

# Permitir custom houses (design próprio)
AllowCustomHouses=true

# Preço de placement (multiplicador)
# 1.0 = preço normal, 0.5 = metade, 2.0 = dobro
PlacementPrice=1.0

# ==========================================
# TIPOS DE SERVIDOR
# ==========================================

# === CLASSIC (OSI-like) ===
# AccountHouseLimit=1
# DecayDelay=30
# AllowCustomHouses=false

# === EASY SHARD ===
# AccountHouseLimit=5
# DecayDelay=90
# PlacementPrice=0.1

# === WAR SHARD ===
# AccountHouseLimit=1
# DecayDelay=7  (decay rápido)
# PlacementPrice=2.0  (casas caras)

2.5 Expansion.cfg - Controle de Expansões
cfg# ==========================================
# EXPANSÕES ATIVAS
# ==========================================

# Formato: Era=ExpansionName

# Eras disponíveis:
# - None (sem expansões)
# - T2A (The Second Age)
# - UOR (Renaissance)
# - UOTD (Third Dawn)
# - LBR (Lord Blackthorn's Revenge)
# - AOS (Age of Shadows)
# - SE (Samurai Empire)
# - ML (Mondain's Legacy)
# - SA (Stygian Abyss)
# - HS (High Seas)
# - TOL (Time of Legends)
# - EJ (Endless Journey)

# Define qual expansão o servidor usa
CurrentExpansion=TOL

# ==========================================
# TIPOS DE SERVIDOR
# ==========================================

# === CLASSIC ERA (Pre-Trammel) ===
# CurrentExpansion=T2A
# - Sem Trammel
# - PvP livre em todo mundo
# - Skills cap 700
# - Sem Necro/Chivalry/Spellweaving
# - Itens: Sem AOS properties

# === RENAISSANCE ERA ===
# CurrentExpansion=UOR
# - Trammel adicionado (PvE shard)
# - Powerscrolls NÃO existem
# - Skills cap 700
# - Housing em Felucca e Trammel

# === AGE OF SHADOWS (AoS) ===
# CurrentExpansion=AOS
# - Item properties (mágicos)
# - Necromancy e Chivalry
# - Power scrolls (105-120)
# - Skills cap 720
# - Artifacts

# === SAMURAI EMPIRE ===
# CurrentExpansion=SE
# - Bushido e Ninjitsu
# - Mapa Tokuno
# - Ninjas e Samurais

# === MONDAIN'S LEGACY ===
# CurrentExpansion=ML
# - Spellweaving
# - Elven race
# - Stat cap 150 individual

# === FULL MODERN (TOL) ===
# CurrentExpansion=TOL
# - Todas features modernas
# - Mastery system
# - VvV (Vice vs Virtue)

2.6 VetRewards.cfg - Recompensas por Tempo
cfg# ==========================================
# VET REWARDS
# ==========================================

# Habilitar sistema de vet rewards
Enabled=true

# Dias para cada reward tier
# Tier 1 (30 dias), Tier 2 (90 dias), etc
RewardTier1=30
RewardTier2=90
RewardTier3=180
RewardTier4=365
RewardTier5=730

# Bonus de skill cap por antiguidade
# 0 = sem bonus
SkillCapBonus=200

# ==========================================
# TIPOS DE SERVIDOR
# ==========================================

# === FAST PROGRESSION ===
# RewardTier1=1
# RewardTier2=7
# RewardTier3=30
# SkillCapBonus=500

# === DESABILITADO ===
# Enabled=false
# SkillCapBonus=0

3. SCRIPTS DE CONFIGURAÇÃO (.CS)
3.1 SkillCheck.cs - Ganho de Skills
Localização: Scripts/Misc/SkillCheck.cs
csharppublic static void Configure()
{
    // ==========================================
    // SKILL GAIN CONFIGURATION
    // ==========================================
    
    // Cap de stat durante skill gain
    StatCap = Config.Get("PlayerCaps.StatCap", 225);
    
    // Delay entre ganhos de stat (anti-macro)
    m_StatGainDelayEnabled = true;
    m_StatGainDelay = TimeSpan.FromMinutes(15.0);
    
    // Delay para pets
    m_PetStatGainDelayEnabled = true;
    m_PetStatGainDelay = TimeSpan.FromMinutes(5.0);
    
    // Sistema anti-macro ativo?
    AntiMacroCode = true;
    
    // Chance de ganhar stat ao usar skill (%)
    PlayerChanceToGainStats = 5.0;  // 5% chance
    PetChanceToGainStats = 5.0;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === EASY SHARD (Ganho Rápido) ===
    // m_StatGainDelay = TimeSpan.FromMinutes(1.0);
    // AntiMacroCode = false;
    // PlayerChanceToGainStats = 50.0;  // 50%
    
    // === HARD SHARD (Ganho Lento) ===
    // m_StatGainDelay = TimeSpan.FromMinutes(30.0);
    // AntiMacroCode = true;
    // PlayerChanceToGainStats = 1.0;  // 1%
    
    // === WAR SHARD (PvP - Ganho Normal) ===
    // m_StatGainDelay = TimeSpan.FromMinutes(10.0);
    // PlayerChanceToGainStats = 10.0;  // 10%
    
    // === GOD SHARD (Instantâneo) ===
    // AntiMacroCode = false;
    // PlayerChanceToGainStats = 100.0;  // Sempre ganha
}

3.2 ServerList.cs - Nome na Lista de Servidores
Localização: Scripts/Misc/ServerList.cs
csharppublic static void Configure()
{
    // Nome que aparece na lista de servidores do cliente
    Settings.ServerName = "Britannia Remastered";
    
    // Endereço do servidor
    // null = auto-detect
    Settings.Address = null;
    
    // Porta
    Settings.Port = 2593;
    
    // ==========================================
    // EXEMPLOS DE NOMES
    // ==========================================
    
    // === CLASSIC SHARD ===
    // Settings.ServerName = "Classic Britannia - T2A Era";
    
    // === PvP SHARD ===
    // Settings.ServerName = "[WAR] Felucca Battles - FFA PvP";
    
    // === RP SHARD ===
    // Settings.ServerName = "Britannia Roleplay - Heavy RP";
    
    // === EASY SHARD ===
    // Settings.ServerName = "EasyUO - x10 Rates";
    
    // === HARD SHARD ===
    // Settings.ServerName = "Hardcore Britannia - Permadeath";
}

3.3 CharacterCreation.cs - Criação de Personagens
Localização: Scripts/Misc/CharacterCreation.cs
csharpprivate static void SetStats(PlayerMobile m, SkillNameValue[] skills)
{
    // ==========================================
    // STATS INICIAIS
    // ==========================================
    
    m.Str = 45;  // Força inicial
    m.Dex = 35;  // Destreza inicial
    m.Int = 35;  // Inteligência inicial
    
    // ==========================================
    // SKILLS INICIAIS
    // ==========================================
    
    // Total de pontos para distribuir nas skills escolhidas
    int totalSkillPoints = 700;  // 70.0 total
    
    // Skills iniciais específicas
    foreach (SkillNameValue snv in skills)
    {
        Skill skill = m.Skills[snv.Name];
        
        if (skill != null)
        {
            skill.BaseFixedPoint = snv.Value;
        }
    }
    
    // ==========================================
    // ITEMS INICIAIS
    // ==========================================
    
    // Ouro inicial
    BankBox bank = m.BankBox;
    if (bank != null)
    {
        bank.DropItem(new Gold(1000));  // 1000 gold
    }
    
    // Items no backpack
    Container pack = m.Backpack;
    if (pack != null)
    {
        // Reagentes iniciais
        pack.DropItem(new BlackPearl(50));
        pack.DropItem(new Bloodmoss(50));
        pack.DropItem(new Garlic(50));
        pack.DropItem(new Ginseng(50));
        pack.DropItem(new MandrakeRoot(50));
        pack.DropItem(new Nightshade(50));
        pack.DropItem(new SulfurousAsh(50));
        pack.DropItem(new SpidersSilk(50));
        
        // Bandages
        pack.DropItem(new Bandage(100));
        
        // Comida
        pack.DropItem(new Bread(10));
    }
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === EASY SHARD (Start Acelerado) ===
    // m.Str = 100;
    // m.Dex = 100;
    // m.Int = 100;
    // totalSkillPoints = 5000;  // 500.0 total
    // bank.DropItem(new Gold(1000000));
    // // Equipamento inicial completo (plate armor, weapon, etc)
    
    // === HARD SHARD (Start Difícil) ===
    // m.Str = 25;
    // m.Dex = 25;
    // m.Int = 25;
    // totalSkillPoints = 300;  // 30.0 total
    // bank.DropItem(new Gold(100));
    // // Poucos items iniciais
    
    // === WAR SHARD (PvP Pronto) ===
    // m.Str = 80;
    // m.Dex = 80;
    // m.Int = 80;
    // totalSkillPoints = 5000;
    // // Full PvP gear inicial
    
    // === CLASSIC OSI ===
    // m.Str = 45;
    // m.Dex = 35;
    // m.Int = 35;
    // totalSkillPoints = 700;
    // bank.DropItem(new Gold(1000));
}

4. CONFIGURAÇÕES DE COMBATE E MAGIA
4.1 Reagents System
Arquivo: Scripts/Services/Spellcasting/SpellHelper.cs
csharppublic class SpellHelper
{
    // Requer reagentes para cast?
    public static bool RequireReagents = true;
    
    // Consumir reagentes mesmo em fizzle (falha)?
    public static bool ConsumeReagentsOnFizzle = false;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === NO REAGENTS (Easy/War Shard) ===
    // RequireReagents = false;
    
    // === HARDCORE (Hard Shard) ===
    // RequireReagents = true;
    // ConsumeReagentsOnFizzle = true;
    
    // === CLASSIC OSI ===
    // RequireReagents = true;
    // ConsumeReagentsOnFizzle = false;
}

4.2 Combat Configuration
Arquivo: Scripts/Misc/CombatConfig.cs (criar se não existe)
csharppublic static class CombatConfig
{
    // ==========================================
    // DAMAGE SCALING
    // ==========================================
    
    // Multiplicador de dano PvM (Player vs Monster)
    public static double PvMDamageScalar = 1.0;
    
    // Multiplicador de dano PvP (Player vs Player)
    public static double PvPDamageScalar = 1.0;
    
    // ==========================================
    // HIT CHANCE
    // ==========================================
    
    // Chance base de acerto
    public static int BaseHitChance = 50;
    
    // Chance máxima de acerto
    public static int MaxHitChance = 95;
    
    // Chance mínima de acerto
    public static int MinHitChance = 5;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === EASY SHARD ===
    // PvMDamageScalar = 2.0;  // Dobro de dano em mobs
    // PvPDamageScalar = 1.0;
    // BaseHitChance = 70;
    
    // === WAR SHARD (Fast PvP) ===
    // PvMDamageScalar = 3.0;  // Matar mobs rápido
    // PvPDamageScalar = 1.5;  // PvP mais letal
    // MaxHitChance = 98;
    
    // === HARD SHARD ===
    // PvMDamageScalar = 0.5;  // Metade de dano
    // PvPDamageScalar = 0.75;
    // BaseHitChance = 30;
    
    // === CLASSIC ===
    // PvMDamageScalar = 1.0;
    // PvPDamageScalar = 1.0;
    // BaseHitChance = 50;
}

5. LOOT E RECURSOS
5.1 Loot Configuration
Arquivo: Scripts/Services/Loot/LootConfig.cs
csharppublic static class LootConfig
{
    // Multiplicador de gold drop
    public static double GoldMultiplier = 1.0;
    
    // Multiplicador de item mágico
    public static double MagicItemChance = 1.0;
    
    // Multiplicador de quantidade de items
    public static double ItemAmountMultiplier = 1.0;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === EASY SHARD (High Rates) ===
    // GoldMultiplier = 10.0;  // 10x gold
    // MagicItemChance = 5.0;  // 5x chance de mágico
    // ItemAmountMultiplier = 3.0;
    
    // === HARD SHARD (Low Rates) ===
    // GoldMultiplier = 0.25;  // 25% gold
    // MagicItemChance = 0.1;  // 10% chance
    // ItemAmountMultiplier = 0.5;
    
    // === WAR SHARD ===
    // GoldMultiplier = 5.0;
    // MagicItemChance = 10.0;  // Muito loot para PvP
    
    // === CLASSIC ===
    // GoldMultiplier = 1.0;
    // MagicItemChance = 1.0;
    // ItemAmountMultiplier = 1.0;
}

5.2 Resource Gathering
Arquivo: Scripts/Services/Harvest/HarvestConfig.cs
csharppublic static class HarvestConfig
{
    // ==========================================
    // MINING
    // ==========================================
    
    // Multiplicador de ore por hit
    public static double OreAmountMultiplier = 1.0;
    
    // Chance de ore colorido
    public static double ColoredOreChance = 1.0;
    
    // ==========================================
    // LUMBERJACKING
    // ==========================================
    
    // Multiplicador de logs
    public static double LogAmountMultiplier = 1.0;
    
    // Chance de colored logs
    public static double ColoredLogChance = 1.0;
    
    // ==========================================
    // FISHING
    // ==========================================
    
    // Multiplicador de peixes
    public static double FishAmountMultiplier = 1.0;
    
    // Chance de treasure (SOS, etc)
    public static double TreasureChance = 1.0;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === EASY SHARD ===
    // OreAmountMultiplier = 5.0;
    // ColoredOreChance = 10.0;
    // LogAmountMultiplier = 5.0;
    
    // === HARD SHARD ===
    // OreAmountMultiplier = 0.5;
    // ColoredOreChance = 0.1;
    
    // === CLASSIC ===
    // Tudo 1.0
}

6. ECONOMIA
6.1 Vendor Configuration
Arquivo: Scripts/Services/Vendors/VendorConfig.cs
csharppublic static class VendorConfig
{
    // Multiplicador de preços de compra (player compra do NPC)
    public static double BuyPriceScalar = 1.0;
    
    // Multiplicador de preços de venda (player vende para NPC)
    public static double SellPriceScalar = 1.0;
    
    // Tempo de restock de vendors (minutos)
    public static double RestockDelay = 60.0;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === EASY SHARD ===
    // BuyPriceScalar = 0.1;  // Items 10x mais baratos
    // SellPriceScalar = 10.0;  // Vende por 10x mais
    // RestockDelay = 5.0;  // Restock rápido
    
    // === HARD SHARD ===
    // BuyPriceScalar = 5.0;  // Items muito caros
    // SellPriceScalar = 0.1;  // Vende por pouco
    // RestockDelay = 480.0;  // Restock lento (8 horas)
    
    // === ECONOMY FOCUSED ===
    // BuyPriceScalar = 2.0;
    // SellPriceScalar = 0.5;
    // RestockDelay = 120.0;
}

7. PVP E FACÇÕES
7.1 PvP Rules
Arquivo: Scripts/Misc/PvPConfig.cs
csharppublic static class PvPConfig
{
    // ==========================================
    // MURDER SYSTEM
    // ==========================================
    
    // Murders para ficar red
    public static int MurderCountsForRed = 5;
    
    // Tempo para murder count decair (horas)
    public static double MurderDecayTime = 8.0;
    
    // Murder counts decaem offline?
    public static bool DecayOffline = false;
    
    // ==========================================
    // STAT LOSS (Penalidade para murderers)
    // ==========================================
    
    // Ativar stat loss ao morrer red?
    public static bool StatLossEnabled = true;
    
    // Porcentagem de loss
    public static double StatLossPercent = 0.25;  // 25%
    
    // Duração do stat loss (minutos)
    public static double StatLossDuration = 120.0;  // 2 horas
    
    // ==========================================
    // ITEM LOSS
    // ==========================================
    
    // Blues dropam tudo ao morrer?
    public static bool BlueFullLoot = false;
    
    // Reds dropam tudo ao morrer?
    public static bool RedFullLoot = true;
    
    // Blessed items são droppados?
    public static bool DropBlessedItems = false;
    
    // ==========================================
    // TIPOS DE SERVIDOR
    // ==========================================
    
    // === TRAMMEL (PvE - Sem PvP forçado) ===
    // MurderCountsForRed = 1;  // Primeiro murder = red
    // BlueFullLoot = false;
    // RedFullLoot = false;
    
    // === FELUCCA CLASSIC ===
    // MurderCountsForRed = 5;
    // StatLossEnabled = true;
    // BlueFullLoot = true;
    // RedFullLoot = true;
    
    // === WAR SHARD (Hardcore PvP) ===
    // MurderCountsForRed = 999;  // Nunca fica red
    // StatLossEnabled = false;
    // BlueFullLoot = true;
    // RedFullLoot = true;
    // DropBlessedItems = true;  // Tudo dropa!
    
    // === EASY SHARD (Casual) ===
    // MurderCountsForRed = 20;
    // StatLossEnabled = false;
    // BlueFullLoot = false;
    // RedFullLoot = false;
}

8. CONFIGURAÇÕES AVANÇADAS
8.1 Skill Gain Rate
Sistema de Aceleração de Skills
csharp// Em Scripts/Misc/SkillGain.cs

public class SkillGain
{
    // Multiplicador de ganho de skill
    // 1.0 = OSI rates, 2.0 = dobro, 10.0 = 10x
    public static double SkillGainMultiplier = 1.0;
    
    // Chance base de ganho (%)
    public static double BaseGainChance = 2.0;
    
    // ==========================================
    // SKILL GAIN POR DIFICULDADE
    // ==========================================
    
    public static double GetSkillGainRate(Skill skill)
    {
        // Ganho diferenciado por skill
        switch (skill.SkillName)
        {
            // Combat skills ganham mais rápido
            case SkillName.Swords:
            case SkillName.Macing:
            case SkillName.Fencing:
            case SkillName.Wrestling:
            case SkillName.Archery:
                return SkillGainMultiplier * 1.5;
            
            // Magic skills ganham normal
            case SkillName.Magery:
            case SkillName.Necromancy:
            case SkillName.Chivalry:
                return SkillGainMultiplier * 1.0;
            
            // Crafting skills ganham mais lento
            case SkillName.Blacksmith:
            case SkillName.Tailoring:
            case SkillName.Carpentry:
                return SkillGainMultiplier * 0.75;
            
            // Taming MUITO lento
            case SkillName.AnimalTaming:
                return SkillGainMultiplier * 0.25;
            
            default:
                return SkillGainMultiplier * 1.0;
        }
    }
    
    // ==========================================
    // PRESETS
    // ==========================================
    
    // === INSTANT SHARD (God Mode) ===
    // SkillGainMultiplier = 1000.0;
    // BaseGainChance = 100.0;
    
    // === EASY SHARD (10x) ===
    // SkillGainMultiplier = 10.0;
    // BaseGainChance = 20.0;
    
    // === MODERATE (2-3x) ===
    // SkillGainMultiplier = 2.5;
    // BaseGainChance = 5.0;
    
    // === CLASSIC OSI (1x) ===
    // SkillGainMultiplier = 1.0;
    // BaseGainChance = 2.0;
    
    // === HARD SHARD (0.5x) ===
    // SkillGainMultiplier = 0.5;
    // BaseGainChance = 1.0;
}

9. EXEMPLOS DE CONFIGURAÇÃO COMPLETA
9.1 WAR SHARD (PvP Hardcore)
cfg# PlayerCaps.cfg
SkillCap=1200
TotalSkillCap=7200
TotalStatCap=300

# Account.cfg
AutoAccountCreation=true
MaxAccountsPerIP=3
CharactersPerAccount=7

# Housing.cfg
AccountHouseLimit=1
DecayDelay=7
PlacementPrice=2.0

# Server.cfg
Name=[WAR] Felucca Reborn - Hardcore PvP

# Expansion.cfg
CurrentExpansion=AOS
csharp// CharacterCreation.cs
m.Str = 100;
m.Dex = 100;
m.Int = 25;
totalSkillPoints = 5000;  // 500.0 total
bank.DropItem(new Gold(100000));
// Equipamento PvP completo inicial

// CombatConfig.cs
PvMDamageScalar = 5.0;  // Matar mobs muito rápido
PvPDamageScalar = 1.5;  // PvP mais letal

// SkillGain.cs
SkillGainMultiplier = 20.0;  // Skills sobem rápido

// PvPConfig.cs
MurderCountsForRed = 999;  // Nunca fica red
StatLossEnabled = false;
BlueFullLoot = true;
RedFullLoot = true;

// LootConfig.cs
GoldMultiplier = 20.0;
MagicItemChance = 50.0;

// SpellHelper.cs
RequireReagents = false;  // Sem reagentes

9.2 EASY SHARD (Acelerado/Casual)
cfg# PlayerCaps.cfg
SkillCap=2500
TotalSkillCap=25000
TotalStatCap=500

# Account.cfg
AutoAccountCreation=true
MaxAccountsPerIP=5
CharactersPerAccount=10

# Housing.cfg
AccountHouseLimit=5
DecayDelay=90
PlacementPrice=0.1

# Server.cfg
Name=EasyUO - 10x Rates - Casual Fun

# Expansion.cfg
CurrentExpansion=TOL
csharp// CharacterCreation.cs
m.Str = 100;
m.Dex = 100;
m.Int = 100;
totalSkillPoints = 5000;
bank.DropItem(new Gold(5000000));
// Muitos items iniciais

// CombatConfig.cs
PvMDamageScalar = 3.0;
BaseHitChance = 80;

// SkillGain.cs
SkillGainMultiplier = 10.0;

// PvPConfig.cs
BlueFullLoot = false;
RedFullLoot = false;
StatLossEnabled = false;

// LootConfig.cs
GoldMultiplier = 10.0;
MagicItemChance = 20.0;

// HarvestConfig.cs
OreAmountMultiplier = 10.0;
ColoredOreChance = 50.0;

// VendorConfig.cs
BuyPriceScalar = 0.1;
SellPriceScalar = 10.0;

// SpellHelper.cs
RequireReagents = false;

9.3 HARD SHARD (Hardcore/Survival)
cfg# PlayerCaps.cfg
SkillCap=1000
TotalSkillCap=7000
TotalStatCap=225

# Account.cfg
AutoAccountCreation=false
MaxAccountsPerIP=1
CharactersPerAccount=3

# Housing.cfg
AccountHouseLimit=1
DecayDelay=14
PlacementPrice=5.0

# Server.cfg
Name=Hardcore Britannia - Permadeath Mode

# Expansion.cfg
CurrentExpansion=UOR
csharp// CharacterCreation.cs
m.Str = 25;
m.Dex = 25;
m.Int = 25;
totalSkillPoints = 300;
bank.DropItem(new Gold(100));
// Quase nenhum item inicial

// CombatConfig.cs
PvMDamageScalar = 0.5;
PvPDamageScalar = 2.0;  // PvP muito letal
BaseHitChance = 30;

// SkillGain.cs
SkillGainMultiplier = 0.25;  // 4x mais lento

// PvPConfig.cs
MurderCountsForRed = 3;
StatLossEnabled = true;
StatLossPercent = 0.50;  // 50% loss
BlueFullLoot = true;
RedFullLoot = true;

// LootConfig.cs
GoldMultiplier = 0.1;
MagicItemChance = 0.01;

// HarvestConfig.cs
OreAmountMultiplier = 0.25;

// VendorConfig.cs
BuyPriceScalar = 10.0;
SellPriceScalar = 0.05;

// SpellHelper.cs
RequireReagents = true;
ConsumeReagentsOnFizzle = true;

9.4 CLASSIC OSI (Autêntico)
cfg# PlayerCaps.cfg
SkillCap=1000
TotalSkillCap=7000
TotalStatCap=225

# Account.cfg
AutoAccountCreation=false
MaxAccountsPerIP=1
CharactersPerAccount=5

# Housing.cfg
AccountHouseLimit=1
DecayDelay=30
PlacementPrice=1.0

# Server.cfg
Name=Classic Britannia - T2A Era

# Expansion.cfg
CurrentExpansion=T2A
csharp// Tudo em valores default OSI (1.0)
// CharacterCreation.cs = stats 45/35/35
// SkillGainMultiplier = 1.0
// Todos scalars = 1.0
// RequireReagents = true
// BlueFullLoot = true (Felucca)
// StatLossEnabled = true
```

---

## 10. COMANDOS ADMINISTRATIVOS ÚTEIS
```
# Aplicar configs em chars existentes
[global set SkillsCap 18000 where playermobile
[global set StatCap 300 where playermobile

# Gerar mundo
[createworld

# Spawnar decorações
[decorate

# Spawnar NPCs vendors
[generatevendors

# Spawnar mobs
[GenChampions
[GenSpawn

# Teleporters
[GenTeleporter

# Ver propriedades
[props

# Adicionar item a todos players
[online addtopack apple name "Gift" where playermobile

# Broadcast
[broadcast Servidor será reiniciado em 5 minutos!

# Kick all
[kickall

# Save world
[save

RESUMO - QUICK REFERENCE
Tipo de ShardSkill GainLootPvPReagentesStart GoldClassic OSI1x1xFull LootSim1,000Easy/Casual10x10xNo LootNão5,000,000War/PvP20x20xFull LootNão100,000Hard/Hardcore0.25x0.1xFull LootSim100God/Admin1000x100xNo LootNão999,999,999