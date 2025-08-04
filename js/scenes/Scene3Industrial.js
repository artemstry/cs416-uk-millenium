/**
 * Scene 3: Industrial Explosion (1750-1900)
 * Shows the dramatic economic transformation - steam power, railways, manufacturing boom
 */

import { ColorPalette } from '../utils/ColorPalette.js';
import { SceneUtils, LayoutConfig } from '../utils/SceneUtils.js';

export class Scene3Industrial {
    // Static flag to track if scene has been rendered before
    static hasBeenRendered = false;
    
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = Scene3Industrial.hasBeenRendered ? 0 : 1000; // No animation on subsequent renders
        
        // Industrial period data (with null safety)
        if (!data || !data.periods || !data.periods.industrial) {
            console.error('❌ Scene3Industrial: Data not loaded yet!', data);
            throw new Error('Data not available for Industrial scene. Please wait for data to load.');
        }
        this.industrialData = data.periods.industrial;
        
        // Chart dimensions - move chart up by reducing top margin, but keep header visible
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 }; // Much larger top margin to make chart 20% shorter
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        console.log(`🏭 Scene 3 Industrial: ${this.industrialData.data.length} years of data`);
    }
    
    render() {
        console.log('🎬 Rendering Scene 3: Industrial Explosion...');
        
        // Clear any existing content
        this.sceneGroup.selectAll('*').remove();
        
        // Create main group
        this.sceneGroup = this.sceneGroup
            .append('g')
            .attr('class', 'scene-industrial')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Render population chart (most complete data for this period)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add economic structure visualization
        this.addEconomicStructure();
        
        // Mark as rendered to prevent re-animation on subsequent visits
        Scene3Industrial.hasBeenRendered = true;
        
        return this;
    }
    
    renderPopulationChart() {
        console.log('🏭 Industrial data available:', this.industrialData);
        
        // Get both population and GDP data where available
        const populationData = this.industrialData.data
            .filter(d => d.population !== null)
            .map(d => ({ year: d.year, value: d.population, type: 'population' }));
        
        const gdpData = this.industrialData.data
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
        // Enhanced Industrial historical events with rich storytelling
        const historicalEvents = [
            {
                year: 1769,
                event: 'Watt\'s Steam Engine',
                story: 'James Watt\'s improved steam engine in 1769 marked the beginning of the Industrial Revolution. His invention provided reliable, efficient power that could be used anywhere, not just near water sources.',
                story2: 'The steam engine revolutionized manufacturing by providing consistent power for factories, mines, and transportation. This technological breakthrough enabled the mass production of goods and created entirely new industries.',
                economicEffect: 'Steam power increased manufacturing productivity by 300-500%. Factories could now operate 24/7, dramatically increasing output and reducing costs.',
                longTermImpact: 'Steam power became the foundation of the Industrial Revolution, enabling the development of railways, steamships, and modern manufacturing processes.',
                y: 180
            },
            {
                year: 1785,
                event: 'Power Loom Invented',
                story: 'Edmund Cartwright\'s power loom invention in 1785 automated the weaving process, dramatically increasing textile production capacity and reducing the need for skilled weavers.',
                story2: 'The power loom, combined with other textile innovations like the spinning jenny and water frame, created a complete mechanized textile industry that could produce vast quantities of cloth at low cost.',
                economicEffect: 'Textile production increased by 400% between 1780-1800. Cotton imports grew from 2 million to 50 million pounds annually.',
                longTermImpact: 'The mechanization of textiles established the factory system and created the template for modern industrial production.',
                y: 150
            },
            {
                year: 1825,
                event: 'First Steam Railway',
                story: 'The Stockton and Darlington Railway opened in 1825, marking the beginning of the railway age. This first public steam railway demonstrated the potential for rapid, reliable transportation.',
                story2: 'Railways revolutionized transportation by providing fast, cheap, and reliable movement of goods and people. They connected markets, reduced transport costs, and enabled the growth of national economies.',
                economicEffect: 'Railway construction created massive demand for iron, steel, and coal. By 1850, Britain had 6,000 miles of track, reducing transport costs by 60-80%.',
                longTermImpact: 'Railways became the backbone of industrial economies, enabling mass transportation and creating new economic opportunities.',
                y: 200
            },
            {
                year: 1851,
                event: 'Great Exhibition',
                story: 'The Great Exhibition of 1851 showcased Britain\'s industrial might to the world. The Crystal Palace displayed thousands of industrial innovations, demonstrating Britain\'s leadership in manufacturing.',
                story2: 'The exhibition attracted 6 million visitors and showcased Britain\'s dominance in industrial production. It symbolized the country\'s transformation from agricultural to industrial economy.',
                economicEffect: 'The exhibition generated £186,000 in profits and demonstrated Britain\'s industrial superiority. It boosted confidence in British manufacturing and trade.',
                longTermImpact: 'The Great Exhibition marked Britain\'s peak as the world\'s leading industrial power and inspired similar exhibitions worldwide.',
                y: 120
            },
            {
                year: 1870,
                event: 'Steel Revolution',
                story: 'The Bessemer process and later the Siemens-Martin process revolutionized steel production in the 1870s, making high-quality steel affordable and available in large quantities.',
                story2: 'Cheap steel enabled the construction of railways, bridges, ships, and buildings on an unprecedented scale. It became the foundation of modern infrastructure and heavy industry.',
                economicEffect: 'Steel production increased from 125,000 tons in 1850 to 5 million tons by 1900. Steel prices fell by 80%, making it accessible for widespread use.',
                longTermImpact: 'Steel became the material of the modern age, enabling the construction of skyscrapers, bridges, and industrial machinery.',
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
            'Industrial Explosion (1750-1900)',
            'Steam, Steel, and the Birth of Modern Economy'
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
            this.industrialData.data,
            (year) => this.getPeriodForYear(year),
            (period) => this.getIndustriesForPeriod(period),
            5 // interval
        );
    }
    
    getPeriodForYear(year) {
        if (year <= 1780) return 'Early Industrial';
        if (year <= 1820) return 'Steam Power Era';
        if (year <= 1850) return 'Railway Age';
        if (year <= 1870) return 'Steel Revolution';
        return 'Mature Industrial';
    }
    
    getIndustriesForPeriod(period) {
        const periodData = {
            'Early Industrial': [
                { key: 'agriculture', name: 'Agriculture', percentage: 45, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 50, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 5, color: '#9370DB' }
            ],
            'Steam Power Era': [
                { key: 'agriculture', name: 'Agriculture', percentage: 40, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 55, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 5, color: '#9370DB' }
            ],
            'Railway Age': [
                { key: 'agriculture', name: 'Agriculture', percentage: 35, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 60, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 5, color: '#9370DB' }
            ],
            'Steel Revolution': [
                { key: 'agriculture', name: 'Agriculture', percentage: 30, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 65, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 5, color: '#9370DB' }
            ],
            'Mature Industrial': [
                { key: 'agriculture', name: 'Agriculture', percentage: 25, color: '#8B4513' },
                { key: 'crafts', name: 'Crafts & Trade', percentage: 70, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 5, color: '#9370DB' }
            ]
        };
        
        return periodData[period] || periodData['Early Industrial'];
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
        return SceneUtils.getDataForYear(this.industrialData.data, year, 'population');
    }
    
    getGDPForYear(year) {
        return SceneUtils.getDataForYear(this.industrialData.data, year, 'gdpReal');
    }
    
    estimatePopulation(year) {
        // Industrial period population estimates
        if (year <= 1770) return 7000;
        if (year <= 1800) return 9000;
        if (year <= 1830) return 14000;
        if (year <= 1860) return 23000;
        if (year <= 1890) return 37000;
        if (year <= 1900) return 41000;
        return 45000;
    }
    
    getEconomicContext(year) {
        // Industrial period context (1750-1900)
        if (year <= 1780) {
            return {
                period: 'Early Industrial Revolution',
                structure: 'Transition from agricultural to industrial economy with steam power introduction',
                industries: 'Agriculture (45%), Manufacturing and trade (50%), Services (5%)',
                social: 'Steam power introduction, factory system emerging, rural to urban migration beginning'
            };
        } else if (year <= 1820) {
            return {
                period: 'Steam Power Era',
                structure: 'Rapid industrialization with steam-powered manufacturing and transportation',
                industries: 'Agriculture (40%), Manufacturing and trade (55%), Services (5%)',
                social: 'Mass factory employment, urbanization accelerating, steam railways beginning'
            };
        } else if (year <= 1850) {
            return {
                period: 'Railway Age',
                structure: 'Railway network expansion driving industrial growth and market integration',
                industries: 'Agriculture (35%), Manufacturing and trade (60%), Services (5%)',
                social: 'Railway construction boom, mass transportation, national market integration'
            };
        } else if (year <= 1870) {
            return {
                period: 'Steel Revolution',
                structure: 'Steel production enabling massive infrastructure and industrial expansion',
                industries: 'Agriculture (30%), Manufacturing and trade (65%), Services (5%)',
                social: 'Steel industry boom, heavy industry development, urban industrial centers'
            };
        } else {
            return {
                period: 'Mature Industrial Economy',
                structure: 'Fully industrialized economy with advanced manufacturing and global trade',
                industries: 'Agriculture (25%), Manufacturing and trade (70%), Services (5%)',
                social: 'Industrial dominance, global trade leadership, urban industrial society'
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