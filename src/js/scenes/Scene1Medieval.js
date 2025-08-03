/**
 * Scene 1: Medieval Times (1209-1500)
 * Shows the economic "dark ages" - sparse data, slow growth, high volatility
 */

import { ColorPalette } from '../utils/ColorPalette.js';
import { SceneUtils, LayoutConfig } from '../utils/SceneUtils.js';

export class Scene1Medieval {
    // Static flag to track if scene has been rendered before
    static hasBeenRendered = false;
    
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = Scene1Medieval.hasBeenRendered ? 0 : 1000; // No animation on subsequent renders
        
        // Medieval period data (with null safety)
        if (!data || !data.periods || !data.periods.medieval) {
            console.error('❌ Scene1Medieval: Data not loaded yet!', data);
            throw new Error('Data not available for Medieval scene. Please wait for data to load.');
        }
        this.medievalData = data.periods.medieval;
        
        // Chart dimensions - move chart up by reducing top margin, but keep header visible
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 }; // Much larger top margin to make chart 20% shorter
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        console.log(`🏰 Scene 1 Medieval: ${this.medievalData.data.length} years of data`);
    }
    
    render() {
        console.log('🎬 Rendering Scene 1: Medieval Times...');
        
        // Clear any existing content
        this.sceneGroup.selectAll('*').remove();
        
        // Create main group
        this.sceneGroup = this.sceneGroup
            .append('g')
            .attr('class', 'scene-medieval')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Render population chart (most complete data for this period)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add economic structure visualization
        this.addEconomicStructure();
        
        // Mark as rendered to prevent re-animation on subsequent visits
        Scene1Medieval.hasBeenRendered = true;
        
        return this;
    }
    
    renderPopulationChart() {
        console.log('🏰 Medieval data available:', this.medievalData);
        
        // Get both population and GDP data where available
        const populationData = this.medievalData.data
            .filter(d => d.population !== null)
            .map(d => ({ year: d.year, value: d.population, type: 'population' }));
        
        const gdpData = this.medievalData.data
            .filter(d => d.gdpReal !== null)
            .map(d => ({ year: d.year, value: d.gdpReal, type: 'gdp' }));
        
        // Use utility function for chart setup
        SceneUtils.createChartSetup(
            this.sceneGroup,
            this.width,
            this.height,
            populationData,
            gdpData,
            this.animationDuration,
            () => this.renderStagnationStory(),
            (chartConfig) => this.renderTransformationStory(chartConfig)
        );
    }
    
    renderTransformationStory(chartConfig) {
        console.log('📖 Rendering transformation story...');
        
        // Extract configuration from utility
        const { xScale, yScale, chartHeight, primaryData, isPrimaryPopulation } = chartConfig;
        
        // Store scales for use in other methods
        this.xScale = xScale;
        this.yScale = yScale;
        
        // Add axes
        this.addMainAxes(chartHeight, isPrimaryPopulation);
        
        // Render main trend line
        this.renderMainTrendLine(primaryData, isPrimaryPopulation);
        
        // Add interactive story points (historical events)
        this.addInteractiveStoryPoints(isPrimaryPopulation);
    }
    
    addMainAxes(chartHeight, isPrimaryPopulation) {
        SceneUtils.createMainAxes(
            this.sceneGroup, 
            this.width, 
            this.height, 
            chartHeight, 
            this.xScale, 
            this.yScale, 
            isPrimaryPopulation, 
            this.animationDuration
        );
    }
    
    renderMainTrendLine(data, isPrimaryPopulation) {
        SceneUtils.createMainTrendLine(
            this.sceneGroup,
            data,
            this.xScale,
            this.yScale,
            isPrimaryPopulation,
            this.animationDuration,
            (event, d, isPrimaryPopulation) => {
                if (event && d) {
                    this.showEnhancedTooltip(event, d, isPrimaryPopulation);
                } else {
                    this.hideTooltip();
                }
            },
            (event, d, isPrimaryPopulation) => {
                this.showDetailedStory(event, d, isPrimaryPopulation);
            }
        );
    }
    
    addInteractiveStoryPoints(isPrimaryPopulation) {
        // Enhanced medieval historical events with rich storytelling
        const historicalEvents = [
            {
                year: 1215,
                event: 'Magna Carta',
                story: 'The Magna Carta, signed in 1215, established the principle that even the king was subject to the law. This foundational document began the long process of establishing property rights and economic freedoms in England.',
                story2: 'While initially focused on baronial rights, the Magna Carta\'s principles of due process and property protection would eventually extend to all English subjects, creating a more stable environment for economic activity and trade.',
                economicEffect: 'Established property rights and legal protections for merchants and landowners. Reduced arbitrary taxation and confiscation, encouraging investment and trade. Created foundation for English common law.',
                longTermImpact: 'The legal framework established by Magna Carta provided the foundation for England\'s later economic success, ensuring property rights and contract enforcement that enabled market development.',
                y: 180
            },
            {
                year: 1348,
                event: 'Black Death',
                story: 'The Black Death arrived in England in 1348, killing an estimated 30-50% of the population. This catastrophic event had profound economic consequences, creating labor shortages that would transform medieval society.',
                story2: 'With fewer workers available, wages rose dramatically while land values fell. The feudal system began to crumble as peasants gained bargaining power. The economic shock would take generations to recover from, but ultimately accelerated the transition from feudalism to a more market-based economy.',
                economicEffect: 'Population dropped from ~4.5 million to ~2.5 million. Wages increased by 200-300% due to labor shortages. Land values fell by 40-60% as demand collapsed.',
                longTermImpact: 'Labor shortages forced technological innovation and efficiency improvements. The breakdown of feudal relationships accelerated the rise of wage labor and market economies.',
                y: 150
            },
            {
                year: 1381,
                event: 'Peasants\' Revolt',
                story: 'The Peasants\' Revolt of 1381 was the largest popular uprising in medieval England, driven by economic grievances and resentment against poll taxes. Tens of thousands of peasants marched on London demanding economic and social reforms.',
                story2: 'While the revolt was ultimately suppressed, it demonstrated the growing economic power and political consciousness of the peasant class. The government was forced to make concessions, including the abolition of the poll tax and improvements in labor conditions.',
                economicEffect: 'Government abolished poll tax, reducing fiscal pressure on peasants. Labor regulations were relaxed, allowing freer movement of workers. Land rents stabilized as landlords feared further unrest.',
                longTermImpact: 'The revolt marked the beginning of the end of serfdom in England. Peasants gained greater economic freedom and bargaining power, accelerating the transition to wage labor.',
                y: 200
            },
            {
                year: 1453,
                event: 'End of Hundred Years\' War',
                story: 'The end of the Hundred Years\' War in 1453 marked the conclusion of England\'s long military conflict with France. The war had drained English resources and disrupted trade, but its end created new economic opportunities.',
                story2: 'With military spending reduced, resources could be redirected to domestic development. The loss of French territories forced England to focus on internal economic growth and trade with other European nations.',
                economicEffect: 'Military spending dropped from ~15% to ~5% of GDP. Trade with continental Europe expanded as merchants sought new markets. Domestic manufacturing grew to replace lost French imports.',
                longTermImpact: 'The end of continental military adventures allowed England to focus on maritime trade and exploration, laying the groundwork for the Age of Discovery and eventual global empire.',
                y: 120
            },
            {
                year: 1475,
                event: 'Wool Trade Boom',
                story: 'The late 15th century saw England\'s wool trade reach its medieval peak, with English wool becoming the most sought-after in Europe. This trade boom created significant wealth and transformed the economic landscape.',
                story2: 'The wool trade financed the construction of magnificent churches, expanded merchant networks, and created a new class of wealthy wool merchants. This commercial success laid the groundwork for England\'s future economic expansion.',
                economicEffect: 'Wool exports increased 300% from 1400 levels. Merchant wealth grew dramatically, financing urban development. Trade networks expanded across Europe, creating new economic opportunities.',
                longTermImpact: 'The wool trade success demonstrated England\'s potential as a trading nation and created the merchant class that would later finance exploration and colonial ventures.',
                y: 90
            }
        ];
        
        // Filter events that fall within our data range
        const relevantEvents = historicalEvents.filter(event => {
            const domain = this.xScale.domain();
            return event.year >= domain[0] && event.year <= domain[1];
        });
        
        // Use utility function to create event markers
        SceneUtils.createEventMarkers(
            this.sceneGroup,
            relevantEvents,
            this.xScale,
            this.height,
            this.animationDuration,
            (event, historicalEvent, markerColor) => {
                if (event && historicalEvent && markerColor) {
                    this.showEventTooltip(event, historicalEvent, markerColor);
                } else {
                    this.hideTooltip();
                }
            },
            (historicalEvent, markerColor) => {
                this.showEventStory(historicalEvent, markerColor);
            }
        );
    }
    
    // Scene-specific data methods
    addSceneTitle() {
        SceneUtils.createSceneTitle(
            this.sceneGroup,
            this.width,
            'Medieval Times (1209-1500)',
            'Centuries of Economic Stagnation Before Transformation'
        );
    }
    
    addEconomicStructure() {
        // Prepare time points data
        const timePoints = this.prepareEconomicStructureData();
        
        if (timePoints.length === 0) return;
        
        // Use the same X-scale as the main chart to ensure proper alignment
        const xScale = this.xScale || d3.scaleLinear()
            .domain([Math.min(...timePoints.map(d => d.year)) - 10, Math.max(...timePoints.map(d => d.year)) + 10])
            .range([0, this.width]);
        
        // Use utility function to create economic structure
        SceneUtils.createEconomicStructure(
            this.sceneGroup,
            this.width,
            this.height,
            xScale,
            timePoints,
            this.animationDuration,
            (event, data, colors, names) => {
                this.showIndustryBreakdownTooltip(event, data, colors, names);
            },
            () => {
                this.hideTooltip();
            },
            (startY) => {
                this.addIndustryLegend(startY);
            }
        );
    }
    
    prepareEconomicStructureData() {
        // Use utility function for data preparation
        return SceneUtils.prepareEconomicStructureData(
            this.medievalData.data,
            (year) => this.getPeriodForYear(year),
            (period) => this.getIndustriesForPeriod(period),
            5 // interval
        );
    }
    
    getPeriodForYear(year) {
        if (year < 1300) return '1200s';
        if (year < 1400) return '1300s';
        if (year < 1500) return '1400s';
        return '1500s';
    }
    
    getIndustriesForPeriod(period) {
        const periodData = {
            '1200s': [
                { key: 'agriculture', name: 'Agriculture', percentage: 85, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 10, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 5, color: '#CD853F' }
            ],
            '1300s': [
                { key: 'agriculture', name: 'Agriculture', percentage: 80, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 15, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 5, color: '#CD853F' }
            ],
            '1400s': [
                { key: 'agriculture', name: 'Agriculture', percentage: 75, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 18, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 7, color: '#CD853F' }
            ],
            '1500s': [
                { key: 'agriculture', name: 'Agriculture', percentage: 70, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 20, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 10, color: '#CD853F' }
            ]
        };
        
        return periodData[period] || periodData['1200s'];
    }
    
    addIndustryLegend(startY) {
        // Use the same colors as the CSS for consistency (these match what's actually displayed)
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Blue, Purple
        const industryNames = ['Agriculture', 'Crafts & Trade', 'Services'];
        
        const industries = industryNames.map((name, i) => ({
            name: name,
            color: industryColors[i]
        }));
        
        // Use utility function for legend creation
        SceneUtils.createIndustryLegend(
            this.sceneGroup,
            this.width,
            industries,
            startY,
            this.animationDuration
        );
    }
    
    getEventColor(eventIndex) {
        // Use shared color palette for consistency across scenes
        return ColorPalette.getEventColor(eventIndex);
    }
    
    getPopulationForYear(year) {
        return SceneUtils.getDataForYear(this.medievalData.data, year, 'population');
    }
    
    getGDPForYear(year) {
        return SceneUtils.getDataForYear(this.medievalData.data, year, 'gdpReal');
    }
    
    estimatePopulation(year) {
        // Medieval population estimates
        if (year <= 1250) return 3500;
        if (year <= 1300) return 4000;
        if (year <= 1350) return 2500; // Black Death impact
        if (year <= 1400) return 3000;
        if (year <= 1450) return 3500;
        if (year <= 1500) return 4300;
        return 4500;
    }
    
    getEconomicContext(year) {
        // Medieval period context (1209-1500)
        if (year <= 1250) {
            return {
                period: 'Early Medieval England',
                structure: 'Feudal agricultural economy with limited trade and sparse economic data',
                industries: 'Agriculture (85%), Basic crafts (10%), Trade and services (5%)',
                social: 'Feudal society, manorial system, subsistence farming, high mortality rates'
            };
        } else if (year <= 1300) {
            return {
                period: 'High Medieval Growth',
                structure: 'Agricultural expansion with emerging trade networks and urban development',
                industries: 'Agriculture (80%), Crafts and trade (15%), Services (5%)',
                social: 'Population growth, expanding towns, guild system developing, improved farming'
            };
        } else if (year <= 1350) {
            return {
                period: 'Black Death Crisis',
                structure: 'Economic collapse following catastrophic population loss',
                industries: 'Agriculture (75%), Crafts and trade (20%), Services (5%)',
                social: 'Massive population decline, labor shortages, social disruption, economic chaos'
            };
        } else if (year <= 1400) {
            return {
                period: 'Post-Plague Recovery',
                structure: 'Gradual economic recovery with labor shortages driving change',
                industries: 'Agriculture (70%), Crafts and trade (25%), Services (5%)',
                social: 'Labor shortages, rising wages, weakening feudalism, peasant gains'
            };
        } else {
            return {
                period: 'Late Medieval Transformation',
                structure: 'Transition from feudalism to early capitalism and market economy',
                industries: 'Agriculture (65%), Crafts and trade (30%), Services (5%)',
                social: 'Rising merchant class, wool trade expansion, early banking, social mobility'
            };
        }
    }
    
    showEnhancedTooltip(event, d, isPrimaryPopulation) {
        // Use utility function for enhanced tooltip
        SceneUtils.createEnhancedTooltip(
            event,
            d,
            isPrimaryPopulation,
            (year) => this.getEconomicContext(year),
            (year) => this.getPopulationForYear(year),
            (year) => this.getGDPForYear(year),
            (year) => this.estimatePopulation(year)
        );
    }
    
    showDetailedStory(event, d, isPrimaryPopulation) {
        // This would be implemented by each scene with specific content
        console.log('Detailed story clicked:', d);
    }
    
    showIndustryBreakdownTooltip(event, data, colors, names) {
        // Use utility function for industry breakdown tooltip
        SceneUtils.createIndustryBreakdownTooltip(event, data, colors, names);
    }
    
    hideTooltip() {
        SceneUtils.hideTooltip();
    }
    
    showEventTooltip(event, historicalEvent, markerColor) {
        SceneUtils.createTooltip(event, historicalEvent, markerColor, 'event');
    }
    
    showEventStory(historicalEvent, markerColor) {
        SceneUtils.createTooltip(null, historicalEvent, markerColor, 'story');
    }
    
    renderStagnationStory() {
        // Use utility function for no data message
        SceneUtils.createNoDataMessage(
            this.sceneGroup,
            this.width,
            this.height,
            'No economic data available for this period'
        );
    }
    
    exit() {
        // Clean up scene-specific resources
        this.sceneGroup.selectAll('*').remove();
    }
}