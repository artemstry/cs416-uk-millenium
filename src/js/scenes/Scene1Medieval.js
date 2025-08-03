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
        
        console.log(`📊 Population: ${populationData.length} points, GDP: ${gdpData.length} points`);
        
        if (populationData.length === 0 && gdpData.length === 0) {
            this.renderStagnationStory();
            return;
        }
        
        // Create the main narrative chart
        this.renderTransformationStory(populationData, gdpData);
    }
    
    renderTransformationStory(populationData, gdpData) {
        console.log('📖 Rendering transformation story...');
        
        // Use GDP data as primary when available, fall back to population
        const primaryData = gdpData.length > 0 ? gdpData : populationData;
        const isPrimaryPopulation = gdpData.length === 0;
        
        if (primaryData.length === 0) {
            this.renderStagnationStory();
            return;
        }
        
        // Chart setup - keep original size, don't make it bigger
        const chartHeight = this.height - 200;
        
        // Determine actual data range (not theoretical)
        const allDataYears = [...populationData.map(d => d.year), ...gdpData.map(d => d.year)];
        const actualStartYear = Math.min(...allDataYears);
        const actualEndYear = Math.max(...allDataYears);
        
        console.log(`📊 Adjusting X-axis: data runs from ${actualStartYear} to ${actualEndYear}`);
        
        // Scales
        this.xScale = d3.scaleLinear()
            .domain([actualStartYear, actualEndYear])
            .range([0, this.width]);
        
        // Y scale - don't force 0 to start, let it be dynamic based on actual data
        const allValues = primaryData.map(d => d.value);
        const minValue = d3.min(allValues);
        const maxValue = d3.max(allValues);
        const valueRange = maxValue - minValue;
        const padding = valueRange * 0.1; // 10% padding
        
        this.yScale = d3.scaleLinear()
            .domain([Math.max(0, minValue - padding), maxValue + padding])
            .nice()
            .range([chartHeight, 20]);
        
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
        // Get the data range for the breakdown
        const availableYears = this.medievalData.data
            .filter(d => d.population !== null || d.gdpReal !== null)
            .map(d => d.year);
        
        if (availableYears.length === 0) return [];
        
        const actualStartYear = Math.min(...availableYears);
        const actualEndYear = Math.max(...availableYears);
        
        // Create time-based data points - every 5 years for stable tooltips
        const timePoints = [];
        for (let year = actualStartYear; year <= actualEndYear; year += 5) {
            const period = this.getPeriodForYear(year);
            const industries = this.getIndustriesForPeriod(period);
            const agriculture = industries.find(i => i.key === 'agriculture')?.percentage || 0;
            const crafts = industries.find(i => i.key === 'crafts')?.percentage || 0;
            const services = industries.find(i => i.key === 'services')?.percentage || 0;
            timePoints.push({ year, agriculture, crafts, services });
        }
        
        // Add final year if not included
        if ((actualEndYear - actualStartYear) % 5 !== 0) {
            const finalYear = actualEndYear;
            const period = this.getPeriodForYear(finalYear);
            const industries = this.getIndustriesForPeriod(period);
            const agriculture = industries.find(i => i.key === 'agriculture')?.percentage || 0;
            const crafts = industries.find(i => i.key === 'crafts')?.percentage || 0;
            const services = industries.find(i => i.key === 'services')?.percentage || 0;
            timePoints.push({ year: finalYear, agriculture, crafts, services });
        }
        
        return timePoints;
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
        
        industries.forEach((industry, i) => {
            // Center the legend under the chart
            const legendTotalWidth = (industries.length - 1) * 120; // Space between items
            const legendStartX = (this.width - legendTotalWidth) / 2;
            const x = legendStartX + (i * 120);
            
            // Legend square
            this.sceneGroup.append('rect')
                .attr('x', x)
                .attr('y', startY)
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', industry.color)
                .attr('stroke', '#666')
                .attr('stroke-width', 0.5)
                .style('opacity', 0)
                .transition()
                .delay(this.animationDuration * 3 + i * 100)
                .duration(300)
                .style('opacity', 1);
            
            // Legend text
            this.sceneGroup.append('text')
                .attr('x', x + 18)
                .attr('y', startY + 9)
                .style('font-size', '11px')
                .style('fill', '#555')
                .text(industry.name)
                .style('opacity', 0)
                .transition()
                .delay(this.animationDuration * 3 + i * 100)
                .duration(300)
                .style('opacity', 1);
        });
    }
    
    getEventColor(eventIndex) {
        // Use shared color palette for consistency across scenes
        return ColorPalette.getEventColor(eventIndex);
    }
    
    getPopulationForYear(year) {
        const dataPoint = this.medievalData.data.find(d => d.year === year);
        return dataPoint ? dataPoint.population : null;
    }
    
    getGDPForYear(year) {
        const dataPoint = this.medievalData.data.find(d => d.year === year);
        return dataPoint ? dataPoint.gdpReal : null;
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
        const economicContext = this.getEconomicContext(d.year);
        const indicator = isPrimaryPopulation ? 'Population' : 'GDP';
        
        let tooltipContent = `<div style="border-bottom: 1px solid #444; margin-bottom: 8px; padding-bottom: 6px;">`;
        tooltipContent += `<strong style="color: #d4a574; font-size: 15px;">${d.year} - ${economicContext.period}</strong></div>`;
        
        // Get both population and GDP data for this year
        const populationForYear = this.getPopulationForYear(d.year);
        const gdpForYear = this.getGDPForYear(d.year);
        
        // Always show population
        if (populationForYear) {
            const popThousands = populationForYear.toFixed(0);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>Population:</strong> ${popThousands} thousand</div>`;
        } else {
            const estimatedPop = this.estimatePopulation(d.year);
            const popThousands = estimatedPop.toFixed(0);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>Population:</strong> ${popThousands} thousand (estimated)</div>`;
        }
        
        // Always show GDP if available
        if (gdpForYear) {
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>GDP:</strong> £${gdpForYear.toFixed(1)}M (2013 prices)</div>`;
            
            // Calculate proper GDP per capita
            const population = populationForYear || this.estimatePopulation(d.year);
            const gdpPerCapita = (gdpForYear * 1000000) / (population * 1000);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>GDP per capita:</strong> £${gdpPerCapita.toFixed(0)}</div>`;
        } else {
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>GDP:</strong> Not available for this period</div>`;
        }
        
        tooltipContent += `<div style="background: rgba(100,50,0,0.3); padding: 6px; border-radius: 3px; margin-bottom: 8px;">`;
        tooltipContent += `<strong style="color: #FFB74D;">Economic Structure:</strong><br/>`;
        tooltipContent += `<small>${economicContext.structure}</small></div>`;
        
        tooltipContent += `<div style="background: rgba(0,50,100,0.3); padding: 6px; border-radius: 3px; margin-bottom: 8px;">`;
        tooltipContent += `<strong style="color: #90CAF9;">Key Industries:</strong><br/>`;
        tooltipContent += `<small>${economicContext.industries}</small></div>`;
        
        tooltipContent += `<div style="background: rgba(50,0,100,0.3); padding: 6px; border-radius: 3px; margin-bottom: 8px;">`;
        tooltipContent += `<strong style="color: #CE93D8;">Social Context:</strong><br/>`;
        tooltipContent += `<small>${economicContext.social}</small></div>`;
        
        tooltipContent += `<div style="font-size: 11px; opacity: 0.8; text-align: center;">`;
        tooltipContent += `<em>Click data point for detailed analysis</em></div>`;
        
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 6px 20px rgba(0,0,0,0.4)')
            .style('border', '1px solid #333')
            .style('max-width', '320px')
            .style('line-height', '1.5')
            .html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 340) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    showDetailedStory(event, d, isPrimaryPopulation) {
        // This would be implemented by each scene with specific content
        console.log('Detailed story clicked:', d);
    }
    
    showIndustryBreakdownTooltip(event, data, colors, names) {
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '6px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
            .style('border', '1px solid #333')
            .style('max-width', '200px')
            .style('line-height', '1.4');
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #444; padding-bottom: 4px;">`;
        tooltipContent += `Year: ${data.year}</div>`;
        tooltipContent += `<div style="margin-bottom: 4px;"><span style="color: ${colors[0]}">●</span> ${names[0]}: ${data.agriculture}%</div>`;
        tooltipContent += `<div style="margin-bottom: 4px;"><span style="color: ${colors[1]}">●</span> ${names[1]}: ${data.crafts}%</div>`;
        tooltipContent += `<div style="margin-bottom: 4px;"><span style="color: ${colors[2]}">●</span> ${names[2]}: ${data.services}%</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 220) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
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
        // Scene-specific no data message
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('fill', '#666')
            .text('No economic data available for this period');
    }
    
    exit() {
        // Clean up scene-specific resources
        this.sceneGroup.selectAll('*').remove();
    }
}