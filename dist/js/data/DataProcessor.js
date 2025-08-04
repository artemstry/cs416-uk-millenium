/**
 * UK Millennium Data Processor
 * Handles loading and processing of Bank of England millennium dataset
 */

export class MillenniumDataProcessor {
    constructor() {
        this.rawData = null;
        this.processedData = null;
        this.keyIndicators = {
            // Real GDP of England at market prices (2013 prices) - actual values in £mn
            gdpReal: 'Real GDP of England at market prices',
            // Population data
            population: 'Population (GB+NI)',
            populationEngland: 'Population (England)',
            // Price and wage data
            cpi: 'Consumer price index',
            wages: 'Real consumption wages',
            // Government and finance
            govSpending: 'Public sector Total Managed Expenditure.1',
            publicDebt: 'UK Public sector debt.1',
            interestRates: 'Bank Rate',
            // Trade
            tradeBalance: 'Trade deficit.1',
            // Modern indicators (available later)
            unemployment: 'Unemployment rate',
            housePrice: 'House price index'
        };
        
        console.log('🔍 Key indicators mapped:', this.keyIndicators);
        
        // Define our narrative periods
        this.periods = {
            medieval: { start: 1209, end: 1500, name: 'Medieval Times' },
            awakening: { start: 1500, end: 1750, name: 'Great Awakening' },
            industrial: { start: 1750, end: 1900, name: 'Industrial Explosion' },
            crisis: { start: 1900, end: 1950, name: 'Crisis & Transformation' },
            modern: { start: 1950, end: 2016, name: 'Modern Service Economy' }
        };
    }
    
    async loadData() {
        try {
            console.log('📊 Loading UK Millennium Dataset...');
            
            // Load the headlines CSV file
            const csvData = await d3.csv('src/data/raw/millenniumofdata_v3_headlines.csv');
            
            console.log(`✅ Loaded ${csvData.length} rows of data`);
            console.log('📋 Available columns:', Object.keys(csvData[0]));
            
            this.rawData = csvData;
            this.processedData = this.processRawData();
            
            return this.processedData;
            
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            throw new Error(`Data loading failed: ${error.message}`);
        }
    }
    
    processRawData() {
        console.log('🔄 Processing raw data...');
        console.log('📋 First few rows of raw data:', this.rawData.slice(0, 3));
        console.log('📋 Available columns:', Object.keys(this.rawData[0]));
        
        // Convert strings to numbers and handle missing values
        const processed = this.rawData.map((row, index) => {
            const year = parseInt(row['Description']); // First column is actually year
            if (isNaN(year)) {
                if (index < 5) console.log(`⚠️ Skipping non-year row ${index}:`, row['Description']);
                return null; // Skip non-year rows
            }
            
            const processedRow = { year };
            
            // Process each indicator
            Object.entries(this.keyIndicators).forEach(([key, columnName]) => {
                const rawValue = row[columnName];
                const value = this.parseValue(rawValue);
                processedRow[key] = value;
                
                // Debug logging for population specifically
                if (key === 'population' && year >= 1209 && year <= 1220) {
                    console.log(`📊 Year ${year} population: raw="${rawValue}" parsed="${value}"`);
                }
                
                // Debug logging for population in early years
                if (key === 'population' && year >= 1209 && year <= 1250) {
                    console.log(`📊 Year ${year} population: raw="${rawValue}" parsed="${value}"`);
                }
            });
            
            return processedRow;
        }).filter(row => row !== null && row.year >= 1209 && row.year <= 2016);
        
        console.log(`🎯 Processed ${processed.length} years of data (${processed[0]?.year}-${processed[processed.length-1]?.year})`);
        
        // Check medieval period data specifically
        const medievalData = processed.filter(d => d.year >= 1209 && d.year <= 1500);
        const populationData = medievalData.filter(d => d.population !== null);
        console.log(`🏰 Medieval period: ${medievalData.length} years, ${populationData.length} with population data`);
        if (populationData.length > 0) {
            console.log(`📈 Sample population data:`, populationData.slice(0, 5));
        }
        
        // Calculate derived metrics and identify change points
        const enriched = this.enrichData(processed);
        
        // Segment data by periods
        const segmented = this.segmentByPeriods(enriched);
        
        return {
            raw: processed,
            enriched: enriched,
            periods: segmented,
            summary: this.generateDataSummary(enriched)
        };
    }
    
