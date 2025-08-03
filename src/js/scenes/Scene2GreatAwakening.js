/**
 * Scene 2: Great Awakening (1500-1750)
 * Shows early modern economic transformation - trade expansion, manufacturing growth, financial innovations
 */

import { ColorPalette } from '../utils/ColorPalette.js';
import { SceneUtils, LayoutConfig } from '../utils/SceneUtils.js';

export class Scene2GreatAwakening {
    // Static flag to track if scene has been rendered before
    static hasBeenRendered = false;
    
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = Scene2GreatAwakening.hasBeenRendered ? 0 : 1000; // No animation on subsequent renders
        
        // Great Awakening period data (with null safety)
        if (!data || !data.periods || !data.periods.awakening) {
            console.error('❌ Scene2GreatAwakening: Data not loaded yet!', data);
            throw new Error('Data not available for Great Awakening scene. Please wait for data to load.');
        }
        this.awakeningData = data.periods.awakening;
        
        // Chart dimensions - move chart up by reducing top margin, but keep header visible
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 }; // Much larger top margin to make chart 20% shorter
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        console.log(`🌅 Scene 2 Great Awakening: ${this.awakeningData.data.length} years of data`);
    }
    
    render() {
        console.log('🎬 Rendering Scene 2: Great Awakening...');
        
        // Clear any existing content
        this.sceneGroup.selectAll('*').remove();
        
        // Create main group
        this.sceneGroup = this.sceneGroup
            .append('g')
            .attr('class', 'scene-awakening')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Render population chart (most complete data for this period)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add economic structure visualization
        this.addEconomicStructure();
        
        // Mark as rendered to prevent re-animation on subsequent visits
        Scene2GreatAwakening.hasBeenRendered = true;
        
        return this;
    }
    
    renderPopulationChart() {
        console.log('🌅 Great Awakening data available:', this.awakeningData);
        
        // Get both population and GDP data where available
        const populationData = this.awakeningData.data
            .filter(d => d.population !== null)
            .map(d => ({ year: d.year, value: d.population, type: 'population' }));
        
        const gdpData = this.awakeningData.data
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
        // Enhanced Great Awakening historical events with rich storytelling
        const historicalEvents = [
            {
                year: 1517,
                event: 'Protestant Reformation',
                story: 'Martin Luther\'s challenge to Catholic Church authority in 1517 triggered a religious revolution that transformed not just spiritual life but economic structures across Europe. The dissolution of monasteries freed vast amounts of land for private ownership and commercial use.',
                story2: 'In England, Henry VIII\'s break with Rome (1534) created opportunities for new merchant classes while disrupting traditional economic relationships. The redistribution of monastic lands to secular owners accelerated the commercialization of agriculture and created a new Protestant work ethic that would fuel economic growth.',
                economicEffect: 'Dissolution of monasteries released ~25% of English land to private ownership. New Protestant values emphasized individual enterprise and commercial success, laying groundwork for capitalist development.',
                longTermImpact: 'Protestant work ethic and emphasis on material success as divine blessing fundamentally altered English economic culture, contributing to entrepreneurial spirit that would drive later industrial development.',
                y: 180
            },
            {
                year: 1588,
                event: 'Spanish Armada Defeated',
                story: 'The defeat of the Spanish Armada in 1588 marked England\'s emergence as a major naval power, challenging Spanish dominance of global trade routes. This victory opened the Atlantic and beyond to English merchants and adventurers.',
                story2: 'The naval triumph unleashed a wave of English exploration and colonization efforts. Joint-stock companies formed to exploit new trading opportunities, while privateering against Spanish treasure fleets brought wealth directly into English hands. The psychological impact was equally important - England saw itself as destined for global commercial leadership.',
                economicEffect: 'Immediate access to previously Spanish-controlled trade routes. Privateering yielded estimated £200,000+ annually. Maritime insurance and shipbuilding industries expanded rapidly to support growing merchant fleet.',
                longTermImpact: 'Naval supremacy enabled England to develop global trading networks and colonial empire, providing markets for English goods and sources of raw materials that would fuel centuries of economic expansion.',
                y: 150
            },
            {
                year: 1600,
                event: 'East India Company Founded',
                story: 'The founding of the East India Company represented a revolutionary approach to long-distance trade. Rather than individual merchants risking their fortunes, the joint-stock structure allowed multiple investors to pool resources and share both risks and profits of Asian trade.',
                story2: 'This corporate innovation proved immensely successful, generating returns of 20-30% annually for early investors. The Company pioneered modern business practices: professional management, standardized accounting, and reinvestment of profits. Its success inspired countless imitators and established the template for modern capitalism.',
                economicEffect: 'Initial capital of £70,000 grew to over £3 million by 1700. Asian trade yielded luxury goods (spices, silk, tea, porcelain) that generated enormous profit margins - often 300-400% on successful voyages.',
                longTermImpact: 'Joint-stock model became foundation of modern corporate capitalism. Company eventually controlled much of India, demonstrating how commercial organizations could become quasi-governmental powers.',
                y: 200
            },
            {
                year: 1650,
                event: 'Agricultural Revolution Begins',
                story: 'The introduction of new crops from the Americas (potatoes, maize, tomatoes) and innovative farming techniques dramatically increased agricultural productivity. The "Norfolk four-course system" eliminated need for fallow fields while restoring soil fertility.',
                story2: 'These improvements supported larger populations while requiring less labor, freeing workers for manufacturing and trade. Enclosure of common lands, while socially disruptive, created larger, more efficient farms. Agricultural surplus provided both food for growing cities and capital for investment in other sectors.',
                economicEffect: 'Agricultural productivity increased by 40-50% between 1650-1750. Population grew from ~5 million to ~6.5 million while agricultural workforce remained stable, releasing ~500,000 workers for other activities.',
                longTermImpact: 'Agricultural revolution was prerequisite for industrial revolution. Surplus rural labor became urban workforce, while agricultural profits provided capital for industrial investment. Food security enabled economic specialization.',
                y: 120
            },
            {
                year: 1694,
                event: 'Bank of England Founded',
                story: 'The Bank of England, established to help finance King William\'s wars against France, represented a fundamental innovation in government finance. Rather than relying on irregular taxation or loans from merchants, the government could now access systematic credit.',
                story2: 'The Bank quickly evolved beyond its original purpose, becoming the cornerstone of England\'s financial system. It standardized currency, provided commercial credit, and created a market for government bonds. This financial infrastructure enabled England to sustain higher levels of government spending and private investment than any rival.',
                economicEffect: 'Government debt service dropped from 14% to 6% interest rates. Bank issued £1.2 million in notes by 1700, increasing money supply and enabling expanded commerce. Credit became available for private ventures.',
                longTermImpact: 'Modern central banking enabled England to finance both colonial expansion and eventual industrial revolution. Stable currency and credit system became competitive advantages that helped secure English economic dominance.',
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
            (event, historicalEvent, markerColor) => {
                this.showEventStory(event, historicalEvent, markerColor);
            }
        );
    }
    
    // Scene-specific data methods
    addSceneTitle() {
        SceneUtils.createSceneTitle(
            this.sceneGroup,
            this.width,
            'Great Awakening (1500-1750)',
            'From Medieval Stagnation to Early Modern Growth'
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
            this.awakeningData.data,
            (year) => this.getPeriodForYear(year),
            (period) => this.getIndustriesForPeriod(period),
            5 // interval
        );
    }
    
    getPeriodForYear(year) {
        if (year <= 1550) return 'Early Reformation';
        if (year <= 1650) return 'Early Colonial Commerce';
        if (year <= 1700) return 'Financial Revolution Era';
        return 'Pre-Industrial Transformation';
    }
    
    getIndustriesForPeriod(period) {
        const periodData = {
            'Early Reformation': [
                { key: 'agriculture', name: 'Agriculture', percentage: 70, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 20, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 10, color: '#CD853F' }
            ],
            'Early Colonial Commerce': [
                { key: 'agriculture', name: 'Agriculture', percentage: 60, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 35, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 5, color: '#CD853F' }
            ],
            'Financial Revolution Era': [
                { key: 'agriculture', name: 'Agriculture', percentage: 55, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 40, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 5, color: '#CD853F' }
            ],
            'Pre-Industrial Transformation': [
                { key: 'agriculture', name: 'Agriculture', percentage: 50, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 45, color: '#D2691E' },
                { key: 'services', name: 'Services', percentage: 5, color: '#CD853F' }
            ]
        };
        
        return periodData[period] || periodData['Early Reformation'];
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
        return SceneUtils.getDataForYear(this.awakeningData.data, year, 'population');
    }
    
    getGDPForYear(year) {
        return SceneUtils.getDataForYear(this.awakeningData.data, year, 'gdpReal');
    }
    
    estimatePopulation(year) {
        // Great Awakening population estimates
        if (year <= 1550) return 3000;
        if (year <= 1600) return 4000;
        if (year <= 1650) return 5000;
        if (year <= 1700) return 5500;
        if (year <= 1750) return 6500;
        return 7000;
    }
    
    getEconomicContext(year) {
        // Great Awakening period context (1500-1750)
        if (year <= 1550) {
            return {
                period: 'Early Reformation Period',
                structure: 'Agricultural economy with emerging trade networks and religious transformation',
                industries: 'Agriculture (70%), Crafts and trade (20%), Services (10%)',
                social: 'Religious upheaval, dissolution of monasteries, emerging merchant class, Protestant work ethic'
            };
        } else if (year <= 1600) {
            return {
                period: 'Elizabethan Commercial Expansion',
                structure: 'Growing maritime trade and colonial ventures with agricultural foundation',
                industries: 'Agriculture (65%), Crafts and trade (30%), Services (5%)',
                social: 'Naval expansion, privateering, joint-stock companies, global trade networks'
            };
        } else if (year <= 1650) {
            return {
                period: 'Early Colonial Commerce',
                structure: 'Expanding trade networks with agricultural improvements and financial innovation',
                industries: 'Agriculture (60%), Crafts and trade (35%), Services (5%)',
                social: 'Colonial expansion, agricultural revolution, enclosure movement, merchant wealth'
            };
        } else if (year <= 1700) {
            return {
                period: 'Financial Revolution Era',
                structure: 'Modern financial institutions with expanding manufacturing and trade',
                industries: 'Agriculture (55%), Crafts and trade (40%), Services (5%)',
                social: 'Bank of England, government bonds, insurance markets, urban growth'
            };
        } else {
            return {
                period: 'Pre-Industrial Transformation',
                structure: 'Diversified economy with strong manufacturing base and financial infrastructure',
                industries: 'Agriculture (50%), Crafts and trade (45%), Services (5%)',
                social: 'Industrial preparation, technological innovation, capital accumulation, social mobility'
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
    
    showEventStory(event, historicalEvent, markerColor) {
        SceneUtils.createTooltip(event, historicalEvent, markerColor, 'story');
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