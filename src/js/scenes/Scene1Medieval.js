/**
 * Scene 1: Medieval Times (1209-1500)
 * Shows the economic "dark ages" - sparse data, slow growth, high volatility
 */

import { ColorPalette } from '../utils/ColorPalette.js';

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
        
        // Chart setup - 50% taller Y-axis for better visualization
        const chartHeight = (this.height - 150) * 1.15;
        
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
        // X-axis
        const xAxis = d3.axisBottom(this.xScale)
            .tickFormat(d3.format('d'))
            .ticks(8);
        
        this.sceneGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis);
        
        // Y-axis
        const yAxisLabel = isPrimaryPopulation ? 'Population (thousands)' : 'Real GDP (£M, 2013 prices)';
        const yAxis = d3.axisLeft(this.yScale)
            .tickFormat(d => {
                if (isPrimaryPopulation) {
                    return d3.format(',')(d);
                } else {
                    // For GDP, show in millions with M suffix
                    return d3.format('.0f')(d) + 'M';
                }
            });
        
        this.sceneGroup.append('g')
            .attr('class', 'y-axis')
            .call(yAxis);
        
        // Y-axis label
        this.sceneGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -60)
            .attr('x', -chartHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(yAxisLabel);
        
        // X-axis label
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', chartHeight + 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Year');
    }
    
    renderMainTrendLine(data, isPrimaryPopulation) {
        // Create line generator
        const line = d3.line()
            .x(d => this.xScale(d.year))
            .y(d => this.yScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // Main trend line
        const path = this.sceneGroup.append('path')
            .datum(data)
            .attr('class', 'main-trend-line')
            .attr('fill', 'none')
            .attr('stroke', isPrimaryPopulation ? '#2E7D32' : '#1565C0')
            .attr('stroke-width', 3) // Back to previous thickness
            .attr('d', line);
        
        // Animate line drawing (only if animationDuration > 0)
        if (this.animationDuration > 0) {
            const totalLength = path.node().getTotalLength();
            path
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(this.animationDuration * 2)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        }
        
        // Add data points with enhanced interactivity - smaller, less "bubbly"
        this.sceneGroup.selectAll('.story-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'story-point')
            .attr('cx', d => this.xScale(d.year))
            .attr('cy', d => this.yScale(d.value))
            .attr('r', 2.5) // Back to previous size
            .attr('fill', isPrimaryPopulation ? '#2E7D32' : '#1565C0')
            .attr('stroke', 'white')
            .attr('stroke-width', 1) // Thinner stroke
            .style('cursor', 'pointer')
            .style('opacity', this.animationDuration > 0 ? 0 : 1) // Show immediately if no animation
            .on('mouseover', (event, d) => this.showEnhancedTooltip(event, d, isPrimaryPopulation))
            .on('mouseout', () => this.hideTooltip())
            .on('click', (event, d) => this.showDetailedStory(event, d, isPrimaryPopulation))
            .attr('r', 3); // Final size back to previous
        
        // Animate data points only if animation is enabled
        if (this.animationDuration > 0) {
            this.sceneGroup.selectAll('.story-point')
                .transition()
                .duration(this.animationDuration)
                .delay((d, i) => i * 50 + this.animationDuration * 2)
                .style('opacity', 1);
        }
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
        
        // Add event markers with dynamic positioning and enhanced styling
        relevantEvents.forEach((historicalEvent, i) => {
            const x = this.xScale(historicalEvent.year);
            // Dynamic Y positioning based on event type and index for better visual distribution
            const baseY = 140;
            const yOffset = (i % 2 === 0) ? 0 : 60; // Alternate high/low positioning
            const y = baseY + yOffset;
            
            // Add vertical line using vibrant color
            this.sceneGroup.append('line')
                .attr('class', 'event-line')
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', x)
                .attr('y2', this.height - 95) // Go all the way to X-axis (economic structure area)
                .attr('stroke', this.getEventColor(i))
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .style('opacity', this.animationDuration > 0 ? 0 : 1)
                .transition()
                .delay(this.animationDuration * 3 + i * 300)
                .duration(500)
                .style('opacity', 0.6);
            
            // Add enhanced event circle with glow effect
            const eventCircle = this.sceneGroup.append('circle')
                .attr('class', 'event-marker')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 0) // Start small for animation
                .attr('fill', this.getEventColor(i))
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .style('opacity', this.animationDuration > 0 ? 0 : 1)
                .style('filter', 'drop-shadow(0 0 4px ' + this.getEventColor(i) + ')') // Add glow effect
                .on('mouseover', (event) => {
                    this.showEventTooltip(event, historicalEvent, this.getEventColor(i));
                    eventCircle.transition().duration(200).attr('r', 8); // Expand on hover
                })
                .on('mouseout', () => {
                    this.hideTooltip();
                    eventCircle.transition().duration(200).attr('r', 6); // Return to normal size
                })
                .on('click', (event) => this.showEventStory(historicalEvent, this.getEventColor(i)));
            
            // Animate circle appearance
            eventCircle.transition()
                .delay(this.animationDuration * 3 + i * 300)
                .duration(500)
                .attr('r', 6)
                .style('opacity', 1);
            
            // Add enhanced event label with background
            const labelGroup = this.sceneGroup.append('g')
                .attr('class', 'event-label-group')
                .style('opacity', this.animationDuration > 0 ? 0 : 1);
            
            // Add background rectangle for better readability
            const labelText = `${historicalEvent.year} - ${historicalEvent.event}`;
            const labelWidth = labelText.length * 6; // Approximate width
            const labelHeight = 16;
            
            labelGroup.append('rect')
                .attr('x', x + 8)
                .attr('y', y - 22)
                .attr('width', labelWidth + 8)
                .attr('height', labelHeight)
                .attr('fill', 'rgba(255, 255, 255, 0.9)')
                .attr('stroke', this.getEventColor(i))
                .attr('stroke-width', 1)
                .attr('rx', 3);
            
            // Add text label
            labelGroup.append('text')
                .attr('class', 'event-label')
                .attr('x', x + 12)
                .attr('y', y - 10)
                .attr('text-anchor', 'start')
                .style('font-size', '10px')
                .style('font-weight', 'bold')
                .style('fill', this.getEventColor(i))
                .text(labelText);
            
            // Animate label appearance
            labelGroup.transition()
                .delay(this.animationDuration * 3 + i * 300 + 200)
                .duration(500)
                .style('opacity', 1);
        });
    }
    
    // Scene-specific data methods
    addSceneTitle() {
        // Main title - positioned much higher to avoid any overlap
        this.sceneGroup.append('text')
            .attr('class', 'scene-title')
            .attr('x', this.width / 2)
            .attr('y', -70) // Move header much further down to be fully visible
            .attr('text-anchor', 'middle')
            .style('font-size', '22px')
            .style('font-weight', 'bold')
            .style('fill', '#1f4e79')
            .style('opacity', 0)
            .text('Medieval Times (1209-1500)')
            .transition()
            .duration(500)
            .style('opacity', 1);
        
        // Subtitle - also positioned much higher
        this.sceneGroup.append('text')
            .attr('class', 'scene-subtitle')
            .attr('x', this.width / 2)
            .attr('y', -40) // Move subtitle much further down to be fully visible
            .attr('text-anchor', 'middle')
            .style('font-size', '15px')
            .style('fill', '#666')
            .style('opacity', 0)
            .text('Centuries of Economic Stagnation Before Transformation')
            .transition()
            .delay(200)
            .duration(500)
            .style('opacity', 1);
    }
    
    addEconomicStructure() {
        // Create a skinny industry breakdown visualization under the main chart
        const breakdownHeight = 80;
        const breakdownY = this.height - 20;  // Moved down even further to avoid overlap
        
        // Add "Economic Structure" header
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', breakdownY - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text('Economic Structure');
        
        // Get the data range for the breakdown
        const availableYears = this.medievalData.data
            .filter(d => d.population !== null || d.gdpReal !== null)
            .map(d => d.year);
        
        if (availableYears.length === 0) return;
        
        const actualStartYear = Math.min(...availableYears);
        const actualEndYear = Math.max(...availableYears);
        
        // Use the same X-scale as the main chart to ensure proper alignment
        const xScale = this.xScale || d3.scaleLinear()
            .domain([actualStartYear - 10, Math.max(actualEndYear + 10, 1500)])
            .range([0, this.width]);
        
        // Create a single fluid industry visualization - taller and more detailed
        const fluidHeight = 60;
        
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
        
        // Create stacked area chart using D3's stack generator
        const stack = d3.stack()
            .keys(['agriculture', 'crafts', 'services']);
        
        const stackedData = stack(timePoints);
        
        // Create area generator
        const area = d3.area()
            .x(d => xScale(d.data.year))
            .y0(d => breakdownY + fluidHeight - (d[0] / 100) * fluidHeight)
            .y1(d => breakdownY + fluidHeight - (d[1] / 100) * fluidHeight)
            .curve(d3.curveBasis);
        
        // Industry group container
        const industryGroup = this.sceneGroup.append('g')
            .attr('class', 'industry-breakdown');
        
        // Draw each industry layer with colors that match the CSS
        const industryNames = ['agriculture', 'crafts', 'services'];
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Blue, Purple
        const industryFullNames = ['Agriculture', 'Crafts & Trade', 'Services'];
        
        stackedData.forEach((layer, i) => {
            industryGroup.append('path')
                .datum(layer)
                .attr('class', `industry-area ${industryNames[i]}`)
                .attr('fill', industryColors[i])
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .style('opacity', 0)
                .attr('d', area)
                .transition()
                .delay(this.animationDuration * 2 + i * 200)
                .duration(1000)
                .style('opacity', 0.8);
        });
        
        // Add interactive overlay for mouse tracking
        const overlay = industryGroup.append('rect')
            .attr('class', 'industry-overlay')
            .attr('x', 0)
            .attr('y', breakdownY)
            .attr('width', this.width)
            .attr('height', fluidHeight)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .style('cursor', 'crosshair');
        
        // Add vertical tracking line (initially hidden)
        const trackingLine = industryGroup.append('line')
            .attr('class', 'tracking-line')
            .attr('y1', breakdownY)
            .attr('y2', breakdownY + fluidHeight)
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .style('opacity', 0);
        
        // Mouse interaction handlers
        overlay
            .on('mouseover', () => {
                trackingLine.style('opacity', 0.7);
            })
            .on('mousemove', (event) => {
                const [mouseX] = d3.pointer(event);
                const year = Math.round(xScale.invert(mouseX));
                
                // Update tracking line position
                trackingLine.attr('x1', mouseX).attr('x2', mouseX);
                
                // Find closest data point (more robust than exact match)
                const closestData = timePoints.reduce((closest, current) => {
                    const currentDiff = Math.abs(current.year - year);
                    const closestDiff = Math.abs(closest.year - year);
                    return currentDiff < closestDiff ? current : closest;
                });
                
                // Show comprehensive tooltip with closest year data
                this.showIndustryBreakdownTooltip(event, {
                    year: closestData.year,
                    mouseYear: year, // Show what year the mouse is actually over
                    agriculture: closestData.agriculture,
                    crafts: closestData.crafts,
                    services: closestData.services
                }, industryColors, industryFullNames);
            })
            .on('mouseout', () => {
                trackingLine.style('opacity', 0);
                this.hideTooltip();
            });
        
        // Add legend
        this.addIndustryLegend(breakdownY + fluidHeight + 15);
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
        d3.selectAll('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
    }
    
    showEventTooltip(event, historicalEvent, markerColor) {
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
            .style('border', `2px solid ${markerColor}`)
            .style('max-width', '250px')
            .style('line-height', '1.4');
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 6px; color: ${markerColor};">${historicalEvent.year} - ${historicalEvent.event}</div>`;
        tooltipContent += `<div style="border-bottom: 1px solid ${markerColor}; margin-bottom: 8px; padding-bottom: 4px;"></div>`;
        tooltipContent += `<div style="margin-bottom: 8px; font-size: 12px;">${historicalEvent.story}</div>`;
        tooltipContent += `<div style="font-size: 11px; font-style: italic; opacity: 0.9;">Impact: ${historicalEvent.economicEffect}</div>`;
        tooltipContent += `<div style="text-align: center; margin-top: 6px; font-size: 10px; opacity: 0.8;">Click event marker for full story</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 270) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    showEventStory(historicalEvent, markerColor) {
        // Scene-specific event story implementation
        console.log('Event story clicked:', historicalEvent);
        
        // Create a detailed story modal or enhanced tooltip
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        tooltip.enter().append('div').attr('class', 'tooltip')
            .merge(tooltip)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.95)')
            .style('color', 'white')
            .style('padding', '15px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 8px 25px rgba(0,0,0,0.5)')
            .style('border', `2px solid ${markerColor}`)
            .style('max-width', '400px')
            .style('line-height', '1.6');
        
        let storyContent = `<div style="border-bottom: 2px solid ${markerColor}; margin-bottom: 12px; padding-bottom: 8px;">`;
        storyContent += `<strong style="color: ${markerColor}; font-size: 16px;">${historicalEvent.year} - ${historicalEvent.event}</strong></div>`;
        storyContent += `<div style="margin-bottom: 12px; font-size: 14px;">${historicalEvent.story}</div>`;
        storyContent += `<div style="margin-bottom: 12px; font-size: 14px;">${historicalEvent.story2}</div>`;
        storyContent += `<div style="background: rgba(255,193,7,0.2); padding: 8px; border-radius: 4px; margin-bottom: 12px;">`;
        storyContent += `<strong style="color: #FFC107;">Economic Impact:</strong><br/>`;
        storyContent += `<small>${historicalEvent.economicEffect}</small></div>`;
        storyContent += `<div style="background: rgba(76,175,80,0.2); padding: 8px; border-radius: 4px; margin-bottom: 12px;">`;
        storyContent += `<strong style="color: #4CAF50;">Long-term Impact:</strong><br/>`;
        storyContent += `<small>${historicalEvent.longTermImpact}</small></div>`;
        
        tooltip.html(storyContent)
            .style('left', Math.min(window.innerWidth / 2 - 200, window.innerWidth - 420) + 'px')
            .style('top', Math.max(window.innerHeight / 2 - 150, 20) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(300)
            .style('opacity', 1);
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