    parseValue(str) {
        if (!str || str === '' || str === 'n/a') return null;
        const num = parseFloat(str);
        return isNaN(num) ? null : num;
    }
    
    enrichData(data) {
        console.log('🔬 Enriching data with calculated metrics...');
        
        // Calculate growth rates for key indicators
        const enriched = data.map((row, index) => {
            const enrichedRow = { ...row };
            
            if (index > 0) {
                const prevRow = data[index - 1];
                
                // GDP growth rate (where data exists)
                if (row.gdpReal && prevRow.gdpReal) {
                    enrichedRow.gdpGrowthRate = ((row.gdpReal - prevRow.gdpReal) / prevRow.gdpReal) * 100;
                }
                
                // Population growth rate
                if (row.population && prevRow.population) {
                    enrichedRow.populationGrowthRate = ((row.population - prevRow.population) / prevRow.population) * 100;
                }
                
                // Inflation rate (CPI change)
                if (row.cpi && prevRow.cpi) {
                    enrichedRow.inflationRate = ((row.cpi - prevRow.cpi) / prevRow.cpi) * 100;
                }
            }
            
            // Add period classification
            enrichedRow.period = this.classifyPeriod(row.year);
            
            return enrichedRow;
        });
        
        // Identify dramatic change points
        const changePoints = this.identifyChangePoints(enriched);
        enriched.forEach(row => {
            row.changePoint = changePoints.find(cp => cp.year === row.year) || null;
        });
        
        return enriched;
    }
    
    classifyPeriod(year) {
        for (const [key, period] of Object.entries(this.periods)) {
            if (year >= period.start && year <= period.end) {
                return { key, ...period };
            }
        }
        return { key: 'other', name: 'Other', start: year, end: year };
    }
    
    identifyChangePoints(data) {
        const changePoints = [];
        
        // Look for GDP acceleration points
        const gdpData = data.filter(d => d.gdpReal && d.gdpGrowthRate);
        
        // Simple change point detection - look for periods where growth rate doubles
        for (let i = 20; i < gdpData.length - 20; i++) {
            const window = 10;
            const beforeAvg = d3.mean(gdpData.slice(i - window, i), d => d.gdpGrowthRate);
            const afterAvg = d3.mean(gdpData.slice(i, i + window), d => d.gdpGrowthRate);
            
            if (afterAvg > beforeAvg * 1.5 && beforeAvg > 0) {
                changePoints.push({
                    year: gdpData[i].year,
                    type: 'growth_acceleration',
                    magnitude: afterAvg / beforeAvg,
                    description: `GDP growth accelerated from ${beforeAvg.toFixed(1)}% to ${afterAvg.toFixed(1)}%`
                });
            }
        }
        
        // Add known historical change points
        const historicalChangePoints = [
            { year: 1348, type: 'crisis', description: 'Black Death pandemic' },
            { year: 1694, type: 'innovation', description: 'Bank of England founded' },
            { year: 1750, type: 'transformation', description: 'Industrial Revolution begins' },
            { year: 1914, type: 'crisis', description: 'World War I begins' },
            { year: 1929, type: 'crisis', description: 'Great Depression begins' },
            { year: 1971, type: 'transformation', description: 'End of Bretton Woods system' },
            { year: 2008, type: 'crisis', description: 'Global Financial Crisis' }
        ];
        
        changePoints.push(...historicalChangePoints);
        
        return changePoints.sort((a, b) => a.year - b.year);
    }
    
    segmentByPeriods(data) {
        const segmented = {};
        
        Object.entries(this.periods).forEach(([key, period]) => {
            segmented[key] = {
                ...period,
                data: data.filter(d => d.year >= period.start && d.year <= period.end),
                changePoints: data.filter(d => d.changePoint && d.year >= period.start && d.year <= period.end)
                                  .map(d => d.changePoint)
            };
            
            // Calculate period statistics
            const periodData = segmented[key].data;
            if (periodData.length > 0) {
                segmented[key].stats = {
                    years: periodData.length,
                    dataQuality: this.assessDataQuality(periodData),
                    availableIndicators: this.getAvailableIndicators(periodData),
                    keyTrends: this.calculatePeriodTrends(periodData)
                };
            }
        });
        
        return segmented;
    }
    
