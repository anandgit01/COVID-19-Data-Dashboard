document.addEventListener('DOMContentLoaded', async () => {
    const totalCasesEl = document.getElementById('total-cases');
    const totalDeathsEl = document.getElementById('total-deaths');
    const totalRecoveriesEl = document.getElementById('total-recoveries');
    const countrySelectEl = document.getElementById('country-select');
    const countryCasesEl = document.getElementById('country-cases');
    const countryDeathsEl = document.getElementById('country-deaths');
    const countryRecoveriesEl = document.getElementById('country-recoveries');
    const trendsChartCtx = document.getElementById('trends-chart').getContext('2d');
  
    const fetchData = async (url) => {
      const response = await fetch(url);
      return response.json();
    };
  
    const globalData = await fetchData('https://disease.sh/v3/covid-19/all');
    totalCasesEl.textContent = globalData.cases.toLocaleString();
    totalDeathsEl.textContent = globalData.deaths.toLocaleString();
    totalRecoveriesEl.textContent = globalData.recovered.toLocaleString();
  
    const countriesData = await fetchData('https://disease.sh/v3/covid-19/countries');
    countriesData.forEach(country => {
      const option = document.createElement('option');
      option.value = country.countryInfo.iso2;
      option.textContent = country.country;
      countrySelectEl.appendChild(option);
    });
  
    const updateCountryData = async (countryCode) => {
      const countryData = await fetchData(`https://disease.sh/v3/covid-19/countries/${countryCode}`);
      countryCasesEl.textContent = countryData.cases.toLocaleString();
      countryDeathsEl.textContent = countryData.deaths.toLocaleString();
      countryRecoveriesEl.textContent = countryData.recovered.toLocaleString();
  
      const historicalData = await fetchData(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=30`);
      const dates = Object.keys(historicalData.timeline.cases);
      const cases = Object.values(historicalData.timeline.cases);
      const deaths = Object.values(historicalData.timeline.deaths);
      const recoveries = Object.values(historicalData.timeline.recovered);
  
      new Chart(trendsChartCtx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            { label: 'Cases', data: cases, borderColor: 'blue', fill: false },
            { label: 'Deaths', data: deaths, borderColor: 'red', fill: false },
            { label: 'Recoveries', data: recoveries, borderColor: 'green', fill: false },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    };
  
    countrySelectEl.addEventListener('change', (event) => {
      updateCountryData(event.target.value);
    });
  
    // Initialize with the first country
    updateCountryData(countriesData[0].countryInfo.iso2);
  });
  