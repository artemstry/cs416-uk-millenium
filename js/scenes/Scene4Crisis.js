/**
 * Scene 4: Crisis & Transformation (1900-1950)
 * Shows economic volatility - World Wars, Great Depression, recovery, social change
 */

import { ColorPalette } from '../utils/ColorPalette.js';
import { SceneUtils, LayoutConfig } from '../utils/SceneUtils.js';

export class Scene4Crisis {
    // Static flag to track if scene has been rendered before
    static hasBeenRendered = false;
    
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = Scene4Crisis.hasBeenRendered ? 0 : 1000; // No animation on subsequent renders
        
        // Crisis period data (with null safety)
        if (!data || !data.periods || !data.periods.crisis) {
            console.error('❌ Scene4Crisis: Data not loaded yet!', data);
            throw new Error('Data not available for Crisis scene. Please wait for data to load.');
        }
        this.crisisData = data.periods.crisis;
        
        // Chart dimensions - move chart up by reducing top margin, but keep header visible
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 }; // Much larger top margin to make chart 20% shorter
        this.width = parameters.width - this.margin.left - this.margin.right;
        this.height = parameters.height - this.margin.top - this.margin.bottom;
        
        console.log(`⚡ Scene 4 Crisis: ${this.crisisData.data.length} years of data`);
    }
    
    render() {
        console.log('🎬 Rendering Scene 4: Crisis & Transformation...');
        
        // Clear any existing content
        this.sceneGroup.selectAll('*').remove();
        
        // Create main group
        this.sceneGroup = this.sceneGroup
            .append('g')
            .attr('class', 'scene-crisis')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Render population chart (most complete data for this period)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add economic structure visualization
        this.addEconomicStructure();
        
        // Mark as rendered to prevent re-animation on subsequent visits
        Scene4Crisis.hasBeenRendered = true;
        
        return this;
    }
    
    renderPopulationChart() {
        console.log('⚡ Crisis data available:', this.crisisData);
        
        // Get both population and GDP data where available
        const populationData = this.crisisData.data
            .filter(d => d.population !== null)
            .map(d => ({ year: d.year, value: d.population, type: 'population' }));
        
        const gdpData = this.crisisData.data
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
        // Enhanced Crisis historical events with rich storytelling
        const historicalEvents = [
            {
                year: 1914,
                event: 'World War I Begins',
                story: 'The outbreak of World War I in 1914 marked the end of the long 19th century peace and prosperity. Britain entered the war as the world\'s leading industrial power, but the conflict would fundamentally reshape the global economy.',
                story2: 'The war required massive government intervention in the economy, including conscription, rationing, and industrial mobilization. The British economy was transformed to support the war effort, with unprecedented levels of government spending and control.',
                economicEffect: 'Government spending increased from 8% to 52% of GDP. Industrial production was redirected to war materials, causing shortages in consumer goods and inflation.',
                longTermImpact: 'The war ended Britain\'s economic dominance, created massive debt, and led to the rise of the welfare state and government intervention in the economy.',
                y: 180
            },
            {
                year: 1929,
                event: 'Great Depression',
                story: 'The Wall Street Crash of 1929 triggered the Great Depression, the most severe economic crisis in modern history. Britain, already weakened by World War I, was hit hard by the global economic collapse.',
                story2: 'The depression caused massive unemployment, falling prices, and economic stagnation. Traditional industries like coal, steel, and textiles were particularly hard hit, leading to widespread poverty and social unrest.',
                economicEffect: 'GDP fell by 5% between 1929-1932. Unemployment reached 22% by 1932. Industrial production fell by 25%, and international trade collapsed.',
                longTermImpact: 'The depression led to the abandonment of the gold standard, increased government intervention, and the rise of Keynesian economics.',
                y: 150
            },
            {
                year: 1939,
                event: 'World War II Begins',
                story: 'The outbreak of World War II in 1939 brought total war to Britain once again. This time, the war effort was even more comprehensive, with the entire economy mobilized for victory.',
                story2: 'The war required complete economic transformation, with massive government control over production, distribution, and labor. Rationing was introduced, and the economy was directed toward military production.',
                economicEffect: 'Government spending reached 70% of GDP. Industrial production was redirected to war materials. The economy was completely controlled by the state.',
                longTermImpact: 'The war led to the creation of the modern welfare state, full employment policies, and permanent government intervention in the economy.',
                y: 200
            },
            {
                year: 1945,
                event: 'Post-War Reconstruction',
                story: 'The end of World War II in 1945 brought the challenge of reconstruction and the creation of a new economic order. Britain emerged victorious but economically exhausted, with massive debt and destroyed infrastructure.',
                story2: 'The post-war period saw the creation of the welfare state, including the National Health Service, comprehensive social security, and government control of key industries. The economy was rebuilt with full employment as a priority.',
                economicEffect: 'Government spending remained high at 40% of GDP. The welfare state was created, and key industries were nationalized. Full employment was achieved.',
                longTermImpact: 'The post-war settlement created the modern British economy with extensive government intervention, social welfare, and economic planning.',
                y: 120
            },
            {
                year: 1948,
                event: 'NHS Founded',
                story: 'The National Health Service was founded in 1948, representing the culmination of the welfare state reforms. It provided free healthcare to all citizens, funded by taxation.',
                story2: 'The NHS was the largest single employer in Europe and represented a fundamental shift in the role of government in providing social services. It was part of the broader post-war social democratic consensus.',
                economicEffect: 'The NHS increased government spending by 3% of GDP. It created a large public sector workforce and established the principle of universal healthcare.',
                longTermImpact: 'The NHS became a cornerstone of British society and the welfare state, providing healthcare to all citizens regardless of income.',
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
            'Crisis & Transformation (1900-1950)',
            'Wars, Depression, and the Rise of the Modern State'
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
            this.crisisData.data,
            (year) => this.getPeriodForYear(year),
            (period) => this.getIndustriesForPeriod(period),
            5 // interval
        );
    }
    
    getPeriodForYear(year) {
        if (year <= 1914) return 'Pre-War Prosperity';
        if (year <= 1918) return 'World War I';
        if (year <= 1929) return 'Interwar Recovery';
        if (year <= 1939) return 'Great Depression';
        if (year <= 1945) return 'World War II';
        return 'Post-War Reconstruction';
    }
    
    getIndustriesForPeriod(period) {
        const periodData = {
            'Pre-War Prosperity': [
                { key: 'agriculture', name: 'Agriculture', percentage: 20, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 70, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 10, color: '#9370DB' }
            ],
            'World War I': [
                { key: 'agriculture', name: 'Agriculture', percentage: 15, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 75, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 10, color: '#9370DB' }
            ],
            'Interwar Recovery': [
                { key: 'agriculture', name: 'Agriculture', percentage: 18, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 67, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 15, color: '#9370DB' }
            ],
            'Great Depression': [
                { key: 'agriculture', name: 'Agriculture', percentage: 22, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 58, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 20, color: '#9370DB' }
            ],
            'World War II': [
                { key: 'agriculture', name: 'Agriculture', percentage: 12, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 78, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 10, color: '#9370DB' }
            ],
            'Post-War Reconstruction': [
                { key: 'agriculture', name: 'Agriculture', percentage: 8, color: '#8B4513' },
                { key: 'crafts', name: 'Manufacturing', percentage: 65, color: '#4682B4' },
                { key: 'services', name: 'Services', percentage: 27, color: '#9370DB' }
            ]
        };
        
        return periodData[period] || periodData['Pre-War Prosperity'];
    }
    
    addIndustryLegend(startY) {
        // Use the same colors as the CSS for consistency (these match what's actually displayed)
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Blue, Purple
        const industryNames = ['Agriculture', 'Manufacturing', 'Services'];
        
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
        return SceneUtils.getDataForYear(this.crisisData.data, year, 'population');
    }
    
    getGDPForYear(year) {
        return SceneUtils.getDataForYear(this.crisisData.data, year, 'gdpReal');
    }
    
    estimatePopulation(year) {
        // Crisis period population estimates
        if (year <= 1910) return 45000;
        if (year <= 1920) return 47000;
        if (year <= 1930) return 49000;
        if (year <= 1940) return 51000;
        if (year <= 1950) return 53000;
        return 55000;
    }
    
    getEconomicContext(year) {
        // Crisis period context (1900-1950)
        if (year <= 1914) {
            return {
                period: 'Pre-War Prosperity',
                structure: 'Mature industrial economy with global trade dominance and imperial markets',
                industries: 'Agriculture (20%), Manufacturing (70%), Services (10%)',
                social: 'Victorian prosperity, industrial dominance, global trade leadership, social inequality'
            };
        } else if (year <= 1918) {
            return {
                period: 'World War I',
                structure: 'Total war economy with government control and industrial mobilization',
                industries: 'Agriculture (15%), Manufacturing (75%), Services (10%)',
                social: 'Mass conscription, rationing, industrial mobilization, government control'
            };
        } else if (year <= 1929) {
            return {
                period: 'Interwar Recovery',
                structure: 'Post-war reconstruction with return to market economy and international trade',
                industries: 'Agriculture (18%), Manufacturing (67%), Services (15%)',
                social: 'Post-war recovery, return to gold standard, industrial restructuring, social reforms'
            };
        } else if (year <= 1939) {
            return {
                period: 'Great Depression',
                structure: 'Economic crisis with high unemployment and government intervention',
                industries: 'Agriculture (22%), Manufacturing (58%), Services (20%)',
                social: 'Mass unemployment, poverty, social unrest, government intervention, welfare reforms'
            };
        } else if (year <= 1945) {
            return {
                period: 'World War II',
                structure: 'Total war economy with complete government control and industrial mobilization',
                industries: 'Agriculture (12%), Manufacturing (78%), Services (10%)',
                social: 'Total war, rationing, industrial mobilization, government control, social unity'
            };
        } else {
            return {
                period: 'Post-War Reconstruction',
                structure: 'Welfare state economy with government intervention and social democracy',
                industries: 'Agriculture (8%), Manufacturing (65%), Services (27%)',
                social: 'Welfare state, full employment, NHS, social democracy, economic planning'
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