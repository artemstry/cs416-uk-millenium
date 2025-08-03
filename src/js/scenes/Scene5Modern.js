/**
 * Scene 5: Modern Service Economy (1950-2016)
 * Shows post-war boom, service economy rise, technology revolution, globalization
 * USING EXACT SAME STRUCTURE AS SCENE 1
 */

export class Scene5Modern {
    constructor(sceneGroup, data, parameters) {
        this.sceneGroup = sceneGroup;
        this.data = data;
        this.parameters = parameters;
        this.animationDuration = 1000;
        
        // Modern period data (1950-2016) with null safety
        if (!data || !data.periods || !data.periods.modern) {
            console.error('❌ Scene5Modern: Data not loaded yet!', data);
            throw new Error('Data not available for Modern scene. Please wait for data to load.');
        }
        this.modernData = data.periods.modern;
        
        // Chart dimensions - same as Scene 1
        this.margin = { top: 100, right: 80, bottom: 80, left: 100 };
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
        
        // Render main chart (same pattern as Scene 1)
        this.renderPopulationChart();
        
        // Add scene title and description
        this.addSceneTitle();
        
        // Add economic structure visualization
        this.addEconomicStructure();
        
        return this;
    }
    
    addSceneTitle() {
        // Main title
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', -80)
            .attr('text-anchor', 'middle')
            .style('font-size', '22px')
            .style('font-weight', 'bold')
            .style('fill', '#1f4e79')
            .text('Modern Service Economy (1950-2016)');
        
        // Subtitle
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', -55)
            .attr('text-anchor', 'middle')
            .style('font-size', '15px')
            .style('fill', '#666')
            .text('Technology, Services, and the Global Economy');
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
        
        // Use GDP as primary for Modern period (shows steady growth)
        const primaryData = gdpData.length > 0 ? gdpData : populationData;
        const isPrimaryPopulation = gdpData.length === 0;
        
        if (primaryData.length === 0) {
            this.renderStagnationStory();
            return;
        }
        
        // Chart setup - proper height to avoid overlap with industry breakdown
        const chartHeight = (this.height - 150) * 1.3; // Using Scene 1 template
        
        // Determine actual data range
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
        
        // Add future preview
        this.addFuturePreview();
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
        
        // Add trend line - smooth green for modern growth
        // Main trend line - using Scene 1 template
        const path = this.sceneGroup.append('path')
            .datum(data)
            .attr('class', 'main-trend-line')
            .attr('fill', 'none')
            .attr('stroke', isPrimaryPopulation ? '#2E7D32' : '#1565C0')
            .attr('stroke-width', 3)
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
        
        // Add data points with enhanced tooltips
        this.sceneGroup.selectAll('.data-point')
            .data(data)
            .enter().append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => this.xScale(d.year))
            .attr('cy', d => this.yScale(d.value))
            .attr('r', 2.5) // Match Scene 1 size
            .attr('fill', isPrimaryPopulation ? '#2E7D32' : '#1565C0') // Match Scene 1 colors
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => this.showEnhancedTooltip(event, d, isPrimaryPopulation))
            .on('mouseout', () => this.hideTooltip());
    }
    
    addInteractiveStoryPoints(isPrimaryPopulation) {
        // Modern Service Economy specific historical events
        const historicalEvents = [
            {
                year: 1957,
                event: 'Treaty of Rome (EU)',
                story: 'UK initially stays out, but European integration reshapes global trade',
                economicEffect: 'European integration creates competitive pressure and new trade opportunities',
                impact: 'positive',
                y: 80
            },
            {
                year: 1971,
                event: 'Bretton Woods Ends',
                story: 'Fixed exchange rate system collapses, beginning era of financial liberalization',
                economicEffect: 'Floating currencies enable financial innovation but increase volatility',
                impact: 'social',
                y: 100
            },
            {
                year: 1979,
                event: 'Thatcher Era Begins',
                story: 'Conservative revolution privatizes industries and deregulates financial markets',
                economicEffect: 'Market-oriented reforms boost productivity but increase inequality',
                impact: 'positive',
                y: 70
            },
            {
                year: 1990,
                event: 'World Wide Web',
                story: 'Internet revolution transforms commerce, communication, and economic structure',
                economicEffect: 'Digital technology enables new industries and global service delivery',
                impact: 'positive',
                y: 90
            },
            {
                year: 2008,
                event: 'Financial Crisis',
                story: 'Global financial system collapse triggers worst recession since 1930s',
                economicEffect: 'Banking crisis forces government intervention and economic rethinking',
                impact: 'devastating',
                y: 110
            }
        ];
        
        // Filter events that fall within our data range
        const relevantEvents = historicalEvents.filter(event => {
            const domain = this.xScale.domain();
            return event.year >= domain[0] && event.year <= domain[1];
        });
        
        // Add event markers
        const eventGroup = this.sceneGroup.selectAll('.historical-event')
            .data(relevantEvents)
            .enter().append('g')
            .attr('class', 'historical-event')
            .style('cursor', 'pointer');
        
        // Event circles - modern styling
        eventGroup.append('circle')
            .attr('cx', d => this.xScale(d.year))
            .attr('cy', d => d.y)
            .attr('r', 8)
            .attr('fill', d => this.getEventColor(d.impact))
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('opacity', 0.9);
        
        // Event labels
        eventGroup.append('text')
            .attr('x', d => this.xScale(d.year))
            .attr('y', d => d.y - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text(d => d.event);
        
        // Add interactivity - click only, no tooltip on hover
        eventGroup
            .on('click', (event, d) => this.showEventStory(d));
    }
    
    addFuturePreview() {
        // Add subtle preview of next period
        const previewText = this.sceneGroup.append('text')
            .attr('x', this.width - 20)
            .attr('y', 30)
            .attr('text-anchor', 'end')
            .style('font-size', '12px')
            .style('fill', '#999')
            .style('font-style', 'italic')
            .style('cursor', 'pointer')
            .text('Next: Interactive Exploration →')
            .on('click', () => console.log('Navigate to Scene 6'));
    }
    
    getEventColor(impact) {
        const colors = {
            'devastating': '#d32f2f',
            'social': '#f57c00',
            'recovery': '#388e3c',
            'positive': '#1976d2'
        };
        return colors[impact] || '#666';
    }
    
    getPopulationForYear(year) {
        const dataPoint = this.modernData.data.find(d => d.year === year);
        return dataPoint ? dataPoint.population : null;
    }
    
    getGDPForYear(year) {
        const dataPoint = this.modernData.data.find(d => d.year === year);
        return dataPoint ? dataPoint.gdpReal : null;
    }
    
    estimatePopulation(year) {
        // Modern period population estimates
        if (year <= 1970) return 50000;
        if (year <= 1990) return 55000;
        if (year <= 2010) return 62000;
        return 65000;
    }
    
    showEventTooltip(event, historicalEvent) {
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
            .style('border', '2px solid white')
            .style('max-width', '250px')
            .style('line-height', '1.4');
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 6px;">${historicalEvent.year} - ${historicalEvent.event}</div>`;
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
            const popMillions = (populationForYear / 1000).toFixed(1);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>Population:</strong> ${popMillions}M</div>`;
        } else {
            const estimatedPop = this.estimatePopulation(d.year);
            const popMillions = (estimatedPop / 1000).toFixed(1);
            tooltipContent += `<div style="margin-bottom: 8px;"><strong>Population:</strong> ${popMillions}M</div>`;
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
    
    getEconomicContext(year) {
        // Modern Service Economy period context (1950-2016)
        if (year <= 1970) {
            return {
                period: 'Post-War Golden Age',
                structure: 'Mixed economy with expanding welfare state and full employment',
                industries: 'Agriculture (5%), Manufacturing (45%), Services (50%)',
                social: 'Welfare state expansion, full employment, rising living standards, social mobility'
            };
        } else if (year <= 1980) {
            return {
                period: 'Stagflation Crisis',
                structure: 'Economic stagnation combined with inflation challenges Keynesian consensus',
                industries: 'Agriculture (3%), Manufacturing (35%), Services (62%)',
                social: 'Industrial unrest, three-day week, IMF bailout, economic confidence shaken'
            };
        } else if (year <= 1990) {
            return {
                period: 'Thatcher Revolution',
                structure: 'Market liberalization, privatization, and financial deregulation',
                industries: 'Agriculture (2%), Manufacturing (25%), Services (73%)',
                social: 'Deindustrialization, financial sector growth, rising inequality, enterprise culture'
            };
        } else if (year <= 2000) {
            return {
                period: 'New Labour Prosperity',
                structure: 'Service-based economy with strong financial sector and EU integration',
                industries: 'Agriculture (1%), Manufacturing (20%), Services (79%)',
                social: 'Cool Britannia, New Labour third way, rising house prices, economic optimism'
            };
        } else if (year <= 2010) {
            return {
                period: 'Financial Crisis Era',
                structure: 'Banking crisis reveals over-dependence on financial services',
                industries: 'Agriculture (1%), Manufacturing (15%), Services (84%)',
                social: 'Banking bailouts, recession, rising unemployment, austerity begins'
            };
        } else {
            return {
                period: 'Austerity & Brexit Era',
                structure: 'Service economy under pressure from austerity and EU referendum',
                industries: 'Agriculture (1%), Manufacturing (12%), Services (87%)',
                social: 'Austerity policies, Brexit referendum, political fragmentation, economic uncertainty'
            };
        }
    }
    
    addEconomicStructure() {
        // Create economic structure visualization under the main chart - using Scene 1 template
        const breakdownHeight = 80;
        const breakdownY = this.height - 20;  // Using Scene 1 positioning
        
        // Get the data range for the breakdown
        const availableYears = this.modernData.data
            .filter(d => d.population !== null || d.gdpReal !== null)
            .map(d => d.year);
        
        if (availableYears.length === 0) return;
        
        const actualStartYear = Math.min(...availableYears);
        const actualEndYear = Math.max(...availableYears);
        
        // Use the same X-scale as the main chart to ensure proper alignment
        const xScale = this.xScale || d3.scaleLinear()
            .domain([actualStartYear - 10, Math.max(actualEndYear + 10, 2016)])
            .range([0, this.width]);
        
        // Store xScale for industry breakdown to use same scale
        this.xScale = xScale;
        
        // Create a single fluid industry visualization - taller and more detailed
        const fluidHeight = 60;  // 50% taller
        
        // Create time-based data points - every 5 years for stable tooltips
        const timePoints = [];
        for (let year = actualStartYear; year <= actualEndYear; year += 5) {
            timePoints.push({
                year: year,
                agriculture: this.getIndustryPercentage(year, 'agriculture'),
                manufacturing: this.getIndustryPercentage(year, 'manufacturing'),
                services: this.getIndustryPercentage(year, 'services')
            });
        }
        
        // Add final year if not included
        if ((actualEndYear - actualStartYear) % 5 !== 0) {
            const finalYear = actualEndYear;
            timePoints.push({
                year: finalYear,
                agriculture: this.getIndustryPercentage(finalYear, 'agriculture'),
                manufacturing: this.getIndustryPercentage(finalYear, 'manufacturing'),
                services: this.getIndustryPercentage(finalYear, 'services')
            });
        }
        
        // Create stacked area chart using D3's stack generator
        const stack = d3.stack()
            .keys(['agriculture', 'manufacturing', 'services']);
        
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
        
        // Draw each industry layer with consistent colors from Scene 1
        const industryNames = ['agriculture', 'manufacturing', 'services'];
        const industryColors = ['#8B4513', '#4682B4', '#9370DB'];  // Brown, Steel Blue, Medium Purple
        const industryFullNames = ['Agriculture', 'Manufacturing', 'Services & Technology'];
        
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
            .attr('x1', 0)
            .attr('y1', breakdownY)
            .attr('x2', 0)
            .attr('y2', breakdownY + fluidHeight)
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .style('opacity', 0);
        
        // Mouse tracking for tooltips
        overlay
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
                    manufacturing: closestData.manufacturing,
                    services: closestData.services
                }, industryColors, industryFullNames);
            })
            .on('mouseout', () => {
                trackingLine.style('opacity', 0);
                this.hideTooltip();
            });
        
        // Add legend
        this.addIndustryLegend(breakdownY + fluidHeight + 20);
    }
    
    getIndustryPercentage(year, industry) {
        // Modern Service Economy period industry evolution (1950-2016)
        const progress = (year - 1950) / (2016 - 1950); // 0 to 1
        
        switch (industry) {
            case 'agriculture':
                return Math.max(1, 5 - (progress * 4)); // 5% → 1%
            case 'manufacturing':
                return Math.max(12, 45 - (progress * 33)); // 45% → 12%
            case 'services':
                return Math.min(87, 50 + (progress * 37)); // 50% → 87%
            default:
                return 0;
        }
    }
    
    addIndustryLegend(startY) {
        const industries = [
            { name: 'Agriculture', color: '#8B4513' },
            { name: 'Manufacturing', color: '#4682B4' },
            { name: 'Services & Technology', color: '#9370DB' }
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
    
    showEventStory(event) {
        const tooltip = d3.select('body').selectAll('.event-story-tooltip')
            .data([0])
            .join('div')
            .attr('class', 'event-story-tooltip tooltip')
            .style('position', 'fixed')
            .style('top', '50%')
            .style('left', '50%')
            .style('transform', 'translate(-50%, -50%)')
            .style('background', 'rgba(10,10,10,0.95)')
            .style('color', 'white')
            .style('padding', '24px')
            .style('border-radius', '12px')
            .style('font-size', '15px')
            .style('z-index', 1002)
            .style('box-shadow', '0 10px 30px rgba(0,0,0,0.5)')
            .style('border', `3px solid ${this.getEventColor(event.impact)}`)
            .style('max-width', '500px')
            .style('text-align', 'center');
        
        tooltip.html(`
            <div style="border-bottom: 2px solid ${this.getEventColor(event.impact)}; padding-bottom: 12px; margin-bottom: 16px;">
                <h2 style="color: ${this.getEventColor(event.impact)}; margin: 0; font-size: 24px;">${event.year}</h2>
                <h3 style="margin: 4px 0 0 0; color: #d4a574;">${event.event}</h3>
            </div>
            <div style="text-align: left; line-height: 1.6; margin-bottom: 16px;">
                <p>${event.story}</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px; margin-bottom: 16px; text-align: left;">
                <strong style="color: #FFB74D;">Economic Impact:</strong><br/>
                ${event.economicEffect}
            </div>

        `)
        .style('opacity', 0)
        .transition()
        .duration(400)
        .style('opacity', 1);
        
        d3.select('body').on('keydown.event-story', (e) => {
            if (e.key === 'Escape') {
                tooltip.remove();
                d3.select('body').on('keydown.event-story', null);
            }
        });
    }
    
    showIndustryBreakdownTooltip(event, data, colors, names) {
        const tooltip = d3.select('body').selectAll('.industry-breakdown-tooltip')
            .data([0])
            .join('div')
            .attr('class', 'industry-breakdown-tooltip tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', 1000)
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
            .style('border', '1px solid #333')
            .style('min-width', '200px');
        
        const displayYear = data.mouseYear || data.year;
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 8px; color: #d4a574;">Economic Structure - ${displayYear}</div>`;
        
        // Show data source year if different from mouse year
        if (data.mouseYear && data.mouseYear !== data.year) {
            tooltipContent += `<div style="font-size: 11px; margin-bottom: 8px; opacity: 0.8; color: #ccc;">Data from ${data.year}</div>`;
        }
        
        // Add each industry with its color and percentage
        tooltipContent += `<div style="margin-bottom: 4px;">`;
        tooltipContent += `<span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[0]}; margin-right: 8px;"></span>`;
        tooltipContent += `<strong>${names[0]}:</strong> ${data.agriculture.toFixed(1)}%</div>`;
        
        tooltipContent += `<div style="margin-bottom: 4px;">`;
        tooltipContent += `<span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[1]}; margin-right: 8px;"></span>`;
        tooltipContent += `<strong>${names[1]}:</strong> ${data.manufacturing.toFixed(1)}%</div>`;
        
        tooltipContent += `<div style="margin-bottom: 8px;">`;
        tooltipContent += `<span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[2]}; margin-right: 8px;"></span>`;
        tooltipContent += `<strong>${names[2]}:</strong> ${data.services.toFixed(1)}%</div>`;
        
        // Add total verification
        const total = data.agriculture + data.manufacturing + data.services;
        tooltipContent += `<div style="border-top: 1px solid #444; padding-top: 4px; font-size: 11px; opacity: 0.8;">`;
        tooltipContent += `Total: ${total.toFixed(1)}%</div>`;
        
        tooltip.html(tooltipContent)
            .style('left', Math.min(event.pageX + 15, window.innerWidth - 220) + 'px')
            .style('top', Math.max(event.pageY - 10, 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(150)
            .style('opacity', 1);
    }
    
    hideTooltip() {
        d3.select('body').selectAll('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
    }
    
    renderStagnationStory() {
        this.sceneGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#666')
            .text('Modern Service Economy data is being processed...');
    }
    
    exit() {
        console.log('🔄 Scene 5 - Exit called');
        return new Promise((resolve) => {
            this.sceneGroup.selectAll('*')
                .transition()
                .duration(500)
                .style('opacity', 0)
                .on('end', resolve);
        });
    }
}