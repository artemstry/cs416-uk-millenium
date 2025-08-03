/**
 * Scene 5: Modern Service Economy (1950-2016)
 * Shows post-war boom, service economy rise, technology revolution, globalization
 */

import { ColorPalette } from '../utils/ColorPalette.js';
import { SceneUtils, LayoutConfig } from '../utils/SceneUtils.js';

export class Scene5Modern {
    // Static flag to track if scene has been rendered before
    static hasBeenRendered = false;
    
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = Scene5Modern.hasBeenRendered ? 0 : 1000; // No animation on subsequent renders
        
        // Modern period data (with null safety)
        if (!data || !data.periods || !data.periods.modern) {
            console.error('❌ Scene5Modern: Data not loaded yet!', data);
            throw new Error('Data not available for Modern scene. Please wait for data to load.');
        }
        this.modernData = data.periods.modern;
        
        // Chart dimensions - move chart up by reducing top margin, but keep header visible
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 }; // Much larger top margin to make chart 20% shorter
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        console.log(`💻 Scene 5 Modern: ${this.modernData.data.length} years of data`);
    }
    
    render() {
        console.log('🎬 Rendering Scene 5: Modern Service Economy...');
        
        // Clear any existing content
        this.sceneGroup.selectAll('*').remove();
        
        // Create main group
        this.sceneGroup = this.sceneGroup
            .append('g')
            .attr('class', 'scene-modern')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Render population chart (most complete data for this period)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add economic structure visualization
        this.addEconomicStructure();
        
        // Mark as rendered to prevent re-animation on subsequent visits
        Scene5Modern.hasBeenRendered = true;
        
        return this;
    }
    
    renderPopulationChart() {
        console.log('💻 Modern data available:', this.modernData);
        
        // Get both population and GDP data where available
        const populationData = this.modernData.data
            .filter(d => d.population !== null)
            .map(d => ({ year: d.year, value: d.population, type: 'population' }));
        
        const gdpData = this.modernData.data
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
        // Enhanced Modern historical events with rich storytelling
        const historicalEvents = [
            {
                year: 1956,
                event: 'Suez Crisis',
                story: 'The Suez Crisis of 1956 marked the end of British imperial dominance and the beginning of a new era of decolonization and global power shifts.',
                story2: 'The crisis demonstrated Britain\'s declining global influence and the rise of the United States and Soviet Union as superpowers. It also marked the beginning of the end of the British Empire.',
                economicEffect: 'The crisis led to a temporary oil shortage and economic uncertainty, but also accelerated Britain\'s shift toward European markets and away from imperial trade.',
                longTermImpact: 'The Suez Crisis marked Britain\'s transition from imperial power to European nation, setting the stage for the modern service economy.',
                y: 180
            },
            {
                year: 1973,
                event: 'Oil Crisis',
                story: 'The 1973 oil crisis, triggered by the Yom Kippur War, caused massive economic disruption and marked the end of the post-war economic boom.',
                story2: 'Oil prices quadrupled, causing inflation, recession, and a fundamental shift in economic thinking. The crisis exposed the vulnerability of industrial economies to energy supply shocks.',
                economicEffect: 'Inflation reached 25%, unemployment rose to 1 million, and GDP growth slowed dramatically. The crisis led to permanent changes in energy policy and economic management.',
                longTermImpact: 'The oil crisis accelerated the shift from manufacturing to services and led to greater economic volatility and financial deregulation.',
                y: 150
            },
            {
                year: 1979,
                event: 'Thatcher Revolution',
                story: 'Margaret Thatcher\'s election in 1979 marked the beginning of a fundamental transformation of the British economy and society.',
                story2: 'Thatcher\'s policies of privatization, deregulation, and market liberalization transformed Britain from a heavily regulated, union-dominated economy to a free-market, service-oriented economy.',
                economicEffect: 'Manufacturing declined from 30% to 15% of GDP, while services grew from 50% to 70%. Financial services became the dominant sector.',
                longTermImpact: 'The Thatcher revolution created the foundation for Britain\'s modern service economy and global financial center status.',
                y: 200
            },
            {
                year: 1986,
                event: 'Big Bang',
                story: 'The Big Bang deregulation of London\'s financial markets in 1986 transformed the City of London into a global financial center.',
                story2: 'The abolition of fixed commissions, the end of the separation between brokers and jobbers, and the opening of markets to foreign competition revolutionized British finance.',
                economicEffect: 'Financial services employment doubled, foreign investment poured in, and London became the world\'s leading financial center alongside New York.',
                longTermImpact: 'The Big Bang established London as a global financial hub and made financial services the cornerstone of the British economy.',
                y: 120
            },
            {
                year: 2008,
                event: 'Financial Crisis',
                story: 'The 2008 financial crisis, triggered by the collapse of Lehman Brothers, caused the worst economic recession since the Great Depression.',
                story2: 'The crisis exposed the risks of financial deregulation and led to massive government intervention to prevent economic collapse. Britain was particularly hard hit due to its large financial sector.',
                economicEffect: 'GDP fell by 6%, unemployment doubled to 2.5 million, and the government had to bail out major banks. The crisis led to austerity policies and economic restructuring.',
                longTermImpact: 'The crisis accelerated the shift toward technology and digital services, while traditional financial services faced increased regulation.',
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
            'Modern Service Economy (1950-2016)',
            'Technology, Services, and the Global Economy'
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
            this.modernData.data,
            (year) => this.getPeriodForYear(year),
            (period) => this.getIndustriesForPeriod(period),
            5 // interval
        );
    }
    
    getPeriodForYear(year) {
        if (year <= 1970) return 'Post-War Boom';
        if (year <= 1980) return 'Economic Crisis';
        if (year <= 1990) return 'Thatcher Revolution';
        if (year <= 2000) return 'Globalization Era';
        if (year <= 2010) return 'Digital Revolution';
        return 'Modern Service Economy';
    }
    
    getIndustriesForPeriod(period) {
        const periodData = {
            'Post-War Boom': [
                { key: 'agriculture', name: 'Agriculture', percentage: 5, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 40, color: '#4682B4' },
                { key: 'services', name: 'Services & Technology', percentage: 55, color: '#9370DB' }
            ],
            'Economic Crisis': [
                { key: 'agriculture', name: 'Agriculture', percentage: 4, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 35, color: '#4682B4' },
                { key: 'services', name: 'Services & Technology', percentage: 61, color: '#9370DB' }
            ],
            'Thatcher Revolution': [
                { key: 'agriculture', name: 'Agriculture', percentage: 3, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 25, color: '#4682B4' },
                { key: 'services', name: 'Services & Technology', percentage: 72, color: '#9370DB' }
            ],
            'Globalization Era': [
                { key: 'agriculture', name: 'Agriculture', percentage: 2, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 20, color: '#4682B4' },
                { key: 'services', name: 'Services & Technology', percentage: 78, color: '#9370DB' }
            ],
            'Digital Revolution': [
                { key: 'agriculture', name: 'Agriculture', percentage: 1, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 15, color: '#4682B4' },
                { key: 'services', name: 'Services & Technology', percentage: 84, color: '#9370DB' }
            ],
            'Modern Service Economy': [
                { key: 'agriculture', name: 'Agriculture', percentage: 1, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 10, color: '#4682B4' },
                { key: 'services', name: 'Services & Technology', percentage: 89, color: '#9370DB' }
            ]
        };
        
        return periodData[period] || periodData['Post-War Boom'];
    }
    
    addIndustryLegend(startY) {
        // Use the same colors as the CSS for consistency (these match what's actually displayed)
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Blue, Purple
        const industryNames = ['Agriculture', 'Manufacturing', 'Services & Technology'];
        
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
        return SceneUtils.getDataForYear(this.modernData.data, year, 'population');
    }
    
    getGDPForYear(year) {
        return SceneUtils.getDataForYear(this.modernData.data, year, 'gdpReal');
    }
    
    estimatePopulation(year) {
        // Modern period population estimates
        if (year <= 1960) return 55000;
        if (year <= 1970) return 58000;
        if (year <= 1980) return 61000;
        if (year <= 1990) return 64000;
        if (year <= 2000) return 67000;
        if (year <= 2010) return 70000;
        if (year <= 2016) return 73000;
        return 75000;
    }
    
    getEconomicContext(year) {
        // Modern period context (1950-2016)
        if (year <= 1970) {
            return {
                period: 'Post-War Boom',
                structure: 'Mixed economy with strong manufacturing and growing services sector',
                industries: 'Agriculture (5%), Manufacturing (40%), Services & Technology (55%)',
                social: 'Full employment, welfare state, industrial prosperity, consumer boom'
            };
        } else if (year <= 1980) {
            return {
                period: 'Economic Crisis',
                structure: 'Declining manufacturing with services becoming dominant',
                industries: 'Agriculture (4%), Manufacturing (35%), Services & Technology (61%)',
                social: 'Inflation, unemployment, industrial decline, social unrest'
            };
        } else if (year <= 1990) {
            return {
                period: 'Thatcher Revolution',
                structure: 'Rapid deindustrialization and service economy expansion',
                industries: 'Agriculture (3%), Manufacturing (25%), Services & Technology (72%)',
                social: 'Financial deregulation, privatization, union decline, service sector growth'
            };
        } else if (year <= 2000) {
            return {
                period: 'Globalization Era',
                structure: 'Global service economy with technology sector growth',
                industries: 'Agriculture (2%), Manufacturing (20%), Services & Technology (78%)',
                social: 'Globalization, technology boom, financial services dominance, digital revolution'
            };
        } else if (year <= 2010) {
            return {
                period: 'Digital Revolution',
                structure: 'Technology-driven service economy with minimal manufacturing',
                industries: 'Agriculture (1%), Manufacturing (15%), Services & Technology (84%)',
                social: 'Internet economy, digital services, financial crisis, technology innovation'
            };
        } else {
            return {
                period: 'Modern Service Economy',
                structure: 'Technology and service-dominated economy with global reach',
                industries: 'Agriculture (1%), Manufacturing (10%), Services & Technology (89%)',
                social: 'Digital transformation, global services, technology leadership, knowledge economy'
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