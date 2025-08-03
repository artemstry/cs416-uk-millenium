/**
 * Scene 2: Great Awakening (1500-1750)
 * Shows early modern economic transformation - trade expansion, manufacturing growth, financial innovations
 * USING EXACT SAME STRUCTURE AS SCENE 1
 */

export class Scene2GreatAwakening {
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = 1000;
        
        // Great Awakening period data (1500-1750) with null safety
        if (!data || !data.periods || !data.periods.awakening) {
            console.error('❌ Scene2GreatAwakening: Data not loaded yet!', data);
            throw new Error('Data not available for Great Awakening scene. Please wait for data to load.');
        }
        this.awakeningData = data.periods.awakening;
        
        // Chart dimensions - using Scene 1 template
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 };
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
        const chartHeight = (this.height - 150) * 1.3;
        
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
        const yAxis = d3.axisLeft(this.yScale);
        
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
        // Great Awakening specific historical events
        const historicalEvents = [
            {
                year: 1517,
                event: 'Protestant Reformation',
                story: 'Martin Luther\'s challenge to Catholic Church authority in 1517 triggered a religious revolution that transformed not just spiritual life but economic structures across Europe. The dissolution of monasteries freed vast amounts of land for private ownership and commercial use.',
                story2: 'In England, Henry VIII\'s break with Rome (1534) created opportunities for new merchant classes while disrupting traditional economic relationships. The redistribution of monastic lands to secular owners accelerated the commercialization of agriculture and created a new Protestant work ethic that would fuel economic growth.',
                economicEffect: 'Dissolution of monasteries released ~25% of English land to private ownership. New Protestant values emphasized individual enterprise and commercial success, laying groundwork for capitalist development.',
                longTermImpact: 'Protestant work ethic and emphasis on material success as divine blessing fundamentally altered English economic culture, contributing to entrepreneurial spirit that would drive later industrial development.',
                impact: 'social',
                y: 80
            },
            {
                year: 1588,
                event: 'Spanish Armada Defeated',
                story: 'The defeat of the Spanish Armada in 1588 marked England\'s emergence as a major naval power, challenging Spanish dominance of global trade routes. This victory opened the Atlantic and beyond to English merchants and adventurers.',
                story2: 'The naval triumph unleashed a wave of English exploration and colonization efforts. Joint-stock companies formed to exploit new trading opportunities, while privateering against Spanish treasure fleets brought wealth directly into English hands. The psychological impact was equally important - England saw itself as destined for global commercial leadership.',
                economicEffect: 'Immediate access to previously Spanish-controlled trade routes. Privateering yielded estimated £200,000+ annually. Maritime insurance and shipbuilding industries expanded rapidly to support growing merchant fleet.',
                longTermImpact: 'Naval supremacy enabled England to develop global trading networks and colonial empire, providing markets for English goods and sources of raw materials that would fuel centuries of economic expansion.',
                impact: 'positive',
                y: 100
            },
            {
                year: 1600,
                event: 'East India Company Founded',
                story: 'The founding of the East India Company represented a revolutionary approach to long-distance trade. Rather than individual merchants risking their fortunes, the joint-stock structure allowed multiple investors to pool resources and share both risks and profits of Asian trade.',
                story2: 'This corporate innovation proved immensely successful, generating returns of 20-30% annually for early investors. The Company pioneered modern business practices: professional management, standardized accounting, and reinvestment of profits. Its success inspired countless imitators and established the template for modern capitalism.',
                economicEffect: 'Initial capital of £70,000 grew to over £3 million by 1700. Asian trade yielded luxury goods (spices, silk, tea, porcelain) that generated enormous profit margins - often 300-400% on successful voyages.',
                longTermImpact: 'Joint-stock model became foundation of modern corporate capitalism. Company eventually controlled much of India, demonstrating how commercial organizations could become quasi-governmental powers.',
                impact: 'positive',
                y: 70
            },
            {
                year: 1650,
                event: 'Agricultural Revolution Begins',
                story: 'The introduction of new crops from the Americas (potatoes, maize, tomatoes) and innovative farming techniques dramatically increased agricultural productivity. The "Norfolk four-course system" eliminated need for fallow fields while restoring soil fertility.',
                story2: 'These improvements supported larger populations while requiring less labor, freeing workers for manufacturing and trade. Enclosure of common lands, while socially disruptive, created larger, more efficient farms. Agricultural surplus provided both food for growing cities and capital for investment in other sectors.',
                economicEffect: 'Agricultural productivity increased by 40-50% between 1650-1750. Population grew from ~5 million to ~6.5 million while agricultural workforce remained stable, releasing ~500,000 workers for other activities.',
                longTermImpact: 'Agricultural revolution was prerequisite for industrial revolution. Surplus rural labor became urban workforce, while agricultural profits provided capital for industrial investment. Food security enabled economic specialization.',
                impact: 'positive',
                y: 90
            },
            {
                year: 1694,
                event: 'Bank of England Founded',
                story: 'The Bank of England, established to help finance King William\'s wars against France, represented a fundamental innovation in government finance. Rather than relying on irregular taxation or loans from merchants, the government could now access systematic credit.',
                story2: 'The Bank quickly evolved beyond its original purpose, becoming the cornerstone of England\'s financial system. It standardized currency, provided commercial credit, and created a market for government bonds. This financial infrastructure enabled England to sustain higher levels of government spending and private investment than any rival.',
                economicEffect: 'Government debt service dropped from 14% to 6% interest rates. Bank issued £1.2 million in notes by 1700, increasing money supply and enabling expanded commerce. Credit became available for private ventures.',
                longTermImpact: 'Modern central banking enabled England to finance both colonial expansion and eventual industrial revolution. Stable currency and credit system became competitive advantages that helped secure English economic dominance.',
                impact: 'positive',
                y: 110
            }
        ];
        
        // Filter events that fall within our data range
        const relevantEvents = historicalEvents.filter(event => {
            const domain = this.xScale.domain();
            return event.year >= domain[0] && event.year <= domain[1];
        });
        
        // Add event markers using original styling
        relevantEvents.forEach((event, i) => {
            const x = this.xScale(event.year);
            const y = event.y;
            
            // Add vertical line using original color
            this.sceneGroup.append('line')
                .attr('class', 'event-line')
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', x)
                .attr('y2', this.height - 95) // Go all the way to X-axis (economic structure area)
                .attr('stroke', this.getEventColor(event.impact))
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .style('opacity', this.animationDuration > 0 ? 0 : 1)
                .transition()
                .delay(this.animationDuration * 3 + i * 300)
                .duration(500)
                .style('opacity', 0.6);
            
            // Add event circle using original color
            this.sceneGroup.append('circle')
                .attr('class', 'event-marker')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 6)
                .attr('fill', this.getEventColor(event.impact))
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .style('opacity', this.animationDuration > 0 ? 0 : 1)
                .on('click', (event) => this.showEventStory(event))
                .transition()
                .delay(this.animationDuration * 3 + i * 300)
                .duration(500)
                .style('opacity', 1);
            
            // Add event label
            this.sceneGroup.append('text')
                .attr('class', 'event-label')
                .attr('x', x + 10)
                .attr('y', y - 10)
                .attr('text-anchor', 'start')
                .style('font-size', '11px')
                .style('font-weight', 'bold')
                .style('fill', this.getEventColor(event.impact))
                .style('opacity', this.animationDuration > 0 ? 0 : 1)
                .text(`${event.year} - ${event.event}`)
                .transition()
                .delay(this.animationDuration * 3 + i * 300 + 200)
                .duration(500)
                .style('opacity', 1);
        });
    }
    
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
            .text('Great Awakening (1500-1750)')
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
            .text('From Medieval Stagnation to Early Modern Growth')
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
        const availableYears = this.awakeningData.data
            .filter(d => d.population !== null || d.gdpReal !== null)
            .map(d => d.year);
        
        if (availableYears.length === 0) return;
        
        const actualStartYear = Math.min(...availableYears);
        const actualEndYear = Math.max(...availableYears);
        
        // Use the same X-scale as the main chart to ensure proper alignment
        const xScale = this.xScale || d3.scaleLinear()
            .domain([actualStartYear - 10, Math.max(actualEndYear + 10, 1750)])
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
        
        // Draw each industry layer
        const industryNames = ['agriculture', 'crafts', 'services'];
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Steel Blue, Medium Purple
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
    
    addIndustryLegend(startY) {
        const industries = [
            { name: 'Agriculture', color: '#8B4513' },
            { name: 'Crafts & Trade', color: '#4682B4' },
            { name: 'Services', color: '#9370DB' }
        ];
        
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
    
    getEventColor(impact) {
        const colors = {
            'devastating': '#d32f2f',
            'social': '#f57c00',
            'recovery': '#388e3c',
            'positive': '#1976d2',
            'negative': '#d32f2f'
        };
        return colors[impact] || '#666';
    }
    
    showEnhancedTooltip(event, d, isPrimaryPopulation) {
        const tooltip = d3.select('#tooltip');
        const population = d.population || d.value;
        const gdp = d.gdpReal || d.value;
        
        let content = `
            <div class="tooltip-content">
                <strong>Year: ${d.year}</strong><br>
                ${isPrimaryPopulation ? 
                    `Population: ${d3.format(',')(population)} thousand` :
                    `GDP: £${d3.format(',')(gdp)} million (2013 prices)`
                }
        `;
        
        if (population && gdp) {
            const gdpPerCapita = (gdp * 1000000) / (population * 1000); // Convert to same units
            content += `<br>GDP per capita: £${d3.format(',')(Math.round(gdpPerCapita))}`;
        }
        
        content += '</div>';
        
        tooltip
            .style('opacity', 1)
            .html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }
    
    showDetailedStory(event, d, isPrimaryPopulation) {
        // This would be implemented by each scene with specific content
        console.log('Detailed story clicked:', d);
    }
    
    showIndustryBreakdownTooltip(event, data, colors, names) {
        const tooltip = d3.select('#tooltip');
        
        const content = `
            <div class="tooltip-content">
                <strong>Year: ${data.year}</strong><br>
                <span style="color: ${colors[0]}">${names[0]}: ${data.agriculture}%</span><br>
                <span style="color: ${colors[1]}">${names[1]}: ${data.crafts}%</span><br>
                <span style="color: ${colors[2]}">${names[2]}: ${data.services}%</span>
            </div>
        `;
        
        tooltip
            .style('opacity', 1)
            .html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }
    
    hideTooltip() {
        d3.select('#tooltip')
            .style('opacity', 0);
    }
    
    // Scene-specific data methods
    getPeriodForYear(year) {
        if (year <= 1550) {
            return 'Early Reformation';
        } else if (year <= 1650) {
            return 'Early Colonial Commerce';
        } else if (year <= 1700) {
            return 'Financial Revolution Era';
        } else {
            return 'Pre-Industrial Transformation';
        }
    }
    
    getIndustriesForPeriod(period) {
        switch (period) {
            case 'Early Reformation':
                return [
                    { key: 'agriculture', percentage: 70 },
                    { key: 'crafts', percentage: 20 },
                    { key: 'services', percentage: 10 }
                ];
            case 'Early Colonial Commerce':
                return [
                    { key: 'agriculture', percentage: 60 },
                    { key: 'crafts', percentage: 35 },
                    { key: 'services', percentage: 5 }
                ];
            case 'Financial Revolution Era':
                return [
                    { key: 'agriculture', percentage: 55 },
                    { key: 'crafts', percentage: 40 },
                    { key: 'services', percentage: 5 }
                ];
            case 'Pre-Industrial Transformation':
                return [
                    { key: 'agriculture', percentage: 50 },
                    { key: 'crafts', percentage: 45 },
                    { key: 'services', percentage: 5 }
                ];
            default:
                return [
                    { key: 'agriculture', percentage: 60 },
                    { key: 'crafts', percentage: 35 },
                    { key: 'services', percentage: 5 }
                ];
        }
    }
    
    showEventStory(event) {
        // Scene-specific event story implementation
        console.log('Event story clicked:', event);
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