    assessDataQuality(periodData) {
        const indicators = Object.keys(this.keyIndicators);
        const availabilityScores = indicators.map(indicator => {
            const nonNullCount = periodData.filter(d => d[indicator] !== null).length;
            return nonNullCount / periodData.length;
        });
        
        const avgAvailability = d3.mean(availabilityScores);
        
        if (avgAvailability > 0.8) return 'high';
        if (avgAvailability > 0.4) return 'medium';
        return 'low';
    }
    
    getAvailableIndicators(periodData) {
        const indicators = Object.keys(this.keyIndicators);
        return indicators.filter(indicator => {
            const nonNullCount = periodData.filter(d => d[indicator] !== null).length;
            return nonNullCount > 0;
        });
    }
    
    calculatePeriodTrends(periodData) {
        const trends = {};
        
        // GDP trend (if available)
        const gdpData = periodData.filter(d => d.gdpReal);
        if (gdpData.length > 10) {
            const firstYear = gdpData[0];
            const lastYear = gdpData[gdpData.length - 1];
            const totalGrowth = ((lastYear.gdpReal - firstYear.gdpReal) / firstYear.gdpReal) * 100;
            const annualGrowth = Math.pow(lastYear.gdpReal / firstYear.gdpReal, 1 / (lastYear.year - firstYear.year)) - 1;
            
            trends.gdp = {
                totalGrowth: totalGrowth,
                annualGrowth: annualGrowth * 100,
                startValue: firstYear.gdpReal,
                endValue: lastYear.gdpReal,
                multiplier: lastYear.gdpReal / firstYear.gdpReal
            };
        }
        
        // Population trend
        const popData = periodData.filter(d => d.population);
        if (popData.length > 5) {
            const firstYear = popData[0];
            const lastYear = popData[popData.length - 1];
            const totalGrowth = ((lastYear.population - firstYear.population) / firstYear.population) * 100;
            
            trends.population = {
                totalGrowth: totalGrowth,
                startValue: firstYear.population,
                endValue: lastYear.population,
                multiplier: lastYear.population / firstYear.population
            };
        }
        
        return trends;
    }
    
    generateDataSummary(data) {
        const summary = {
            totalYears: data.length,
            yearRange: [data[0].year, data[data.length - 1].year],
            indicators: Object.keys(this.keyIndicators),
            periods: Object.keys(this.periods),
            dramaticChanges: []
        };
        
        // Find the most dramatic changes
        const gdpData = data.filter(d => d.gdpReal);
        if (gdpData.length > 0) {
            const firstGDP = gdpData[0].gdpReal;
            const lastGDP = gdpData[gdpData.length - 1].gdpReal;
            summary.dramaticChanges.push({
                indicator: 'GDP',
                multiplier: lastGDP / firstGDP,
                description: `Real GDP grew ${Math.round(lastGDP / firstGDP).toLocaleString()}x from ${gdpData[0].year} to ${gdpData[gdpData.length - 1].year}`
            });
        }
        
        const popData = data.filter(d => d.population);
        if (popData.length > 0) {
            const firstPop = popData[0].population;
            const lastPop = popData[popData.length - 1].population;
            summary.dramaticChanges.push({
                indicator: 'Population',
                multiplier: lastPop / firstPop,
                description: `Population grew ${Math.round(lastPop / firstPop)}x from ${popData[0].year} to ${popData[popData.length - 1].year}`
            });
        }
        
        return summary;
    }
    
    // Utility methods for visualizations
    getDataForPeriod(periodKey, indicators = null) {
        if (!this.processedData || !this.processedData.periods[periodKey]) {
            return null;
        }
        
        const periodData = this.processedData.periods[periodKey].data;
        
        if (!indicators) {
            return periodData;
        }
        
        // Filter to only requested indicators
        return periodData.map(d => {
            const filtered = { year: d.year };
            indicators.forEach(indicator => {
                filtered[indicator] = d[indicator];
            });
            return filtered;
        });
    }
    
    getTimeSeriesForIndicator(indicator, startYear = null, endYear = null) {
        if (!this.processedData) return null;
        
        let data = this.processedData.enriched.filter(d => d[indicator] !== null);
        
        if (startYear) {
            data = data.filter(d => d.year >= startYear);
        }
        
        if (endYear) {
            data = data.filter(d => d.year <= endYear);
        }
        
        return data.map(d => ({ year: d.year, value: d[indicator] }));
    }
}

// Export singleton instance
export const dataProcessor = new MillenniumDataProcessor();